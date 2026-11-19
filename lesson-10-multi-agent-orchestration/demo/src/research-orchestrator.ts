/**
 * Research Orchestrator - Deliverable
 *
 * Uses subagents pattern to coordinate specialized agents for research.
 *
 * Features demonstrated:
 * - Async generator input mode (streaming pattern)
 * - Model selection with strings ('sonnet', 'haiku')
 * - Dynamic agent factory pattern
 * - Parallel subagent execution
 * - Sequential orchestration workflow
 */

import "dotenv/config";
import { query, AgentDefinition } from "@anthropic-ai/claude-agent-sdk";

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export interface ResearchResult {
  topic: string;
  finalReport: string;
}

// -----------------------------------------------------------------------------
// Async Generator Input Mode (Streaming Pattern)
// This is the recommended pattern for streaming compatibility
// -----------------------------------------------------------------------------

async function* generateMessages(userMessage: string) {
  yield {
    type: "user" as const,
    message: { role: "user" as const, content: userMessage },
    parent_tool_use_id: null,
    session_id: "research-orchestrator-session",
  };
}

// -----------------------------------------------------------------------------
// Dynamic Agent Factory Pattern
// Creates agents with runtime customization based on task complexity
// -----------------------------------------------------------------------------

type ModelType = "sonnet" | "haiku" | "opus";

interface AgentFactoryOptions {
  useWebSearch?: boolean;
  modelOverride?: ModelType;
}

function createResearchAgent(options: AgentFactoryOptions = {}): AgentDefinition {
  return {
    description: "Research specialist that gathers information from web sources",
    prompt: `You are a research specialist.

            When asked to research a topic:
            1. Use WebSearch to find authoritative sources
            2. Gather diverse perspectives and data points
            3. Return findings in a structured format

            IMPORTANT: Use no more than 5 web searches total. Be strategic with your queries.
            Focus on credible, recent sources. Be thorough but concise.`,
    // Use model strings: 'sonnet', 'haiku', or 'opus'
    model: options.modelOverride || "haiku",
    tools: ['WebSearch'],
  };
}

function createAnalyzerAgent(modelOverride?: ModelType): AgentDefinition {
  return {
    description: "Analysis specialist that finds patterns and insights in data",
    prompt: `You are a data analysis specialist.

            When given research findings:
            1. Identify key patterns and trends
            2. Find connections between data points
            3. Highlight important insights
            4. Note any gaps or contradictions

    Provide analytical depth, not just summaries.`,
    tools: [],
    // Use haiku for simpler analysis tasks to reduce costs
    model: modelOverride || "haiku",
  };
}

function createSummarizerAgent(modelOverride?: ModelType): AgentDefinition {
  return {
    description: "Summarization specialist that creates clear, concise reports",
    prompt: `You are a summarization specialist.

              When given research and analysis:
              1. Distill into key points
              2. Create an executive summary
              3. Highlight actionable recommendations

              Be concise but comprehensive.`,
    tools: [],
    model: modelOverride || "haiku",
  };
}

// -----------------------------------------------------------------------------
// Static Subagent Definitions (using factory pattern)
// -----------------------------------------------------------------------------

const subagents: Record<string, AgentDefinition> = {
  researcher: createResearchAgent(),
  analyzer: createAnalyzerAgent(),
  summarizer: createSummarizerAgent(),
};

// -----------------------------------------------------------------------------
// Main Function: Sequential Orchestration
// -----------------------------------------------------------------------------

export async function conductResearch(topic: string): Promise<ResearchResult> {
  const orchestratorPrompt = `You are a research orchestrator coordinating specialized subagents.

                      You have access to three subagents via the Task tool:
                      - researcher: Gathers information using web search
                      - analyzer: Finds patterns and insights in data
                      - summarizer: Creates concise summaries and recommendations

                      Do not perform web search yourself, always delegate to the researcher subagent for that.

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
  const startTime = Date.now();
  const elapsed = () => `Time elapsed so far: ${((Date.now() - startTime) / 1000).toFixed(1)
    } s`;

  for await (const message of query({
    prompt: generateMessages(orchestratorPrompt),
    options: {
      allowedTools: ["Task"],
      agents: subagents,
      model: process.env.ANTHROPIC_MODEL,
      maxTurns: 10,
    },
  })) {
    // as any here is explicit, the SDK typing system does not yet know about parent_tool_use_id

    if (message.type === "assistant") {
      const content = message.message?.content;
      if ((message as any).parent_tool_use_id) {
        console.log(`  [${elapsed()}](running inside subagent)`, content);
      }

      if (Array.isArray(content)) {
        for (const block of content) {
          if (block.type === "tool_use" && block.name === "Task") {
            const input = block.input as { description?: string };
            console.log(`[${elapsed()}] Invoking subagent - ${input.description || "task"} `, block);
          }
        }
      }
    } else if (message.type === "result" && message.subtype === "success") {
      console.log(`[${elapsed()}]DONE`);
      finalReport = message.result;
    } else if (message.type === "result") {
      throw new Error(`Research failed: ${message.subtype} `);
    }
  }

  return {
    topic,
    finalReport,
  };
}

// -----------------------------------------------------------------------------
// Parallel Research Function
// Demonstrates running multiple subagents in parallel
// -----------------------------------------------------------------------------

export async function conductParallelResearch(
  topics: string[]
): Promise<ResearchResult[]> {
  const parallelPrompt = `You are a research orchestrator coordinating specialized subagents.

You have access to three subagents via the Task tool:
- researcher: Gathers information using web search
- analyzer: Finds patterns and insights in data
  - summarizer: Creates concise summaries and recommendations

IMPORTANT: You should invoke multiple subagents IN PARALLEL when possible.
The Task tool supports parallel invocation - call multiple tasks in the same response.

Research the following topics IN PARALLEL:
${topics.map((t, i) => `${i + 1}. ${t}`).join("\n")}

For EACH topic, use the researcher subagent to gather information.
Launch all research tasks simultaneously for efficiency.

After all research completes, provide a combined summary of findings.`;

  const results: ResearchResult[] = [];

  for await (const message of query({
    prompt: generateMessages(parallelPrompt),
    options: {
      allowedTools: ["Task"],
      agents: subagents,
      model: process.env.ANTHROPIC_MODEL,
      maxTurns: 20,
    },
  })) {
    if (message.type === "assistant") {
      const content = message.message?.content;
      if (Array.isArray(content)) {
        // Count parallel task invocations
        const taskBlocks = content.filter(
          (block) => block.type === "tool_use" && block.name === "Task"
        );
        if (taskBlocks.length > 1) {
          console.log(`[Orchestrator]: Launching ${taskBlocks.length} subagents in PARALLEL`);
        }
      }
    } else if (message.type === "result" && message.subtype === "success") {
      // Parse results for each topic
      topics.forEach((topic) => {
        results.push({
          topic,
          finalReport: message.result,
        });
      });
    } else if (message.type === "result") {
      throw new Error(`Parallel research failed: ${message.subtype} `);
    }
  }

  return results;
}
