# Solution: Claude Skills - JavaScript Code Reviewer

## Project Structure

```
solution/
├── .claude/
│   └── skills/
│       └── js-code-review/
│           └── SKILL.md        # Code review skill
├── src/
│   ├── sample-code/
│   │   ├── clean.js            # Well-written code
│   │   └── issues.js           # Code with problems
│   ├── js-reviewer.ts          # Exported function (deliverable)
│   └── index.ts                # Test harness
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

## Run

```bash
# From this directory (lesson-08-claude-skills/exercise/solution)
npm start
```

## What You'll See

- The agent reviews `issues.js` using the **js-code-review** skill
- Structured output includes filename, quality score, summary, a list of issues (with line numbers, severity, category, and suggestions), and recommendations
- Issues are categorized as quality, bug, security, performance, or style with error/warning/info severity

## Key Takeaway

Skills extend Claude with reusable expertise. Use `settingSources: ["project"]` to load skills from `.claude/skills/` and the `Skill` tool to apply them. Combined with structured outputs and Zod validation, this pattern provides consistent, type-safe code reviews across projects.
