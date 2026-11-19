# Demo: Claude Skills - Multi-Skill Email Analysis

## Scenario

Your team reviews emails but lacks consistent quality standards. Build an agent that uses **two skills** to analyze emails:
1. **email-etiquette**: Tone, structure, clarity, and professionalism
2. **communication-style**: Assertive, passive, aggressive, or passive-aggressive patterns

## Project Structure

```
demo/
├── .claude/
│   └── skills/
│       ├── email-etiquette/
│       │   └── SKILL.md        # Email review skill
│       └── communication-style/
│           └── SKILL.md        # Communication style skill
├── src/
│   ├── email-reviewer.ts       # Exported function (deliverable)
│   ├── sample-emails.ts        # Test emails
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
# From this directory (lesson-08-claude-skills/demo)
npm start
```

## What You'll See

- An email is analyzed using both the **email-etiquette** and **communication-style** skills
- Structured output includes tone assessment, communication style, quality score, specific issues with severity, and strengths
- If the score is below 80, a revised version of the email is suggested

## Key Takeaway

Skills extend Claude with reusable, domain-specific expertise. Store multiple skills in `.claude/skills/` subdirectories, and Claude autonomously discovers and selects the relevant ones based on each skill's `description` frontmatter. Combined with structured outputs, skills provide consistent, type-safe analysis across agents.
