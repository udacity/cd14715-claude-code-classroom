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

const CodeIssueSchema = z.object({
  line: z.number().min(1)
      .describe("Line number where the issue was found"),
  severity: z.enum(["error", "warning", "info"]).describe("Severity level of the issue"),
  category: z.enum(["quality", "bug", "security", "performance", "style"])
      .describe("Category of the issue stating what it is related to the most"),
  message: z.string().max(200).describe("Short description of the issue"),
  suggestion: z.string().max(300).describe("Suggested fix or improvement for the issue"),
});

const CodeReviewResultSchema = z.object({
  filename: z.string().max(30).describe("Name of the reviewed file name"),
  summary: z.string().max(200).describe("Review summary of the reviewed file"),
  issues: z.array(CodeIssueSchema).describe("List of issues found in the reviewed file"),
  score: z.number().min(0).max(100)
      .describe("Quality score of the reviewed file from 0-100 where 0 is the worst and 100 is the best"),
  recommendations: z.array(z.string().max(200)).describe("List of recommendations for improving the reviewed file"),
});

export type CodeIssue = z.infer<typeof CodeIssueSchema>;
export type CodeReviewResult = z.infer<typeof CodeReviewResultSchema>;

type JsonSchema = Record<string, unknown>;
const toJsonSchema = (schema: z.ZodTypeAny): JsonSchema =>
  zodToJsonSchema(schema, { $refStrategy: "root" }) as JsonSchema;

const CodeReviewJSONSchema = toJsonSchema(CodeReviewResultSchema);

const reviewPrompt = (filePath: string) => `
  - You are a JavaScript code reviewer. Your task is to analyze the JavaScript file located at: ${filePath}.
  - You can use the js-code-review skill to help you identify issues in the code.
    - Analyze the code for:
        - Bugs
        - Security vulnerabilities
        - Code quality
        - Performance issues
        - Style and best practices
        and create relevant issues for each category if found.
  - Return a code review analysis report that contains the following: 
      - The file name
      - A summary of the review
        - A list of issues found, each with:
            - Line number
            - Severity (error, warning, info)
            - Category (quality, bug, security, performance, style)
            - A short description of the issue
            - A suggested fix or improvement
      - An overall quality score from 0-100 where 0 is the worst and 100 is the best
      - A list of recommendations for improving the code
`;

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

    if (
        message.type === "result" &&
        message.subtype === "success" &&
        message.structured_output
    ) {

      const parsed = CodeReviewResultSchema.safeParse(message.structured_output);

      if (parsed.success) {
        return parsed.data;
      } else {
        console.error("Zod validation failed:", parsed.error.errors);
        throw new Error(`Schema validation failed: ${parsed.error.message}`);
      }
    }

  }

  throw new Error("TODO: Implement reviewJavaScriptFile()");
}
