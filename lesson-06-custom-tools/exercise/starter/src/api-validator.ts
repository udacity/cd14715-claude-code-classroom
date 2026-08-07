/**
 * API Performance Validator Custom Tool
 *
 * Deliverable: A custom tool that validates API responses, measures latency,
 * and checks for SLA compliance.
 *
 * Uses createSdkMcpServer and tool helper from Claude Agent SDK.
 */

import {z} from "zod";
import {createSdkMcpServer, tool} from "@anthropic-ai/claude-agent-sdk";

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
    apiUrl: z.url().describe("The API endpoint URL to validate"),
    method: z.enum(["GET", "POST", "PUT", "DELETE"]).describe("HTTP method"),
    expectedFields: z.array(z.string()).describe("Expected fields in response"),
    maxLatencyMs: z.number().positive().describe("SLA threshold in milliseconds"),
    headers: z.record(z.string(), z.string()).optional().describe("Optional headers for auth"),
    body: z.string().optional().describe("Optional request body for POST/PUT"),
};

// -----------------------------------------------------------------------------
// Validation Logic
// -----------------------------------------------------------------------------

async function validateApiResponse(
    apiUrl: URL,
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

        const response = await fetch(apiUrl, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            ...(body && (method === "POST" || method === "PUT") ? { body } : {})
        });

        statusCode = response.status;

        const latencyMs = Date.now() - start;

        try {
            responseData = await response.json();
        } catch {
            schemaErrors.push("Response is not valid JSON");
        }

        const responseFields = Object.keys(responseData)

        expectedFields.filter((field) => !responseFields.includes(field))
            .forEach(field => {
                breakingChanges.push(`Missing required field: ${field}`)
            })

        const extraFields = responseFields.filter((field) => !expectedFields.includes(field))
        if (extraFields.length > 0)
            warnings.push(`Unexpected fields in response: ${extraFields.join(", ")}`)


        if (statusCode < 200 || statusCode > 299)
            schemaErrors.push(`HTTP Error: ${statusCode}`);

        if (latencyMs > maxLatencyMs)
            warnings.push(`Latency is exceeding SLA with maximum latency ${latencyMs}ms`);

        return {
            success: statusCode === 200 && breakingChanges.length === 0,
            statusCode,
            latencyMs,
            schemaValid: schemaErrors.length === 0 && breakingChanges.length === 0,
            schemaErrors: schemaErrors.length > 0 ? schemaErrors : null,
            performanceIssues: {
                exceedsSLA: latencyMs > maxLatencyMs,
                slaThresholdMs: maxLatencyMs,
                actualLatencyMs: latencyMs,
            },
            breakingChanges: breakingChanges.length > 0 ? breakingChanges : null,
            warnings: warnings,
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
        tool("validate_api_response",
            `
        - This tool validates the REST API responses for schema compliance, SLA adherence. 
        - In addition, it returns detailed report with issues and warnings found, if any. 
        `,
            validateApiSchema,
            async (args): Promise<{ content: Array<{ type: "text"; text: string }> }> => {
                const {
                    apiUrl,
                    method,
                    expectedFields,
                    maxLatencyMs,
                    headers,
                    body
                } = args;
                const validationResult = await validateApiResponse(new URL(apiUrl as string),
                    method,
                    expectedFields,
                    maxLatencyMs,
                    headers,
                    body);
                return {
                    content: [{type: "text", text: JSON.stringify(validationResult, null, 2)}],
                };
            }
        )
    ],
});
