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

const systemPrompt = `
    - You are a senior fraud analyst investigating a potentially fraudulent transaction. 
    - You will be provided a detailed transaction and corresponding customer history. 
    - Your task is to analyze the provided transaction details for fraud patterns and provide a risk assessment.
    - You must provide a detailed reasoning process for your analysis, including any patterns or anomalies you identify.
    - Your answer should be structured as follows:
        1. Provide risk assessment level. Low, Medium, or High.
        2. Provide further recommendation, either Approve, Review, or Deny.
    `

// -----------------------------------------------------------------------------
// Exported Function: analyzeFraudRisk()
// -----------------------------------------------------------------------------
const parseTransactionDetails = (transaction: Transaction): string =>
    `
    Transaction ID: ${transaction.id}
    Amount: $${transaction.amount}
    Merchant: ${transaction.merchant}
    Category: ${transaction.category}
    Location: ${transaction.location}
    Time: ${transaction.time}
    
    Customer History:
    Typical Amount: $${transaction.customerHistory.typicalAmount}
    Typical Location: ${transaction.customerHistory.typicalLocation}
    Account Age (days): ${transaction.customerHistory.accountAgeDays}
    Previous Flags: ${transaction.customerHistory.previousFlags}
    `

export async function analyzeFraudRiskWithoutThinking(transaction: Transaction): Promise<FraudAnalysis> {
    const rawResponse = await client.messages.create({
        model: model as Model,
        max_tokens: 16000,
        messages: [
            {
                role: "user",
                content: `
                ${systemPrompt}
                
                Here is the transaction details for your analysis:
                
                ${parseTransactionDetails(transaction)}
                `,
            },
        ],
    });
    const response = ensureParsedResponse(rawResponse as any); // Required for Vocareum

    let analysis = response.content
        .filter((content) => content.type === "text")
        .map((content => content.text))
        .reduce((acc, content) => `
        ${acc}
        ${content}
        `, "");

    // Placeholder return - replace with actual implementation
    return {
        transactionId: transaction.id,
        analysis: analysis,
        thinkingSteps: []
    };
}
export async function analyzeFraudRisk(transaction: Transaction): Promise<FraudAnalysis> {
  // Use client.messages.create() with these parameters:

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
                content: `
                ${systemPrompt}
                
                Here is the transaction details for your analysis:
                ${parseTransactionDetails(transaction)}
                `,
            },
        ],
    });
    const response = ensureParsedResponse(rawResponse as any); // Required for Vocareum

    let analysis = response.content
        .filter((content) => content.type === "text")
        .map((content => content.text))
        .reduce((acc, content) => `
        ${acc}
        ${content}
        `, "");

    const thinkingSteps: string[] = response.content
        .filter((content) => content.type === "thinking")
        .map((content => content.thinking))

  // Placeholder return - replace with actual implementation
  return {
    transactionId: transaction.id,
    analysis,
    thinkingSteps,
  };
}
