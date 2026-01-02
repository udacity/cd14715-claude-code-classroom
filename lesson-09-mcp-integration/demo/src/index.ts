/**
 * Demo: MCP Integration - GitHub File Summarizer
 *
 * Shows how to use GitHub MCP server to fetch and summarize files.
 */

import "dotenv/config";
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

  console.log(`Repository: ${result.repo}`);
  console.log(`File: ${result.path}\n`);
  console.log("Summary:\n");
  console.log(result.raw);
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
