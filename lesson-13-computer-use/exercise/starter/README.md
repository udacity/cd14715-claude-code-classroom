# Exercise: Form Automation Agent

Implement a form automation agent using Claude's computer use capabilities. The agent fills out a web form by clicking fields, typing text, and submitting.

## Objective

Open `src/form-agent.ts` and implement the TODOs to configure the computer use tool and build the agent loop.

## Learning Goals

- Configure the computer use tool with proper type and dimensions
- Implement the agent loop for GUI automation
- Handle different tool result types (screenshots vs text)
- Apply the conversation pattern for multi-turn tool use

## Project Structure

```
src/
├── index.ts           # Entry point (no changes needed)
├── form-agent.ts      # YOUR IMPLEMENTATION HERE
├── action-handlers.ts # Pre-built action execution
└── types.ts           # Type definitions
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

## Your Tasks

### TODO: (1) `createComputerTool()`

Return a `ComputerUseTool` object with:

```typescript
{
  type: "computer_20250124",
  name: "computer",
  display_width_px: DISPLAY_WIDTH,
  display_height_px: DISPLAY_HEIGHT,
}
```

### TODO: (2) `runFormAutomationAgent()`

#### (2a) Make the API call

Call `client.beta.messages.create` with:

```typescript
{
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 4096,
  system: systemPrompt,
  tools: tools as Anthropic.Beta.BetaTool[],
  messages,
  betas: ["computer-use-2025-01-24"],
}
```

#### (2b) Format tool results

For screenshots (when `result.screenshot` exists):

```typescript
{
  type: "tool_result",
  tool_use_id: block.id,
  content: [{
    type: "image",
    source: {
      type: "base64",
      media_type: "image/png",
      data: result.screenshot,
    },
  }],
}
```

For other actions:

```typescript
{
  type: "tool_result",
  tool_use_id: block.id,
  content: result.output || result.error || "Action completed",
  is_error: !result.success,
}
```

#### (2c) Append messages

Add both the assistant response and tool results to continue the conversation:

```typescript
messages.push({ role: "assistant", content: response.content });
messages.push({ role: "user", content: toolResults });
```

## Run

```bash
npm start
```

## Success Criteria

- `createComputerTool()` returns a valid tool with type `"computer_20250124"`
- Agent loop calls the API with the `computer-use-2025-01-24` beta
- Screenshots are returned as base64 image content
- Other action results are returned as text content
- Both assistant response and tool results are appended to messages each iteration
