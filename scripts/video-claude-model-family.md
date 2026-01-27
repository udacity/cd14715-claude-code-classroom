# Video: Claude 4.5 Model Family
*Module 1.1 | Topic: Introduction to Claude 4.5 Model Architecture*

---

## Opening Hook

> *"You're about to build an AI-powered application. You open the Anthropic docs and see three models: Haiku, Sonnet, and Opus. They all say 'Claude 4.5.' So what's the difference? Picking the wrong one could mean your app is too slow, too expensive, or just not smart enough. Let's break down exactly what each model does best—and when to use it."*

---

## Key Discussion Points

1. **The Claude 4.5 model family overview**
   - Three tiers designed for different use cases
   - Haiku: Speed and efficiency optimized
   - Sonnet: Balanced performance (the "default" choice)
   - Opus: Maximum capability for complex tasks
   - All share the same architecture foundation, differ in size/capability

2. **Performance benchmarks that matter**
   - SWE-bench scores: How well models handle real software engineering tasks [will attach an aimage of the comparison]
   - Reasoning benchmarks: Multi-step problem solving
   - Speed benchmarks: Tokens per second, time to first token
   - Why benchmarks matter: They predict real-world performance

3. **Cost-performance tradeoffs**
   - Pricing structure: Input tokens vs output tokens
   - Haiku: ~$1/$5 per million tokens (input/output)
   - Sonnet: ~$3/$15 per million tokens
   - Opus: ~$15/$25 per million tokens
   - The 5-15x cost difference is significant at scale
   - Cost isn't just money—it's also latency and throughput

4. **When to use each tier**
   - **Haiku**: Fast drafts, UI scaffolding, quick fixes
   - **Sonnet**: Daily work, routine coding, most tasks (the recommended default)
   - **Opus**: Deep architectural reasoning, complex multi-file refactoring, final reviews before release
   - The decision framework: Start small, upgrade when quality demands it

5. **Common misconceptions**
   - "Bigger is always better" - FALSE: Haiku often matches larger models on simple tasks
   - "Cost is the only difference" - FALSE: Speed and latency differ significantly
   - "Just use Opus for everything" - FALSE: Overpowered models can overthink simple problems

6. **Model selection as a design decision**
   - Different parts of your system can use different models
   - Routing layer (Haiku) → Processing layer (Sonnet) → Analysis layer (Opus)
   - This is a preview of multi-agent architecture (covered in Module 3)

---

## Examples to Include

| Example | Description | Level of Detail |
|---------|-------------|-----------------|
| SWE-bench comparison | Show benchmark scores for all three models on coding tasks | Walkthrough - explain what the numbers mean |
| Pricing calculator | "If you process 1M requests/month, here's the cost difference" | Brief mention with concrete numbers |
| Task complexity spectrum | Visual showing task types mapped to appropriate models | Deep dive - this is the core mental model |
| Latency comparison | Time to first token and total response time differences | Brief mention - important for real-time apps |

---

## What NOT to Cover

- API implementation details (authentication, SDK setup) - covered in Module 1.2
- Code examples using the models - covered in Module 1.2 demo
- Extended thinking capabilities - covered in Module 2
- Agentic workflows and multi-model systems - covered in Module 3

---

## Additional Notes

- Students should leave understanding the "why" before they see the "how" in 1.2
- Emphasize the mental model: "right tool for the job" 
- The weather alert scenario from 1.2 can be mentioned as a preview: "In the next module, you'll implement a system that routes different complexity alerts to different models"
- Analogy: "Think of it like hiring. You don't need a senior architect to answer the phone, but you do need one to design the building. Match the expertise to the task.

---
