/**
 * Code Quality Reviewer - Deliverable
 *
 * Uses ESLint MCP server to analyze code quality,
 * identify issues, and provide recommendations.
 */

import "dotenv/config";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { mcpServersConfig, eslintTools } from "./config/mcp.config.js";

// -----------------------------------------------------------------------------
// Exported Types
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
// Main Function
// -----------------------------------------------------------------------------

export async function reviewCodeQuality(
  code: string,
  filename: string = "code.js"
): Promise<CodeQualityReport> {
  const prompt = `You are a code quality reviewer with access to ESLint via MCP.

Analyze the following code and provide a comprehensive quality report:

\`\`\`javascript
// ${filename}
${code}
\`\`\`

ANALYSIS REQUIREMENTS:

1. Identify all linting issues with:
   - Line and column number
   - Severity (error, warning, info)
   - ESLint rule violated
   - Description of the problem
   - How to fix it

2. Categorize issues:
   - formatting: Spacing, indentation, quotes, semicolons
   - bestPractices: no-var, no-eval, prefer-const, etc.
   - potentialBugs: no-unused-vars, no-cond-assign, etc.
   - other: Any other issues

3. Calculate quality score (0-100):
   - Start at 100
   - Subtract 10 for each error
   - Subtract 5 for each warning
   - Subtract 2 for each info
   - Minimum score is 0

4. Provide 2-4 actionable recommendations to improve the code.

Return the complete quality report in the structured JSON format.`;

  for await (const message of query({
    prompt,
    options: {
      mcpServers: {
        eslint: mcpServersConfig.eslint,
      },
      allowedTools: eslintTools,
      outputFormat: {
        type: "json_schema",
        schema: CodeQualityReportJSONSchema,
      },
      maxTurns: 5,
    },
  })) {
    if (message.type === "result" && message.structured_output) {
      return CodeQualityReportSchema.parse(message.structured_output);
    }
  }

  throw new Error("Failed to generate code quality report");
}
