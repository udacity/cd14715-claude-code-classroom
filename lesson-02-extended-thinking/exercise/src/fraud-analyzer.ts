/**
 * Fraud Analyzer with Extended Thinking
 *
 * Deliverable: analyzeFraudRisk() function that uses extended thinking
 * to analyze transactions and provide compliance-grade audit trails.
 */

import Anthropic from "@anthropic-ai/sdk";
import { Transaction } from "./sample-transactions.js";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const model = "claude-sonnet-4-5-20250929";

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export interface FraudAnalysis {
  risk_level: "low" | "medium" | "high" | "critical";
  confidence: number;
  reasoning_steps: string[];
  risk_factors: string[];
  recommendation: "approve" | "review" | "decline";
}

// -----------------------------------------------------------------------------
// Exported Function: analyzeFraudRisk()
// -----------------------------------------------------------------------------

export async function analyzeFraudRisk(transaction: Transaction): Promise<FraudAnalysis> {
  const response = await client.messages.create({
    model,
    max_tokens: 16000,
    thinking: {
      type: "enabled",
      budget_tokens: 10000,
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

                  Check for fraud patterns:
                  1. Unusual location (different from typical)
                  2. Amount anomalies (much higher than typical)
                  3. High-risk merchant category
                  4. Unusual time of day
                  5. Account age and previous flags

                  Respond with JSON:
                  {
                    "risk_level": "low|medium|high|critical",
                    "confidence": 0-100,
                    "risk_factors": ["factor1", "factor2"],
                    "recommendation": "approve|review|decline"
                  }`,
      },
    ],
  });

  // Extract reasoning steps and final response
  const reasoning_steps: string[] = [];
  let finalResponse = "";

  for (const block of response.content) {
    if (block.type === "thinking") {
      reasoning_steps.push(block.thinking);
    } else if (block.type === "text") {
      finalResponse = block.text;
    }
  }

  // Parse JSON result
  try {
    const jsonMatch = finalResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      risk_level: parsed.risk_level || "medium",
      confidence: parsed.confidence || 50,
      reasoning_steps,
      risk_factors: parsed.risk_factors || [],
      recommendation: parsed.recommendation || "review",
    };
  } catch {
    return {
      risk_level: "medium",
      confidence: 0,
      reasoning_steps,
      risk_factors: ["Analysis parsing failed"],
      recommendation: "review",
    };
  }
}
