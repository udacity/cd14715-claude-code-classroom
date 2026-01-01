# SQL Query Optimization Skill

Build a Claude Skill that provides SQL optimization expertise.

## Overview

Build a Claude Skill that provides expertise in SQL query optimization, including detecting anti-patterns, recommending indexes, and suggesting query rewrites.

## Scenario

Your development team writes hundreds of SQL queries but lacks database optimization expertise. Queries are slow, missing indexes, and use anti-patterns like `SELECT *`. You need a reusable skill that any agent can invoke to review queries for optimization opportunities.

## What You'll Build

A skill that:
- Detects performance anti-patterns
- Recommends indexes with justification
- Suggests query rewrites
- Provides optimization techniques
- Returns structured analysis

## Prerequisites

- Node.js 18+
- Anthropic API Key
- Completed the demo (Email Etiquette Skill)

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```bash
ANTHROPIC_API_KEY=your-api-key-here
```

## Tasks

### 1. Define the Skill's Expertise Area

In your SKILL.md, clearly describe:
- SQL optimization expertise scope
- Query analysis capabilities
- Index recommendation abilities
- What this skill can and cannot do

### 2. List Capabilities

- Detecting anti-patterns (SELECT *, N+1, missing WHERE)
- Index recommendations with justification
- Query rewriting for performance
- Join optimization
- Subquery optimization
- Explain plans (conceptual)

### 3. Document Analysis Criteria

**Performance Anti-Patterns:**
- SELECT * instead of specific columns
- Missing WHERE clauses on large tables
- N+1 query problems in loops
- Missing indexes on frequently filtered columns
- Inefficient JOINs
- Subqueries that should be JOINs
- Functions on indexed columns

**Optimization Techniques:**
- Specific column selection
- Proper index usage
- JOIN optimization
- Subquery to JOIN conversion
- WHERE clause optimization
- LIMIT/OFFSET pagination improvements

### 4. Define Red Flags

- SELECT * on tables with >10 columns
- Queries scanning >100k rows without indexes
- Multiple sequential queries that could be one JOIN
- LIKE '%pattern%' (non-prefix wildcard)
- Functions on filtered columns: `WHERE YEAR(date) = 2024`

### 5. Specify Output Format

```json
{
  "issues": [
    {
      "line": 1,
      "type": "anti-pattern",
      "severity": "high",
      "description": "SELECT * used",
      "impact": "Fetches unnecessary columns"
    }
  ],
  "indexRecommendations": [
    {
      "table": "users",
      "columns": ["email"],
      "reason": "Frequently filtered column"
    }
  ],
  "optimizedQuery": "SELECT id, name FROM users WHERE...",
  "estimatedImprovement": "10x faster with index"
}
```

### 6. Provide Examples

Include examples of:
- Bad query with issues identified
- Optimized version with explanation
- Index recommendations with rationale

### 7. Test the Skill

Use the provided test agent to:
- Invoke the skill on sample queries
- Verify anti-pattern detection
- Confirm recommendations are actionable

## Running the Exercise

```bash
npm start
```

## Project Structure

```
exercise/
├── .claude/
│   └── skills/
│       └── sql-optimization/
│           └── SKILL.md        # Your skill definition
├── src/
│   └── index.ts                # Test agent
├── queries/                    # Sample SQL queries
├── package.json
└── README.md
```

## Sample Queries to Test

```sql
-- Anti-pattern: SELECT *
SELECT * FROM orders WHERE status = 'pending';

-- Anti-pattern: N+1 query
SELECT * FROM users;
-- Then for each user: SELECT * FROM orders WHERE user_id = ?

-- Anti-pattern: Function on indexed column
SELECT * FROM events WHERE YEAR(created_at) = 2024;
```

## Key Takeaway

Well-crafted skills provide deep, reusable expertise. Include clear criteria, examples, and output formats. Skills should be detailed enough to provide consistent, high-quality guidance across different agents and use cases.

## Deliverable

A complete SKILL.md file at `.claude/skills/sql-optimization/SKILL.md` with:
- Expertise definition
- Capabilities list
- Anti-patterns documentation
- Optimization techniques
- Output format specification
- Before/after examples

Test agent must successfully identify issues in provided SQL queries.
