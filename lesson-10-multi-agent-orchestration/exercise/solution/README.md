# Solution: Multi-Agent Orchestration - Sales Opportunity Qualifier

## Project Structure

```
solution/
├── src/
│   ├── sales-qualifier.ts    # Completed implementation
│   ├── sample-prospects.ts   # Test data
│   └── index.ts              # Test runner
├── .env.example              # Environment template
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
# From this directory (lesson-10-multi-agent-orchestration/exercise/solution)
npm start
```

## What You'll See

1. The orchestrator invokes the **company-researcher** subagent to gather company intelligence via web search
2. The **competitive-analyzer** subagent assesses the prospect's competitive position
3. The **qualification-scorer** subagent evaluates BANT criteria and calculates deal metrics
4. Console output shows each subagent invocation with elapsed time
5. A structured sales briefing with company profile, competitive analysis, BANT qualification, recommendation, and talking points

## Key Takeaway

Combine the subagents pattern with structured outputs to create comprehensive business intelligence systems. The orchestrator coordinates multiple specialists via `Task`, and returns validated structured data via `outputFormat`.
