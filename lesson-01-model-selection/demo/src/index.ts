/**
 * Demo: Claude Model Selection
 *
 * Scenario: A weather service processes thousands of alerts daily.
 * Simple updates need fast processing; severe warnings need deeper analysis.
 *
 * This demo shows how to pick the right model for different tasks.
 */

import Anthropic from "@anthropic-ai/sdk";
import { MODELS, ModelKey } from "./models.js";
import { ALERTS } from "./sample-alerts.js";

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
// Step 1: Haiku - Fast classification for simple alerts
// -----------------------------------------------------------------------------

async function step1_haiku() {
  console.log(`\n--- STEP 1: Haiku for Simple Classification ---\n`);

  const system = `Classify weather severity as: LOW, MEDIUM, HIGH, or CRITICAL. Respond with only the level.`;

  const result = await callClaude("haiku", system, ALERTS.simple);

  console.log(`Result: ${result.text}`);
  console.log(`Time: ${result.ms}ms | Tokens: ${result.inputTokens}+${result.outputTokens} | Cost: $${result.cost.toFixed(6)}`);
  console.log(`\n💡 Haiku is perfect for simple tasks - fast and cheap!`);
}

// -----------------------------------------------------------------------------
// Step 2: Sonnet - Balanced analysis for moderate alerts
// -----------------------------------------------------------------------------

async function step2_sonnet() {
  console.log("\n--- STEP 2: Sonnet for Detailed Analysis ---\n");

  const system = `Analyze the weather alert. Extract:
1. Severity level
2. Hazards listed
3. Key measurements
4. Recommended actions

Be concise.`;

  const result = await callClaude("sonnet", system, ALERTS.moderate);

  console.log("\nResult:\n", result.text);
  console.log(`\nTime: ${result.ms}ms | Tokens: ${result.inputTokens}+${result.outputTokens} | Cost: $${result.cost.toFixed(6)}`);
  console.log("\n💡 Sonnet balances quality and cost - great for most tasks!");
}

// -----------------------------------------------------------------------------
// Step 3: Opus - Complex reasoning for multi-hazard events
// -----------------------------------------------------------------------------

async function step3_opus() {
  console.log("\n--- STEP 3: Opus for Complex Reasoning ---\n");

  const system = `You are a senior meteorologist. Provide:
1. Event summary
2. Phase-by-phase timeline
3. Risk assessment (infrastructure, safety)
4. Preparedness recommendations

Think through each element carefully.`;

  const result = await callClaude("opus", system, ALERTS.complex);

  console.log("\nResult:\n", result.text);
  console.log(`\nTime: ${result.ms}ms | Tokens: ${result.inputTokens}+${result.outputTokens} | Cost: $${result.cost.toFixed(6)}`);
  console.log("\n💡 Opus excels at complex, multi-factor reasoning!");
}

// -----------------------------------------------------------------------------
// Step 4: Compare all models on the same task
// -----------------------------------------------------------------------------

async function step4_compare() {
  console.log("\n--- STEP 4: Model Comparison ---\n");

  const system = `Analyze the alert. Provide:
1. Severity (low/medium/high/critical)
2. Main hazard
3. One recommended action`;

  const results = [];
  for (const key of ["haiku", "sonnet", "opus"] as ModelKey[]) {
    const r = await callClaude(key, system, ALERTS.moderate);
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
  console.log("  DEMO: Claude Model Selection");
  console.log("  Scenario: Weather Notification Service");
  console.log("=".repeat(60));

  await step1_haiku();
  await step2_sonnet();
  await step3_opus();
  await step4_compare();

  console.log("\n" + "=".repeat(60));
  console.log("  KEY TAKEAWAYS");
  console.log("=".repeat(60));
  console.log(`
  HAIKU  → Simple tasks (classification, yes/no, routing)
  SONNET → Most production work (analysis, generation)
  OPUS   → Complex reasoning (multi-step, high-stakes)

  Smart routing can reduce costs by 80%+!
`);
}

main().catch(console.error);
