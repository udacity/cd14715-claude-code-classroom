/**
 * Exercise: Multi-Agent Orchestration - Sales Opportunity Qualifier
 *
 * Tests for the sales qualifier with subagents.
 */

import "dotenv/config";
import { qualifyOpportunity, SalesBriefing } from "./sales-qualifier.js";
import { sampleProspects } from "./sample-prospects.js";

// -----------------------------------------------------------------------------
// Test case: Qualify an enterprise prospect
// -----------------------------------------------------------------------------

async function qualifyEnterpriseProspect() {
  const prospect = sampleProspects[0]; // TechCorp Industries

  console.log(`Qualifying: ${prospect.companyName}`);
  console.log(`Contact: ${prospect.name}, ${prospect.title}\n`);
  console.log("Orchestrator coordinating subagents...\n");

  const briefing = await qualifyOpportunity(prospect.companyName, {
    name: prospect.name,
    title: prospect.title,
    email: prospect.email,
  });

  printBriefing(briefing);
}

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

function printBriefing(briefing: SalesBriefing) {
  console.log("=".repeat(50));
  console.log("SALES BRIEFING");
  console.log("=".repeat(50));

  console.log("\nCOMPANY PROFILE:");
  console.log(`  Name: ${briefing.companyProfile.name}`);
  console.log(`  Industry: ${briefing.companyProfile.industry}`);
  console.log(`  Employees: ${briefing.companyProfile.employeeCount}`);
  console.log(`  Revenue: ${briefing.companyProfile.estimatedRevenue}`);

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

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  EXERCISE: Multi-Agent - Sales Opportunity Qualifier");
  console.log("  Orchestrator coordinates researcher, analyzer, scorer");
  console.log("=".repeat(60));

  await qualifyEnterpriseProspect();
}

main().catch(console.error);
