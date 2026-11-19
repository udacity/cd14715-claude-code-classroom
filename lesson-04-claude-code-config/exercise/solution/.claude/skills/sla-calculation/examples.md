# SLA Calculation Examples

Detailed examples showing how to calculate SLA deadlines in various scenarios.

## Example 1: Simple 24/7 SLA

**Scenario**: Enterprise customer, HIGH urgency, weekday

**Inputs:**
- Customer: Acme Corp (Enterprise)
- Submission: Monday, 2:00 PM
- Urgency: HIGH
- SLA: < 1 hour (24/7 coverage)

**Calculation:**
```
submission_time = Monday 14:00
sla_window = 1 hour
coverage = 24/7 (enterprise high)
deadline = Monday 14:00 + 1:00 = Monday 15:00
```

**Result:**
- Deadline: Monday 3:00 PM
- Coverage: 24/7
- Risk level: Calculate based on current time

---

## Example 2: Business Hours with Weekend Carryover

**Scenario**: Standard customer, MEDIUM urgency, Friday afternoon

**Inputs:**
- Customer: Small Biz Inc (Standard)
- Submission: Friday, 4:00 PM
- Urgency: MEDIUM
- SLA: < 4 hours (business hours only)

**Calculation:**
```
submission_time = Friday 16:00
sla_window = 4 business hours
business_hours = M-F 9:00-17:00

Step 1: Calculate time remaining Friday
Friday 16:00 → 17:00 = 1 hour used
Remaining SLA: 3 hours

Step 2: Weekend doesn't count (business hours only)
Saturday and Sunday: skipped

Step 3: Resume Monday morning
Monday 09:00 + 3 hours = Monday 12:00
```

**Result:**
- Deadline: Monday 12:00 PM
- Coverage: Business hours
- Weekend paused the SLA clock

---

## Example 3: Enterprise URGENT on Weekend

**Scenario**: Enterprise customer, URGENT, Saturday night

**Inputs:**
- Customer: BigCorp LLC (Enterprise)
- Submission: Saturday, 10:30 PM
- Urgency: URGENT
- SLA: Immediate (interpret as 15 min for system)

**Calculation:**
```
submission_time = Saturday 22:30
sla_window = Immediate (15 minutes operational)
coverage = 24/7 (enterprise urgent)
deadline = Saturday 22:30 + 0:15 = Saturday 22:45

Actions:
- Auto-acknowledge immediately
- Page on-call engineer
- Alert manager if not picked up in 5 min
```

**Result:**
- Deadline: Saturday 10:45 PM
- Coverage: 24/7 (weekend doesn't matter)
- Escalation: Immediate paging

---

## Example 4: Holiday Week Calculation

**Scenario**: Standard customer, LOW urgency, Thursday before 3-day weekend

**Inputs:**
- Customer: Startup Co (Standard)
- Submission: Thursday, 3:00 PM
- Urgency: LOW
- SLA: < 24 hours (business hours)
- Holiday: Friday is holiday

**Calculation:**
```
submission_time = Thursday 15:00
sla_window = 24 business hours
business_hours = M-F 9:00-17:00
holiday = Friday

Step 1: Thursday remaining
Thursday 15:00 → 17:00 = 2 hours used
Remaining SLA: 22 hours

Step 2: Friday is holiday (skipped)

Step 3: Weekend (skipped)

Step 4: Resume Monday
Monday 09:00 + 22 hours = over 2 days
Monday: 9am-5pm = 8 hours (14 remaining)
Tuesday: 9am-5pm = 8 hours (6 remaining)
Wednesday: 9am + 6 hours = Wednesday 15:00
```

**Result:**
- Deadline: Wednesday 3:00 PM
- Business days used: Thu (2h), Mon (8h), Tue (8h), Wed (6h)
- Holiday and weekend paused SLA

---

## Example 5: Cross-Timezone Ticket

**Scenario**: Enterprise customer in different timezone

**Inputs:**
- Customer: Global Inc (Enterprise, London = UTC+0)
- Submission: Tuesday, 2:00 AM UTC (10:00 PM Monday London)
- Urgency: HIGH
- SLA: < 1 hour (24/7)
- System timezone: UTC

**Calculation:**
```
submission_time_utc = Tuesday 02:00 UTC
submission_time_london = Monday 22:00 GMT
sla_window = 1 hour
coverage = 24/7

deadline_utc = Tuesday 03:00 UTC
deadline_london = Monday 23:00 GMT
```

**Result:**
- Deadline (UTC): Tuesday 3:00 AM
- Deadline (London): Monday 11:00 PM
- Display to customer: Monday 11:00 PM GMT

---

## Example 6: Partial Business Day

**Scenario**: Standard customer, late afternoon submission

**Inputs:**
- Customer: MidSize Corp (Standard)
- Submission: Wednesday, 4:30 PM
- Urgency: HIGH
- SLA: < 4 hours (business hours)

**Calculation:**
```
submission_time = Wednesday 16:30
sla_window = 4 business hours
business_hours_end = 17:00

Step 1: Time remaining Wednesday
Wednesday 16:30 → 17:00 = 0.5 hours (30 minutes)
Remaining SLA: 3.5 hours

Step 2: Resume Thursday morning
Thursday 09:00 + 3.5 hours = Thursday 12:30
```

**Result:**
- Deadline: Thursday 12:30 PM
- Wednesday partial day: 30 minutes
- Thursday: 3 hours 30 minutes

---

## Example 7: At-Risk Ticket

**Scenario**: Ticket approaching SLA breach

**Inputs:**
- Customer: Enterprise Corp
- Submission: Monday, 2:00 PM
- Current time: Monday, 2:50 PM
- Urgency: HIGH
- SLA: < 1 hour
- Deadline: Monday, 3:00 PM

**Calculation:**
```
submission_time = Monday 14:00
deadline = Monday 15:00
current_time = Monday 14:50

time_elapsed = 14:50 - 14:00 = 50 minutes
time_remaining = 15:00 - 14:50 = 10 minutes
total_sla = 60 minutes

percent_remaining = (10 / 60) * 100 = 16.67%
risk_level = CRITICAL (<20%)
```

**Result:**
- Time remaining: 10 minutes (16.67%)
- Risk level: CRITICAL
- Action: Immediate escalation needed
- Next checkpoint: N/A (already critical)

---

## Example 8: Multiple SLA Levels

**Scenario**: Enterprise customer with URGENT issue

**Inputs:**
- Customer: Fortune 500 Corp (Enterprise, Platinum tier)
- Urgency: URGENT
- Potential SLAs:
  - Enterprise HIGH: < 1 hour
  - Enterprise URGENT: Immediate
  - Platinum tier: < 30 minutes (custom SLA)

**Calculation:**
```
Option 1: Standard Enterprise URGENT = Immediate
Option 2: Platinum tier custom = 30 minutes
Option 3: URGENT baseline = Immediate

Selected SLA: Use strictest = Immediate
```

**Result:**
- Applied SLA: Immediate (15 min operational)
- Reasoning: URGENT takes precedence
- Note: Document Platinum tier for reference

---

## SLA Monitoring Example

**Real-time monitoring for a ticket:**

```json
{
  "ticket_id": "TICK-789",
  "submission": "Monday 14:00",
  "deadline": "Monday 15:00",
  "checkpoints": [
    {
      "time": "Monday 14:30",
      "percent_remaining": 50,
      "status": "on_track",
      "action": "Monitor"
    },
    {
      "time": "Monday 14:48",
      "percent_remaining": 20,
      "status": "at_risk",
      "action": "Alert team lead"
    },
    {
      "time": "Monday 14:54",
      "percent_remaining": 10,
      "status": "critical",
      "action": "Escalate to senior + alert manager"
    },
    {
      "time": "Monday 15:01",
      "percent_remaining": -1,
      "status": "breached",
      "action": "Create incident, notify leadership"
    }
  ]
}
```

---

## Common Calculation Errors

### Error 1: Forgetting Weekend Pause

**Wrong:**
```
Friday 4pm + 4 hours = Friday 8pm ❌
```

**Correct:**
```
Friday 4pm → 5pm = 1 hour
Weekend paused
Monday 9am + 3 hours = Monday 12pm ✅
```

### Error 2: Not Accounting for Timezone

**Wrong:**
```
Customer in Tokyo (UTC+9)
Submission: 10pm local
Calculated in UTC without conversion ❌
```

**Correct:**
```
Convert to UTC: 10pm JST = 1pm UTC
Calculate SLA in UTC
Display result in customer's timezone ✅
```

### Error 3: Treating Immediate as Zero

**Wrong:**
```
URGENT = 0 minutes ❌
```

**Correct:**
```
URGENT = Immediate acknowledgment + 15 min response ✅
```

---

## Quick Reference Table

| Scenario | Customer | Urgency | SLA | Notes |
|----------|----------|---------|-----|-------|
| Production down | Enterprise | URGENT | Immediate | Page on-call |
| API errors | Enterprise | HIGH | 1 hour | 24/7 coverage |
| Invoice question | Standard | MEDIUM | 4 hours | Business hours |
| Feature request | Standard | LOW | 24 hours | Business hours |
| Security breach | Any | URGENT | Immediate | Escalate immediately |
| Friday 4pm | Standard | MEDIUM | 4 hours | Mon 12pm deadline |
| Weekend | Enterprise | HIGH | 1 hour | 24/7 continues |
| Holiday | Standard | LOW | 24 hours | Resume next business day |
