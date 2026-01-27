# Video: Agentic System Design Fundamentals
*Module 3.1 | Topic: Introduction to Agentic System Design*

---

## Opening Hook

> *"Claude can answer simple questions, but can it research a company, check three different websites, cross-reference the data, and compile a report—all on its own? That's the difference between generative AI and agentic AI. One answers. The other ACTS. Let's understand what makes an AI system truly agentic. And how to make Claude do both"*

---

## Key Discussion Points

1. **Generative AI vs Agentic AI**
   - Generative AI: Prompt → Response (single turn, passive)
   - Agentic AI: Goal → Plan → Execute → Observe → Iterate (multi-turn, active)
   - Key difference: Agentic systems make DECISIONS about what to do next
   - Generative = "Here's the answer" | Agentic = "Let me figure this out"

2. **The perception-reasoning-action-feedback cycle**
   - **Perception**: Agent observes current state (reads data, checks results)
   - **Reasoning**: Agent decides what to do next (plans, prioritizes)
   - **Action**: Agent executes a step (calls tool, makes request)
   - **Feedback**: Agent observes the result and updates its understanding
   - This cycle LOOPS until the goal is achieved
   - The agent controls the workflow, not the programmer

3. **Agent architecture fundamentals**
   - Core components: Goal, Tools, Memory, Reasoning engine
   - **Goal**: What the agent is trying to accomplish
   - **Tools**: Capabilities the agent can use (search, read, write, fetch)
   - **Memory**: Context from previous steps in the loop
   - **Reasoning**: The LLM that decides what to do next

4. **The mentorship model (human-agent collaboration)**
   - Agents aren't fully autonomous—they work WITH humans
   - **Delegation**: Human assigns task, agent executes
   - **Supervision**: Human can observe, intervene, correct
   - **Escalation**: Agent asks for help when uncertain
   - Think: Junior developer with a senior mentor, not a robot replacement

5. **Planning and execution patterns**
   - **Single-agent**: One agent does everything sequentially
   - **Multi-agent**: Specialized agents work in parallel (preview of Module 10)
   - **Hierarchical**: Orchestrator delegates to sub-agents
   - Planning matters: An agent that plans before acting outperforms one that doesn't

6. **When agentic systems make sense**
   - Tasks with multiple steps that depend on intermediate results
   - Research and information gathering from multiple sources
   - Complex workflows that would be tedious for humans
   - Situations where iteration improves the outcome
   - NOT for: Simple Q&A, single-turn tasks, real-time responses

---

## Examples to Include

| Example | Description | Level of Detail |
|---------|-------------|-----------------|
| Generative vs Agentic comparison | Same task: "Research Acme Corp" - show the difference | Deep dive - core teaching moment |
| Perception-reasoning-action-feedback diagram | Visual of the loop with concrete example | Deep dive - foundational concept |
| Tool examples | What kinds of tools agents can use (search, read, execute) | Walkthrough - make it concrete |
---

## What NOT to Cover

- Specific tool implementations or any impelemntation - covered in Module 6
- Multi-agent orchestration details - covered in Module 10
- MCP servers - covered in Module 9

---

## Additional Notes

- The company research example works well:
  - Non-agentic: "Tell me about Acme Corp" → Single response from training data
  - Agentic: "Research Acme Corp" → Searches web, reads pages, compiles report

- Key mental shift to drive home:
  - Traditional programming: Developer writes the workflow
  - Agentic AI: Developer defines tools and goals, AI figures out the workflow

- The mentorship model is CRITICAL:
  - Avoids the "AI will replace us" fear
  - Sets realistic expectations (agents need guidance)
  - Establishes the human-in-the-loop principle

- Terminology to establish:
  - "Agent" - an AI system that can take actions
  - "Tool" - a capability an agent can use
  - "Agentic loop" - the perception-reasoning-action-feedback cycle
  - "Orchestrator" - an agent that coordinates other agents

- Analogy: "An agent is like a new employee. You give them a goal, show them what tools they can use, and they figure out how to get it done. They might ask questions, try different approaches, and iterate until they succeed. They're not following a script—they're problem-solving."

- Preview for Module 3.2: "In the next module, you'll design an architecture for a company research system using these principles."

---
