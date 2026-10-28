# Enterprise Multi-Agent Code Review Orchestrator

A production-ready multi-agent system that automates comprehensive code reviews using the Claude Agent SDK. Specialized AI agents analyze pull requests from multiple angles and synthesize findings into actionable reports.

## System Architecture

```
GitHub PR
    ↓
[CodeReviewOrchestrator]
    ↓
[Parallel Agents Running on Changed Files]
├─ Code Quality Analyzer      (Security, Performance, Best Practices)
├─ Test Coverage Analyzer     (Test Completeness, Missing Coverage)
└─ Refactoring Suggester      (Architecture, Design Patterns, Technical Debt)
    ↓
[SynthesisEngine]
├─ Executive Summary (Key Metrics & Overview)
├─ Synthesized Findings (Cross-Agent Pattern Detection)
└─ Prioritized Recommendations
    ↓
[Report Generator]
├─ Markdown Report (GitHub-friendly)
├─ HTML Report (Interactive visualization)
└─ JSON Report (Programmatic use)
```

## Key Components

### 1. Specialized Agents

Each agent analyzes changed code independently and returns structured results:

- **Code Quality Analyzer** - Identifies security vulnerabilities, performance issues, code style violations, and best practice deviations
- **Test Coverage Analyzer** - Evaluates test coverage, identifies untested paths, and suggests missing test cases
- **Refactoring Suggester** - Recommends architectural improvements, design patterns, and identifies technical debt

### 2. Synthesis Engine

Correlates findings across all three agents to:
- Detect patterns (e.g., security issues + untested code = high risk)
- Prioritize recommendations by impact and severity
- Generate executive summary with key findings
- Create comprehensive recommendations

### 3. Report Generation

Produces three complementary report formats:
- **Markdown** - Perfect for GitHub PR comments and documentation
- **HTML** - Interactive report with styled metrics and recommendations
- **JSON** - Structured data for CI/CD integration and programmatic processing

## What's Included

Complete implementation ready to use:

- ✅ **All Three Specialized Agents** (`src/agents/`)
- ✅ **Type Definitions & Validation** (`src/types/`) - Zod schemas with JSON Schema exports
- ✅ **Synthesis Engine** (`src/utils/synthesis-engine.ts`) - Cross-agent pattern detection and recommendation prioritization
- ✅ **Orchestrator** (`src/orchestrator.ts`) - Parallel execution with rate limiting and error handling
- ✅ **Report Generator** (`src/utils/report-generator.ts`) - MD/HTML/JSON output formats
- ✅ **CLI Entry Point** (`src/main.ts`) - GitHub integration with MCP
- ✅ **Error Handling** (`src/utils/error-handler.ts`) - Retry logic, timeouts, graceful degradation
- ✅ **Rate Limiting** (`src/utils/rate-limiter.ts`) - Token bucket algorithm to prevent API throttling
- ✅ **Logging** (`src/utils/logger.ts`) - Structured Winston logging
- ✅ **GitHub MCP Integration** (`src/config/mcp.config.ts`) - Automated PR file fetching

## Features

### Comprehensive Analysis

- **Code Quality** - Security vulnerabilities, performance issues, style violations
- **Test Coverage** - Missing tests, untested paths, coverage gaps
- **Refactoring** - Architecture improvements, design patterns, technical debt
- **Pattern Detection** - Cross-agent correlation to identify high-risk patterns
- **Prioritization** - Recommendations ranked by impact and severity

### Three Report Formats

1. **Markdown** - Include in GitHub PR comments
2. **HTML** - Share as interactive report
3. **JSON** - Integrate with CI/CD pipelines

### Production-Ready Features

- **Parallel Analysis** - All agents run simultaneously for each file
- **Rate Limiting** - Token bucket algorithm prevents API throttling
- **Timeout Protection** - 2-minute timeout per agent with graceful fallback
- **Error Handling** - Retry logic with exponential backoff
- **Structured Logging** - Winston JSON logging for debugging
- **GitHub Integration** - Automatic PR file fetching via MCP

## Getting Started

### Prerequisites

- Node.js 18+
- Anthropic API access (provided in Vocareum workspace) or [your own API key](https://console.anthropic.com/)
- [GitHub Personal Access Token](https://github.com/settings/tokens) (optional but recommended - scopes: `repo`, `read:org`)

### Installation

**In Vocareum Workspace (Recommended):**

Your workspace comes pre-configured with Anthropic API credentials.

```bash
# Install dependencies from repository root (uses npm workspaces)
cd /voc/work/cd14715-claude-code-classroom
npm install

# Navigate to project and configure
cd project/starter
cp .env.example .env
```

**Local Setup:**

```bash
# Clone the repository
git clone https://github.com/udacity/cd14715-claude-code-classroom.git
cd cd14715-claude-code-classroom/project/starter

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

### Configuration

Edit `.env` with your settings:

**In Vocareum Workspace:**
```bash
# API credentials are already in your environment - don't add them here

# Model Configuration (REQUIRED)
ANTHROPIC_MODEL=claude-sonnet-4-5-20250929

# Project root (REQUIRED)
PROJECT_ROOT=/voc/work/cd14715-claude-code-classroom/project/starter

# GitHub Token (RECOMMENDED for higher rate limits)
# GITHUB_TOKEN=ghp_your-token-here

# Logging level (optional)
LOG_LEVEL=info
```

**Local Setup with Your Own API Key:**
```bash
# Your Anthropic API key
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Model Configuration (REQUIRED)
ANTHROPIC_MODEL=claude-sonnet-4-5-20250929

# Project root (REQUIRED - update to your path)
PROJECT_ROOT=/absolute/path/to/project/starter

# GitHub Token (RECOMMENDED)
# GITHUB_TOKEN=ghp_your-token-here

# Logging level (optional)
LOG_LEVEL=info
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

## How It Works

### 1. Parallel Agent Execution

When you analyze a PR, the orchestrator:

1. Fetches all changed files from GitHub using MCP
2. For each file, runs three agents simultaneously:
   - Code Quality Analyzer
   - Test Coverage Analyzer
   - Refactoring Suggester
3. Each agent returns structured JSON results
4. Results are rate-limited to prevent API throttling

### 2. Synthesis Engine

The synthesis engine processes agent results to:

- **Aggregate Metrics** - Calculates overall scores, coverage estimates
- **Detect Patterns** - Identifies correlations:
  - Security issues + untested code = critical risk
  - Complex code + no tests = high risk
  - High-impact refactoring opportunity
- **Prioritize** - Ranks recommendations by impact and severity
- **Summarize** - Generates executive summary with key findings

### 3. Report Generation

The report generator creates three formats from the synthesis results:

- **Markdown** - Table format with file-by-file breakdown
- **HTML** - Interactive metrics dashboard with styled recommendations
- **JSON** - Complete structured data for programmatic use

## Output Example

### Markdown Report Structure

```markdown
# 🔍 Code Review Report

## Executive Summary
| Metric | Value |
|--------|-------|
| Overall Quality Score | 72/100 |
| Files Reviewed | 5 |
| Critical Issues | 2 |
| High Priority Issues | 4 |
| Test Coverage | ~65% |

## 🎯 Key Findings
- Security vulnerability in auth module
- Missing tests for payment processing
- Complex nested loops in data transformer

## 📋 Recommended Actions
- Add security audit for authentication
- Increase test coverage to 80%
- Refactor data transformation logic

## ✅ Top Recommendations
1. 🚨 **security**: Fix critical security vulnerabilities
2. ⚠️ **testing**: Add tests for critical code paths
3. 📝 **architecture**: Simplify complex nested logic
```

### JSON Report Structure

```json
{
  "metadata": {
    "prNumber": 12345,
    "prTitle": "Add new authentication module",
    "author": "alice",
    "repository": "company/product",
    "analyzedAt": "2024-01-16T10:30:00Z",
    "analysisDuration": 45000
  },
  "executiveSummary": {
    "totalFiles": 5,
    "filesWithIssues": 3,
    "criticalCount": 2,
    "highCount": 4,
    "overallQualityScore": 72,
    "estimatedTestCoverage": 65
  },
  "synthesizedFindings": [
    {
      "file": "src/auth/login.ts",
      "pattern": "Security Vulnerability",
      "severity": "critical",
      "relatedAgents": ["code-quality"],
      "description": "Found SQL injection vulnerability in login validation"
    }
  ],
  "recommendations": [
    {
      "id": "security-1",
      "priority": "critical",
      "category": "security",
      "description": "Fix critical security vulnerabilities",
      "files": ["src/auth/login.ts"],
      "estimatedEffort": "high",
      "impact": "high"
    }
  ]
}
```

## Architecture Deep Dive

### Type System

The project uses a three-layer type system for type safety:

1. **Zod Schemas** - Runtime validation
   ```typescript
   export const CodeQualityResultSchema = z.object({
     file: z.string(),
     issues: z.array(CodeIssueSchema),
     overallScore: z.number().min(0).max(100)
   });
   ```

2. **TypeScript Types** - Compile-time safety
   ```typescript
   export type CodeQualityResult = z.infer<typeof CodeQualityResultSchema>;
   ```

3. **JSON Schema** - SDK structured outputs
   ```typescript
   export const CodeQualityResultJSONSchema = toJsonSchema(CodeQualityResultSchema);
   ```

### Agent Communication

Agents communicate through structured outputs:

1. Agent receives diff + file context
2. Agent analyzes and returns structured JSON
3. Orchestrator validates with Zod
4. Results flow to synthesis engine
5. Report generator formats final output

### Error Handling

- **Timeout Protection**: 120-second timeout per agent
- **Retry Logic**: Exponential backoff for transient failures
- **Graceful Degradation**: Continue analysis if one agent fails
- **Custom Errors**: ReviewError class with error codes

### Rate Limiting

- **Token Bucket Algorithm**: 60-second sliding window
- **Token Estimation**: ~5000 tokens per agent call
- **Concurrent Management**: Default limit of 5 concurrent requests
- **Request Queuing**: Automatic queuing when limit reached

## Success Criteria

Your implementation is working when:

- ✅ TypeScript compiles without errors: `npm run build`
- ✅ Can review a real PR: `npm run dev -- owner repo pr-number`
- ✅ Generates all three report formats (MD, HTML, JSON)
- ✅ Reports show synthesis engine results (cross-agent findings)
- ✅ Rate limiting prevents API throttling
- ✅ Errors are handled gracefully

## Troubleshooting

### Build Errors
```bash
npm run build
# Check for TypeScript errors and fix them
# Run type checking: npm run lint
```

### API Key Issues
```bash
# Verify API key is set
echo $ANTHROPIC_API_KEY  # Should not be empty

# For AWS Bedrock, verify region
echo $AWS_REGION
```

### GitHub Integration Issues
```bash
# Verify GitHub token has correct scopes
# Required: repo, read:org
# Optional: Generate at https://github.com/settings/tokens

# Test with a public PR first
npm run dev -- torvalds linux 99999
```

## Performance Considerations

- **Parallel Agents**: 3 agents × multiple files = significant speedup
- **Rate Limiting**: Prevents hitting API limits (critical for large PRs)
- **Caching**: GitHub MCP caches file contents automatically
- **Timeout Strategy**: 2-minute limit balances quality vs. speed

For PRs with 50+ files, analysis typically takes 2-5 minutes.

## Resources

- [Claude Agent SDK Documentation](https://github.com/anthropics/claude-agent-sdk)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Zod Schema Validation](https://zod.dev/)
- [Winston Logging](https://github.com/winstonjs/winston)

## Next Steps

To customize the system:

1. **Modify Agent Prompts** (`src/prompts/*.ts`) - Adjust analysis criteria
2. **Add Custom Tools** (`src/utils/`) - Integrate additional analysis
3. **Extend Synthesis Logic** (`src/utils/synthesis-engine.ts`) - Add pattern detection
4. **Customize Reports** (`src/utils/report-generator.ts`) - Change formatting

Enjoy comprehensive automated code reviews!