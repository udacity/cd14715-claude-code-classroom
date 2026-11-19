/**
 * Tip Agent
 * Agent using custom tool and structured output (patterns from Lessons 5, 6, 7)
 */

import "dotenv/config";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { tipToolServer } from "./tip-calculator.js";
import { TipAnalysisJSONSchema, TipAnalysisSchema, type TipAnalysis } from "./types.js";

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
    session_id: "tip-session",
  };
}

// Track tool calls for evaluation
export interface AgentTrace {
  toolCalls: Array<{
    name: string;
    input: Record<string, unknown>;
  }>;
  result: TipAnalysis | null;
}

/**
 * Analyzes a tip calculation request and returns structured output with trace
 */
export async function analyzeTip(
  billAmount: number,
  tipPercentage: number,
  splitCount: number = 1
): Promise<AgentTrace> {
  const trace: AgentTrace = {
    toolCalls: [],
    result: null,
  };

  const userMessage = `Calculate the tip for a bill of $${billAmount} with a ${tipPercentage}% tip, split ${splitCount} way(s). Use the calculate_tip tool, then provide your analysis.`;

  for await (const message of query({
    prompt: generateMessages(userMessage),
    options: {
      model,
      mcpServers: {
        "tip-calculator": tipToolServer,
      },
      allowedTools: ["mcp__tip-calculator__calculate_tip"],
      outputFormat: {
        type: "json_schema",
        schema: TipAnalysisJSONSchema,
      },
      maxTurns: 10,
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

    if (message.type === "result" && message.subtype === "error_max_turns") {
      console.log("Hit turn limit.");
    }

    // Capture structured output
    if (
      message.type === "result" &&
      message.subtype === "success" &&
      message.structured_output
    ) {
      trace.result = TipAnalysisSchema.parse(message.structured_output);
    }
  }

  if (!trace.result) {
    throw new Error("Failed to get structured output from agent");
  }

  return trace;
}
