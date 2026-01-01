/**
 * Meeting Notes Analyzer - Deliverable
 *
 * Uses Zod schemas and structured outputs to extract action items,
 * decisions, and participants from meeting transcripts.
 */

import "dotenv/config";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { query } from "@anthropic-ai/claude-agent-sdk";

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export const ActionItemSchema = z.object({
  task: z.string().describe("The task to be completed"),
  assignee: z.string().describe("Person responsible for the task"),
  dueDate: z.string().describe("Due date in ISO format (YYYY-MM-DD)"),
  priority: z
    .enum(["low", "medium", "high"])
    .describe("Priority level of the task"),
});

export const DecisionSchema = z.object({
  decision: z.string().describe("The decision that was made"),
  rationale: z.string().describe("Reasoning behind the decision"),
  impact: z
    .enum(["low", "medium", "high"])
    .describe("Impact level of the decision"),
});

export const MeetingAnalysisSchema = z.object({
  date: z.string().describe("Meeting date in ISO format (YYYY-MM-DD)"),
  participants: z.array(z.string()).describe("List of meeting participants"),
  topic: z.string().describe("Main topic or title of the meeting"),
  actionItems: z.array(ActionItemSchema).describe("Action items from meeting"),
  decisions: z.array(DecisionSchema).describe("Decisions made during meeting"),
  nextMeetingDate: z
    .string()
    .optional()
    .describe("Next meeting date if mentioned (ISO format)"),
  summary: z
    .string()
    .max(500)
    .describe("Brief summary of the meeting (max 500 chars)"),
});

export type ActionItem = z.infer<typeof ActionItemSchema>;
export type Decision = z.infer<typeof DecisionSchema>;
export type MeetingAnalysis = z.infer<typeof MeetingAnalysisSchema>;

// Convert to JSON Schema for API use
export const MeetingAnalysisJSONSchema = zodToJsonSchema(MeetingAnalysisSchema, {
  $refStrategy: "root",
});

// -----------------------------------------------------------------------------
// Main Function
// -----------------------------------------------------------------------------

export async function analyzeMeeting(transcript: string): Promise<MeetingAnalysis> {
  const prompt = `Analyze the following meeting transcript and extract structured information.

Meeting Transcript:
${transcript}

Extract:
- date: The meeting date (use ISO format YYYY-MM-DD, infer from context if not explicit)
- participants: List all people who spoke or were mentioned as attending
- topic: The main topic or purpose of the meeting
- actionItems: Each action item with task, assignee, dueDate (ISO format), and priority
- decisions: Each decision made with the decision text, rationale, and impact level
- nextMeetingDate: If a follow-up meeting was scheduled (ISO format, or omit if not mentioned)
- summary: A brief summary of what was discussed and accomplished

Be thorough in extracting action items - look for tasks assigned with phrases like "will do", "take care of", "responsible for", etc.
For dates, convert relative dates (like "next Friday") to ISO format based on the meeting date.`;

  for await (const message of query({
    prompt,
    options: {
      outputFormat: {
        type: "json_schema",
        schema: MeetingAnalysisJSONSchema,
      },
    },
  })) {
    if (message.type === "result" && message.structured_output) {
      // Validate with Zod for type safety
      return MeetingAnalysisSchema.parse(message.structured_output);
    }
  }

  throw new Error("Failed to get structured output from agent");
}
