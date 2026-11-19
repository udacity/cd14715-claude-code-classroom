/**
 * Financial Calculator Custom Tools
 *
 * Deliverable: Multiple custom tools in one MCP server.
 * Demonstrates: Tax calculator and tip calculator with precision handling.
 * Uses createSdkMcpServer and tool helper from Claude Agent SDK.
 *
 * ARCHITECTURE NOTE: Business logic is extracted into separate exported functions
 * (calculateTax, calculateTip) so they can be unit tested independently of the
 * agent integration. This is a best practice for tool development.
 */

import { z } from "zod";
import { createSdkMcpServer, tool } from "@anthropic-ai/claude-agent-sdk";

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export interface TaxResult {
  subtotal: number;
  tax: number;
  total: number;
  effectiveRate: number;
  currency: string;
}

export interface TipResult {
  subtotal: number;
  tipAmount: number;
  total: number;
  tipPercentage: number;
  currency: string;
}

export interface WeatherResult {
  location: {
    latitude: number;
    longitude: number;
  };
  temperature: number;
  temperatureUnit: string;
  time: string;
}

// Error result type for consistent error handling
export interface ErrorResult {
  error: true;
  message: string;
  type?: string;
}

// -----------------------------------------------------------------------------
// Tool Schemas (exported for testing)
// -----------------------------------------------------------------------------

export const calculateTaxSchema = {
  amount: z.number().positive().describe("The pre-tax amount in dollars"),
  taxRate: z.number().min(0).max(0.5).describe("Tax rate as decimal (e.g., 0.08 for 8%)"),
  roundToNearestCent: z.boolean().optional().default(true).describe("Whether to round to nearest cent"),
};

export const calculateTipSchema = {
  amount: z.number().positive().describe("The bill amount before tip in dollars"),
  tipPercentage: z
    .number()
    .min(0)
    .max(100)
    .describe("Tip percentage (e.g., 15 for 15%, 20 for 20%)"),
  roundToNearestCent: z.boolean().optional().default(true).describe("Whether to round to nearest cent"),
};

export const getWeatherSchema = {
  latitude: z
    .number()
    .min(-90)
    .max(90)
    .describe("Latitude coordinate (-90 to 90)"),
  longitude: z
    .number()
    .min(-180)
    .max(180)
    .describe("Longitude coordinate (-180 to 180)"),
};

// -----------------------------------------------------------------------------
// Business Logic Functions (exported for unit testing)
// -----------------------------------------------------------------------------

/**
 * Calculate tax on an amount.
 * This function contains the core business logic, separated from the tool handler
 * so it can be unit tested independently.
 */
export function calculateTax(
  amount: number,
  taxRate: number,
  roundToNearestCent: boolean = true
): TaxResult | ErrorResult {
  // Validate inputs
  if (!Number.isFinite(amount) || !Number.isFinite(taxRate)) {
    return { error: true, message: "Amount and tax rate must be finite numbers" };
  }

  if (amount <= 0) {
    return { error: true, message: "Amount must be greater than zero" };
  }

  if (taxRate < 0 || taxRate > 0.5) {
    return { error: true, message: "Tax rate must be between 0 and 0.5 (0% to 50%)" };
  }

  // Calculate tax with proper precision
  let taxAmount = amount * taxRate;
  let total = amount + taxAmount;

  // Validate calculation results
  if (!Number.isFinite(taxAmount) || !Number.isFinite(total)) {
    return { error: true, message: "Tax calculation resulted in invalid values" };
  }

  // Round if requested
  if (roundToNearestCent) {
    taxAmount = Math.round(taxAmount * 100) / 100;
    total = Math.round(total * 100) / 100;
  }

  return {
    subtotal: amount,
    tax: taxAmount,
    total: total,
    effectiveRate: taxRate,
    currency: "USD",
  };
}

/**
 * Calculate tip on an amount.
 * This function contains the core business logic, separated from the tool handler
 * so it can be unit tested independently.
 */
export function calculateTip(
  amount: number,
  tipPercentage: number,
  roundToNearestCent: boolean = true
): TipResult | ErrorResult {
  // Validate inputs
  if (!Number.isFinite(amount) || !Number.isFinite(tipPercentage)) {
    return { error: true, message: "Amount and tip percentage must be finite numbers" };
  }

  if (amount <= 0) {
    return { error: true, message: "Amount must be greater than zero" };
  }

  if (tipPercentage < 0 || tipPercentage > 100) {
    return { error: true, message: "Tip percentage must be between 0 and 100" };
  }

  // Calculate tip with proper precision (convert percentage to decimal)
  let tipAmount = amount * (tipPercentage / 100);
  let total = amount + tipAmount;

  // Validate calculation results
  if (!Number.isFinite(tipAmount) || !Number.isFinite(total)) {
    return { error: true, message: "Tip calculation resulted in invalid values" };
  }

  // Round if requested
  if (roundToNearestCent) {
    tipAmount = Math.round(tipAmount * 100) / 100;
    total = Math.round(total * 100) / 100;
  }

  return {
    subtotal: amount,
    tipAmount: tipAmount,
    total: total,
    tipPercentage: tipPercentage,
    currency: "USD",
  };
}

// -----------------------------------------------------------------------------
// Helper: Check if result is an error
// -----------------------------------------------------------------------------

export function isError(result: unknown): result is ErrorResult {
  return typeof result === "object" && result !== null && "error" in result && (result as ErrorResult).error === true;
}

// -----------------------------------------------------------------------------
// Create Custom Tool Server with Multiple Tools
// -----------------------------------------------------------------------------

export const taxToolServer = createSdkMcpServer({
  name: "financial-tools",
  version: "1.0.0",
  tools: [
    tool(
      "calculate_tax",
      "Calculates tax amount and total including tax. Returns subtotal, tax amount, total, and effective rate. Handles decimal precision correctly for financial calculations.",
      calculateTaxSchema,
      async (args): Promise<{ content: Array<{ type: "text"; text: string }> }> => {
        const { amount, taxRate, roundToNearestCent = true } = args;
        const result = calculateTax(amount, taxRate, roundToNearestCent);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
    ),

    tool(
      "calculate_tip",
      "Calculates tip amount and total including tip. Returns subtotal, tip amount, total, and tip percentage. Handles decimal precision correctly for financial calculations.",
      calculateTipSchema,
      async (args): Promise<{ content: Array<{ type: "text"; text: string }> }> => {
        const { amount, tipPercentage, roundToNearestCent = true } = args;
        const result = calculateTip(amount, tipPercentage, roundToNearestCent);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
    ),

    tool(
      "get_weather",
      "Get current temperature for a location using coordinates. Uses the Open-Meteo API to fetch real-time weather data.",
      getWeatherSchema,
      async (args): Promise<{ content: Array<{ type: "text"; text: string }> }> => {
        try {
          const { latitude, longitude } = args;

          // Validate coordinates
          if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            throw new Error("Latitude and longitude must be finite numbers");
          }

          if (latitude < -90 || latitude > 90) {
            throw new Error("Latitude must be between -90 and 90");
          }

          if (longitude < -180 || longitude > 180) {
            throw new Error("Longitude must be between -180 and 180");
          }

          // Call external API (Open-Meteo - free weather API, no auth required)
          const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&temperature_unit=fahrenheit`;

          const response = await fetch(apiUrl);

          // Handle HTTP errors
          if (!response.ok) {
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      error: true,
                      message: `API error: ${response.status} ${response.statusText}`,
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          // Parse JSON response
          const data = await response.json();

          // Validate API response structure
          if (!data.current || typeof data.current.temperature_2m !== "number") {
            throw new Error("Invalid API response structure");
          }

          const result: WeatherResult = {
            location: {
              latitude,
              longitude,
            },
            temperature: data.current.temperature_2m,
            temperatureUnit: "°F",
            time: data.current.time || new Date().toISOString(),
          };

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          // Handle network errors, parsing errors, and other exceptions
          const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

          // Check for specific error types
          let errorType = "unknown";
          if (error instanceof TypeError && error.message.includes("fetch")) {
            errorType = "network";
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      error: true,
                      type: errorType,
                      message: "Network error: Unable to connect to weather API. Please check your internet connection.",
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    error: true,
                    type: errorType,
                    message: errorMessage,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }
      }
    ),
  ],
});
