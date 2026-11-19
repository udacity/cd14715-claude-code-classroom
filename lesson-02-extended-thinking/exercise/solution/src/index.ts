/**
 * Exercise: Extended Thinking for Fraud Detection
 *
 * Tests for the analyzeFraudRisk() deliverable.
 */

import Anthropic from "@anthropic-ai/sdk";
import { TRANSACTIONS } from "./sample-transactions.js";
import { analyzeFraudRisk } from "./fraud-analyzer.js";
import { Message, Model } from "@anthropic-ai/sdk/resources";
import dotenv from "dotenv";
dotenv.config();

/**
 * Ensure API response is parsed as JSON.
 * Some proxy environments (like Vocareum) may return responses as strings.
 */
function ensureParsedResponse(response: Message | string): Message {
  if (typeof response === "string") {
    return JSON.parse(response) as Message;
  }
  return response;
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const model = process.env.ANTHROPIC_MODEL;
if (!model) {
  throw new Error("ANTHROPIC_MODEL is not set");
}

// -----------------------------------------------------------------------------
// Step 1: Analyze WITHOUT extended thinking (baseline comparison)
// -----------------------------------------------------------------------------

async function testWithoutThinking() {
  console.log("\n--- STEP 1: Analysis WITHOUT Extended Thinking ---\n");

  const t = TRANSACTIONS.obvious_fraud;

  const rawResponse = await client.messages.create({
    model: model as Model,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Analyze this transaction for fraud: $${t.amount} at ${t.merchant} in ${t.location}. Customer usually spends $${t.customerHistory.typicalAmount} in ${t.customerHistory.typicalLocation}.`,
      },
    ],
  });

  // Ensure response is parsed (handles Vocareum proxy environment)
  const response = ensureParsedResponse(rawResponse as any);

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  console.log("Result:", text.substring(0, 300) + "...\n");

  console.log("⚠️  No audit trail captured - we only got the final answer!");
}

// -----------------------------------------------------------------------------
// Step 2: Test analyzeFraudRisk() WITH extended thinking
// -----------------------------------------------------------------------------

async function testWithThinking() {
  console.log("\n--- STEP 2: Analysis WITH Extended Thinking ---\n");

  const t = TRANSACTIONS.ambiguous_case;
  console.log(`Transaction: ${t.id} - $${t.amount} at ${t.merchant}\n`);

  const result = await analyzeFraudRisk(t);

  console.log("📊 Analysis:");
  console.log(result.analysis);

  console.log(`💭 Thinking steps captured: ${result.thinkingSteps.length}`);

  if (result.thinkingSteps.length > 0) {
    console.log("\n📋 First thinking step (preview):");
    console.log(result.thinkingSteps[0].substring(0, 400) + "...");
  }

  console.log("\n✅ Extended thinking provides audit trail for compliance!");
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  EXERCISE: Extended Thinking for Fraud Detection");
  console.log("=".repeat(60));

  await testWithoutThinking();
  await testWithThinking();
}

main().catch(console.error);
