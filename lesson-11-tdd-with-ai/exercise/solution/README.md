# Solution: TDD Strategy for Shopping Cart Module

## Project Structure

```
exercise/solution/
├── src/
│   ├── shopping-cart.ts       # Complete implementation (all gaps fixed)
│   ├── shopping-cart.test.ts  # Comprehensive test suite (40+ tests)
│   └── index.ts               # Solution demo runner
├── tdd-strategy.md            # Complete TDD strategy document
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
npm start              # See the solution demo
npm test               # All 40+ tests pass
npm run test:coverage  # 95%+ coverage
```

## What You'll See

All intentional gaps from the starter have been fixed:

1. **Inventory validation** -- checks stock before adding items to the cart
2. **Quantity validation** -- rejects negative, zero, and non-integer values
3. **Promo code validation** -- enforces expiration dates, usage limits, and minimum purchase amounts
4. **Currency precision** -- rounds all monetary values to 2 decimal places
5. **Discount caps** -- respects the `maxDiscount` field on percentage promo codes

## Key Takeaway

Clear natural language requirements are the foundation of AI-assisted TDD. The strategy document drives test generation, human judgment catches business-specific edge cases that AI would miss, and coverage analysis identifies remaining gaps.
