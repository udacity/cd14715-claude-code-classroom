# Exercise: Extended Thinking for Fraud Detection

## Objective

Build a fraud detection analyzer that uses Claude's extended thinking feature to capture reasoning trails for compliance audits.

## Learning Goals

- Enable and configure extended thinking with `budget_tokens`
- Extract thinking blocks from API responses
- Distinguish between "thinking" and "text" content blocks
- Capture reasoning trails for audit purposes

## Project Structure

```
src/
├── fraud-analyzer.ts      # Your task: implement analyzeFraudRisk()
├── sample-transactions.ts # 5 test transactions with different risk levels
└── index.ts               # Tests for your implementation
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

Complete the `fraud-analyzer.ts` file by implementing the `analyzeFraudRisk()` function:

### Step 1: Configure Extended Thinking

Enable extended thinking in the `client.messages.create()` call:

```typescript
thinking: {
  type: "enabled",
  budget_tokens: 10000,
},
```

Set `max_tokens: 16000` (must be larger than `budget_tokens`).

### Step 2: Build the Analysis Prompt

Include transaction details (amount, merchant, location, time) and customer history (typical amount, location, account age, flags). Ask Claude to analyze for fraud patterns and provide a risk level and recommendation.

### Step 3: Extract Content Blocks

Loop through `response.content` and:
- Capture `thinking` blocks into the `thinkingSteps` array
- Capture the `text` block as the `analysis` string

## Run

```bash
# From this directory (lesson-02-extended-thinking/exercise/starter)
npm start
```

## Success Criteria

- [ ] Extended thinking is enabled with `budget_tokens`
- [ ] Thinking steps are extracted from `response.content`
- [ ] Analysis text is captured from text blocks
- [ ] Transaction is analyzed successfully
- [ ] Thinking steps count > 0
