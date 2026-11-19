---
name: ticket-classification
description: Classify support tickets by urgency and category. Use when analyzing tickets, determining priority, routing customer requests, or when user asks to classify, triage, or categorize support tickets.
allowed-tools: Read, Grep
---

# Ticket Classification Skill

This skill teaches Claude how to classify support tickets by urgency and category for intelligent routing.

## When to Use This Skill

Use this skill when the user requests:
- "Classify this ticket"
- "Analyze this support request"
- "What's the urgency of this ticket?"
- "Route this customer request"
- "Triage these tickets"

## Classification Matrix

### Urgency Levels

| Level | Criteria | Response Time |
|-------|----------|---------------|
| **URGENT** | System down, security breach, data loss, can't login (all users) | Immediate |
| **HIGH** | Core feature broken, production errors, enterprise customer affected | < 1 hour |
| **MEDIUM** | Feature degraded, workaround available, standard customer issue | < 4 hours |
| **LOW** | Questions, minor bugs, feature requests, documentation | < 24 hours |

### Urgency Keywords

**URGENT indicators:**
- "system down", "outage", "all users affected", "can't access"
- "security breach", "unauthorized access", "data loss"
- "production broken", "critical failure", "complete outage"
- "can't login" (affecting all/most users)

**HIGH indicators:**
- "error", "500", "broken", "not working", "failed"
- "doesn't work", "stopped working", "suddenly failing"
- "enterprise", "business critical", "blocking"
- "multiple users affected", "production issue"

**MEDIUM indicators:**
- "issue", "problem", "slow", "delayed"
- "not working as expected", "performance degraded"
- "workaround available", "intermittent"
- "standard customer", "non-critical"

**LOW indicators:**
- "how do I", "question", "wondering", "can you"
- "feature request", "enhancement", "suggestion"
- "documentation", "guide", "tutorial"
- "minor bug", "typo", "cosmetic issue"

### Category Classification

**Technical:**
- Error messages (500, 404, timeout, exception)
- Stack traces and error codes
- API issues, webhook failures, integration problems
- Login, authentication, authorization errors
- Performance issues (slow, timeout, connection)
- Database, server, infrastructure problems
- Code-related issues

**Billing:**
- Payment, invoice, charge, receipt
- Subscription, plan, tier, upgrade, downgrade
- Refund, credit, dispute, cancellation
- Credit card, payment method, billing address
- Pricing, cost, overage, limit
- Trial, free tier, premium features

**General:**
- How-to questions ("How do I...")
- Account settings, profile, preferences
- Feature questions ("Does this support...")
- Documentation requests
- General inquiries
- Onboarding help
- Non-technical, non-billing questions

## Classification Process

Follow these steps:

1. **Read the ticket subject and body**
2. **Scan for urgency keywords** (URGENT > HIGH > MEDIUM > LOW)
3. **Identify customer tier** (Enterprise vs Standard) if mentioned
4. **Count affected users** if mentioned (more users = higher urgency)
5. **Categorize by indicators** (error codes = technical, invoice = billing)
6. **Apply classification matrix**
7. **Determine routing** based on category and urgency

## Examples

### Example 1: Technical - HIGH

```
Subject: 500 Errors on API Endpoint
Customer: Acme Corp (Enterprise)
Body: We're getting 500 errors on /api/users endpoint. Started 2 hours ago.
Affects our production app with 5,000 users.
Error: "Internal Server Error: Database connection timeout"
```

**Classification:**
- **Urgency**: HIGH
- **Category**: technical
- **Routing**: engineering
- **Reasoning**: Production errors affecting enterprise customer, specific error code (500), database issue, multiple users affected, but not complete outage (URGENT would be if entire system down)

### Example 2: Billing - MEDIUM

```
Subject: Question about invoice charges
Customer: Small Business Co (Standard)
Body: My invoice shows $500 but I expected $400. Can you explain
the additional $100 charge? I'd like this clarified before payment.
```

**Classification:**
- **Urgency**: MEDIUM
- **Category**: billing
- **Routing**: finance
- **Reasoning**: Billing inquiry from standard customer, not blocking business, wants clarification, payment not processed yet, standard 4-hour SLA applies

### Example 3: General - LOW

```
Subject: How to export data to CSV
Customer: TechStartup Inc (Standard)
Body: I'm trying to export our user data to CSV but can't find
the export option. Not urgent, just planning for quarterly review.
```

**Classification:**
- **Urgency**: LOW
- **Category**: general
- **Routing**: support
- **Reasoning**: How-to question, user explicitly states "not urgent", feature question, can check KB first, 24-hour SLA acceptable

## Special Cases

### Escalation Triggers

Immediately escalate (regardless of category) if:
- **URGENT** urgency level
- **Enterprise customer + HIGH** urgency
- **SLA at risk** (<20% time remaining)
- **Security breach** mentioned
- **Data loss** or corruption
- **Regulatory compliance** issue

### Auto-Resolve Candidates

Consider KB auto-resolve if ALL true:
- **LOW urgency** only
- **General category**
- **High-confidence KB match** (>90%)
- **Common, documented issue**
- **No customer data involved**

### Ambiguous Cases

**Multiple issues in one ticket:**
- Classify by highest urgency issue
- Note multiple categories if present
- Route to team that handles most critical issue

**Missing information:**
- Assume Standard tier if not specified
- Classify conservatively (higher urgency if unclear)
- Note information gaps in analysis

## Output Format

Always provide structured classification:

```json
{
  "urgency": "URGENT|HIGH|MEDIUM|LOW",
  "category": "technical|billing|general",
  "routing": "engineering|finance|support|escalation",
  "customer_tier": "enterprise|standard|unknown",
  "sla_deadline": "Time when response is due",
  "key_indicators": ["keyword1", "keyword2", "keyword3"],
  "confidence": 0.95,
  "reasoning": "Brief explanation of classification",
  "escalation_needed": true|false,
  "auto_resolve_possible": true|false
}
```

## Quality Checklist

Before finalizing classification, verify:

- [ ] Urgency matches keyword indicators
- [ ] Category aligns with issue type
- [ ] Customer tier considered in SLA calculation
- [ ] Routing appropriate for category + urgency
- [ ] Special cases checked (escalation, auto-resolve)
- [ ] Confidence level appropriate

## Tips

### Finding Urgency Indicators

**Look for impact scope:**
- "all users" → URGENT
- "5,000 users" → HIGH
- "some users" → MEDIUM
- "just me" → LOW (unless enterprise)

**Look for business impact:**
- "blocking production" → URGENT/HIGH
- "affecting sales" → HIGH
- "inconvenient" → MEDIUM/LOW

### Categorizing Accurately

**Technical indicators:**
- Error codes, stack traces
- API, endpoint, integration
- Login, auth, database

**Billing indicators:**
- $, price, cost, charge
- Invoice, receipt, subscription
- Payment, refund, credit card

**General indicators:**
- Questions starting with "How"
- Feature names without errors
- Account, settings, profile

### Routing Decisions

**Route to engineering if:**
- Technical category + code/API/database
- Requires code changes or debugging

**Route to finance if:**
- Billing category
- Payment processing needed

**Route to support if:**
- General category
- KB might have answer
- Can be resolved without engineering/finance

**Route to escalation if:**
- URGENT urgency
- Enterprise + HIGH + at risk
- Security or data loss

## Common Pitfalls

❌ **Don't:**
- Classify everything as URGENT (crying wolf reduces trust)
- Ignore customer tier (enterprise = faster SLA)
- Miss keywords in subject line (often contains urgency)
- Categorize based on team availability (classify by issue type)
- Skip KB search for common questions (wastes human time)

✅ **Do:**
- Read full ticket body (key details often buried)
- Note affected user count (scale matters)
- Check for enterprise customer mentions
- Look for error codes and stack traces
- Consider business impact beyond technical severity
- Suggest KB search for LOW priority how-to questions

## Success Criteria

A good classification should:

1. ✅ Match urgency to SLA requirements
2. ✅ Route to correct team for resolution
3. ✅ Consider customer tier and business impact
4. ✅ Identify escalation needs proactively
5. ✅ Enable auto-resolution when safe
6. ✅ Provide clear reasoning for decisions
