/**
 * Demo: MCP Integration - GitHub File Summarizer
 *
 * Shows how to use GitHub MCP server to fetch and summarize files.
 */

import dotenv from "dotenv";
dotenv.config({ override: true });
import { summarizeGitHubFile } from "./github-summarizer.js";

// -----------------------------------------------------------------------------
// Test case: Summarize a file from a public GitHub repo
// -----------------------------------------------------------------------------

async function summarizePublicRepoFile() {
  const result = await summarizeGitHubFile(
    "anthropics",
    "claude-cookbooks",
    "README.md"
  );

  // Display structured output fields
  console.log(`Repository: ${result.repo}`);
  console.log(`File: ${result.path}\n`);
  console.log(`Purpose: ${result.purpose}\n`);
  console.log("Key Sections:");
  result.keySections.forEach((section, i) => console.log(`  ${i + 1}. ${section}`));
  console.log("\nPatterns:");
  result.patterns.forEach((pattern, i) => console.log(`  ${i + 1}. ${pattern}`));
  console.log(`\nSummary: ${result.summary}`);
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  DEMO: MCP Integration - GitHub File Summarizer");
  console.log("  Using GitHub MCP to fetch and summarize files");
  console.log("=".repeat(60));

  await summarizePublicRepoFile();
}

main().catch(console.error);
