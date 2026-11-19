/**
 * GitHub File Summarizer Agent
 *
 * Deliverable: summarizeGitHubFile() function using Claude Agent SDK
 * with GitHub MCP server to fetch and summarize files from public repos.
 *
 * Features demonstrated:
 * - Async generator input mode (streaming pattern)
 * - MCP server connection status handling
 * - Tool naming convention (mcp__<server>__<tool>)
 * - Wildcard tool patterns
 * - Structured outputs with Zod validation
 */

import dotenv from "dotenv";
dotenv.config({ override: true });
import { z } from "zod";
import { query } from "@anthropic-ai/claude-agent-sdk";

const model = process.env.ANTHROPIC_MODEL;
if (!model) {
  throw new Error("ANTHROPIC_MODEL is not set");
}

// -----------------------------------------------------------------------------
// Exported Types (Zod Schemas for Structured Output)
// -----------------------------------------------------------------------------

export const GitHubFileSummarySchema = z.object({
  repo: z.string().describe("Repository in format owner/repo"),
  path: z.string().describe("File path within the repository"),
  purpose: z.string().describe("The main purpose of this file"),
  keySections: z.array(z.string()).describe("Key sections or functions in the file"),
  patterns: z.array(z.string()).describe("Notable patterns or techniques used"),
  summary: z.string().describe("Brief overall summary of the file"),
});

export type GitHubFileSummary = z.infer<typeof GitHubFileSummarySchema>;

// Convert to JSON Schema using Zod's built-in method, strip extra keys
const { $schema, additionalProperties, ...GitHubFileSummaryJSONSchema } = z.toJSONSchema(GitHubFileSummarySchema) as Record<string, unknown>;

// -----------------------------------------------------------------------------
// Async Generator Input Mode (Streaming Pattern)
// This is the recommended pattern for MCP/streaming compatibility
// -----------------------------------------------------------------------------

async function* generateMessages(userMessage: string) {
  yield {
    type: "user" as const,
    message: { role: "user" as const, content: userMessage },
    parent_tool_use_id: null,
    session_id: "github-summarizer-session",
  };
}

// -----------------------------------------------------------------------------
// Exported Function: summarizeGitHubFile()
// -----------------------------------------------------------------------------

export async function summarizeGitHubFile(
  owner: string,
  repo: string,
  path: string
): Promise<GitHubFileSummary> {
  console.log(`Summarizing file from GitHub - ${owner}/${repo}/${path}`);

  const userMessage = `You have access to GitHub via MCP.

        Fetch and summarize the file from this repository:
        - Owner: ${owner}
        - Repository: ${repo}
        - File path: ${path}

        Steps:
        1. Use the appropriate mcp tool from github MCP server to fetch the file. if that doesnt work, explain the error clearly
        2. Analyze the content
        3. Return structured data with:
          - repo: "${owner}/${repo}"
          - path: "${path}"
          - purpose: Main purpose of the file
          - keySections: Key sections or functions
          - patterns: Notable patterns or techniques used
          - summary: Brief overall summary`;

  try {
    for await (const message of query({
      prompt: generateMessages(userMessage),
      options: {
        mcpServers: {
          github: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-github'],
            env: {
              GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_TOKEN || ''
            }
          }
        },
        model,
        allowedTools: ["mcp__github__*"],
        // Structured output configuration
        outputFormat: {
          type: "json_schema",
          schema: GitHubFileSummaryJSONSchema,
        },
      },
    })) {
      // Check MCP server connection status on init
      if (message.type === "system" && message.subtype === "init") {
        console.log("Available MCP tools:", message.mcp_servers);
      }

      if (message.type === "assistant") {
        const content = message.message?.content;
        console.log('[Assistant]:', content);
        if (Array.isArray(content)) {
          for (const block of content) {
            if (block.type === "tool_use") {
              console.log(`[Tool]: ${block.name}`);
            }
          }
        }
      }
      // Handle structured output result
      if (message.type === "result") {
        if (message.subtype === "success" && message.structured_output) {
          console.log("Structured output received, validating against schema...", message.structured_output);
          return GitHubFileSummarySchema.parse(message.structured_output);
        }
      }
    }
  } catch (error) {
    throw new Error("Failed to get structured output from agent");
  }

  throw new Error("Error occured. Could not summarize GitHub file.");
}
