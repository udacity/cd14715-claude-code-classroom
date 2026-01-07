/**
 * Demo: Structured Outputs - Product Review Analyzer
 *
 * Tests for the product review analyzer using Zod schemas.
 */

import "dotenv/config";
import {
  analyzeProductReview,
  ProductReviewSchema,
  ProductReviewJSONSchema,
  ProductReview,
} from "./product-review-analyzer.js";
import { sampleReviews } from "./sample-reviews.js";


// -----------------------------------------------------------------------------
// Test case: Analyze a positive review
// -----------------------------------------------------------------------------

async function analyzePositiveReview() {

  const review = sampleReviews.find(r => r.expectedSentiment === "positive");
  if (!review) {
    throw new Error("No positive review found");
  }

  const result = await analyzeProductReview(review.text);
  console.log("Structured Output:");
  console.log(`  Sentiment: ${result.sentiment}`);  
  console.log(`  Rating: ${result.rating}/5`);
  console.log(`  Key Points: ${result.keyPoints.join(", ")}`);
  console.log(`  Summary: ${result.summary}`);
  console.log(`  Recommends: ${result.recommendsPurchase}`);
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

  await analyzePositiveReview();
  typeSafety();
}

main().catch(console.error);
