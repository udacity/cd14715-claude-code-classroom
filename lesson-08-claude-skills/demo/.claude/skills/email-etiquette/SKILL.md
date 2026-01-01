# Email Etiquette Skill

## Expertise

Professional email communication for business contexts. Provides guidance on tone, structure, clarity, and common mistakes in professional emails.

## Capabilities

- Assesses email tone (too casual, too formal, or appropriate)
- Identifies clarity and structure issues
- Checks for common mistakes (typos, grammar, missing context)
- Validates appropriate greetings and sign-offs
- Suggests improvements for professionalism

## Analysis Criteria

### Tone Assessment

**Too Casual** (inappropriate for business):
- Slang or colloquialisms ("hey", "gonna", "yeah")
- Emojis in professional context
- Incomplete sentences or fragments
- Overly familiar language with superiors/clients

**Too Formal** (overly stiff):
- Legal language in casual business context
- Unnecessary jargon or complexity
- Extremely rigid structure
- Outdated formality ("To Whom It May Concern")

**Appropriate** (professional yet friendly):
- Clear, respectful language
- Complete sentences with proper grammar
- Appropriate greeting and sign-off
- Friendly but professional tone

### Structure Checklist

- [ ] Clear, specific subject line
- [ ] Appropriate greeting (Hi/Hello [Name], or Dear [Name])
- [ ] Purpose stated in first 1-2 sentences
- [ ] Action items or requests clearly defined
- [ ] Professional sign-off (Best regards, Thank you, etc.)
- [ ] Contact information if needed

### Red Flags

- Missing context (recipient won't understand background)
- Emotional language (anger, frustration, sarcasm)
- Unclear call-to-action (what do you want recipient to do?)
- Typos or grammar errors
- All caps (appears aggressive)
- Missing or inappropriate subject line

## Output Format

Return JSON with:
```json
{
  "tone": "appropriate" | "too-casual" | "too-formal",
  "issues": [
    {
      "type": "tone" | "structure" | "clarity" | "grammar",
      "severity": "low" | "medium" | "high",
      "description": "What the issue is",
      "suggestion": "How to fix it"
    }
  ],
  "score": 1-10,
  "revisedEmail": "Optional suggested rewrite"
}
```

## Examples

### Example 1: Too Casual

**Input:**
```
hey boss, need you to sign off on that thing asap thx
```

**Analysis:**
- Tone: too-casual
- Issues:
  - "hey" is too casual for supervisor (high severity)
  - "that thing" lacks specificity (high severity)
  - "asap thx" is too informal (medium severity)
  - Missing proper greeting and sign-off (medium severity)
- Score: 2/10

**Revised:**
```
Hi [Name],

Could you please review and approve the Q4 budget proposal I sent yesterday?
I need approval by Friday to meet the deadline.

Thank you!
```

### Example 2: Appropriate

**Input:**
```
Hi Sarah,

Thank you for your feedback on the proposal. I've updated the timeline
section as you suggested. Please let me know if you need any other changes.

Best regards,
Alex
```

**Analysis:**
- Tone: appropriate
- Issues: None
- Score: 9/10 (clear, professional, specific)

### Example 3: Too Formal

**Input:**
```
Dear Sir or Madam,

I am writing to hereby formally request your esteemed consideration of the
aforementioned matter pertaining to the quarterly budget allocation as
previously discussed in our correspondence dated the 15th instant.

I remain, respectfully, your humble servant.
```

**Analysis:**
- Tone: too-formal
- Issues:
  - "Dear Sir or Madam" is outdated (medium severity)
  - Overly complex language obscures meaning (high severity)
  - "humble servant" is inappropriate for modern business (high severity)
- Score: 3/10

**Revised:**
```
Hi [Name],

I wanted to follow up on our discussion about the quarterly budget from
January 15th. Could you let me know your decision when you have a chance?

Thanks,
[Your name]
```
