# Exercise: Claude Skills - JavaScript Code Reviewer

Build an agent that reviews JavaScript files using a Claude Skill.

## Scenario

Your team needs consistent code reviews across projects. Build an agent that uses a JavaScript code review skill to analyze files for quality issues, bugs, and security vulnerabilities.

## Project Structure

```
exercise/
├── .claude/
│   └── skills/
│       └── js-code-review/
│           └── SKILL.md        # Code review skill
├── src/
│   ├── sample-code/
│   │   ├── clean.js            # Well-written code
│   │   └── issues.js           # Code with problems
│   ├── js-reviewer.ts          # Exported function (deliverable)
│   └── index.ts                # Test
└── README.md
```

## Setup

```bash
npm install
```

Create `.env`:
```
ANTHROPIC_API_KEY=your-key-here
```

## Run

```bash
npm start
```

## Deliverable: js-reviewer.ts

```typescript
export interface CodeReviewResult {
  filename: string;
  raw: string;
}

export async function reviewJavaScriptFile(
  filePath: string
): Promise<CodeReviewResult>
```

## Key Pattern: Using Skills with Agent SDK

```typescript
for await (const message of query({
  prompt: "Review this JavaScript file...",
  options: {
    cwd: PROJECT_ROOT,                    // Where .claude/skills/ lives
    settingSources: ["project"],          // Load skills from filesystem
    allowedTools: ["Skill", "Read", "Grep", "Glob"],
  },
})) { ... }
```

## Skill: js-code-review

The skill teaches the agent to check for:

| Category | Issues |
|----------|--------|
| Quality | `var` usage, console.log, unused variables, magic numbers |
| Bugs | Loose equality `==`, missing await, null access |
| Security | eval(), innerHTML, hardcoded secrets |
| Style | Arrow functions, destructuring, async/await |

## Key Takeaway

Skills extend Claude with reusable expertise. Use `settingSources: ["project"]` to load skills from `.claude/skills/` and the `Skill` tool to apply them. Skills can only use Read, Grep, and Glob tools.
