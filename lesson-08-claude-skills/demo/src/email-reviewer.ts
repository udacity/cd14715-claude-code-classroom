/**
 * Email Etiquette Reviewer Agent
 *
 * Deliverable: reviewEmail() function using Claude Agent SDK
 * with the email-etiquette skill loaded from .claude/skills/
 */

import { query } from "@anthropic-ai/claude-agent-sdk";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Project root where .claude/skills/ is located
const PROJECT_ROOT = path.resolve(__dirname, "..");

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export interface EmailReviewResult {
  raw: string;
}

// -----------------------------------------------------------------------------
// Prompt Function
// -----------------------------------------------------------------------------

const reviewPrompt = (emailContent: string) => `You are an email etiquette reviewer.

Use the email-etiquette skill to analyze this email: 

"""
${emailContent}
"""

Apply the skill's criteria to assess:
- Tone (too-casual, too-formal, or appropriate)
- Structure issues
- Clarity problems
- Grammar/spelling errors

Return the analysis in the skill's output format with issues, score, and optionally a revised email.`;

// -----------------------------------------------------------------------------
// Exported Function: reviewEmail()
// -----------------------------------------------------------------------------

export async function reviewEmail(emailContent: string): Promise<EmailReviewResult> {
  let rawResult = "";

  for await (const message of query({
    prompt: reviewPrompt(emailContent),
    options: {
      cwd: PROJECT_ROOT,
      settingSources: ["project"],
      allowedTools: ["Skill", "Read", "Grep", "Glob"],
    },
  })) {
    if (message.type === "assistant") {
      const content = message.message?.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block.type === "tool_use") {
            console.log(`[Tool]: ${block.name}`);
          }
        }
      }
    }
    if (message.type === "result" && message.subtype === "success") {
      rawResult = message.result;
      break;
    }
  }

  return {
    raw: rawResult,
  };
}
