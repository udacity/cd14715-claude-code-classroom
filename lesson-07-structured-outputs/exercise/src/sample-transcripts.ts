/**
 * Sample Meeting Transcripts for Testing
 */

export interface TestTranscript {
  name: string;
  transcript: string;
  expectedActionItems: number;
  expectedDecisions: number;
}

export const sampleTranscripts: TestTranscript[] = [
  {
    name: "Sprint Planning Meeting",
    transcript: `Sprint Planning Meeting - January 15, 2025

Attendees: Alice Chen, Bob Smith, Charlie Davis, Diana Lopez

Alice: Good morning everyone. Let's plan our Q1 sprint. We need to prioritize the API refactoring.

Bob: I can take the authentication module. Should have it done by January 22nd.

Charlie: I'll handle the database migration. It's high priority - targeting January 25th.

Diana: What about the frontend updates?

Alice: Good point. Diana, can you own the dashboard redesign? Let's aim for January 30th.

Diana: Sure, I'll take that on.

Alice: We also need to decide on the testing framework. I propose we go with Vitest since the team already knows it.

Bob: Agreed. It integrates well with our current stack.

Charlie: Makes sense. Let's go with Vitest.

Alice: Great, that's decided. We'll use Vitest for all new tests because of team familiarity and good TypeScript support.

Diana: Should we schedule a mid-sprint check-in?

Alice: Yes, let's meet again on January 22nd to review progress.

Alice: To summarize - Bob has auth module, Charlie has database migration, Diana has dashboard. Next meeting January 22nd.`,
    expectedActionItems: 3,
    expectedDecisions: 1,
  },
  {
    name: "Product Review Discussion",
    transcript: `Product Review - January 20, 2025

Participants: Sarah Martinez, Tom Wilson, Uma Patel

Sarah: Let's discuss the beta feedback. Users love the new features but performance is a concern.

Tom: I reviewed the metrics. We should optimize the image loading. I'll create a performance improvement plan by next Monday.

Uma: The mobile experience needs work too. I'll coordinate with the design team to fix the responsive issues by January 27th.

Sarah: Good. We need to decide whether to delay the launch or ship with known issues.

Tom: Given the performance concerns, I think we should delay by two weeks.

Uma: I agree. Quality is important for first impressions.

Sarah: Alright, we're delaying the launch by two weeks. The new launch date will be February 15th instead of February 1st. This gives us time to address critical issues without rushing.

Tom: I'll also update the stakeholders on the timeline change. Can do that by Wednesday.

Sarah: Perfect. Let's reconnect on January 25th to check progress.`,
    expectedActionItems: 3,
    expectedDecisions: 1,
  },
  {
    name: "Quick Sync (Minimal Details)",
    transcript: `Team Sync - January 18, 2025

Present: Mike, Jen

Mike: Quick update - the deployment went smoothly.

Jen: Great. Any blockers?

Mike: None. Everything is on track.

Jen: Perfect. Let's touch base next week if needed.`,
    expectedActionItems: 0,
    expectedDecisions: 0,
  },
];
