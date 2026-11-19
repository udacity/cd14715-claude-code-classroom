/**
 * Sentiment Agent Evaluators
 *
 * Three evaluators to assess agent performance:
 * 1. Tool Call Evaluator - Did the agent call the correct tool?
 * 2. Schema Validity Evaluator - Is the output valid against the Zod schema?
 * 3. Accuracy Evaluator - Does the sentiment match the expected value?
 */

import { SentimentAnalysisSchema, type SentimentAnalysis, type SentimentTestCase } from "../types.js";
import type { AgentTrace } from "../sentiment-agent.js";

// -----------------------------------------------------------------------------
// Evaluator Result Types
// -----------------------------------------------------------------------------

export interface EvaluatorResult {
  name: string;
  passed: boolean;
  score: number; // 0 to 1
  details: string;
}

export interface EvaluationReport {
  testCase: SentimentTestCase;
  evaluators: EvaluatorResult[];
  overallPassed: boolean;
  overallScore: number;
}

// -----------------------------------------------------------------------------
// Evaluator 1: Tool Call Evaluator
// Checks if the agent called the sentiment analysis tool correctly
// -----------------------------------------------------------------------------

export function evaluateToolCall(trace: AgentTrace): EvaluatorResult {
  const expectedTool = "mcp__sentiment-analyzer__analyze_sentiment";
  const toolCalls = trace.toolCalls;

  // Check if any tool was called
  if (toolCalls.length === 0) {
    return {
      name: "Tool Call Evaluator",
      passed: false,
      score: 0,
      details: "No tool calls were made",
    };
  }

  // Check if the correct tool was called
  const correctToolCalled = toolCalls.some(call => call.name === expectedTool);
  if (!correctToolCalled) {
    return {
      name: "Tool Call Evaluator",
      passed: false,
      score: 0.25,
      details: `Expected tool '${expectedTool}' was not called. Called: ${toolCalls.map(c => c.name).join(", ")}`,
    };
  }

  // Check if text parameter was provided
  const sentimentCall = toolCalls.find(call => call.name === expectedTool);
  const hasTextInput = sentimentCall?.input && typeof sentimentCall.input.text === "string";

  if (!hasTextInput) {
    return {
      name: "Tool Call Evaluator",
      passed: false,
      score: 0.5,
      details: "Tool was called but 'text' parameter was missing or invalid",
    };
  }

  return {
    name: "Tool Call Evaluator",
    passed: true,
    score: 1,
    details: `Correctly called '${expectedTool}' with text parameter`,
  };
}

// -----------------------------------------------------------------------------
// Evaluator 2: Schema Validity Evaluator
// Checks if the output conforms to the SentimentAnalysis Zod schema
// -----------------------------------------------------------------------------

export function evaluateSchemaValidity(trace: AgentTrace): EvaluatorResult {
  const result = trace.result;

  // Check if result exists
  if (!result) {
    return {
      name: "Schema Validity Evaluator",
      passed: false,
      score: 0,
      details: "No result was returned from the agent",
    };
  }

  // Validate against Zod schema
  const validation = SentimentAnalysisSchema.safeParse(result);

  if (!validation.success) {
    const errors = validation.error.errors.map(e => `${e.path.join(".")}: ${e.message}`);
    return {
      name: "Schema Validity Evaluator",
      passed: false,
      score: 0.5,
      details: `Schema validation failed: ${errors.join("; ")}`,
    };
  }

  // Check all required fields are present and valid
  const checks = [
    { field: "text", valid: typeof result.text === "string" && result.text.length > 0 },
    { field: "sentiment", valid: ["positive", "negative", "neutral"].includes(result.sentiment) },
    { field: "confidence", valid: result.confidence >= 0 && result.confidence <= 1 },
    { field: "keywords", valid: Array.isArray(result.keywords) },
    { field: "explanation", valid: typeof result.explanation === "string" && result.explanation.length > 0 },
  ];

  const passedChecks = checks.filter(c => c.valid).length;
  const score = passedChecks / checks.length;

  if (score < 1) {
    const failedFields = checks.filter(c => !c.valid).map(c => c.field);
    return {
      name: "Schema Validity Evaluator",
      passed: false,
      score,
      details: `Some fields are invalid: ${failedFields.join(", ")}`,
    };
  }

  return {
    name: "Schema Validity Evaluator",
    passed: true,
    score: 1,
    details: "All schema fields are valid",
  };
}

// -----------------------------------------------------------------------------
// Evaluator 3: Accuracy Evaluator
// Checks if the detected sentiment matches the expected sentiment
// -----------------------------------------------------------------------------

export function evaluateAccuracy(
  trace: AgentTrace,
  testCase: SentimentTestCase
): EvaluatorResult {
  const result = trace.result;

  if (!result) {
    return {
      name: "Accuracy Evaluator",
      passed: false,
      score: 0,
      details: "No result to evaluate",
    };
  }

  const actualSentiment = result.sentiment;
  const expectedSentiment = testCase.expectedSentiment;

  if (actualSentiment === expectedSentiment) {
    return {
      name: "Accuracy Evaluator",
      passed: true,
      score: 1,
      details: `Correctly classified as '${expectedSentiment}'`,
    };
  }

  // Partial credit for neutral when expecting positive/negative (closer than opposite)
  if (actualSentiment === "neutral") {
    return {
      name: "Accuracy Evaluator",
      passed: false,
      score: 0.5,
      details: `Expected '${expectedSentiment}' but got 'neutral'`,
    };
  }

  // No credit for opposite sentiment
  return {
    name: "Accuracy Evaluator",
    passed: false,
    score: 0,
    details: `Expected '${expectedSentiment}' but got '${actualSentiment}'`,
  };
}

// -----------------------------------------------------------------------------
// Run All Evaluators
// -----------------------------------------------------------------------------

export function runEvaluators(
  trace: AgentTrace,
  testCase: SentimentTestCase
): EvaluationReport {
  const evaluators: EvaluatorResult[] = [
    evaluateToolCall(trace),
    evaluateSchemaValidity(trace),
    evaluateAccuracy(trace, testCase),
  ];

  const overallPassed = evaluators.every(e => e.passed);
  const overallScore = evaluators.reduce((sum, e) => sum + e.score, 0) / evaluators.length;

  return {
    testCase,
    evaluators,
    overallPassed,
    overallScore,
  };
}
