/**
 * Exercise: Custom Tools - API Validator
 *
 * Tests for the API validator custom tool.
 */

import "dotenv/config";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { apiValidatorServer } from "./api-validator.js";

// -----------------------------------------------------------------------------
// Use tool with agent via MCP server
// -----------------------------------------------------------------------------

async function useWithAgent() {
  for await (const message of query({
    prompt:
      "Validate the JSONPlaceholder users API at https://jsonplaceholder.typicode.com/users/1. Check for fields: id, name, email, phone. SLA threshold: 300ms.",
    options: {
      mcpServers: {
        "api-validator": apiValidatorServer,
      },
      allowedTools: ["mcp__api-validator__validate_api_response", "WebFetch"],
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
    } else if (message.type === "result" && message.subtype === "success") {
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
  console.log("  EXERCISE: Custom Tools - API Validator");
  console.log("  Using createSdkMcpServer and tool() helper");
  console.log("=".repeat(60));

  await useWithAgent();
}

main().catch(console.error);
