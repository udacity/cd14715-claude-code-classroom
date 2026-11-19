# Demo: Claude Model Selection

Learn when to use Haiku, Sonnet, and Opus based on task complexity.

## Scenario

A weather notification service processes thousands of alerts daily. Simple updates like sunny forecasts need fast, cheap processing, while severe multi-hazard warnings require deeper analysis. This demo shows how to pick the right Claude model for each type of task.

## Project Structure

```
src/
├── index.ts          # Main demo (4 steps)
├── helpers.ts        # Utility functions (cost, stats, comparison)
├── models.ts         # Model definitions & pricing
└── sample-alerts.ts  # Test data
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
# From this directory (lesson-01-model-selection/demo)
npm start
```

## What You'll See

| Step | Model | Task |
|------|-------|------|
| 1 | Haiku | Simple classification |
| 2 | Sonnet | Detailed analysis |
| 3 | Opus | Complex reasoning |
| 4 | All | Side-by-side comparison |

## Key Takeaway

| Model | Best For | Cost |
|-------|----------|------|
| Haiku | Classification, routing, yes/no | Lowest |
| Sonnet | Most production work | Balanced |
| Opus | Complex, multi-step reasoning | Highest |

Smart model routing can reduce costs by 80%+!
