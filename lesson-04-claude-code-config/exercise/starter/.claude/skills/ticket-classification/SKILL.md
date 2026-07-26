---
name: ticket-classification
description: Classify support tickets by urgency and category. Use when analyzing tickets, determining priority, or routing customer requests.
allowed-tools: Read, Grep
---

# Ticket Classification

This skill teaches Claude how to classify a support ticket's urgency and category, and how to route it, using a consistent, repeatable rule set.

## When to Use This Skill

Use this skill when the user requests:
- "Analyze this ticket"
- "Classify all tickets in sample-tickets/"
- "What's the urgency/routing for this ticket?"

## Classification Matrix

### Urgency Levels

| Level | Criteria | Response Time |
|-------|----------|---------------|
| **URGENT** | System down, security breach, data loss | Immediate |
| **HIGH** | Core feature broken, enterprise customer | < 1 hour |
| **MEDIUM** | Feature degraded, workaround available | < 4 hours |
| **LOW** | Questions, minor bugs, feature requests | < 24 hours |

### Urgency Keywords

**URGENT indicators:**
- "system down", "outage", "can't login"
- "breach", "security", "data loss"

**HIGH indicators:**
- "error", "500", "broken", "not working", "failed"
- "production", mentions of an Enterprise customer tier

**MEDIUM indicators:**
- "issue", "slow", "delayed", "doesn't work as expected"
- "workaround" (caps urgency at MEDIUM even if otherwise HIGH-sounding)

**LOW indicators:**
- "how do I", "question", "wondering", "feature request"
- "not urgent", explicit mention of a future/planning timeline

### Category Classification

**Technical:**
- Error messages, stack traces, HTTP status codes
- API, webhook, integration issues
- Login, authentication problems

**Billing:**
- Invoice, payment, charge, refund
- Subscription, plan, upgrade/downgrade, pricing

**General:**
- How-to questions, account settings
- Feature inquiries, documentation requests

## Classification Process

1. Read the ticket's subject and body in full
2. Note the customer tier (Enterprise/Standard) — it affects the SLA deadline, not the category
3. Match keywords/signals against the Urgency Keywords list to pick a level
4. Match keywords/signals against the Category Classification list to pick a category
5. Combine category + urgency to determine routing (see Routing Rules below)

**Routing Rules:**
- Technical → engineering
- Billing → finance
- General → support
- URGENT (any category) → escalation

## Examples

### Example 1: Technical - HIGH

```
Subject: 500 Errors on API Endpoint
Customer: Acme Corp (Enterprise)
We're experiencing 500 Internal Server errors on the /api/v2/users endpoint.
Started ~2 hours ago, affecting our production application.
About 5,000 active users can't access their dashboards.
Error: "Internal Server Error: Database connection timeout"
```

**Classification:**
- Urgency: HIGH
- Category: technical
- Routing: engineering
- Reasoning: Specific endpoint failing (not a full outage) plus an explicit error message → HIGH, not URGENT. Enterprise tier + production impact confirms HIGH over MEDIUM. Stack trace/API error → technical.

### Example 2: Billing - MEDIUM

```
Subject: Question about invoice charges
Customer: Small Business Co (Standard)
I just received my invoice for this month and noticed the charge is $500,
but I was expecting around $400 based on our subscription plan.
Can you help me understand what the additional $100 charge is for?
I'd like to get this clarified before the payment processes next week.
```

**Classification:**
- Urgency: MEDIUM
- Category: billing
- Routing: finance
- Reasoning: No system impact, but there's a concrete deadline (payment processes next week) and a real discrepancy to resolve, so it's more than a LOW inquiry. Invoice/charge/subscription → billing.

### Example 3: General - LOW

```
Subject: How to export data to CSV
Customer: TechStartup Inc (Standard)
I'm trying to export our user data to a CSV file for analysis, but I can't
find the export option in the dashboard. Is there a way to export data?
Not urgent, just planning for our quarterly review next month.
```

**Classification:**
- Urgency: LOW
- Category: general
- Routing: support
- Reasoning: Explicitly self-flagged as "not urgent" with a next-month planning horizon, no production impact. How-to/feature question → general.

## Output Format

Return classification results as JSON so they can be consumed by the ticket-analyzer subagent or downstream tooling:

```json
{
  "urgency": "URGENT|HIGH|MEDIUM|LOW",
  "category": "technical|billing|general",
  "routing": "engineering|finance|support|escalation",
  "customer_tier": "enterprise|standard",
  "sla_deadline": "Time when response is due"
}
```

## Quality Checklist

Before finalizing classification, verify:

- [ ] Customer tier was identified (affects SLA deadline)
- [ ] Urgency keywords were matched, not just guessed from tone
- [ ] "Workaround available" or similar wasn't overlooked (it caps urgency at MEDIUM)
- [ ] Category and routing are consistent with each other

## Tips

**Finding urgency indicators:**
- Check the first two sentences first — urgency is usually stated up front
- A stated timeline ("next week", "next month") is a strong LOW/MEDIUM signal even if the topic sounds urgent

**Categorizing accurately:**
- Stack traces and HTTP codes are a near-certain technical signal
- Dollar amounts and plan names are a near-certain billing signal

**Routing decisions:**
- URGENT always adds escalation on top of the normal team, it doesn't replace it
- When category is ambiguous, prefer technical if any error code is present

## Common Pitfalls

❌ **Don't:**
- Classify everything as URGENT "to be safe" — it defeats the purpose of triage
- Ignore the customer tier — it changes the SLA deadline even when urgency is the same
- Confuse a billing *question* (LOW/MEDIUM) with a billing *outage* (would be HIGH/URGENT)

✅ **Do:**
- Ground the urgency level in specific keywords/signals from the ticket text
- Note when a ticket explicitly says "not urgent" — take it at face value
- Keep routing decisions consistent with the category, not the tone of the message
