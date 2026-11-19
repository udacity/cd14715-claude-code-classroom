# Demo: Structured Outputs - Product Review Analyzer

## Scenario

A product review analyzer needs to extract sentiment, rating, key points, and purchase recommendations from review text. Free-form responses are unreliable and hard to parse. We use structured outputs with Zod schemas to guarantee consistent, validated data.

## Project Structure

```
demo/
├── src/
│   ├── index.ts                    # Demo runner
│   ├── product-review-analyzer.ts  # Structured output implementation
│   └── sample-reviews.ts           # Test review data
├── .env.example
├── package.json
└── README.md
```

## Setup

```bash
# From repo root (shared node_modules)
npm install
```

## Authentication Setup

Copy `.env.example` to `.env` (required in all environments):
```bash
cp .env.example .env
```

In Vocareum workspace, `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` are **already configured** in your environment — the `.env` file only needs to provide `ANTHROPIC_MODEL`.

For local development, also uncomment and fill in your credentials in `.env`:
```
ANTHROPIC_API_KEY=your-key-here
ANTHROPIC_BASE_URL=your-base-url-here
```

**Troubleshooting:**
- **`Error: ANTHROPIC_MODEL is not set`** — make sure you ran `cp .env.example .env`
- **`Error: API key not found`** — in Vocareum this is pre-configured; locally, set `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` in `.env`

## Run

```bash
# From this directory (lesson-07-structured-outputs/demo)
npm start
```

## What You'll See

1. A positive product review is analyzed using the Claude Agent SDK with structured outputs
2. The agent returns validated fields: `sentiment`, `rating`, `keyPoints`, `summary`, and `recommendsPurchase`
3. A type safety demonstration shows Zod validating correct and incorrect data shapes

## Key Takeaway

Structured outputs with Zod schemas provide reliability, type safety, and automatic validation. Define your desired output structure as a Zod schema, convert to JSON Schema with `zodToJsonSchema()`, and use `outputFormat` in `query()`. The agent returns data in exactly the format you specified.