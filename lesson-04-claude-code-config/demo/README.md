# Introduction to Claude Code Configuration

Learn how Claude Code works and how to configure it using `.claude/CLAUDE.md`.

## Overview

Claude Code is an AI-powered development assistant that can be configured per-project using a `.claude/CLAUDE.md` file. This demo shows how to set up a basic configuration.

## Scenario

You want to set up Claude Code as a code review assistant for your project. We'll create a basic configuration that tells Claude how to review code.

## What You'll Learn

- What Claude Code is and how it works
- Different platforms: CLI, VS Code extension, Web interface
- Purpose of `.claude/CLAUDE.md` configuration file
- Basic project setup and directory structure
- How to run your first Claude Code command

## Project Structure

```
demo/
├── .claude/
│   └── CLAUDE.md          # Configuration file
├── src/
│   └── example.ts         # Sample code to review
└── README.md
```

## CLAUDE.md Structure

A basic CLAUDE.md includes:

```markdown
# Project Name

## System Prompt
Instructions for how Claude should behave

## Model
claude-sonnet-4-5-20250929

## Allowed Tools
- Read
- Grep
- Glob
```

## Using Claude Code

### CLI
```bash
# Install
npm install -g @anthropic-ai/claude-code

# Use in project directory
claude "Review the code in src/example.ts"
```

### VS Code Extension
1. Install "Claude Code" from marketplace
2. Open project folder
3. Claude automatically loads `.claude/CLAUDE.md`
4. Chat with Claude in sidebar

## Testing the Configuration

From this project directory:

```bash
# Ask Claude to review the example code
claude "Review src/example.ts for issues"

# Claude will use the configuration from .claude/CLAUDE.md
# and respond as a code review assistant
```

## Key Takeaway

The `.claude/CLAUDE.md` file is your project's AI configuration. Start simple with System Prompt and Model. You can add advanced features (Agents, Skills, MCP) as you learn in later lessons.
