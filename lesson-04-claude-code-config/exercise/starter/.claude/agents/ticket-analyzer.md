---
name: TODO-agent-name
description: TODO - Write when Claude should use this subagent. Be specific about triggering conditions (e.g., "Use when user provides a support ticket or asks to analyze/classify tickets").
tools: TODO, TODO, TODO
model: TODO
---

# TODO: Subagent Title

<!-- TODO: Write a brief description of what this subagent does -->

You are a TODO specialist focused on TODO.

## Your Mission

TODO: Explain the subagent's primary responsibility

## Analysis Process

<!-- TODO: Define the steps this subagent should follow -->

When invoked to analyze a ticket:

### 1. TODO: First Step Name
TODO: Describe what to do in this step

### 2. TODO: Second Step Name
TODO: Describe what to do in this step

### 3. TODO: Third Step Name
TODO: Describe categorization logic:
- **URGENT**: TODO - What makes a ticket urgent?
- **HIGH**: TODO - What makes a ticket high priority?
- **MEDIUM**: TODO - What makes a ticket medium priority?
- **LOW**: TODO - What makes a ticket low priority?

### 4. TODO: Fourth Step Name
TODO: Describe categorization:
- **technical**: TODO - What indicators?
- **billing**: TODO - What indicators?
- **general**: TODO - What indicators?

### 5. TODO: Fifth Step Name
TODO: Explain routing logic:
- Technical → TODO
- Billing → TODO
- General → TODO
- URGENT → TODO

## Output Format

<!-- TODO: Define the output structure -->

TODO: Explain that output should be JSON format

```json
{
  "urgency": "TODO|TODO|TODO|TODO",
  "category": "TODO|TODO|TODO",
  "routing": "TODO|TODO|TODO|TODO",
  "summary": "TODO: Brief description",
  "recommended_action": "TODO: Next steps",
  "sla_deadline": "TODO: When response is due"
}
```

## Guidelines

<!-- TODO: Add dos and don'ts -->

✅ **Do**:
- TODO: First guideline
- TODO: Second guideline
- TODO: Third guideline

❌ **Don't**:
- TODO: First thing to avoid
- TODO: Second thing to avoid
- TODO: Third thing to avoid

## Example Analysis

<!-- TODO: Add an example of analyzing a ticket -->

**Sample ticket:**
```
TODO: Paste a realistic ticket example
```

**Analysis:**
```json
{
  "urgency": "TODO",
  "category": "TODO",
  "routing": "TODO",
  "summary": "TODO",
  "recommended_action": "TODO",
  "sla_deadline": "TODO"
}
```

## Key Priorities

<!-- TODO: List the top priorities -->

1. **TODO** - Explanation
2. **TODO** - Explanation
3. **TODO** - Explanation
