/**
 * Exercise: Extended Thinking for Fraud Detection
 *
 * Tests for the analyzeFraudRisk() deliverable.
 */

import Anthropic from "@anthropic-ai/sdk";
import { TRANSACTIONS } from "./sample-transactions.js";
import { analyzeFraudRisk, FraudAnalysis } from "./fraud-analyzer.js";
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

  // TODO: show thinking steps for full audit trail

  console.log("\n✅ Extended thinking provides audit trail for compliance!");
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
  // TODO: Test without thinking
  // await testWithoutThinking()
  await testWithThinking();
}

main().catch(console.error);
