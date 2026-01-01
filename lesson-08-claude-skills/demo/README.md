# Email Etiquette Skill

Create a Claude Skill that encapsulates domain expertise for email review.

## Overview

In this demo, we'll create a Claude Skill that encapsulates domain expertise, store it in `.claude/skills/`, and show how agents invoke it using the Skill tool. Skills provide reusable, consistent expertise across your agent system.

## Scenario

Your team reviews dozens of emails daily but lacks consistent quality standards. Some are too formal, some too casual. We'll create an "email-etiquette" skill that provides expertise on professional email communication.

## What You'll Learn

- What Claude Skills are (reusable expertise modules)
- When to create a skill vs. inline prompts
- SKILL.md structure and best practices
- How agents invoke skills via the Skill tool
- Organizing skills for maintainability

## Prerequisites

- Node.js 18+
- Anthropic API Key
- Completed Lesson 07 (Structured Outputs)

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```bash
ANTHROPIC_API_KEY=your-api-key-here
```

## Running the Demo

```bash
npm start
```

## Project Structure

```
demo/
├── .claude/
│   └── skills/
│       └── email-etiquette/
│           └── SKILL.md
├── src/
│   └── index.ts
├── package.json
└── README.md
```

## Key Concepts

### When to Use Skills

**Use Skills when:**
- Multiple agents need the same expertise
- Knowledge is complex and detailed
- You want consistency across agents
- Expertise needs version control

**Use inline prompts when:**
- Agent-specific instructions
- Simple, one-off guidance
- Changing frequently

### SKILL.md Structure

```markdown
# Email Etiquette Skill

## Expertise
Professional email communication for business contexts.

## Capabilities
- Assesses email tone (too casual, too formal, appropriate)
- Identifies clarity and structure issues
- Checks for common mistakes

## Analysis Criteria

### Tone Assessment
**Too Casual:** Slang, emojis, fragments
**Too Formal:** Legal language, jargon
**Appropriate:** Clear, respectful, complete

### Structure Checklist
- [ ] Clear subject line
- [ ] Appropriate greeting
- [ ] Purpose in first 1-2 sentences
- [ ] Professional sign-off

## Output Format
{
  "tone": "appropriate" | "too-casual" | "too-formal",
  "issues": [...],
  "score": number,
  "revisedEmail": string
}

## Examples
[Include before/after examples]
```

### Using Skills in an Agent

```typescript
const emailReviewer: AgentDefinition = {
  name: 'email-reviewer',
  description: 'Reviews emails for professionalism',
  prompt: `Use the email-etiquette skill to analyze emails.`,
  allowedTools: ['Skill'],
  model: 'claude-sonnet-4-5-20250929'
};

const result = await query(
  'Review this email: "hey need that report thx"',
  {
    agents: [{ name: 'email-reviewer', definition: emailReviewer }],
    allowedTools: ['Skill'],
    settingSources: ['project']  // Loads .claude/skills/
  }
);
```

## Key Takeaway

Claude Skills encapsulate reusable domain expertise in `.claude/skills/[name]/SKILL.md` files. Skills provide consistent guidance across multiple agents. Use skills for complex, reusable knowledge. Agents access skills via the Skill tool automatically.
