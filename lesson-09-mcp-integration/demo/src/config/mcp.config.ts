/**
 * MCP Server Configuration
 *
 * GitHub MCP server for repository access.
 */

import { McpStdioServerConfig } from "@anthropic-ai/claude-agent-sdk";
import "dotenv/config";



export const githubMcpServer: McpStdioServerConfig = {
  type: 'stdio' as const,
  command: 'npx',
  args: [
    '-y',
    '@modelcontextprotocol/server-github'
  ],
  env: {
    GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_TOKEN || ''
  }
};

export const githubTools = [
  "mcp__github__get_file_contents",
  "mcp__github__search_repositories",
  "mcp__github__list_commits",
];
