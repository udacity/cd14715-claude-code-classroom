# Sales Opportunity Qualifier

Build a multi-agent sales intelligence system.

## Overview

Create a multi-agent sales intelligence system with an orchestrator coordinating three specialists:
- **Company Researcher**: Gathers company intelligence (financials, tech stack, pain points)
- **Competitive Analyzer**: Compares solutions and pricing
- **Qualification Scorer**: Assesses BANT criteria, deal size, close probability

## Scenario

Your B2B SaaS sales team receives 200+ inbound leads weekly. Sales reps spend hours researching each company before qualification calls. You need an intelligent system that:
- Researches the prospect company (revenue, employees, tech stack, news, funding)
- Analyzes how your solution compares to their current tools
- Assesses BANT qualification criteria (Budget, Authority, Need, Timeline)
- Calculates deal size and win probability
- Produces a briefing document for the sales rep

This enables reps to focus on high-probability deals and come prepared to calls.

## Prerequisites

- Node.js 18+
- Anthropic API Key
- Completed the demo (Research Orchestrator)

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```bash
ANTHROPIC_API_KEY=your-api-key-here
```

## Tasks

### 1. Define Three Specialized Agents

**a. Company Research Agent**
```typescript
const companyResearcher: AgentDefinition = {
  name: 'company-researcher',
  description: 'Gathers intelligence about prospect company',
  // Capabilities: size, revenue, industry, tech stack, news, funding, decision makers
  // Tools: WebSearch (or mock data)
  // Model: Sonnet
};
```

**b. Competitive Analysis Agent**
```typescript
const competitiveAnalyzer: AgentDefinition = {
  name: 'competitive-analyzer',
  description: 'Analyzes how prospect current solution compares to ours',
  // Capabilities: current vendors, feature comparison, pricing, switching costs
  // Tools: Read (competitor docs)
  // Model: Sonnet
};
```

**c. Qualification Scoring Agent**
```typescript
const qualificationScorer: AgentDefinition = {
  name: 'qualification-scorer',
  description: 'Assesses BANT criteria and calculates deal probability',
  // Capabilities: budget, authority, need, timeline, deal size, win probability
  // Tools: None (scoring based on data)
  // Model: Sonnet
};
```

### 2. Design Orchestrator Workflow

```
User Input: Company Name, Contact Info, Source
     ↓
Orchestrator initiates qualification
     ↓
     ├─→ Company Research (parallel) ─→ Company profile
     ├─→ Competitive Analysis (parallel) ─→ Competitive position
     ↓
Wait for both research agents
     ↓
Qualification Scorer (sequential) ─→ BANT scores + deal size
     ↓
Orchestrator combines into Sales Briefing
```

### 3. Define Output Schema

```typescript
const SalesBriefingSchema = z.object({
  companyProfile: z.object({
    name: z.string(),
    industry: z.string(),
    employeeCount: z.number(),
    estimatedRevenue: z.string(),
    techStack: z.array(z.string()),
    recentNews: z.array(z.string()),
    keyDecisionMakers: z.array(z.string())
  }),
  competitiveAnalysis: z.object({
    currentSolution: z.string(),
    ourAdvantages: z.array(z.string()),
    theirConcerns: z.array(z.string()),
    switchingBarriers: z.array(z.string())
  }),
  qualification: z.object({
    budget: z.object({
      hasBudget: z.boolean(),
      estimatedBudget: z.number(),
      confidence: z.string()
    }),
    authority: z.object({
      contactIsDecisionMaker: z.boolean(),
      decisionMakers: z.array(z.string())
    }),
    need: z.object({
      painPoints: z.array(z.string()),
      urgency: z.enum(['high', 'medium', 'low'])
    }),
    timeline: z.string(),
    dealSize: z.number(),
    winProbability: z.number()  // 0-100
  }),
  recommendation: z.string(),  // Pursue/Nurture/Disqualify
  talkingPoints: z.array(z.string())
});
```

### 4. Implement Orchestrator Prompt

- Step 1: Invoke company research + competitive analysis in parallel
- Step 2: Wait for both to complete
- Step 3: Invoke qualification scorer with combined data
- Step 4: Calculate deal priority score
- Step 5: Generate briefing with talking points

### 5. Implement `qualifyOpportunity()` Function

```typescript
export async function qualifyOpportunity(
  companyName: string,
  contactInfo: { name: string; title: string; email: string }
): Promise<SalesBriefing> {
  // Call query() with all three agents registered
  // Use orchestrator prompt for parallel + sequential execution
  // Return validated SalesBriefing object
}
```

### 6. Test with Scenarios

- **Enterprise**: High budget, complex decision process
- **SMB**: Budget-conscious, fast decisions
- **Startup**: Limited budget, modern tech stack

### 7. Handle Edge Cases

- Company too small (<10 employees) → flag as low priority
- Already using competitor → highlight switching ROI
- No clear pain points → mark as "nurture"
- Budget constraints → suggest phased implementation

## Running the Exercise

```bash
npm start
```

## Project Structure

```
exercise/
├── src/
│   ├── sales-qualifier.ts
│   └── agents/
│       ├── company-researcher.ts
│       ├── competitive-analyzer.ts
│       └── qualification-scorer.ts
├── test-data/                  # Mock company data
├── package.json
└── README.md
```

## Key Takeaway

Multi-agent orchestration dramatically reduces sales research time from hours to minutes. Parallel execution of research agents maximizes speed while qualification scoring ensures data-driven decisions. Structured briefings give reps confidence and talking points for initial calls.

## Deliverable

A TypeScript module with:
- Three agent definitions
- Orchestrator prompt
- `qualifyOpportunity()` function

Must correctly coordinate agents (research in parallel, then qualification sequentially), produce comprehensive briefing with BANT scores, win probability, and actionable talking points. All tests must pass.
