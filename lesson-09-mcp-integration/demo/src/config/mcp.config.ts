/**
 * MCP Server Configuration
 *
 * Defines how to connect to various MCP servers.
 */

import "dotenv/config";

export interface McpServerConfig {
  type: "stdio";
  command: string;
  args: string[];
  env?: Record<string, string | undefined>;
}

export const mcpServersConfig: Record<string, McpServerConfig> = {
  eslint: {
    type: "stdio",
    command: "npx",
    args: ["-y", "@eslint/mcp@latest"],
    env: {},
  },

  github: {
    type: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-github"],
    env: {
      GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_TOKEN,
    },
  },
};

// Available MCP tools by server
export const mcpTools = {
  eslint: [
    "mcp__eslint__lint", // Lint files using ESLint
  ],
  github: [
    "mcp__github__pull_request_read",
    "mcp__github__get_file_contents",
    "mcp__github__list_commits",
    "mcp__github__create_issue",
    "mcp__github__add_issue_comment",
  ],
};
