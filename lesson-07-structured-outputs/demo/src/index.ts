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
// Step 1: Show the schema structure
// -----------------------------------------------------------------------------

function step1_showSchema() {
  console.log("\n--- STEP 1: Show Schema Structure ---\n");

  console.log("Zod Schema Fields:");
  console.log("  - sentiment: enum ['positive', 'negative', 'neutral']");
  console.log("  - rating: number (1-5)");
  console.log("  - keyPoints: string[] (1-5 items)");
  console.log("  - summary: string (max 200 chars)");
  console.log("  - recommendsPurchase: boolean");

  console.log("\nJSON Schema (for API):");
  console.log(JSON.stringify(ProductReviewJSONSchema, null, 2));

  console.log("\n-> Zod schema defines structure, converts to JSON Schema for API");
}

// -----------------------------------------------------------------------------
// Step 2: Analyze a positive review
// -----------------------------------------------------------------------------

async function step2_analyzePositive() {
  console.log("\n--- STEP 2: Analyze Positive Review ---\n");

  const review = sampleReviews[0];
  console.log(`Input: "${review.text.substring(0, 60)}..."\n`);

  const result = await analyzeProductReview(review.text);

  console.log("Structured Output:");
  console.log(`  Sentiment: ${result.sentiment}`);
  console.log(`  Rating: ${result.rating}/5`);
  console.log(`  Key Points: ${result.keyPoints.join(", ")}`);
  console.log(`  Summary: ${result.summary}`);
  console.log(`  Recommends: ${result.recommendsPurchase}`);

  console.log("\n-> Output is validated, typed, and ready to use!");
}

// -----------------------------------------------------------------------------
// Step 3: Analyze multiple reviews
// -----------------------------------------------------------------------------

async function step3_analyzeMultiple() {
  console.log("\n--- STEP 3: Analyze Multiple Reviews ---\n");

  for (const review of sampleReviews) {
    console.log(`${review.name}:`);

    const result = await analyzeProductReview(review.text);

    console.log(`  Sentiment: ${result.sentiment} (expected: ${review.expectedSentiment})`);
    console.log(`  Rating: ${result.rating}/5`);
    console.log(`  Recommends: ${result.recommendsPurchase}\n`);
  }

  console.log("-> All reviews analyzed with consistent structure!");
}

// -----------------------------------------------------------------------------
// Step 4: Demonstrate type safety
// -----------------------------------------------------------------------------

function step4_typeSafety() {
  console.log("\n--- STEP 4: Type Safety Benefits ---\n");

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

  if (!invalidParsed.success) {
    console.log("\nValidation errors caught:");
    invalidParsed.error.errors.forEach((err) => {
      console.log(`  - ${err.path.join(".")}: ${err.message}`);
    });
  }

  console.log("\n-> Zod catches invalid data at runtime!");
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  DEMO: Structured Outputs - Product Review Analyzer");
  console.log("  Using Zod schemas for reliable data extraction");
  console.log("=".repeat(60));

  step1_showSchema();
  await step2_analyzePositive();
  await step3_analyzeMultiple();
  step4_typeSafety();

  console.log("\n" + "=".repeat(60));
  console.log("  KEY TAKEAWAYS");
  console.log("=".repeat(60));
  console.log(`
  STRUCTURED OUTPUT PATTERN:
  1. Define output schema with Zod
  2. Convert to JSON Schema: zodToJsonSchema()
  3. Pass to query() via outputFormat option
  4. Access result.structured_output
  5. Validate with Zod for type safety

  BENEFITS:
  - Consistent, predictable output format
  - Type-safe data in TypeScript
  - Runtime validation catches errors
  - No brittle regex/text parsing
  - Direct integration with applications
`);
}

main().catch(console.error);
