# Solution: Claude Model Selection - Support Ticket Classifier

Complete implementation of a support ticket classification system that routes requests to different Claude models based on complexity.

## Project Structure

```
src/
├── classifier.ts     # Main solution (4 steps implemented)
├── helpers.ts        # Utility functions (cost, stats, comparison)
├── models.ts         # Model definitions & pricing
└── sample-tickets.ts # Test data
```

## Setup

```bash
npm install
```

## Authentication Setup

Copy `.env.example` to `.env` (required in all environments):
```bash
cp .env.example .env
```

In Vocareum workspace, `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` are **already configured** in your environment.

For local development, also uncomment and fill in your credentials in `.env`.

**Troubleshooting:**
- **`Error: API key not found`** — in Vocareum this is pre-configured; locally, set `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` in `.env`

## Run

```bash
# From this directory (lesson-01-model-selection/exercise/solution)
npm start
```

## What You'll See

| Step | Model | Task |
|------|-------|------|
| 1 | Haiku | Simple priority classification |
| 2 | Sonnet | Detailed ticket analysis |
| 3 | Opus | Complex multi-issue reasoning |
| 4 | All | Side-by-side comparison |

## Key Takeaway

| Model | Best For | Cost |
|-------|----------|------|
| Haiku | Classification, routing, yes/no | Lowest |
| Sonnet | Most production work | Balanced |
| Opus | Complex, multi-step reasoning | Highest |

Smart model routing can reduce costs by 80%+!
