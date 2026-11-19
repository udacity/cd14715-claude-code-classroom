/**
 * JavaScript Code Reviewer Agent
 *
 * Deliverable: reviewJavaScriptFile() function using Claude Agent SDK
 * with the js-code-review skill loaded from .claude/skills/
 *
 * Combines Skills (L08) with Structured Outputs (L07) for type-safe results.
 */

import "dotenv/config";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { query } from "@anthropic-ai/claude-agent-sdk";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const model = process.env.ANTHROPIC_MODEL;
if (!model) {
  throw new Error("ANTHROPIC_MODEL is not set");
}

// Project root where .claude/skills/ is located
const PROJECT_ROOT = path.resolve(__dirname, "..");

// -----------------------------------------------------------------------------
// Zod Schema for Structured Output
// -----------------------------------------------------------------------------

const CodeIssueSchema = z.object({
  line: z.number().describe("Line number where the issue was found"),
  severity: z
    .enum(["error", "warning", "info"])
    .describe("Severity level of the issue"),
  category: z
    .enum(["quality", "bug", "security", "performance", "style"])
    .describe("Category of the issue"),
  message: z.string().describe("Description of the issue"),
  suggestion: z.string().describe("Suggested fix or improvement"),
});

const CodeReviewResultSchema = z.object({
  filename: z.string().describe("Name of the reviewed file"),
  summary: z.string().describe("Brief summary of the code review"),
  issues: z.array(CodeIssueSchema).describe("List of issues found"),
  score: z
    .number()
    .describe("Overall code quality score from 0-100"),
  recommendations: z
    .array(z.string())
    .describe("General recommendations for improvement"),
});

export type CodeIssue = z.infer<typeof CodeIssueSchema>;
export type CodeReviewResult = z.infer<typeof CodeReviewResultSchema>;

// Helper to convert Zod schema to JSON Schema with proper $ref handling
type JsonSchema = Record<string, unknown>;
const toJsonSchema = (schema: z.ZodTypeAny): JsonSchema =>
  zodToJsonSchema(schema, { $refStrategy: "root" }) as JsonSchema;

// Convert to JSON Schema for API use
// Use $refStrategy: 'root' to properly inline all $ref definitions
const CodeReviewJSONSchema = toJsonSchema(CodeReviewResultSchema);

// -----------------------------------------------------------------------------
// Prompt Function
// -----------------------------------------------------------------------------

const reviewPrompt = (filePath: string) => `You are a JavaScript code reviewer.

Use the js-code-review skill to analyze the JavaScript file at:
${filePath}

Steps:
1. Read the file using the Read tool
2. Use the js-code-review skill to analyze the code
3. Return a comprehensive review

Focus on:
- Code quality issues (var, console.log, unused variables)
- Potential bugs (loose equality, missing await, null access)
- Security issues (eval, innerHTML, hardcoded secrets)
- Best practices recommendations

Return the review with:
- filename: the basename of the file
- summary: brief overview of code quality
- issues: array of specific issues found with line, severity, category, message, suggestion
- score: overall quality score 0-100
- recommendations: general improvement suggestions`;

// -----------------------------------------------------------------------------
// Exported Function: reviewJavaScriptFile()
// -----------------------------------------------------------------------------

export async function reviewJavaScriptFile(
  filePath: string
): Promise<CodeReviewResult> {
  for await (const message of query({
    prompt: reviewPrompt(filePath),
    options: {
      cwd: PROJECT_ROOT,
      settingSources: ["project"],
      model,
      allowedTools: ["Skill", "Read", "Grep", "Glob"],
      // Enforce structured output matching our schema
      outputFormat: {
        type: "json_schema",
        schema: CodeReviewJSONSchema,
      },
    },
  })) {
    if (message.type === "assistant") {
      const content = message.message?.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block.type === "tool_use") {
            console.log(`[Tool]: ${block.name}`);
          }
        }
      }
    }

    // Handle successful structured output
    if (
      message.type === "result" &&
      message.subtype === "success" &&
      message.structured_output
    ) {
      // Validate with Zod for type safety
      const parsed = CodeReviewResultSchema.safeParse(message.structured_output);

      if (parsed.success) {
        return parsed.data;
      } else {
        console.error("Zod validation failed:", parsed.error.errors);
        throw new Error(`Schema validation failed: ${parsed.error.message}`);
      }
    }

    // Handle structured output retry exhaustion
    if (
      message.type === "result" &&
      message.subtype === "error_max_structured_output_retries"
    ) {
      throw new Error(
        "Structured output generation failed after maximum retries."
      );
    }
  }

  throw new Error("Failed to get structured output from agent");
}
