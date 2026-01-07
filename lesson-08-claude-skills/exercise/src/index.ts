/**
 * Exercise: Claude Skills - JavaScript Code Reviewer
 *
 * Tests for the JS code reviewer using the js-code-review skill.
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
  const filePath = path.join(__dirname, "sample-code", "issues.js");

  const result = await reviewJavaScriptFile(filePath);

  console.log("Code Review Result:\n");
  console.log(result.raw);
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  EXERCISE: Claude Skills - JavaScript Code Reviewer");
  console.log("  Using js-code-review skill from .claude/skills/");
  console.log("=".repeat(60));

  await reviewCodeWithIssues();
}

main().catch(console.error);
