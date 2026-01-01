/**
 * Document Summarizer Agent
 *
 * Deliverable: summarizeDocument() function using Claude Agent SDK
 * to read files and produce structured summaries.
 */

import { query } from "@anthropic-ai/claude-agent-sdk";

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export interface DocumentSummary {
  keyPoints: string[];
  summary: string;
  raw: string;
}

// -----------------------------------------------------------------------------
// Prompt Function
// -----------------------------------------------------------------------------

const documentSummarizerPrompt = (filePath: string) => `You are a document summarization expert.

When given a document path:
1. Read the document using the Read tool
2. Analyze the content thoroughly
3. Extract 3-5 key points
4. Write a concise 2-3 sentence summary

Format your response as:

## Key Points
- Point 1
- Point 2
- Point 3

## Summary
[Your concise summary here]

Be specific and extract actionable insights.

The document path is: ${filePath}`;

// -----------------------------------------------------------------------------
// Exported Function: summarizeDocument()
// -----------------------------------------------------------------------------

export async function summarizeDocument(filePath: string): Promise<DocumentSummary> {
  const result = query({
    prompt: documentSummarizerPrompt(filePath),
    options: { allowedTools: ["Read"] },
  });

  let rawResult = "";

  for await (const message of result) {
    if (message.type === "result" && message.subtype === "success") {
      rawResult = message.result;
      break;
    }
  }

  // Parse the response into structured format
  const keyPointsMatch = rawResult.match(/## Key Points\n([\s\S]*?)(?=## Summary|$)/);
  const summaryMatch = rawResult.match(/## Summary\n([\s\S]*?)$/);

  const keyPoints = keyPointsMatch
    ? keyPointsMatch[1]
        .split("\n")
        .filter((line) => line.trim().startsWith("-"))
        .map((line) => line.replace(/^-\s*/, "").trim())
    : [];

  const summary = summaryMatch ? summaryMatch[1].trim() : "";

  return {
    keyPoints,
    summary,
    raw: rawResult,
  };
}
