# Solution: Claude Agent SDK - Contract Standardizer

Reference implementation of the contract standardizer agent that reads vendor contracts and writes standardized output files.

## Project Structure

```
src/
├── contracts/               # Input contract files
│   ├── saas.txt
│   ├── consulting.txt
│   ├── vendor.txt
│   └── email.txt
├── standardized/            # Output (agent writes here)
│   └── .gitkeep
├── contract-standardizer.ts # Completed implementation
├── sample-contracts.ts      # Contract file paths
└── index.ts                 # Test runner
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

In Vocareum workspace, `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` are **already configured** in your environment -- the `.env` file only needs to provide `ANTHROPIC_MODEL`.

For local development, also uncomment and fill in your credentials in `.env`:
```
ANTHROPIC_API_KEY=your-key-here
ANTHROPIC_BASE_URL=your-base-url-here
```

**Troubleshooting:**
- **`Error: ANTHROPIC_MODEL is not set`** -- make sure you ran `cp .env.example .env`
- **`Error: API key not found`** -- in Vocareum this is pre-configured; locally, set `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` in `.env`

## Run

```bash
# From this directory (lesson-05-agent-sdk/exercise/solution)
npm start
```

## What You'll See

| Step | Description |
|------|-------------|
| 1 | Agent reads `saas.txt` and writes `standardized-saas.md` |
| 2 | Agent reads `email.txt` and writes `standardized-email.md` |

Each standardized file contains extracted Parties, Term, Financial Terms, Legal Terms, IP & Data, and Risk Assessment sections.

## Key Takeaway

The Agent SDK enables file-based document processing with minimal code. The agent autonomously reads input files, processes content, and writes structured output files using the Read and Write tools.
