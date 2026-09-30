import { query } from '@anthropic-ai/claude-agent-sdk';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { codeQualityAnalyzer } from './agents/code-quality-analyzer.js';
import { testCoverageAnalyzer } from './agents/test-coverage-analyzer.js';
import { refactoringSuggester } from './agents/refactoring-suggester.js';
import { mcpServersConfig } from './config/mcp.config.js';
import { orchestratorPrompt } from './prompts/orchestrator.prompt.js';
import {
  ReviewReportSchema,
  type ReviewReport,
} from './types/report-types.js';

export interface OrchestratorOptions {
  model?: string;
}

export class CodeReviewOrchestrator {
  private readonly options: OrchestratorOptions;

  constructor(options: OrchestratorOptions = {}) {
    this.options = options;
  }

  async reviewPullRequest(
    owner: string,
    repo: string,
    prNumber: number
  ): Promise<ReviewReport> {
    const startTime = Date.now();

    const prompt = `
${orchestratorPrompt}

Repository owner: ${owner}
Repository name: ${repo}
Pull request number: ${prNumber}

Review this pull request using the GitHub MCP server.

Delegate the analysis to these specialized agents using Task:
1. code-quality-analyzer
2. test-coverage-analyzer
3. refactoring-suggester

Run the specialized analyses in parallel when possible.

Then aggregate their results into one ReviewReport.

If one agent fails, continue with the other available results and produce
the best valid report possible.

Return ONLY the structured ReviewReport.
`;

    const messages = query({
      prompt,
      options: {
        model: this.options.model ?? process.env.ANTHROPIC_MODEL,
        allowedTools: ['Task', 'Read', 'Glob', 'Grep', 'Skill'],
        agents: {
          'code-quality-analyzer': codeQualityAnalyzer,
          'test-coverage-analyzer': testCoverageAnalyzer,
          'refactoring-suggester': refactoringSuggester,
        },
        mcpServers: mcpServersConfig as any,
        outputFormat: {
          type: 'json_schema',
          schema: zodToJsonSchema(
            ReviewReportSchema as any,
            { $refStrategy: 'none' }
          ) as Record<string, unknown>,
        },
      },
    });

    let structuredOutput: unknown = undefined;
    let textResult = '';

    for await (const message of messages) {
      if (
        typeof message === 'object' &&
        message !== null &&
        'structured_output' in message
      ) {
        structuredOutput = (
          message as { structured_output?: unknown }
        ).structured_output;
      }

      if (
        typeof message === 'object' &&
        message !== null &&
        'result' in message
      ) {
        const result = (message as { result?: unknown }).result;

        if (typeof result === 'string') {
          textResult = result;
        }
      }
    }

    let rawReport: unknown = structuredOutput;

    if (rawReport === undefined && textResult) {
      try {
        rawReport = JSON.parse(textResult);
      } catch {
        throw new Error(
          'The orchestrator returned a response that was not valid JSON.'
        );
      }
    }

    if (rawReport === undefined) {
      throw new Error('The orchestrator did not return a review report.');
    }

    const validated = ReviewReportSchema.parse(rawReport);

    return {
      ...validated,
      pullRequest: {
        owner,
        repo,
        number: prNumber,
      },
      metadata: {
        ...validated.metadata,
        analyzedAt: new Date().toISOString(),
        duration: Date.now() - startTime,
        agentVersions: {
          'code-quality-analyzer': '1.0.0',
          'test-coverage-analyzer': '1.0.0',
          'refactoring-suggester': '1.0.0',
        },
      },
    };
  }
}
