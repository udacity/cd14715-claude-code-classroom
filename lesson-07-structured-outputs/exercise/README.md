# Meeting Notes Analyzer

Build a system that extracts structured data from meeting transcripts.

## Overview

Create a system that analyzes meeting transcripts and returns structured data including action items with assignees and due dates, decisions with rationale, participant list, and summary.

## Scenario

Your team records meetings but struggles to extract actionable information. You need a system that automatically identifies who's responsible for what, when tasks are due, and what decisions were made. The output must be structured so it can feed directly into your project management system.

## What You'll Build

A system that extracts:
- Action items with assignees and due dates
- Decisions with rationale and impact
- Participant list
- Meeting summary
- Next meeting date (if mentioned)

## Prerequisites

- Node.js 18+
- Anthropic API Key
- Completed the demo (Product Review Analyzer)

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```bash
ANTHROPIC_API_KEY=your-api-key-here
```

## Tasks

### 1. Define the ActionItem Schema

```typescript
const ActionItemSchema = z.object({
  task: z.string(),
  assignee: z.string(),
  dueDate: z.string(),  // ISO format
  priority: z.enum(['low', 'medium', 'high'])
});
```

### 2. Define the Decision Schema

```typescript
const DecisionSchema = z.object({
  decision: z.string(),
  rationale: z.string(),
  impact: z.enum(['low', 'medium', 'high'])
});
```

### 3. Define the Complete MeetingAnalysis Schema

Create a schema with:
- `date`: ISO date string
- `participants`: array of strings (names)
- `topic`: string (meeting topic)
- `actionItems`: array of ActionItem
- `decisions`: array of Decision
- `nextMeetingDate`: optional ISO date string
- `summary`: string, max 500 characters

### 4. Convert to JSON Schema

```typescript
const MeetingAnalysisJSONSchema = zodToJsonSchema(
  MeetingAnalysisSchema,
  'MeetingAnalysisSchema'
);
```

### 5. Implement `analyzeMeeting()` Function

```typescript
export async function analyzeMeeting(transcript: string): Promise<MeetingAnalysis> {
  // Call query() with structured output format
  // Parse response with Zod schema
  // Return validated MeetingAnalysis object
}
```

## Running the Exercise

```bash
npm start
```

## Project Structure

```
exercise/
├── src/
│   └── meeting-analyzer.ts   # Your implementation
├── transcripts/              # Sample meeting transcripts
├── package.json
└── README.md
```

## Expected Output Format

```typescript
{
  date: "2024-01-15",
  participants: ["Alice", "Bob", "Charlie"],
  topic: "Q1 Planning",
  actionItems: [
    {
      task: "Create project timeline",
      assignee: "Alice",
      dueDate: "2024-01-20",
      priority: "high"
    }
  ],
  decisions: [
    {
      decision: "Use React for frontend",
      rationale: "Team expertise and ecosystem",
      impact: "high"
    }
  ],
  nextMeetingDate: "2024-01-22",
  summary: "Team discussed Q1 priorities and assigned initial tasks..."
}
```

## Test Scenarios

1. Formal meeting with clear action items
2. Casual discussion with implied tasks
3. Meeting with multiple decisions
4. Verify all fields are extracted correctly
5. Ensure dates are in ISO format

## Key Takeaway

Structured outputs transform unreliable text parsing into predictable data extraction. Well-defined schemas ensure your application receives consistent, validated data every time. Use Zod for both runtime validation and TypeScript type inference.

## Deliverable

Export `analyzeMeeting()` function and all schemas. Must correctly extract action items with assignees, decisions with rationale, and properly formatted dates. All tests must pass.
