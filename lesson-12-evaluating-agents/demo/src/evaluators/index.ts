/**
 * Tip Calculator Agent Evaluators
 *
 * Three evaluators to assess agent performance:
 * 1. Tool Call Evaluator - Did the agent call the correct tool?
 * 2. Schema Validity Evaluator - Is the output valid against the Zod schema?
 * 3. Calculation Accuracy Evaluator - Are the calculations correct?
 */

import { TipAnalysisSchema, type TipAnalysis, type TipTestCase } from "../types.js";
import type { AgentTrace } from "../tip-agent.js";

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
  testCase: TipTestCase;
  evaluators: EvaluatorResult[];
  overallPassed: boolean;
  overallScore: number;
}

// -----------------------------------------------------------------------------
// Evaluator 1: Tool Call Evaluator
// Checks if the agent called the tip calculator tool correctly
// -----------------------------------------------------------------------------

export function evaluateToolCall(trace: AgentTrace, testCase: TipTestCase): EvaluatorResult {
  const expectedTool = "mcp__tip-calculator__calculate_tip";
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

  // Check if correct parameters were provided
  const tipCall = toolCalls.find(call => call.name === expectedTool);
  const input = tipCall?.input as { billAmount?: number; tipPercentage?: number; splitCount?: number } | undefined;

  if (!input?.billAmount || !input?.tipPercentage) {
    return {
      name: "Tool Call Evaluator",
      passed: false,
      score: 0.5,
      details: "Tool was called but required parameters (billAmount, tipPercentage) were missing",
    };
  }

  // Verify parameters match test case
  const billMatch = Math.abs(input.billAmount - testCase.bill) < 0.01;
  const tipMatch = Math.abs(input.tipPercentage - testCase.tip) < 0.01;

  if (!billMatch || !tipMatch) {
    return {
      name: "Tool Call Evaluator",
      passed: false,
      score: 0.75,
      details: `Parameters don't match: expected bill=$${testCase.bill}, tip=${testCase.tip}%, got bill=$${input.billAmount}, tip=${input.tipPercentage}%`,
    };
  }

  return {
    name: "Tool Call Evaluator",
    passed: true,
    score: 1,
    details: `Correctly called '${expectedTool}' with bill=$${input.billAmount}, tip=${input.tipPercentage}%`,
  };
}

// -----------------------------------------------------------------------------
// Evaluator 2: Schema Validity Evaluator
// Checks if the output conforms to the TipAnalysis Zod schema
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
  const validation = TipAnalysisSchema.safeParse(result);

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
    { field: "billAmount", valid: typeof result.billAmount === "number" && result.billAmount > 0 },
    { field: "tipPercentage", valid: typeof result.tipPercentage === "number" && result.tipPercentage >= 0 },
    { field: "tipAmount", valid: typeof result.tipAmount === "number" && result.tipAmount >= 0 },
    { field: "totalAmount", valid: typeof result.totalAmount === "number" && result.totalAmount > 0 },
    { field: "perPersonAmount", valid: typeof result.perPersonAmount === "number" && result.perPersonAmount > 0 },
    { field: "splitCount", valid: typeof result.splitCount === "number" && result.splitCount >= 1 },
    { field: "recommendation", valid: ["low", "standard", "generous"].includes(result.recommendation) },
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
// Evaluator 3: Calculation Accuracy Evaluator
// Checks if the tip calculations are mathematically correct
// -----------------------------------------------------------------------------

export function evaluateCalculationAccuracy(
  trace: AgentTrace,
  testCase: TipTestCase
): EvaluatorResult {
  const result = trace.result;

  if (!result) {
    return {
      name: "Calculation Accuracy Evaluator",
      passed: false,
      score: 0,
      details: "No result to evaluate",
    };
  }

  // Allow small floating point tolerance
  const tolerance = 0.02;

  const checks = [
    {
      field: "tipAmount",
      expected: testCase.expectedTip,
      actual: result.tipAmount,
      match: Math.abs(result.tipAmount - testCase.expectedTip) <= tolerance,
    },
    {
      field: "totalAmount",
      expected: testCase.expectedTotal,
      actual: result.totalAmount,
      match: Math.abs(result.totalAmount - testCase.expectedTotal) <= tolerance,
    },
    {
      field: "perPersonAmount",
      expected: testCase.expectedPerPerson,
      actual: result.perPersonAmount,
      match: Math.abs(result.perPersonAmount - testCase.expectedPerPerson) <= tolerance,
    },
  ];

  const passedChecks = checks.filter(c => c.match).length;
  const score = passedChecks / checks.length;

  if (score < 1) {
    const failedChecks = checks.filter(c => !c.match);
    const details = failedChecks
      .map(c => `${c.field}: expected $${c.expected}, got $${c.actual}`)
      .join("; ");
    return {
      name: "Calculation Accuracy Evaluator",
      passed: false,
      score,
      details: `Calculation errors: ${details}`,
    };
  }

  return {
    name: "Calculation Accuracy Evaluator",
    passed: true,
    score: 1,
    details: `All calculations correct: tip=$${result.tipAmount}, total=$${result.totalAmount}, perPerson=$${result.perPersonAmount}`,
  };
}

// -----------------------------------------------------------------------------
// Run All Evaluators
// -----------------------------------------------------------------------------

export function runEvaluators(
  trace: AgentTrace,
  testCase: TipTestCase
): EvaluationReport {
  const evaluators: EvaluatorResult[] = [
    evaluateToolCall(trace, testCase),
    evaluateSchemaValidity(trace),
    evaluateCalculationAccuracy(trace, testCase),
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
