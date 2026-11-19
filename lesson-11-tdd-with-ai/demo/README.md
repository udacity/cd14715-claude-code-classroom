# Demo: AI-Accelerated Test-Driven Development

## Scenario

You are building a **user authentication module** using TDD with AI assistance. Claude Code generates a comprehensive test suite from natural language requirements, then you implement the code to pass those tests following the red-green-refactor cycle.

The authentication module includes:
- Email/password validation with Zod schemas
- Password hashing with salted SHA-256
- JWT-like token generation and verification
- Rate limiting with account lockout after failed attempts

## Project Structure

```
demo/
├── src/
│   ├── auth.ts           # Authentication module (implementation)
│   ├── auth.test.ts      # AI-generated test suite (30+ tests)
│   └── index.ts          # Demo runner
├── .env.example
├── package.json
└── tsconfig.json
```

## Setup

```bash
npm install
```

## Authentication Setup

In Vocareum workspace, `ANTHROPIC_API_KEY`, `ANTHROPIC_BASE_URL`, and other required variables are **already configured** -- no setup needed.

For local development:

```bash
export ANTHROPIC_API_KEY=your-key-here
export ANTHROPIC_BASE_URL=your-base-url-here
```

## Run

```bash
npm start              # Run the demo
npm test               # Run all tests
npm run test:coverage  # Run tests with coverage report
```

## What You'll See

1. **Registration** -- validates email format and password strength, then creates a user with a hashed password
2. **Weak password rejections** -- demonstrates how AI-generated tests catch edge cases like short passwords, missing uppercase, and missing numbers
3. **Login and token flow** -- authenticates a user and issues a JWT-like token
4. **Rate limiting** -- locks an account after 5 consecutive failed login attempts

## Key Takeaway

AI accelerates TDD by generating comprehensive test suites from natural language requirements, but human judgment remains essential for identifying business-specific edge cases and validating that generated tests match the actual requirements.
