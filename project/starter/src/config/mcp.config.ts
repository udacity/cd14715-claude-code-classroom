/**
 * Model Context Protocol (MCP) server configurations
 *
 * Required MCP Servers:
 * 1. GitHub - For PR/repo operations
 * 2. ESLint - For code linting and style analysis
 *
 * Documentation:
 * - MCP Protocol: https://modelcontextprotocol.io
 * - GitHub MCP: https://github.com/github/github-mcp-server
 * - ESLint MCP: https://eslint.org/docs/latest/use/mcp
 */

export const mcpServersConfig = {
  /**
   * GitHub MCP Server
   * Provides tools for GitHub API operations
   *
   * TODO: Configure with:
   * - type: 'stdio'
   * - command: 'npx'
   * - args: ['-y', '@modelcontextprotocol/server-github']
   * - env: { GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_TOKEN }
   */
  github: { },

  /**
   * ESLint MCP Server
   * Provides tools for linting and code quality analysis
   *
   * TODO: Configure with:
   * - type: 'stdio'
   * - command: 'npx'
   * - args: ['-y', '@eslint/mcp@latest']
   * - env: {}
   */
  eslint: { }
};
