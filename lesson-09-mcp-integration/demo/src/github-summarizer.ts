/**
 * GitHub File Summarizer Agent
 *
 * Deliverable: summarizeGitHubFile() function using Claude Agent SDK
 * with GitHub MCP server to fetch and summarize files from public repos.
 */

import { query } from "@anthropic-ai/claude-agent-sdk";
import { githubMcpServer, githubTools } from "./config/mcp.config.js";

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export interface GitHubFileSummary {
  repo: string;
  path: string;
  raw: string;
}

// -----------------------------------------------------------------------------
// Prompt Function
// -----------------------------------------------------------------------------

const summarizePrompt = (owner: string, repo: string, path: string) => `You have access to GitHub via MCP.

Fetch and summarize the file from this repository:
- Owner: ${owner}
- Repository: ${repo}
- File path: ${path}

Steps:
1. Use the mcp__github__get_file_contents tool to fetch the file
2. Analyze the content
3. Provide a summary with:
   - Purpose of the file
   - Key sections or functions
   - Notable patterns or techniques used`;

// -----------------------------------------------------------------------------
// Exported Function: summarizeGitHubFile()
// -----------------------------------------------------------------------------

export async function summarizeGitHubFile(
  owner: string,
  repo: string,
  path: string
): Promise<GitHubFileSummary> {
  let rawResult = "";

  for await (const message of query({
    prompt: summarizePrompt(owner, repo, path),
    options: {
      mcpServers: {
        github: githubMcpServer,
      },
      allowedTools: githubTools,
    },
  })) {
    if (message.type === "assistant") {
      const content = message.message?.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block.type === "tool_use") {
            console.log(`[Tool]: ${block.name}`);
          }
        }
      }
    }
    if (message.type === "result" && message.subtype === "success") {
      rawResult = message.result;
      break;
    }
  }

  return {
    repo: `${owner}/${repo}`,
    path,
    raw: rawResult,
  };
}
