/**
 * Sales Opportunity Qualifier - Deliverable
 *
 * Multi-agent system that qualifies sales opportunities
 * using specialized research, competitive analysis, and scoring agents.
 */

import "dotenv/config";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { query } from "@anthropic-ai/claude-agent-sdk";
import {
  companyResearcherPrompt,
  companyResearcherConfig,
} from "./agents/company-researcher.js";
import {
  competitiveAnalyzerPrompt,
  competitiveAnalyzerConfig,
} from "./agents/competitive-analyzer.js";
import {
  qualificationScorerPrompt,
  qualificationScorerConfig,
} from "./agents/qualification-scorer.js";

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export const CompanyProfileSchema = z.object({
  name: z.string(),
  industry: z.string(),
  employeeCount: z.number(),
  estimatedRevenue: z.string(),
  techStack: z.array(z.string()),
  recentNews: z.array(z.string()),
  keyDecisionMakers: z.array(z.string()),
});

export const CompetitiveAnalysisSchema = z.object({
  currentSolution: z.string(),
  ourAdvantages: z.array(z.string()),
  theirConcerns: z.array(z.string()),
  switchingBarriers: z.array(z.string()),
});

export const QualificationSchema = z.object({
  budget: z.object({
    hasBudget: z.boolean(),
    estimatedBudget: z.number(),
    confidence: z.enum(["high", "medium", "low"]),
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
});

export const SalesBriefingSchema = z.object({
  companyProfile: CompanyProfileSchema,
  competitiveAnalysis: CompetitiveAnalysisSchema,
  qualification: QualificationSchema,
  recommendation: z.enum(["Pursue", "Nurture", "Disqualify"]),
  talkingPoints: z.array(z.string()),
});

export type CompanyProfile = z.infer<typeof CompanyProfileSchema>;
export type CompetitiveAnalysis = z.infer<typeof CompetitiveAnalysisSchema>;
export type Qualification = z.infer<typeof QualificationSchema>;
export type SalesBriefing = z.infer<typeof SalesBriefingSchema>;

// Convert to JSON Schema for structured output
export const SalesBriefingJSONSchema = zodToJsonSchema(SalesBriefingSchema, {
  $refStrategy: "root",
});

// -----------------------------------------------------------------------------
// Orchestrator Prompt
// -----------------------------------------------------------------------------

const orchestratorPrompt = `You are a sales intelligence orchestrator coordinating specialized agents to qualify sales opportunities.

Your workflow:

1. COMPANY RESEARCH PHASE
   Research the prospect company to gather:
   - Industry and company size
   - Technology stack
   - Recent news and developments
   - Key decision makers

2. COMPETITIVE ANALYSIS PHASE (can run with research)
   Analyze their competitive position:
   - What solutions they currently use
   - Our advantages over competitors
   - Their likely concerns
   - Switching barriers

3. QUALIFICATION SCORING PHASE (after research + competitive)
   Assess BANT criteria:
   - Budget: Can they afford us?
   - Authority: Is contact a decision maker?
   - Need: What pain points do we solve?
   - Timeline: When might they buy?

   Apply business rules:
   - Company <10 employees = Disqualify
   - No clear pain points = Nurture
   - Already using competitor = Highlight switching ROI

4. GENERATE SALES BRIEFING
   Create comprehensive briefing with:
   - Company profile
   - Competitive analysis
   - BANT qualification scores
   - Deal size and win probability
   - Recommendation (Pursue/Nurture/Disqualify)
   - Key talking points for the sales rep

Execute research and competitive analysis, then qualification scoring.`;

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
  contactInfo: ContactInfo,
  source: "inbound" | "outbound" = "inbound"
): Promise<SalesBriefing> {
  const fullPrompt = `${orchestratorPrompt}

PROSPECT INFORMATION:
- Company: ${companyName}
- Contact: ${contactInfo.name}, ${contactInfo.title}
- Email: ${contactInfo.email}
- Source: ${source}

Begin by researching the company and analyzing competitive position, then score the qualification and generate a comprehensive sales briefing.

Return the briefing as structured JSON matching the required schema.`;

  for await (const message of query({
    prompt: fullPrompt,
    options: {
      outputFormat: {
        type: "json_schema",
        schema: SalesBriefingJSONSchema,
      },
      maxTurns: 8,
    },
  })) {
    if (message.type === "result" && message.structured_output) {
      return SalesBriefingSchema.parse(message.structured_output);
    }
  }

  throw new Error("Failed to generate sales briefing");
}

// Export agent configs for reference
export {
  companyResearcherConfig,
  competitiveAnalyzerConfig,
  qualificationScorerConfig,
};
