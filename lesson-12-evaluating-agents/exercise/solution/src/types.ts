/**
 * Structured Output Types for Sentiment Analysis
 * Zod schemas for agent output (pattern from Lesson 7)
 */

import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Structured output schema for sentiment analysis
export const SentimentAnalysisSchema = z.object({
  text: z.string().describe("The original text that was analyzed"),
  sentiment: z
    .enum(["positive", "negative", "neutral"])
    .describe("The detected sentiment"),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe("Confidence score from 0 to 1"),
  keywords: z
    .array(z.string())
    .describe("Key words that influenced the sentiment"),
  explanation: z.string().describe("Brief explanation of why this sentiment was detected"),
});

// TypeScript type from schema
export type SentimentAnalysis = z.infer<typeof SentimentAnalysisSchema>;

// JSON Schema for agent output format
export const SentimentAnalysisJSONSchema = zodToJsonSchema(SentimentAnalysisSchema as any, {
  $refStrategy: "root",
});

// Test case type for evaluations
export interface SentimentTestCase {
  text: string;
  expectedSentiment: "positive" | "negative" | "neutral";
  description: string;
}

// Sample test cases for evaluation
export const testCases: SentimentTestCase[] = [
  {
    text: "I absolutely love this product! Best purchase ever!",
    expectedSentiment: "positive",
    description: "Strongly positive review",
  },
  {
    text: "This is terrible. Complete waste of money. Very disappointed.",
    expectedSentiment: "negative",
    description: "Strongly negative review",
  },
  {
    text: "The product arrived on time. It works as described.",
    expectedSentiment: "neutral",
    description: "Factual neutral statement",
  },
  {
    text: "Amazing quality and fast shipping! Highly recommend!",
    expectedSentiment: "positive",
    description: "Positive with recommendation",
  },
  {
    text: "Broke after one day. Customer service was unhelpful.",
    expectedSentiment: "negative",
    description: "Negative with complaint",
  },
];
