import { describe, it, expect } from 'vitest';
import { CodeReviewOrchestrator } from '../src/orchestrator.js';
import { RateLimiter } from '../src/utils/rate-limiter.js';
import { ReviewReportSchema } from '../src/types/report-types.js';

/**
 * Tests for CodeReviewOrchestrator
 *
 * Note: These tests validate the structure and configuration.
 * Full integration tests require actual API keys and should be run manually.
 */

describe('CodeReviewOrchestrator', () => {
  describe('Configuration', () => {
    it('should initialize with default options', () => {
      const orchestrator = new CodeReviewOrchestrator();
      expect(orchestrator).toBeDefined();
      expect(orchestrator).toBeInstanceOf(CodeReviewOrchestrator);
    });

    it('should accept custom rate limit configuration', () => {
      const customRateLimiter = new RateLimiter({
        maxRequestsPerMinute: 10,
        maxTokensPerMinute: 50000,
        maxConcurrent: 2
      });

      const orchestrator = new CodeReviewOrchestrator({
        rateLimiter: customRateLimiter,
        agentTimeout: 60000
      });

      expect(orchestrator).toBeDefined();
      expect(orchestrator).toBeInstanceOf(CodeReviewOrchestrator);
    });
  });

  describe('Type Validation', () => {
    it('should have ReviewReport schema with correct structure', () => {
      const mockReport = {
        pullRequest: {
          owner: 'test',
          repo: 'test-repo',
          number: 123
        },
        fileReviews: [],
        summary: {
          totalFiles: 0,
          overallScore: 0,
          criticalIssues: 0,
          highPriorityTests: 0,
          refactoringOpportunities: 0
        },
        recommendations: [],
        metadata: {
          analyzedAt: new Date().toISOString(),
          duration: 1000,
          agentVersions: {
            'code-quality': '1.0.0',
            'test-coverage': '1.0.0',
            'refactoring': '1.0.0'
          }
        }
      };

      const result = ReviewReportSchema.safeParse(mockReport);
      expect(result.success).toBe(true);
    });

    it('should reject invalid ReviewReport structure', () => {
      const invalidReport = {
        pullRequest: {
          owner: 'test'
          // Missing required fields
        }
      };

      const result = ReviewReportSchema.safeParse(invalidReport);
      expect(result.success).toBe(false);
    });
  });

  describe('Integration', () => {
    // These tests require actual API keys and should be skipped in CI
    it.skip('should review a real small PR', async () => {
      // To run this test manually:
      // 1. Set ANTHROPIC_API_KEY and ANTHROPIC_MODEL in your .env
      // 2. Optionally set GITHUB_TOKEN for higher rate limits
      // 3. Run: npm test -- --run orchestrator.test.ts
      //
      // Example usage:
      // const orchestrator = new CodeReviewOrchestrator();
      // const report = await orchestrator.reviewPullRequest('owner', 'repo', 1);
      // expect(report).toBeDefined();
      // expect(report.summary.totalFiles).toBeGreaterThan(0);
    });
  });
});
