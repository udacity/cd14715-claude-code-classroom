# Demo: Multi-Agent Orchestration - Research Assistant

## Scenario

A research assistant needs to investigate topics thoroughly. Instead of one generalist agent, we use three specialists coordinated by an orchestrator:
- **Researcher**: Gathers information using web search
- **Analyzer**: Finds patterns and insights in data
- **Summarizer**: Creates final reports

The orchestrator coordinates these subagents in sequence, combining their outputs into a comprehensive research report.

## Project Structure

```
demo/
├── src/
│   ├── research-orchestrator.ts  # Orchestrator with subagent definitions
│   └── index.ts                  # Demo runner
├── .env.example                  # Environment template
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
# From this directory (lesson-10-multi-agent-orchestration/demo)
npm start
```

## What You'll See

1. The orchestrator invokes the **researcher** subagent to gather information via web search
2. The **analyzer** subagent identifies patterns and insights from the research
3. The **summarizer** subagent creates a final report
4. Console output shows each subagent invocation with elapsed time
5. A comprehensive research report with executive summary, key findings, analysis, and recommendations

## Key Takeaway

Use the `agents` parameter in `query()` to define subagents, then give the orchestrator `Task` in `allowedTools` so it can invoke them. Each subagent has its own description, prompt, tools, and model — the orchestrator coordinates their outputs into a final result.
