# Solution: Evaluating Agentic Systems - Sentiment Analysis

## Project Structure

```
src/
├── sentiment-tool.ts    # Custom MCP tool (Lesson 6 pattern)
├── types.ts             # Zod schemas + test cases (Lesson 7 pattern)
├── sentiment-agent.ts   # Agent with trace capture
├── index.ts             # Evaluation runner
└── evaluators/
    └── index.ts         # 3 evaluators implemented
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

## Run

```bash
npm start    # Run sentiment agent with evaluations
```

## What You'll See

The solution runs 5 test cases through the sentiment agent. Each is assessed by three evaluators:

| Evaluator | What It Checks | Scoring |
|-----------|----------------|---------|
| **Tool Call** | Agent called `analyze_sentiment` with text param | 0-1 based on correctness |
| **Schema Validity** | Output matches SentimentAnalysisSchema | 0-1 based on field validity |
| **Accuracy** | Detected sentiment matches expected | 1=match, 0.5=neutral, 0=opposite |

Output includes per-test evaluator results, overall scores, and a summary with per-evaluator pass rates.

## Key Takeaway

Agent evaluation follows a consistent pattern: capture a trace of agent behavior (tool calls and structured output), then run evaluators that check correctness at multiple levels -- tool usage, output schema conformance, and result accuracy. Partial credit scoring enables nuanced assessment beyond simple pass/fail.
