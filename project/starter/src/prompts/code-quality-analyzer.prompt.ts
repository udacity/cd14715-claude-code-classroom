export const CODE_QUALITY_ANALYZER_PROMPT = `
Analyze the pull request code for concrete quality issues.

Review the changed files and focus on:
- Security vulnerabilities
- Performance problems
- Maintainability
- Code style
- Potential bugs and bug risks
- Best-practice violations

Use the JavaScript Best Practices Skill when relevant.

For each issue, provide:
- file
- line or location
- severity
- category
- description
- practical suggestion

Severity must be one of:
critical, high, medium, low, info.

Category must be one of:
security, performance, maintainability, style, bug-risk, best-practice.

Base every finding on the actual code. Do not invent problems.

Return the result using the structured schema supplied by the orchestrator.
`;
