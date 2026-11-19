/**
 * Structured Output Types
 * Zod schemas for agent output (pattern from Lesson 7)
 */

import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Structured output schema for tip analysis
export const TipAnalysisSchema = z.object({
  billAmount: z.number().describe("Original bill amount"),
  tipPercentage: z.number().describe("Tip percentage used"),
  tipAmount: z.number().describe("Calculated tip amount"),
  totalAmount: z.number().describe("Total including tip"),
  perPersonAmount: z.number().describe("Amount per person if splitting"),
  splitCount: z.number().describe("Number of people splitting"),
  recommendation: z
    .enum(["low", "standard", "generous"])
    .describe("Assessment of the tip level"),
  explanation: z.string().describe("Brief explanation of the calculation"),
});

// TypeScript type from schema
export type TipAnalysis = z.infer<typeof TipAnalysisSchema>;

// JSON Schema for agent output format
export const TipAnalysisJSONSchema = zodToJsonSchema(TipAnalysisSchema as any, {
  $refStrategy: "root",
});

// Test case type for evaluations
export interface TipTestCase {
  bill: number;
  tip: number;
  split: number;
  expectedTip: number;
  expectedTotal: number;
  expectedPerPerson: number;
  description: string;
}

// Sample test cases for evaluation
export const testCases: TipTestCase[] = [
  {
    bill: 50,
    tip: 15,
    split: 1,
    expectedTip: 7.5,
    expectedTotal: 57.5,
    expectedPerPerson: 57.5,
    description: "Standard 15% tip, no split",
  },
  {
    bill: 120,
    tip: 20,
    split: 4,
    expectedTip: 24,
    expectedTotal: 144,
    expectedPerPerson: 36,
    description: "Generous 20% tip, split 4 ways",
  },
  {
    bill: 85.50,
    tip: 18,
    split: 2,
    expectedTip: 15.39,
    expectedTotal: 100.89,
    expectedPerPerson: 50.45,
    description: "18% tip with cents, split 2 ways",
  },
];
