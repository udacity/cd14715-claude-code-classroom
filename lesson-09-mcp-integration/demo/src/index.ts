/**
 * Demo: MCP Integration - ESLint and GitHub
 *
 * Shows how to configure and use MCP servers with agents.
 */

import "dotenv/config";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { mcpServersConfig, mcpTools } from "./config/mcp.config.js";
import * as path from "path";

// -----------------------------------------------------------------------------
// Step 1: Explain MCP concept
// -----------------------------------------------------------------------------

function step1_explainMcp() {
  console.log("\n--- STEP 1: Understanding MCP ---\n");

  console.log("Problem: Every external tool needs custom integration");
  console.log("  - Different APIs, different authentication");
  console.log("  - Agents need specific code for each tool");
  console.log("  - Hard to add new capabilities");

  console.log("\nSolution: Model Context Protocol (MCP)");
  console.log("  - Standard interface for external systems");
  console.log("  - Agents use tools through consistent API");
  console.log("  - Easy to add new servers (just configure)");

  console.log("\nOfficial MCP Servers:");
  console.log("  - @eslint/mcp → Code linting and quality checks");
  console.log("  - @modelcontextprotocol/server-github → GitHub API");
  console.log("  - @modelcontextprotocol/server-postgres → PostgreSQL");
  console.log("  - @modelcontextprotocol/server-puppeteer → Browser automation");

  console.log("\n-> MCP provides plug-and-play external tool access!");
}

// -----------------------------------------------------------------------------
// Step 2: Show MCP configuration
// -----------------------------------------------------------------------------

function step2_showConfig() {
  console.log("\n--- STEP 2: MCP Configuration ---\n");

  console.log("Config file: src/config/mcp.config.ts\n");
  console.log("ESLint Server:");
  console.log(JSON.stringify(mcpServersConfig.eslint, null, 2));

  console.log("\nGitHub Server:");
  console.log(JSON.stringify({ ...mcpServersConfig.github, env: { GITHUB_TOKEN: "***" } }, null, 2));

  console.log("\nTool naming pattern: mcp__<server>__<tool>");
  console.log("  - mcp__eslint__lint");
  console.log("  - mcp__github__pull_request_read");
  console.log("  - mcp__github__get_file_contents");

  console.log("\n-> Configure once, use across all agents!");
}

// -----------------------------------------------------------------------------
// Step 3: Use ESLint MCP to lint code
// -----------------------------------------------------------------------------

async function step3_lintCode() {
  console.log("\n--- STEP 3: Lint Code with ESLint MCP ---\n");

  // Sample code with intentional issues
  const sampleCode = `
// sample.js - Code with ESLint issues
var unused = 'this variable is never used';

function greet(name) {
  console.log('Hello, ' + name)
  return
}

if(true){
  greet("World")
}
`;

  console.log("Sample code with issues:");
  console.log(sampleCode);

  const prompt = `You have access to ESLint via MCP. Analyze the following JavaScript code and identify any linting issues:

\`\`\`javascript
${sampleCode}
\`\`\`

List each issue found with:
- Line number
- Rule violated
- Description of the problem
- How to fix it`;

  console.log("Running ESLint analysis...\n");

  for await (const message of query({
    prompt,
    options: {
      mcpServers: {
        eslint: mcpServersConfig.eslint,
      },
      allowedTools: mcpTools.eslint,
      maxTurns: 3,
    },
  })) {
    if (message.type === "result" && message.subtype === "success") {
      console.log("ESLint Analysis Result:\n");
      console.log(message.result);
    }
  }

  console.log("\n-> Agent used mcp__eslint__lint to analyze code!");
}

// -----------------------------------------------------------------------------
// Step 4: Explain GitHub MCP tools
// -----------------------------------------------------------------------------

function step4_githubTools() {
  console.log("\n--- STEP 4: GitHub MCP Tools ---\n");

  console.log("Available GitHub MCP tools:");
  console.log("  mcp__github__pull_request_read");
  console.log("    - Get PR metadata, files changed, diffs");
  console.log("  mcp__github__get_file_contents");
  console.log("    - Read specific file from repository");
  console.log("  mcp__github__list_commits");
  console.log("    - Get commit history");
  console.log("  mcp__github__create_issue");
  console.log("    - Create GitHub issue");
  console.log("  mcp__github__add_issue_comment");
  console.log("    - Comment on issue or PR");

  console.log("\nCombined workflow example:");
  console.log("  1. Use mcp__github__pull_request_read to get PR files");
  console.log("  2. Use mcp__eslint__lint to check code quality");
  console.log("  3. Use mcp__github__add_issue_comment to post review");

  console.log("\n-> MCP servers can work together!");
}

// -----------------------------------------------------------------------------
// Step 5: Demonstrate MCP benefits
// -----------------------------------------------------------------------------

function step5_mcpBenefits() {
  console.log("\n--- STEP 5: MCP Benefits ---\n");

  console.log("Benefits of MCP:");
  console.log("  1. Standardization - Same interface for all external tools");
  console.log("  2. Security - Controlled access with environment variables");
  console.log("  3. Discoverability - Agents auto-discover available tools");
  console.log("  4. Extensibility - Add new servers without code changes");
  console.log("  5. Community - Large ecosystem of community servers");

  console.log("\nESLint MCP Use Cases:");
  console.log("  - Automated code review in CI/CD");
  console.log("  - Pre-commit quality checks");
  console.log("  - IDE integration for AI assistants");
  console.log("  - Pull request analysis");

  console.log("\nSecurity considerations:");
  console.log("  - Store credentials in .env, not code");
  console.log("  - Use allowedTools to restrict available operations");
  console.log("  - Review MCP server permissions before use");

  console.log("\n-> MCP = Secure, standardized external access!");
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  DEMO: MCP Integration - ESLint and GitHub");
  console.log("  Model Context Protocol for external tool access");
  console.log("=".repeat(60));

  step1_explainMcp();
  step2_showConfig();
  await step3_lintCode();
  step4_githubTools();
  step5_mcpBenefits();

  console.log("\n" + "=".repeat(60));
  console.log("  KEY TAKEAWAYS");
  console.log("=".repeat(60));
  console.log(`
  MCP CONFIGURATION:
  • Define servers in mcp.config.ts
  • Each server has: type, command, args, env
  • Pass to query() via mcpServers option

  ESLINT MCP:
  • Package: @eslint/mcp@latest
  • Tool: mcp__eslint__lint
  • Use: Lint files, find issues, suggest fixes

  TOOL NAMING:
  • Pattern: mcp__<server-name>__<tool-name>
  • Examples:
    - mcp__eslint__lint
    - mcp__github__pull_request_read

  USAGE IN AGENTS:
  for await (const msg of query({
    prompt: 'Lint this code for issues',
    options: {
      mcpServers: { eslint: mcpServersConfig.eslint },
      allowedTools: ['mcp__eslint__lint'],
    },
  })) { ... }

  COMBINED WORKFLOWS:
  • ESLint + GitHub = Automated code review
  • Lint PR changes, post comments
`);
}

main().catch(console.error);
