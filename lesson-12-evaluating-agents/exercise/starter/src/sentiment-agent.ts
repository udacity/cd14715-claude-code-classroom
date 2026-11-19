/**
 * Sentiment Analysis Agent
 * Agent using custom tool and structured output (patterns from Lessons 5, 6, 7)
 */

import "dotenv/config";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { sentimentToolServer } from "./sentiment-tool.js";
import { SentimentAnalysisJSONSchema, SentimentAnalysisSchema, type SentimentAnalysis } from "./types.js";

const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929";

// Input message generator for custom MCP tools (required pattern from Lesson 6)
async function* generateMessages(userMessage: string) {
  yield {
    type: "user" as const,
    message: {
      role: "user" as const,
      content: userMessage,
    },
    parent_tool_use_id: null,
    session_id: "sentiment-session",
  };
}

// Track tool calls for evaluation
export interface AgentTrace {
  toolCalls: Array<{
    name: string;
    input: Record<string, unknown>;
  }>;
  result: SentimentAnalysis | null;
}

/**
 * Analyzes text sentiment and returns structured output with trace
 */
export async function analyzeSentiment(text: string): Promise<AgentTrace> {
  const trace: AgentTrace = {
    toolCalls: [],
    result: null,
  };

  const userMessage = `Analyze the sentiment of the following text. Use the analyze_sentiment tool first, then provide your analysis based on the results.

Text to analyze: "${text}"

Provide a confidence score based on how clear the sentiment indicators are.`;

  for await (const message of query({
    prompt: generateMessages(userMessage),
    options: {
      model,
      mcpServers: {
        "sentiment-analyzer": sentimentToolServer,
      },
      allowedTools: ["mcp__sentiment-analyzer__analyze_sentiment"],
      outputFormat: {
        type: "json_schema",
        schema: SentimentAnalysisJSONSchema,
      },
    },
  })) {
    // Track tool calls
    if (message.type === "assistant") {
      const content = message.message?.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block.type === "tool_use") {
            trace.toolCalls.push({
              name: block.name,
              input: block.input as Record<string, unknown>,
            });
          }
        }
      }
    }

    // Capture structured output
    if (
      message.type === "result" &&
      message.subtype === "success" &&
      message.structured_output
    ) {
      trace.result = SentimentAnalysisSchema.parse(message.structured_output);
    }
  }

  if (!trace.result) {
    throw new Error("Failed to get structured output from agent");
  }

  return trace;
}
