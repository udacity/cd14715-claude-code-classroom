# Code Quality Reviewer

Build an agent that reviews code quality using ESLint MCP.

## Overview

Create an agent that uses the ESLint MCP server to analyze JavaScript/TypeScript code files, identify linting issues, categorize them by severity, and provide actionable improvement recommendations.

## Scenario

Your development team submits code for review, but manual code quality checks are inconsistent and time-consuming. You need an automated agent that:
- Scans JavaScript/TypeScript files for linting issues
- Categorizes violations by severity (error, warning)
- Groups issues by type (formatting, best practices, potential bugs)
- Provides specific fix recommendations
- Calculates an overall code quality score

This enables consistent code quality enforcement across the team.

## Prerequisites

- Node.js 18+
- Anthropic API Key
- Completed the demo (ESLint MCP Integration)

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```bash
ANTHROPIC_API_KEY=your-api-key-here
```

## Tasks

### 1. Configure the ESLint MCP Server

```typescript
// src/config/mcp.config.ts
export const mcpServersConfig = {
  eslint: {
    type: 'stdio',
    command: 'npx',
    args: ['-y', '@eslint/mcp@latest'],
    env: {}
  }
};
```

### 2. Define the Code Quality Reviewer Agent

```typescript
const codeQualityReviewer: AgentDefinition = {
  name: 'code-quality-reviewer',
  description: 'Reviews code for quality issues using ESLint',
  prompt: `You are a code quality reviewer.

  When given code to review:
  1. Analyze the code for linting issues
  2. Categorize issues by severity (error, warning, info)
  3. Group issues by type (formatting, best-practices, bugs)
  4. Provide specific fix recommendations
  5. Calculate overall quality score

  Focus on actionable feedback that helps developers improve.`,
  allowedTools: ['mcp__eslint__lint'],
  model: 'claude-sonnet-4-5-20250929'
};
```

### 3. Implement `reviewCodeQuality()` Function

```typescript
export async function reviewCodeQuality(
  code: string,
  filename: string
): Promise<CodeQualityReport> {
  // Call query() with ESLint MCP configuration
  // Agent uses mcp__eslint__lint to analyze code
  // Return structured quality report
}
```

### 4. Return Structured Quality Report

```typescript
interface CodeQualityReport {
  filename: string;
  qualityScore: number;  // 0-100
  issues: {
    line: number;
    column: number;
    severity: 'error' | 'warning' | 'info';
    rule: string;
    message: string;
    fix: string;
  }[];
  summary: {
    totalIssues: number;
    errors: number;
    warnings: number;
    infos: number;
  };
  categories: {
    formatting: number;
    bestPractices: number;
    potentialBugs: number;
    other: number;
  };
  recommendations: string[];
}
```

### 5. Test with Sample Code Files

Create test files with intentional issues:
- Unused variables
- Missing semicolons
- Inconsistent quotes
- console.log statements
- var instead of let/const

### 6. Validate Quality Scoring

- 100: No issues
- 80-99: Minor issues only
- 60-79: Some warnings
- 40-59: Multiple errors
- <40: Critical issues

## Running the Exercise

```bash
npm start
```

## Project Structure

```
exercise/
├── src/
│   ├── code-reviewer.ts     # Your implementation
│   ├── sample-code.ts       # Test code files
│   ├── index.ts             # Tests
│   └── config/
│       └── mcp.config.ts
├── package.json
└── README.md
```

## Sample Code to Test

```javascript
// sample-bad.js - Multiple issues
var unused = 'never used';
var x = 1

function foo(a,b){
console.log(a+b)
  return a+b
}

if(true){
foo(1,2)
}
```

## Test Scenarios

1. Clean code (no issues) → Score: 100
2. Minor formatting issues → Score: 85-95
3. Best practice violations → Score: 70-84
4. Potential bugs (unused vars, etc.) → Score: 50-69
5. Multiple errors → Score: <50

## Key Takeaway

ESLint MCP enables automated, consistent code quality enforcement. Agents can analyze code, identify issues, and provide actionable recommendations without custom integration code. This pattern works for any linter that supports MCP.

## Deliverable

A TypeScript module with:
- ESLint MCP configuration
- `reviewCodeQuality()` function
- Structured quality report output

Must correctly identify linting issues, calculate quality scores, and provide fix recommendations. All tests must pass.

## Sources

- [ESLint MCP Server Setup](https://eslint.org/docs/latest/use/mcp)
- [@eslint/mcp on npm](https://www.npmjs.com/package/@eslint/mcp)
