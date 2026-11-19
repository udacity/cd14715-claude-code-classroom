/**
 * Extended Thinking with Tool Use
 *
 * Demonstrates interleaved thinking - Claude reasons before and after tool calls.
 * This combines concepts from Lesson 02 (Extended Thinking) with Lesson 06 (Tools).
 *
 * Key Pattern: thinking → tool_use → thinking → text
 */

import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { Message } from "@anthropic-ai/sdk/resources";

const client = new Anthropic();
const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929";

// -----------------------------------------------------------------------------
// Tool Definition
// -----------------------------------------------------------------------------

const calculateTaxTool: Anthropic.Tool = {
  name: "calculate_tax",
  description: "Calculate sales tax for a purchase amount",
  input_schema: {
    type: "object" as const,
    properties: {
      amount: {
        type: "number",
        description: "The purchase amount in dollars",
      },
      tax_rate: {
        type: "number",
        description: "The tax rate as a percentage (e.g., 8.5 for 8.5%)",
      },
    },
    required: ["amount", "tax_rate"],
  },
};

// -----------------------------------------------------------------------------
// Tool Execution
// -----------------------------------------------------------------------------

function executeTool(name: string, input: Record<string, unknown>): string {
  if (name === "calculate_tax") {
    const amount = input.amount as number;
    const taxRate = input.tax_rate as number;
    const tax = amount * (taxRate / 100);
    const total = amount + tax;
    return JSON.stringify({
      amount,
      tax_rate: taxRate,
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    });
  }
  return JSON.stringify({ error: "Unknown tool" });
}

// -----------------------------------------------------------------------------
// Ensure Response is Parsed (for Vocareum proxy)
// -----------------------------------------------------------------------------

function ensureParsedResponse(response: Message | string): Message {
  if (typeof response === "string") {
    return JSON.parse(response) as Message;
  }
  return response;
}

// -----------------------------------------------------------------------------
// Demo: Extended Thinking with Tool Use
// -----------------------------------------------------------------------------

async function demoThinkingWithTools() {
  console.log("=".repeat(60));
  console.log("  Extended Thinking with Tool Use");
  console.log("  Combining Lesson 02 + Lesson 06 concepts");
  console.log("=".repeat(60) + "\n");

  const userMessage = "Calculate tax for $50,000 income in CA (9.3% state tax rate)";
  console.log(`User: ${userMessage}\n`);

  // Initial request with thinking enabled and tools
  const rawResponse = await client.messages.create({
    model,
    max_tokens: 16000,
    thinking: {
      type: "enabled",
      budget_tokens: 10000,
    },
    tools: [calculateTaxTool],
    messages: [{ role: "user", content: userMessage }],
  });

  const response = ensureParsedResponse(rawResponse as Message | string);

  console.log("--- Response Analysis ---\n");

  // Track blocks for conversation continuation
  let thinkingBlock: Anthropic.ThinkingBlock | null = null;
  let toolUseBlock: Anthropic.ToolUseBlock | null = null;

  // Process response - shows interleaved thinking → tool_use pattern
  for (const block of response.content) {
    if (block.type === "thinking") {
      console.log("📝 THINKING BLOCK:");
      console.log(`   "${block.thinking.substring(0, 200)}..."\n`);
      thinkingBlock = block;
    } else if (block.type === "tool_use") {
      console.log("🔧 TOOL USE BLOCK:");
      console.log(`   Tool: ${block.name}`);
      console.log(`   Input: ${JSON.stringify(block.input)}\n`);
      toolUseBlock = block;
    } else if (block.type === "text") {
      console.log("💬 TEXT BLOCK:");
      console.log(`   "${block.text}"\n`);
    }
  }

  // If tool was called, execute and continue conversation
  if (toolUseBlock) {
    console.log("--- Executing Tool ---\n");

    const toolResult = executeTool(
      toolUseBlock.name,
      toolUseBlock.input as Record<string, unknown>
    );
    console.log(`Tool Result: ${toolResult}\n`);

    // Continue conversation with tool result
    // IMPORTANT: Must include thinking block when continuing with tool results
    const continuationMessages: Anthropic.MessageParam[] = [
      { role: "user", content: userMessage },
      {
        role: "assistant",
        content: thinkingBlock
          ? [thinkingBlock, toolUseBlock]
          : [toolUseBlock],
      },
      {
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: toolUseBlock.id,
            content: toolResult,
          },
        ],
      },
    ];

    console.log("--- Continuation Response ---\n");

    const rawContinuation = await client.messages.create({
      model,
      max_tokens: 16000,
      thinking: {
        type: "enabled",
        budget_tokens: 10000,
      },
      tools: [calculateTaxTool],
      messages: continuationMessages,
    });

    const continuation = ensureParsedResponse(rawContinuation as Message | string);

    // Process continuation - may have more thinking before final answer
    for (const block of continuation.content) {
      if (block.type === "thinking") {
        console.log("📝 THINKING (after tool result):");
        console.log(`   "${block.thinking.substring(0, 200)}..."\n`);
      } else if (block.type === "text") {
        console.log("💬 FINAL RESPONSE:");
        console.log(`   ${block.text}\n`);
      }
    }
  }

  // Summary
  console.log("=".repeat(60));
  console.log("KEY CONCEPTS:");
  console.log("=".repeat(60));
  console.log(`
1. ENABLE BOTH THINKING AND TOOLS:
   thinking: { type: "enabled", budget_tokens: 10000 }
   tools: [{ name: "calculate_tax", ... }]

2. RESPONSE CONTAINS INTERLEAVED BLOCKS:
   thinking → tool_use → (after tool result) → thinking → text

3. PRESERVE THINKING BLOCKS:
   When continuing with tool results, include the thinking
   block in the assistant message to maintain reasoning continuity.

4. USE CASES:
   - Complex calculations requiring reasoning
   - Multi-step tool workflows
   - Audit trails showing AI decision-making
`);
}

// -----------------------------------------------------------------------------
// Run
// -----------------------------------------------------------------------------

demoThinkingWithTools().catch(console.error);
