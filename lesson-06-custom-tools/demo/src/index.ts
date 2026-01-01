/**
 * Demo: Custom Tools - Tax Calculator
 *
 * Tests for the tax calculator custom tool.
 */

import "dotenv/config";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { taxToolServer, calculateTax, TaxResult } from "./tax-calculator.js";

// -----------------------------------------------------------------------------
// Step 1: Test tool directly (without agent)
// -----------------------------------------------------------------------------

async function step1_testToolDirectly() {
  console.log("\n--- STEP 1: Test Tax Calculator Directly ---\n");

  const testCases = [
    { amount: 100, rate: 0.08, desc: "$100 at 8%" },
    { amount: 249.99, rate: 0.0625, desc: "$249.99 at 6.25%" },
    { amount: 1000, rate: 0.1, desc: "$1000 at 10%" },
  ];

  for (const tc of testCases) {
    const result = calculateTax(tc.amount, tc.rate);
    console.log(`${tc.desc}:`);
    console.log(`  Subtotal: $${result.subtotal.toFixed(2)}`);
    console.log(`  Tax: $${result.tax.toFixed(2)}`);
    console.log(`  Total: $${result.total.toFixed(2)}\n`);
  }

  console.log("💡 Tool can be tested independently before agent integration!");
}

// -----------------------------------------------------------------------------
// Step 2: Use tool with agent via MCP server
// -----------------------------------------------------------------------------

async function step2_useWithAgent() {
  console.log("\n--- STEP 2: Use Tax Tool with Agent ---\n");

  // Create streaming input (required for MCP tools)
  async function* generateMessages() {
    yield {
      type: "user" as const,
      message: {
        role: "user" as const,
        content: "Calculate the tax on a $150 purchase with 8.5% sales tax rate.",
      },
    };
  }

  console.log("Prompt: Calculate tax on $150 at 8.5%\n");

  for await (const message of query({
    prompt: generateMessages(),
    options: {
      mcpServers: {
        "financial-tools": taxToolServer,
      },
      allowedTools: ["mcp__financial-tools__calculate_tax"],
      maxTurns: 3,
    },
  })) {
    if (message.type === "result" && message.subtype === "success") {
      console.log("📊 Agent Result:\n");
      console.log(message.result);
    }
  }

  console.log("\n💡 Agent automatically used the custom tool!");
}

// -----------------------------------------------------------------------------
// Step 3: Show precision handling
// -----------------------------------------------------------------------------

async function step3_precisionHandling() {
  console.log("\n--- STEP 3: Precision Handling ---\n");

  // Test case that would have floating point issues
  const problematic = [
    { amount: 19.99, rate: 0.07 }, // Common retail scenario
    { amount: 33.33, rate: 0.0825 }, // Repeating decimals
  ];

  console.log("Testing financial precision:\n");

  for (const tc of problematic) {
    const withRounding = calculateTax(tc.amount, tc.rate, true);
    const withoutRounding = calculateTax(tc.amount, tc.rate, false);

    console.log(`$${tc.amount} at ${(tc.rate * 100).toFixed(2)}%:`);
    console.log(`  With rounding: $${withRounding.total.toFixed(2)}`);
    console.log(`  Raw calculation: $${withoutRounding.total}`);
    console.log("");
  }

  console.log("💡 Rounding prevents floating point precision issues!");
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  DEMO: Custom Tools - Tax Calculator");
  console.log("  Using createSdkMcpServer and tool() helper");
  console.log("=".repeat(60));

  await step1_testToolDirectly();
  await step2_useWithAgent();
  await step3_precisionHandling();

  console.log("\n" + "=".repeat(60));
  console.log("  KEY TAKEAWAYS");
  console.log("=".repeat(60));
  console.log(`
  CUSTOM TOOL PATTERN:
  1. Define schema with Zod
  2. Create tool with tool() helper
  3. Wrap in createSdkMcpServer()
  4. Pass to query() via mcpServers option

  TOOL NAMING:
  • Format: mcp__<server-name>__<tool-name>
  • Example: mcp__financial-tools__calculate_tax

  KEY BENEFITS:
  • Type-safe input validation with Zod
  • Automatic tool discovery by agent
  • Can test tools independently
  • Proper financial precision handling
`);
}

main().catch(console.error);
