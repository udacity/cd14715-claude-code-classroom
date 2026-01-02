/**
 * Demo: Extended Thinking for Root Cause Analysis
 *
 * Tests for the analyzeIncident() function.
 */

import Anthropic from "@anthropic-ai/sdk";
import { INCIDENTS } from "./sample-incidents.js";
import { analyzeIncident, IncidentAnalysis } from "./incident-analyzer.js";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const model = "claude-sonnet-4-5-20250929";

// -----------------------------------------------------------------------------
// Step 1: Analyze WITHOUT extended thinking (baseline comparison)
// -----------------------------------------------------------------------------

async function step1_withoutThinking() {
  console.log("\n--- STEP 1: Analysis WITHOUT Extended Thinking ---\n");

  const response = await client.messages.create({
    model,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Analyze this incident and identify the root cause:\n\n${INCIDENTS.checkout}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  console.log("Result (truncated):");
  console.log(text.substring(0, 400) + "...\n");
  console.log("⚠️  Without thinking, analysis may miss correlations.");
}

// -----------------------------------------------------------------------------
// Step 2: Test analyzeIncident() with checkout incident
// -----------------------------------------------------------------------------

async function step2_testCheckoutIncident() {
  console.log("\n--- STEP 2: Test analyzeIncident() - Checkout Drop ---\n");

  const result = await analyzeIncident(INCIDENTS.checkout);

  console.log("💭 Thinking (preview):");
  if (result.reasoning_steps.length > 0) {
    console.log(result.reasoning_steps[0].substring(0, 300) + "...\n");
  }

  console.log("📊 Result:");
  console.log(`  Root Cause: ${result.root_cause}`);
  console.log(`  Confidence: ${(result.confidence * 100).toFixed(0)}%`);
  console.log(`  Severity: ${result.severity}`);
  console.log(`  Recommendation: ${result.recommendation}`);
  console.log(`  Reasoning Steps: ${result.reasoning_steps.length} captured`);

  console.log("\n💡 Extended thinking reveals step-by-step investigation!");
}

// -----------------------------------------------------------------------------
// Step 3: Test analyzeIncident() - show audit trail
// -----------------------------------------------------------------------------

async function step3_testAuditTrail() {
  console.log("\n--- STEP 3: Test Audit Trail Extraction ---\n");

  const result = await analyzeIncident(INCIDENTS.latency);

  console.log(`Root Cause: ${result.root_cause}`);
  console.log(`Recommendation: ${result.recommendation}\n`);

  console.log("📋 Audit Trail for Stakeholders:");
  result.reasoning_steps.forEach((step, i) => {
    const preview = step.substring(0, 200).replace(/\n/g, " ");
    console.log(`\n  ${i + 1}. ${preview}...`);
  });

  console.log("\n\n💡 Thinking blocks create transparent audit trails!");
}

// -----------------------------------------------------------------------------
// Step 4: Test both incidents
// -----------------------------------------------------------------------------

async function step4_testAllIncidents() {
  console.log("\n--- STEP 4: Test All Incidents ---\n");

  const incidents = [
    { name: "checkout", data: INCIDENTS.checkout },
    { name: "latency", data: INCIDENTS.latency },
  ];

  const results: Array<{ name: string; result: IncidentAnalysis }> = [];

  for (const incident of incidents) {
    console.log(`Analyzing ${incident.name}...`);
    const result = await analyzeIncident(incident.data);
    results.push({ name: incident.name, result });
  }

  console.log("\n📊 Summary:\n");
  console.log("Incident   | Severity | Confidence | Root Cause");
  console.log("-----------|----------|------------|---------------------------");

  for (const { name, result } of results) {
    const n = name.padEnd(10);
    const s = result.severity.padEnd(8);
    const c = `${(result.confidence * 100).toFixed(0)}%`.padEnd(10);
    const rc = result.root_cause.substring(0, 25);
    console.log(`${n} | ${s} | ${c} | ${rc}...`);
  }

  console.log("\n💡 All incidents analyzed with reasoning trails!");
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  DEMO: Extended Thinking for Root Cause Analysis");
  console.log("  Testing: analyzeIncident() function");
  console.log("=".repeat(60));

  await step1_withoutThinking();
  await step2_testCheckoutIncident();
  await step3_testAuditTrail();
  await step4_testAllIncidents();

}

main().catch(console.error);
