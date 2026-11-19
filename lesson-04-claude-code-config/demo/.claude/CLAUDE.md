---
description: "Company research system using multi-agent architecture"
tools:
  - bash
  - read
  - grep
  - glob
---

# Company Research Assistant

This file configures Claude Code for an AI-powered company research system that uses specialized subagents for parallel research.

## Project Overview

An intelligent company research assistant that automatically gathers comprehensive information about companies from multiple sources. This system demonstrates the multi-agent architecture pattern from Lesson 03.

## Architecture

This system uses specialized subagents for efficient parallel research:

- **web-researcher**: Gathers company info, products, tech stack (Haiku - fast)
- **people-finder**: Finds leadership team and org structure (Haiku - fast)
- **company-analysis skill**: Teaches Claude how to structure research reports

## How to Use

```bash
# Research a company and get comprehensive report
claude "Research Acme Corp and provide comprehensive report"

# Quick company profile
claude "Give me a quick profile of Stripe"

# Find leadership information
claude "Who are the executives at Anthropic?"

# Technical analysis
claude "What tech stack does Vercel use?"
```

## System Instructions

When conducting company research:

1. **Use the company-analysis skill** for structured methodology
2. **Delegate to subagents** when appropriate:
   - Use `web-researcher` for gathering company data
   - Use `people-finder` for leadership research
3. **Cite sources** - Always reference where information came from
4. **Be factual** - Stick to verifiable information, avoid speculation
5. **Format clearly** - Use the standard report format from the skill

## Build Commands

```bash
# Install dependencies (if this were a real project)
npm install

# Run tests
npm test

# Lint code
npm run lint
```

## Key Takeaway

This configuration demonstrates how to:
- Set up project-level Claude Code configuration
- Create specialized subagents with focused responsibilities
- Use skills to teach domain-specific knowledge
- Implement multi-agent patterns from architectural designs
