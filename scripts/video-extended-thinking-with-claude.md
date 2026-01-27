# Video: Extended Thinking With Claude
*Module 2.1 | Topic: Introduction to Extended Thinking*

---

## Opening Hook

> *"When you solve a hard math problem, you don't just write the answer—you work through it step by step. What if an AI could do the same? Extended thinking lets Claude 'think out loud' before responding, and here's the surprising part: it doesn't just show you the reasoning, it actually makes Claude smarter on complex problems. Let's understand how this works."*

---

## Key Discussion Points

1. **What is extended thinking?**
   - Claude generates internal reasoning tokens BEFORE the visible response
   - These "thinking tokens" capture step-by-step analysis
   - The model explores possibilities, considers edge cases, and refines its approach
   - Result: Better answers on complex problems + transparent reasoning

2. **Thinking tokens vs response tokens**
   - Thinking tokens: Internal reasoning (can be captured for audit trails)
   - Response tokens: The final answer shown to users
   - Both are billed as output tokens at the same rate 
   - For Claude 4 models: API returns a summary of thinking (but you pay for full thinking tokens)

3. **Budget management**
   - It is important to manage How many tokens Claude can use for thinking
   - Higher budget = deeper reasoning = better quality on complex tasks
   - Lower budget = faster response = sufficient for simpler problems
   - Trade-off: Quality vs speed vs cost

4. **When extended thinking helps**
   - Multi-step reasoning problems (debugging, root cause analysis)
   - Ambiguous requirements that need exploration
   - High-stakes decisions where reasoning needs documentation
   - Complex analysis with multiple factors to weigh
   - Tasks where you need an audit trail for compliance

5. **When extended thinking is overkill**
   - Simple classification or extraction
   - Creative writing and content generation
   - Straightforward Q&A with clear answers
   - High-volume, low-complexity operations
   - Time-sensitive responses where latency matters

6. **Hybrid reasoning patterns**
   - Not all tasks need the same thinking depth
   - Pattern: Quick triage (no thinking) → Deep analysis (extended thinking)
   - Pattern: Draft with thinking → Refine without thinking
   - The best systems use extended thinking selectively

7. **The audit trail value**
   - Compliance: "How did the AI reach this conclusion?"
   - Debugging: Understanding why a response went wrong
   - Trust: Stakeholders can verify the reasoning
   - Learning: Improve prompts by seeing how Claude thinks

---

## Examples to Include

| Example | Description | Level of Detail |
|---------|-------------|-----------------|
| Thinking vs no-thinking comparison | Same complex problem, show quality difference | Deep dive - this is the "aha moment" |
| Token budget scenarios | Low budget vs high budget on a reasoning task | Walkthrough - show the trade-off |
| Hybrid pattern diagram | Visual showing when to use thinking vs not | Walkthrough - decision framework |

---

## What NOT to Cover

- API implementation (the `thinking` object, code syntax) - covered in Module 2.2
- Streaming extended thinking responses - advanced topic
- Model selection (which models support thinking) - covered in Module 1
- Specific use case implementations - covered in Module 2.2 demo/exercise

---

## Additional Notes

- Key insight: Extended thinking improves QUALITY, not just transparency
  - It's not just "showing work" - Claude actually reasons better
  - This is different from asking Claude to "think step by step" in the prompt (This is important to highlight in video)

- The incident analysis scenario from 2.2 can be previewed: "In the next module, you'll build an incident analyzer that captures thinking steps for stakeholder review"

- Analogy: "Extended thinking is like giving Claude a scratch pad. When you're solving a complex equation, writing out intermediate steps helps you avoid mistakes. Same principle."

- Mental model to establish:
  - Simple task → Direct response (fast, cheap)
  - Complex task → Extended thinking (slower, better)

---
