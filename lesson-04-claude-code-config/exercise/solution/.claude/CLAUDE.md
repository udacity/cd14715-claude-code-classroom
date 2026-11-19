---
description: "Intelligent support ticket routing and analysis system for 5,000+ daily tickets"
tools:
  - bash
  - read
  - grep
  - glob
---

# Support Ticket System

This file configures Claude Code for an AI-powered support ticket classification and routing system that handles 5,000+ tickets daily with enterprise SLA requirements.

## Project Overview

An intelligent support ticket system that automatically:
- **Triages** tickets by urgency (URGENT, HIGH, MEDIUM, LOW)
- **Categorizes** tickets by type (technical, billing, general)
- **Routes** tickets to appropriate teams (engineering, finance, support, escalation)
- **Monitors** SLA deadlines based on customer tier

This demonstrates the multi-agent architecture pattern from Lesson 03, now implemented with Claude Code configuration.

## Architecture

This system uses:
- **ticket-analyzer**: Fast triage and categorization subagent (Haiku)
- **kb-searcher**: Knowledge base search for auto-resolution (Haiku)
- **ticket-classification skill**: Teaches classification methodology
- **sla-calculation skill**: Teaches SLA deadline calculation

## How to Use

```bash
# Analyze a single ticket
claude "Analyze the ticket in sample-tickets/technical.txt"

# Classify all tickets
claude "Classify all tickets in sample-tickets/ and route appropriately"

# Check SLA status
claude "Calculate SLA deadline for an enterprise ticket submitted at 2pm"

# Process batch with prioritization
claude "Analyze all tickets and prioritize by SLA deadline"

# Search knowledge base
claude "Search KB for solutions to 500 error issues"
```

## Ticket Categories

- **Technical**: Bugs, errors, API issues, integrations, performance problems
- **Billing**: Payments, invoices, refunds, subscriptions, pricing questions
- **General**: How-to questions, account settings, feature inquiries

## SLA Requirements

- **Enterprise customers**: < 1 hour response time
- **Standard customers**: < 4 hours response time
- **All URGENT tickets**: Immediate escalation regardless of tier
- **Business hours**: Mon-Fri 9am-5pm (add 24/7 for enterprise critical)

## System Instructions

When analyzing support tickets:

1. **Use the ticket-classification skill** to apply the classification matrix
2. **Delegate to ticket-analyzer subagent** for structured analysis
3. **Check KB with kb-searcher** to find existing solutions before routing
4. **Calculate SLA deadline** using the sla-calculation skill
5. **Escalate immediately** if SLA is at risk (<20% time remaining)

Always:
- Provide actionable categorization (not just analysis)
- Include routing recommendation
- Calculate exact SLA deadline
- Check for escalation triggers
- Note the source ticket file for tracking

## Urgency Classification Guide

| Level | Response Time | Triggers |
|-------|--------------|----------|
| **URGENT** | Immediate | "system down", "can't login", "breach", "data loss" |
| **HIGH** | < 1 hour | "error", "broken", "not working", enterprise customer |
| **MEDIUM** | < 4 hours | "issue", "slow", "problem" with workaround |
| **LOW** | < 24 hours | "how do I", "question", "feature request" |

## Routing Rules

- **Technical issues** → Engineering team
- **Billing questions** → Finance team
- **General questions** → L1 Support (check KB first)
- **URGENT anything** → Escalation + team lead alert
- **Enterprise + HIGH** → Senior support + team alert

## Build Commands

```bash
# If this were a real project
npm install
npm test
npm run classify-tickets
```

## Key Takeaway

This configuration demonstrates:
- Translating architectural designs (Lesson 03) into configuration files
- Using subagents for specialized, isolated tasks
- Using skills to teach domain-specific methodology
- Combining multiple agents and skills for complex workflows
- Production-ready Claude Code setup for enterprise systems
