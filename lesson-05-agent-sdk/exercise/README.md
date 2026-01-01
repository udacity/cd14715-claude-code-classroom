# Exercise: Claude Agent SDK - Contract Standardizer

Build an agent to standardize vendor contracts for legal review.

## Scenario

Your procurement team receives contracts in wildly different formats. Your legal team spends hours reformatting them to compare terms. Build an agent that extracts key terms and formats them into a consistent structure.

## Project Structure

```
src/
├── contract-standardizer.ts # Exported function (deliverable)
├── sample-contracts.ts      # 4 test contracts
└── index.ts                 # Tests for the function
```

## Setup

```bash
npm install
```

Create `.env`:
```
ANTHROPIC_API_KEY=your-key-here
```

## Run

```bash
npm start
```

## Deliverable: contract-standardizer.ts

```typescript
export interface StandardizedContract {
  raw: string;
}

export async function standardizeContract(
  contractText: string
): Promise<StandardizedContract>
```

## Tests (index.ts)

| Step | Description |
|------|-------------|
| 1 | Standardize SaaS agreement (well-structured) |
| 2 | Standardize email proposal (sparse details) |
| 3 | Test all 4 contract types |

## Standardized Output Format

```markdown
## Contract Summary

### Parties
- **Vendor:** [Name]
- **Customer:** [Name]

### Term
- **Effective Date:** [Date]
- **Duration:** [Length]

### Financial Terms
- **Payment Amount:** [Amount]
- **Payment Frequency:** [Frequency]

### Legal Terms
- **Liability Cap:** [Terms]
- **Termination Notice:** [Period]

### IP & Data
- **IP Ownership:** [Terms]
- **Data Protection:** [Terms]

### Risk Assessment
- [Red flags or missing terms]
```

## 4 Test Contracts

| Type | Description |
|------|-------------|
| saas | Well-structured SaaS agreement |
| consulting | Less formal consulting SOW |
| vendor | Complex vendor MSA |
| email | Minimal email proposal |

## Key Takeaway

Agent SDK enables building domain-specific document processors. Clear prompts with output templates ensure consistent results. For legal docs, focus on business-critical terms.
