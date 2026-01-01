# Exercise: Custom Tools - API Validator

Build a custom tool that validates API responses and checks SLA compliance.

## Scenario

Your engineering team needs to validate that API responses match expected schemas, measure latency, and detect breaking changes. This tool will be used in CI/CD pipelines.

## Project Structure

```
src/
├── api-validator.ts  # Exported tool (deliverable)
└── index.ts          # Tests for the tool
```

## Setup

```bash
npm install
```

Create `.env`:
```
ANTHROPIC_API_KEY=your-key-here
```

## Run

```bash
npm start
```

## Deliverable: api-validator.ts

```typescript
export interface ValidationResult {
  success: boolean;
  statusCode: number;
  latencyMs: number;
  schemaValid: boolean;
  schemaErrors: string[] | null;
  performanceIssues: {
    exceedsSLA: boolean;
    slaThresholdMs: number;
    actualLatencyMs: number;
  };
  breakingChanges: string[] | null;
  warnings: string[];
}

export const apiValidatorServer: SdkMcpServer;
export async function validateApiResponse(...): Promise<ValidationResult>;
```

## Tests (index.ts)

| Step | Description |
|------|-------------|
| 1 | Test validator directly with public API |
| 2 | Use validator with agent via MCP server |
| 3 | Test various scenarios (SLA, missing fields) |

## Validation Checks

| Check | Description |
|-------|-------------|
| Status Code | 2xx = success |
| Expected Fields | Breaking change if missing |
| Extra Fields | Warning for data leakage |
| Latency | Compare against SLA threshold |

## Test Scenarios

1. Valid API response within SLA
2. Missing expected field (breaking change)
3. Strict SLA threshold exceeded

## Key Takeaway

Custom validation tools provide detailed diagnostics. Clear error messages help engineers quickly identify issues. Tools integrated into CI/CD prevent breaking changes from reaching production.
