/**
 * Tip Calculator Tool
 * Custom MCP tool using createSdkMcpServer (pattern from Lesson 6)
 */

import { z } from "zod";
import { createSdkMcpServer, tool } from "@anthropic-ai/claude-agent-sdk";

// Zod schema for tool parameters (as plain object, not z.object)
export const calculateTipSchema = {
  billAmount: z.number().positive().describe("The bill amount in dollars"),
  tipPercentage: z.number().min(0).max(100).describe("Tip percentage (e.g., 15 for 15%)"),
  splitCount: z.number().int().min(1).max(20).optional().default(1).describe("Number of people splitting"),
};

// Result type
export interface TipResult {
  billAmount: number;
  tipPercentage: number;
  tipAmount: number;
  totalAmount: number;
  splitCount: number;
  perPersonAmount: number;
}

// Business logic function (testable separately)
export function calculateTip(
  billAmount: number,
  tipPercentage: number,
  splitCount: number = 1
): TipResult {
  const tipAmount = Math.round(billAmount * (tipPercentage / 100) * 100) / 100;
  const totalAmount = Math.round((billAmount + tipAmount) * 100) / 100;
  const perPersonAmount = Math.round((totalAmount / splitCount) * 100) / 100;

  return {
    billAmount,
    tipPercentage,
    tipAmount,
    totalAmount,
    splitCount,
    perPersonAmount,
  };
}

// Create MCP server with the tip calculator tool
export const tipToolServer = createSdkMcpServer({
  name: "tip-calculator",
  version: "1.0.0",
  tools: [
    tool(
      "calculate_tip",
      "Calculates tip amount, total, and per-person amount for splitting bills.",
      calculateTipSchema,
      async (args): Promise<{ content: Array<{ type: "text"; text: string }> }> => {
        const { billAmount, tipPercentage, splitCount = 1 } = args;
        const result = calculateTip(billAmount, tipPercentage, splitCount);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
    ),
  ],
});
