/**
 * Exercise: Custom Tools - API Validator
 *
 * Tests for the API validator custom tool.
 */

import "dotenv/config";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { apiValidatorServer } from "./api-validator.js";

const model = process.env.ANTHROPIC_MODEL;
if (!model) {
  throw new Error("ANTHROPIC_MODEL is not set");
}

// -----------------------------------------------------------------------------
// Test 1: Basic API Validation
// -----------------------------------------------------------------------------

async function testBasicValidation() {
  console.log("\nTEST 1: Basic API Validation");
  console.log("-".repeat(50));

  // IMPORTANT: Custom MCP tools require streaming input mode
  // Must use async generator, not a simple string
  async function* generateMessages() {
    yield {
      type: "user" as const,
      message: {
        role: "user" as const,
        content:
          "Validate the JSONPlaceholder users API at https://jsonplaceholder.typicode.com/users/1. Check for fields: id, name, email, phone. SLA threshold: 500ms.",
      },
      parent_tool_use_id: null,
      session_id: "exercise-session-1",
    };
  }

  for await (const message of query({
    prompt: generateMessages(),
    options: {
      mcpServers: {
        "api-validator": apiValidatorServer,
      },
      model,
      allowedTools: ["mcp__api-validator__validate_api_response"],
    },
  })) {
    if (message.type === "assistant") {
      const content = message.message?.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block.type === "tool_use") {
            console.log(`[Tool Used]: ${block.name}`);
          }
        }
      }
    } else if (message.type === "result" && message.subtype === "success") {
      console.log("\nAgent Result:");
      console.log(message.result);
    }
  }
}

// -----------------------------------------------------------------------------
// Test 2: SLA Violation Detection
// -----------------------------------------------------------------------------

async function testSLAViolation() {
  console.log("\n" + "=".repeat(60));
  console.log("TEST 2: SLA Violation Detection (tight threshold)");
  console.log("=".repeat(60));

  async function* generateMessages() {
    yield {
      type: "user" as const,
      message: {
        role: "user" as const,
        content:
          "Validate https://jsonplaceholder.typicode.com/posts with a very tight SLA of 10ms. Check for fields: userId, id, title, body. Report if the SLA is violated.",
      },
      parent_tool_use_id: null,
      session_id: "exercise-session-2",
    };
  }

  for await (const message of query({
    prompt: generateMessages(),
    options: {
      mcpServers: {
        "api-validator": apiValidatorServer,
      },
      model,
      allowedTools: ["mcp__api-validator__validate_api_response"],
    },
  })) {
    if (message.type === "assistant") {
      const content = message.message?.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block.type === "tool_use") {
            console.log(`[Tool Used]: ${block.name}`);
          }
        }
      }
    } else if (message.type === "result" && message.subtype === "success") {
      console.log("\nAgent Result:");
      console.log(message.result);
    }
  }
}

// -----------------------------------------------------------------------------
// Test 3: Missing Fields Detection (Breaking Changes)
// -----------------------------------------------------------------------------

async function testMissingFields() {
  console.log("\n" + "=".repeat(60));
  console.log("TEST 3: Missing Fields Detection (Breaking Changes)");
  console.log("=".repeat(60));

  async function* generateMessages() {
    yield {
      type: "user" as const,
      message: {
        role: "user" as const,
        content:
          "Validate https://jsonplaceholder.typicode.com/users/1 and check for these fields: id, name, email, nonExistentField, anotherMissingField. SLA: 500ms. Report any breaking changes.",
      },
      parent_tool_use_id: null,
      session_id: "exercise-session-3",
    };
  }

  for await (const message of query({
    prompt: generateMessages(),
    options: {
      mcpServers: {
        "api-validator": apiValidatorServer,
      },
      model,
      allowedTools: ["mcp__api-validator__validate_api_response"],
    },
  })) {
    if (message.type === "assistant") {
      const content = message.message?.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block.type === "tool_use") {
            console.log(`[Tool Used]: ${block.name}`);
          }
        }
      }
    } else if (message.type === "result" && message.subtype === "success") {
      console.log("\nAgent Result:");
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

  // Test 1: Basic validation
  await testBasicValidation();

  // Test 2: SLA violation (tight threshold)
  await testSLAViolation();

  // Test 3: Missing fields detection
  await testMissingFields();

  console.log("\n" + "=".repeat(60));
  console.log("All tests completed!");
  console.log("=".repeat(60));
}

main().catch(console.error);
