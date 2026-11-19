# Solution: Structured Outputs - Meeting Notes Analyzer

## Project Structure

```
solution/
├── src/
│   ├── index.ts              # Test runner
│   ├── meeting-analyzer.ts   # Complete implementation
│   └── sample-transcripts.ts # Test transcripts
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
# From this directory (lesson-07-structured-outputs/exercise/solution)
npm start
```

## What You'll See

1. A sprint planning meeting transcript is analyzed using structured outputs
2. The agent extracts `date`, `participants`, `topic`, `actionItems`, `decisions`, and `summary`
3. Each action item includes `task`, `assignee`, `dueDate`, and `priority`
4. Each decision includes `decision`, `rationale`, and `impact`

## Key Takeaway

Structured outputs with Zod schemas ensure predictable, validated data extraction. The `.describe()` calls on Zod fields guide the LLM on what to extract, and `zodToJsonSchema()` converts Zod schemas for the `outputFormat` option in `query()`.
