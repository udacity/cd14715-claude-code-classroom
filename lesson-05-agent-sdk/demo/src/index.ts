/**
 * Demo: Claude Agent SDK - Document Summarizer
 *
 * Tests for the summarizeDocument() function.
 */

import "dotenv/config";
import { summarizeDocument, DocumentSummary } from "./document-summarizer.js";

// -----------------------------------------------------------------------------
// Step 1: Test with sample API guide
// -----------------------------------------------------------------------------

async function step1_summarizeSampleDoc() {
  console.log("\n--- STEP 1: Summarize Sample API Guide ---\n");

  const filePath = "./src/sample-api-guide.md";
  console.log(`Document: ${filePath}\n`);

  const result = await summarizeDocument(filePath);

  console.log("📊 Result:");
  console.log(`  Key Points: ${result.keyPoints.length} extracted`);
  result.keyPoints.forEach((point, i) => {
    console.log(`    ${i + 1}. ${point.substring(0, 60)}...`);
  });
  console.log(`\n  Summary: ${result.summary.substring(0, 150)}...`);

  console.log("\n💡 Agent used Read tool to access the file automatically!");
}

// -----------------------------------------------------------------------------
// Step 2: Show raw output
// -----------------------------------------------------------------------------

async function step2_showRawOutput() {
  console.log("\n--- STEP 2: Full Agent Output ---\n");

  const filePath = "./src/sample-api-guide.md";
  const result = await summarizeDocument(filePath);

  console.log("📄 Raw Agent Output:\n");
  console.log(result.raw);

  console.log("\n💡 The agent formatted the response per our prompt instructions!");
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  DEMO: Claude Agent SDK - Document Summarizer");
  console.log("  Testing: summarizeDocument() function");
  console.log("=".repeat(60));

  await step1_summarizeSampleDoc();
  await step2_showRawOutput();
}

main().catch(console.error);
