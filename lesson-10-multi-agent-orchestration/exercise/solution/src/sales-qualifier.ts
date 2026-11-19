/**
 * Sales Opportunity Qualifier - Deliverable
 *
 * Uses subagents pattern to coordinate specialized agents
 * for comprehensive sales qualification.
 *
 * Features demonstrated:
 * - Async generator input mode (streaming pattern)
 * - Model selection with strings ('sonnet', 'haiku')
 * - AgentDefinition configuration
 * - Structured output from multi-agent workflows
 */

import "dotenv/config";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { query, AgentDefinition } from "@anthropic-ai/claude-agent-sdk";

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export const SalesBriefingSchema = z.object({
  companyProfile: z.object({
    name: z.string(),
    industry: z.string(),
    employeeCount: z.number(),
    estimatedRevenue: z.string(),
    techStack: z.array(z.string()),
    recentNews: z.array(z.string()),
  }),
  competitiveAnalysis: z.object({
    currentSolution: z.string(),
    ourAdvantages: z.array(z.string()),
    theirConcerns: z.array(z.string()),
  }),
  qualification: z.object({
    budget: z.object({
      hasBudget: z.boolean(),
      estimatedBudget: z.number(),
    }),
    authority: z.object({
      contactIsDecisionMaker: z.boolean(),
      decisionMakers: z.array(z.string()),
    }),
    need: z.object({
      painPoints: z.array(z.string()),
      urgency: z.enum(["high", "medium", "low"]),
    }),
    timeline: z.string(),
    dealSize: z.number(),
    winProbability: z.number().min(0).max(100),
  }),
  recommendation: z.enum(["Pursue", "Nurture", "Disqualify"]),
  talkingPoints: z.array(z.string()),
});

export type SalesBriefing = z.infer<typeof SalesBriefingSchema>;

export const SalesBriefingJSONSchema = zodToJsonSchema(SalesBriefingSchema, {
  $refStrategy: "root",
});

// -----------------------------------------------------------------------------
// Async Generator Input Mode (Streaming Pattern)
// This is the recommended pattern for streaming compatibility
// -----------------------------------------------------------------------------

async function* generateMessages(userMessage: string) {
  yield {
    type: "user" as const,
    message: { role: "user" as const, content: userMessage },
    parent_tool_use_id: null,
    session_id: "sales-qualifier-session",
  };
}

// -----------------------------------------------------------------------------
// Subagent Definitions
// Use model strings: 'sonnet', 'haiku', or 'opus'
// -----------------------------------------------------------------------------

const subagents: Record<string, AgentDefinition> = {
  "company-researcher": {
    description: "Research specialist that gathers company intelligence",
    prompt: `You are a company research specialist.

When asked to research a company, gather:
1. Company size (employees, revenue)
2. Industry and market position
3. Technology stack they use
4. Recent news and developments

IMPORTANT: Use no more than 5 web searches total. Be strategic with your queries.
Focus on information relevant to B2B software sales.`,
    tools: ["WebSearch"],
    model: "haiku",
  },

  "competitive-analyzer": {
    description: "Analyst that compares prospect's solution to ours",
    prompt: `You are a competitive analysis specialist.

When given company information, analyze:
1. What solutions they currently use
2. Our advantages over competitors
3. Potential concerns they might have
4. Switching barriers and costs

Focus on strategic positioning for sales conversations.`,
    tools: [],
    // Use haiku for simpler analysis tasks
    model: "haiku",
  },

  "qualification-scorer": {
    description: "Scorer that assesses BANT criteria and deal probability",
    prompt: `You are a sales qualification specialist.

Given research and competitive analysis, assess BANT:
- Budget: Can they afford us? Estimated budget?
- Authority: Is contact a decision maker?
- Need: What pain points? How urgent?
- Timeline: When might they decide?

Calculate deal size and win probability (0-100%).

RULES:
- Company <10 employees = Disqualify
- No clear pain points = Nurture
- Using competitor = Highlight switching ROI`,
    tools: [],
    model: "haiku",
  },
};

// -----------------------------------------------------------------------------
// Main Function
// -----------------------------------------------------------------------------

export interface ContactInfo {
  name: string;
  title: string;
  email: string;
}

export async function qualifyOpportunity(
  companyName: string,
  contactInfo: ContactInfo
): Promise<SalesBriefing> {
  const orchestratorPrompt = `You are a sales intelligence orchestrator coordinating specialized subagents.

You have access to three subagents via the Task tool:
- company-researcher: Gathers company intelligence
- competitive-analyzer: Analyzes competitive position
- qualification-scorer: Assesses BANT and calculates deal metrics

Do not perform web search yourself, always delegate to the company-researcher subagent for that.

PROSPECT: ${companyName}
CONTACT: ${contactInfo.name}, ${contactInfo.title} (${contactInfo.email})

WORKFLOW:
1. Use company-researcher to research the company
2. Use competitive-analyzer to analyze their competitive position
3. Use qualification-scorer to assess BANT and calculate deal probability

After all agents complete, compile a comprehensive sales briefing with:
- Company profile
- Competitive analysis
- BANT qualification scores
- Deal size and win probability
- Recommendation (Pursue/Nurture/Disqualify)
- 3-4 talking points for the sales rep

Return the briefing as structured JSON.`;

  const startTime = Date.now();
  const elapsed = () => `Time elapsed so far: ${((Date.now() - startTime) / 1000).toFixed(1)} s`;

  for await (const message of query({
    prompt: generateMessages(orchestratorPrompt),
    options: {
      allowedTools: ["Task"],
      agents: subagents,
      model: "sonnet",
      outputFormat: {
        type: "json_schema",
        schema: SalesBriefingJSONSchema,
      },
      maxTurns: 15,
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
    } else if (message.type === "result" && message.subtype === "success" && message.structured_output) {
      console.log(`[${elapsed()}] DONE`);
      return SalesBriefingSchema.parse(message.structured_output);
    } else if (message.type === "result") {
      throw new Error(`Qualification failed: ${message.subtype} `);
    }
  }

  throw new Error("Failed to generate sales briefing");
}
