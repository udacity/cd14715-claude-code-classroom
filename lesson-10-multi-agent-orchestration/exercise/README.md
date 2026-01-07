# Exercise: Multi-Agent Orchestration - Sales Opportunity Qualifier

Coordinate specialized subagents for comprehensive sales qualification.

## Scenario

Your B2B SaaS sales team receives 200+ inbound leads weekly. Build an intelligent system that uses subagents to research prospects, analyze competitive position, and assess qualification criteria automatically.

## Project Structure

```
exercise/
├── src/
│   ├── sales-qualifier.ts    # Exported function (deliverable)
│   ├── sample-prospects.ts   # Test data
│   └── index.ts              # Test
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

## Deliverable: sales-qualifier.ts

```typescript
export async function qualifyOpportunity(
  companyName: string,
  contactInfo: ContactInfo
): Promise<SalesBriefing>
```

## Key Pattern: Subagents with Structured Output

```typescript
// Define subagents inline
const subagents = {
  "company-researcher": {
    description: "Research specialist that gathers company intelligence",
    prompt: "You are a company research specialist...",
    tools: ["WebSearch"],
    model: "sonnet",
  },
  "competitive-analyzer": {
    description: "Analyst that compares prospect's solution to ours",
    prompt: "You are a competitive analysis specialist...",
    tools: [],
    model: "sonnet",
  },
  "qualification-scorer": {
    description: "Scorer that assesses BANT criteria and deal probability",
    prompt: "You are a sales qualification specialist...",
    tools: [],
    model: "sonnet",
  },
};

// Orchestrator invokes subagents and returns structured output
for await (const message of query({
  prompt: orchestratorPrompt,
  options: {
    allowedTools: ["Task"],
    agents: subagents,
    outputFormat: {
      type: "json_schema",
      schema: SalesBriefingJSONSchema,
    },
  },
})) { ... }
```

## Architecture

```
PROSPECT: Company + Contact
     ↓
ORCHESTRATOR (allowedTools: ["Task"])
     ↓
     ├─→ company-researcher (WebSearch) ─→ Profile ──┐
     ├─→ competitive-analyzer ───────────→ Position ─┤
     └─→ qualification-scorer ───────────→ BANT ─────┤
                                                      ↓
                                                SALES BRIEFING
```

## Output Schema

| Field | Description |
|-------|-------------|
| companyProfile | Name, industry, employees, revenue, tech stack |
| competitiveAnalysis | Current solution, advantages, concerns |
| qualification | Budget, authority, need, timeline, deal size |
| recommendation | Pursue, Nurture, or Disqualify |
| talkingPoints | Key points for the sales call |

## Sample Prospects

| Type | Company | Expected Outcome |
|------|---------|------------------|
| Enterprise | TechCorp Industries | Pursue (high budget) |
| Startup | GrowthStartup Inc | Nurture (limited budget) |
| SMB | LocalBiz Solutions | Pursue (moderate budget) |

## Key Takeaway

Combine the subagents pattern with structured outputs to create comprehensive business intelligence systems. The orchestrator coordinates multiple specialists via `Task`, and returns validated structured data via `outputFormat`.
