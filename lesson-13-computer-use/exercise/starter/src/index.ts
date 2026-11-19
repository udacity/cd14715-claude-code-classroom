/**
 * Lesson 13 Exercise: Form Automation Agent
 *
 * This exercise demonstrates using Claude's computer use capabilities
 * to automate filling out a web form.
 *
 * Learning Objectives:
 * 1. Configure the computer use tool
 * 2. Implement the agent loop for GUI actions
 * 3. Handle screenshots and action results
 * 4. Apply safety configurations
 *
 * YOUR TASK:
 * 1. Open src/form-agent.ts
 * 2. Implement TODO: (1) createComputerTool()
 * 3. Implement TODO: (2) runFormAutomationAgent()
 *    - TODO: (2a) Make the API call with computer use
 *    - TODO: (2b) Format tool results (screenshots vs text)
 *    - TODO: (2c) Append messages to conversation
 */

import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { runFormAutomationAgent, createComputerTool } from "./form-agent.js";
import type { FormData } from "./types.js";
import { DEFAULT_SAFETY_CONFIG } from "./types.js";

// -----------------------------------------------------------------------------
// Sample Form Data
// -----------------------------------------------------------------------------

const sampleFormData: FormData = {
  firstName: "Jane",
  lastName: "Developer",
  email: "jane.developer@example.com",
  department: "engineering",
  message: "Testing the form automation with computer use capabilities.",
};

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║    Lesson 13 Exercise: Form Automation with Computer Use   ║");
  console.log("╠════════════════════════════════════════════════════════════╣");
  console.log("║  This exercise automates filling out a web form using      ║");
  console.log("║  Claude's computer use capabilities.                       ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  // Show configuration
  console.log("CONFIGURATION");
  console.log("-".repeat(50));

  try {
    const computerTool = createComputerTool();
    console.log("Computer Use Tool:");
    console.log(`  Display: ${computerTool.display_width_px}x${computerTool.display_height_px}`);
  } catch (error) {
    console.log("Computer Use Tool: NOT IMPLEMENTED (TODO: 1)");
  }
  console.log();

  console.log("Form Data:");
  console.log(`  Name: ${sampleFormData.firstName} ${sampleFormData.lastName}`);
  console.log(`  Email: ${sampleFormData.email}`);
  console.log(`  Department: ${sampleFormData.department}`);
  console.log(`  Message: ${sampleFormData.message.substring(0, 40)}...`);
  console.log();

  console.log("Safety Configuration:");
  console.log(`  Max Actions: ${DEFAULT_SAFETY_CONFIG.maxActions}`);
  console.log(`  Allowed Domains: ${DEFAULT_SAFETY_CONFIG.allowedDomains.join(", ")}`);
  console.log(`  Require Confirmation: ${DEFAULT_SAFETY_CONFIG.requireConfirmationForSubmit}`);
  console.log(`  Log All Actions: ${DEFAULT_SAFETY_CONFIG.logAllActions}`);
  console.log();

  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log("⚠️  ANTHROPIC_API_KEY not set. Running in demo mode.\n");
    showDemoMode();
    return;
  }

  // Run the agent
  console.log("RUNNING FORM AUTOMATION AGENT");
  console.log("-".repeat(50));

  const client = new Anthropic();

  try {
    const result = await runFormAutomationAgent(client, sampleFormData, DEFAULT_SAFETY_CONFIG);

    console.log("\n" + "=".repeat(50));
    console.log("RESULT");
    console.log("=".repeat(50));
    console.log(`Success: ${result.success}`);
    console.log(`Actions Executed: ${result.actionsExecuted}`);
    console.log(`Form Submitted: ${result.formSubmitted}`);

    if (result.actionLog.length > 0) {
      console.log("\nAction Log:");
      for (const entry of result.actionLog) {
        const time = entry.timestamp.toISOString().split("T")[1].split(".")[0];
        console.log(`  ${time} - ${entry.action.action}`);
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("TODO")) {
      console.log(`\n⚠️  Exercise not complete: ${error.message}`);
      console.log("\nPlease implement the TODOs in src/form-agent.ts");
    } else {
      console.error("Error:", error);
    }
  }
}

// -----------------------------------------------------------------------------
// Demo Mode (no API key)
// -----------------------------------------------------------------------------

function showDemoMode() {
  console.log("DEMO: Simulated Form Automation\n");

  const simulatedActions = [
    { action: "screenshot", note: "View initial form state" },
    { action: "left_click", coordinate: [200, 150], note: "Click first name field" },
    { action: "type", text: "Jane", note: "Enter first name" },
    { action: "key", text: "Tab", note: "Move to next field" },
    { action: "type", text: "Developer", note: "Enter last name" },
    { action: "key", text: "Tab", note: "Move to email field" },
    { action: "type", text: "jane.developer@example.com", note: "Enter email" },
    { action: "left_click", coordinate: [200, 350], note: "Click department dropdown" },
    { action: "wait", duration: 0.5, note: "Wait for dropdown to open" },
    { action: "left_click", coordinate: [200, 400], note: "Select 'engineering'" },
    { action: "left_click", coordinate: [200, 450], note: "Click message textarea" },
    { action: "type", text: "Testing...", note: "Enter message" },
    { action: "screenshot", note: "Verify filled form" },
    { action: "left_click", coordinate: [200, 550], note: "Click Submit button" },
    { action: "screenshot", note: "Confirm submission" },
  ];

  console.log("Simulated Action Sequence:");
  for (let i = 0; i < simulatedActions.length; i++) {
    const action = simulatedActions[i];
    const actionStr = `${action.action}${
      "coordinate" in action ? ` (${(action as any).coordinate.join(", ")})` : ""
    }${("text" in action && action.action === "type") ? `: "${(action as any).text}"` : ""}`;
    console.log(`  ${i + 1}. [${actionStr}] - ${action.note}`);
  }

  console.log("\n" + "=".repeat(50));
  console.log("EXERCISE INSTRUCTIONS");
  console.log("=".repeat(50));

  console.log(`
Open src/form-agent.ts and implement the following:

TODO: (1) createComputerTool()
   Return a ComputerUseTool object with:
   - type: "computer_20250124"
   - name: "computer"
   - display_width_px and display_height_px

TODO: (2) runFormAutomationAgent()
   2a. Make API call with:
       - client.beta.messages.create
       - betas: ["computer-use-2025-01-24"]

   2b. Format tool results:
       - Screenshots -> image content
       - Other actions -> text content

   2c. Append messages:
       - Assistant response
       - Tool results as user message

HINTS:
- The beta header is required for computer use
- Screenshots must be returned as base64 images
- The agent loop continues until end_turn
`);
}

// -----------------------------------------------------------------------------
// Run
// -----------------------------------------------------------------------------

main().catch(console.error);
