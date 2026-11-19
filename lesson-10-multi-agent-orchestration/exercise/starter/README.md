# Exercise: Multi-Agent Orchestration - Sales Opportunity Qualifier

## Objective

Complete `src/sales-qualifier.ts` to implement `qualifyOpportunity()`, which uses an orchestrator agent to coordinate three specialized subagents (researcher, analyzer, scorer) and produce a structured sales briefing.

## Learning Goals

- Define subagents with `AgentDefinition` (description, prompt, tools, model)
- Use the async generator input mode for streaming compatibility
- Give the orchestrator `Task` in `allowedTools` to invoke subagents
- Combine multi-agent output with structured outputs via Zod

## Project Structure

```
starter/
├── src/
│   ├── sales-qualifier.ts    # Your implementation (has TODOs)
│   ├── sample-prospects.ts   # Test data (provided)
│   └── index.ts              # Test runner (do not modify)
├── .env.example              # Environment template
├── package.json
└── README.md
```

## Setup

```bash
# From repo root (shared node_modules)
npm install
```

## Authentication Setup

Copy `.env.example` to `.env` (required in all environments):
```bash
cp .env.example .env
```

In Vocareum workspace, `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` are **already configured** in your environment — the `.env` file only needs to provide `ANTHROPIC_MODEL`.

For local development, also uncomment and fill in your credentials in `.env`:
```
ANTHROPIC_API_KEY=your-key-here
ANTHROPIC_BASE_URL=your-base-url-here
```

**Troubleshooting:**
- **`Error: ANTHROPIC_MODEL is not set`** — make sure you ran `cp .env.example .env`
- **`Error: API key not found`** — in Vocareum this is pre-configured; locally, set `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` in `.env`

## Your Tasks

Complete the four TODOs in `src/sales-qualifier.ts`:

### TODO 1: Implement `generateMessages()` async generator

Yield a single user message object with `type`, `message`, `parent_tool_use_id`, and `session_id` fields. See the demo's `research-orchestrator.ts` for the pattern.

### TODO 2: Fill in the subagent definitions

Each subagent in the `subagents` object needs a `description` and `prompt`. The structure is already in place — add meaningful values for each agent's role:

- `"company-researcher"`: Needs a description and prompt about gathering company intelligence (size, industry, tech stack, news). Also needs the right tool.
- `"competitive-analyzer"`: Needs a description and prompt about analyzing competitive positioning.
- `"qualification-scorer"`: Needs a description and prompt about assessing BANT criteria (Budget, Authority, Need, Timeline).

### TODO 3: Call `query()` with subagents

Wire up the `query()` call with:
- `prompt`: Use the async generator with the orchestrator prompt
- `allowedTools`: `["Task"]` so the orchestrator can invoke subagents
- `agents`: Pass the subagents record
- `outputFormat`: Use `json_schema` with `SalesBriefingJSONSchema`
- `maxTurns`: 15

### TODO 4: Handle the message stream

Inside the `for await` loop:
- Log Task tool invocations when `block.type === "tool_use"` and `block.name === "Task"`
- Return `SalesBriefingSchema.parse(message.structured_output)` when the result is a success

## Run

```bash
# From this directory (lesson-10-multi-agent-orchestration/exercise/starter)
npm start
```

## Success Criteria

- [ ] All 3 sample prospects are qualified (TechCorp, GrowthStartup, LocalBiz)
- [ ] Each briefing includes `companyProfile`, `competitiveAnalysis`, `qualification`, `recommendation`, `talkingPoints`
- [ ] Task tool invocations are logged showing subagent calls
- [ ] TechCorp -> "Pursue", GrowthStartup -> "Nurture" or "Pursue", LocalBiz -> "Pursue"
