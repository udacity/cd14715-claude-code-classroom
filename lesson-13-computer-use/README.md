# Lesson 13: Computer Use Capabilities

Learn about Claude's computer use capabilities for GUI automation, including safety considerations, sandboxing requirements, and implementation patterns.

## Learning Objectives

By the end of this lesson, you will be able to:

- Explain computer use architecture and the screenshot-action feedback loop
- Understand safety requirements including sandboxing and access controls
- Configure the computer use tool with the Claude SDK
- Implement an agent loop for GUI automation tasks
- Apply best practices for coordinate handling and display scaling

## Lesson Contents

### Demo
The demo introduces computer use concepts and shows the implementation patterns:
- Computer use tool configuration
- Action types (screenshot, click, type, key, scroll)
- Safety configurations and logging
- Coordinate scaling for different resolutions
- The agent loop pattern

### Exercise
The exercise has you implement a form automation agent that:
- Configures the computer use tool
- Implements the agent loop
- Handles screenshots and action results
- Applies safety configurations

## Key Concepts

### Computer Use Architecture

Claude's computer use works through a visual feedback loop:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Screenshot │────▶│   Claude    │────▶│   Action    │
│   (image)   │     │  Analysis   │     │ (coords/text)│
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                                       │
       │                                       ▼
       │                               ┌─────────────┐
       └───────────────────────────────│  Execute    │
                                       │  in Sandbox │
                                       └─────────────┘
```

### Safety Requirements

Computer use MUST run in a sandboxed environment:

1. **Docker Container** - Isolated from host system
2. **Virtual Machine** - Complete isolation
3. **Network Restrictions** - Limit accessible domains
4. **Action Logging** - Full audit trail
5. **Confirmation Prompts** - For sensitive actions

### Tool Configuration

```typescript
const computerTool = {
  type: "computer_20250124",
  name: "computer",
  display_width_px: 1024,
  display_height_px: 768,
};

// API call with beta header
const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  tools: [computerTool],
  messages,
  betas: ["computer-use-2025-01-24"],
});
```

### Display Recommendations

For optimal performance:
- Maximum 1568 pixels on longest edge
- Maximum 1,150,000 total pixels
- Use coordinate scaling for high-res displays

## Running the Code

```bash
# Demo
cd demo
npm install
npm start

# Exercise Starter
cd exercise/starter
npm install
npm start

# Exercise Solution
cd exercise/solution
npm install
npm start
```

## Resources

- [Computer Use Documentation](https://docs.anthropic.com/en/docs/agents-and-tools/computer-use)
- [Computer Use Quickstart](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo)
- [OSWorld Benchmark](https://os-world.github.io/)

## Use Cases

Computer use is appropriate for:
- **GUI Testing** - Automated UI testing without writing test scripts
- **Legacy Integration** - Interact with applications lacking APIs
- **RPA (Robotic Process Automation)** - Automate repetitive GUI tasks
- **Accessibility Testing** - Verify UI accessibility

Computer use is NOT appropriate for:
- Tasks that can be done via API
- Security-sensitive operations
- Production environments without proper sandboxing
