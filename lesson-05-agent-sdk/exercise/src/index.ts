/**
 * Exercise: Claude Agent SDK - Contract Standardizer
 *
 * Tests for the standardizeContract() function.
 */

import "dotenv/config";
import { standardizeContract, StandardizedContract } from "./contract-standardizer.js";
import { CONTRACTS } from "./sample-contracts.js";

// -----------------------------------------------------------------------------
// Step 1: Test with SaaS agreement (well-structured)
// -----------------------------------------------------------------------------

async function step1_testSaasContract() {
  console.log("\n--- STEP 1: Standardize SaaS Agreement ---\n");

  console.log("Input: Well-structured SaaS contract\n");

  const result = await standardizeContract(CONTRACTS.saas);

  console.log("📄 Standardized Output:\n");
  console.log(result.raw);

  console.log("\n💡 Agent extracted all key terms into standard format!");
}

// -----------------------------------------------------------------------------
// Step 2: Test with email proposal (minimal detail)
// -----------------------------------------------------------------------------

async function step2_testEmailProposal() {
  console.log("\n--- STEP 2: Standardize Email Proposal ---\n");

  console.log("Input: Informal email proposal (sparse details)\n");

  const result = await standardizeContract(CONTRACTS.email);

  console.log("📄 Standardized Output:\n");
  console.log(result.raw);

  console.log("\n💡 Agent identifies missing terms even from sparse documents!");
}

// -----------------------------------------------------------------------------
// Step 3: Test all 4 contract types
// -----------------------------------------------------------------------------

async function step3_testAllContracts() {
  console.log("\n--- STEP 3: Test All 4 Contract Types ---\n");

  const results: Array<{ type: string; result: StandardizedContract }> = [];

  for (const [type, text] of Object.entries(CONTRACTS)) {
    console.log(`Processing ${type}...`);
    const result = await standardizeContract(text);
    results.push({ type, result });
  }

  console.log("\n📊 Summary:\n");
  console.log("Contract Type | Output Length | Has Risk Assessment");
  console.log("--------------|---------------|--------------------");

  for (const { type, result } of results) {
    const len = result.raw.length;
    const hasRisk = result.raw.includes("Risk Assessment") ? "Yes" : "No";
    console.log(`${type.padEnd(13)} | ${len.toString().padEnd(13)} | ${hasRisk}`);
  }

  console.log("\n💡 All 4 contracts standardized successfully!");
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  EXERCISE: Claude Agent SDK - Contract Standardizer");
  console.log("  Testing: standardizeContract() function");
  console.log("=".repeat(60));

  await step1_testSaasContract();
  await step2_testEmailProposal();
  await step3_testAllContracts();

  console.log("\n" + "=".repeat(60));
  console.log("  KEY TAKEAWAYS");
  console.log("=".repeat(60));
  console.log(`
  AGENT SDK PATTERN:
  1. Import { query } from '@anthropic-ai/claude-agent-sdk'
  2. Create prompt function with extraction template
  3. Call query({ prompt, options: { allowedTools: [] } })
  4. Iterate over result with for await

  NO TOOLS NEEDED:
  • Contract text is passed directly in prompt
  • Agent focuses on text extraction and formatting

  DELIVERABLE: contract-standardizer.ts
  • Exports: StandardizedContract interface
  • Exports: standardizeContract(text) function

  USE CASE:
  • Legal team can compare contracts side-by-side
  • Saves hours of manual reformatting
`);
}

main().catch(console.error);
