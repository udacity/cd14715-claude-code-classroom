/**
 * Demo: Multi-Agent Orchestration - Research Assistant
 *
 * Tests for the research orchestrator with subagents.
 */

import "dotenv/config";
import { conductResearch, ResearchResult } from "./research-orchestrator.js";

// -----------------------------------------------------------------------------
// Test case: Conduct research on a topic
// -----------------------------------------------------------------------------

async function conductResearchDemo() {
  const topic = "Recent advances in renewable energy storage";

  console.log(`Researching: "${topic}"\n`);
  console.log("Orchestrator coordinating subagents...\n");

  const result = await conductResearch(topic);
  printResult(result);
}

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

function printResult(result: ResearchResult) {
  console.log("=".repeat(50));
  console.log("RESEARCH COMPLETE");
  console.log("=".repeat(50));

  console.log(`\nTopic: ${result.topic}\n`);
  console.log("FINAL REPORT:");
  console.log(result.finalReport);
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  DEMO: Multi-Agent Orchestration - Research Assistant");
  console.log("  Orchestrator coordinates researcher, analyzer, summarizer");
  console.log("=".repeat(60));

  await conductResearchDemo();
}

main().catch(console.error);
