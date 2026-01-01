/**
 * Exercise: MCP Integration - Code Quality Reviewer
 *
 * Tests for the code reviewer using ESLint MCP.
 */

import "dotenv/config";
import { reviewCodeQuality, CodeQualityReport } from "./code-reviewer.js";
import { codeSamples } from "./sample-code.js";

// -----------------------------------------------------------------------------
// Step 1: Explain the code review scenario
// -----------------------------------------------------------------------------

function step1_explainScenario() {
  console.log("\n--- STEP 1: Code Quality Review Scenario ---\n");

  console.log("Problem: Manual code reviews are inconsistent");
  console.log("  - Different reviewers, different standards");
  console.log("  - Time-consuming for large PRs");
  console.log("  - Easy to miss issues");

  console.log("\nSolution: Automated ESLint MCP integration");
  console.log("  - Consistent linting rules");
  console.log("  - Instant feedback");
  console.log("  - Categorized issues with fixes");

  console.log("\nQuality Score Calculation:");
  console.log("  - Start at 100");
  console.log("  - -10 per error");
  console.log("  - -5 per warning");
  console.log("  - -2 per info");

  console.log("\n-> ESLint MCP enables automated code quality checks!");
}

// -----------------------------------------------------------------------------
// Step 2: Review clean code
// -----------------------------------------------------------------------------

async function step2_reviewCleanCode() {
  console.log("\n--- STEP 2: Review Clean Code ---\n");

  const sample = codeSamples[0];
  console.log(`File: ${sample.filename}`);
  console.log(`Code:\n${sample.code}`);

  try {
    const report = await reviewCodeQuality(sample.code, sample.filename);
    printReport(report);
    console.log(`Expected score range: ${sample.expectedScoreRange[0]}-${sample.expectedScoreRange[1]}`);
  } catch (error) {
    console.log(`Error: ${(error as Error).message}`);
    console.log("Simulating expected output...\n");
    printMockReport(sample.filename, 95, 0, 0, 0);
  }

  console.log("\n-> Clean code gets high quality scores!");
}

// -----------------------------------------------------------------------------
// Step 3: Review code with issues
// -----------------------------------------------------------------------------

async function step3_reviewBadCode() {
  console.log("\n--- STEP 3: Review Code with Issues ---\n");

  const sample = codeSamples[2]; // Best practice violations
  console.log(`File: ${sample.filename}`);
  console.log(`Code:\n${sample.code}`);

  try {
    const report = await reviewCodeQuality(sample.code, sample.filename);
    printReport(report);
    console.log(`Expected issues: ${sample.expectedIssues.join(", ")}`);
  } catch (error) {
    console.log(`Error: ${(error as Error).message}`);
    console.log("Simulating expected output...\n");
    printMockReport(sample.filename, 45, 3, 2, 1);
  }

  console.log("\n-> Issues are categorized and fixes suggested!");
}

// -----------------------------------------------------------------------------
// Step 4: Review multiple code samples
// -----------------------------------------------------------------------------

async function step4_reviewMultiple() {
  console.log("\n--- STEP 4: Review Multiple Samples ---\n");

  for (const sample of codeSamples) {
    console.log(`\n${sample.name} (${sample.filename}):`);

    try {
      const report = await reviewCodeQuality(sample.code, sample.filename);
      console.log(`  Score: ${report.qualityScore}/100`);
      console.log(`  Issues: ${report.summary.totalIssues} (${report.summary.errors} errors, ${report.summary.warnings} warnings)`);
      console.log(`  Expected range: ${sample.expectedScoreRange[0]}-${sample.expectedScoreRange[1]}`);
    } catch (error) {
      console.log(`  Error: ${(error as Error).message}`);
    }
  }

  console.log("\n-> Consistent scoring across different code quality levels!");
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

function printMockReport(
  filename: string,
  score: number,
  errors: number,
  warnings: number,
  infos: number
) {
  const mockReport: CodeQualityReport = {
    filename,
    qualityScore: score,
    issues: [],
    summary: {
      totalIssues: errors + warnings + infos,
      errors,
      warnings,
      infos,
    },
    categories: {
      formatting: Math.floor((errors + warnings) / 2),
      bestPractices: Math.ceil((errors + warnings) / 2),
      potentialBugs: infos,
      other: 0,
    },
    recommendations: [
      "Review and fix all linting errors",
      "Consider using const instead of var",
      "Remove unused variables",
    ],
  };
  printReport(mockReport);
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  EXERCISE: MCP Integration - Code Quality Reviewer");
  console.log("  Analyze code using ESLint MCP server");
  console.log("=".repeat(60));

  step1_explainScenario();
  await step2_reviewCleanCode();
  await step3_reviewBadCode();
  await step4_reviewMultiple();

  console.log("\n" + "=".repeat(60));
  console.log("  KEY TAKEAWAYS");
  console.log("=".repeat(60));
  console.log(`
  DELIVERABLE: code-reviewer.ts
  - Exports: reviewCodeQuality() function
  - Exports: CodeQualityReport type
  - Uses ESLint MCP for linting analysis

  ESLINT MCP INTEGRATION:
  • Package: @eslint/mcp@latest
  • Tool: mcp__eslint__lint
  • Returns: violations with rule, line, severity

  QUALITY REPORT INCLUDES:
  - Quality score (0-100)
  - Issues with line numbers and fixes
  - Category breakdown
  - Actionable recommendations

  USE CASES:
  - CI/CD pipeline integration
  - Pre-commit hooks
  - Pull request reviews
  - IDE AI assistants
`);
}

main().catch(console.error);
