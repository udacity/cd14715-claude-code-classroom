/**
 * Claude Model Definitions
 *
 * Pricing: https://platform.claude.com/docs/en/about-claude/pricing
 * Model IDs: https://platform.claude.com/docs/en/about-claude/models/overview
 */

export const MODELS = {
  haiku: {
    id: "claude-haiku-4-5-20251001",
    name: "Haiku 4.5",
    inputCostPer1k: 0.001,   // $1 per million tokens
    outputCostPer1k: 0.005,  // $5 per million tokens
  },
  sonnet: {
    id: "claude-sonnet-4-5-20250929",
    name: "Sonnet 4.5",
    inputCostPer1k: 0.003,   // $3 per million tokens
    outputCostPer1k: 0.015,  // $15 per million tokens
  },
  opus: {
    id: "claude-opus-4-5-20251101",
    name: "Opus 4.5",
    inputCostPer1k: 0.005,   // $5 per million tokens
    outputCostPer1k: 0.025,  // $25 per million tokens
  },
};

export type ModelKey = keyof typeof MODELS;
