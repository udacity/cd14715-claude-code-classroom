# Solution: Support Ticket System Configuration

Complete Claude Code configuration for the intelligent support ticket routing system from Lesson 03.

## Project Structure

```
exercise/solution/
├── .claude/
│   ├── CLAUDE.md                          # Project configuration
│   ├── settings.json                      # Permission restrictions
│   ├── agents/
│   │   ├── ticket-analyzer.md             # Subagent: fast triage (Haiku)
│   │   └── kb-searcher.md                 # Subagent: KB lookup (Haiku)
│   └── skills/
│       ├── ticket-classification/
│       │   └── SKILL.md                   # Skill: classification methodology
│       └── sla-calculation/
│           ├── SKILL.md                   # Skill: SLA deadline rules
│           └── examples.md                # SLA calculation scenarios
└── README.md
```

## Authentication Setup

In Vocareum workspace, `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` are **already configured** -- no setup needed.

For local development:

```bash
export ANTHROPIC_API_KEY=your-key-here
```

## Run

```bash
claude "Analyze the ticket in sample-tickets/technical.txt"
# Expected: HIGH urgency, technical category, engineering routing

claude "Analyze sample-tickets/billing.txt"
# Expected: MEDIUM urgency, billing category, finance routing

claude "Analyze sample-tickets/general.txt"
# Expected: LOW urgency, general category, support routing

claude "Classify all tickets in sample-tickets/ and prioritize by SLA"
```

Sample tickets are in the starter directory (`../starter/sample-tickets/`).

## What You'll See

- **CLAUDE.md** sets project description, tools, architecture, usage examples, and SLA requirements.
- **ticket-analyzer** subagent (Haiku, Read/Grep/Glob) performs fast triage and returns structured JSON with urgency, category, and routing.
- **kb-searcher** subagent (Haiku, Read/Grep) searches a knowledge base for existing solutions before routing to humans.
- **ticket-classification** skill teaches the classification matrix, urgency keywords, category rules, and includes worked examples.
- **sla-calculation** skill teaches deadline calculation with business-hours logic; `examples.md` demonstrates progressive disclosure by breaking out detailed scenarios into a linked file.
- **settings.json** restricts permissions (e.g., deny `.env` reads, deny `WebFetch`) for security.

## Key Takeaway

This solution goes beyond the minimum requirements (one subagent, one skill) to show production patterns: a second subagent for KB search, a second skill for SLA calculation with progressive disclosure, and a settings.json for permission control. Compare your starter implementation against these files to identify gaps, then extend with your own subagents and skills.
