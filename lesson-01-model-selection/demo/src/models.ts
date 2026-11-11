/**
 * Claude Model Definitions
 *
 * Pricing: https://platform.claude.com/docs/en/about-claude/pricing
 * Model IDs: https://platform.claude.com/docs/en/about-claude/models/overview
 */

export const MODELS = {
  haiku: {
    id: "claude-haiku-5-5", //replace with the model you want to use, must be haiku 
    name: "Haiku 5.5",
    inputCostPer1k: 0.0001,  // $0.10 per million tokens
    outputCostPer1k: 0.0005, // $0.50 per million tokens
  },
  sonnet: {
    id: "claude-sonnet-4-6", //replace with the model you want to use, must be sonnet model
    name: "Sonnet 4.6",
    inputCostPer1k: 0.003,   // $3 per million tokens
    outputCostPer1k: 0.015,  // $15 per million tokens
  },
  opus: {
    id: "claude-opus-4-7", //replace with the model you want to use, must be opus model
    name: "Opus 4.7",
    inputCostPer1k: 0.005,   // $5 per million tokens
    outputCostPer1k: 0.025,  // $25 per million tokens
    effort: "high", // currently only haiku and sonnet have effort Beta feature only available to Opus model
  },
};

export type ModelKey = keyof typeof MODELS;
