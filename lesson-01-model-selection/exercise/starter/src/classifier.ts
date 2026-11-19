/**
 * Exercise: Claude Model Selection
 *
 * Scenario: A support team handles thousands of tickets daily.
 * Simple questions need fast responses; complex issues need deeper analysis.
 *
 * This exercise reinforces how to pick the right model for different tasks.
 */

import Anthropic from "@anthropic-ai/sdk";
import { MODELS, ModelKey } from "./models.js";
import { TICKETS } from "./sample-tickets.js";
import { calculateCost, logStats, displayComparison, ensureParsedResponse } from "./helpers.js";
import { Message, Model } from "@anthropic-ai/sdk/resources";
import dotenv from "dotenv";
dotenv.config();

/**Initialize the Anthropic client */
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});


// -----------------------------------------------------------------------------
// Helper: Call Claude and return the response with usage stats
// -----------------------------------------------------------------------------

async function callClaude(modelKey: ModelKey, system: string, userMessage: string) {
  const model = MODELS[modelKey];
  const start = Date.now();

  // TODO: Call Claude with the model and system prompt
  //  const rawResponse = await client.messages.create({ ... });
  //  const response = ensureParsedResponse(rawResponse as any); // Required for Vocareum

  const ms = Date.now() - start;
  // TODO: Replace these placeholders with response.usage.input_tokens and response.usage.output_tokens
  const inputTokens = 0;
  const outputTokens = 0;

  const cost = calculateCost(inputTokens, outputTokens, model);


  // TODO: Replace this placeholder with the text of the first content block in the response
  const text = "";

  return { text, inputTokens, outputTokens, ms, cost };
}

// -----------------------------------------------------------------------------
// Step 1: Haiku - Fast classification for simple tickets
// -----------------------------------------------------------------------------

async function testHaiku() {
  console.log(`\n---  Haiku for Simple Classification ---\n`);

  // TODO: Define system prompt
  // Goal: Classify support ticket priority as: LOW, MEDIUM, HIGH, or URGENT
  const system = `YOUR SYSTEM PROMPT HERE`;

  // TODO: Call Claude with Haiku model
  const result = null; // Replace with API call

  // TODO: Display results
  console.log(`Result: ${result.text}`);
  logStats(result);

  console.log(`\n💡 Haiku is perfect for simple tasks - fast and cheap!`);
}

// -----------------------------------------------------------------------------
// Step 2: Sonnet - Balanced analysis for moderate tickets
// -----------------------------------------------------------------------------

async function testSonnet() {
  console.log("\n---  Sonnet for Detailed Analysis ---\n");

  // TODO: Define system prompt
  // Goal: Analyze the support ticket and extract:
  //   1. Priority level
  //   2. Issue category
  //   3. Key details
  //   4. Recommended action
  // Keep response concise
  const system = `YOUR SYSTEM PROMPT HERE`;

  // TODO: Call Claude with Sonnet model
  // Use: callClaude("sonnet", system, TICKETS.moderate)
  const result = null; // Replace with API call

  // TODO: Display results
  console.log(`Result:\n${result.text}`);
  logStats(result);

  console.log(`\n💡 Sonnet balances quality and cost - great for most tasks!`);
}

// -----------------------------------------------------------------------------
// Step 3: Opus - Complex reasoning for multi-issue tickets
// -----------------------------------------------------------------------------

async function testOpus() {
  console.log("\n---  Opus for Complex Reasoning ---\n");

  // TODO: Define system prompt
  // Goal: Act as a senior support manager and provide:
  //   1. Issue summary
  //   2. Root cause hypothesis for each issue
  //   3. Impact assessment (business, technical)
  //   4. Prioritized action plan
  // Encourage thorough thinking
  const system = `YOUR SYSTEM PROMPT HERE`;

  // TODO: Call Claude with Opus model
  // Use: callClaude("opus", system, TICKETS.complex)
  const result = null; // Replace with API call

  // TODO: Display results
  console.log(`Result:\n${result.text}`);
  logStats(result);

  console.log(`\n💡 Opus excels at complex, multi-factor reasoning!`);
}

// -----------------------------------------------------------------------------
// Step 4: Compare all models on the same task
// -----------------------------------------------------------------------------

async function testCompare() {
  console.log("\n---  Model Comparison ---\n");

  // TODO: Define system prompt for comparison
  // Goal: Analyze ticket and provide:
  //   1. Priority (low/medium/high/urgent)
  //   2. Main issue
  //   3. One recommended action
  const system = `YOUR SYSTEM PROMPT HERE`;

  // TODO: Call all three models with the same task
  // Loop through: ["haiku", "sonnet", "opus"]
  // Store results in array with: { model, text, ms, inputTokens, outputTokens, cost }
  const results = [];
  // YOUR CODE HERE

  // TODO: Display comparison table
  displayComparison(results);
  // Note: displayComparison() function handles the table formatting

  console.log("\n💡 Pick the right model for the job!");
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  EXERCISE: Claude Model Selection");
  console.log("  Scenario: Customer Support Ticket System");
  console.log("=".repeat(60));

  // TODO: Uncomment each step as you complete it
  // await testHaiku();
  // await testSonnet();
  // await testOpus();
  // await testCompare();
}

main().catch(console.error);
