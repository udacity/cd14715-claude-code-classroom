/**
 * Tax Calculator Custom Tool
 *
 * Deliverable: A custom tool that calculates tax amounts with precision.
 * Uses createSdkMcpServer and tool helper from Claude Agent SDK.
 */

import { z } from "zod";
import { createSdkMcpServer, tool } from "@anthropic-ai/claude-agent-sdk";

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export interface TaxResult {
  subtotal: number;
  tax: number;
  total: number;
  effectiveRate: number;
  currency: string;
}

// -----------------------------------------------------------------------------
// Tool Schema
// -----------------------------------------------------------------------------

const calculateTaxSchema = {
  amount: z.number().positive().describe("The pre-tax amount in dollars"),
  taxRate: z.number().min(0).max(0.5).describe("Tax rate as decimal (e.g., 0.08 for 8%)"),
  roundToNearestCent: z.boolean().optional().default(true).describe("Whether to round to nearest cent"),
};

// -----------------------------------------------------------------------------
// Create Custom Tool Server
// -----------------------------------------------------------------------------

export const taxToolServer = createSdkMcpServer({
  name: "financial-tools",
  version: "1.0.0",
  tools: [
    tool(
      "calculate_tax",
      "Calculates tax amount and total including tax. Returns subtotal, tax amount, total, and effective rate. Handles decimal precision correctly for financial calculations.",
      calculateTaxSchema,
      async (args): Promise<{ content: Array<{ type: "text"; text: string }> }> => {
        const { amount, taxRate, roundToNearestCent = true } = args;

        // Calculate tax with proper precision
        let taxAmount = amount * taxRate;
        let total = amount + taxAmount;

        // Round if requested
        if (roundToNearestCent) {
          taxAmount = Math.round(taxAmount * 100) / 100;
          total = Math.round(total * 100) / 100;
        }

        const result: TaxResult = {
          subtotal: amount,
          tax: taxAmount,
          total: total,
          effectiveRate: taxRate,
          currency: "USD",
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }
    ),
  ],
});
