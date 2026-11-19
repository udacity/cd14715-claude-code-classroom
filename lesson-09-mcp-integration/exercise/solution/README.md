# Solution: MCP Integration - Code Quality Reviewer

Analyze JavaScript files for code quality using ESLint MCP.

## Project Structure

```
solution/
├── src/
│   ├── config/
│   │   └── mcp.config.ts       # ESLint MCP configuration
│   ├── sample-code/
│   │   ├── clean.js            # Well-written code
│   │   ├── issues.js           # Code with common issues
│   │   └── errors.js           # Code with multiple errors
│   ├── sample-code.ts          # File paths
│   ├── code-reviewer.ts        # Completed implementation
│   └── index.ts                # Test runner
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
# From this directory (lesson-09-mcp-integration/exercise/solution)
npm start
```

## What You'll See

The agent connects to the ESLint MCP server, lints the `issues.js` sample file, and produces a structured quality report including:

- **Filename** and **quality score** (0-100)
- **Issues** with line/column, severity, rule name, message, and fix suggestion
- **Summary** with counts of errors, warnings, and infos
- **Categories** breaking down issues into formatting, best practices, potential bugs, and other
- **Recommendations** for improving the code

The MCP server connection status is logged on startup, tool use events are visible during analysis, and the final report is validated against a Zod schema.

## Key Takeaway

ESLint MCP enables automated code quality analysis. Configure the MCP server via `mcpServers`, use `mcp__eslint__lint` as an allowed tool, and combine with `outputFormat` and Zod validation to get type-safe structured reports.
