---
name: sla-calculation
description: Calculate SLA deadlines for support tickets based on customer tier and urgency. Use when determining response deadlines, checking SLA compliance, or when user asks about SLA, deadline, or response time requirements.
allowed-tools: Read
---

# SLA Calculation Skill

This skill teaches Claude how to calculate Service Level Agreement (SLA) deadlines for support tickets.

## When to Use This Skill

Use this skill when the user requests:
- "Calculate SLA for this ticket"
- "When is the response due?"
- "What's the deadline for this ticket?"
- "Check SLA compliance"
- "Is this ticket at risk?"

## SLA Matrix

### Response Time Requirements

| Customer Tier | Urgency | Response Time | Business Hours |
|--------------|---------|---------------|----------------|
| **Enterprise** | URGENT | Immediate | 24/7 |
| **Enterprise** | HIGH | < 1 hour | 24/7 |
| **Enterprise** | MEDIUM | < 4 hours | Business hours |
| **Enterprise** | LOW | < 24 hours | Business hours |
| **Standard** | URGENT | < 1 hour | 24/7 |
| **Standard** | HIGH | < 4 hours | Business hours |
| **Standard** | MEDIUM | < 4 hours | Business hours |
| **Standard** | LOW | < 24 hours | Business hours |

### Business Hours Definition

- **Business hours**: Monday-Friday, 9:00 AM - 5:00 PM (local timezone)
- **24/7 coverage**: For Enterprise URGENT/HIGH and all URGENT tickets
- **Weekend/holiday handling**: Business hours SLAs pause, 24/7 SLAs continue

## Calculation Process

### Step 1: Identify Inputs

Gather:
- **Submission time**: When ticket was created
- **Customer tier**: Enterprise or Standard
- **Urgency level**: URGENT, HIGH, MEDIUM, LOW
- **Current time**: For calculating time remaining
- **Timezone**: Customer's local timezone (default: UTC)

### Step 2: Determine SLA Window

From the matrix above, find:
- Response time requirement
- Business hours vs 24/7

### Step 3: Calculate Deadline

**For 24/7 SLAs:**
```
deadline = submission_time + response_time
```

**For Business Hours SLAs:**
```
1. Start from submission_time
2. Add response_time in business hours only
3. Skip weekends and holidays
4. Calculate final deadline
```

### Step 4: Calculate Time Remaining

```
time_remaining = deadline - current_time
percent_remaining = (time_remaining / total_sla_time) * 100
```

### Step 5: Determine Risk Level

- **On track**: >50% time remaining (green)
- **At risk**: 20-50% time remaining (yellow)
- **Critical**: <20% time remaining (red)
- **Breached**: Past deadline (red alert)

## Examples

See [examples.md](examples.md) for detailed calculation scenarios.

### Example 1: Enterprise URGENT - 24/7

**Inputs:**
- Submission: Monday 2:00 PM
- Tier: Enterprise
- Urgency: URGENT
- SLA: Immediate

**Calculation:**
- Response time: Immediate (interpret as 15 minutes for system purposes)
- Coverage: 24/7
- Deadline: Monday 2:15 PM
- Type: Page on-call immediately

### Example 2: Standard MEDIUM - Business Hours

**Inputs:**
- Submission: Friday 4:00 PM
- Tier: Standard
- Urgency: MEDIUM
- SLA: < 4 hours (business hours)

**Calculation:**
- Response time: 4 business hours
- Coverage: Business hours (M-F 9am-5pm)
- Friday 4pm + 1 hour = Friday 5pm (end of day)
- Remaining 3 hours → Monday 9am + 3 hours
- **Deadline: Monday 12:00 PM**

### Example 3: Enterprise HIGH - 24/7

**Inputs:**
- Submission: Saturday 10:00 PM
- Tier: Enterprise
- Urgency: HIGH
- SLA: < 1 hour

**Calculation:**
- Response time: 1 hour
- Coverage: 24/7 (enterprise high priority)
- Deadline: Saturday 11:00 PM
- Weekend doesn't matter (24/7 coverage)

## Business Hours Calculation Rules

### Same Day Submission

If submitted during business hours with time remaining:
```
submission: Monday 2pm
SLA: 4 business hours
Monday 2pm + 4 hours = Monday 6pm

BUT: Business hours end at 5pm
Monday 2pm → 5pm = 3 hours used
Remaining: 1 hour carries to Tuesday 9am
Deadline: Tuesday 10am
```

### Weekend Submission

Business hours SLAs start next business day:
```
submission: Saturday 10am
SLA: 4 business hours
Next business day: Monday 9am
Monday 9am + 4 hours = Monday 1pm
Deadline: Monday 1pm
```

### Holiday Handling

Holidays counted as non-business days:
```
submission: Thursday 3pm (day before holiday Friday)
SLA: 4 business hours
Thursday 3pm → 5pm = 2 hours used
Holiday Friday: skipped
Monday 9am + 2 hours = Monday 11am
Deadline: Monday 11am
```

## Escalation Triggers

Escalate when:
- **< 20% time remaining** and still unassigned
- **< 10% time remaining** and not with senior engineer
- **SLA breached** → Alert manager + create incident
- **Enterprise ticket** at risk → Alert team lead

## Output Format

```json
{
  "ticket_id": "TICK-12345",
  "submission_time": "2025-01-17T14:00:00Z",
  "customer_tier": "enterprise|standard",
  "urgency": "URGENT|HIGH|MEDIUM|LOW",
  "sla_window": "1 hour",
  "coverage_type": "24/7|business_hours",
  "deadline": "2025-01-17T15:00:00Z",
  "current_time": "2025-01-17T14:30:00Z",
  "time_remaining": "30 minutes",
  "percent_remaining": 50,
  "risk_level": "on_track|at_risk|critical|breached",
  "escalation_needed": false,
  "next_checkpoint": "2025-01-17T14:48:00Z"
}
```

## Special Cases

### Immediate Response (URGENT)

"Immediate" = operational definition:
- **Immediate acknowledgment**: Auto-reply sent immediately
- **Initial response**: < 15 minutes
- **On-call paging**: Immediately upon classification
- **Escalation**: If not picked up in 5 minutes

### Timezone Handling

If ticket includes timezone:
- Calculate deadline in customer's timezone
- Convert to UTC for system tracking
- Display in customer's timezone in responses

If timezone unknown:
- Default to UTC
- Note assumption in output
- Recommend timezone confirmation

### Multiple SLA Tiers

Some tickets qualify for multiple SLAs:
- Enterprise customer + URGENT → Use strictest (Immediate)
- Take minimum response time when ambiguous
- Document which SLA rule applied

## Quality Checklist

Before finalizing SLA calculation:

- [ ] Customer tier identified correctly
- [ ] Urgency level confirmed
- [ ] Business hours vs 24/7 determined
- [ ] Weekends/holidays accounted for
- [ ] Timezone handled appropriately
- [ ] Risk level calculated accurately
- [ ] Escalation triggers checked

## Integration with Classification

Typically used after ticket classification:
1. Classify ticket (urgency + category)
2. Calculate SLA deadline
3. Check time remaining
4. Determine if escalation needed
5. Route to appropriate queue with priority

## Tips

**Calculating business hours:**
- Count only M-F 9am-5pm
- Skip weekends entirely
- Holidays = non-business days
- Partial days calculated hour-by-hour

**Handling edge cases:**
- Submission at 4:59pm → 1 minute to EOD, rest next day
- Submission at 5:01pm → Starts next business day at 9am
- Submission during holiday → Starts next business day

**Risk monitoring:**
- Auto-check SLA status every 15 minutes
- Alert at 50%, 20%, 10%, 0%
- Escalate before breach, not after

## Success Criteria

A good SLA calculation should:
1. ✅ Be accurate within 1 minute
2. ✅ Account for business hours correctly
3. ✅ Handle timezones appropriately
4. ✅ Identify escalation needs proactively
5. ✅ Provide clear risk status
6. ✅ Enable SLA monitoring and reporting
