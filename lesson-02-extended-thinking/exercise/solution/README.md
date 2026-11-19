# Solution: Extended Thinking for Fraud Detection

Complete implementation of a fraud detection analyzer with compliance-grade reasoning trails.

## Project Structure

```
src/
├── fraud-analyzer.ts      # Completed analyzeFraudRisk() implementation
├── sample-transactions.ts # 5 test transactions with different risk levels
└── index.ts               # Tests for the implementation
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
# From this directory (lesson-02-extended-thinking/exercise/solution)
npm start
```

## What You'll See

| Step | Description |
|------|-------------|
| 1 | Baseline analysis WITHOUT extended thinking — final answer only, no audit trail |
| 2 | Analysis WITH extended thinking — fraud assessment plus captured thinking steps for compliance |

## Key Takeaway

Extended thinking provides transparent reasoning for high-stakes decisions. The audit trail helps compliance teams defend decisions to regulators.
