/**
 * Product Review Analyzer - Deliverable
 *
 * Uses Zod schemas and structured outputs to extract consistent,
 * validated data from product reviews.
 */

import "dotenv/config";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { query } from "@anthropic-ai/claude-agent-sdk";

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export const ProductReviewSchema = z.object({
  sentiment: z
    .enum(["positive", "negative", "neutral"])
    .describe("Overall sentiment of the review"),

  rating: z
    .number()
    .min(1)
    .max(5)
    .describe("Numerical rating from 1-5 stars"),

  keyPoints: z
    .array(z.string())
    .min(1)
    .max(5)
    .describe("Main points mentioned in review"),

  summary: z.string().max(200).describe("Brief summary of the review"),

  recommendsPurchase: z
    .boolean()
    .describe("Whether reviewer recommends buying the product"),
});

export type ProductReview = z.infer<typeof ProductReviewSchema>;

// Convert to JSON Schema for API use
export const ProductReviewJSONSchema = zodToJsonSchema(ProductReviewSchema, {
  $refStrategy: "root",
});

// -----------------------------------------------------------------------------
// Main Function
// -----------------------------------------------------------------------------

export async function analyzeProductReview(
  reviewText: string
): Promise<ProductReview> {
  const prompt = `Analyze the following product review and extract structured information.

Review:
"${reviewText}"

Extract:
- sentiment: Is the overall review positive, negative, or neutral?
- rating: What rating (1-5 stars) does this review suggest?
- keyPoints: What are the main points (pros/cons) mentioned?
- summary: A brief 1-2 sentence summary
- recommendsPurchase: Would the reviewer recommend buying?`;

  for await (const message of query({
    prompt,
    options: {
      // use JSON Schema for structured output
      outputFormat: {
        type: "json_schema",
        schema: ProductReviewJSONSchema,
      },
    },
  })) {
    if (message.type === "result" && message.subtype === "success" && message.structured_output) {
      // Validate with Zod for type safety
      return ProductReviewSchema.parse(message.structured_output);
    }
  }

  throw new Error("Failed to get structured output from agent");
}
