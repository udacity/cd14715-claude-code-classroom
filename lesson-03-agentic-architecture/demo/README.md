# Demo: Designing Agentic Workflows

Learn the fundamental differences between traditional prompt-response systems and agentic systems.

## Scenario

A company wants to automate their customer research process. Instead of a single prompt ("research this company"), they need an agent that can autonomously search the web, analyze findings, follow up on interesting leads, and compile a comprehensive report.

> **Note:** This is a documentation-only lesson. No code execution is required -- just read through the concepts and study the `ARCHITECTURE.md` deliverable.

## Project Structure

```
demo/
├── ARCHITECTURE.md          # Multi-agent company research architecture
└── diagrams/
    ├── multi-agent.mmd      # Multi-agent architecture (source)
    ├── multi-agent.svg      # Multi-agent architecture (rendered)
    ├── sequence.mmd         # Sequence diagram (source)
    ├── sequence.svg         # Sequence diagram (rendered)
    ├── single-agent.mmd     # Single-agent architecture (source)
    ├── single-agent.svg     # Single-agent architecture (rendered)
    ├── workflow.mmd          # Workflow diagram (source)
    └── workflow.svg          # Workflow diagram (rendered)
```

> **Diagrams:** `ARCHITECTURE.md` displays pre-rendered SVG images from the `diagrams/` folder. To modify a diagram, edit the corresponding `.mmd` source file and re-render with `mmdc`.
>
> **Rendering Diagrams:**
> The `@mermaid-js/mermaid-cli` package is installed at the project root. From the project root directory, run:
> ```bash
> npx mmdc -i lesson-03-agentic-architecture/demo/diagrams/<name>.mmd -o lesson-03-agentic-architecture/demo/diagrams/<name>.svg
> ```
>
> Example - render the single-agent diagram:
> ```bash
> npx mmdc -i lesson-03-agentic-architecture/demo/diagrams/single-agent.mmd -o lesson-03-agentic-architecture/demo/diagrams/single-agent.svg
> ```

## What You'll See

| Concept | Description |
|---------|-------------|
| Non-Agentic vs Agentic | How autonomous tool-using agents differ from single-shot prompts |
| Single-Agent Architecture | One agent handling all research tasks sequentially |
| Multi-Agent Architecture | Specialized agents (Web Researcher, People Finder, News Analyst) running in parallel |
| Orchestration Pattern | Parallel-with-merge pattern for coordinating sub-agents |

## Key Takeaway

Design agents with clear, focused responsibilities. Use single agents for straightforward tasks and multi-agent systems when you need parallelization or specialized expertise.