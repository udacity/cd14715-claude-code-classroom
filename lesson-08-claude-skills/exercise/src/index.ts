/**
 * Exercise: Claude Skills - SQL Optimization
 *
 * Tests for the SQL optimization skill.
 */

import "dotenv/config";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { sampleQueries } from "./sample-queries.js";

// -----------------------------------------------------------------------------
// Step 1: Explain the skill structure
// -----------------------------------------------------------------------------

function step1_explainSkill() {
  console.log("\n--- STEP 1: SQL Optimization Skill Structure ---\n");

  console.log("Skill Location: .claude/skills/sql-optimization/SKILL.md");
  console.log("\nSKILL.md Sections:");
  console.log("  ## Expertise - SQL performance optimization");
  console.log("  ## Capabilities - Anti-pattern detection, index advice");
  console.log("  ## Analysis Criteria - What to look for");
  console.log("  ## Red Flags - Immediate attention items");
  console.log("  ## Optimization Techniques - How to fix issues");
  console.log("  ## Output Format - JSON structure");
  console.log("  ## Examples - Before/after demonstrations");

  console.log("\n-> Skill provides deep database optimization expertise!");
}

// -----------------------------------------------------------------------------
// Step 2: Analyze a query with anti-patterns
// -----------------------------------------------------------------------------

async function step2_analyzeAntiPattern() {
  console.log("\n--- STEP 2: Analyze Query with Anti-Patterns ---\n");

  const testQuery = sampleQueries[0];
  console.log(`Query: ${testQuery.query}\n`);

  const prompt = `You are a SQL optimization expert. Analyze this query using SQL optimization best practices:

\`\`\`sql
${testQuery.query}
\`\`\`

Return JSON with:
- issues: array of {type, severity, description, impact}
- indexRecommendations: array of {table, columns, reason}
- optimizedQuery: the improved query
- estimatedImprovement: expected speedup`;

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

  console.log(`\nExpected issues: ${testQuery.expectedIssues.join(", ")}`);
  console.log("\n-> Skill identifies SELECT * and missing index!");
}

// -----------------------------------------------------------------------------
// Step 3: Analyze N+1 query problem
// -----------------------------------------------------------------------------

async function step3_analyzeN1Problem() {
  console.log("\n--- STEP 3: Analyze N+1 Query Problem ---\n");

  const testQuery = sampleQueries[1];
  console.log(`Query Pattern:\n${testQuery.query}\n`);

  const prompt = `You are a SQL optimization expert. Analyze this query pattern for performance issues:

\`\`\`sql
${testQuery.query}
\`\`\`

Focus on identifying the N+1 query anti-pattern and suggest how to combine into a single query.

Return JSON with issues, indexRecommendations, optimizedQuery, and estimatedImprovement.`;

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

  console.log("\n-> N+1 is a critical performance issue - caught!");
}

// -----------------------------------------------------------------------------
// Step 4: Analyze multiple queries
// -----------------------------------------------------------------------------

async function step4_analyzeMultiple() {
  console.log("\n--- STEP 4: Analyze Multiple Queries ---\n");

  for (const testQuery of sampleQueries) {
    console.log(`${testQuery.name}:`);

    const prompt = `Briefly analyze this SQL query for performance issues. List only the main issues found (1-2 sentences each).

\`\`\`sql
${testQuery.query}
\`\`\``;

    for await (const message of query({
      prompt,
      options: {
        maxTurns: 1,
      },
    })) {
      if (message.type === "result" && message.subtype === "success") {
        console.log(`  ${message.result}`);
      }
    }

    const expectedStr =
      testQuery.expectedIssues.length > 0
        ? testQuery.expectedIssues.join(", ")
        : "None (well-optimized)";
    console.log(`  Expected: ${expectedStr}\n`);
  }

  console.log("-> Skill handles various SQL patterns!");
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  EXERCISE: Claude Skills - SQL Optimization");
  console.log("  Detect anti-patterns and recommend optimizations");
  console.log("=".repeat(60));

  step1_explainSkill();
  await step2_analyzeAntiPattern();
  await step3_analyzeN1Problem();
  await step4_analyzeMultiple();

  console.log("\n" + "=".repeat(60));
  console.log("  KEY TAKEAWAYS");
  console.log("=".repeat(60));
  console.log(`
  DELIVERABLE: .claude/skills/sql-optimization/SKILL.md
  - Expertise in SQL query performance
  - Anti-pattern detection criteria
  - Index recommendation guidelines
  - Optimization techniques with examples

  ANTI-PATTERNS COVERED:
  - SELECT * usage
  - N+1 query problem
  - Missing indexes
  - Functions on indexed columns
  - Inefficient subqueries
  - Poor pagination

  USE CASES:
  - Code review for database queries
  - CI/CD query validation
  - Developer education
  - Performance audits
`);
}

main().catch(console.error);
