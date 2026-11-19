# Demo: Claude Agent SDK - Document Summarizer

Build your first agent using the Claude Agent SDK to read files and produce structured summaries.

## Scenario

A documentation team needs an automated summarizer that can read files, extract key points, and produce structured summaries. Using the Agent SDK's `query()` function with the `Read` tool, the agent handles file access and content analysis automatically -- no manual tool-call handling required.

## Project Structure

```
src/
├── document-summarizer.ts # Agent function (deliverable)
├── sample-api-guide.md    # Test document
└── index.ts               # Test runner
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
# From this directory (lesson-05-agent-sdk/demo)
npm start
```

## What You'll See

| Step | Description |
|------|-------------|
| 1 | Agent reads `sample-api-guide.md` using the Read tool |
| 2 | Agent extracts 3-5 key points and a concise summary |
| 3 | Structured `DocumentSummary` object is returned |

## Key Takeaway

The Claude Agent SDK simplifies building agentic systems by handling tool execution automatically. Call `query()` with `allowedTools`, iterate the results, and the agent manages the entire ReAct loop -- reading files, analyzing content, and returning structured output without any manual tool-call handling.
