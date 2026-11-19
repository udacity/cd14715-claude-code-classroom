# Demo: Computer Use Capabilities

Claude's computer use feature enables GUI automation through a screenshot-action feedback loop. This demo shows the implementation patterns using mock actions -- real computer use requires a sandboxed environment (Docker/VM).

## Project Structure

```
src/
├── index.ts               # Demo entry point
├── types.ts               # Action types and tool definitions
├── action-handlers.ts     # Mock action implementations
└── computer-use-client.ts # Agent loop and tool configuration
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
npm start
```

## What You'll See

1. **Safety check** -- validates sandbox environment (mock mode for demo)
2. **Display configuration** -- resolution and scale factor settings
3. **Tool configuration** -- computer use tool definition with display dimensions
4. **Safety configuration** -- action limits, logging, and confirmation requirements
5. **Agent demo** -- runs the computer use agent loop (mock actions if no API key)

## Key Takeaway

Computer use follows a screenshot-action loop: Claude receives screenshots, analyzes the UI, returns pixel coordinates for actions, and repeats. All computer use must run in a sandboxed environment with safety controls like action limits, domain restrictions, and audit logging.
