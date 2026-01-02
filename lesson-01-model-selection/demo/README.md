# Demo: Claude Model Selection

Learn when to use Haiku, Sonnet, and Opus based on task complexity.

## Scenario

A weather notification service processes thousands of alerts daily:
- Simple updates → fast, cheap processing
- Severe warnings → deeper analysis

## Project Structure

```
src/
├── index.ts        # Main demo (4 steps)
├── models.ts       # Model definitions & pricing
└── sample-alerts.ts # Test data
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
