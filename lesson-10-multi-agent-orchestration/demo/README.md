# Research Orchestrator

Build a multi-agent system with coordinated specialized agents.

## Overview

In this demo, we'll build a multi-agent system with an orchestrator that coordinates three specialized agents (researcher, analyzer, summarizer). We'll explore parallel vs. sequential execution and learn how orchestrators combine results from multiple agents.

## Scenario

A research assistant needs to investigate topics thoroughly. Instead of one generalist agent, we'll use three specialists:
- **Researcher**: Gathers information from sources
- **Analyzer**: Finds patterns and insights
- **Summarizer**: Creates final reports

An orchestrator coordinates them all.

## What You'll Learn

- When to use multi-agent vs. single agent
- Orchestrator design patterns
- Parallel vs. sequential execution
- Combining results from multiple agents
- Managing agent dependencies

## Prerequisites

- Node.js 18+
- Anthropic API Key
- Completed Lesson 09 (MCP Integration)

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
├── src/
│   ├── index.ts
│   └── agents/
│       ├── researcher.ts
│       ├── analyzer.ts
│       └── summarizer.ts
├── package.json
└── README.md
```

## Key Concepts

### Multi-Agent Architecture

```
USER REQUEST: "Research AI in healthcare"
     ↓
ORCHESTRATOR AGENT
     ↓
     ├─→ RESEARCHER (web search) ──────→ Result 1 ─┐
     ├─→ ANALYZER (find patterns) ─────→ Result 2 ─┤
     └─→ SUMMARIZER (create report) ───→ Result 3 ─┤
                                                     ↓
                                               COMBINE RESULTS
                                                     ↓
                                               FINAL REPORT
```

### Define Specialized Agents

```typescript
const researcher: AgentDefinition = {
  name: 'researcher',
  description: 'Searches for comprehensive information',
  prompt: `You are a research specialist.
    1. Search for authoritative sources
    2. Gather diverse perspectives
    3. Collect relevant data and statistics`,
  allowedTools: ['WebSearch', 'WebFetch'],
  model: 'claude-sonnet-4-5-20250929'
};

const analyzer: AgentDefinition = {
  name: 'analyzer',
  description: 'Analyzes information for patterns',
  prompt: `You are a data analysis specialist.
    1. Identify key patterns and trends
    2. Find connections between data points
    3. Highlight important insights`,
  allowedTools: ['Read'],
  model: 'claude-sonnet-4-5-20250929'
};

const summarizer: AgentDefinition = {
  name: 'summarizer',
  description: 'Creates clear, concise summaries',
  prompt: `You are a summarization specialist.
    1. Distill into key points
    2. Create executive summary
    3. Highlight actionable insights`,
  allowedTools: [],
  model: 'claude-haiku-4-5-20250929'  // Faster
};
```

### Orchestrator Prompt

```typescript
const orchestratorPrompt = `You are a research orchestrator.

1. INVOKE RESEARCHER AGENT
   Use Task tool to spawn 'researcher' agent
   Wait for results

2. INVOKE ANALYZER AGENT
   Provide researcher's findings
   Wait for results

3. INVOKE SUMMARIZER AGENT
   Provide both research and analysis
   Wait for results

4. COMBINE RESULTS
   Compile into final report`;
```

### Orchestration Patterns

**Sequential** (dependencies between agents):
```
Agent1 → Output1 → Agent2 → Output2 → Agent3 → Final
Use when: Each agent needs previous results
```

**Parallel** (independent tasks):
```
     ┌─ Agent1 ─→ Output1 ─┐
Task ├─ Agent2 ─→ Output2 ─┤ → Combine → Final
     └─ Agent3 ─→ Output3 ─┘
Use when: Agents work independently
```

**Hybrid** (some parallel, some sequential):
```
     ┌─ Agent1 (Research) ──┐
Task ├─ Agent2 (Research) ──┤ → Combine → Agent4 (Synthesize) → Final
     └─ Agent3 (Research) ──┘
```

### Execute the System

```typescript
const result = await query(
  'Research the impact of AI on healthcare',
  {
    agents: [
      { name: 'researcher', definition: researcher },
      { name: 'analyzer', definition: analyzer },
      { name: 'summarizer', definition: summarizer }
    ],
    allowedTools: ['Task', 'WebSearch', 'WebFetch', 'Read'],
    prompt: orchestratorPrompt
  }
);
```

## Key Takeaway

Multi-agent systems enable specialization and parallelization. Orchestrators coordinate sub-agents using the Task tool, manage dependencies (sequential vs. parallel), and combine results. Use sequential when agents depend on each other's output, parallel when tasks are independent.
