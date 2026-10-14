import { query } from '@anthropic-ai/claude-agent-sdk';

import { globalRateLimiter, RateLimiter } from './utils';

import { mcpServersConfig } from './config/mcp.config';
import {
  codeQualityAnalyzer,
  testCoverageAnalyzer,
  refactoringSuggester,
} from './agents';
import { buildOrchestratorPrompt } from './prompts/orchestrator.prompt';
import {
  ReviewReportSchema,
  ReviewReport,
  ReviewReportJSONSchema,
} from './types/report-types';

export interface OrchestratorOptions {
  model?: string;
  cwd?: string;
  rateLimiter?: RateLimiter;
  estimatedTokens?: number;
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
    const startedAt = Date.now();
    const rateLimiter = this.options.rateLimiter ?? globalRateLimiter;
    const estimatedTokens = this.options.estimatedTokens ?? 1000;

    await rateLimiter.acquire(estimatedTokens);

    try {
      const prompt = buildOrchestratorPrompt(owner, repo, prNumber);

      const resultSchema = ReviewReportJSONSchema;

      const agents = {
        'code-quality-analyzer': codeQualityAnalyzer,
        'test-coverage-analyzer': testCoverageAnalyzer,
        'refactoring-suggester': refactoringSuggester,
      };

      const response = query({
        prompt,
        options: {
          model: this.options.model,
          cwd: this.options.cwd,
          mcpServers: mcpServersConfig,
          agents,
          allowedTools: [
            'Task',
            'Read',
            'Grep',
            'Glob',
          ],
          outputFormat: {
            type: 'json_schema',
            schema: resultSchema,
          },
        },
      });

      let structuredOutput: unknown;

      for await (const message of response) {
        if (
          message.type === 'result' &&
          'structured_output' in message
        ) {
          structuredOutput = message.structured_output;
        }
      }

      if (structuredOutput === undefined) {
        throw new Error(
          'Code review completed without a structured output result.'
        );
      }

      const validated = ReviewReportSchema.safeParse(structuredOutput);

      if (!validated.success) {
        throw new Error(
          `Invalid review report: ${validated.error.message}`
        );
      }

      const report = validated.data;

      return {
        ...report,
        metadata: {
          ...report.metadata,
          duration: Date.now() - startedAt,
        },
      };
    } finally {
      rateLimiter.release();
    }
  }
}
