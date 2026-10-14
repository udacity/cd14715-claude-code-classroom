import { beforeEach, describe, expect, it, vi } from 'vitest';

const { queryMock } = vi.hoisted(() => ({
  queryMock: vi.fn(),
}));

vi.mock('@anthropic-ai/claude-agent-sdk', () => ({
  query: queryMock,
}));

vi.mock('../src/config/mcp.config', () => ({
  mcpServersConfig: {},
}));

vi.mock('../src/agents', () => ({
  codeQualityAnalyzer: {},
  testCoverageAnalyzer: {},
  refactoringSuggester: {},
}));

import { CodeReviewOrchestrator } from '../src/orchestrator';

const validReport = {
  pullRequest: {
    owner: 'test-owner',
    repo: 'test-repo',
    number: 123,
  },
  fileReviews: [],
  summary: {
    totalFiles: 0,
    overallScore: 0,
    criticalIssues: 0,
    highPriorityTests: 0,
    refactoringOpportunities: 0,
  },
  recommendations: [],
  metadata: {
    analyzedAt: '2026-09-26T00:00:00Z',
    duration: 0,
    agentVersions: {
      orchestrator: '1.0.0',
      'code-quality-analyzer': '1.0.0',
      'test-coverage-analyzer': '1.0.0',
      'refactoring-suggester': '1.0.0',
    },
  },
};

async function* resultStream(structuredOutput: unknown) {
  yield {
    type: 'result',
    structured_output: structuredOutput,
  };
}

describe('CodeReviewOrchestrator', () => {
  beforeEach(() => {
    queryMock.mockReset();
  });

  describe('Configuration', () => {
    it('should initialize with default options', () => {
      const orchestrator = new CodeReviewOrchestrator();

      expect(orchestrator).toBeInstanceOf(CodeReviewOrchestrator);
    });

    it('should accept custom options', () => {
      const orchestrator = new CodeReviewOrchestrator({
        model: 'test-model',
        cwd: '/tmp/test-project',
      });

      expect(orchestrator).toBeInstanceOf(CodeReviewOrchestrator);
    });
  });

  describe('reviewPullRequest', () => {
    it('should fetch PR files from GitHub MCP', async () => {
      queryMock.mockReturnValue(resultStream(validReport));

      const orchestrator = new CodeReviewOrchestrator({
        model: 'test-model',
        cwd: '/tmp/test-project',
      });

      await orchestrator.reviewPullRequest('test-owner', 'test-repo', 123);

      expect(queryMock).toHaveBeenCalledTimes(1);

      const [request] = queryMock.mock.calls[0];

      expect(request.prompt).toContain('test-owner');
      expect(request.prompt).toContain('test-repo');
      expect(request.prompt).toContain('123');
      expect(request.options.mcpServers).toBeDefined();
    });

    it('should provide all 3 specialized subagents', async () => {
      queryMock.mockReturnValue(resultStream(validReport));

      const orchestrator = new CodeReviewOrchestrator();

      await orchestrator.reviewPullRequest('owner', 'repo', 1);

      const [request] = queryMock.mock.calls[0];

      expect(request.options.agents).toEqual({
        'code-quality-analyzer': {},
        'test-coverage-analyzer': {},
        'refactoring-suggester': {},
      });
    });

    it('should acquire and release the configured rate limiter', async () => {
      queryMock.mockReturnValue(resultStream(validReport));

      const rateLimiter = {
        acquire: vi.fn().mockResolvedValue(undefined),
        release: vi.fn(),
      };

      const orchestrator = new CodeReviewOrchestrator({
        rateLimiter,
        estimatedTokens: 2500,
      });

      await orchestrator.reviewPullRequest('owner', 'repo', 1);

      expect(rateLimiter.acquire).toHaveBeenCalledTimes(1);
      expect(rateLimiter.acquire).toHaveBeenCalledWith(2500);
      expect(rateLimiter.release).toHaveBeenCalledTimes(1);
    });

    it('should aggregate results into ReviewReport', async () => {
      queryMock.mockReturnValue(resultStream(validReport));

      const orchestrator = new CodeReviewOrchestrator();

      const report = await orchestrator.reviewPullRequest(
        'owner',
        'repo',
        1
      );

      expect(report.pullRequest).toEqual(validReport.pullRequest);
      expect(report.fileReviews).toEqual([]);
      expect(report.summary).toEqual(validReport.summary);
      expect(report.recommendations).toEqual([]);
      expect(report.metadata.agentVersions).toEqual(
        validReport.metadata.agentVersions
      );
    });

    it('should validate output with Zod schema', async () => {
      queryMock.mockReturnValue(resultStream(validReport));

      const orchestrator = new CodeReviewOrchestrator();

      await expect(
        orchestrator.reviewPullRequest('owner', 'repo', 1)
      ).resolves.toMatchObject({
        pullRequest: validReport.pullRequest,
        summary: validReport.summary,
      });

      queryMock.mockReturnValue(
        resultStream({
          invalid: true,
        })
      );

      await expect(
        orchestrator.reviewPullRequest('owner', 'repo', 1)
      ).rejects.toThrow('Invalid review report');
    });
  });

  describe('Integration', () => {
    it.skip('should review a real small PR', async () => {
      // Requires real API credentials and GitHub access.
    });
  });
});
