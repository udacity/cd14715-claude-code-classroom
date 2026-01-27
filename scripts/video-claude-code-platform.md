# Video: Claude Code Platform Overview
*Module 4.1 | Topic: Introduction to Claude Code*

---

## Opening Hook

> *"You've learned about Claude models, extended thinking, and agentic architecture. Now it's time to meet the tool that brings it all together: Claude Code. It runs in your terminal, IDE, and on the web—and it can do things regular Claude can't: read your files, run commands, and work as your AI pair programmer. Let's explore what makes Claude Code different."*

---

## Key Discussion Points

1. **What is Claude Code?**
   - An agentic coding assistant from Anthropic
   - NOT just a chatbot—it can take ACTIONS in your development environment
   - Reads files, writes code, runs commands, searches codebases
   - Implements the agentic patterns from Module 3

2. **Platform overview: Multiple interfaces**
   - **CLI (Command Line)**: Terminal-based, scriptable, full power—the foundation
   - **IDE Extensions**: VS Code, Cursor, Windsurf, and JetBrains IDEs
   - **Web Interface**: Browser-based, cloud-isolated environments
   - **Mobile**: iOS app for coding on the go
   - Core is the CLI; IDE extensions and other interfaces build on top of it

3. **CLI: The power user interface**
   - Run from any terminal: `claude` command
   - Best for: Automation, scripting, CI/CD integration
   - Full access to all tools and capabilities
   - Headless operation possible (no GUI needed)
   - This is the default and mainstream Claude Code mode

4. **VS Code: The integrated experience**
   - Extension built on top of the CLI (includes CLI, accessible via integrated terminal)
   - Visual file tree, inline suggestions, diff views
   - Best for: Active development, code review, refactoring
   - Context-aware: Sees your open files, workspace structure
   - Some features are CLI-only—use integrated terminal for advanced capabilities
   - Ideal for: Day-to-day coding, learning codebases

5. **Web: The cloud-based option**
   - Runs in cloud-based isolated environments (not just a browser chat)
   - Great for: Well-defined tasks, bug fixes, parallel work on multiple issues
   - Works on repositories not checked out locally
   - Ideal for: Code architecture questions, routine tasks, team collaboration

6. **Feature parity and differences**
   - Core capabilities: Same across all platforms
   - File access: CLI/IDE have local access, Web uses cloud environments
   - Tool availability: Some features are CLI-only (use integrated terminal in VS Code for these)
   - Performance: CLI often fastest, Web runs in isolated cloud containers

7. **Workspace integration**
   - Claude Code understands PROJECT context, not just files
   - CLAUDE.md: Project-specific instructions
   - .claude/ folder: Agents, skills, settings
   - Respects .gitignore, understands project structure
   - This is what makes it "agentic" vs just "generative"

---

## Examples to Include

| Example | Description | Level of Detail |
|---------|-------------|-----------------|
| Platform comparison table | CLI vs IDE vs Web - features and use cases | Deep dive - reference material |
| CLI demo preview | What it looks like to run `claude` in terminal | Brief mention - visual preview |
| VS Code integration | Screenshot/description of the IDE experience | Walkthrough - most students will use this |
| Workspace awareness | How Claude Code understands project structure | Walkthrough - key differentiator |
| CLAUDE.md introduction | What project configuration looks like | Brief mention - preview Module 4.2 |

---

## What NOT to Cover

- CLAUDE.md syntax and configuration details - covered in Module 4.2
- Agent definitions (.claude/agents/) - covered in Module 4.2
- Skills configuration - covered in Module 4.2 and Module 8
- Claude Agent SDK (programmatic access) - covered in Modules 5-10
- Installation and setup steps - assumed done or covered in 4.2

---

## Additional Notes

- This is an ORIENTATION video - students should understand what Claude Code is before configuring it
- Keep it high-level: "Here's what exists and why" not "Here's how to use every feature"

- The workspace integration point is crucial:
  - This is WHY Claude Code is better for coding than regular Claude
  - It has CONTEXT about your project
  - It can be CUSTOMIZED per project (CLAUDE.md)

- Platform choice guidance:
  - "Starting out? IDE extension (VS Code/JetBrains) is the friendliest"
  - "Want maximum control? CLI is the foundation—everything builds on it"
  - "Working on remote repos or parallel tasks? Web's cloud environments shine"

- Preview for Module 4.2: "In the next module, you'll configure Claude Code for a specific project using CLAUDE.md and the .claude folder."

- Terminology:
  - "Workspace" - your project directory that Claude Code understands
  - "Tools" - capabilities Claude Code can use (Read, Write, Bash, etc.)
  - "Context" - the information Claude Code has about your project

- Analogy: "CLI is like texting—fast, efficient, scriptable. IDE extensions are like pair programming—they're right there with you, built on that same CLI foundation. Web is like a cloud workstation—spin up isolated environments without local setup."

---
