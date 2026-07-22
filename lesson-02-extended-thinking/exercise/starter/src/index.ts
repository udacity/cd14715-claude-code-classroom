/**
 * Exercise: Extended Thinking for Fraud Detection
 *
 * Tests for the analyzeFraudRisk() deliverable.
 */

import Anthropic from "@anthropic-ai/sdk";
import { TRANSACTIONS } from "./sample-transactions.js";
import { analyzeFraudRisk, analyzeFraudRiskWithoutThinking, FraudAnalysis } from "./fraud-analyzer.js";
import { Model } from "@anthropic-ai/sdk/resources";
import dotenv from "dotenv";
dotenv.config();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const model = process.env.ANTHROPIC_MODEL;
if (!model) {
  throw new Error("ANTHROPIC_MODEL is not set");
}

// -----------------------------------------------------------------------------
// Test: Show full audit trail for ambiguous case
// -----------------------------------------------------------------------------

async function testWithThinking() {
  console.log("\n--- STEP 2: Analysis WITH Extended Thinking ---\n");

  const t = TRANSACTIONS.ambiguous_case;

  const result = await analyzeFraudRisk(t);

  console.log("📊 Analysis:");
  console.log(result.analysis);

  console.log(`💭 Thinking steps captured:`);

    if (result.thinkingSteps.length > 0) {
        console.log("\n📋 First thinking step (preview):");
        console.log(result.thinkingSteps[0]);
    }

  console.log("\n✅ Extended thinking provides audit trail for compliance!");
}

async function testWithoutThinking() {

    console.log("\n--- STEP 2: Analysis Without Extended Thinking ---\n");

    const t = TRANSACTIONS.ambiguous_case;

    const result = await analyzeFraudRiskWithoutThinking(t);

    console.log("📊 Analysis:", result.analysis);


}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  EXERCISE: Extended Thinking for Fraud Detection");
  console.log("  Focus: Capturing reasoning trails for compliance");
  console.log("=".repeat(60));

  // Optional: implement a test without thinking for comparison
  await testWithoutThinking()
  await testWithThinking();
}

main().catch(console.error);
