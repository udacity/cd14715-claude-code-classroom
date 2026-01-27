# Video: Introduction to Claude Agent SDK
*Module 5.1 | Topic: Claude Agent SDK Architecture and Core Patterns*

---

## Opening Hook

> *"You've used Claude Code interactively—typing prompts, watching it work. But what if you want to build your OWN agentic applications? The Claude Agent SDK lets you embed the same agentic capabilities into your code: programmatic control, custom workflows, and production-ready agents. Let's explore how it works under the hood."*

---

## Key Discussion Points

1. **What is the Claude Agent SDK?**
   - A library for building AI agents programmatically (Python and TypeScript)
   - Uses Claude Code as its runtime—same capabilities, different interface
   - You write code that CONTROLS the agent, not just prompts
   - Build agents that run autonomously: CI/CD pipelines, automated workflows, background jobs
   - Key difference: Claude Code = interactive tool, Agent SDK = programmatic building block

2. **The query() method: Your main entry point**
   - `query()` is how you start an agentic session
   - Takes a prompt (what you want done) and options (how to do it)
   - Returns an async iterator—streams messages as Claude works
   - The "agentic loop": Claude thinks → uses tools → observes results → decides next step
   - Loop ends when task is complete or error occurs
   - SDK handles orchestration: tool execution, context management, retries

3. **Built-in tools: What agents can do**
   - Tools are capabilities Claude can use during execution
   - You CHOOSE which tools to allow (principle of least privilege)
   - Read-only tools: `Read`, `Glob`, `Grep` — safe for analysis
   - Modification tools: `Edit`, `Write` — file changes
   - Execution tools: `Bash` — run commands
   - Web tools: `WebSearch`, `WebFetch` — internet access
   - Tool selection defines your agent's capability boundary

4. **Permission management: Controlling autonomy**
   - Three modes balance autonomy vs. oversight:
     - **`default`**: Requires approval callback—you decide what's allowed
     - **`acceptEdits`**: Auto-approves file operations, prompts for others
     - **`bypassPermissions`**: Full autonomy, no prompts (CI/CD, automation)
   - The `canUseTool` callback: Custom approval logic for `default` mode
   - Permission modes answer: "How much do I trust this agent?"
   - Production pattern: More autonomy for trusted, well-tested tasks

5. **Session management: Multi-turn context**
   - Sessions maintain conversation state across multiple queries
   - Agent "remembers" what it did previously
   - Use cases: Iterative development, debugging sessions, complex workflows
   - Session = persistent context + tool history + conversation memory
   - Without sessions: Each query starts fresh (stateless)

6. **The agentic loop pattern**
   - SDK implements the perception-reasoning-action cycle from Module 3
   - **Perception**: Claude reads files, observes tool outputs
   - **Reasoning**: Claude thinks about what to do next
   - **Action**: Claude calls tools to make changes
   - You consume the stream: reasoning text, tool calls, results
   - The loop is AUTOMATIC—you don't implement the cycle, you observe it

7. **SDK vs. Claude Code CLI: When to use which**
   - **Claude Code CLI**: Interactive work, exploration, ad-hoc tasks
   - **Agent SDK**: Automation, integration, production systems
   - Same underlying runtime—SDK gives you programmatic control
   - Think: CLI = human-in-the-loop, SDK = code-in-control

---

## Examples to Include

| Example | Description | Level of Detail |
|---------|-------------|-----------------|
| query() anatomy | Breaking down prompt + options + message stream | Deep dive - core concept |
| Tool selection table | Read-only vs modification vs execution tools | Deep dive - decision framework |
| Permission modes comparison | default vs acceptEdits vs bypassPermissions | Walkthrough - when to use each |
| Agentic loop visualization | Diagram of think → tool → observe → decide cycle | Deep dive - mental model |
| CLI vs SDK decision tree | When to use interactive vs programmatic | Brief - orientation |

---

## What NOT to Cover

- Actual code implementation (Python/TypeScript syntax) - covered in Module 5.2
- MCP server configuration - covered in Module 9
- Multi-agent orchestration patterns - covered in Module 10
- Hooks and custom callbacks - advanced topic, later modules
- Installation and setup steps - covered in Module 5.2

---

## Additional Notes

- This is CONCEPTUAL—students should understand the ARCHITECTURE before writing code
- Module 5.2 will have them implement a document summarizer using these concepts

- Key mental model: "The SDK is Claude Code's programmatic API"
  - Same tools, same capabilities
  - Different interface: code vs. terminal

- Emphasize the async iterator pattern:
  - "You don't call Claude once and get a response"
  - "You START a loop and STREAM messages as Claude works"
  - This is fundamentally different from simple API calls

- Permission management is about TRUST BOUNDARIES:
  - What CAN this agent do? (tools)
  - What SHOULD it do without asking? (permission mode)
  - This is crucial for production systems

- Connect back to Module 3 (Agentic Architecture):
  - "Remember the perception-reasoning-action cycle? The SDK implements it for you."
  - "You designed agents on paper in Module 3, configured them in Module 4, now you're building them programmatically."

- Terminology:
  - "query()" - the function that starts an agentic session
  - "agentic loop" - the cycle of thinking and acting
  - "tools" - capabilities the agent can use
  - "permission mode" - how much autonomy the agent has
  - "session" - persistent context across multiple queries

- Analogy: "Think of query() like starting a task for a contractor. You give them the job description (prompt), tell them what equipment they can use (tools), and how much oversight you want (permissions). Then you watch their work stream in as they make progress."

- Preview for Module 5.2: "In the next module, you'll build a document summarizer that uses query() to read files and generate summaries automatically."

---
