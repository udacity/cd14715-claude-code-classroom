# Enterprise Multi-Agent Code Review Orchestrator

Production-ready multi-agent system that automates code review, test coverage analysis, and refactoring suggestions for GitHub pull requests using Claude Agent SDK.

## Features

- **Multi-Agent Architecture**: Coordinates 3 specialized subagents for comprehensive PR analysis
- **Code Quality Analysis**: Security vulnerabilities, performance issues, best practices
- **Test Coverage Analysis**: Identifies untested code paths with extended thinking
- **Refactoring Suggestions**: Modernization opportunities and pattern improvements
- **MCP Integration**: GitHub and Eslint servers for external data access
- **Claude Skills**: Language-specific analysis (JavaScript, TypeScript, Python, Security)
- **Production-Grade**: Rate limiting, retry logic, structured logging, error handling

## Architecture

### Orchestrator
Main coordinator that:
1. Fetches PR files via GitHub MCP
2. Spawns 3 subagents in parallel for each file
3. Aggregates results into unified review report
4. Enforces rate limits and validates structured outputs

### Subagents

| Agent | Purpose | Key Features |
|-------|---------|--------------|
| **code-quality-analyzer** | Security, performance, maintainability | Invokes Claude Skills, severity-leveled feedback |
| **test-coverage-analyzer** | Identifies untested code paths | Extended thinking, priority-based suggestions |
| **refactoring-suggester** | Modernization and patterns | Before/after examples, impact assessment |

## Prerequisites

- Node.js 20+
- Anthropic API key
- GitHub personal access token
- TypeScript 5.3+

## Installation

```bash
# Clone repository
cd project/solution

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

## Configuration

Edit `.env` with your credentials:

```bash
ANTHROPIC_API_KEY=sk-ant-your-key-here
GITHUB_TOKEN=ghp_your-token-here

# REQUIRED: Absolute path to project root (contains .claude/skills/)
PROJECT_ROOT=/absolute/path/to/project/solution

LOG_LEVEL=info
```

### MCP Servers

Configured in [src/config/mcp.config.ts](src/config/mcp.config.ts):
- **GitHub MCP**: Pull request operations, file access
- **Filesystem MCP**: Local file operations (restricted to PROJECT_ROOT)

### Claude Skills

Located in `.claude/skills/`:
- `javascript-best-practices` - Modern ES patterns, async best practices
- `typescript-patterns` - TypeScript-specific analysis
- `python-code-review` - Python idioms and patterns
- `security-analysis` - OWASP Top 10, secure coding

## Usage

### Run Code Review

```bash
npm run dev <owner> <repo> <pr-number>

# Example
npm run dev facebook react 12345
```

### Build for Production

```bash
npm run build
npm start <owner> <repo> <pr-number>
```

### Development

```bash
# Type checking
npm run lint

# Run tests
npm test

# Watch mode
npm run test:watch
```

## Output

The system generates a structured JSON report:

```json
{
  "pullRequest": {
    "owner": "facebook",
    "repo": "react",
    "number": 12345
  },
  "fileReviews": [
    {
      "file": "src/payment.ts",
      "codeQuality": {
        "issues": [...],
        "overallScore": 85
      },
      "testCoverage": {
        "untestedPaths": [...],
        "coverageEstimate": 70
      },
      "refactorings": {
        "suggestions": [...]
      }
    }
  ],
  "summary": {
    "totalFiles": 5,
    "overallScore": 82,
    "criticalIssues": 2,
    "highPriorityTests": 3,
    "refactoringOpportunities": 7
  },
  "recommendations": [...],
  "metadata": {
    "analyzedAt": "2025-01-15T10:30:00Z",
    "duration": 15420,
    "agentVersions": {...}
  }
}
```

## Project Structure

```
project/solution/
├── src/
│   ├── main.ts                 # Entry point
│   ├── orchestrator.ts         # Main orchestrator
│   ├── agents/                 # Subagent definitions
│   │   ├── code-quality-analyzer.ts
│   │   ├── test-coverage-analyzer.ts
│   │   └── refactoring-suggester.ts
│   ├── config/
│   │   └── mcp.config.ts       # MCP server configuration
│   ├── types/
│   │   ├── analysis-results.ts # Subagent output schemas
│   │   └── report-types.ts     # Final report schema
│   └── utils/
│       ├── logger.ts           # Winston logging
│       ├── rate-limiter.ts     # Token bucket rate limiter
│       └── error-handler.ts    # Retry logic, error types
├── .claude/skills/             # Claude Skills definitions
├── tests/                      # Test suite
├── .env.example                # Environment template
└── package.json
```

## Production Reliability

### Rate Limiting
Token bucket implementation with sliding window:
- Max 50 requests/minute
- Max 100k tokens/minute
- Max 5 concurrent requests

Configure in orchestrator:
```typescript
const orchestrator = new CodeReviewOrchestrator({
  rateLimits: {
    maxRequestsPerMinute: 50,
    maxTokensPerMinute: 100000,
    maxConcurrent: 5
  }
});
```

### Error Handling
- Exponential backoff retry (3 attempts, 1s base delay)
- Graceful degradation on subagent failures
- Structured error logging with Winston

### Observability
Logs to `logs/` directory:
- `error.log` - Error-level events
- `combined.log` - All events

JSON format with timestamps:
```json
{
  "level": "info",
  "message": "Code review completed",
  "timestamp": "2025-01-15 10:30:00",
  "owner": "facebook",
  "repo": "react",
  "prNumber": 12345,
  "score": 85,
  "duration": 15420
}
```

## Limitations

- No authentication/authorization implementation (requires external wrapper)
- Estimated token usage ~10k tokens per PR
- GitHub free tier API rate limits apply
- Requires read access to target repository

## Troubleshooting

### "Skills not loading"
Ensure `PROJECT_ROOT` in `.env` points to absolute path containing `.claude/skills/`

### "Rate limit exceeded"
Adjust rate limiter configuration or wait for window reset (60 seconds)

### "GitHub API error"
Verify `GITHUB_TOKEN` has `repo` scope and read permissions

### "Structured output validation failed"
Check subagent prompts match expected output schemas in `src/types/`

## License

ISC

## Contributing

This is a Udacity course project demonstrating multi-agent systems with Claude Agent SDK.
