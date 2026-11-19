# Exercise: Evaluating Agentic Systems - Sentiment Analysis

**Estimated Time: 15 minutes**

## Objective

Build evaluators to assess a sentiment analysis agent. The agent and tool are provided -- your task is to implement three evaluators that verify the agent's behavior.

## Learning Goals

- Implement evaluators that check tool usage, schema validity, and output accuracy
- Use Zod's `safeParse()` to validate agent output against a schema
- Apply partial credit scoring for nuanced evaluation results

## Project Structure

```
src/
├── sentiment-tool.ts    # Custom MCP tool (provided)
├── types.ts             # Zod schemas + test cases (provided)
├── sentiment-agent.ts   # Agent with trace capture (provided)
├── index.ts             # Evaluation runner (provided)
└── evaluators/
    └── index.ts         # YOUR IMPLEMENTATION
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

For local development, also uncomment and fill in your credentials in `.env`:
```
ANTHROPIC_API_KEY=your-key-here
ANTHROPIC_BASE_URL=your-base-url-here
```

**Troubleshooting:**
- **`Error: ANTHROPIC_MODEL is not set`** — make sure you ran `cp .env.example .env`
- **`Error: API key not found`** — in Vocareum this is pre-configured; locally, set `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` in `.env`

## Your Tasks

Implement three evaluators in `src/evaluators/index.ts`:

### 1. Tool Call Evaluator

Verify the agent called the correct tool with proper parameters.

```typescript
// Check if mcp__sentiment-analyzer__analyze_sentiment was called
// Verify the text parameter was provided
// Return score: 0 = no calls, 0.25 = wrong tool, 0.5 = missing text, 1 = correct
```

### 2. Schema Validity Evaluator

Verify the output matches the Zod schema.

```typescript
// Use SentimentAnalysisSchema.safeParse() to validate
// Check all required fields: text, sentiment, confidence, keywords, explanation
// Return score = valid fields / total fields
```

### 3. Accuracy Evaluator

Verify the detected sentiment matches the expected value.

```typescript
// Compare result.sentiment with testCase.expectedSentiment
// Score: 1 = exact match, 0.5 = neutral when expecting positive/negative, 0 = opposite
```

Each evaluator returns:
```typescript
interface EvaluatorResult {
  name: string;      // e.g., "Tool Call Evaluator"
  passed: boolean;   // true if all checks pass
  score: number;     // 0 to 1 (partial credit possible)
  details: string;   // human-readable explanation
}
```

## Run

```bash
npm start    # Runs agent + evaluations (will show "Not implemented" until you complete the TODOs)
```

## Success Criteria

- All 5 test cases run through the agent
- Tool Call Evaluator passes for each test case
- Schema Validity Evaluator passes for each test case
- Accuracy Evaluator passes for each test case (agent correctly classifies sentiment)
