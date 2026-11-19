/**
 * Computer Use Client
 *
 * Demonstrates how to configure and use Claude's computer use capabilities.
 * This shows the agent loop pattern for handling computer actions.
 *
 * IMPORTANT: Computer use requires a sandboxed environment (Docker/VM).
 * See: https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo
 */

import Anthropic from "@anthropic-ai/sdk";
import type { ComputerUseTool, BashTool, TextEditorTool, ComputerAction, ActionResult } from "./types.js";
import { executeAction, logAction, getActionLog } from "./action-handlers.js";

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

const DISPLAY_WIDTH = parseInt(process.env.DISPLAY_WIDTH || "1024");
const DISPLAY_HEIGHT = parseInt(process.env.DISPLAY_HEIGHT || "768");
const MAX_ITERATIONS = 20;

// -----------------------------------------------------------------------------
// Tool Definitions for Computer Use
// -----------------------------------------------------------------------------

/**
 * Creates the computer use tool configuration.
 * The tool type "computer_20250124" enables pixel-based GUI interaction.
 */
export function createComputerTool(): ComputerUseTool {
  return {
    type: "computer_20250124",
    name: "computer",
    display_width_px: DISPLAY_WIDTH,
    display_height_px: DISPLAY_HEIGHT,
    display_number: 1, // Optional: X11 display number
  };
}

/**
 * Creates the bash tool for command execution.
 * Useful for file operations and system commands.
 */
export function createBashTool(): BashTool {
  return {
    type: "bash_20250124",
    name: "bash",
  };
}

/**
 * Creates the text editor tool for file editing.
 * Alternative to bash for precise file modifications.
 */
export function createTextEditorTool(): TextEditorTool {
  return {
    type: "text_editor_20250728",
    name: "str_replace_based_edit_tool",
  };
}

// -----------------------------------------------------------------------------
// Agent Loop Implementation
// -----------------------------------------------------------------------------

export interface ComputerUseResult {
  success: boolean;
  finalResponse: string;
  actionCount: number;
  actionLog: Array<{ timestamp: Date; action: ComputerAction; result: ActionResult }>;
}

/**
 * Runs the computer use agent loop.
 *
 * The loop:
 * 1. Sends the task to Claude with computer use tools
 * 2. Claude responds with either text or tool calls
 * 3. For tool calls, execute the action and return results
 * 4. Continue until Claude responds with end_turn or max iterations
 *
 * @param client - Anthropic client instance
 * @param task - The task description for the agent
 * @returns Result containing the final response and action log
 */
export async function runComputerUseAgent(
  client: Anthropic,
  task: string
): Promise<ComputerUseResult> {
  console.log("\n" + "=".repeat(60));
  console.log("Starting Computer Use Agent");
  console.log("=".repeat(60));
  console.log(`Task: ${task}`);
  console.log(`Display: ${DISPLAY_WIDTH}x${DISPLAY_HEIGHT}`);
  console.log("=".repeat(60) + "\n");

  // Define available tools
  const tools = [createComputerTool(), createBashTool(), createTextEditorTool()];

  // Initialize conversation with the task
  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: task,
    },
  ];

  let actionCount = 0;
  let finalResponse = "";

  // Agent loop
  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    console.log(`\n--- Iteration ${iteration + 1} ---`);

    // Call Claude with computer use enabled
    // Note: Computer use requires the beta header
    const response = await client.beta.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4096,
      tools: tools as Anthropic.Beta.BetaTool[],
      messages,
      betas: ["computer-use-2025-01-24"],
    });

    console.log(`Stop reason: ${response.stop_reason}`);

    // Process response content
    const toolResults: Anthropic.MessageParam["content"] = [];

    for (const block of response.content) {
      if (block.type === "text") {
        console.log(`\nClaude: ${block.text}`);
        finalResponse = block.text;
      } else if (block.type === "tool_use") {
        console.log(`\nTool call: ${block.name}`);

        // Handle different tool types
        if (block.name === "computer") {
          const action = block.input as ComputerAction;
          const result = await executeAction(action);
          actionCount++;

          // Format tool result
          if (result.screenshot) {
            // Return screenshot as image content
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: "image/png",
                    data: result.screenshot,
                  },
                },
              ],
            } as Anthropic.ToolResultBlockParam);
          } else {
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: result.output || result.error || "Action completed",
              is_error: !result.success,
            } as Anthropic.ToolResultBlockParam);
          }
        } else if (block.name === "bash") {
          // Mock bash execution (in production, execute in sandbox)
          console.log(`  Bash command: ${JSON.stringify(block.input)}`);
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: "[Mock] Bash command executed successfully",
          } as Anthropic.ToolResultBlockParam);
        } else if (block.name === "str_replace_based_edit_tool") {
          // Mock text editor (in production, execute in sandbox)
          console.log(`  Text editor: ${JSON.stringify(block.input)}`);
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: "[Mock] File edited successfully",
          } as Anthropic.ToolResultBlockParam);
        }
      }
    }

    // If no tool calls, we're done
    if (toolResults.length === 0 || response.stop_reason === "end_turn") {
      console.log("\nAgent completed task");
      break;
    }

    // Add assistant response and tool results to conversation
    messages.push({
      role: "assistant",
      content: response.content,
    });

    messages.push({
      role: "user",
      content: toolResults,
    });
  }

  return {
    success: true,
    finalResponse,
    actionCount,
    actionLog: getActionLog(),
  };
}

// -----------------------------------------------------------------------------
// Safety Utilities
// -----------------------------------------------------------------------------

/**
 * Validates that the environment is properly sandboxed.
 * In production, this would check for Docker/VM environment.
 */
export function validateSandbox(): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Check for common sandbox indicators
  const isDocker = process.env.DOCKER_CONTAINER === "true";
  const isVM = process.env.VM_ENVIRONMENT === "true";
  const isMock = process.env.MOCK_MODE === "true";

  if (!isDocker && !isVM && !isMock) {
    warnings.push(
      "WARNING: Not running in a detected sandbox environment. " +
        "Computer use should only be run in Docker or a VM for safety."
    );
  }

  // Check display configuration
  if (!process.env.DISPLAY_WIDTH || !process.env.DISPLAY_HEIGHT) {
    warnings.push("Display dimensions not configured. Using defaults.");
  }

  return {
    valid: isDocker || isVM || isMock,
    warnings,
  };
}

/**
 * Creates a system prompt with safety guidelines.
 */
export function createSafetySystemPrompt(): string {
  return `You are a computer use agent operating in a sandboxed environment.

SAFETY GUIDELINES:
1. Only interact with applications and websites relevant to the task
2. Never enter credentials or sensitive information
3. Do not make purchases or financial transactions
4. Do not access personal accounts or private data
5. Stop and report if you encounter unexpected security prompts
6. Verify URLs before interacting with web content

BEST PRACTICES:
1. Take screenshots frequently to verify state
2. Move mouse to target before clicking
3. Wait for page loads and animations
4. Use keyboard shortcuts when more reliable
5. Break complex tasks into simple steps

Report any issues or unexpected behavior immediately.`;
}
