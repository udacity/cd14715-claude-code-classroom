---
description: "Analyzes communication style in messages identifying assertive, passive, aggressive, or passive-aggressive patterns"
---

# Communication Style Analyzer Skill

## Expertise

Identifies communication patterns and styles in written messages. Helps users understand their communication tendencies and how they may be perceived by recipients.

## Capabilities

- Classifying communication style (assertive, passive, aggressive, passive-aggressive)
- Identifying language patterns that indicate each style
- Highlighting specific phrases or sentence structures
- Recommending assertive alternatives when needed

## Communication Styles

### Assertive (Ideal)
Clear, direct, and respectful communication that expresses needs while respecting others.

**Characteristics:**
- Uses "I" statements ("I need", "I would like")
- Direct requests with clear expectations
- Acknowledges others' perspectives
- Confident but not domineering

**Example phrases:**
- "I would appreciate if you could..."
- "I need this by Friday to meet the deadline."
- "I understand your concern, and here's my perspective..."

### Passive
Avoids direct expression of needs, often deferring to others excessively.

**Characteristics:**
- Excessive hedging ("maybe", "sort of", "I guess")
- Over-apologizing ("Sorry to bother you...")
- Minimizing own needs ("It's not a big deal, but...")
- Asking permission unnecessarily ("If it's okay with you...")

**Example phrases:**
- "Sorry to bother you, but if you have time..."
- "I don't know if this is right, but maybe..."
- "It's probably nothing, but I was wondering..."

### Aggressive
Dominates or dismisses others, often through blame or demands.

**Characteristics:**
- Blaming language ("You always...", "You never...")
- Demands without consideration ("Do this now")
- Dismissive of others ("That's ridiculous")
- All caps or excessive punctuation

**Example phrases:**
- "You need to fix this immediately!!!"
- "This is completely unacceptable."
- "I shouldn't have to explain this again."

### Passive-Aggressive
Indirect expression of negative feelings through subtle behaviors.

**Characteristics:**
- Backhanded compliments
- Sarcasm or veiled criticism
- Silent treatment references
- Guilt-inducing language

**Example phrases:**
- "Fine, I'll just do it myself since no one else can."
- "I'm not upset, I just find it interesting that..."
- "Must be nice to have so much free time."

## Output Format

Return JSON with:
```json
{
  "primaryStyle": "assertive" | "passive" | "aggressive" | "passive-aggressive",
  "confidence": 0.0-1.0,
  "indicators": [
    {
      "phrase": "exact text from message",
      "style": "which style this indicates",
      "explanation": "why this phrase indicates that style"
    }
  ],
  "assessment": "Brief overall assessment",
  "suggestions": ["How to make communication more assertive"]
}
```

## Examples

### Example 1: Passive Style

**Input:**
```
Sorry to bother you, I know you're really busy. If it's not too much trouble,
I was wondering if maybe you could possibly look at my report? It's probably
fine, but I'm not sure. No rush at all, whenever you have time is fine.
```

**Analysis:**
```json
{
  "primaryStyle": "passive",
  "confidence": 0.95,
  "indicators": [
    {
      "phrase": "Sorry to bother you",
      "style": "passive",
      "explanation": "Over-apologizing for a reasonable request"
    },
    {
      "phrase": "if maybe you could possibly",
      "style": "passive",
      "explanation": "Excessive hedging undermines the request"
    },
    {
      "phrase": "It's probably fine",
      "style": "passive",
      "explanation": "Self-dismissive, minimizing own needs"
    }
  ],
  "assessment": "The message undermines its own purpose through excessive hedging and apologizing.",
  "suggestions": [
    "Remove 'sorry to bother you' - your request is legitimate",
    "State clearly: 'Could you review my report by Thursday?'",
    "Remove 'probably fine' - be direct about what you need"
  ]
}
```

### Example 2: Assertive Style

**Input:**
```
Hi Alex,

I've completed the initial draft of the proposal. I'd appreciate your feedback
by Thursday so I can incorporate changes before the Friday deadline.

Let me know if you have any questions about the approach I've taken.

Thanks,
Jordan
```

**Analysis:**
```json
{
  "primaryStyle": "assertive",
  "confidence": 0.92,
  "indicators": [
    {
      "phrase": "I'd appreciate your feedback by Thursday",
      "style": "assertive",
      "explanation": "Clear request with specific timeline"
    },
    {
      "phrase": "so I can incorporate changes before the Friday deadline",
      "style": "assertive",
      "explanation": "Provides reasoning, shows planning"
    },
    {
      "phrase": "Let me know if you have any questions",
      "style": "assertive",
      "explanation": "Open to dialogue while maintaining ownership"
    }
  ],
  "assessment": "Well-balanced communication that is clear, respectful, and professional.",
  "suggestions": []
}
```

### Example 3: Aggressive Style

**Input:**
```
This report is completely wrong. I don't know how you thought this was
acceptable to submit. Fix it NOW and don't make me ask again.
```

**Analysis:**
```json
{
  "primaryStyle": "aggressive",
  "confidence": 0.98,
  "indicators": [
    {
      "phrase": "completely wrong",
      "style": "aggressive",
      "explanation": "Absolute, dismissive language"
    },
    {
      "phrase": "I don't know how you thought this was acceptable",
      "style": "aggressive",
      "explanation": "Belittling, questions judgment"
    },
    {
      "phrase": "Fix it NOW",
      "style": "aggressive",
      "explanation": "Demanding, capitalization adds hostility"
    },
    {
      "phrase": "don't make me ask again",
      "style": "aggressive",
      "explanation": "Threatening language"
    }
  ],
  "assessment": "Hostile communication that attacks rather than instructs. Likely to create defensiveness.",
  "suggestions": [
    "Identify specific issues instead of 'completely wrong'",
    "Use: 'I found some issues that need attention'",
    "Provide a reasonable deadline: 'Could you revise by tomorrow?'"
  ]
}
```
