# Solution: Custom Tools - API Validator

## Project Structure

```
src/
├── api-validator.ts       # Custom tool server (deliverable)
├── api-validator.test.ts  # Unit tests for validation logic (no API calls)
└── index.ts               # Agent integration tests
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
# From this directory (lesson-06-custom-tools/exercise/solution)
npm start

# Run unit tests (no API calls, fast)
npm run test:unit
```

## What You'll See

**Test 1 — Basic API Validation:** The agent validates JSONPlaceholder's `/users/1` endpoint, checking for `id`, `name`, `email`, and `phone` fields with a 500ms SLA threshold.

**Test 2 — SLA Violation Detection:** The agent validates an endpoint with a 10ms SLA threshold, which should trigger an SLA violation warning since real network requests take longer.

**Test 3 — Missing Fields Detection:** The agent checks for `nonExistentField` and `anotherMissingField` on a real endpoint, detecting them as breaking changes.

**Unit Tests:** The `validateApiResponse` function is tested directly with mocked fetch, covering successful responses, missing fields, HTTP errors, and extra field detection without any network calls.

## Key Takeaway

Custom tools extend agent capabilities with domain-specific logic. Use `createSdkMcpServer` and `tool()` helper to create MCP-compatible tools that agents can use. Extract business logic into testable functions for fast, API-free testing during development.