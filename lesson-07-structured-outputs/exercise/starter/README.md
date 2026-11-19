# Exercise: Structured Outputs - Meeting Notes Analyzer

## Objective

Complete `src/meeting-analyzer.ts` to implement `analyzeMeeting()`, which uses the Claude Agent SDK with structured outputs to extract action items, decisions, and participants from meeting transcripts.

## Learning Goals

- Define nested Zod schemas with `.describe()` for LLM guidance
- Convert Zod schemas to JSON Schema using `zodToJsonSchema()`
- Use `outputFormat` in `query()` to enforce structured responses
- Validate and parse structured output with Zod

## Project Structure

```
starter/
├── src/
│   ├── index.ts              # Test runner (do not modify)
│   ├── meeting-analyzer.ts   # Your implementation (has TODOs)
│   └── sample-transcripts.ts # Test transcripts
├── .env.example
├── package.json
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

Complete the TODOs in `src/meeting-analyzer.ts`:

### TODO 1-3: Add `.describe()` to schema fields

The schemas are already defined but the fields are missing `.describe()` calls. Add descriptions to each field so the LLM knows what to extract:

```typescript
// Before (placeholder):
task: z.string(),

// After:
task: z.string().describe("The task to be completed"),
```

Do this for all fields in `ActionItemSchema`, `DecisionSchema`, and `MeetingAnalysisSchema`.

### TODO 4: Convert to JSON Schema

`MeetingAnalysisJSONSchema` is already set up with `zodToJsonSchema()` — just verify it uses `{ $refStrategy: "root" }` to flatten nested schemas.

### TODO 5: Add `outputFormat` to `query()`

Inside the `query()` call, add the `outputFormat` option:

```typescript
outputFormat: {
  type: "json_schema",
  schema: MeetingAnalysisJSONSchema,
},
```

### TODO 6: Return the structured output

When the result message arrives, validate and return it:

```typescript
if (message.type === "result" && message.subtype === "success") {
  if (message.structured_output) {
    return MeetingAnalysisSchema.parse(message.structured_output);
  }
}
```

## Run

```bash
# From this directory (lesson-07-structured-outputs/exercise/starter)
npm start
```

## Success Criteria

- [ ] All 3 sample transcripts are analyzed successfully
- [ ] Each result includes `date`, `participants`, `topic`, `actionItems`, `decisions`, `summary`
- [ ] `actionItems` have `task`, `assignee`, `dueDate`, and `priority` fields
- [ ] `decisions` have `decision`, `rationale`, and `impact` fields
- [ ] No "Failed to get structured output" error thrown
