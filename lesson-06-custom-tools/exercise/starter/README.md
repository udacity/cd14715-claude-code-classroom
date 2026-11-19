# Exercise: Custom Tools - API Validator

Build a custom MCP tool that validates API responses, measures latency, and checks for SLA compliance.

## Objective

Implement the validation logic and tool server in `src/api-validator.ts`. The tool makes HTTP requests, checks response schemas against expected fields, measures latency against SLA thresholds, and detects breaking changes.

## Learning Goals

- Create custom tools using `createSdkMcpServer` and `tool()` helper
- Define tool schemas with Zod for input validation
- Make HTTP requests with `fetch()` and handle errors
- Return structured results from custom tools
- Understand the `mcp__<server>__<tool>` naming convention

## Project Structure

```
src/
├── api-validator.ts  # YOUR IMPLEMENTATION (has TODOs)
└── index.ts          # Agent integration tests (do not modify)
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

Complete the TODOs in `src/api-validator.ts`:

### Step 1: Create Fetch Options

Build a `RequestInit` object with the HTTP method, merged headers (`Content-Type: application/json` plus any custom headers), and body (only for POST/PUT).

### Step 2: Make the HTTP Request

Call `fetch(apiUrl, fetchOptions)` and capture the response status code. Calculate latency using `Date.now() - start`.

### Step 3: Parse Response JSON

Wrap `response.json()` in a try/catch. If parsing fails, record a schema error.

### Step 4: Check Expected Fields

Compare `Object.keys(responseData)` against `expectedFields`. Missing fields are breaking changes.

### Step 5: Detect Extra Fields

Find fields in the response that are not in `expectedFields`. These are potential data leakage warnings.

### Step 6: Validate Status Code

Non-2xx status codes should be recorded as schema errors.

### Step 7: Check SLA Performance

Compare actual latency against `maxLatencyMs`. Add a warning if the SLA is exceeded.

### Step 8: Return ValidationResult

Build and return the complete `ValidationResult` object with all validation findings.

### Step 9: Handle Network Errors

In the catch block, return a `ValidationResult` with appropriate error information for fetch failures.

### Step 10: Create the Tool Server

Wire up `validateApiResponse` as an MCP tool using `createSdkMcpServer` and `tool()`. Export as `apiValidatorServer`. The tool handler should call your validation function and return the result as JSON.

## Run

```bash
# From this directory (lesson-06-custom-tools/exercise/starter)
npm start
```

## Success Criteria

- [ ] Tool server exports `apiValidatorServer`
- [ ] Tool validates API responses successfully
- [ ] Missing expected fields detected as breaking changes
- [ ] Extra fields detected as warnings
- [ ] HTTP errors properly reported
- [ ] SLA violations detected when latency exceeds threshold
- [ ] Network errors handled gracefully
- [ ] All three agent integration tests pass

## Bonus: Unit Testing Your Tool

Extract your validation logic into a separate exported function so you can unit test it without running the agent:

```typescript
// Export the validation function for testing
export async function validateApiResponse(...): Promise<ValidationResult> {
  // Your validation logic here
}

// Tool handler calls the exported function
tool("validate_api_response", "...", schema, async (args) => {
  const result = await validateApiResponse(/* ... */);
  return { content: [{ type: "text", text: JSON.stringify(result) }] };
});
```

Then create `api-validator.test.ts` to test your validation logic directly:

```bash
# Run unit tests (no API calls, fast iteration)
npm run test:unit

# Run agent integration tests (requires API key)
npm run test
```

See the solution for comprehensive unit test examples.
