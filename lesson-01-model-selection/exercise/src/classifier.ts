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

// Initialize the Anthropic client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// -----------------------------------------------------------------------------
// Helper: Call Claude and return the response with usage stats
// -----------------------------------------------------------------------------

async function callClaude(modelKey: ModelKey, system: string, userMessage: string) {
  const model = MODELS[modelKey];
  // start timer
  const start = Date.now();

  const response = await client.messages.create({
    model: model.id,
    max_tokens: 4096,
    system,
    messages: [{ role: "user", content: userMessage }],
  });


  console.log(JSON.stringify(response, null, 2));
  // stop timer
  const ms = Date.now() - start;
  // get usage stats
  const inputTokens = response.usage.input_tokens;
  const outputTokens = response.usage.output_tokens;
  // calculate cost
  const cost =
    (inputTokens / 1000) * model.inputCostPer1k +
    (outputTokens / 1000) * model.outputCostPer1k;

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  return { text, inputTokens, outputTokens, ms, cost };
}

// -----------------------------------------------------------------------------
// Step 1: Haiku - Fast classification for simple tickets
// -----------------------------------------------------------------------------

async function step1_haiku() {
  console.log(`\n--- STEP 1: Haiku for Simple Classification ---\n`);

  const system = `Classify support ticket priority as: LOW, MEDIUM, HIGH, or URGENT. Respond with only the level.`;

  const result = await callClaude("haiku", system, TICKETS.simple);

  console.log(`Result: ${result.text}`);
  console.log(`Time: ${result.ms}ms | Tokens: ${result.inputTokens+ result.outputTokens} | Cost: $${result.cost.toFixed(6)}`);
  console.log(`\n💡 Haiku is perfect for simple tasks - fast and cheap!`);
}

// -----------------------------------------------------------------------------
// Step 2: Sonnet - Balanced analysis for moderate tickets
// -----------------------------------------------------------------------------

async function step2_sonnet() {
  console.log("\n--- STEP 2: Sonnet for Detailed Analysis ---\n");

  const system = `Analyze the support ticket. Extract:
1. Priority level
2. Issue category
3. Key details
4. Recommended action

Be concise.`;

  const result = await callClaude("sonnet", system, TICKETS.moderate);

  console.log(`Result:\n${result.text}`);
  console.log(`\nTime: ${result.ms}ms | Tokens: ${result.inputTokens+ result.outputTokens} | Cost: $${result.cost.toFixed(6)}`);
  console.log(`\n💡 Sonnet balances quality and cost - great for most tasks!`);
}

// -----------------------------------------------------------------------------
// Step 3: Opus - Complex reasoning for multi-issue tickets
// -----------------------------------------------------------------------------

async function step3_opus() {
  console.log("\n--- STEP 3: Opus for Complex Reasoning ---\n");

  const system = `You are a senior support manager. Provide:
1. Issue summary
2. Root cause hypothesis for each issue
3. Impact assessment (business, technical)
4. Prioritized action plan

Think through each element carefully.`;

  const result = await callClaude("opus", system, TICKETS.complex);

  console.log(`Result:\n${result.text}`);
  console.log(`\nTime: ${result.ms}ms | Tokens: ${result.inputTokens+ result.outputTokens} | Cost: $${result.cost.toFixed(6)}`);
  console.log(`\n💡 Opus excels at complex, multi-factor reasoning!`);
}

// -----------------------------------------------------------------------------
// Step 4: Compare all models on the same task
// -----------------------------------------------------------------------------

async function step4_compare() {
  console.log("\n--- STEP 4: Model Comparison ---\n");

  const system = `Analyze the ticket. Provide:
1. Priority (low/medium/high/urgent)
2. Main issue
3. One recommended action`;

  const results = [];
  for (const key of ["haiku", "sonnet", "opus"] as ModelKey[]) {
    const r = await callClaude(key, system, TICKETS.moderate);
    results.push({ model: MODELS[key].name, ...r });
  }

  console.log("Same task, different models:\n");
  console.log("Model      | Time     | Tokens | Cost");
  console.log("-----------|----------|--------|--------");
  for (const r of results) {
    console.log(
      `${r.model.padEnd(10)} | ${(r.ms + "ms").padEnd(8)} | ${(r.inputTokens + r.outputTokens).toString().padEnd(6)} | $${r.cost.toFixed(6)}`
    );
  }

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

   await step1_haiku();
   await step2_sonnet();
   await step3_opus();
   await step4_compare();
}

main().catch(console.error);
