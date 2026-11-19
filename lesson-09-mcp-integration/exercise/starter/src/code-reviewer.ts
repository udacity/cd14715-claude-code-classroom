/**
 * Code Quality Reviewer - Exercise
 *
 * TODO: Build an agent that uses ESLint MCP server to analyze code quality,
 * identify issues, and provide recommendations.
 *
 * Learning objectives:
 * - Use MCP servers with the Claude Agent SDK
 * - Implement async generator input mode (streaming pattern)
 * - Handle MCP server connection status
 * - Parse and return structured results
 */

import "dotenv/config";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { eslintTools, mcpServersConfig } from "./config/mcp.config.js";

const model = process.env.ANTHROPIC_MODEL;
if (!model) {
  throw new Error("ANTHROPIC_MODEL is not set");
}

// -----------------------------------------------------------------------------
// Exported Types (provided - no changes needed)
// -----------------------------------------------------------------------------

export const LintIssueSchema = z.object({
  line: z.number(),
  column: z.number(),
  severity: z.enum(["error", "warning", "info"]),
  rule: z.string(),
  message: z.string(),
  fix: z.string(),
});

export const IssueSummarySchema = z.object({
  totalIssues: z.number(),
  errors: z.number(),
  warnings: z.number(),
  infos: z.number(),
});

export const IssueCategoriesSchema = z.object({
  formatting: z.number(),
  bestPractices: z.number(),
  potentialBugs: z.number(),
  other: z.number(),
});

export const CodeQualityReportSchema = z.object({
  filename: z.string(),
  qualityScore: z.number().min(0).max(100),
  issues: z.array(LintIssueSchema),
  summary: IssueSummarySchema,
  categories: IssueCategoriesSchema,
  recommendations: z.array(z.string()),
});

export type LintIssue = z.infer<typeof LintIssueSchema>;
export type IssueSummary = z.infer<typeof IssueSummarySchema>;
export type IssueCategories = z.infer<typeof IssueCategoriesSchema>;
export type CodeQualityReport = z.infer<typeof CodeQualityReportSchema>;

// Convert to JSON Schema for structured output
export const CodeQualityReportJSONSchema = zodToJsonSchema(CodeQualityReportSchema, {
  $refStrategy: "root",
});

// -----------------------------------------------------------------------------
// TODO: Step 1 - Implement async generator input mode
// This is the recommended pattern for MCP/streaming compatibility
// -----------------------------------------------------------------------------

async function* generateMessages(userMessage: string) {
  throw new Error("TODO: Implement generateMessages async generator");
}

// -----------------------------------------------------------------------------
// Main Function
// -----------------------------------------------------------------------------

export async function reviewCodeFile(filePath: string): Promise<any> {
  const userMessage = `You are a code quality reviewer with access to ESLint via MCP.

Analyze the JavaScript file and provide a comprehensive quality report.

File path: ${filePath}

ANALYSIS REQUIREMENTS:

1. Use the mcp__eslint__lint tool to lint the file at the path above

2. Use the Read tool to read the file at the path above

3. Identify all linting issues with:
   - Line and column number
   - Severity (error, warning, info)
   - ESLint rule violated
   - Description of the problem
   - How to fix it

4. Categorize issues:
   - formatting: Spacing, indentation, quotes, semicolons
   - bestPractices: no-var, no-eval, prefer-const, etc.
   - potentialBugs: no-unused-vars, no-cond-assign, etc.
   - other: Any other issues

5. Calculate quality score (0-100):
   - Start at 100
   - Subtract 10 for each error
   - Subtract 5 for each warning
   - Subtract 2 for each info
   - Minimum score is 0

6. Provide 2-4 actionable recommendations to improve the code.

Return the complete quality report in the structured JSON format.`;

  // TODO: Step 2 - Call the query function

  // TODO: Step 3 - Handle the message stream:
  // - Check for "init" message to verify MCP server connection status
  // - Log tool use events (when message.type === "assistant")
  // - Return the result when message.type === "result" && message.subtype === "success"

  throw new Error("TODO: Implement reviewCodeFile using query() with MCP servers");
}
