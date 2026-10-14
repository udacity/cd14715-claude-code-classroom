export const TEST_COVERAGE_ANALYZER_PROMPT = `
Analyze the pull request for test coverage and missing tests.

Review the changed files and existing test files. Focus on:
- Whether changed code has corresponding tests
- Missing test files
- Untested functions and classes
- Untested branches
- Untested edge cases
- Error and failure paths
- Important integration or behavior scenarios

Use the JavaScript Best Practices Skill when relevant.

For each untested path, provide:
- file
- location
- type
- priority
- reasoning
- suggestedTest

Type must be one of:
function, class, branch, edge-case.

Priority must be one of:
critical, high, medium, low.

Estimate relevant test coverage from 0 to 100.

Base the analysis on the actual pull request and available tests. Do not invent existing tests or claim coverage that cannot be verified.

Return the result using the structured schema supplied by the orchestrator.
`;
