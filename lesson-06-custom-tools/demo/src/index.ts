/**
 * Demo: Custom Tools - Tax Calculator
 *
 * Tests for the tax calculator custom tool.
 */

import "dotenv/config";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { taxToolServer } from "./tax-calculator.js";


// -----------------------------------------------------------------------------
//  Use tool with agent via MCP server
// -----------------------------------------------------------------------------

async function useWithAgent() {
  for await (const message of query({
    prompt: "Calculate the tax on a $150 purchase with 8.5% sales tax rate.",
    options: {
      mcpServers: {
        "financial-tools": taxToolServer,
      },
      allowedTools: ["mcp__financial-tools__calculate_tax"]
    },
  })) {
    if (message.type === 'assistant') {
      // Check for tool use
      const content = message.message?.content;
      if (Array.isArray(content)) {
        for (const block of content) {
           if (block.type === 'tool_use') {
            console.log(`[Tool]: ${block.name}`);
          }
        }
      }
    }
    else if (message.type === "result" && message.subtype === "success") {
      console.log("Agent Result:\n");
      console.log(message.result);
    }
  }
}
// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  DEMO: Custom Tools - Tax Calculator");
  console.log("  Using createSdkMcpServer and tool() helper");
  console.log("=".repeat(60));

  await useWithAgent();

}

main().catch(console.error);
