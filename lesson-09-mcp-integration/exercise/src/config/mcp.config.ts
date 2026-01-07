/**
 * MCP Server Configuration for Code Quality Reviewer
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
};

// ESLint MCP tools
export const eslintTools = [
  "mcp__eslint__lint", // Lint files using ESLint
];
