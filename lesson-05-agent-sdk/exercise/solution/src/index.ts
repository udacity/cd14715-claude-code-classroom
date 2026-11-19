/**
 * Exercise: Claude Agent SDK - Contract Standardizer
 *
 * Tests for the standardizeContract() function.
 */

import "dotenv/config";
import { standardizeContract } from "./contract-standardizer.js";
import { CONTRACT_FILES } from "./sample-contracts.js";

// -----------------------------------------------------------------------------
// Step 1: Test with SaaS agreement (well-structured)
// -----------------------------------------------------------------------------

async function testSaasContract() {
  console.log("\n--- STEP 1: Standardize SaaS Agreement ---\n");

  const contract = CONTRACT_FILES.find((c) => c.id === "saas");

  if (!contract) {
    throw new Error("Contract not found");
  }

  const outputFilename = `standardized-${contract.id}.md`;
  const result = await standardizeContract(contract.path, outputFilename);

  console.log(`✅ Input: ${result.inputPath}`);
  console.log(`✅ Output: ${result.outputPath}`);

  return result;
}

// -----------------------------------------------------------------------------
// Step 2: Test with email proposal (minimal detail)
// -----------------------------------------------------------------------------

async function testEmailProposal() {
  console.log("\n--- STEP 2: Standardize Email Proposal ---\n");

  const contract = CONTRACT_FILES.find((c) => c.id === "email");
  if (!contract) {
    throw new Error("Contract not found");
  }

  const outputFilename = `standardized-${contract.id}.md`;
  const result = await standardizeContract(contract.path, outputFilename);

  console.log(`✅ Input: ${result.inputPath}`);
  console.log(`✅ Output: ${result.outputPath}`);

  return result;
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  EXERCISE: Claude Agent SDK - Contract Standardizer");
  console.log("  Testing: standardizeContract() function");
  console.log("=".repeat(60));

 await testSaasContract();
 await testEmailProposal();

}

main().catch(console.error);
