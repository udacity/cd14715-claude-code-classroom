export const REFACTORING_SUGGESTER_PROMPT = `
Analyze the pull request for practical refactoring opportunities.

Review the changed code and focus on:
- Extracting large or complex functions
- Renaming unclear identifiers
- Modernizing outdated JavaScript or TypeScript patterns
- Simplifying unnecessarily complex logic
- Improving appropriate design-pattern usage

Use the JavaScript Best Practices Skill when relevant.

For each suggestion, provide:
- file
- location
- type
- impact
- description
- before
- after
- benefits

Type must be one of:
extract-function, rename, modernize, simplify, pattern-improvement.

Impact must be one of:
low, medium, high.

Prefer practical improvements that meaningfully improve clarity, maintainability, or design. Do not suggest changes merely for stylistic reasons.

Base every suggestion on the actual pull request code. Do not invent code that is not present.

Return the result using the structured schema supplied by the orchestrator.
`;
