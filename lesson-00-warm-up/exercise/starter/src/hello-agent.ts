/**
 * Warm-Up: Hello Agent SDK
 *
 * This script does the same thing you just did with Claude Code —
 * asks Claude to describe the repository — but from TypeScript
 * using the Claude Agent SDK.
 */

import "dotenv/config";
import { query } from "@anthropic-ai/claude-agent-sdk";

const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929";

if (!model) {
  throw new Error(
    "ANTHROPIC_MODEL is not set. Make sure your environment variables are configured."
  );
}

async function main() {
  console.log("=".repeat(60));
  console.log("  WARM-UP: Hello Agent SDK");
  console.log("  Asking Claude to describe this repository...");
  console.log("=".repeat(60));
  console.log();

  const result = query({
    prompt:
      "Read the top-level package.json and briefly list the lesson topics in this repository. Keep it under 200 words.",
    options: {
      model,
      allowedTools: ["Read"],
    },
  });

  for await (const message of result) {
    if (message.type !== "result") continue;

    if (message.subtype === "success") {
      console.log(message.result);
    } else {
      console.error("Agent error:", message.errors?.join("\n"));
    }
  }
}

main().catch(console.error);
