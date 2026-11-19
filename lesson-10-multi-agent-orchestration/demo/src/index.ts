/**
 * Demo: Multi-Agent Orchestration - Research Assistant
 *
 * Tests for the research orchestrator with subagents.
 *
 * Features demonstrated:
 * - Sequential orchestration (default)
 * - Parallel subagent execution (--parallel flag)
 * - Dynamic agent factory pattern
 * - Model selection with strings
 *
 * Usage:
 *   npm start                  # Sequential research
 *   npm start -- --parallel    # Parallel research on multiple topics
 */

import "dotenv/config";
import {
  conductResearch,
  conductParallelResearch,
  ResearchResult,
} from "./research-orchestrator.js";

// -----------------------------------------------------------------------------
// Demo: Sequential Research (single topic)
// -----------------------------------------------------------------------------

async function sequentialResearchDemo() {
  const topic = "Recent advances in renewable energy storage";

  console.log("\n--- SEQUENTIAL ORCHESTRATION ---");
  console.log(`Researching: "${topic}"\n`);
  console.log("Orchestrator coordinating subagents in sequence...\n");

  const result = await conductResearch(topic);
  printResult(result);
}

// -----------------------------------------------------------------------------
// Demo: Parallel Research (multiple topics)
// -----------------------------------------------------------------------------

async function parallelResearchDemo() {
  const topics = [
    "Solar panel efficiency improvements",
    "Battery storage technologies",
    "Wind energy innovations",
  ];

  console.log("\n--- PARALLEL ORCHESTRATION ---");
  console.log("Researching multiple topics in parallel:");
  topics.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
  console.log("\nOrchestrator launching subagents in parallel...\n");

  const results = await conductParallelResearch(topics);
  results.forEach((result) => printResult(result));
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

  await sequentialResearchDemo();
  // await parallelResearchDemo();
}

main().catch(console.error);
