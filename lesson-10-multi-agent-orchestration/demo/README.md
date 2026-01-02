# Demo: Multi-Agent Orchestration - Research Assistant

Coordinate specialized subagents for comprehensive research.

## Scenario

A research assistant needs to investigate topics thoroughly. Instead of one generalist agent, we use three specialists coordinated by an orchestrator:
- **Researcher**: Gathers information using web search
- **Analyzer**: Finds patterns and insights in data
- **Summarizer**: Creates final reports

## Project Structure

```
demo/
├── src/
│   ├── research-orchestrator.ts  # Exported function (deliverable)
│   └── index.ts                  # Test
└── README.md
```

## Setup

```bash
npm install
```

Create `.env`:
```
ANTHROPIC_API_KEY=your-key-here
```

## Run

```bash
npm start
```

## Deliverable: research-orchestrator.ts

```typescript
export async function conductResearch(
  topic: string
): Promise<ResearchResult>
```

## Key Pattern: Subagents

```typescript
// Define subagents inline
const subagents = {
  researcher: {
    description: "Research specialist that gathers information",
    prompt: "You are a research specialist...",
    tools: ["WebSearch"],
    model: "sonnet",
  },
  analyzer: {
    description: "Analysis specialist that finds patterns",
    prompt: "You are a data analysis specialist...",
    tools: [],
    model: "sonnet",
  },
  summarizer: {
    description: "Summarization specialist that creates reports",
    prompt: "You are a summarization specialist...",
    tools: [],
    model: "haiku",
  },
};

// Orchestrator invokes subagents via Task tool
for await (const message of query({
  prompt: orchestratorPrompt,
  options: {
    allowedTools: ["Task"],  // Required for subagent invocation
    agents: subagents,       // Register subagents
    maxTurns: 15,
  },
})) { ... }
```

## Architecture

```
USER REQUEST: "Research [topic]"
     ↓
ORCHESTRATOR (allowedTools: ["Task"])
     ↓
     ├─→ researcher (WebSearch) ─→ Findings ─┐
     ├─→ analyzer ───────────────→ Insights ─┤
     └─→ summarizer ─────────────→ Summary ──┤
                                              ↓
                                        FINAL REPORT
```

## Orchestration Patterns

| Pattern | Description | Use When |
|---------|-------------|----------|
| Sequential | A → B → C | Each agent needs previous output |
| Parallel | A + B + C → Combine | Tasks are independent |
| Hybrid | (A + B) → C | Mix of both |

## Key Takeaway

Use the `agents` parameter in `query()` to define subagents, then give the orchestrator `Task` in `allowedTools` so it can invoke them. Each subagent has its own description, prompt, tools, and model.
