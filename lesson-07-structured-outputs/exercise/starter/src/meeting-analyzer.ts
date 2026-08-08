/**
 * Meeting Notes Analyzer - Deliverable
 *
 * Uses Zod schemas and structured outputs to extract action items,
 * decisions, and participants from meeting transcripts.
 */

import "dotenv/config";
import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";
import {query} from "@anthropic-ai/claude-agent-sdk";

const model = process.env.ANTHROPIC_MODEL;
if (!model) {
    throw new Error("ANTHROPIC_MODEL is not set");
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export const ActionItemSchema = z.object({
    task: z.string(),
    assignee: z.string().describe("Name of the person"),
    dueDate: z.string().describe("Deadline of finishing the task in DD-MM-YYYY format"),
    priority: z.enum(["low", "medium", "high"]).describe("Priority of the task"),
});

export const DecisionSchema = z.object({
    decision: z.string().describe("The decision that has been made"),
    rationale: z.string().describe("Justification or reasoning behind the decision"),
    impact: z.enum(["low", "medium", "high"]).describe("Impact of the decision"),
});

export const MeetingAnalysisSchema = z.object({
    date: z.string().describe("Meeting date in DD-MM-YYYY format"),
    participants: z.array(z.string()).describe("List of names of each participant"),
    topic: z.string().describe("Subject or title of the meeting"),
    actionItems: z.array(ActionItemSchema).describe("List of actions to be taken after the meeting"),
    decisions: z.array(DecisionSchema).describe("List of decisions that has been made after the meeting"),
    nextMeetingDate: z.string().optional().describe("The date of the next meeting in DD-MM-YYYY format"),
    summary: z.string().describe("Summary of the meeting (max 500 characters)").max(500),
});

export type ActionItem = z.infer<typeof ActionItemSchema>;
export type Decision = z.infer<typeof DecisionSchema>;
export type MeetingAnalysis = z.infer<typeof MeetingAnalysisSchema>;


export const ActionItemJSONSchema = zodToJsonSchema(ActionItemSchema, {
    $refStrategy: "root",
});
export const DecisionJSONSchema = zodToJsonSchema(DecisionSchema, {
    $refStrategy: "root",
});
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
            model,
            outputFormat: {
                type: "json_schema",
                schema: MeetingAnalysisJSONSchema,
            },
        },
    })) {
        if (message.type === "result" && message.subtype === "success") {
            if (message.structured_output) {
                return MeetingAnalysisSchema.parse(message.structured_output);
            }
        }
    }

    throw new Error("Failed to get structured output from agent");
}
