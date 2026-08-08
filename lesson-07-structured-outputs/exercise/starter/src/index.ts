/**
 * Exercise: Structured Outputs - Meeting Notes Analyzer
 *
 * Tests for the meeting analyzer using Zod schemas.
 */

import "dotenv/config";
import {
    analyzeMeeting,
} from "./meeting-analyzer.js";
import {sampleTranscripts} from "./sample-transcripts.js";

// -----------------------------------------------------------------------------
// Test case: Analyze a formal meeting
// -----------------------------------------------------------------------------

async function analyzeFormalMeeting(meetingName: string) {
    const meeting = sampleTranscripts.find(m => m.name === meetingName);
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
    result.decisions.forEach((decision, i) => {
        console.log(`    ${i + 1}. Decision: ${decision.decision} 
       Reason: ${decision.rationale}
       Impact: ${decision.impact}`);
    });
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

    console.log("Analyzing Sprint Planning Meeting");
    console.log("=".repeat(60));
    await analyzeFormalMeeting("Sprint Planning Meeting");

    console.log("=".repeat(60));

    console.log("Analyzing Product Review Discussion");
    console.log("=".repeat(60));
    await analyzeFormalMeeting("Product Review Discussion");

    console.log("=".repeat(60));

    console.log("Quick Sync (Minimal Details)");
    console.log("=".repeat(60));
    await analyzeFormalMeeting("Quick Sync (Minimal Details)");
}

main().catch(console.error);
