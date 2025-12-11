# Enterprise Multi-Agent Code Review Orchestrator

Build a production-ready multi-agent system that automates code review using the Claude Agent SDK.

## Project Overview

This system uses multiple specialized AI agents working together to provide comprehensive code reviews:

- **Main Orchestrator** - Coordinates the review process and aggregates results
- **Code Quality Analyzer** - Identifies code smells, anti-patterns, and best practice violations
- **Test Coverage Analyzer** - Evaluates test completeness and suggests missing test cases
- **Refactoring Suggester** - Recommends architectural improvements and refactoring opportunities



## What's Provided

This starter includes the infrastructure you need:

- **Type Definitions** (`src/types/`) - Zod schemas for validation
- **Logger** (`src/utils/logger.ts`) - Winston structured logging
- **Report Generator** (`src/utils/report-generator.ts`) - Markdown/HTML/JSON report generation
- **Project Config** - `package.json`, `tsconfig.json`, `.env.example`
- **Test Skeletons** (`tests/`) - Test file structure
- **Example Skill** (`.claude/skills/`) - Sample Claude skill

## What You Need to Implement

Your tasks:


1. **Agent Definitions** (`src/agents/`)
   - Code Quality Analyzer
   - Test Coverage Analyzer
   - Refactoring Suggester

2. **Prompts** (`src/prompts/`)
   - Orchestrator prompt
   - Agent-specific prompts

3. **MCP Configuration** (`src/config/mcp.config.ts`)
   - GitHub MCP server
   - ESLint MCP server

4. **Orchestrator** (`src/orchestrator.ts`)
   - Main coordination logic
   - Agent spawning and result aggregation

6. **Main Entry Point** (`src/main.ts`)
   - CLI argument parsing
   - Environment validation
   - Report generation

7. **Error Handler** (Recommended) (`src/utils/error-handler.ts`)
   - Custom `ReviewError` class
   - Retry logic with exponential backoff
   - Timeout wrapper

8. **Rate Limiter** (Optional) (`src/utils/rate-limiter.ts`)
   - Token bucket algorithm with sliding window
   - Request and token tracking
   - Concurrent request management

## Getting Started

### Prerequisites

- Node.js 18+
- [Anthropic API Key](https://console.anthropic.com/)
- [GitHub Personal Access Token](https://github.com/settings/tokens) (scopes: `repo`, `read:org`)

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your API keys
```

### Configuration

Edit `.env`:
```bash
ANTHROPIC_API_KEY=sk-ant-...
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...

```

### Running

```bash
# Development mode
npm run dev -- <owner> <repo> <pr-number>

# Production build
npm run build
npm start <owner> <repo> <pr-number>

# Example
npm run dev -- facebook react 12345
```

### Testing

```bash
# Run all tests
npm test

# Run specific test
npm test -- orchestrator.test.ts

# Watch mode
npm test -- --watch
```

## Key Technologies

- **Claude Agent SDK** - Multi-agent orchestration framework
- **Model Context Protocol (MCP)** - External data integration
- **Zod** - Schema validation and type safety
- **TypeScript** - Type-safe development
- **Vitest** - Testing framework
- **Winston** - Structured logging

## Success Criteria

Your implementation is complete when:

- [ ] TypeScript compiles without errors: `npm run build`
- [ ] All tests pass: `npm test`
- [ ] Can review a real PR: `npm start owner repo pr-number`
- [ ] Generates reports in at least one format (MD, HTML, JSON)
- [ ] Rate limiting prevents API throttling (Optional)
- [ ] Errors are handled gracefully (Optional Recommended)

## Resources

- [Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [Zod Documentation](https://zod.dev/)



Good luck! 
