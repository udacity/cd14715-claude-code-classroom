/**
 * Model Context Protocol (MCP) server configurations
 *
 * Required MCP Servers:
 * 1. GitHub - For PR/repo operations
 * 2. ESLint - For code linting and style analysis
 */

export const mcpServersConfig = {
  github: {
    type: 'stdio' as const,
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github'],
    env: {
      GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_TOKEN || ''
    }
  },

  eslint: {
    type: 'stdio' as const,
    command: 'npx',
    args: ['-y', '@eslint/mcp@latest'],
    env: {}
  }
};
