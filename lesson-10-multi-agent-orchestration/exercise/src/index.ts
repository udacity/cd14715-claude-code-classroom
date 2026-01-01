/**
 * Exercise: Multi-Agent Orchestration - Sales Opportunity Qualifier
 *
 * Tests for the sales qualifier with specialized agents.
 */

import "dotenv/config";
import {
  qualifyOpportunity,
  SalesBriefing,
  companyResearcherConfig,
  competitiveAnalyzerConfig,
  qualificationScorerConfig,
} from "./sales-qualifier.js";
import { sampleProspects } from "./sample-prospects.js";

// -----------------------------------------------------------------------------
// Step 1: Explain the multi-agent workflow
// -----------------------------------------------------------------------------

function step1_explainWorkflow() {
  console.log("\n--- STEP 1: Sales Qualification Workflow ---\n");

  console.log("Architecture:");
  console.log(`
  PROSPECT INFO: Company + Contact
       ↓
  ORCHESTRATOR
       ↓
       ├─→ Company Research ──────→ Profile ──┐
       ├─→ Competitive Analysis ──→ Position ─┤ (parallel)
       ↓                                       ↓
       └───────────── Wait ───────────────────┘
                       ↓
       Qualification Scorer ──→ BANT + Deal Size (sequential)
                       ↓
       Sales Briefing with Talking Points
  `);

  console.log("Agent Specialization:");
  console.log(`  ${companyResearcherConfig.name}: ${companyResearcherConfig.description}`);
  console.log(`  ${competitiveAnalyzerConfig.name}: ${competitiveAnalyzerConfig.description}`);
  console.log(`  ${qualificationScorerConfig.name}: ${qualificationScorerConfig.description}`);

  console.log("\n-> Hybrid pattern: parallel research, then sequential scoring!");
}

// -----------------------------------------------------------------------------
// Step 2: Qualify an enterprise prospect
// -----------------------------------------------------------------------------

async function step2_qualifyEnterprise() {
  console.log("\n--- STEP 2: Qualify Enterprise Prospect ---\n");

  const prospect = sampleProspects[0]; // TechCorp Industries
  console.log(`Company: ${prospect.companyName}`);
  console.log(`Contact: ${prospect.name}, ${prospect.title}`);
  console.log(`Source: ${prospect.source}\n`);

  console.log("Running qualification...\n");

  try {
    const briefing = await qualifyOpportunity(
      prospect.companyName,
      { name: prospect.name, title: prospect.title, email: prospect.email },
      prospect.source
    );

    printBriefing(briefing);
  } catch (error) {
    console.log(`Error: ${(error as Error).message}`);
    console.log("Simulating expected output for enterprise...\n");
    printMockEnterpriseBriefing();
  }

  console.log("\n-> Enterprise = high budget, complex process!");
}

// -----------------------------------------------------------------------------
// Step 3: Qualify multiple prospects
// -----------------------------------------------------------------------------

async function step3_qualifyMultiple() {
  console.log("\n--- STEP 3: Qualify Multiple Prospect Types ---\n");

  for (const prospect of sampleProspects) {
    console.log(`\n${prospect.companyType.toUpperCase()}: ${prospect.companyName}`);
    console.log(`Contact: ${prospect.name} (${prospect.title})`);

    try {
      const briefing = await qualifyOpportunity(
        prospect.companyName,
        { name: prospect.name, title: prospect.title, email: prospect.email },
        prospect.source
      );

      console.log(`  Recommendation: ${briefing.recommendation}`);
      console.log(`  Win Probability: ${briefing.qualification.winProbability}%`);
      console.log(`  Deal Size: $${briefing.qualification.dealSize.toLocaleString()}`);
    } catch (error) {
      console.log(`  Error: ${(error as Error).message}`);
    }
  }

  console.log("\n-> Different company types = different qualification!") ;
}

// -----------------------------------------------------------------------------
// Step 4: Benefits of multi-agent sales qualification
// -----------------------------------------------------------------------------

function step4_benefits() {
  console.log("\n--- STEP 4: Multi-Agent Sales Benefits ---\n");

  console.log("Time Savings:");
  console.log("  Manual research: 2-3 hours per prospect");
  console.log("  Automated: 2-3 minutes per prospect");
  console.log("  = 95% time reduction\n");

  console.log("Quality Improvements:");
  console.log("  - Consistent qualification criteria");
  console.log("  - No human bias in scoring");
  console.log("  - Comprehensive competitive intel");
  console.log("  - Data-driven recommendations\n");

  console.log("Sales Rep Benefits:");
  console.log("  - Come prepared to calls");
  console.log("  - Know talking points in advance");
  console.log("  - Focus on high-probability deals");
  console.log("  - Higher close rates");

  console.log("\n-> Multi-agent = scalable sales intelligence!");
}

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

function printBriefing(briefing: SalesBriefing) {
  console.log("=".repeat(50));
  console.log("SALES BRIEFING");
  console.log("=".repeat(50));

  console.log("\nCOMPANY PROFILE:");
  console.log(`  Industry: ${briefing.companyProfile.industry}`);
  console.log(`  Employees: ${briefing.companyProfile.employeeCount}`);
  console.log(`  Revenue: ${briefing.companyProfile.estimatedRevenue}`);
  console.log(`  Tech Stack: ${briefing.companyProfile.techStack.join(", ")}`);

  console.log("\nCOMPETITIVE ANALYSIS:");
  console.log(`  Current Solution: ${briefing.competitiveAnalysis.currentSolution}`);
  console.log(`  Our Advantages: ${briefing.competitiveAnalysis.ourAdvantages.join(", ")}`);

  console.log("\nBANT QUALIFICATION:");
  console.log(`  Budget: ${briefing.qualification.budget.hasBudget ? "Yes" : "No"} ($${briefing.qualification.budget.estimatedBudget.toLocaleString()})`);
  console.log(`  Authority: ${briefing.qualification.authority.contactIsDecisionMaker ? "Contact is DM" : "Need other DMs"}`);
  console.log(`  Need Urgency: ${briefing.qualification.need.urgency}`);
  console.log(`  Timeline: ${briefing.qualification.timeline}`);

  console.log("\nDEAL METRICS:");
  console.log(`  Deal Size: $${briefing.qualification.dealSize.toLocaleString()}`);
  console.log(`  Win Probability: ${briefing.qualification.winProbability}%`);
  console.log(`  RECOMMENDATION: ${briefing.recommendation}`);

  console.log("\nTALKING POINTS:");
  briefing.talkingPoints.forEach((point, i) => console.log(`  ${i + 1}. ${point}`));
}

function printMockEnterpriseBriefing() {
  const mock: SalesBriefing = {
    companyProfile: {
      name: "TechCorp Industries",
      industry: "Enterprise Software",
      employeeCount: 2500,
      estimatedRevenue: "$500M-$1B",
      techStack: ["AWS", "Kubernetes", "PostgreSQL"],
      recentNews: ["Raised $200M Series D"],
      keyDecisionMakers: ["VP Engineering", "CIO", "CFO"],
    },
    competitiveAnalysis: {
      currentSolution: "Legacy in-house tools",
      ourAdvantages: ["Modern architecture", "Better integrations"],
      theirConcerns: ["Migration complexity", "Training time"],
      switchingBarriers: ["Data migration", "Change management"],
    },
    qualification: {
      budget: { hasBudget: true, estimatedBudget: 250000, confidence: "high" },
      authority: { contactIsDecisionMaker: true, decisionMakers: ["VP Engineering", "CIO"] },
      need: { painPoints: ["Scaling issues", "Integration gaps"], urgency: "high" },
      timeline: "Q2 2025",
      dealSize: 250000,
      winProbability: 65,
    },
    recommendation: "Pursue",
    talkingPoints: [
      "Reference the recent Series D - they have budget",
      "Address migration concerns with case studies",
      "Highlight enterprise-grade security features",
    ],
  };
  printBriefing(mock);
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  EXERCISE: Multi-Agent - Sales Opportunity Qualifier");
  console.log("  Coordinate agents for comprehensive sales intelligence");
  console.log("=".repeat(60));

  step1_explainWorkflow();
  await step2_qualifyEnterprise();
  await step3_qualifyMultiple();
  step4_benefits();

  console.log("\n" + "=".repeat(60));
  console.log("  KEY TAKEAWAYS");
  console.log("=".repeat(60));
  console.log(`
  DELIVERABLE: sales-qualifier.ts
  - Exports: qualifyOpportunity() function
  - Exports: SalesBriefing type
  - Three specialized agent configs

  ORCHESTRATION PATTERN (Hybrid):
  • Parallel: Company Research + Competitive Analysis
  • Sequential: Qualification Scoring (after research)

  AGENTS:
  • Company Researcher: Gather intel (Sonnet)
  • Competitive Analyzer: Strategic positioning (Sonnet)
  • Qualification Scorer: BANT + deal metrics (Sonnet)

  OUTPUT:
  • Company profile
  • Competitive analysis
  • BANT qualification
  • Deal size & win probability
  • Recommendation & talking points

  BUSINESS VALUE:
  • 95% time reduction in research
  • Consistent qualification criteria
  • Data-driven prioritization
  • Prepared sales conversations
`);
}

main().catch(console.error);
