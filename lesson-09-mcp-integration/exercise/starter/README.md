# Exercise: MCP Integration - Code Quality Reviewer

Analyze JavaScript files for code quality using ESLint MCP.

## Objective

Complete `src/config/mcp.config.ts` and `src/code-reviewer.ts` to implement `reviewCodeFile()`, which uses the ESLint MCP server to lint JavaScript files and return a structured quality report.

## Learning Goals

- Configure and connect to an MCP server in the Agent SDK
- Use the async generator input mode required for MCP/streaming
- Handle MCP server connection status from `init` messages
- Return structured output using Zod schemas

## Project Structure

```
starter/
├── src/
│   ├── config/
│   │   └── mcp.config.ts       # ESLint MCP configuration (has TODOs)
│   ├── sample-code/
│   │   ├── clean.js            # Well-written code
│   │   ├── issues.js           # Code with common issues
│   │   └── errors.js           # Code with multiple errors
│   ├── sample-code.ts          # File paths (provided)
│   ├── code-reviewer.ts        # YOUR IMPLEMENTATION (has TODOs)
│   └── index.ts                # Test runner (do not modify)
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

## Your Tasks

Complete the TODOs across two files:

### `src/config/mcp.config.ts` (Steps 1-2)

**Step 1:** Configure the ESLint MCP server using stdio transport. The server package is `@eslint/mcp@latest` and runs via `npx`. Fill in the `command` and `args` fields.

**Step 2:** Define the allowed ESLint MCP tools. MCP tools follow the naming convention `mcp__<server-name>__<tool-name>`. The ESLint MCP server provides a `lint` tool.

### `src/code-reviewer.ts` (Steps 1-3)

**Step 1:** Implement the `generateMessages()` async generator. MCP servers require streaming input mode. The generator should yield a single user message object with `type`, `message`, `parent_tool_use_id`, and `session_id` fields.

**Step 2:** Call `query()` with MCP configuration. Use the imported `mcpServersConfig` and `eslintTools` from `mcp.config.ts`. Pass them via the `options` object along with `model`, `allowedTools`, and `outputFormat` (using `CodeQualityReportJSONSchema`).

**Step 3:** Handle the message stream inside the `for await` loop. Check for three message types:

- `message.type === "init"` -- verify MCP server connection status; throw if any server has `"failed"` status
- `message.type === "assistant"` -- log any `tool_use` blocks for visibility
- `message.type === "result"` with `message.subtype === "success"` -- parse `message.structured_output` with `CodeQualityReportSchema` and return it

## Run

```bash
# From this directory (lesson-09-mcp-integration/exercise/starter)
npm start
```

## Success Criteria

- [ ] All 3 sample files are analyzed (clean.js, issues.js, errors.js)
- [ ] `clean.js` gets a high quality score (80+)
- [ ] `issues.js` and `errors.js` have issues detected with correct severity
- [ ] Each report includes `filename`, `qualityScore`, `issues`, `summary`, `categories`, `recommendations`
- [ ] MCP server connection confirmed before analysis
