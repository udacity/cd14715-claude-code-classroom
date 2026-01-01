/**
 * Demo: Claude Skills - Email Etiquette
 *
 * Tests for the email etiquette skill.
 */

import "dotenv/config";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { sampleEmails } from "./sample-emails.js";

// -----------------------------------------------------------------------------
// Step 1: Explain the skill structure
// -----------------------------------------------------------------------------

function step1_explainSkill() {
  console.log("\n--- STEP 1: Understanding Claude Skills ---\n");

  console.log("Skill Location: .claude/skills/email-etiquette/SKILL.md");
  console.log("\nSKILL.md Structure:");
  console.log("  # Email Etiquette Skill");
  console.log("  ## Expertise - What the skill knows");
  console.log("  ## Capabilities - What it can do");
  console.log("  ## Analysis Criteria - How it evaluates");
  console.log("  ## Output Format - Expected response structure");
  console.log("  ## Examples - Before/after demonstrations");

  console.log("\nWhen to use Skills vs Inline Prompts:");
  console.log("  Skills: Reusable expertise, complex criteria, multiple agents");
  console.log("  Inline: One-off instructions, simple guidance");

  console.log("\n-> Skills provide consistent, versioned expertise!");
}

// -----------------------------------------------------------------------------
// Step 2: Review a casual email
// -----------------------------------------------------------------------------

async function step2_reviewCasualEmail() {
  console.log("\n--- STEP 2: Review Casual Email ---\n");

  const email = sampleEmails[0];
  console.log(`Email: "${email.content}"\n`);

  const prompt = `You are an email review assistant with expertise in professional communication.

Use the email-etiquette skill criteria to analyze this email:

"${email.content}"

Provide your analysis as JSON with: tone, issues (array with type, severity, description, suggestion), score (1-10), and optionally a revisedEmail.`;

  for await (const message of query({
    prompt,
    options: {
      maxTurns: 1,
    },
  })) {
    if (message.type === "result" && message.subtype === "success") {
      console.log("Analysis Result:\n");
      console.log(message.result);
    }
  }

  console.log(`\nExpected tone: ${email.expectedTone}`);
  console.log("\n-> Skill criteria identifies casual tone issues!");
}

// -----------------------------------------------------------------------------
// Step 3: Review multiple emails
// -----------------------------------------------------------------------------

async function step3_reviewMultiple() {
  console.log("\n--- STEP 3: Review Multiple Emails ---\n");

  for (const email of sampleEmails.slice(0, 3)) {
    console.log(`${email.name}:`);

    const prompt = `Analyze this email using professional email etiquette standards.
Return only a brief JSON with: tone ("appropriate", "too-casual", or "too-formal"), score (1-10), and one main issue if any.

Email: "${email.content}"`;

    for await (const message of query({
      prompt,
      options: {
        maxTurns: 1,
      },
    })) {
      if (message.type === "result" && message.subtype === "success") {
        console.log(`  Result: ${message.result}`);
      }
    }

    console.log(`  Expected: ${email.expectedTone}\n`);
  }

  console.log("-> Consistent analysis across different email styles!");
}

// -----------------------------------------------------------------------------
// Step 4: Show skill benefits
// -----------------------------------------------------------------------------

function step4_skillBenefits() {
  console.log("\n--- STEP 4: Skill Benefits ---\n");

  console.log("Benefits of Claude Skills:");
  console.log("  1. Reusability - Same expertise across multiple agents");
  console.log("  2. Consistency - Standardized analysis criteria");
  console.log("  3. Maintainability - Update skill, all agents benefit");
  console.log("  4. Version Control - Track changes to expertise");
  console.log("  5. Separation - Business logic separate from agent code");

  console.log("\nSkill Organization:");
  console.log("  .claude/skills/");
  console.log("  ├── email-etiquette/SKILL.md");
  console.log("  ├── code-review/SKILL.md");
  console.log("  ├── sql-optimization/SKILL.md");
  console.log("  └── security-audit/SKILL.md");

  console.log("\n-> Skills are modular expertise you can mix and match!");
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  DEMO: Claude Skills - Email Etiquette");
  console.log("  Reusable expertise in .claude/skills/");
  console.log("=".repeat(60));

  step1_explainSkill();
  await step2_reviewCasualEmail();
  await step3_reviewMultiple();
  step4_skillBenefits();

  console.log("\n" + "=".repeat(60));
  console.log("  KEY TAKEAWAYS");
  console.log("=".repeat(60));
  console.log(`
  SKILL STRUCTURE:
  .claude/skills/<skill-name>/SKILL.md

  SKILL.MD SECTIONS:
  • Expertise - Domain knowledge description
  • Capabilities - What the skill can analyze
  • Analysis Criteria - Evaluation standards
  • Output Format - Expected response structure
  • Examples - Before/after demonstrations

  WHEN TO USE SKILLS:
  • Multiple agents need same expertise
  • Complex, detailed analysis criteria
  • Need consistency across evaluations
  • Want version-controlled knowledge
`);
}

main().catch(console.error);
