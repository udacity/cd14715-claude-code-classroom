/**
 * Demo: Multi-Agent Orchestration - Research Assistant
 *
 * Tests for the research orchestrator with specialized agents.
 */

import "dotenv/config";
import {
  conductResearch,
  researcherConfig,
  analyzerConfig,
  summarizerConfig,
} from "./research-orchestrator.js";

// -----------------------------------------------------------------------------
// Step 1: Explain multi-agent architecture
// -----------------------------------------------------------------------------

function step1_explainArchitecture() {
  console.log("\n--- STEP 1: Multi-Agent Architecture ---\n");

  console.log("Architecture:");
  console.log(`
  USER REQUEST: "Research [topic]"
       ↓
  ORCHESTRATOR AGENT
       ↓
       ├─→ RESEARCHER (web search) ──────→ Findings ─┐
       ├─→ ANALYZER (find patterns) ─────→ Insights ─┤
       └─→ SUMMARIZER (create report) ───→ Summary ──┤
                                                      ↓
                                                FINAL REPORT
  `);

  console.log("Agent Specialization:");
  console.log(`  Researcher: ${researcherConfig.description}`);
  console.log(`    Model: ${researcherConfig.model}`);
  console.log(`  Analyzer: ${analyzerConfig.description}`);
  console.log(`    Model: ${analyzerConfig.model}`);
  console.log(`  Summarizer: ${summarizerConfig.description}`);
  console.log(`    Model: ${summarizerConfig.model}`);

  console.log("\n-> Specialized agents = better results per task!");
}

// -----------------------------------------------------------------------------
// Step 2: Show orchestration patterns
// -----------------------------------------------------------------------------

function step2_orchestrationPatterns() {
  console.log("\n--- STEP 2: Orchestration Patterns ---\n");

  console.log("SEQUENTIAL (dependencies between agents):");
  console.log("  Agent1 → Output1 → Agent2 → Output2 → Agent3 → Final");
  console.log("  Use when: Each agent needs previous results\n");

  console.log("PARALLEL (independent tasks):");
  console.log("       ┌─ Agent1 ─→ Output1 ─┐");
  console.log("  Task ├─ Agent2 ─→ Output2 ─┤ → Combine → Final");
  console.log("       └─ Agent3 ─→ Output3 ─┘");
  console.log("  Use when: Agents work independently\n");

  console.log("HYBRID (some parallel, some sequential):");
  console.log("       ┌─ Agent1 ──┐");
  console.log("  Task ├─ Agent2 ──┤ → Combine → Agent4 → Final");
  console.log("       └─ Agent3 ──┘");
  console.log("  Parallel research, then sequential synthesis\n");

  console.log("Our demo uses SEQUENTIAL:");
  console.log("  Research → Analysis → Summary");
  console.log("  Each phase needs previous output");

  console.log("\n-> Choose pattern based on dependencies!");
}

// -----------------------------------------------------------------------------
// Step 3: Conduct research
// -----------------------------------------------------------------------------

async function step3_conductResearch() {
  console.log("\n--- STEP 3: Conduct Research ---\n");

  const topic = "Recent advances in renewable energy storage";
  console.log(`Topic: "${topic}"\n`);
  console.log("Starting orchestrated research...\n");

  try {
    const result = await conductResearch(topic);

    console.log("RESEARCH COMPLETE\n");
    console.log("=".repeat(50));
    console.log(result.finalReport);
    console.log("=".repeat(50));
  } catch (error) {
    console.log(`Error: ${(error as Error).message}`);
    console.log("Web search may require additional configuration.");
  }

  console.log("\n-> Orchestrator coordinated all agents!");
}

// -----------------------------------------------------------------------------
// Step 4: Benefits of multi-agent
// -----------------------------------------------------------------------------

function step4_benefits() {
  console.log("\n--- STEP 4: Multi-Agent Benefits ---\n");

  console.log("Why Multi-Agent?");
  console.log("  1. Specialization - Each agent masters one task");
  console.log("  2. Parallelization - Independent tasks run concurrently");
  console.log("  3. Modularity - Swap/upgrade agents independently");
  console.log("  4. Model optimization - Right model per task");
  console.log("  5. Debugging - Isolate issues to specific agents");

  console.log("\nWhen to use Multi-Agent:");
  console.log("  - Complex tasks with distinct phases");
  console.log("  - Different expertise needed per phase");
  console.log("  - Tasks that can run in parallel");
  console.log("  - Need different models for different steps");

  console.log("\nWhen Single Agent is better:");
  console.log("  - Simple, focused tasks");
  console.log("  - Strong context needed throughout");
  console.log("  - Latency is critical (fewer hops)");

  console.log("\n-> Multi-agent shines for complex workflows!");
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  DEMO: Multi-Agent Orchestration - Research Assistant");
  console.log("  Coordinate specialized agents for comprehensive research");
  console.log("=".repeat(60));

  step1_explainArchitecture();
  step2_orchestrationPatterns();
  await step3_conductResearch();
  step4_benefits();

  console.log("\n" + "=".repeat(60));
  console.log("  KEY TAKEAWAYS");
  console.log("=".repeat(60));
  console.log(`
  MULTI-AGENT PATTERN:
  • Define specialized agents (researcher, analyzer, summarizer)
  • Create orchestrator to coordinate them
  • Choose execution pattern (sequential/parallel/hybrid)
  • Combine results into final output

  AGENT ROLES:
  • Researcher: Gather information (Sonnet + WebSearch)
  • Analyzer: Find patterns (Sonnet + deep reasoning)
  • Summarizer: Create report (Haiku for speed)

  ORCHESTRATION PATTERNS:
  • Sequential: A → B → C (each needs previous output)
  • Parallel: A + B + C → Combine (independent tasks)
  • Hybrid: (A + B) → C (mix of both)

  BEST PRACTICES:
  • Match model to task complexity
  • Minimize dependencies for parallelization
  • Clear handoff between agents
  • Combine results coherently
`);
}

main().catch(console.error);
