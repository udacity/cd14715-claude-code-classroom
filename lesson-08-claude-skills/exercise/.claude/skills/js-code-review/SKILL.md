# JavaScript Code Review Skill

## Expertise

JavaScript and TypeScript code review with focus on code quality, best practices, potential bugs, and maintainability. Provides expert-level analysis for modern JavaScript/ES6+ codebases.

## Capabilities

- Detecting code quality issues and anti-patterns
- Identifying potential bugs and runtime errors
- Reviewing error handling practices
- Analyzing code maintainability and readability
- Checking for security vulnerabilities
- Recommending modern JavaScript best practices

## Analysis Criteria

### Code Quality Issues

**Variable Declarations**
- Problem: Using `var` instead of `let`/`const`
- Impact: Hoisting bugs, scope confusion
- Fix: Use `const` by default, `let` when reassignment needed

**Unused Variables**
- Problem: Declared but never used
- Impact: Dead code, confusion, larger bundle
- Fix: Remove or use the variable

**Console Statements**
- Problem: `console.log` left in production code
- Impact: Information leakage, performance
- Fix: Remove or use proper logging library

**Magic Numbers/Strings**
- Problem: Hardcoded values without explanation
- Impact: Maintainability, clarity
- Fix: Extract to named constants

### Potential Bugs

**Loose Equality**
- Problem: Using `==` instead of `===`
- Impact: Type coercion bugs
- Fix: Always use strict equality `===`

**Missing Error Handling**
- Problem: No try/catch for async operations
- Impact: Unhandled promise rejections
- Fix: Add proper error handling

**Null/Undefined Access**
- Problem: Accessing properties without null checks
- Impact: Runtime errors
- Fix: Use optional chaining `?.` or null checks

**Array Mutation in Loops**
- Problem: Modifying array while iterating
- Impact: Skipped elements, infinite loops
- Fix: Use filter/map or iterate backwards

### Security Issues

**eval() Usage**
- Problem: Executing dynamic code
- Impact: Critical - code injection
- Fix: Remove eval, use safer alternatives

**innerHTML Assignment**
- Problem: Setting HTML from untrusted sources
- Impact: XSS vulnerabilities
- Fix: Use textContent or sanitize input

**Hardcoded Secrets**
- Problem: API keys, passwords in code
- Impact: Credential exposure
- Fix: Use environment variables

### Best Practices

**Arrow Functions**
- Prefer arrow functions for callbacks
- Use regular functions for methods needing `this`

**Destructuring**
- Use object/array destructuring for cleaner code
- Avoid excessive nesting

**Async/Await**
- Prefer async/await over .then() chains
- Handle errors with try/catch

**Early Returns**
- Return early to reduce nesting
- Avoid else after return

## Red Flags (Immediate Attention)

- `eval()` or `new Function()` with dynamic input
- `innerHTML` with user-provided content
- Credentials or API keys in source code
- `var` in modern codebase
- Synchronous XMLHttpRequest
- `document.write()` usage
- Missing `await` on async function calls

## Output Format

Return JSON with:
```json
{
  "filename": "path/to/file.js",
  "issues": [
    {
      "line": 10,
      "severity": "error" | "warning" | "info",
      "category": "bug" | "security" | "quality" | "style",
      "rule": "no-var",
      "message": "Description of the issue",
      "suggestion": "How to fix it"
    }
  ],
  "summary": {
    "errors": 2,
    "warnings": 3,
    "info": 1
  },
  "qualityScore": 75,
  "recommendations": [
    "Top priority improvements"
  ]
}
```

## Examples

### Example 1: Common Issues

**Input:**
```javascript
var data = fetchData();
console.log(data);
if (data.status == 'success') {
  data.items.forEach(item => {
    processItem(item)
  })
}
```

**Analysis:**
```json
{
  "filename": "example.js",
  "issues": [
    {
      "line": 1,
      "severity": "warning",
      "category": "quality",
      "rule": "no-var",
      "message": "Use 'const' or 'let' instead of 'var'",
      "suggestion": "const data = fetchData();"
    },
    {
      "line": 1,
      "severity": "error",
      "category": "bug",
      "rule": "missing-await",
      "message": "fetchData() appears to be async but is not awaited",
      "suggestion": "const data = await fetchData();"
    },
    {
      "line": 2,
      "severity": "warning",
      "category": "quality",
      "rule": "no-console",
      "message": "Unexpected console statement",
      "suggestion": "Remove or use a logging library"
    },
    {
      "line": 3,
      "severity": "warning",
      "category": "bug",
      "rule": "eqeqeq",
      "message": "Use '===' instead of '=='",
      "suggestion": "if (data.status === 'success')"
    },
    {
      "line": 4,
      "severity": "info",
      "category": "bug",
      "rule": "optional-chaining",
      "message": "data.items could be undefined",
      "suggestion": "data.items?.forEach(...) or add null check"
    }
  ],
  "summary": {
    "errors": 1,
    "warnings": 3,
    "info": 1
  },
  "qualityScore": 60,
  "recommendations": [
    "Add await for async fetchData() call",
    "Use strict equality checks throughout",
    "Remove console.log before production"
  ]
}
```

### Example 2: Security Issues

**Input:**
```javascript
const API_KEY = "sk-1234567890abcdef";
const userInput = document.getElementById("input").value;
document.getElementById("output").innerHTML = userInput;
eval("processData(" + userInput + ")");
```

**Analysis:**
```json
{
  "filename": "security.js",
  "issues": [
    {
      "line": 1,
      "severity": "error",
      "category": "security",
      "rule": "no-hardcoded-credentials",
      "message": "API key exposed in source code",
      "suggestion": "Use environment variable: process.env.API_KEY"
    },
    {
      "line": 3,
      "severity": "error",
      "category": "security",
      "rule": "no-innerHTML",
      "message": "innerHTML with user input creates XSS vulnerability",
      "suggestion": "Use textContent or sanitize the input"
    },
    {
      "line": 4,
      "severity": "error",
      "category": "security",
      "rule": "no-eval",
      "message": "eval() with user input allows code injection",
      "suggestion": "Remove eval, use proper function calls"
    }
  ],
  "summary": {
    "errors": 3,
    "warnings": 0,
    "info": 0
  },
  "qualityScore": 20,
  "recommendations": [
    "CRITICAL: Remove hardcoded API key immediately",
    "CRITICAL: Remove eval() usage",
    "Replace innerHTML with safe alternatives"
  ]
}
```

### Example 3: Clean Code

**Input:**
```javascript
const fetchUserData = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch user', { userId, error });
    throw new UserNotFoundError(userId);
  }
};
```

**Analysis:**
```json
{
  "filename": "clean.js",
  "issues": [],
  "summary": {
    "errors": 0,
    "warnings": 0,
    "info": 0
  },
  "qualityScore": 100,
  "recommendations": [
    "Code follows best practices",
    "Good error handling pattern",
    "Consider adding JSDoc for documentation"
  ]
}
```
