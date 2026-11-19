# Exercise: Design a TDD Strategy for a Shopping Cart Module

## Objective

Create a TDD strategy for a shopping cart module, then use Claude Code to generate tests from your requirements. The shopping cart code has intentional gaps that your tests should expose.

## Learning Goals

- Write natural language requirements that enable AI test generation
- Identify edge cases that AI might miss without business context
- Design a red-green-refactor sequence for incremental development
- Evaluate AI-generated tests for correctness and completeness

## Project Structure

```
exercise/starter/
├── src/
│   ├── shopping-cart.ts       # Implementation with intentional gaps
│   ├── shopping-cart.test.ts  # Starter tests (add AI-generated tests here)
│   └── index.ts               # Demo runner
├── tdd-strategy.md            # Your deliverable
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

## Your Tasks

### Task 1: Write requirements in `tdd-strategy.md`

Complete the requirements for all 5 cart operations (add item, remove item, update quantity, apply promo code, calculate totals). Each requirement should specify inputs, expected outputs, validation rules, and error conditions.

### Task 2: Identify edge cases AI might miss

List at least 5 edge cases in the strategy document that require human domain knowledge. For each, explain why AI might miss it and how you would test it.

### Task 3: Design a red-green-refactor sequence

Plan the order of test implementation and code development in the strategy document. Start with core functionality, then edge cases, then refactoring.

### Task 4: Generate tests with Claude Code

Use Claude Code to generate tests based on your requirements:

```
Read the shopping cart requirements in tdd-strategy.md and generate
a comprehensive Vitest test suite with happy paths and edge cases.
```

Paste the generated tests into `shopping-cart.test.ts` below the starter tests.

### Task 5: Include a sample AI-generated test in your deliverable

Copy one generated test into the "Sample AI-Generated Test" section of `tdd-strategy.md` and write your assessment of its quality.

## Run

```bash
npm start              # See the demo with intentional gaps
npm test               # Run tests (some may fail due to gaps)
npm run test:coverage  # Run tests with coverage report
```

## Success Criteria

- [ ] All 5 cart operations have clear requirements in `tdd-strategy.md`
- [ ] 5+ edge cases identified with rationale
- [ ] Coverage targets defined with rationale
- [ ] Red-green-refactor sequence is logical and incremental
- [ ] Sample AI-generated test included with your assessment
