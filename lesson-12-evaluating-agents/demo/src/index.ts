/**
 * Evaluating Agentic Systems Demo
 * Runs the tip calculator agent and evaluates its performance.
 */

import { analyzeTip } from "./tip-agent.js";
import { testCases } from "./types.js";
import { runEvaluators, type EvaluationReport } from "./evaluators/index.js";

async function main() {
  console.log("=== TIP CALCULATOR AGENT EVALUATION ===\n");

  const reports: EvaluationReport[] = [];

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.description}`);
    console.log(`Input: $${testCase.bill} bill, ${testCase.tip}% tip, ${testCase.split} person(s)`);
    console.log("-".repeat(50));

    try {
      // Run the agent
      const trace = await analyzeTip(testCase.bill, testCase.tip, testCase.split);

      // Display result
      if (trace.result) {
        console.log(`Tip Amount: $${trace.result.tipAmount}`);
        console.log(`Total: $${trace.result.totalAmount}`);
        console.log(`Per Person: $${trace.result.perPersonAmount}`);
        console.log(`Recommendation: ${trace.result.recommendation}`);
      }

      // Run evaluators
      const report = runEvaluators(trace, testCase);
      reports.push(report);

      // Display evaluator results
      console.log("\nEvaluator Results:");
      for (const evaluator of report.evaluators) {
        const status = evaluator.passed ? "PASS" : "FAIL";
        console.log(`  [${status}] ${evaluator.name}: ${evaluator.details}`);
      }
      console.log(`  Overall Score: ${(report.overallScore * 100).toFixed(0)}%`);
    } catch (error) {
      console.log(`Error: ${error instanceof Error ? error.message : "Unknown"}`);
    }

    console.log("\n");
  }

  // Summary
  console.log("=".repeat(50));
  console.log("EVALUATION SUMMARY");
  console.log("=".repeat(50));

  const totalTests = reports.length;
  const passedTests = reports.filter(r => r.overallPassed).length;
  const averageScore = reports.reduce((sum, r) => sum + r.overallScore, 0) / totalTests;

  console.log(`Tests Run: ${totalTests}`);
  console.log(`Tests Passed: ${passedTests}/${totalTests}`);
  console.log(`Average Score: ${(averageScore * 100).toFixed(0)}%`);

  // Per-evaluator breakdown
  console.log("\nPer-Evaluator Pass Rate:");
  const evaluatorNames = ["Tool Call Evaluator", "Schema Validity Evaluator", "Calculation Accuracy Evaluator"];
  for (const name of evaluatorNames) {
    const passed = reports.filter(r =>
      r.evaluators.find(e => e.name === name)?.passed
    ).length;
    console.log(`  ${name}: ${passed}/${totalTests}`);
  }
}

main().catch(console.error);
