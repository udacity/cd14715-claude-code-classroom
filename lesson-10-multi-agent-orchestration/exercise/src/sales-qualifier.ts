/**
 * Sales Opportunity Qualifier - Deliverable
 *
 * Uses subagents pattern to coordinate specialized agents
 * for comprehensive sales qualification.
 */

import "dotenv/config";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { query } from "@anthropic-ai/claude-agent-sdk";

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
// Subagent Definitions
// -----------------------------------------------------------------------------

const subagents = {
  "company-researcher": {
    description: "Research specialist that gathers company intelligence",
    prompt: `You are a company research specialist.

When asked to research a company, gather:
1. Company size (employees, revenue)
2. Industry and market position
3. Technology stack they use
4. Recent news and developments

Focus on information relevant to B2B software sales.`,
    tools: ["WebSearch"],
    model: "sonnet",
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
    model: "sonnet",
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
    model: "sonnet",
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

  for await (const message of query({
    prompt: orchestratorPrompt,
    options: {
      allowedTools: ["Task"],
      agents: subagents,
      outputFormat: {
        type: "json_schema",
        schema: SalesBriefingJSONSchema,
      },
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
    } else if (message.type === "result" && message.subtype === "success" && message.structured_output) {
      return SalesBriefingSchema.parse(message.structured_output);
    } else if (message.type === "result") {
      throw new Error(`Qualification failed: ${message.subtype}`);
    }
  }

  throw new Error("Failed to generate sales briefing");
}
