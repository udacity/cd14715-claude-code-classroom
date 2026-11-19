/**
 * MCP Server Configuration for Code Quality Reviewer
 *
 * TODO: Configure the ESLint MCP server and define allowed tools.
 *
 * Learning objectives:
 * - Configure stdio transport MCP servers
 * - Understand tool naming convention (mcp__<server>__<tool>)
 * - Define allowed tools for the agent
 */

import "dotenv/config";

export interface McpServerConfig {
  type: "stdio";
  command: string;
  args: string[];
  env?: Record<string, string | undefined>;
}

// TODO: Step 1 - Configure the ESLint MCP server
// The server should use:
// - type: "stdio"
// - command: "npx"
// - args: ["-y", "@eslint/mcp@latest"]
export const mcpServersConfig: Record<string, McpServerConfig> = {
  eslint: {
    // TODO: Fill in the MCP server configuration
    type: "stdio",
    command: "", // TODO: What command runs the ESLint MCP server?
    args: [], // TODO: What arguments install and run @eslint/mcp@latest?
    env: {},
  },
};

// TODO: Step 2 - Define the ESLint MCP tools
// Tool naming convention: mcp__<server-name>__<tool-name>
// The ESLint MCP server provides a "lint" tool
export const eslintTools = [
  // TODO: Add the ESLint lint tool following the naming convention
  // Hint: mcp__eslint__???
];
