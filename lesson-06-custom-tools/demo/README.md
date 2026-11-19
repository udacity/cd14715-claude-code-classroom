# Demo: Custom Tools - Multiple Tools with External API Integration

Build custom tools for agents using the Claude Agent SDK.

## Scenario

An application needs agents to:
1. Calculate tax amounts and tips with proper decimal precision
2. Fetch real-time weather data from external APIs

We build multiple custom tools (`calculate_tax`, `calculate_tip`, and `get_weather`) in a single MCP server using `createSdkMcpServer`, demonstrating both local calculations and external API integration.

## Project Structure

```
src/
├── tax-calculator.ts       # Custom tool server with multiple tools (deliverable)
├── tax-calculator.test.ts  # Unit tests for business logic (no API calls)
├── thinking-with-tools.ts  # Extended thinking + tool use demo
└── index.ts                # Agent integration tests
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
# From this directory (lesson-06-custom-tools/demo)
npm start

# Run unit tests (no API calls, fast)
npm run test:unit

# Run extended thinking + tools demo
npm run start:thinking
```

## What You'll See

**Test 1 — Single Tool Usage:** The agent uses `calculate_tax` to compute 8.5% sales tax on a $150 purchase, returning subtotal, tax, and total with cent-level precision.

**Test 2 — Multiple Tools:** Given a dinner bill, the agent automatically chooses between `calculate_tax` and `calculate_tip` based on the task, demonstrating tool selection.

**Test 3 — External API Integration:** The agent calls `get_weather` to fetch real-time temperature data from the Open-Meteo API for San Francisco coordinates.

**Unit Tests:** The business logic functions (`calculateTax`, `calculateTip`) are tested directly without any API calls, verifying edge cases like negative amounts and invalid rates.

**Thinking + Tools:** Claude reasons transparently before and after tool calls, showing the interleaved thinking pattern: thinking -> tool_use -> thinking -> text.

## Key Takeaway

Custom tools extend agent capabilities with domain-specific logic. Use `createSdkMcpServer` with multiple `tool()` definitions to bundle related tools in one server. Extract business logic into separate exported functions for fast, API-free unit testing. Tools are exposed as `mcp__<server_name>__<tool_name>` and the agent automatically chooses the most appropriate one from the allowed list.