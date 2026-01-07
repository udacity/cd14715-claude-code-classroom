# Demo: MCP Integration - GitHub File Summarizer

Fetch and summarize files from GitHub repositories using MCP.

## Scenario

Your team needs to quickly understand files from various GitHub repositories. Build an agent that uses the GitHub MCP server to fetch file contents and provide summaries.

## Project Structure

```
demo/
├── src/
│   ├── config/
│   │   └── mcp.config.ts       # GitHub MCP configuration
│   ├── github-summarizer.ts    # Exported function (deliverable)
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
GITHUB_TOKEN=ghp_your-github-token
```

## Run

```bash
npm start
```

## Deliverable: github-summarizer.ts

```typescript
export interface GitHubFileSummary {
  repo: string;
  path: string;
  raw: string;
}

export async function summarizeGitHubFile(
  owner: string,
  repo: string,
  path: string
): Promise<GitHubFileSummary>
```

## Key Pattern: Using MCP Servers

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Fetch and summarize this file...",
  options: {
    mcpServers: {
      github: {
        type: "stdio",
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-github"],
        env: {
          GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_TOKEN,
        },
      },
    },
    allowedTools: ["mcp__github__get_file_contents"],
  },
})) { ... }
```

## MCP Tool Naming

Pattern: `mcp__<server-name>__<tool-name>`

| Tool | Description |
|------|-------------|
| `mcp__github__get_file_contents` | Fetch file content from a repo |
| `mcp__github__search_repositories` | Search for repositories |
| `mcp__github__list_commits` | Get commit history |

## Key Takeaway

MCP provides standardized access to external tools. Configure the GitHub MCP server, pass it to `query()` via `mcpServers`, and specify allowed tools with `mcp__` prefix. The agent can then fetch files from any GitHub repository.
