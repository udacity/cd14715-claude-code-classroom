/**
 * Exercise: Extended Thinking for Fraud Detection
 *
 * Tests for the analyzeFraudRisk() deliverable.
 */

import Anthropic from "@anthropic-ai/sdk";
import { TRANSACTIONS, Transaction } from "./sample-transactions.js";
import { analyzeFraudRisk, FraudAnalysis } from "./fraud-analyzer.js";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const model = "claude-sonnet-4-5-20250929";

// -----------------------------------------------------------------------------
// Step 1: Analyze WITHOUT extended thinking (baseline comparison)
// -----------------------------------------------------------------------------

async function step1_withoutThinking() {
  console.log("\n--- STEP 1: Analysis WITHOUT Extended Thinking ---\n");

  const t = TRANSACTIONS.obvious_fraud;
  console.log(`Transaction: ${t.id} - $${t.amount} at ${t.merchant}\n`);

  const response = await client.messages.create({
    model,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Analyze this transaction for fraud: $${t.amount} at ${t.merchant} in ${t.location}. Customer usually spends $${t.customerHistory.typicalAmount} in ${t.customerHistory.typicalLocation}.`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  console.log("Result:", text.substring(0, 300) + "...\n");
  console.log(" No audit trail captured without extended thinking.");
}

// -----------------------------------------------------------------------------
// Step 2: Test analyzeFraudRisk() with obvious fraud
// -----------------------------------------------------------------------------

async function step2_testObviousFraud() {
  console.log("\n--- STEP 2: Test analyzeFraudRisk() - Obvious Fraud ---\n");

  const t = TRANSACTIONS.obvious_fraud;
  console.log(`Transaction: ${t.id} - $${t.amount} at ${t.merchant}\n`);

  const result = await analyzeFraudRisk(t);

  console.log("💭 Thinking (preview):");
  if (result.reasoning_steps.length > 0) {
    console.log(result.reasoning_steps[0].substring(0, 300) + "...\n");
  }

  console.log("📊 Result:");
  console.log(`  Risk Level: ${result.risk_level}`);
  console.log(`  Confidence: ${result.confidence}%`);
  console.log(`  Recommendation: ${result.recommendation}`);
  console.log(`  Risk Factors: ${result.risk_factors.join(", ")}`);
  console.log(`  Reasoning Steps: ${result.reasoning_steps.length} captured`);

  console.log("\n💡 Extended thinking provides audit trail for compliance!");
}

// -----------------------------------------------------------------------------
// Step 3: Test analyzeFraudRisk() - show audit trail
// -----------------------------------------------------------------------------

async function step3_testAuditTrail() {
  console.log("\n--- STEP 3: Test Compliance Audit Trail ---\n");

  const t = TRANSACTIONS.ambiguous_case;
  console.log(`Transaction: ${t.id} - $${t.amount} at ${t.merchant}\n`);

  const result = await analyzeFraudRisk(t);

  console.log(`Decision: ${result.recommendation.toUpperCase()} (${result.risk_level} risk)\n`);

  console.log("📋 Audit Trail for Regulators:");
  result.reasoning_steps.forEach((step, i) => {
    const preview = step.substring(0, 200).replace(/\n/g, " ");
    console.log(`\n  ${i + 1}. ${preview}...`);
  });

  console.log("\n\n💡 This audit trail can be presented to regulators!");
}

// -----------------------------------------------------------------------------
// Step 4: Test analyzeFraudRisk() on all 5 transactions
// -----------------------------------------------------------------------------

async function step4_testAllTransactions() {
  console.log("\n--- STEP 4: Test All 5 Transactions ---\n");

  const results: Array<{ name: string; result: FraudAnalysis }> = [];

  for (const [name, transaction] of Object.entries(TRANSACTIONS)) {
    console.log(`Analyzing ${name}...`);
    const result = await analyzeFraudRisk(transaction);
    results.push({ name, result });
  }

  console.log("\n📊 Summary:\n");
  console.log("Transaction        | Risk     | Confidence | Recommendation");
  console.log("-------------------|----------|------------|---------------");

  for (const { name, result } of results) {
    const n = name.padEnd(18);
    const r = result.risk_level.padEnd(8);
    const c = `${result.confidence}%`.padEnd(10);
    console.log(`${n} | ${r} | ${c} | ${result.recommendation}`);
  }

  console.log("\n💡 All 5 transactions analyzed with reasoning trails!");
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  EXERCISE: Extended Thinking for Fraud Detection");
  console.log("  Testing: analyzeFraudRisk() deliverable");
  console.log("=".repeat(60));

  await step1_withoutThinking();
  await step2_testObviousFraud();
  await step3_testAuditTrail();
  await step4_testAllTransactions();
}

main().catch(console.error);
