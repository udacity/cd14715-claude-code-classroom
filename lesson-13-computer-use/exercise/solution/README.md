# Solution: Form Automation Agent

## Project Structure

```
src/
├── index.ts           # Entry point and demo runner
├── form-agent.ts      # Complete agent implementation
├── action-handlers.ts # Mock action execution
└── types.ts           # Type definitions
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

In Vocareum workspace, `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` are **already configured** in your environment -- the `.env` file only needs to provide `ANTHROPIC_MODEL`.

For local development, also uncomment and fill in your credentials in `.env`:
```
ANTHROPIC_API_KEY=your-key-here
ANTHROPIC_BASE_URL=your-base-url-here
```

**Troubleshooting:**
- **`Error: ANTHROPIC_MODEL is not set`** -- make sure you ran `cp .env.example .env`
- **`Error: API key not found`** -- in Vocareum this is pre-configured; locally, set `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` in `.env`

## Run

```bash
npm start
```

## What You'll See

1. Configuration display (tool settings, form data, safety config)
2. Agent loop iterations with actions (screenshot, click, type, etc.)
3. Final result reporting success, action count, and submission status

## Key Takeaway

The computer use agent loop sends tasks to Claude with the `computer-use-2025-01-24` beta, processes `tool_use` blocks to execute GUI actions, returns screenshots as base64 image content for visual feedback, and continues until `end_turn` or the action limit is reached.
