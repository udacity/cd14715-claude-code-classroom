/**
 * Sentiment Agent Evaluators
 *
 * TODO: Implement three evaluators to assess agent performance:
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
// TODO: Evaluator 1 - Tool Call Evaluator
// Checks if the agent called the sentiment analysis tool correctly
// -----------------------------------------------------------------------------

export function evaluateToolCall(trace: AgentTrace): EvaluatorResult {
  const expectedTool = "mcp__sentiment-analyzer__analyze_sentiment";
  const toolCalls = trace.toolCalls;

  // TODO: Step 1 - Check if any tool was called

  // TODO: Step 2 - Check if the correct tool was called

  // TODO: Step 3 - Check if text parameter was provided

  // TODO: Step 4 - Return success if all checks pass

  return {
    name: "Tool Call Evaluator",
    passed: false,
    score: 0,
    details: "Not implemented",
  };
}

// -----------------------------------------------------------------------------
// TODO: Evaluator 2 - Schema Validity Evaluator
// Checks if the output conforms to the SentimentAnalysis Zod schema
// -----------------------------------------------------------------------------

export function evaluateSchemaValidity(trace: AgentTrace): EvaluatorResult {
  const result = trace.result;

  // TODO: Step 1 - Check if result exists

  // TODO: Step 2 - Validate against Zod schema

  // TODO: Step 3 - Check all required fields are valid

  // TODO: Step 4 - Return success if all fields valid

  return {
    name: "Schema Validity Evaluator",
    passed: false,
    score: 0,
    details: "Not implemented",
  };
}

// -----------------------------------------------------------------------------
// TODO: Evaluator 3 - Accuracy Evaluator
// Checks if the detected sentiment matches the expected sentiment
// -----------------------------------------------------------------------------

export function evaluateAccuracy(
  trace: AgentTrace,
  testCase: SentimentTestCase
): EvaluatorResult {
  const result = trace.result;

  // TODO: Step 1 - Check if result exists
  // If !result, return failed result with score 0

  // TODO: Step 2 - Compare actual vs expected sentiment

  // TODO: Step 3 - Return appropriate result based on match

  return {
    name: "Accuracy Evaluator",
    passed: false,
    score: 0,
    details: "Not implemented",
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
