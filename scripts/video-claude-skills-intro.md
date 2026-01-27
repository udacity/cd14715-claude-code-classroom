# Video: Introduction to Claude Skills
*Module 8.1 | Topic: Claude Skills*

---

## Opening Hook

> *"Your company has specific ways of doing things—coding standards, analysis frameworks, communication guidelines. Every time you work with Claude, you re-explain these. What if Claude could just... know them? Claude Skills let you package domain expertise into reusable knowledge modules. Teach once, apply everywhere."*

---

## Key Discussion Points

1. **What are Claude Skills?**
   - Reusable knowledge modules that teach Claude domain expertise
   - NOT code—markdown files with structured knowledge
   - Claude "learns" methodologies, standards, frameworks from skills
   - Skills get injected into context when relevant
   - Think: Training manuals for AI, not functions for AI to call

2. **Skills vs tools: A crucial distinction**
   - **Tools**: Functions Claude CALLS to DO things (actions)
   - **Skills**: Knowledge Claude USES to THINK (expertise)
   - Tool: `calculate_tax(amount)` → returns a number
   - Skill: "How our company evaluates code quality" → informs analysis
   - Tools extend capabilities; skills extend knowledge

3. **The SKILL.md structure**
   - Skills live in `.claude/skills/[skill-name]/SKILL.md`
   - Two parts:
     - **YAML frontmatter**: Metadata (name, description, triggers)
     - **Markdown body**: The actual knowledge content
   - The description tells Claude WHEN to apply this skill
   - The body teaches Claude HOW to apply the expertise

4. **Skills ecosystem: Public vs private**
   - **Private skills**: Your organization's proprietary knowledge
     - Coding standards, review criteria, analysis frameworks
     - Lives in your repo's `.claude/` folder
     - Version controlled, team-specific
   - **Public skills**: Shared community knowledge
     - Open source best practices, language idioms
     - Reusable across projects and teams
   - Same format, different distribution

5. **Enterprise customization capabilities**
   - Standardize AI behavior across teams
   - Encode company-specific methodologies
   - Ensure consistent outputs (reports, analyses, reviews)
   - Onboard new team members: "Claude already knows our standards"
   - Compliance and governance: Documented, auditable AI behavior

6. **Skill distribution patterns**
   - **Per-project**: Skill in `.claude/skills/` in that repo
   - **Per-organization**: Shared repo of skills, referenced across projects
   - **Inheritance**: Project skills can extend organization skills
   - Skills can be composed: Multiple skills active simultaneously
   - Distribution is just file management—no special infrastructure

7. **When to create skills**
   - Repeated explanations: "We always do X this way"
   - Domain expertise: Industry knowledge, company processes
   - Quality standards: What "good" looks like in your context
   - Methodologies: Step-by-step approaches to common tasks
   - NOT for: One-time instructions, simple preferences, tool logic

---

## Examples to Include

| Example | Description | Level of Detail |
|---------|-------------|-----------------|
| Skills vs tools comparison | Side-by-side: What each does | Deep dive - foundational distinction |
| SKILL.md anatomy | Frontmatter + body breakdown | Walkthrough - the format |
| Skill triggering | How description determines when skill applies | Walkthrough - key mechanism |
| Enterprise use cases | Code review standards, analysis frameworks | Brief - inspiration |
| Public vs private | When to share vs keep proprietary | Brief - decision framework |

---

## What NOT to Cover

- Skills with structured outputs - covered later in Module 8
- Implementation and coding - covered in Module 8.2
- CLAUDE.md configuration details - covered in Module 4.2
- MCP integration with skills - advanced topic
- Skill testing and validation - implementation detail

---

## Additional Notes

- This is CONCEPTUAL—students should understand the architecture before creating skills
- Module 8.2 will have them build email analysis skills with structured outputs

- The tools vs skills distinction is the KEY concept:
  - Analogy: "Tools are like hands—they DO things. Skills are like training—they inform HOW things are done."
  - Common misconception: Thinking skills are just fancy prompts (they're structured knowledge)

- Why skills matter for enterprises:
  - Consistency: Every engineer gets the same AI expertise
  - Scalability: Teach once, benefit everywhere
  - Governance: Documented, version-controlled AI behavior
  - Onboarding: New hires inherit institutional knowledge

- Connect to Module 4 (Claude Code Config):
  - "Remember the .claude folder? Skills live there."
  - "Module 4 introduced the folder structure, now we go deep on skills."

- The "description" field is crucial:
  - "This is how Claude knows WHEN to use the skill"
  - "Vague description = skill never triggers (or triggers wrongly)"
  - "Specific description = skill applies precisely when needed"

- Terminology:
  - "Skill" - a reusable knowledge module
  - "SKILL.md" - the file that defines a skill
  - "Frontmatter" - YAML metadata at the top of the file
  - "Trigger" - the condition that activates a skill (based on description)
  - "Injection" - when skill knowledge gets added to Claude's context

- Analogy: "Think of skills like reference books on Claude's desk. The description is the book's title and spine—it tells Claude when to reach for that book. The body is the content inside—the actual expertise Claude consults."

- Address the question: "Why not just put this in the system prompt?"
  - System prompts: Always active, limited space, one blob
  - Skills: Conditional activation, modular, composable
  - Skills = structured, maintainable, scalable knowledge management

- Preview for Module 8.2: "In the next module, you'll create skills for email analysis—teaching Claude your organization's communication standards and having it return structured assessments."

---
