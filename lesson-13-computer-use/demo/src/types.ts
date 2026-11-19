/**
 * Computer Use Types
 * Type definitions for computer use actions and responses
 */

// -----------------------------------------------------------------------------
// Computer Use Actions
// -----------------------------------------------------------------------------

export type ComputerAction =
  | { action: "screenshot" }
  | { action: "left_click"; coordinate: [number, number] }
  | { action: "right_click"; coordinate: [number, number] }
  | { action: "double_click"; coordinate: [number, number] }
  | { action: "middle_click"; coordinate: [number, number] }
  | { action: "mouse_move"; coordinate: [number, number] }
  | { action: "left_click_drag"; startCoordinate: [number, number]; endCoordinate: [number, number] }
  | { action: "type"; text: string }
  | { action: "key"; text: string }
  | { action: "scroll"; coordinate: [number, number]; scrollDirection: "up" | "down" | "left" | "right"; scrollAmount: number }
  | { action: "wait"; duration: number };

// -----------------------------------------------------------------------------
// Tool Definitions
// -----------------------------------------------------------------------------

export interface ComputerUseTool {
  type: "computer_20250124";
  name: "computer";
  display_width_px: number;
  display_height_px: number;
  display_number?: number;
}

export interface BashTool {
  type: "bash_20250124";
  name: "bash";
}

export interface TextEditorTool {
  type: "text_editor_20250728";
  name: "str_replace_based_edit_tool";
}

export type ComputerUseTools = ComputerUseTool | BashTool | TextEditorTool;

// -----------------------------------------------------------------------------
// Action Result
// -----------------------------------------------------------------------------

export interface ActionResult {
  success: boolean;
  output?: string;
  screenshot?: string; // Base64 encoded image
  error?: string;
}

// -----------------------------------------------------------------------------
// Agent Loop Types
// -----------------------------------------------------------------------------

export interface AgentMessage {
  role: "user" | "assistant";
  content: unknown;
}

export interface ToolUseBlock {
  type: "tool_use";
  id: string;
  name: string;
  input: ComputerAction;
}

export interface ToolResultBlock {
  type: "tool_result";
  tool_use_id: string;
  content: string | Array<{ type: "image"; source: { type: "base64"; media_type: string; data: string } }>;
  is_error?: boolean;
}

// -----------------------------------------------------------------------------
// Safety Configuration
// -----------------------------------------------------------------------------

export interface SafetyConfig {
  // Sandboxing
  useVirtualMachine: boolean;
  useDocker: boolean;

  // Access restrictions
  allowedDomains?: string[];
  blockedDomains?: string[];

  // Action limits
  maxActionsPerSession: number;
  requireConfirmationFor: ("login" | "payment" | "delete" | "submit")[];

  // Logging
  logAllActions: boolean;
  screenshotOnError: boolean;
}

export const DEFAULT_SAFETY_CONFIG: SafetyConfig = {
  useVirtualMachine: true,
  useDocker: true,
  maxActionsPerSession: 100,
  requireConfirmationFor: ["login", "payment", "delete", "submit"],
  logAllActions: true,
  screenshotOnError: true,
};
