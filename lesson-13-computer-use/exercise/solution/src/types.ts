/**
 * Types for Form Automation Exercise
 *
 * Defines the computer use actions and form data structures.
 */

// -----------------------------------------------------------------------------
// Computer Use Actions
// -----------------------------------------------------------------------------

export type ComputerAction =
  | { action: "screenshot" }
  | { action: "left_click"; coordinate: [number, number] }
  | { action: "right_click"; coordinate: [number, number] }
  | { action: "double_click"; coordinate: [number, number] }
  | { action: "mouse_move"; coordinate: [number, number] }
  | { action: "type"; text: string }
  | { action: "key"; text: string }
  | { action: "scroll"; coordinate: [number, number]; scrollDirection: "up" | "down"; scrollAmount: number }
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
// Form Data (for the exercise scenario)
// -----------------------------------------------------------------------------

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  department: "engineering" | "marketing" | "sales" | "support";
  message: string;
}

// -----------------------------------------------------------------------------
// Form Automation Result
// -----------------------------------------------------------------------------

export interface FormAutomationResult {
  success: boolean;
  actionsExecuted: number;
  formSubmitted: boolean;
  error?: string;
  actionLog: Array<{
    timestamp: Date;
    action: ComputerAction;
    result: ActionResult;
  }>;
}

// -----------------------------------------------------------------------------
// Safety Configuration
// -----------------------------------------------------------------------------

export interface SafetyConfig {
  maxActions: number;
  allowedDomains: string[];
  requireConfirmationForSubmit: boolean;
  logAllActions: boolean;
}

export const DEFAULT_SAFETY_CONFIG: SafetyConfig = {
  maxActions: 50,
  allowedDomains: ["localhost", "example.com"],
  requireConfirmationForSubmit: true,
  logAllActions: true,
};
