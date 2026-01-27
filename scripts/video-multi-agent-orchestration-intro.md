# Video: Introduction to Multi-Agent Orchestration
*Module 10.1 | Topic: Multi-Agent Orchestration*

---

## Opening Hook

> *"One agent is powerful. Multiple agents working together? That's where real complexity gets solved. A researcher gathers data, an analyzer finds patterns, a summarizer creates the report—each specialist doing what they do best. But how do you coordinate them? When should they run in sequence vs parallel? How do you handle state between agents? Welcome to multi-agent orchestration."*

---

## Key Discussion Points

1. **Why multi-agent systems?**
   - Single agents have limits: context windows, specialized knowledge, task complexity
   - Multi-agent = divide and conquer for AI
   - Each agent can be optimized for its role (different models, tools, prompts)
   - Complex workflows emerge from simple, focused agents
   - Real-world analogy: A company has specialists, not one person doing everything

2. **Subagent architecture**
   - **Orchestrator**: The coordinator that decides which agents to invoke
   - **Subagents**: Specialized workers with focused responsibilities
   - Orchestrator uses the Task tool to spawn subagents
   - Each subagent has its own: prompt, tools, model selection
   - Subagents complete their task and return results to the orchestrator
   - Think: Manager delegating to team members

3. **Sequential orchestration pattern**
   - Agents run one after another in a defined order
   - Output of Agent A becomes input for Agent B
   - Use when: Steps have dependencies, order matters
   - Example workflow:
     - Researcher → gathers raw data
     - Analyzer → finds patterns in the data
     - Summarizer → creates final report
   - Pros: Clear flow, easy to debug, predictable
   - Cons: Slower, bottlenecked by each step

4. **Parallel orchestration pattern**
   - Multiple agents run simultaneously
   - Use when: Tasks are independent, speed matters
   - Example: Research three topics at once, then combine
   - Orchestrator launches multiple Task calls in one response
   - Results aggregated when all complete
   - Pros: Fast, efficient resource use
   - Cons: More complex state management, harder to debug

5. **The reviewer pattern**
   - One agent produces work, another agent reviews it
   - Catches errors, improves quality, adds oversight
   - Example:
     - Code writer agent → produces code
     - Code reviewer agent → checks for bugs, security issues
     - Writer revises based on feedback (or orchestrator decides)
   - Can be iterative: Review → revise → review again
   - Implements "checks and balances" in AI systems

6. **The competing agents pattern**
   - Multiple agents solve the same problem independently
   - Orchestrator evaluates and picks the best solution
   - Use when: Problem has multiple valid approaches
   - Example:
     - Three agents each write a solution
     - Evaluator agent scores them
     - Best one is selected (or combined)
   - Pros: Diverse solutions, higher quality output
   - Cons: Higher cost (multiple attempts), needs good evaluation

7. **Hooks: Customizing agent behavior**
   - Code that runs at specific points in agent execution
   - **Pre-hooks**: Run BEFORE an agent action (validation, logging)
   - **Post-hooks**: Run AFTER an agent action (cleanup, transformation)
   - Use cases:
     - Log all tool calls for auditing
     - Validate inputs before execution
     - Transform outputs before passing to next agent
     - Inject additional context dynamically
   - Hooks = control points in the orchestration flow

8. **State management across agents**
   - Challenge: How do agents share information?
   - **Shared context**: Pass accumulated results through orchestrator
   - **Session state**: Maintain conversation history across agents
   - **External state**: Database, files, or memory stores
   - Key decisions:
     - What does each agent need to know?
     - How much context to pass (cost vs. completeness)?
     - Where does state live (in-memory vs. persistent)?
   - State design affects cost, performance, and correctness

---

## Examples to Include

| Example | Description | Level of Detail |
|---------|-------------|-----------------|
| Orchestrator + subagents diagram | Visual of coordinator delegating to specialists | Deep dive - core mental model |
| Sequential vs parallel comparison | Side-by-side: when to use each | Deep dive - decision framework |
| Reviewer pattern flow | Producer → Reviewer → Revision cycle | Walkthrough - practical pattern |
| Competing agents diagram | Multiple solutions → Evaluation → Selection | Walkthrough - advanced pattern |
| State flow visualization | How data moves between agents | Brief - conceptual overview |

---

## What NOT to Cover

- Agent SDK implementation syntax - covered in Module 10.2
- AgentDefinition API details - covered in Module 10.2
- MCP server configuration for agents - covered in Module 9
- Specific hook implementations - advanced topic
- Error handling and retry strategies - implementation detail

---

## Additional Notes

- This is CONCEPTUAL—patterns and decision frameworks, not code
- Module 10.2 will implement a research assistant using these patterns

- The "when to use which pattern" is the key teaching:
  - Sequential: Dependencies, audit trails, debugging ease
  - Parallel: Speed, independent tasks, resource efficiency
  - Reviewer: Quality, safety, compliance requirements
  - Competing: Exploration, diverse solutions, uncertain best approach

- Connect to previous modules:
  - Module 3: "Remember the multi-agent architecture we designed? Now we orchestrate it."
  - Module 5: "The query() function with agents option enables this."
  - Module 6: "Subagents can have different tools—specialists with different equipment."

- Model selection strategy for subagents:
  - Orchestrator: Sonnet (needs to coordinate, make decisions)
  - Simple workers: Haiku (faster, cheaper, focused tasks)
  - Complex analysis: Sonnet or Opus (needs deep reasoning)
  - "Right-size each agent to its task"

- State management is often underestimated:
  - "Agents don't automatically share context"
  - "You design what information flows where"
  - "Too little context = agents make mistakes"
  - "Too much context = high cost, slow, irrelevant noise"

- Terminology:
  - "Orchestrator" - the coordinating agent
  - "Subagent" - a specialized worker agent
  - "Sequential" - one after another
  - "Parallel" - simultaneously
  - "Hook" - code that runs at specific execution points
  - "State" - information that persists across agent calls

- Analogy: "Think of orchestration like conducting an orchestra. The conductor (orchestrator) doesn't play instruments—they coordinate musicians (subagents) who each specialize in their instrument. Sometimes the strings play first, then brass joins (sequential). Sometimes everyone plays together (parallel). The sheet music and conductor's memory is the shared state."

- Real-world applications:
  - Research: Gather → Analyze → Summarize
  - Code review: Write → Review → Revise
  - Customer support: Classify → Route → Respond → Verify
  - Content creation: Research → Draft → Edit → Format

- Preview for Module 10.2: "In the next module, you'll build a research assistant that uses the orchestrator pattern with researcher, analyzer, and summarizer subagents—seeing sequential and parallel execution in action."

---
