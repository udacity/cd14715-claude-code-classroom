/**
 * Research Orchestrator - Deliverable
 *
 * Coordinates multiple specialized agents to produce comprehensive research.
 */

import "dotenv/config";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { researcherPrompt, researcherConfig } from "./agents/researcher.js";
import { analyzerPrompt, analyzerConfig } from "./agents/analyzer.js";
import { summarizerPrompt, summarizerConfig } from "./agents/summarizer.js";

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export interface ResearchResult {
  topic: string;
  research: string;
  analysis: string;
  summary: string;
  finalReport: string;
}

// -----------------------------------------------------------------------------
// Orchestrator Prompt
// -----------------------------------------------------------------------------

const orchestratorPrompt = `You are a research orchestrator coordinating specialized agents.

When given a research topic, you will coordinate three agents in sequence:

1. RESEARCH PHASE
   First, gather information about the topic.
   Conduct thorough research using web search capabilities.
   Focus on finding credible sources, key facts, and data points.

2. ANALYSIS PHASE
   Then, analyze the research findings.
   Identify patterns, trends, and insights.
   Note any gaps or contradictions.

3. SUMMARIZATION PHASE
   Finally, create a concise summary.
   Distill findings into key points.
   Provide actionable recommendations.

4. FINAL REPORT
   Combine all outputs into a comprehensive report with:
   - Executive Summary (from summarizer)
   - Key Research Findings (from researcher)
   - Analysis and Insights (from analyzer)
   - Recommendations

Execute sequentially since each phase depends on the previous results.`;

// -----------------------------------------------------------------------------
// Main Function
// -----------------------------------------------------------------------------

export async function conductResearch(topic: string): Promise<ResearchResult> {
  const fullPrompt = `${orchestratorPrompt}

Research Topic: "${topic}"

Begin by researching this topic, then analyze the findings, and finally summarize everything into a comprehensive report.`;

  let research = "";
  let analysis = "";
  let summary = "";
  let finalReport = "";

  for await (const message of query({
    prompt: fullPrompt,
    options: {
      allowedTools: ["WebSearch"],
      maxTurns: 10,
    },
  })) {
    if (message.type === "result" && message.subtype === "success") {
      finalReport = message.result;

      // Extract sections from the report
      const researchMatch = finalReport.match(/## Research Findings([\s\S]*?)(?=## Analysis|## Key Points|$)/i);
      const analysisMatch = finalReport.match(/## Analysis([\s\S]*?)(?=## Summary|## Executive|$)/i);
      const summaryMatch = finalReport.match(/## (Executive )?Summary([\s\S]*?)(?=## Recommendations|$)/i);

      research = researchMatch ? researchMatch[1].trim() : "Research conducted inline";
      analysis = analysisMatch ? analysisMatch[1].trim() : "Analysis conducted inline";
      summary = summaryMatch ? (summaryMatch[2] || summaryMatch[0]).trim() : "Summary conducted inline";
    }
  }

  return {
    topic,
    research,
    analysis,
    summary,
    finalReport,
  };
}

// Export agent configs for reference
export { researcherConfig, analyzerConfig, summarizerConfig };
