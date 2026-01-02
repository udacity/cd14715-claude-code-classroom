# Exercise: MCP Integration - Code Quality Reviewer

Analyze JavaScript files for code quality using ESLint MCP.

## Scenario

Your development team submits code for review, but manual code quality checks are inconsistent. Build an agent that uses the ESLint MCP server to analyze JavaScript files and provide detailed quality reports.

## Project Structure

```
exercise/
├── src/
│   ├── config/
│   │   └── mcp.config.ts       # ESLint MCP configuration
│   ├── sample-code/
│   │   ├── clean.js            # Well-written code
│   │   ├── issues.js           # Code with common issues
│   │   └── errors.js           # Code with multiple errors
│   ├── sample-code.ts          # File paths
│   ├── code-reviewer.ts        # Exported function (deliverable)
│   └── index.ts                # Test
└── README.md
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

## Deliverable: code-reviewer.ts

```typescript
export async function reviewCodeFile(
  filePath: string
): Promise<CodeQualityReport>
```

## Key Pattern: Using ESLint MCP

```typescript
for await (const message of query({
  prompt: `Analyze the JavaScript file at: ${filePath}`,
  options: {
    mcpServers: {
      eslint: {
        type: "stdio",
        command: "npx",
        args: ["-y", "@eslint/mcp@latest"],
      },
    },
    allowedTools: ["mcp__eslint__lint", "Read"],
  },
})) { ... }
```

## Sample Code Files

| File | Description | Expected Issues |
|------|-------------|-----------------|
| clean.js | Well-written code | None |
| issues.js | Common issues | no-var, no-eval, no-console |
| errors.js | Multiple errors | no-var, no-cond-assign |

## MCP Tool

| Tool | Description |
|------|-------------|
| `mcp__eslint__lint` | Lint JavaScript files using ESLint |

## Key Takeaway

ESLint MCP enables automated code quality analysis. Pass the file path to the agent, it uses `mcp__eslint__lint` to analyze the file, and returns a structured report with issues, scores, and recommendations.
