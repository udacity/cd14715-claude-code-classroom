---
name: sla-calculation
description: "Calculate SLA deadlines for support tickets based on customer tier and urgency. Use when determining response deadlines, checking SLA compliance, or when user asks about SLA, deadline, or response time requirements."
allowed-tools: Read
---

# SLA Calculation
## SLA Matrix

| Customer Tier | Urgency | Response Time | Coverage |
|---------------|---------|---------------|----------|
| Enterprise | URGENT | Immediate (15 min) | 24/7 |
| Enterprise | HIGH | 1 hour | 24/7 |
| Enterprise | MEDIUM | 4 hours | Business hours |
| Enterprise | LOW | 24 hours | Business hours |
| Standard | URGENT | 1 hour | 24/7 |
| Standard | HIGH | 4 hours | Business hours |
| Standard | MEDIUM | 4 hours | Business hours |
| Standard | LOW | 24 hours | Business hours |

**Business hours**: Monday–Friday, 9:00 AM – 5:00 PM (local timezone). Business-hours SLAs pause on weekends/holidays; 24/7 SLAs continue.

## Calculation Workflow

1. **Gather inputs**: submission time, customer tier, urgency, current time, timezone (default UTC)
2. **Look up SLA** from the matrix above → response time window + coverage type
3. **Calculate deadline**:
   - **24/7 coverage**: `deadline = submission_time + response_time`
   - **Business hours coverage**: use the algorithm below
4. **Validate**: confirm the deadline falls within business hours (for business-hours SLAs) and that `time_remaining >= 0`
5. **Assess risk and escalate**:
   - **On track** (> 50% remaining): monitor
   - **At risk** (20–50% remaining): alert team lead
   - **Critical** (< 20% remaining): escalate to senior engineer
   - **Breached** (past deadline): alert manager + create incident

## Business Hours Algorithm

```
remaining_sla = sla_hours
current = max(submission_time, next_business_start(submission_time))  # if outside hours, advances to next weekday 9 AM
while remaining_sla > 0:
    day_end = same_day(current, 17:00)
    available = day_end - current
    if available >= remaining_sla:
        deadline = current + remaining_sla
        break
    remaining_sla -= available
    current = next_business_day(current, 09:00)  # skip weekends/holidays
```

## Output Format

```json
{
  "ticket_id": "TICK-12345",
  "customer_tier": "enterprise",
  "urgency": "HIGH",
  "sla_window": "1 hour",
  "coverage_type": "24/7",
  "deadline": "2025-01-17T15:00:00Z",
  "time_remaining": "30 minutes",
  "percent_remaining": 50,
  "risk_level": "on_track",
  "escalation_needed": false
}
```

## Escalation Triggers

- **< 20% remaining + unassigned** → escalate to available engineer
- **< 10% remaining + no senior** → escalate to senior engineer
- **SLA breached** → alert manager + create incident
- **Enterprise ticket at risk** → alert team lead

## Special Cases

- **Immediate (URGENT)**: auto-acknowledge instantly, 15-min response window, page on-call, escalate if not picked up in 5 min
- **Timezone**: calculate in customer's timezone, store as UTC, display in customer's timezone; default UTC if unknown
- **Multiple SLA tiers**: apply the strictest (shortest response time) and document which rule applied

See [examples.md](examples.md) for worked scenarios: weekend carryover, holiday handling, cross-timezone, partial business days, at-risk monitoring, and common calculation errors.
