# Demo: Extended Thinking for Root Cause Analysis

Learn how extended thinking improves complex multi-step analysis by providing transparent reasoning trails.

## Scenario

An e-commerce platform has a sudden drop in checkout conversions. The ops team needs to investigate the root cause by correlating logs, deployment changes, and user reports. Extended thinking lets stakeholders see exactly how Claude reasons through the evidence.

## Project Structure

```
src/
├── incident-analyzer.ts  # Exported function: analyzeIncident()
├── sample-incidents.ts   # Test data with different incident types
└── index.ts              # Tests for the function
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
# From this directory (lesson-02-extended-thinking/demo)
npm start
```

## What You'll See

| Step | Description |
|------|-------------|
| 1 | Baseline analysis WITHOUT extended thinking — only a final answer, no reasoning trail |
| 2 | Analysis WITH extended thinking — full root cause analysis plus captured thinking steps |

## Key Takeaway

Extended thinking provides transparent reasoning that can be audited and explained to stakeholders. Use it for complex analysis where decisions have significant impact and you need to show your work.
