/**
 * Demo: Claude Skills - Email Etiquette
 *
 * Tests for the email etiquette skill using the agent.
 */

import "dotenv/config";
import { reviewEmail } from "./email-reviewer.js";
import { sampleEmails } from "./sample-emails.js";

// -----------------------------------------------------------------------------
// Test case: Review a casual email
// -----------------------------------------------------------------------------

async function reviewCasualEmail() {
  const email = sampleEmails.find((e) => e.expectedTone === "too-casual");
  if (!email) {
    throw new Error("No casual email found");
  }

  console.log(`Email: "${email.content}"\n`);

  const result = await reviewEmail(email.content);

  console.log("Review Result:\n");
  console.log(result.raw);
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  DEMO: Claude Skills - Email Etiquette");
  console.log("  Using email-etiquette skill from .claude/skills/");
  console.log("=".repeat(60));

  await reviewCasualEmail();
}

main().catch(console.error);
