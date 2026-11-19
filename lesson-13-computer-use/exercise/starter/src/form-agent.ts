/**
 * Form Automation Agent
 *
 * Uses Claude's computer use capabilities to fill out a web form.
 * Demonstrates the agent loop pattern for GUI automation.
 *
 * YOUR TASK: Implement the missing parts marked with TODO
 */

import Anthropic from "@anthropic-ai/sdk";
import type {
  ComputerUseTool,
  ComputerAction,
  FormData,
  FormAutomationResult,
  SafetyConfig,
} from "./types.js";
import { executeAction, getActionLog, clearActionLog } from "./action-handlers.js";

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

const DISPLAY_WIDTH = parseInt(process.env.DISPLAY_WIDTH || "1024");
const DISPLAY_HEIGHT = parseInt(process.env.DISPLAY_HEIGHT || "768");

// -----------------------------------------------------------------------------
// Tool Creation
// -----------------------------------------------------------------------------

/**
 * Creates the computer use tool configuration.
 *
 * TODO: (1) Return a ComputerUseTool object with:
 * - type: "computer_20250124"
 * - name: "computer"
 * - display_width_px: DISPLAY_WIDTH
 * - display_height_px: DISPLAY_HEIGHT
 */
export function createComputerTool(): ComputerUseTool {
  // TODO: (1) Implement this function
  // HINT: The tool type must be exactly "computer_20250124"
  throw new Error("TODO: Implement createComputerTool");
}

// -----------------------------------------------------------------------------
// System Prompt
// -----------------------------------------------------------------------------

/**
 * Creates a task-specific system prompt for form automation.
 */
function createFormAutomationPrompt(formData: FormData): string {
  return `You are a form automation agent. Your task is to fill out a web form with the following data:

FORM DATA:
- First Name: ${formData.firstName}
- Last Name: ${formData.lastName}
- Email: ${formData.email}
- Department: ${formData.department}
- Message: ${formData.message}

INSTRUCTIONS:
1. First, take a screenshot to see the form
2. Identify each form field by its label
3. Click on each field and type the corresponding data
4. For the department dropdown, click to open it and select the correct option
5. After filling all fields, click the Submit button
6. Take a final screenshot to confirm submission

BEST PRACTICES:
- Take screenshots after each major step to verify state
- Click on a field before typing into it
- Use Tab key to move between fields if needed
- Wait briefly after clicking dropdowns for them to open

SAFETY:
- Only interact with the form on the current page
- Do not navigate to other pages
- Stop if you encounter any security warnings`;
}

// -----------------------------------------------------------------------------
// Form Automation Agent
// -----------------------------------------------------------------------------

/**
 * Runs the form automation agent.
 *
 * TODO: (2) Implement the agent loop that:
 * 1. Calls Claude with the computer use tool
 * 2. Processes tool_use blocks to execute actions
 * 3. Returns screenshots as image content
 * 4. Continues until end_turn or max iterations
 *
 * @param client - Anthropic client instance
 * @param formData - Data to fill into the form
 * @param safetyConfig - Safety configuration
 * @returns Automation result with action log
 */
export async function runFormAutomationAgent(
  client: Anthropic,
  formData: FormData,
  safetyConfig: SafetyConfig
): Promise<FormAutomationResult> {
  console.log("\n" + "=".repeat(50));
  console.log("Form Automation Agent");
  console.log("=".repeat(50));

  clearActionLog();

  const tools = [createComputerTool()];
  const systemPrompt = createFormAutomationPrompt(formData);

  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `Please fill out the web form with the provided data. Start by taking a screenshot.`,
    },
  ];

  let actionsExecuted = 0;
  let formSubmitted = false;

  // Agent loop
  for (let iteration = 0; iteration < safetyConfig.maxActions; iteration++) {
    console.log(`\n--- Iteration ${iteration + 1} ---`);

    // Check action limit
    if (actionsExecuted >= safetyConfig.maxActions) {
      console.log("Action limit reached");
      break;
    }

    // TODO: (2a) Call Claude with computer use enabled
    // HINT: Use client.beta.messages.create with:
    // - model: "claude-sonnet-4-5-20250929"
    // - max_tokens: 4096
    // - system: systemPrompt
    // - tools: tools (cast to Anthropic.Beta.BetaTool[])
    // - messages: messages
    // - betas: ["computer-use-2025-01-24"]
    const response = null as any; // TODO: Replace with actual API call

    console.log(`Stop reason: ${response.stop_reason}`);

    // Process response
    const toolResults: Anthropic.ToolResultBlockParam[] = [];

    for (const block of response.content) {
      if (block.type === "text") {
        console.log(`Claude: ${block.text.substring(0, 100)}...`);

        // Check if form was submitted
        if (
          block.text.toLowerCase().includes("submitted") ||
          block.text.toLowerCase().includes("complete")
        ) {
          formSubmitted = true;
        }
      } else if (block.type === "tool_use" && block.name === "computer") {
        const action = block.input as ComputerAction;
        console.log(`Action: ${action.action}`);

        // Execute the action
        const result = await executeAction(action);
        actionsExecuted++;

        // TODO: (2b) Format the tool result
        // HINT: If result.screenshot exists, return it as image content:
        // {
        //   type: "tool_result",
        //   tool_use_id: block.id,
        //   content: [{
        //     type: "image",
        //     source: { type: "base64", media_type: "image/png", data: result.screenshot }
        //   }]
        // }
        // Otherwise, return as text content:
        // {
        //   type: "tool_result",
        //   tool_use_id: block.id,
        //   content: result.output || result.error || "Action completed",
        //   is_error: !result.success
        // }

        // TODO: Implement tool result formatting and push to toolResults
      }
    }

    // Check if done
    if (toolResults.length === 0 || response.stop_reason === "end_turn") {
      console.log("Agent completed");
      break;
    }

    // TODO: (2c) Add assistant response and tool results to messages
    // HINT: Push two messages:
    // 1. { role: "assistant", content: response.content }
    // 2. { role: "user", content: toolResults }

    // TODO: Implement message appending
  }

  return {
    success: true,
    actionsExecuted,
    formSubmitted,
    actionLog: getActionLog(),
  };
}
