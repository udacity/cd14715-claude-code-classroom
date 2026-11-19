# Demo: MCP Integration - GitHub File Summarizer

Fetch and summarize files from GitHub repositories using MCP.

## Scenario

Your team needs to quickly understand files from various GitHub repositories. Build an agent that uses the GitHub MCP server to fetch file contents and provide summaries.

## Project Structure

```
demo/
├── src/
│   ├── github-summarizer.ts    # Summarizer agent using GitHub MCP
│   └── index.ts                # Test runner
├── .env.example
├── package.json
└── README.md
```

> **Note:** The demo configures the GitHub MCP server inline in `github-summarizer.ts` rather than using a separate config file. The exercise introduces a dedicated `config/mcp.config.ts` pattern.

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

In Vocareum workspace, `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` are **already configured** in your environment — the `.env` file only needs to provide `ANTHROPIC_MODEL` and `GITHUB_TOKEN`.

For local development, also uncomment and fill in your credentials in `.env`:
```
ANTHROPIC_API_KEY=your-key-here
ANTHROPIC_BASE_URL=your-base-url-here
```

**Troubleshooting:**
- **`Error: ANTHROPIC_MODEL is not set`** — make sure you ran `cp .env.example .env`
- **`Error: API key not found`** — in Vocareum this is pre-configured; locally, set `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` in `.env`
- **GitHub API errors** — set `GITHUB_TOKEN` in `.env` with a valid GitHub personal access token for higher rate limits

## Run

```bash
# From this directory (lesson-09-mcp-integration/demo)
npm start
```

## What You'll See

The agent connects to the GitHub MCP server, fetches the README.md from the `anthropics/claude-cookbooks` repository, and returns a structured summary including:

- **Repository and file path** identified
- **Purpose** of the file
- **Key sections** extracted from the content
- **Notable patterns** or techniques used
- **Brief summary** of the overall file

The output is validated against a Zod schema, demonstrating how MCP tool access and structured outputs work together.

## Key Takeaway

MCP provides standardized access to external tools. Configure the GitHub MCP server, pass it to `query()` via `mcpServers`, and specify allowed tools with the `mcp__` prefix. Combine with `outputFormat` and Zod schemas to get type-safe structured responses.
