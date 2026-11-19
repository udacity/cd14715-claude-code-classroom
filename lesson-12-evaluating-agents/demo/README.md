# Demo: Evaluating Agentic Systems - Tip Calculator

**Estimated Time: 10 minutes**

## Scenario

Build evaluators for a tip calculator agent. The agent uses a custom MCP tool to calculate tips, then three evaluators assess its behavior: verifying correct tool usage, schema-valid output, and accurate math.

## Project Structure

```
src/
├── tip-calculator.ts    # Custom MCP tool (Lesson 6 pattern)
├── types.ts             # Zod schemas + test cases (Lesson 7 pattern)
├── tip-agent.ts         # Agent with trace capture
├── index.ts             # Evaluation runner
└── evaluators/
    └── index.ts         # 3 evaluators
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
npm start    # Run tip calculator agent with evaluations
```

## What You'll See

The demo runs three test cases through the agent and evaluates each with three evaluators:

| Evaluator | What It Checks | Partial Scores |
|-----------|----------------|----------------|
| **Tool Call** | Correct tool + parameters | 0.25=wrong tool, 0.5=missing params, 0.75=wrong values |
| **Schema Validity** | All Zod fields valid | Score = valid fields / total fields |
| **Calculation Accuracy** | tip, total, perPerson match expected | Score = correct calcs / 3 |

Test cases:

| Bill | Tip % | Split | Expected Tip | Expected Total |
|------|-------|-------|--------------|----------------|
| $50 | 15% | 1 | $7.50 | $57.50 |
| $120 | 20% | 4 | $24.00 | $144.00 |
| $85.50 | 18% | 2 | $15.39 | $100.89 |

Each test prints evaluator pass/fail status and an overall score percentage, followed by an evaluation summary.

## Key Takeaway

Evaluators enable systematic assessment of agent behavior. By capturing traces (tool calls + outputs), you can verify the agent uses tools correctly, outputs conform to schemas, and results are accurate. This pattern scales to any agent -- define test cases, capture traces, and run evaluators.
