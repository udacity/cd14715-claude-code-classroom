# Product Review Analyzer

Enforce structured outputs from agents using Zod schemas.

## Overview

In this demo, we'll learn how to use Zod schemas and JSON Schema to enforce structured outputs from agents. This ensures reliability, enables type safety, and makes agent responses directly usable by your application without manual parsing.

## Scenario

A product review analyzer needs to extract sentiment, rating, key points, and purchase recommendations from review text. Free-form responses are unreliable and hard to parse. We'll use structured outputs to guarantee consistent data.

## What You'll Learn

- Why structured outputs matter for production systems
- How to define output schemas with Zod
- Converting Zod schemas to JSON Schema for API use
- Using `outputFormat` in `query()` calls
- Automatic validation and type safety

## Prerequisites

- Node.js 18+
- Anthropic API Key
- Completed Lesson 06 (Custom Tools)

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```bash
ANTHROPIC_API_KEY=your-api-key-here
```

## Running the Demo

```bash
npm start
```

## Project Structure

```
demo/
├── src/
│   └── index.ts              # Structured output implementation
├── package.json
└── README.md
```

## Key Concepts

### 1. Define Output Structure with Zod

```typescript
import { z } from 'zod';

const ProductReviewSchema = z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral'])
    .describe('Overall sentiment of the review'),

  rating: z.number()
    .min(1)
    .max(5)
    .describe('Numerical rating from 1-5 stars'),

  keyPoints: z.array(z.string())
    .min(1)
    .max(5)
    .describe('Main points mentioned in review'),

  summary: z.string()
    .max(200)
    .describe('Brief summary of the review'),

  recommendsPurchase: z.boolean()
    .describe('Whether reviewer recommends buying the product')
});

type ProductReview = z.infer<typeof ProductReviewSchema>;
```

### 2. Convert to JSON Schema

```typescript
import zodToJsonSchema from 'zod-to-json-schema';

const ProductReviewJSONSchema = zodToJsonSchema(
  ProductReviewSchema,
  'ProductReviewSchema'
);
```

### 3. Use Structured Output in query()

```typescript
const result = await query(
  'Analyze this product review: "Great laptop! Fast processor..."',
  {
    model: 'claude-sonnet-4-5-20250929',
    outputFormat: {
      type: 'json',
      schema: ProductReviewJSONSchema
    }
  }
);
```

### 4. Validate and Parse Response

```typescript
for await (const message of result) {
  if (message.type === 'result' && message.structured_output) {
    const review = ProductReviewSchema.parse(message.structured_output);
    console.log(review.sentiment);  // 'positive'
    console.log(review.rating);     // 4
  }
}
```

## Unstructured vs Structured

**Unstructured (error-prone):**
```typescript
const text = await getAgentResponse();
// "The review is positive. Rating: 4/5..."
const ratingMatch = text.match(/Rating: (\d)/);
// Fragile regex parsing
```

**Structured (reliable):**
```typescript
const review = ProductReviewSchema.parse(structuredOutput);
const rating = review.rating; // Guaranteed number 1-5
// Type-safe, validated, consistent
```

## Key Takeaway

Structured outputs with Zod schemas provide reliability, type safety, and automatic validation. Define your desired output structure as a Zod schema, convert to JSON Schema, and use `outputFormat` in `query()`. The agent will return data in exactly the format you specified.
