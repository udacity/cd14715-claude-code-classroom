/**
 * Contract Standardizer Agent
 *
 * Deliverable: standardizeContract() function using Claude Agent SDK
 * to extract key terms and format into standardized template.
 */

import { query } from "@anthropic-ai/claude-agent-sdk";

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export interface StandardizedContract {
  raw: string;
}

// -----------------------------------------------------------------------------
// Prompt Function
// -----------------------------------------------------------------------------

const contractStandardizerPrompt = (contractText: string) => `You are a contract standardization expert.

When given contract text:
1. Extract key contract elements
2. Identify all parties, terms, and conditions
3. Format into a standardized template
4. Flag any missing or unclear terms

Format your response as:

## Contract Summary

### Parties
- **Vendor:** [Vendor Name]
- **Customer:** [Customer Name]

### Term
- **Effective Date:** [Date]
- **Duration:** [Length]

### Financial Terms
- **Payment Amount:** [Amount]
- **Payment Frequency:** [Frequency]
- **Payment Schedule:** [Details]

### Legal Terms
- **Liability Cap:** [Amount/Terms]
- **Termination Notice:** [Period]
- **Termination Conditions:** [Conditions]

### IP & Data
- **IP Ownership:** [Terms]
- **Data Protection:** [Terms]
- **Confidentiality:** [Terms]

### Special Provisions
- [Any notable clauses]

### Risk Assessment
- [Red flags or missing terms]

Be thorough and extract all business-critical terms.

The contract text is: ${contractText}`;

// -----------------------------------------------------------------------------
// Exported Function: standardizeContract()
// -----------------------------------------------------------------------------

export async function standardizeContract(contractText: string): Promise<StandardizedContract> {
  const result = query({
    prompt: contractStandardizerPrompt(contractText),
    options: { allowedTools: [] },
  });

  let rawResult = "";

  for await (const message of result) {
    if (message.type === "result" && message.subtype === "success") {
      rawResult = message.result;
      break;
    }
  }

  return {
    raw: rawResult,
  };
}
