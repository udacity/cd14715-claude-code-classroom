/**
 * Exercise: Structured Outputs - Meeting Notes Analyzer
 *
 * Tests for the meeting analyzer using Zod schemas.
 */

import "dotenv/config";
import {
  analyzeMeeting,
  MeetingAnalysisSchema,
  MeetingAnalysisJSONSchema,
  MeetingAnalysis,
  ActionItem,
  Decision,
} from "./meeting-analyzer.js";
import { sampleTranscripts } from "./sample-transcripts.js";

// -----------------------------------------------------------------------------
// Step 1: Show the schema structure
// -----------------------------------------------------------------------------

function step1_showSchema() {
  console.log("\n--- STEP 1: Show Schema Structure ---\n");

  console.log("MeetingAnalysis Schema:");
  console.log("  - date: ISO date string");
  console.log("  - participants: string[]");
  console.log("  - topic: string");
  console.log("  - actionItems: ActionItem[]");
  console.log("    - task: string");
  console.log("    - assignee: string");
  console.log("    - dueDate: ISO date string");
  console.log("    - priority: 'low' | 'medium' | 'high'");
  console.log("  - decisions: Decision[]");
  console.log("    - decision: string");
  console.log("    - rationale: string");
  console.log("    - impact: 'low' | 'medium' | 'high'");
  console.log("  - nextMeetingDate: ISO date string (optional)");
  console.log("  - summary: string (max 500 chars)");

  console.log("\n-> Complex nested schema with arrays of objects");
}

// -----------------------------------------------------------------------------
// Step 2: Analyze a formal meeting
// -----------------------------------------------------------------------------

async function step2_analyzeFormalMeeting() {
  console.log("\n--- STEP 2: Analyze Formal Meeting ---\n");

  const meeting = sampleTranscripts[0];
  console.log(`Analyzing: ${meeting.name}\n`);

  const result = await analyzeMeeting(meeting.transcript);

  console.log("Extracted Data:");
  console.log(`  Date: ${result.date}`);
  console.log(`  Topic: ${result.topic}`);
  console.log(`  Participants: ${result.participants.join(", ")}`);

  console.log(`\n  Action Items (${result.actionItems.length}):`);
  result.actionItems.forEach((item, i) => {
    console.log(`    ${i + 1}. ${item.task}`);
    console.log(`       Assignee: ${item.assignee}, Due: ${item.dueDate}, Priority: ${item.priority}`);
  });

  console.log(`\n  Decisions (${result.decisions.length}):`);
  result.decisions.forEach((dec, i) => {
    console.log(`    ${i + 1}. ${dec.decision}`);
    console.log(`       Rationale: ${dec.rationale}`);
    console.log(`       Impact: ${dec.impact}`);
  });

  if (result.nextMeetingDate) {
    console.log(`\n  Next Meeting: ${result.nextMeetingDate}`);
  }

  console.log(`\n  Summary: ${result.summary}`);
  console.log("\n-> All fields extracted with consistent structure!");
}

// -----------------------------------------------------------------------------
// Step 3: Analyze multiple meetings
// -----------------------------------------------------------------------------

async function step3_analyzeMultiple() {
  console.log("\n--- STEP 3: Analyze Multiple Meetings ---\n");

  for (const meeting of sampleTranscripts) {
    console.log(`${meeting.name}:`);

    const result = await analyzeMeeting(meeting.transcript);

    console.log(`  Participants: ${result.participants.length}`);
    console.log(`  Action Items: ${result.actionItems.length} (expected: ${meeting.expectedActionItems})`);
    console.log(`  Decisions: ${result.decisions.length} (expected: ${meeting.expectedDecisions})`);
    console.log(`  Has Next Meeting: ${result.nextMeetingDate ? "Yes" : "No"}\n`);
  }

  console.log("-> Schema handles various meeting formats!");
}

// -----------------------------------------------------------------------------
// Step 4: Demonstrate validation
// -----------------------------------------------------------------------------

function step4_validation() {
  console.log("\n--- STEP 4: Schema Validation ---\n");

  // Valid action item
  const validAction: ActionItem = {
    task: "Review PR #123",
    assignee: "Alice",
    dueDate: "2025-01-25",
    priority: "high",
  };

  // Invalid action item (missing fields)
  const invalidAction = {
    task: "Do something",
    // Missing assignee, dueDate, priority
  };

  console.log("Validating action items:");
  const validResult = MeetingAnalysisSchema.shape.actionItems.element.safeParse(validAction);
  console.log(`  Valid item parses: ${validResult.success}`);

  const invalidResult = MeetingAnalysisSchema.shape.actionItems.element.safeParse(invalidAction);
  console.log(`  Invalid item parses: ${invalidResult.success}`);

  if (!invalidResult.success) {
    console.log("\n  Missing required fields:");
    invalidResult.error.errors.forEach((err) => {
      console.log(`    - ${err.path.join(".")}: ${err.message}`);
    });
  }

  console.log("\n-> Zod validates nested objects and arrays!");
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  EXERCISE: Structured Outputs - Meeting Notes Analyzer");
  console.log("  Extract action items, decisions, and participants");
  console.log("=".repeat(60));

  step1_showSchema();
  await step2_analyzeFormalMeeting();
  await step3_analyzeMultiple();
  step4_validation();

  console.log("\n" + "=".repeat(60));
  console.log("  KEY TAKEAWAYS");
  console.log("=".repeat(60));
  console.log(`
  DELIVERABLE: meeting-analyzer.ts
  - Exports: MeetingAnalysisSchema, ActionItemSchema, DecisionSchema
  - Exports: analyzeMeeting() function
  - Exports: Type definitions (MeetingAnalysis, ActionItem, Decision)

  SCHEMA FEATURES USED:
  - Nested objects (ActionItem, Decision)
  - Arrays of objects
  - Optional fields (nextMeetingDate)
  - String constraints (max length)
  - Enum validation (priority, impact)

  USE CASES:
  - Meeting summaries for project management tools
  - Action item extraction for task trackers
  - Decision logging for compliance/audit
`);
}

main().catch(console.error);
