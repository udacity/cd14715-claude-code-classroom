/**
 * Exercise: MCP Integration - Code Quality Reviewer
 *
 * Tests for the code reviewer using ESLint MCP.
 */

import "dotenv/config";
import { reviewCodeFile, CodeQualityReport } from "./code-reviewer.js";
import { CODE_FILES } from "./sample-code.js";

// -----------------------------------------------------------------------------
// Test case: Review code with issues
// -----------------------------------------------------------------------------

async function reviewCodeWithIssues() {
  const file = CODE_FILES.find((f) => f.id === "issues");
  if (!file) {
    throw new Error("File not found");
  }

  console.log(`Reviewing: ${file.name}`);
  console.log(`Path: ${file.path}\n`);

  const report = await reviewCodeFile(file.path);
  printReport(report);

  console.log(`\nExpected issues: ${file.expectedIssues.join(", ")}`);
}

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

function printReport(report: CodeQualityReport) {
  console.log("=".repeat(50));
  console.log("CODE QUALITY REPORT");
  console.log("=".repeat(50));

  console.log(`\nFile: ${report.filename}`);
  console.log(`Quality Score: ${report.qualityScore}/100\n`);

  console.log("SUMMARY:");
  console.log(`  Total Issues: ${report.summary.totalIssues}`);
  console.log(`  Errors: ${report.summary.errors}`);
  console.log(`  Warnings: ${report.summary.warnings}`);
  console.log(`  Infos: ${report.summary.infos}`);

  console.log("\nCATEGORIES:");
  console.log(`  Formatting: ${report.categories.formatting}`);
  console.log(`  Best Practices: ${report.categories.bestPractices}`);
  console.log(`  Potential Bugs: ${report.categories.potentialBugs}`);
  console.log(`  Other: ${report.categories.other}`);

  if (report.issues.length > 0) {
    console.log("\nISSUES:");
    report.issues.slice(0, 5).forEach((issue, i) => {
      console.log(`  ${i + 1}. Line ${issue.line}: [${issue.severity}] ${issue.rule}`);
      console.log(`     ${issue.message}`);
      console.log(`     Fix: ${issue.fix}`);
    });
    if (report.issues.length > 5) {
      console.log(`  ... and ${report.issues.length - 5} more`);
    }
  }

  console.log("\nRECOMMENDATIONS:");
  report.recommendations.forEach((rec, i) => {
    console.log(`  ${i + 1}. ${rec}`);
  });
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  EXERCISE: MCP Integration - Code Quality Reviewer");
  console.log("  Using ESLint MCP to analyze JavaScript files");
  console.log("=".repeat(60));

  await reviewCodeWithIssues();
}

main().catch(console.error);
