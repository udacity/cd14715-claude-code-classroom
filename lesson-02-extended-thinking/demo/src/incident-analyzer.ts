/**
 * Incident Analyzer with Extended Thinking
 *
 * Uses extended thinking to analyze production incidents
 * and provide transparent reasoning for stakeholders.
 */

import Anthropic from "@anthropic-ai/sdk";
import { Message, Model } from "@anthropic-ai/sdk/resources";

import dotenv from "dotenv";
dotenv.config();

/**
 * Ensure API response is parsed as JSON.
 * Some proxy environments (like Vocareum) may return responses as strings.
 */
function ensureParsedResponse(response: Message | string): Message {
  if (typeof response === "string") {
    return JSON.parse(response) as Message;
  }
  return response;
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const model = process.env.ANTHROPIC_MODEL;

if (!model) {
  throw new Error("ANTHROPIC_MODEL is not set");
}

// -----------------------------------------------------------------------------
// Exported Types - Simple text-based output
// -----------------------------------------------------------------------------

export interface IncidentAnalysis {
  analysis: string;          // The final text response
  thinkingSteps: string[];   // Captured reasoning for audit trail
}

// -----------------------------------------------------------------------------
// Exported Function: analyzeIncident()
// -----------------------------------------------------------------------------

export async function analyzeIncident(incidentReport: string): Promise<IncidentAnalysis> {
  const rawResponse = await client.messages.create({
    model: model as Model,
    max_tokens: 16000,
    // To turn on extended thinking, add a thinking object
    thinking: {
      // with the type parameter set to enabled and
      type: "enabled",
      // the budget_tokens to a specified token budget for extended thinking.
      // Larger budgets can improve response quality by enabling more thorough analysis for complex problems
      // IMPORTANT: Thinking tokens are billable at the same rate as output tokens
      // budget_tokens must be set to a value less than max_tokens
      budget_tokens: parseInt(process.env.THINKING_BUDGET_TOKENS || "10000"),
    },

    messages: [
      {
        role: "user",
        content: `You are a senior SRE investigating a production incident.

                  Analyze this incident and identify the root cause:

                  ${incidentReport}

                  Provide:
                  1. Root cause identification
                  2. Contributing factors
                  3. Severity assessment (LOW/MEDIUM/HIGH/CRITICAL)
                  4. Recommended immediate action`,
      },
    ],
  });

  // Ensure response is parsed (handles Vocareum proxy environment)
  const response = ensureParsedResponse(rawResponse as any);

  // Extract thinking steps and final response from content blocks
  const thinkingSteps: string[] = [];
  let analysis = "";

  for (const block of response.content) {
    if (block.type === "thinking") {
      thinkingSteps.push(block.thinking);
    } else if (block.type === "text") {
      analysis = block.text;
    }
  }

  return {
    analysis,
    thinkingSteps,
  };
}
