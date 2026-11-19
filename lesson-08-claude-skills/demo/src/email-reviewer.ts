/**
 * Email Etiquette Reviewer Agent
 *
 * Deliverable: reviewEmail() function using Claude Agent SDK
 * with multiple skills loaded from .claude/skills/
 *
 * Demonstrates:
 * - Multiple skills (email-etiquette, communication-style)
 * - Skill discovery by Claude based on descriptions
 * - Combining Skills (L08) with Structured Outputs (L07)
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

const EmailIssueSchema = z.object({
  category: z
    .enum(["tone", "structure", "clarity", "grammar", "professionalism"])
    .describe("Category of the issue"),
  severity: z
    .enum(["high", "medium", "low"])
    .describe("Severity level of the issue"),
  description: z.string().describe("Description of the issue"),
  suggestion: z.string().describe("Suggested improvement"),
});

const EmailReviewResultSchema = z.object({
  overallTone: z
    .enum(["too-casual", "too-formal", "appropriate", "mixed"])
    .describe("Overall tone assessment"),
  communicationStyle: z
    .enum(["assertive", "passive", "aggressive", "passive-aggressive"])
    .describe("Communication style (assertive, passive, aggressive, passive-aggressive)"),
  score: z
    .number()
    .describe("Email quality score from 0-100"),
  issues: z.array(EmailIssueSchema).describe("List of issues found"),
  strengths: z.array(z.string()).describe("Positive aspects of the email"),
  revisedEmail: z
    .string()
    .optional()
    .describe("Suggested revised version of the email"),
});

export type EmailIssue = z.infer<typeof EmailIssueSchema>;
export type EmailReviewResult = z.infer<typeof EmailReviewResultSchema>;

// Helper to convert Zod schema to JSON Schema with proper $ref handling
type JsonSchema = Record<string, unknown>;
const toJsonSchema = (schema: z.ZodTypeAny): JsonSchema =>
  zodToJsonSchema(schema, { $refStrategy: "root" }) as JsonSchema;

// Convert to JSON Schema for API use
// Use $refStrategy: 'root' to properly inline all $ref definitions
const EmailReviewJSONSchema = toJsonSchema(EmailReviewResultSchema);

// -----------------------------------------------------------------------------
// Prompt Function
// -----------------------------------------------------------------------------

const reviewPrompt = (emailContent: string) => `You are an email communication analyst.

Use the available skills to analyze this email:

"""
${emailContent}
"""

Apply the skills' criteria to assess:
- Tone (too-casual, too-formal, appropriate, or mixed) - use email-etiquette skill
- Communication style (assertive, passive, aggressive, passive-aggressive) - use communication-style skill
- Structure issues
- Clarity problems
- Grammar/spelling errors
- Professionalism

Return the analysis with:
- overallTone: assessment of the email's tone
- communicationStyle: the primary communication style detected
- score: quality score 0-100
- issues: array of specific issues with category, severity, description, suggestion
- strengths: positive aspects of the email
- revisedEmail: optionally provide an improved version if score is below 80`;

// -----------------------------------------------------------------------------
// Exported Function: reviewEmail()
// -----------------------------------------------------------------------------

export async function reviewEmail(
  emailContent: string
): Promise<EmailReviewResult> {
  for await (const message of query({
    prompt: reviewPrompt(emailContent),
    options: {
      cwd: PROJECT_ROOT,
      settingSources: ["project"],
      model,
      allowedTools: ["Skill", "Read", "Grep", "Glob"],
      // Enforce structured output matching our schema
      outputFormat: {
        type: "json_schema",
        schema: EmailReviewJSONSchema,
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
      const parsed = EmailReviewResultSchema.safeParse(message.structured_output);

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
