# Set Up Claude Code for Documentation Assistant

Configure Claude Code to help your team write better documentation.

## Overview

Install Claude Code, configure it for your local development environment, and create a project configuration for a documentation assistant.

## Scenario

You're joining a team that uses Claude Code for development automation. Your task is to set up a documentation assistant that helps write clear code comments and README files.

## Prerequisites

- Node.js and npm installed
- Anthropic API key
- Completed the demo (Code Review Assistant)

## Tasks

### 1. Install Claude Code

```bash
# Install globally
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version

# Set up API key
export ANTHROPIC_API_KEY=your-api-key-here

# Test with simple command
claude "hello"
```

### 2. Review the Project Structure

```
exercise/
├── .claude/
│   └── CLAUDE.md          # Your configuration
├── src/
│   └── weather-api.ts     # Code to document
└── README.md
```

### 3. Customize the CLAUDE.md Configuration

The provided `.claude/CLAUDE.md` configures Claude as a documentation assistant. Review it and understand:
- System Prompt: Instructions for documentation style
- Model: Which Claude model to use
- Allowed Tools: What actions Claude can take
- Response Format: How documentation should be structured

### 4. Test Your Configuration

```bash
# Navigate to exercise directory
cd lesson-04-claude-code-config/exercise

# Ask Claude to document the weather API
claude "Help me write JSDoc comments for src/weather-api.ts"

# Ask Claude to create a README for the weather API
claude "Create a README for this weather API project"
```

### 5. Verify Claude Uses Your Configuration

Claude should:
- Respond as a documentation assistant
- Use simple, jargon-free language
- Provide examples when helpful
- Follow the response format in CLAUDE.md

### 6. Document Your Setup

After testing, update this README with:
- Your installation steps
- Example commands that work
- Any customizations you made to CLAUDE.md

## Expected Output

When you run:
```bash
claude "Explain what getCurrentWeather does in src/weather-api.ts"
```

Claude should respond with clear documentation like:
```
## getCurrentWeather(city)

Fetches the current weather conditions for a specified city.

### Parameters
- `city` (string): The name of the city to get weather for

### Returns
- `Promise<WeatherData>`: Weather data including temperature, humidity, etc.

### Example
```typescript
const weather = await getCurrentWeather("Seattle");
console.log(weather.temperature); // 65
```
```

## Key Takeaway

Claude Code configuration starts simple and scales with your needs. The `.claude/CLAUDE.md` file is the source of truth for how Claude behaves in your project.

## Deliverable

- Working Claude Code installation
- Customized `.claude/CLAUDE.md` for documentation
- Screenshot or terminal output showing Claude responding as documentation assistant
