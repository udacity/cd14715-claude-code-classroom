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

const model = process.env.ANTHROPIC_MODEL;
if (!model) {
  throw new Error("ANTHROPIC_MODEL is not set");
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

// TODO: Step 1 - Define ActionItemSchema using z.object()
//
// The schema should have these fields:
//   - task: z.string().describe("The task to be completed")
//   - assignee: z.string().describe("Person responsible for the task")
//   - dueDate: z.string().describe("Due date in ISO format (YYYY-MM-DD)")
//   - priority: z.enum(["low", "medium", "high"]).describe("Priority level of the task")
//
// IMPORTANT: Use .describe() on each field - these descriptions help the LLM
// understand what data to extract for each field.

export const ActionItemSchema = z.object({
  // TODO: Replace these placeholder fields with properly described fields
  task: z.string(),
  assignee: z.string(),
  dueDate: z.string(),
  priority: z.enum(["low", "medium", "high"]),
});

// TODO: Step 2 - Define DecisionSchema using z.object()
//
// The schema should have these fields:
//   - decision: z.string().describe("The decision that was made")
//   - rationale: z.string().describe("Reasoning behind the decision")
//   - impact: z.enum(["low", "medium", "high"]).describe("Impact level of the decision")

export const DecisionSchema = z.object({
  // TODO: Replace these placeholder fields with properly described fields
  decision: z.string(),
  rationale: z.string(),
  impact: z.enum(["low", "medium", "high"]),
});

// TODO: Step 3 - Define MeetingAnalysisSchema using z.object()
//
// The schema should have these fields:
//   - date: z.string().describe("Meeting date in ISO format (YYYY-MM-DD)")
//   - participants: z.array(z.string()).describe("List of meeting participants")
//   - topic: z.string().describe("Main topic or title of the meeting")
//   - actionItems: z.array(ActionItemSchema).describe("Action items from meeting")
//   - decisions: z.array(DecisionSchema).describe("Decisions made during meeting")
//   - nextMeetingDate: z.string().optional().describe("Next meeting date if mentioned (ISO format)")
//   - summary: z.string().max(500).describe("Brief summary of the meeting (max 500 chars)")
//
// Note: Use .optional() for fields that may not always be present
// Note: Use .max(500) to limit the summary length

export const MeetingAnalysisSchema = z.object({
  // TODO: Replace these placeholder fields with properly described fields
  date: z.string(),
  participants: z.array(z.string()),
  topic: z.string(),
  actionItems: z.array(ActionItemSchema),
  decisions: z.array(DecisionSchema),
  nextMeetingDate: z.string().optional(),
  summary: z.string(),
});

export type ActionItem = z.infer<typeof ActionItemSchema>;
export type Decision = z.infer<typeof DecisionSchema>;
export type MeetingAnalysis = z.infer<typeof MeetingAnalysisSchema>;

// TODO: Step 4 - Convert MeetingAnalysisSchema to JSON Schema
//
// Use zodToJsonSchema() to convert the Zod schema to JSON Schema format.
// This is required for the API's outputFormat parameter.
//
// Syntax: zodToJsonSchema(schema, { $refStrategy: "root" })
// The $refStrategy: "root" option flattens nested schemas into the root.

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

  // TODO: Step 5 - Call query() with structured output configuration

  for await (const message of query({
    prompt,
    options: {
      model,
      // TODO: Add the outputFormat configuration to enable structured outputs

    },
  })) {
    // TODO: Step 6 - Handle the structured output response
    //
    // Check for a successful result message:
    //   - message.type === "result"
    //   - message.subtype === "success"
    //   - message.structured_output exists (contains the parsed JSON)
    //
    // When found, validate with Zod and return:
    //   return MeetingAnalysisSchema.parse(message.structured_output);
    //
    // This validates the LLM output matches your schema and provides type safety.

    if (message.type === "result" && message.subtype === "success") {
      // TODO: Check for structured_output and parse with Zod schema
      // if (message.structured_output) {
      //   return MeetingAnalysisSchema.parse(message.structured_output);
      // }
    }
  }

  throw new Error("Failed to get structured output from agent");
}
