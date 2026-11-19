# Exercise: Claude Model Selection - Support Ticket Classifier

## Objective

Build a support ticket classification system that intelligently routes requests to different Claude models based on complexity.

## Learning Goals

- Understand when to use Haiku vs Sonnet vs Opus
- Compare model performance, cost, and latency trade-offs
- Implement intelligent model routing based on task complexity
- Practice using helper utilities to measure and display results

## Project Structure

```
src/
├── classifier.ts     # Main exercise file (4 steps to complete)
├── helpers.ts        # Utility functions (cost, stats, comparison)
├── models.ts         # Model definitions & pricing
└── sample-tickets.ts # Test data
```

## Setup

```bash
npm install
```

## Authentication Setup

Copy `.env.example` to `.env` (required in all environments):
```bash
cp .env.example .env
```

In Vocareum workspace, `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` are **already configured** in your environment — the `.env` file only needs to provide `ANTHROPIC_MODEL`.

For local development, also uncomment and fill in your credentials in `.env`.

**Troubleshooting:**
- **`Error: ANTHROPIC_MODEL is not set`** — make sure your `.env` file exists and contains a valid model name
- **`Error: API key not found`** — in Vocareum this is pre-configured; locally, set `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` in `.env`

## Your Tasks

Complete the `classifier.ts` file by implementing the four test functions:

### Step 1: Haiku for Simple Classification
- Implement `testHaiku()` function
- Use Haiku model for fast, simple priority classification
- Classification only: "LOW", "MEDIUM", "HIGH", or "URGENT"

### Step 2: Sonnet for Detailed Analysis
- Implement `testSonnet()` function
- Use Sonnet for balanced quality/cost analysis
- Extract: priority, category, details, recommended action

### Step 3: Opus for Complex Reasoning
- Implement `testOpus()` function
- Use Opus for multi-factor reasoning
- Provide: summary, root cause, impact assessment, action plan

### Step 4: Compare Models
- Implement `testCompare()` function
- Run all three models on the same moderate ticket
- Compare time, tokens, and cost using the `displayComparison()` helper

## Run

```bash
# From this directory (lesson-01-model-selection/exercise/starter)
npm start
```

## Success Criteria

- [ ] Step 1 completes with Haiku model
- [ ] Step 2 completes with Sonnet model
- [ ] Step 3 completes with Opus model
- [ ] Step 4 shows comparison table
- [ ] Cost calculations are accurate
- [ ] Timing measurements are shown
