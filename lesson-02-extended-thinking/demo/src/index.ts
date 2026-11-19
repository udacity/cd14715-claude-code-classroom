/**
 * Demo: Extended Thinking for Root Cause Analysis
 *
 * Tests for the analyzeIncident() function.
 */

import Anthropic from "@anthropic-ai/sdk";
import { INCIDENTS } from "./sample-incidents.js";
import { analyzeIncident } from "./incident-analyzer.js";
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
  console.log("\n--- Analysis WITHOUT Extended Thinking ---\n");

  const rawResponse = await client.messages.create({
    model: model as Model,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Analyze this incident and identify the root cause:\n\n${INCIDENTS.checkout}`,
      },
    ],
  });

  // Ensure response is parsed (handles Vocareum proxy environment)
  const response = ensureParsedResponse(rawResponse as any);

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  console.log("Result:");
  console.log(text);

  console.log("⚠️  No audit trail captured - we only got the final answer!");
}

// -----------------------------------------------------------------------------
// Step 2: Test analyzeIncident() WITH extended thinking
// -----------------------------------------------------------------------------

async function testWithThinking() {
  console.log("\n--- Analysis WITH Extended Thinking ---\n");

  const result = await analyzeIncident(INCIDENTS.latency);

  console.log("📊 Analysis:");
  console.log(result.analysis);

  console.log("------");

  console.log(`💭 Thinking steps captured: ${result.thinkingSteps.length}`);

  if (result.thinkingSteps.length > 0) {
    console.log("\n📋 First thinking step (preview):");
    console.log(result.thinkingSteps[0]);
  }

  console.log("\n✅ Extended thinking provides audit trail for stakeholders!");
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  DEMO: Extended Thinking for Root Cause Analysis");
  console.log("=".repeat(60));

  await testWithoutThinking();
  await testWithThinking();
}

main().catch(console.error);
