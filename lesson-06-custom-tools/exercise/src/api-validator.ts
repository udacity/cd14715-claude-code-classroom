/**
 * API Performance Validator Custom Tool
 *
 * Deliverable: A custom tool that validates API responses, measures latency,
 * and checks for SLA compliance.
 */

import { z } from "zod";
import { createSdkMcpServer, tool } from "@anthropic-ai/claude-agent-sdk";

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export interface ValidationResult {
  success: boolean;
  statusCode: number;
  latencyMs: number;
  schemaValid: boolean;
  schemaErrors: string[] | null;
  performanceIssues: {
    exceedsSLA: boolean;
    slaThresholdMs: number;
    actualLatencyMs: number;
  };
  breakingChanges: string[] | null;
  warnings: string[];
}

// -----------------------------------------------------------------------------
// Tool Schema
// -----------------------------------------------------------------------------

const validateApiSchema = {
  apiUrl: z.string().url().describe("The API endpoint URL to validate"),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]).describe("HTTP method"),
  expectedFields: z.array(z.string()).describe("Expected fields in response"),
  maxLatencyMs: z.number().positive().describe("SLA threshold in milliseconds"),
  headers: z.record(z.string()).optional().describe("Optional headers for auth"),
  body: z.string().optional().describe("Optional request body for POST/PUT"),
};

// -----------------------------------------------------------------------------
// Validation Logic
// -----------------------------------------------------------------------------

export async function validateApiResponse(
  apiUrl: string,
  method: string,
  expectedFields: string[],
  maxLatencyMs: number,
  headers?: Record<string, string>,
  body?: string
): Promise<ValidationResult> {
  const warnings: string[] = [];
  const schemaErrors: string[] = [];
  const breakingChanges: string[] = [];

  const start = Date.now();
  let statusCode = 0;
  let responseData: Record<string, unknown> = {};

  try {
    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body && (method === "POST" || method === "PUT")) {
      fetchOptions.body = body;
    }

    const response = await fetch(apiUrl, fetchOptions);
    statusCode = response.status;

    const latencyMs = Date.now() - start;

    // Parse response
    try {
      responseData = await response.json();
    } catch {
      schemaErrors.push("Response is not valid JSON");
    }

    // Check expected fields
    const responseFields = Object.keys(responseData);
    for (const field of expectedFields) {
      if (!responseFields.includes(field)) {
        breakingChanges.push(`Missing required field: ${field}`);
      }
    }

    // Check for extra fields (potential data leakage)
    const extraFields = responseFields.filter((f) => !expectedFields.includes(f));
    if (extraFields.length > 0) {
      warnings.push(`Unexpected fields in response: ${extraFields.join(", ")}`);
    }

    // Check status code
    if (statusCode < 200 || statusCode >= 300) {
      schemaErrors.push(`HTTP error: ${statusCode}`);
    }

    // Check performance
    const exceedsSLA = latencyMs > maxLatencyMs;
    if (exceedsSLA) {
      warnings.push(`Response time ${latencyMs}ms exceeds SLA of ${maxLatencyMs}ms`);
    }

    return {
      success: statusCode >= 200 && statusCode < 300 && breakingChanges.length === 0,
      statusCode,
      latencyMs,
      schemaValid: schemaErrors.length === 0 && breakingChanges.length === 0,
      schemaErrors: schemaErrors.length > 0 ? schemaErrors : null,
      performanceIssues: {
        exceedsSLA,
        slaThresholdMs: maxLatencyMs,
        actualLatencyMs: latencyMs,
      },
      breakingChanges: breakingChanges.length > 0 ? breakingChanges : null,
      warnings,
    };
  } catch (error) {
    const latencyMs = Date.now() - start;
    return {
      success: false,
      statusCode: 0,
      latencyMs,
      schemaValid: false,
      schemaErrors: [`Network error: ${(error as Error).message}`],
      performanceIssues: {
        exceedsSLA: true,
        slaThresholdMs: maxLatencyMs,
        actualLatencyMs: latencyMs,
      },
      breakingChanges: null,
      warnings: ["Request failed - could not reach endpoint"],
    };
  }
}

// -----------------------------------------------------------------------------
// Create Custom Tool Server
// -----------------------------------------------------------------------------

export const apiValidatorServer = createSdkMcpServer({
  name: "api-validator",
  version: "1.0.0",
  tools: [
    tool(
      "validate_api_response",
      "Validates API responses for schema compliance, performance, and SLA adherence. Returns detailed validation report with any issues found.",
      validateApiSchema,
      async (args): Promise<{ content: Array<{ type: "text"; text: string }> }> => {
        const result = await validateApiResponse(
          args.apiUrl,
          args.method,
          args.expectedFields,
          args.maxLatencyMs,
          args.headers,
          args.body
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }
    ),
  ],
});
