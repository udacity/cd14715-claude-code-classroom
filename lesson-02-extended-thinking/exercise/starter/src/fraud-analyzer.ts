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

/** Initialize the Anthropic client */
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

export interface FraudAnalysis {
  transactionId: string;
  analysis: string;        // The final text response
  thinkingSteps: string[]; // Captured reasoning for audit trail
}

// -----------------------------------------------------------------------------
// Exported Function: analyzeFraudRisk()
// -----------------------------------------------------------------------------

export async function analyzeFraudRisk(transaction: Transaction): Promise<FraudAnalysis> {
  // TODO: Create the API call with extended thinking enabled
  //  const rawResponse = await client.messages.create({ ... });
  //  const response = ensureParsedResponse(rawResponse as any); // Required for Vocareum

  // Use client.messages.create() with these parameters:

  // TODO: Build the user prompt with transaction details
  // Include:
  //   - Transaction: id, amount, merchant, category, location, time
  //   - Customer History: typicalAmount, typicalLocation, accountAgeDays, previousFlags
  //   - Ask Claude to analyze for fraud patterns and provide risk assessment

  // TODO: Extract thinking steps and final response from content blocks
  // Extended thinking responses have multiple content blocks:
  //   - "thinking" blocks contain the reasoning process
  //   - "text" blocks contain the final response
  const thinkingSteps: string[] = [];
  let analysis = "";

  // TODO: Loop through response.content and extract blocks

  // Placeholder return - replace with actual implementation
  return {
    transactionId: transaction.id,
    analysis,
    thinkingSteps,
  };
}
