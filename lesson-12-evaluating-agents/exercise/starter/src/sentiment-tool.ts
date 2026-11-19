/**
 * Sentiment Analysis Tool
 * Custom MCP tool using createSdkMcpServer (pattern from Lesson 6)
 */

import { z } from "zod";
import { createSdkMcpServer, tool } from "@anthropic-ai/claude-agent-sdk";

// Zod schema for tool parameters
export const analyzeSentimentSchema = {
  text: z.string().min(1).describe("The text to analyze for sentiment"),
};

// Word lists for simple sentiment detection
const positiveWords = [
  "love", "amazing", "excellent", "great", "wonderful", "fantastic",
  "best", "happy", "recommend", "perfect", "beautiful", "awesome",
];

const negativeWords = [
  "terrible", "awful", "worst", "hate", "disappointed", "waste",
  "broke", "unhelpful", "bad", "poor", "horrible", "useless",
];

// Result type
export interface SentimentToolResult {
  text: string;
  positiveMatches: string[];
  negativeMatches: string[];
  suggestedSentiment: "positive" | "negative" | "neutral";
}

// Business logic function (testable separately)
export function detectSentiment(text: string): SentimentToolResult {
  const lowerText = text.toLowerCase();

  const positiveMatches = positiveWords.filter(word => lowerText.includes(word));
  const negativeMatches = negativeWords.filter(word => lowerText.includes(word));

  let suggestedSentiment: "positive" | "negative" | "neutral";
  if (positiveMatches.length > negativeMatches.length) {
    suggestedSentiment = "positive";
  } else if (negativeMatches.length > positiveMatches.length) {
    suggestedSentiment = "negative";
  } else {
    suggestedSentiment = "neutral";
  }

  return {
    text,
    positiveMatches,
    negativeMatches,
    suggestedSentiment,
  };
}

// Create MCP server with the sentiment tool
export const sentimentToolServer = createSdkMcpServer({
  name: "sentiment-analyzer",
  version: "1.0.0",
  tools: [
    tool(
      "analyze_sentiment",
      "Analyzes text for sentiment indicators. Returns matched positive/negative words and a suggested sentiment.",
      analyzeSentimentSchema,
      async (args): Promise<{ content: Array<{ type: "text"; text: string }> }> => {
        const { text } = args;
        const result = detectSentiment(text);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
    ),
  ],
});
