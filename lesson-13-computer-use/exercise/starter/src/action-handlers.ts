/**
 * Action Handlers for Form Automation
 *
 * Mock implementations for computer use actions.
 * In production, these would interact with a real virtual display.
 */

import type { ComputerAction, ActionResult } from "./types.js";

// -----------------------------------------------------------------------------
// Action Log
// -----------------------------------------------------------------------------

const actionLog: Array<{ timestamp: Date; action: ComputerAction; result: ActionResult }> = [];

export function logAction(action: ComputerAction, result: ActionResult): void {
  actionLog.push({ timestamp: new Date(), action, result });
  console.log(`  [Action] ${action.action}:`, JSON.stringify(action));
}

export function getActionLog() {
  return [...actionLog];
}

export function clearActionLog() {
  actionLog.length = 0;
}

// -----------------------------------------------------------------------------
// Mock Screenshot Generator
// -----------------------------------------------------------------------------

function generateMockScreenshot(): string {
  // 1x1 pixel PNG placeholder
  return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
}

// -----------------------------------------------------------------------------
// Action Implementations
// -----------------------------------------------------------------------------

export async function handleScreenshot(): Promise<ActionResult> {
  console.log("    -> Capturing screenshot");
  return {
    success: true,
    screenshot: generateMockScreenshot(),
    output: "Screenshot captured",
  };
}

export async function handleClick(
  x: number,
  y: number,
  type: "left" | "right" | "double" = "left"
): Promise<ActionResult> {
  console.log(`    -> ${type} click at (${x}, ${y})`);
  return {
    success: true,
    output: `${type} click at (${x}, ${y})`,
  };
}

export async function handleMouseMove(x: number, y: number): Promise<ActionResult> {
  console.log(`    -> Mouse move to (${x}, ${y})`);
  return {
    success: true,
    output: `Mouse moved to (${x}, ${y})`,
  };
}

export async function handleType(text: string): Promise<ActionResult> {
  const preview = text.length > 30 ? text.substring(0, 30) + "..." : text;
  console.log(`    -> Typing: "${preview}"`);
  return {
    success: true,
    output: `Typed ${text.length} characters`,
  };
}

export async function handleKey(key: string): Promise<ActionResult> {
  console.log(`    -> Key press: ${key}`);
  return {
    success: true,
    output: `Key pressed: ${key}`,
  };
}

export async function handleScroll(
  x: number,
  y: number,
  direction: "up" | "down",
  amount: number
): Promise<ActionResult> {
  console.log(`    -> Scroll ${direction} by ${amount} at (${x}, ${y})`);
  return {
    success: true,
    output: `Scrolled ${direction} by ${amount}`,
  };
}

export async function handleWait(duration: number): Promise<ActionResult> {
  console.log(`    -> Waiting ${duration}s`);
  await new Promise((resolve) => setTimeout(resolve, duration * 1000));
  return {
    success: true,
    output: `Waited ${duration} seconds`,
  };
}

// -----------------------------------------------------------------------------
// Action Dispatcher
// -----------------------------------------------------------------------------

export async function executeAction(action: ComputerAction): Promise<ActionResult> {
  let result: ActionResult;

  switch (action.action) {
    case "screenshot":
      result = await handleScreenshot();
      break;

    case "left_click":
      result = await handleClick(action.coordinate[0], action.coordinate[1], "left");
      break;

    case "right_click":
      result = await handleClick(action.coordinate[0], action.coordinate[1], "right");
      break;

    case "double_click":
      result = await handleClick(action.coordinate[0], action.coordinate[1], "double");
      break;

    case "mouse_move":
      result = await handleMouseMove(action.coordinate[0], action.coordinate[1]);
      break;

    case "type":
      result = await handleType(action.text);
      break;

    case "key":
      result = await handleKey(action.text);
      break;

    case "scroll":
      result = await handleScroll(
        action.coordinate[0],
        action.coordinate[1],
        action.scrollDirection,
        action.scrollAmount
      );
      break;

    case "wait":
      result = await handleWait(action.duration);
      break;

    default:
      result = {
        success: false,
        error: `Unknown action: ${(action as ComputerAction).action}`,
      };
  }

  logAction(action, result);
  return result;
}
