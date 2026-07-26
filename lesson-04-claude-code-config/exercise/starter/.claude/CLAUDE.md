---
description: "Intelligent support ticket routing system using multi-agent architecture"
tools:
  - bash
  - read
  - grep
  - glob
---

# Support Ticket System

This file configures Claude Code for an intelligent support ticket routing system that automatically analyzes and routes 5,000+ tickets daily. It demonstrates the multi-agent architecture pattern from Lesson 03.

## Project Overview

- Automatically analyzes and routes 5,000+ tickets daily.
- It classifies the tickets and routes them to the right team. It makes sure that the SLA agreements are met for each customer.
- Used by support teams to eliminate manual triage and improve response time for customers, especially enterprise ones.

## Architecture

This system uses:
- **ticket-analyzer** (subagent): reads a ticket's content and returns structured urgency/category/routing/SLA data as JSON
- **ticket-classification** (skill): defines the urgency levels, keyword indicators, and category rules the analyzer applies

## How to Use

```bash
# Analyze a single ticket
claude "Analyze the ticket in sample-tickets/technical.txt"

# Classify all tickets in the queue
claude "Classify all tickets in sample-tickets/ and route appropriately"

# Check SLA status
claude "Analyze the ticket in sample-tickets/billing.txt"
```

## Ticket Categories

- **Technical**: Errors, API issues, integrations
- **Billing**: Payments, invoices, subscriptions
- **General**: How-to questions, account settings, feature inquiries

## SLA Requirements

- **Enterprise customers**: < 1 hour response time
- **Standard customers**: < 4 hour response time

## System Instructions

When analyzing support tickets:

1. Classify the ticket's urgency and category using the ticket-classification skill
2. Delegate to the ticket-analyzer subagent for structured triage output
3. Route it based on category, and escalate immediately if urgency is URGENT or the SLA deadline is at risk

## Build Commands

```bash
# If this were a real project, add relevant commands
npm install
npm test
```

## Key Takeaway

This configuration shows how to:
- Translate an architectural design (Lesson 03) into a working Claude Code project configuration
- Split responsibility between always-loaded instructions (CLAUDE.md), a delegated specialist (subagent), and reusable domain knowledge (skill)
- Use tool restrictions and model choice (Haiku) to keep a high-volume triage task fast and cheap
