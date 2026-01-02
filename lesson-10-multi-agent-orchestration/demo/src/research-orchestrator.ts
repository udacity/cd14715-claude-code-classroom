/**
 * Research Orchestrator - Deliverable
 *
 * Uses subagents pattern to coordinate specialized agents for research.
 */

import "dotenv/config";
import { query } from "@anthropic-ai/claude-agent-sdk";

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export interface ResearchResult {
  topic: string;
  finalReport: string;
}

// -----------------------------------------------------------------------------
// Subagent Definitions
// -----------------------------------------------------------------------------

const subagents = {
  researcher: {
    description: "Research specialist that gathers information from web sources",
    prompt: `You are a research specialist.

When asked to research a topic:
1. Use WebSearch to find authoritative sources
2. Gather diverse perspectives and data points
3. Return findings in a structured format

Focus on credible, recent sources. Be thorough but concise.`,
    tools: ["WebSearch"],
    model: "sonnet",
  },

  analyzer: {
    description: "Analysis specialist that finds patterns and insights in data",
    prompt: `You are a data analysis specialist.

When given research findings:
1. Identify key patterns and trends
2. Find connections between data points
3. Highlight important insights
4. Note any gaps or contradictions

Provide analytical depth, not just summaries.`,
    tools: [],
    model: "sonnet",
  },

  summarizer: {
    description: "Summarization specialist that creates clear, concise reports",
    prompt: `You are a summarization specialist.

When given research and analysis:
1. Distill into key points
2. Create an executive summary
3. Highlight actionable recommendations

Be concise but comprehensive.`,
    tools: [],
    model: "haiku",
  },
};

// -----------------------------------------------------------------------------
// Main Function
// -----------------------------------------------------------------------------

export async function conductResearch(topic: string): Promise<ResearchResult> {
  const orchestratorPrompt = `You are a research orchestrator coordinating specialized subagents.

You have access to three subagents via the Task tool:
- researcher: Gathers information using web search
- analyzer: Finds patterns and insights in data
- summarizer: Creates concise summaries and recommendations

For the topic "${topic}", coordinate these agents in sequence:

1. RESEARCH PHASE: Use the researcher subagent to gather information
2. ANALYSIS PHASE: Use the analyzer subagent to find patterns in the research
3. SUMMARY PHASE: Use the summarizer subagent to create a final report

After all phases complete, combine the outputs into a final comprehensive report with:
- Executive Summary
- Key Research Findings
- Analysis and Insights
- Recommendations

Begin now.`;

  let finalReport = "";

  for await (const message of query({
    prompt: orchestratorPrompt,
    options: {
      allowedTools: ["Task"],
      agents: subagents,
      maxTurns: 15,
    },
  })) {
    if (message.type === "assistant") {
      const content = message.message?.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block.type === "tool_use" && block.name === "Task") {
            const input = block.input as { description?: string };
            console.log(`[Orchestrator]: Invoking subagent - ${input.description || "task"}`);
          }
        }
      }
    } else if (message.type === "result" && message.subtype === "success") {
      finalReport = message.result;
    } else if (message.type === "result") {
      throw new Error(`Research failed: ${message.subtype}`);
    }
  }

  return {
    topic,
    finalReport,
  };
}
