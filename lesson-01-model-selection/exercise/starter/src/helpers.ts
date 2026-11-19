import { MODELS } from "./models.js";
import { Message } from "@anthropic-ai/sdk/resources";

/**
 * Ensure API response is parsed as JSON.
 * Some proxy environments (like Vocareum) may return responses as strings.
 */
export function ensureParsedResponse(response: Message | string): Message {
  if (typeof response === "string") {
    return JSON.parse(response) as Message;
  }
  return response;
}

/**
 * Calculate the cost of an API call based on token usage
 */
export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  model: typeof MODELS[keyof typeof MODELS]
): number {
  return (
    (inputTokens / 1000) * model.inputCostPer1k +
    (outputTokens / 1000) * model.outputCostPer1k
  );
}

/**
 * Log API call statistics
 */
export function logStats(result: {
  ms: number;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}): void {
  console.log(
    `Time: ${result.ms}ms | Tokens: ${result.inputTokens + result.outputTokens} | Cost: $${result.cost.toFixed(6)}`
  );
}

/**
 * Display comparison table for multiple model results
 */
export function displayComparison(
  results: Array<{
    model: string;
    ms: number;
    inputTokens: number;
    outputTokens: number;
    cost: number;
  }>
): void {
  console.log("Same task, different models:\n");
  console.log("Model      | Time     | Tokens | Cost");
  console.log("-----------|----------|--------|--------");
  for (const r of results) {
    console.log(
      `${r.model.padEnd(10)} | ${(r.ms + "ms").padEnd(8)} | ${(r.inputTokens + r.outputTokens).toString().padEnd(6)} | $${r.cost.toFixed(6)}`
    );
  }
}
