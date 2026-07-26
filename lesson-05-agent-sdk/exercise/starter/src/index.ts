/**
 * Exercise: Claude Agent SDK - Contract Standardizer
 *
 * Tests for the standardizeContract() function.
 */

import "dotenv/config";
import {standardizeContract, StandardizedContract} from "./contract-standardizer.js";
import { CONTRACT_FILES } from "./sample-contracts.js";

// -----------------------------------------------------------------------------
// Step 1: Test with SaaS agreement (well-structured)
// -----------------------------------------------------------------------------

async function testContract(id: String) {
    const contract = CONTRACT_FILES.find((c) => c.id === id);

    if (!contract) {
        throw new Error("Contract not found");
    }

    const outputFilename = `standardized-${contract.id}.md`;
    const result = await standardizeContract(contract.path, outputFilename);

    console.log(`\n✅ ${id.charAt(0).toUpperCase()}${id.slice(1)} Contract standardized successfully!`);
    console.log(`Input Path: ${result.inputPath}`);
    console.log(`Output Path: ${result.outputPath}`);
    console.log(`Raw Result: ${result.raw}`);

    return result;
}

const testSaasContract = async () => testContract("saas");
const testEmailProposal = async() => testContract("email");
const testConsultingContract = async() => testContract("consulting");
const testVendorProposal = async() => testContract("vendor");


// -----------------------------------------------------------------------------
// Step 2: Test with email proposal (minimal detail)
// -----------------------------------------------------------------------------


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
 await testConsultingContract();
 await testVendorProposal();

}

main().catch(console.error);
