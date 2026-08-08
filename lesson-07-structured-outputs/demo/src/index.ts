/**
 * Demo: Structured Outputs - Product Review Analyzer
 *
 * Tests for the product review analyzer using Zod schemas.
 */

import "dotenv/config";
import {
    analyzeProductReviewWithStructuredOutput,
    ProductReviewSchema,
    ProductReviewJSONSchema,
    ProductReview, analyzeProductReviewWithTextOutput,
} from "./product-review-analyzer.js";
import { sampleReviews } from "./sample-reviews.js";

// -----------------------------------------------------------------------------
// Test case: Analyze a positive review
// -----------------------------------------------------------------------------

async function analyzeReviewByExpectedSentiment(sentiment: string) {

    const review = sampleReviews.find(r => r.expectedSentiment === sentiment);
    if (!review) {
        throw new Error("No positive review found");
    }

    let result = await analyzeProductReviewWithStructuredOutput(review.text);

    console.log("=".repeat(60))
    console.log("Structured Output:");
    console.log("=".repeat(60))
    console.log(`  Sentiment: ${result.sentiment}`);
    console.log(`  Rating: ${result.rating}/5`);
    console.log(`  Key Points: ${result.keyPoints.join(", ")}`);
    console.log(`  Summary: ${result.summary}`);
    console.log(`  Recommends: ${result.recommendsPurchase}`);

    console.log("=".repeat(60))
    console.log("Text Output:");
    console.log("=".repeat(60))
    result = await analyzeProductReviewWithTextOutput(review.text);
    console.log(`  Text Result: ${result}`);
}

// -----------------------------------------------------------------------------
// Test case: Demonstrate type safety
// -----------------------------------------------------------------------------

function typeSafety() {
  // Example of a valid result
  const validResult: ProductReview = {
    sentiment: "positive",
    rating: 4,
    keyPoints: ["Great performance", "Good value"],
    summary: "A solid product that meets expectations.",
    recommendsPurchase: true,
  };

  // Validate with Zod
  const parsed = ProductReviewSchema.safeParse(validResult);
  console.log(`Valid result parses: ${parsed.success}`);

  // Example of invalid data
  const invalidResult = {
    sentiment: "amazing", // Invalid enum value
    rating: 6, // Out of range
    keyPoints: [],
    summary: "Test",
    recommendsPurchase: "yes", // Wrong type
  };

  const invalidParsed = ProductReviewSchema.safeParse(invalidResult);
  console.log(`Invalid result parses: ${invalidParsed.success}`);
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  DEMO: Structured Outputs - Product Review Analyzer");
  console.log("  Using Zod schemas for reliable data extraction");
  console.log("=".repeat(60));

  Array.of("positive", "negative", "neutral").forEach(async (s) => await analyzeReviewByExpectedSentiment(s))
  typeSafety();
}

main().catch(console.error);
