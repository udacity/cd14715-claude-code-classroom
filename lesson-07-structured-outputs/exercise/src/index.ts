/**
 * Exercise: Structured Outputs - Meeting Notes Analyzer
 *
 * Tests for the meeting analyzer using Zod schemas.
 */

import "dotenv/config";
import {
  analyzeMeeting,
} from "./meeting-analyzer.js";
import { sampleTranscripts } from "./sample-transcripts.js";

// -----------------------------------------------------------------------------
// Test case: Analyze a formal meeting
// -----------------------------------------------------------------------------

async function analyzeFormalMeeting() {
  const meeting = sampleTranscripts.find(m => m.name === "Sprint Planning Meeting");
  if (!meeting) {
    throw new Error("No formal meeting found");
  }

  const result = await analyzeMeeting(meeting.transcript);

  console.log("Structured Output:");
  console.log(`  Date: ${result.date}`);
  console.log(`  Topic: ${result.topic}`);
  console.log(`  Participants: ${result.participants.join(", ")}`);
  console.log(`  Action Items: ${result.actionItems.length}`);
  result.actionItems.forEach((item, i) => {
    console.log(`    ${i + 1}. ${item.task} (${item.assignee}, ${item.priority})`);
  });
  console.log(`  Decisions: ${result.decisions.length}`);
  console.log(`  Summary: ${result.summary}`);
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  EXERCISE: Structured Outputs - Meeting Notes Analyzer");
  console.log("  Using Zod schemas for reliable data extraction");
  console.log("=".repeat(60));

  await analyzeFormalMeeting();
}

main().catch(console.error);
