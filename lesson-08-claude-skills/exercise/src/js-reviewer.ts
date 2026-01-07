/**
 * JavaScript Code Reviewer Agent
 *
 * Deliverable: reviewJavaScriptFile() function using Claude Agent SDK
 * with the js-code-review skill loaded from .claude/skills/
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

export interface CodeReviewResult {
  filename: string;
  raw: string;
}

// -----------------------------------------------------------------------------
// Prompt Function
// -----------------------------------------------------------------------------

const reviewPrompt = (filePath: string) => `You are a JavaScript code reviewer.

Use the js-code-review skill to analyze the JavaScript file at:
${filePath}

Steps:
1. Read the file using the Read tool
2. Use the js-code-review skill to analyze the code
3. Return a comprehensive review in the skill's output format

Focus on:
- Code quality issues (var, console.log, unused variables)
- Potential bugs (loose equality, missing await, null access)
- Security issues (eval, innerHTML, hardcoded secrets)
- Best practices recommendations`;

// -----------------------------------------------------------------------------
// Exported Function: reviewJavaScriptFile()
// -----------------------------------------------------------------------------

export async function reviewJavaScriptFile(filePath: string): Promise<CodeReviewResult> {
  let rawResult = "";

  for await (const message of query({
    prompt: reviewPrompt(filePath),
    options: {
      cwd: PROJECT_ROOT,
      settingSources: ["project"],
      allowedTools: ["Skill", "Read", "Grep", "Glob"],
    },
  })) {
    if (message.type === 'assistant') {
      // Check for tool use
      const content = message.message?.content;
      if (Array.isArray(content)) {
        for (const block of content) {
           if (block.type === 'tool_use') {
            console.log(`[Tool]: ${block.name} Tool Invoked`);
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
    filename: path.basename(filePath),
    raw: rawResult,
  };
}
