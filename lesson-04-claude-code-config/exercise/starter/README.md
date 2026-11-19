# Exercise: Configure Claude Code for Support Ticket System

## Objective

Configure Claude Code for the intelligent support ticket routing system from Lesson 03. Create a complete `.claude/` folder with CLAUDE.md, a subagent, and a skill.

## Learning Goals

- Write CLAUDE.md with YAML frontmatter and project instructions
- Create a specialized subagent with tool restrictions and model selection
- Define a skill that teaches Claude domain-specific knowledge
- Understand when to use CLAUDE.md vs subagents vs skills

## Project Structure

```
exercise/starter/
├── .claude/
│   ├── CLAUDE.md                          # TODO: Complete
│   ├── agents/
│   │   └── ticket-analyzer.md             # TODO: Complete
│   └── skills/
│       └── ticket-classification/
│           └── SKILL.md                   # TODO: Complete
├── sample-tickets/
│   ├── technical.txt                      # Provided -- enterprise API errors
│   ├── billing.txt                        # Provided -- invoice question
│   └── general.txt                        # Provided -- CSV export question
└── README.md
```

## Authentication Setup

In Vocareum workspace, `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` are **already configured** -- no setup needed.

For local development:

```bash
export ANTHROPIC_API_KEY=your-key-here
```

## Your Tasks

### Step 1: Complete `.claude/CLAUDE.md`

Fill in every TODO section:

- [ ] Add project description in YAML frontmatter
- [ ] List available tools (bash, read, grep, glob)
- [ ] Write project overview explaining the support system
- [ ] Document the architecture (subagents and skills)
- [ ] Add usage examples showing how to analyze tickets
- [ ] Include SLA requirements (Enterprise: <1 hour, Standard: <4 hours)

Reference: `demo/.claude/CLAUDE.md`

### Step 2: Complete `.claude/agents/ticket-analyzer.md`

- [ ] Fill in YAML frontmatter (name, description, tools, model)
- [ ] Choose appropriate tools (Read, Grep, Glob) and model (Haiku recommended)
- [ ] Write analysis process steps (extract info, determine urgency, categorize, route)
- [ ] Define JSON output format

Reference: `demo/.claude/agents/web-researcher.md`

### Step 3: Complete `.claude/skills/ticket-classification/SKILL.md`

- [ ] Fill in YAML frontmatter (name, description, allowed-tools)
- [ ] Create classification matrix (urgency levels and criteria)
- [ ] List urgency keywords for each level
- [ ] Define category classification rules (technical, billing, general)
- [ ] Provide at least 3 classification examples

Reference: `demo/.claude/skills/company-analysis/SKILL.md`

### Step 4: Test Your Configuration

```bash
# Analyze a technical ticket (should be HIGH urgency)
claude "Analyze the ticket in sample-tickets/technical.txt"

# Analyze a billing ticket (should be MEDIUM urgency)
claude "Analyze the ticket in sample-tickets/billing.txt"

# Analyze a general ticket (should be LOW urgency)
claude "Analyze the ticket in sample-tickets/general.txt"

# Classify all tickets at once
claude "Classify all tickets in sample-tickets/ and route appropriately"
```

## Classification Reference

| Urgency | Response Time | Criteria |
|---------|--------------|----------|
| **URGENT** | Immediate | System down, security breach, data loss |
| **HIGH** | < 1 hour | Core feature broken, enterprise customer |
| **MEDIUM** | < 4 hours | Feature degraded, workaround available |
| **LOW** | < 24 hours | Questions, minor bugs, feature requests |

**Categories:** Technical (errors, API, integrations) | Billing (payments, invoices, subscriptions) | General (how-to, account settings, feature inquiries)

**Routing:** Engineering (technical) | Finance (billing) | Support (general) | Escalation (URGENT or SLA breach)

## Success Criteria

- [ ] CLAUDE.md has valid YAML frontmatter with description, tools, and usage examples
- [ ] ticket-analyzer.md has name, description, tools (Read/Grep/Glob), model (Haiku), and JSON output format
- [ ] SKILL.md has classification matrix, urgency keywords, category rules, and 3+ examples
- [ ] Technical ticket classifies as HIGH urgency, technical category, engineering routing
- [ ] Billing ticket classifies as MEDIUM urgency, billing category, finance routing
- [ ] General ticket classifies as LOW urgency, general category, support routing
