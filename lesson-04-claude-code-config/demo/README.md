# Demo: Configuring Claude Code for Multi-Agent Research

Translate the company research architecture from Lesson 03 into a working `.claude/` configuration with CLAUDE.md, subagents, and skills.

## Scenario

You are building an AI-powered company research assistant. Instead of writing application code, you configure Claude Code with specialized subagents (web-researcher, people-finder) and a skill (company-analysis) so that a single prompt like `claude "Research Anthropic"` produces a comprehensive report.

## Project Structure

```
demo/
├── .claude/
│   ├── CLAUDE.md                          # Main project configuration
│   ├── agents/
│   │   ├── web-researcher.md              # Subagent: company & product research
│   │   └── people-finder.md               # Subagent: leadership research
│   └── skills/
│       └── company-analysis/
│           └── SKILL.md                   # Skill: research methodology
├── src/
│   └── example.ts                         # Sample code for review demos
└── README.md
```

## Setup

This demo is read-only -- there is no `package.json` and nothing to install. Open the `.claude/` folder and explore the configuration files.

## Authentication Setup

In Vocareum workspace, `ANTHROPIC_API_KEY`, `ANTHROPIC_BASE_URL`, and other required variables are **already configured** -- no setup needed.

For local development:

```bash
export ANTHROPIC_API_KEY=your-key-here
export ANTHROPIC_BASE_URL=your-base-url-here
```

## Run

This demo has no runnable code. If you were running Claude Code in this directory:

```bash
claude "Research Anthropic"
```

Claude would read CLAUDE.md, activate the company-analysis skill, delegate to the web-researcher and people-finder subagents, and combine their results into a structured report.

## What You'll See

- **CLAUDE.md** -- YAML frontmatter sets project description, tools, and system instructions that apply to every conversation.
- **Subagents** (`agents/*.md`) -- Each has its own name, description, tools, and model. Claude spawns them for focused tasks with separate context.
- **Skill** (`skills/company-analysis/SKILL.md`) -- Teaches Claude a research methodology that it automatically applies when the user asks to research a company.

## Key Takeaway

Configuration lives entirely in `.claude/` Markdown files. CLAUDE.md is the project-level setup, subagents handle specialized tasks with restricted tools, and skills teach domain knowledge that Claude applies automatically. This is the implementation side of the architecture you designed in Lesson 03.
