/**
 * Demo: Claude Skills - Multi-Skill Email Analysis
 *
 * Demonstrates Claude discovering and using multiple skills:
 * - email-etiquette: Analyzes tone, structure, clarity
 * - communication-style: Identifies assertive/passive/aggressive patterns
 *
 * Shows how Claude autonomously selects relevant skills based on task.
 */

import "dotenv/config";
import { reviewEmail } from "./email-reviewer.js";
import { sampleEmails } from "./sample-emails.js";

// -----------------------------------------------------------------------------
// Test case: Review a casual email
// -----------------------------------------------------------------------------

async function reviewCasualEmail() {
  console.log("\n" + "=".repeat(60));
  console.log("Test: Review Casual Email");
  console.log("=".repeat(60));

  const email = sampleEmails.find((e) => e.expectedTone === "too-casual");
  if (!email) {
    throw new Error("No casual email found");
  }

  console.log(`\nInput Email:\n"${email.content.slice(0, 100)}..."\n`);

  const result = await reviewEmail(email.content);

  // Display structured results
  console.log(`Tone: ${result.overallTone}`);
  console.log(`Communication Style: ${result.communicationStyle}`);
  console.log(`Score: ${result.score}/100`);

  console.log(`\nIssues Found (${result.issues.length}):`);
  for (const issue of result.issues) {
    const severityIcon =
      issue.severity === "high" ? "🔴" :
      issue.severity === "medium" ? "🟡" : "🔵";
    console.log(`  ${severityIcon} [${issue.category}]: ${issue.description}`);
    console.log(`     → ${issue.suggestion}`);
  }

  console.log(`\nStrengths:`);
  for (const strength of result.strengths) {
    console.log(`  ✓ ${strength}`);
  }

  if (result.revisedEmail) {
    console.log(`\nRevised Email:`);
    console.log(`"${result.revisedEmail.slice(0, 200)}..."`);
  }
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  DEMO: Claude Skills - Multi-Skill Email Analysis");
  console.log("  Skills: email-etiquette, communication-style");
  console.log("  Combines Skills (L08) + Structured Outputs (L07)");
  console.log("=".repeat(60));

  await reviewCasualEmail();

  console.log("\n" + "=".repeat(60));
  console.log("Demo complete!");
  console.log("=".repeat(60));
}

main().catch(console.error);
