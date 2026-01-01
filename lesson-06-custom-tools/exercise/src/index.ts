/**
 * Exercise: Custom Tools - API Validator
 *
 * Tests for the API validator custom tool.
 */

import "dotenv/config";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { apiValidatorServer, validateApiResponse, ValidationResult } from "./api-validator.js";

// -----------------------------------------------------------------------------
// Step 1: Test validator directly with public API
// -----------------------------------------------------------------------------

async function step1_testDirectly() {
  console.log("\n--- STEP 1: Test API Validator Directly ---\n");

  // Test with a public API (JSONPlaceholder)
  const result = await validateApiResponse(
    "https://jsonplaceholder.typicode.com/posts/1",
    "GET",
    ["id", "title", "body", "userId"],
    500 // 500ms SLA
  );

  console.log("Testing: JSONPlaceholder /posts/1\n");
  console.log(`  Success: ${result.success}`);
  console.log(`  Status: ${result.statusCode}`);
  console.log(`  Latency: ${result.latencyMs}ms`);
  console.log(`  Schema Valid: ${result.schemaValid}`);
  console.log(`  Exceeds SLA: ${result.performanceIssues.exceedsSLA}`);

  if (result.warnings.length > 0) {
    console.log(`  Warnings: ${result.warnings.join(", ")}`);
  }

  console.log("\n💡 Validator checks schema, performance, and SLA compliance!");
}

// -----------------------------------------------------------------------------
// Step 2: Test with agent via MCP server
// -----------------------------------------------------------------------------

async function step2_useWithAgent() {
  console.log("\n--- STEP 2: Use Validator with Agent ---\n");

  async function* generateMessages() {
    yield {
      type: "user" as const,
      message: {
        role: "user" as const,
        content:
          "Validate the JSONPlaceholder users API at https://jsonplaceholder.typicode.com/users/1. Check for fields: id, name, email, phone. SLA threshold: 300ms.",
      },
    };
  }

  console.log("Prompt: Validate JSONPlaceholder users API\n");

  for await (const message of query({
    prompt: generateMessages(),
    options: {
      mcpServers: {
        "api-validator": apiValidatorServer,
      },
      allowedTools: ["mcp__api-validator__validate_api_response"],
      maxTurns: 3,
    },
  })) {
    if (message.type === "result" && message.subtype === "success") {
      console.log("📊 Agent Result:\n");
      console.log(message.result);
    }
  }

  console.log("\n💡 Agent used custom validator tool for API testing!");
}

// -----------------------------------------------------------------------------
// Step 3: Test various scenarios
// -----------------------------------------------------------------------------

async function step3_testScenarios() {
  console.log("\n--- STEP 3: Test Various Scenarios ---\n");

  const scenarios = [
    {
      name: "Valid API within SLA",
      url: "https://jsonplaceholder.typicode.com/posts/1",
      fields: ["id", "title", "body", "userId"],
      sla: 2000,
    },
    {
      name: "Missing expected field",
      url: "https://jsonplaceholder.typicode.com/posts/1",
      fields: ["id", "title", "nonExistentField"],
      sla: 2000,
    },
    {
      name: "Strict SLA (50ms)",
      url: "https://jsonplaceholder.typicode.com/posts/1",
      fields: ["id", "title"],
      sla: 50,
    },
  ];

  for (const scenario of scenarios) {
    const result = await validateApiResponse(scenario.url, "GET", scenario.fields, scenario.sla);

    console.log(`${scenario.name}:`);
    console.log(`  Success: ${result.success}`);
    console.log(`  Breaking Changes: ${result.breakingChanges?.join(", ") || "None"}`);
    console.log(`  Exceeds SLA: ${result.performanceIssues.exceedsSLA}`);
    console.log(`  Warnings: ${result.warnings.length > 0 ? result.warnings.join(", ") : "None"}\n`);
  }

  console.log("💡 Validator catches schema mismatches and SLA violations!");
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  EXERCISE: Custom Tools - API Validator");
  console.log("  Testing: validateApiResponse() tool");
  console.log("=".repeat(60));

  await step1_testDirectly();
  await step2_useWithAgent();
  await step3_testScenarios();

  console.log("\n" + "=".repeat(60));
  console.log("  KEY TAKEAWAYS");
  console.log("=".repeat(60));
  console.log(`
  DELIVERABLE: api-validator.ts
  • Exports: ValidationResult interface
  • Exports: validateApiResponse() function
  • Exports: apiValidatorServer MCP server

  VALIDATION CHECKS:
  • HTTP status code (2xx = success)
  • Expected fields (breaking changes if missing)
  • Extra fields (warnings for data leakage)
  • Latency vs SLA threshold

  USE CASES:
  • CI/CD pipeline API testing
  • Production health monitoring
  • Schema regression detection
`);
}

main().catch(console.error);
