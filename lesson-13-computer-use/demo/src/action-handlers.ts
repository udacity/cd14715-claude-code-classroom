/**
 * Computer Use Action Handlers
 *
 * Mock implementations showing the pattern for handling computer use actions.
 * In production, these would interact with a real virtual display (Xvfb, etc.)
 *
 * IMPORTANT: Computer use requires a sandboxed environment (Docker/VM).
 * See: https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo
 */

import type { ComputerAction, ActionResult, SafetyConfig, DEFAULT_SAFETY_CONFIG } from "./types.js";

// -----------------------------------------------------------------------------
// Action Logger (for safety and debugging)
// -----------------------------------------------------------------------------

const actionLog: Array<{ timestamp: Date; action: ComputerAction; result: ActionResult }> = [];

export function logAction(action: ComputerAction, result: ActionResult): void {
  actionLog.push({ timestamp: new Date(), action, result });
  console.log(`[Action] ${action.action}:`, JSON.stringify(action));
}

export function getActionLog() {
  return actionLog;
}

// -----------------------------------------------------------------------------
// Mock Screenshot Generator
// -----------------------------------------------------------------------------

function generateMockScreenshot(): string {
  // In production, this would capture the actual virtual display
  // Using a placeholder base64 image (1x1 pixel PNG)
  return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
}

// -----------------------------------------------------------------------------
// Action Handlers (Mock Implementations)
// -----------------------------------------------------------------------------

export async function handleScreenshot(): Promise<ActionResult> {
  console.log("  -> Taking screenshot of virtual display");

  // In production: capture actual screenshot from Xvfb or similar
  // Example with xdotool: `import -display :1 -window root screenshot.png`

  return {
    success: true,
    screenshot: generateMockScreenshot(),
    output: "Screenshot captured successfully",
  };
}

export async function handleClick(
  x: number,
  y: number,
  clickType: "left" | "right" | "middle" | "double" = "left"
): Promise<ActionResult> {
  console.log(`  -> ${clickType} click at (${x}, ${y})`);

  // In production: use xdotool or similar
  // Example: `xdotool mousemove ${x} ${y} click 1`

  return {
    success: true,
    output: `${clickType} click executed at (${x}, ${y})`,
  };
}

export async function handleMouseMove(x: number, y: number): Promise<ActionResult> {
  console.log(`  -> Moving mouse to (${x}, ${y})`);

  // In production: `xdotool mousemove ${x} ${y}`

  return {
    success: true,
    output: `Mouse moved to (${x}, ${y})`,
  };
}

export async function handleType(text: string): Promise<ActionResult> {
  console.log(`  -> Typing: "${text.substring(0, 50)}${text.length > 50 ? "..." : ""}"`);

  // In production: `xdotool type "${text}"`
  // Be careful with special characters!

  return {
    success: true,
    output: `Typed ${text.length} characters`,
  };
}

export async function handleKey(key: string): Promise<ActionResult> {
  console.log(`  -> Pressing key: ${key}`);

  // In production: `xdotool key ${key}`
  // Supports combinations like "ctrl+s", "alt+Tab", etc.

  return {
    success: true,
    output: `Key pressed: ${key}`,
  };
}

export async function handleScroll(
  x: number,
  y: number,
  direction: "up" | "down" | "left" | "right",
  amount: number
): Promise<ActionResult> {
  console.log(`  -> Scrolling ${direction} by ${amount} at (${x}, ${y})`);

  // In production: xdotool doesn't support horizontal scroll easily
  // May need to use xte or similar

  return {
    success: true,
    output: `Scrolled ${direction} by ${amount}`,
  };
}

export async function handleDrag(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): Promise<ActionResult> {
  console.log(`  -> Dragging from (${startX}, ${startY}) to (${endX}, ${endY})`);

  // In production:
  // `xdotool mousemove ${startX} ${startY} mousedown 1 mousemove ${endX} ${endY} mouseup 1`

  return {
    success: true,
    output: `Dragged from (${startX}, ${startY}) to (${endX}, ${endY})`,
  };
}

export async function handleWait(duration: number): Promise<ActionResult> {
  console.log(`  -> Waiting ${duration} seconds`);

  await new Promise((resolve) => setTimeout(resolve, duration * 1000));

  return {
    success: true,
    output: `Waited ${duration} seconds`,
  };
}

// -----------------------------------------------------------------------------
// Main Action Dispatcher
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

    case "middle_click":
      result = await handleClick(action.coordinate[0], action.coordinate[1], "middle");
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

    case "left_click_drag":
      result = await handleDrag(
        action.startCoordinate[0],
        action.startCoordinate[1],
        action.endCoordinate[0],
        action.endCoordinate[1]
      );
      break;

    case "wait":
      result = await handleWait(action.duration);
      break;

    default:
      result = {
        success: false,
        error: `Unknown action: ${(action as any).action}`,
      };
  }

  logAction(action, result);
  return result;
}

// -----------------------------------------------------------------------------
// Coordinate Scaling (for high-resolution displays)
// -----------------------------------------------------------------------------

export function getScaleFactor(screenWidth: number, screenHeight: number): number {
  const MAX_LONG_EDGE = 1568;
  const MAX_PIXELS = 1_150_000;

  const longEdge = Math.max(screenWidth, screenHeight);
  const totalPixels = screenWidth * screenHeight;

  const longEdgeScale = MAX_LONG_EDGE / longEdge;
  const totalPixelsScale = Math.sqrt(MAX_PIXELS / totalPixels);

  return Math.min(1.0, longEdgeScale, totalPixelsScale);
}

export function scaleCoordinates(
  x: number,
  y: number,
  scaleFactor: number
): [number, number] {
  return [Math.round(x / scaleFactor), Math.round(y / scaleFactor)];
}
