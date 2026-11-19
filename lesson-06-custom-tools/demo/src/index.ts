/**
 * Demo: Custom Tools - Tax Calculator
 *
 * Tests for the tax calculator custom tool.
 */

import "dotenv/config";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { taxToolServer } from "./tax-calculator.js";

const model = process.env.ANTHROPIC_MODEL;

if (!model) {
  throw new Error("ANTHROPIC_MODEL is not set");
}

// -----------------------------------------------------------------------------
//  Test 1: Single Tool Usage
// -----------------------------------------------------------------------------

async function testSingleTool() {
  // IMPORTANT: Custom MCP tools require streaming input mode
  // Must use async generator, not a simple string
  async function* generateMessages() {
    yield {
      type: "user" as const,
      message: {
        role: "user" as const,
        content: "Calculate the tax on a $150 purchase with 8.5% sales tax rate."
      },
      parent_tool_use_id: null,
      session_id: "demo-session"
    };
  }

  for await (const message of query({
    prompt: generateMessages(),
    options: {
      mcpServers: {
        "financial-tools": taxToolServer,
      },
      model,
      allowedTools: ["mcp__financial-tools__calculate_tax"]
    },
  })) {
    if (message.type === 'assistant') {
      // Check for tool use
      const content = message.message?.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block.type === 'tool_use') {
            console.log(`[Tool]: ${JSON.stringify(block)}`);
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
//  Test 2: Multiple Tools - Agent Chooses Between Them
// -----------------------------------------------------------------------------

async function testMultipleTools() {
  console.log("\n" + "=".repeat(60));
  console.log("TEST 2: Multiple Tools - Agent Chooses Appropriate Tool");
  console.log("=".repeat(60) + "\n");

  async function* generateMessages() {
    yield {
      type: "user" as const,
      message: {
        role: "user" as const,
        content: "I have a $75 dinner bill. Calculate both the 8% sales tax and a 20% tip for me."
      },
      parent_tool_use_id: null,
      session_id: "demo-session-multi"
    };
  }

  for await (const message of query({
    prompt: generateMessages(),
    options: {
      mcpServers: {
        "financial-tools": taxToolServer,
      },
      model,
      // Allow both tools - agent will choose which to use
      allowedTools: [
        "mcp__financial-tools__calculate_tax",
        "mcp__financial-tools__calculate_tip"
      ]
    },
  })) {
    if (message.type === 'assistant') {
      const content = message.message?.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block.type === 'tool_use') {
            console.log(`[Tool Used]: ${block.name}`);
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
//  Test 3: External API Integration - Weather API
// -----------------------------------------------------------------------------

async function testExternalAPI() {
  console.log("\n" + "=".repeat(60));
  console.log("TEST 3: External API Integration - Weather Data");
  console.log("=".repeat(60) + "\n");

  async function* generateMessages() {
    yield {
      type: "user" as const,
      message: {
        role: "user" as const,
        content: "What's the current temperature in San Francisco? Use coordinates 37.7749, -122.4194"
      },
      parent_tool_use_id: null,
      session_id: "demo-session-weather"
    };
  }

  for await (const message of query({
    prompt: generateMessages(),
    options: {
      mcpServers: {
        "financial-tools": taxToolServer,
      },
      model,
      // Allow only the weather tool to demonstrate external API integration
      allowedTools: [
        "mcp__financial-tools__get_weather"
      ]
    },
  })) {
    if (message.type === 'assistant') {
      const content = message.message?.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block.type === 'tool_use') {
            console.log(`[Tool Used]: ${block.name}`);
            console.log(`[API Call]: Fetching from Open-Meteo API...`);
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
  console.log("  DEMO: Custom Tools - Multiple Tools in One Server");
  console.log("  Using createSdkMcpServer and tool() helper");
  console.log("=".repeat(60));

  // Test 1: Single tool usage
  console.log("\nTEST 1: Single Tool Usage - Tax Calculator");
  console.log("=".repeat(60) + "\n");
  await testSingleTool();

  // Test 2: Agent chooses between multiple tools
  await testMultipleTools();

  // Test 3: External API integration
  await testExternalAPI();

  console.log("\n" + "=".repeat(60));
  console.log("All tests completed!");
  console.log("=".repeat(60));
}

main().catch(console.error);
