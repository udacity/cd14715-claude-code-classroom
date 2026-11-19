/**
 * Exercise: Claude Skills - JavaScript Code Reviewer
 *
 * Tests for the JS code reviewer using the js-code-review skill
 * with structured output for type-safe results.
 */

import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { reviewJavaScriptFile } from "./js-reviewer.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// -----------------------------------------------------------------------------
// Test case: Review file with issues
// -----------------------------------------------------------------------------

async function reviewCodeWithIssues() {
  console.log("\n" + "=".repeat(60));
  console.log("Test: Review File with Issues");
  console.log("=".repeat(60));

  const filePath = path.join(__dirname, "sample-code", "issues.js");
  console.log(`\nReviewing: ${filePath}\n`);

  const result = await reviewJavaScriptFile(filePath);

  // Display structured results
  console.log(`File: ${result.filename}`);
  console.log(`Score: ${result.score}/100`);
  console.log(`\nSummary: ${result.summary}`);

  console.log(`\nIssues Found (${result.issues.length}):`);
  for (const issue of result.issues) {
    const severityIcon =
      issue.severity === "error" ? "🔴" :
      issue.severity === "warning" ? "🟡" : "🔵";
    console.log(`  ${severityIcon} Line ${issue.line} [${issue.category}]: ${issue.message}`);
    console.log(`     → ${issue.suggestion}`);
  }

  console.log(`\nRecommendations:`);
  for (const rec of result.recommendations) {
    console.log(`  • ${rec}`);
  }
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  EXERCISE: Claude Skills - JavaScript Code Reviewer");
  console.log("  Combines Skills (L08) + Structured Outputs (L07)");
  console.log("=".repeat(60));

  await reviewCodeWithIssues();

  console.log("\n" + "=".repeat(60));
  console.log("Exercise complete!");
  console.log("=".repeat(60));
}

main().catch(console.error);
