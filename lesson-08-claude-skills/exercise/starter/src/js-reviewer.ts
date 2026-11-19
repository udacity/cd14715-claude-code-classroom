/**
 * JavaScript Code Reviewer Agent
 *
 * Exercise: Implement reviewJavaScriptFile() using Claude Agent SDK
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
// TODO 1: Define Zod Schemas for Structured Output
// -----------------------------------------------------------------------------

// TODO: Define CodeIssueSchema with these fields:
// - line: number (line number where issue was found)
// - severity: enum ["error", "warning", "info"]
// - category: enum ["quality", "bug", "security", "performance", "style"]
// - message: string (description of the issue)
// - suggestion: string (suggested fix)
const CodeIssueSchema = z.object({
  // TODO: Add your schema fields here
});

// TODO: Define CodeReviewResultSchema with these fields:
// - filename: string (name of reviewed file)
// - summary: string (brief summary of code review)
// - issues: array of CodeIssueSchema
// - score: number (quality score 0-100)
// - recommendations: array of strings
const CodeReviewResultSchema = z.object({
  // TODO: Add your schema fields here
});

export type CodeIssue = z.infer<typeof CodeIssueSchema>;
export type CodeReviewResult = z.infer<typeof CodeReviewResultSchema>;

// -----------------------------------------------------------------------------
// TODO 2: Convert Zod schema to JSON Schema
// -----------------------------------------------------------------------------

// Hint: Use zodToJsonSchema(CodeReviewResultSchema, { $refStrategy: "root" })
// The $refStrategy: "root" option properly inlines all $ref definitions
type JsonSchema = Record<string, unknown>;
const toJsonSchema = (schema: z.ZodTypeAny): JsonSchema =>
  zodToJsonSchema(schema, { $refStrategy: "root" }) as JsonSchema;

const CodeReviewJSONSchema = {}; // TODO: Replace with toJsonSchema(CodeReviewResultSchema)

// -----------------------------------------------------------------------------
// TODO 3: Create the Review Prompt
// -----------------------------------------------------------------------------

// TODO: Create a prompt that instructs Claude to:
// 1. Read the JavaScript file at the given path
// 2. Use the js-code-review skill to analyze the code
// 3. Return structured results matching the schema
const reviewPrompt = (filePath: string) => `
  TODO: Write your prompt here

  The prompt should:
  - Tell Claude it's a JavaScript code reviewer
  - Instruct it to read the file at: ${filePath}
  - Tell it to use the js-code-review skill
  - Specify what to analyze (bugs, security, quality, etc.)
  - Describe the expected output format
`;

// -----------------------------------------------------------------------------
// TODO 4: Implement reviewJavaScriptFile()
// -----------------------------------------------------------------------------

export async function reviewJavaScriptFile(
  filePath: string
): Promise<CodeReviewResult> {

  // TODO: Implement function
  // TODO: Validate structured_output with Zod
  // const parsed = CodeReviewResultSchema.safeParse(message.structured_output);
  // if (parsed.success) return parsed.data;

  throw new Error("TODO: Implement reviewJavaScriptFile()");
}
