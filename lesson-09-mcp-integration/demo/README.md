# ESLint MCP Integration Demo

Integrate MCP servers with agents for external tool access.

## Overview

In this demo, we'll learn about the Model Context Protocol (MCP), configure MCP servers (ESLint and GitHub), and show how agents automatically use MCP tools to interact with external systems.

## Scenario

A code review agent needs to lint JavaScript/TypeScript files and check code quality. We'll configure the ESLint MCP server and show how agents seamlessly use it to analyze code for issues.

## What You'll Learn

- What MCP is and why it's valuable
- Available MCP servers (official and community)
- Configuring MCP servers
- How agents automatically discover and use MCP tools
- MCP tool naming convention (`mcp__server__tool`)

## Prerequisites

- Node.js 18+
- Anthropic API Key
- Completed Lesson 08 (Claude Skills)

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```bash
ANTHROPIC_API_KEY=your-api-key-here
GITHUB_TOKEN=ghp_your-github-token  # Optional for GitHub features
```

## Running the Demo

```bash
npm start
```

## Project Structure

```
demo/
├── src/
│   ├── index.ts
│   └── config/
│       └── mcp.config.ts
├── package.json
└── README.md
```

## Key Concepts

### Understanding MCP

**Problem:** Every external tool needs custom integration
- Different APIs, different authentication
- Agents need specific code for each tool

**Solution:** MCP provides standard interface
- External systems expose tools via MCP protocol
- Agents use tools through consistent interface
- Easy to add new systems (just configure server)

### Available MCP Servers

**Official:**
- `@eslint/mcp` → Code linting and quality checks
- `@modelcontextprotocol/server-github` → GitHub API
- `@modelcontextprotocol/server-postgres` → PostgreSQL
- `@modelcontextprotocol/server-puppeteer` → Browser automation

**Community:** Many more at github.com/modelcontextprotocol/servers

### Configure MCP Servers

```typescript
// src/config/mcp.config.ts
export const mcpServersConfig = {
  eslint: {
    type: 'stdio',
    command: 'npx',
    args: ['-y', '@eslint/mcp@latest'],
    env: {}
  },

  github: {
    type: 'stdio',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github'],
    env: {
      GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_TOKEN
    }
  }
};
```

### Use MCP Tools in an Agent

```typescript
const result = await query(
  'Lint this JavaScript file for issues',
  {
    mcpServers: { eslint: mcpServersConfig.eslint },
    allowedTools: ['mcp__eslint__lint']
  }
);
```

### MCP Tool Naming

Format: `mcp__<server-name>__<tool-name>`

Examples:
- `mcp__eslint__lint`
- `mcp__github__pull_request_read`
- `mcp__github__get_file_contents`

### ESLint MCP Tool

```typescript
mcp__eslint__lint
// Lint files using ESLint
// Requires absolute file paths
// Returns violations with rule, line, severity
```

### Combined Workflow (ESLint + GitHub)

```typescript
// 1. Get PR files from GitHub
// 2. Lint each file with ESLint
// 3. Post review comments

const result = await query(
  'Review PR #123 for linting issues',
  {
    mcpServers: {
      eslint: mcpServersConfig.eslint,
      github: mcpServersConfig.github
    },
    allowedTools: [
      'mcp__eslint__lint',
      'mcp__github__pull_request_read',
      'mcp__github__add_issue_comment'
    ]
  }
);
```

## Key Takeaway

MCP provides standardized access to external tools. Configure servers in `mcp.config.ts`, then agents can use MCP tools just like built-in tools. Tool names follow the pattern `mcp__<server>__<tool>`. ESLint MCP enables automated code quality checks in agent workflows.

## Sources

- [ESLint MCP Server Setup](https://eslint.org/docs/latest/use/mcp)
- [@eslint/mcp on npm](https://www.npmjs.com/package/@eslint/mcp)
