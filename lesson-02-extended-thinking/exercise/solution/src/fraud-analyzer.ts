/**
 * Fraud Analyzer with Extended Thinking
 *
 * Deliverable: analyzeFraudRisk() function that uses extended thinking
 * to analyze transactions and provide compliance-grade audit trails.
 */

import Anthropic from "@anthropic-ai/sdk";
import { Transaction } from "./sample-transactions.js";
import dotenv from "dotenv";
import { Message, Model } from "@anthropic-ai/sdk/resources";
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
// Exported Types - FraudAnalysis interface
// -----------------------------------------------------------------------------

export interface FraudAnalysis {
  transactionId: string;
  analysis: string;        // The final text response
  thinkingSteps: string[]; // Captured reasoning for audit trail
}

// -----------------------------------------------------------------------------
// Exported Function: analyzeFraudRisk()
// -----------------------------------------------------------------------------

export async function analyzeFraudRisk(transaction: Transaction): Promise<FraudAnalysis> {
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
      budget_tokens: parseInt(process.env.MAX_THINKING_TOKENS || "10000"),
    },
    messages: [
      {
        role: "user",
        content: `You are a fraud analyst reviewing a flagged transaction.

                  Transaction: ${transaction.id}
                  Amount: $${transaction.amount} at ${transaction.merchant} (${transaction.category})
                  Location: ${transaction.location}
                  Time: ${transaction.time}

                  Customer History:
                  - Typical amount: $${transaction.customerHistory.typicalAmount}
                  - Usual location: ${transaction.customerHistory.typicalLocation}
                  - Account age: ${transaction.customerHistory.accountAgeDays} days
                  - Previous flags: ${transaction.customerHistory.previousFlags}

                  Analyze this transaction for fraud. Consider:
                  1. Location anomalies
                  2. Amount anomalies
                  3. Merchant category risk
                  4. Time of day patterns
                  5. Account history

                  Provide your assessment with a risk level (LOW/MEDIUM/HIGH/CRITICAL) and recommendation (APPROVE/REVIEW/DECLINE).`,
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
    transactionId: transaction.id,
    analysis,
    thinkingSteps,
  };
}
