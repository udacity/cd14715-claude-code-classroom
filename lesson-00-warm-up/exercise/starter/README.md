# Exercise: Getting Started with Your Workspace

## Objective

Familiarize yourself with the Vocareum workspace, Claude Code CLI, and the Claude Agent SDK — the core tools you'll use throughout this course.

## Learning Goals

- Navigate the Vocareum workspace confidently
- Use Claude Code in the terminal to perform tasks interactively
- Understand the environment variables available in your workspace
- Run a TypeScript program that uses the Claude Agent SDK

## Project Structure

```
src/
└── hello-agent.ts  # Agent SDK script that describes the repo
```

## Setup

```bash
# From the repo root
cd lesson-00-warm-up/exercise/starter
npm install
```

## Authentication Setup

In Vocareum workspace, `ANTHROPIC_API_KEY` and `ANTHROPIC_MODEL` are **already configured** in your environment — no setup needed.

For local development, set your API key before running:
```bash
export ANTHROPIC_API_KEY=your-key-here
```

## Your Tasks

### Part 1: Explore the Vocareum Workspace

Take a moment to look around the workspace interface:

1. **Open the terminal** — you'll find it at the bottom of the workspace. This is where you'll run all commands in the course.
2. **Browse the file tree** — on the left side, explore the folders. Each `lesson-XX-*` directory corresponds to a skill pair in the course and contains a `demo/` and `exercise/` folder.
3. **Check your tools** — run the following commands and note the output:

```bash
node --version
npx tsx --version
pwd
ls
```

### Part 2: Inspect Environment Variables

Run:

```bash
printenv | grep -E "ANTHROPIC|CLAUDE"
```

You should see variables like:
- `ANTHROPIC_API_KEY` — your API key for calling Claude (already set for you)
- `ANTHROPIC_MODEL` — the default model ID used by the course exercises

> **Note:** You don't need to set these yourself. They're provided by the Vocareum workspace so you can focus on learning, not configuration.

### Part 3: Run Claude Code

Claude Code is an AI-powered CLI tool that runs directly in your terminal. It's already installed in this workspace, and you'll use it as a learning companion throughout the course.

1. **Start Claude Code** by typing:

```bash
claude
```

2. **Give it a simple task:**

```
Explain what this repository is about by reading the top-level package.json
```

3. **Observe what happens.** Notice how Claude Code reads files from the project on its own, reasons about what it finds, and responds with a clear answer.

4. **Try a few more things:**

```
List all the lesson topics in this repo
```

```
What environment variables are set that relate to Anthropic or Claude?
```

5. **Exit** the Claude Code session by typing `/exit` or pressing `Ctrl+C`.

### Part 4: Run a Claude Agent SDK Script

1. **Read the script** — open `src/hello-agent.ts` and look through it. Notice how it imports `query` from the Claude Agent SDK, sends a prompt, gives Claude the `Read` tool, and streams the result.

2. **Run it:**

```bash
cd lesson-00-warm-up/exercise/starter
npm start
```

3. **Compare the output** to what Claude Code told you in Part 3. The script gave Claude the same tools and the same task — but this time it ran from code you can inspect, modify, and build on. This is the pattern you'll follow in the exercises throughout the course.

## Run

```bash
# From this directory (lesson-00-warm-up/exercise/starter)
npm start
```

## Success Criteria

- [ ] You can navigate the Vocareum workspace and find lesson folders
- [ ] Environment variables `ANTHROPIC_API_KEY` and `ANTHROPIC_MODEL` are visible
- [ ] Claude Code launches and responds to prompts
- [ ] `hello-agent.ts` runs successfully and prints a repo description
