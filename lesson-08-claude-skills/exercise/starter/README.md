# Exercise: Claude Skills - JavaScript Code Reviewer

## Objective

Build an agent that reviews JavaScript files using a Claude Skill, combining skill-based analysis with structured outputs for type-safe results.

## Learning Goals

After completing this exercise, you will be able to:
1. Load Claude Skills from `.claude/skills/` using `settingSources`
2. Combine Skills with Structured Outputs for type-safe results
3. Use Zod schemas with `zodToJsonSchema()` for API compatibility
4. Handle structured output validation and errors

## Project Structure

```
starter/
├── .claude/
│   └── skills/
│       └── js-code-review/
│           └── SKILL.md        # Code review skill (provided)
├── src/
│   ├── sample-code/
│   │   ├── clean.js            # Well-written code
│   │   └── issues.js           # Code with problems
│   ├── js-reviewer.ts          # Your implementation (has TODOs)
│   └── index.ts                # Test harness (complete)
└── README.md
```

## Setup

```bash
# From repo root (shared node_modules)
npm install
```

## Authentication Setup

Copy `.env.example` to `.env` (required in all environments):
```bash
cp .env.example .env
```

In Vocareum workspace, `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` are **already configured** in your environment — the `.env` file only needs to provide `ANTHROPIC_MODEL`.

For local development, also uncomment and fill in your credentials in `.env`:
```
ANTHROPIC_API_KEY=your-key-here
ANTHROPIC_BASE_URL=your-base-url-here
```

**Troubleshooting:**
- **`Error: ANTHROPIC_MODEL is not set`** — make sure you ran `cp .env.example .env`
- **`Error: API key not found`** — in Vocareum this is pre-configured; locally, set `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` in `.env`

## Your Tasks

Complete the TODOs in `src/js-reviewer.ts`:

### TODO 1: Define Zod Schemas

Create schemas for structured output:

```typescript
const CodeIssueSchema = z.object({
  line: z.number().describe("Line number where issue was found"),
  severity: z.enum(["error", "warning", "info"]).describe("..."),
  // ... add remaining fields
});

const CodeReviewResultSchema = z.object({
  filename: z.string().describe("Name of the reviewed file"),
  // ... add remaining fields
});
```

### TODO 2: Convert to JSON Schema

Use `zodToJsonSchema` with `$refStrategy: "root"` to properly inline $ref definitions:

```typescript
type JsonSchema = Record<string, unknown>;
const toJsonSchema = (schema: z.ZodTypeAny): JsonSchema =>
  zodToJsonSchema(schema, { $refStrategy: "root" }) as JsonSchema;

const CodeReviewJSONSchema = toJsonSchema(CodeReviewResultSchema);
```

### TODO 3: Create the Review Prompt

Write a prompt that instructs Claude to:
- Read the JavaScript file at the given path
- Use the js-code-review skill to analyze it
- Return structured results

### TODO 4: Implement reviewJavaScriptFile()

Use the async generator pattern with Skills:

```typescript
for await (const message of query({
  prompt: reviewPrompt(filePath),
  options: {
    cwd: PROJECT_ROOT,              // Required for skill discovery
    settingSources: ["project"],    // Load skills from .claude/skills/
    model,
    allowedTools: ["Skill", "Read", "Grep", "Glob"],
    outputFormat: {
      type: "json_schema",
      schema: CodeReviewJSONSchema,
    },
  },
})) {
  // Handle message types...
}
```

## Run

```bash
# From this directory (lesson-08-claude-skills/exercise/starter)
npm start
```

## Success Criteria

When complete, running `npm start` should output:
- File name being reviewed
- Quality score (0-100)
- List of issues with line numbers, severity, and suggestions
- Recommendations for improvement
