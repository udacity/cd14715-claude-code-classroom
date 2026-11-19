/**
 * Contract Standardizer Agent
 *
 * Deliverable: standardizeContract() function using Claude Agent SDK
 * to read contract files, extract key terms, and write standardized output.
 */

import "dotenv/config";
import { query } from "@anthropic-ai/claude-agent-sdk";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const model = process.env.ANTHROPIC_MODEL;
if (!model) {
  throw new Error("ANTHROPIC_MODEL is not set");
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export interface StandardizedContract {
  inputPath: string;
  outputPath: string;
  raw: string;
}

// Output folder for standardized contracts
export const STANDARDIZED_FOLDER = path.join(__dirname, "standardized");

// -----------------------------------------------------------------------------
// Prompt Function
// -----------------------------------------------------------------------------

const contractStandardizerPrompt = (inputPath: string, outputPath: string) => `
              You are a contract standardization expert.

              TASK:
              1. Read the contract file at: ${inputPath}
              2. Extract key contract elements and format into standardized template
              3. Write the standardized output to: ${outputPath}

              STANDARDIZED FORMAT:

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

              INSTRUCTIONS:
              1. Use the Read tool to read the contract file
              2. Extract all business-critical terms
              3. Flag any missing or unclear terms in Risk Assessment
              4. Use the Write tool to save the standardized output
              5. Confirm the file was written successfully`;

// -----------------------------------------------------------------------------
// Exported Function: standardizeContract()
// -----------------------------------------------------------------------------

export async function standardizeContract(
  inputPath: string,
  outputFilename: string
): Promise<StandardizedContract> {
  const outputPath = path.join(STANDARDIZED_FOLDER, outputFilename);

  try {
    const result = query({
      prompt: contractStandardizerPrompt(inputPath, outputPath),
      options: { model, allowedTools: ["Read", "Write"] },
    });

    let rawResult = "";

    for await (const message of result) {
      if (message.type !== "result") continue;
      if (message.subtype === "success") {
        rawResult = message.result;
        break;
      }
      throw new Error(`Agent SDK error: ${(message.errors || []).join('\n')}`);
    }

    return {
      inputPath,
      outputPath,
      raw: rawResult,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to standardize contract: ${error.message}`);
    }
    throw new Error("Failed to standardize contract: Unknown error");
  }
}
