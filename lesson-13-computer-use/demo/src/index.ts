/**
 * Lesson 13 Demo: Computer Use Capabilities
 *
 * This demo shows how to use Claude's computer use feature for GUI automation.
 *
 * IMPORTANT: This is a conceptual demo using mock implementations.
 * Real computer use requires a sandboxed environment (Docker/VM).
 * See: https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo
 *
 * Key Concepts:
 * 1. Computer use tool configuration
 * 2. Agent loop for handling GUI actions
 * 3. Screenshot-based visual feedback
 * 4. Safety and sandboxing considerations
 */

import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import {
  runComputerUseAgent,
  validateSandbox,
  createSafetySystemPrompt,
  createComputerTool,
} from "./computer-use-client.js";
import { DEFAULT_SAFETY_CONFIG } from "./types.js";
import { getScaleFactor } from "./action-handlers.js";

// -----------------------------------------------------------------------------
// Main Demo
// -----------------------------------------------------------------------------

async function main() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║         Lesson 13: Computer Use Capabilities               ║");
  console.log("╠════════════════════════════════════════════════════════════╣");
  console.log("║  This demo shows the patterns for Claude computer use.     ║");
  console.log("║  Using mock implementations - no real GUI interaction.     ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  // --------------------------------------------------------------------------
  // 1. Safety Check
  // --------------------------------------------------------------------------
  console.log("1. SAFETY CHECK");
  console.log("-".repeat(50));

  const sandboxCheck = validateSandbox();
  if (sandboxCheck.warnings.length > 0) {
    for (const warning of sandboxCheck.warnings) {
      console.log(`⚠️  ${warning}`);
    }
  }

  // Enable mock mode for demo
  process.env.MOCK_MODE = "true";
  console.log("✓ Mock mode enabled for demo\n");

  // --------------------------------------------------------------------------
  // 2. Display Configuration
  // --------------------------------------------------------------------------
  console.log("2. DISPLAY CONFIGURATION");
  console.log("-".repeat(50));

  const displayWidth = parseInt(process.env.DISPLAY_WIDTH || "1024");
  const displayHeight = parseInt(process.env.DISPLAY_HEIGHT || "768");
  const scaleFactor = getScaleFactor(displayWidth, displayHeight);

  console.log(`Display Size: ${displayWidth}x${displayHeight}`);
  console.log(`Scale Factor: ${scaleFactor.toFixed(3)}`);
  console.log(`Max recommended: 1568 pixels on longest edge`);
  console.log(`Max recommended: 1,150,000 total pixels\n`);

  // --------------------------------------------------------------------------
  // 3. Tool Configuration
  // --------------------------------------------------------------------------
  console.log("3. TOOL CONFIGURATION");
  console.log("-".repeat(50));

  const computerTool = createComputerTool();
  console.log("Computer Use Tool:");
  console.log(JSON.stringify(computerTool, null, 2));
  console.log();

  // --------------------------------------------------------------------------
  // 4. Safety Configuration
  // --------------------------------------------------------------------------
  console.log("4. SAFETY CONFIGURATION");
  console.log("-".repeat(50));

  console.log("Default Safety Settings:");
  console.log(`  - Use Virtual Machine: ${DEFAULT_SAFETY_CONFIG.useVirtualMachine}`);
  console.log(`  - Use Docker: ${DEFAULT_SAFETY_CONFIG.useDocker}`);
  console.log(`  - Max Actions/Session: ${DEFAULT_SAFETY_CONFIG.maxActionsPerSession}`);
  console.log(`  - Log All Actions: ${DEFAULT_SAFETY_CONFIG.logAllActions}`);
  console.log(`  - Screenshot on Error: ${DEFAULT_SAFETY_CONFIG.screenshotOnError}`);
  console.log(`  - Require Confirmation: ${DEFAULT_SAFETY_CONFIG.requireConfirmationFor.join(", ")}`);
  console.log();

  // --------------------------------------------------------------------------
  // 5. System Prompt
  // --------------------------------------------------------------------------
  console.log("5. SAFETY SYSTEM PROMPT");
  console.log("-".repeat(50));

  const systemPrompt = createSafetySystemPrompt();
  console.log(systemPrompt.substring(0, 200) + "...\n");

  // --------------------------------------------------------------------------
  // 6. Run Demo Agent (if API key available)
  // --------------------------------------------------------------------------
  console.log("6. AGENT DEMO");
  console.log("-".repeat(50));

  if (!process.env.ANTHROPIC_API_KEY) {
    console.log("⚠️  ANTHROPIC_API_KEY not set. Skipping live demo.");
    console.log("   Set the API key to run the agent loop demonstration.\n");
    showMockDemo();
    return;
  }

  const client = new Anthropic();

  // Demo task - simple screenshot request
  const task = `Take a screenshot to show me what's on the screen.
Then describe what you see in the screenshot.`;

  try {
    const result = await runComputerUseAgent(client, task);

    console.log("\n" + "=".repeat(50));
    console.log("DEMO COMPLETE");
    console.log("=".repeat(50));
    console.log(`Actions executed: ${result.actionCount}`);
    console.log(`Final response: ${result.finalResponse.substring(0, 200)}...`);

    console.log("\nAction Log:");
    for (const entry of result.actionLog) {
      console.log(`  ${entry.timestamp.toISOString()}: ${entry.action.action}`);
    }
  } catch (error) {
    console.error("Demo error:", error);
  }
}

// -----------------------------------------------------------------------------
// Mock Demo (when no API key)
// -----------------------------------------------------------------------------

function showMockDemo() {
  console.log("\n--- MOCK DEMONSTRATION ---\n");

  console.log("Example: How Claude would handle 'Open a text file' task\n");

  const mockActions = [
    { action: "screenshot", description: "Take initial screenshot" },
    { action: "mouse_move", coordinate: [100, 50], description: "Move to file manager icon" },
    { action: "double_click", coordinate: [100, 50], description: "Open file manager" },
    { action: "screenshot", description: "Verify file manager opened" },
    { action: "type", text: "document.txt", description: "Type filename in search" },
    { action: "key", text: "Return", description: "Press Enter to open" },
    { action: "screenshot", description: "Confirm file opened" },
  ];

  console.log("Simulated Action Sequence:");
  for (let i = 0; i < mockActions.length; i++) {
    const action = mockActions[i];
    console.log(`  ${i + 1}. [${action.action}] ${action.description}`);
    if ("coordinate" in action) {
      console.log(`     Coordinates: (${(action as any).coordinate.join(", ")})`);
    }
    if ("text" in action) {
      console.log(`     Text: "${(action as any).text}"`);
    }
  }

  console.log("\n--- KEY CONCEPTS ---\n");

  console.log("1. COMPUTER USE ARCHITECTURE");
  console.log("   - Claude receives screenshots as visual input");
  console.log("   - Returns pixel coordinates for mouse actions");
  console.log("   - Actions executed in sandboxed virtual display\n");

  console.log("2. SAFETY REQUIREMENTS");
  console.log("   - Must run in Docker container or VM");
  console.log("   - Limit network access to allowed domains");
  console.log("   - Log all actions for audit trail");
  console.log("   - Require confirmation for sensitive operations\n");

  console.log("3. BEST PRACTICES");
  console.log("   - Take screenshots frequently to verify state");
  console.log("   - Use explicit waits for page loads");
  console.log("   - Handle errors gracefully with recovery");
  console.log("   - Keep display resolution within recommended limits\n");

  console.log("4. USE CASES");
  console.log("   - GUI testing and automation");
  console.log("   - Legacy application integration");
  console.log("   - Robotic Process Automation (RPA)");
  console.log("   - Accessibility testing\n");
}

// -----------------------------------------------------------------------------
// Run
// -----------------------------------------------------------------------------

main().catch(console.error);
