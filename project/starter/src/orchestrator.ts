import { query } from '@anthropic-ai/claude-agent-sdk';
import { ReviewReport, ReviewReportSchema } from './types/report-types.js';
import { CodeQualityResult, TestCoverageResult, RefactoringSuggestion, FileAnalysisResult } from './types/analysis-results.js';
import { analyzeCodeQuality, analyzeTestCoverage, suggestRefactorings } from './agents/index.js';
import { buildOrchestratorPrompt } from './prompts/index.js';
import { mcpServersConfig } from './config/mcp.config.js';
import { logger, logReviewStart, logReviewComplete, logReviewError, logAgentStart, logAgentComplete } from './utils/logger.js';
import { RateLimiter, RateLimiterConfig } from './utils/rate-limiter.js';
import { withRetry, withTimeout } from './utils/error-handler.js';
import { SynthesisEngine } from './utils/synthesis-engine.js';

const model = process.env.ANTHROPIC_MODEL;

if (!model) {
  throw new Error('ANTHROPIC_MODEL is not set');
}

/**
 * Orchestrator configuration options
 */
export interface OrchestratorOptions {
  rateLimiter?: RateLimiter;
  agentTimeout?: number; // Timeout for each subagent in milliseconds
  synthesisEngine?: SynthesisEngine;
}

interface FileReview {
  file: string;
  codeQuality: CodeQualityResult;
  testCoverage: TestCoverageResult;
  refactorings: RefactoringSuggestion;
}

/**
 * Main Code Review Orchestrator
 * Coordinates subagents to analyze pull requests and generate comprehensive reports
 */
export class CodeReviewOrchestrator {
  private rateLimiter: RateLimiter;
  private agentTimeout: number;
  private synthesisEngine: SynthesisEngine;

  constructor(options: OrchestratorOptions = {}) {
    this.rateLimiter = options.rateLimiter || new RateLimiter();
    this.agentTimeout = options.agentTimeout || 120000; // 2 minutes default
    this.synthesisEngine = options.synthesisEngine || new SynthesisEngine();
  }

  /**
   * Review a pull request using parallel subagent analysis
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param prNumber - Pull request number
   * @returns Complete review report
   */
  async reviewPullRequest(
    owner: string,
    repo: string,
    prNumber: number
  ): Promise<ReviewReport> {
    const startTime = Date.now();
    logReviewStart(owner, repo, prNumber);

    try {
      // Step 1: Fetch PR details and changed files using orchestrator agent
      const { files, fileContents } = await this.fetchPRFiles(owner, repo, prNumber);

      if (files.length === 0) {
        throw new Error('No files found in pull request');
      }

      logger.info(`Analyzing ${files.length} files from PR #${prNumber}`);

      // Step 2: Analyze each file with all three subagents in parallel
      const fileReviews = await this.analyzeFiles(files, fileContents);

      // Convert FileReviews to FileAnalysisResults for synthesis
      const fileAnalyses: FileAnalysisResult[] = fileReviews.map(review => ({
        file: review.file,
        codeQuality: review.codeQuality,
        testCoverage: review.testCoverage,
        refactoring: review.refactorings,
        analysisTime: 0 // Would be tracked in actual implementation
      }));

      // Step 3: Synthesize findings and generate enhanced report
      const synthesis = this.synthesisEngine.synthesize(fileAnalyses);

      // Step 4: Generate legacy summary for backward compatibility
      const legacySummary = this.generateSummary(fileReviews);

      const duration = Date.now() - startTime;
      logReviewComplete(owner, repo, prNumber, synthesis.executiveSummary.overallQualityScore, duration);

      const report: ReviewReport = {
        metadata: {
          prNumber,
          prTitle: `PR #${prNumber}`,
          author: 'unknown',
          repository: `${owner}/${repo}`,
          analyzedAt: new Date().toISOString(),
          analysisDuration: duration,
          analysisVersion: '1.0.0'
        },
        executiveSummary: synthesis.executiveSummary,
        fileAnalyses,
        synthesizedFindings: synthesis.synthesizedFindings,
        recommendations: synthesis.recommendations,
        pullRequest: { owner, repo, number: prNumber },
        summary: legacySummary
      };

      // Validate the report matches our schema
      return ReviewReportSchema.parse(report);
    } catch (error) {
      if (error instanceof Error) {
        logReviewError(owner, repo, prNumber, error);
      }
      throw error;
    }
  }

  /**
   * Fetch PR files and their contents using the orchestrator agent with GitHub MCP
   */
  private async fetchPRFiles(
    owner: string,
    repo: string,
    prNumber: number
  ): Promise<{ files: string[]; fileContents: Map<string, string> }> {
    logger.info('Fetching PR files from GitHub');

    const prompt = `Use GitHub MCP tools to list all files changed in PR #${prNumber} in ${owner}/${repo}. Return only the file paths, one per line. Focus on source code files (.ts, .js, .tsx, .jsx, .py, .java, etc.).`;

    const files: string[] = [];
    const fileContents = new Map<string, string>();

    try {
      // Get list of files
      for await (const message of query({
        prompt,
        options: {
          model,
          mcpServers: { github: mcpServersConfig.github }
        }
      })) {
        if (message.type === 'result' && message.subtype === 'success') {
          const lines = message.result.split('\n');
          lines.forEach((line: string) => {
            const trimmed = line.trim();
            // Extract file paths that look like source code files
            if (trimmed && /\.(ts|js|tsx|jsx|py|java|go|rb|php|cs|cpp|c|h|hpp)$/i.test(trimmed)) {
              if (!files.includes(trimmed)) {
                files.push(trimmed);
              }
            }
          });
          logger.info(`Found ${files.length} files to review`);
          break;
        }
      }

      // Fetch content for each file
      for (const file of files) {
        const content = await this.fetchFileContent(owner, repo, prNumber, file);
        if (content) {
          fileContents.set(file, content);
        }
      }

      return { files, fileContents };
    } catch (error) {
      throw new Error(`Failed to fetch PR files: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Fetch content of a specific file from the PR
   */
  private async fetchFileContent(
    owner: string,
    repo: string,
    prNumber: number,
    filePath: string
  ): Promise<string> {
    const prompt = `Use GitHub MCP tools to get the content of file "${filePath}" from PR #${prNumber} in ${owner}/${repo}. Return the file content.`;

    try {
      for await (const message of query({
        prompt,
        options: {
          model,
          mcpServers: { github: mcpServersConfig.github }
        }
      })) {
        if (message.type === 'result' && message.subtype === 'success') {
          return message.result;
        }
      }
    } catch (error) {
      logger.error(`Failed to fetch ${filePath}: ${error}`);
    }

    return ''; // Empty content if fetch fails
  }

  /**
   * Analyze all files with parallel subagent execution
   */
  private async analyzeFiles(
    files: string[],
    fileContents: Map<string, string>
  ): Promise<FileReview[]> {
    const fileReviews: FileReview[] = [];

    // Analyze files sequentially (to respect rate limits)
    // In production, you might want to batch these
    for (const file of files) {
      const content = fileContents.get(file) || '';

      if (!content) {
        logger.warn(`Skipping ${file} - no content`);
        continue;
      }

      logger.info(`Analyzing ${file}`);

      try {
        // Run all three agents in parallel for this file
        const [codeQuality, testCoverage, refactorings] = await Promise.all([
          this.runWithRateLimiting(async () => {
            logAgentStart('code-quality', file);
            const start = Date.now();
            const result = await withTimeout(
              () => analyzeCodeQuality(content, file),
              this.agentTimeout,
              `Code quality analysis timed out for ${file}`
            );
            logAgentComplete('code-quality', file, Date.now() - start);
            return result;
          }),
          this.runWithRateLimiting(async () => {
            logAgentStart('test-coverage', file);
            const start = Date.now();
            const result = await withTimeout(
              () => analyzeTestCoverage(content, file),
              this.agentTimeout,
              `Test coverage analysis timed out for ${file}`
            );
            logAgentComplete('test-coverage', file, Date.now() - start);
            return result;
          }),
          this.runWithRateLimiting(async () => {
            logAgentStart('refactoring', file);
            const start = Date.now();
            const result = await withTimeout(
              () => suggestRefactorings(content, file),
              this.agentTimeout,
              `Refactoring suggestions timed out for ${file}`
            );
            logAgentComplete('refactoring', file, Date.now() - start);
            return result;
          })
        ]);

        fileReviews.push({
          file,
          codeQuality,
          testCoverage,
          refactorings
        });
      } catch (error) {
        logger.error(`Failed to analyze ${file}: ${error}`);
        // Continue with other files even if one fails
      }
    }

    return fileReviews;
  }

  /**
   * Wrap an async operation with rate limiting
   */
  private async runWithRateLimiting<T>(fn: () => Promise<T>): Promise<T> {
    await this.rateLimiter.acquire(5000); // Estimate 5k tokens per subagent call
    try {
      const result = await fn();
      this.rateLimiter.release();
      return result;
    } catch (error) {
      this.rateLimiter.release();
      throw error;
    }
  }

  /**
   * Generate summary statistics from file reviews
   */
  private generateSummary(fileReviews: FileReview[]) {
    let totalScore = 0;
    let criticalIssues = 0;
    let highPriorityTests = 0;
    let refactoringOpportunities = 0;

    for (const review of fileReviews) {
      totalScore += review.codeQuality.overallScore;

      criticalIssues += review.codeQuality.issues.filter(
        i => i.severity === 'critical' || i.severity === 'high'
      ).length;

      highPriorityTests += review.testCoverage.untestedPaths.filter(
        p => p.priority === 'critical' || p.priority === 'high'
      ).length;

      refactoringOpportunities += review.refactorings.suggestions.filter(
        s => s.impact === 'medium' || s.impact === 'high'
      ).length;
    }

    const overallScore = fileReviews.length > 0
      ? Math.round(totalScore / fileReviews.length)
      : 0;

    return {
      totalFiles: fileReviews.length,
      overallScore,
      criticalIssues,
      highPriorityTests,
      refactoringOpportunities
    };
  }

  /**
   * Generate top recommendations from file reviews (legacy method - now handled by synthesis engine)
   * @deprecated Use SynthesisEngine instead
   */
  private generateRecommendations(fileReviews: FileReview[]) {
    const recommendations: Array<{
      priority: 'critical' | 'high' | 'medium' | 'low';
      category: string;
      description: string;
      files: string[];
    }> = [];

    // Collect critical security issues
    const securityIssues: string[] = [];
    for (const review of fileReviews) {
      const criticalSecurity = review.codeQuality.issues.filter(
        i => i.category === 'security' && (i.severity === 'critical' || i.severity === 'high')
      );
      if (criticalSecurity.length > 0) {
        securityIssues.push(review.file);
      }
    }
    if (securityIssues.length > 0) {
      recommendations.push({
        priority: 'critical',
        category: 'Security',
        description: `Critical security vulnerabilities found that require immediate attention`,
        files: securityIssues
      });
    }

    // Collect critical test gaps
    const testGaps: string[] = [];
    for (const review of fileReviews) {
      const criticalTests = review.testCoverage.untestedPaths.filter(
        p => p.priority === 'critical'
      );
      if (criticalTests.length > 0) {
        testGaps.push(review.file);
      }
    }
    if (testGaps.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'Testing',
        description: `Critical code paths lack test coverage`,
        files: testGaps
      });
    }

    // Collect performance issues
    const perfIssues: string[] = [];
    for (const review of fileReviews) {
      const performance = review.codeQuality.issues.filter(
        i => i.category === 'performance' && i.severity !== 'low'
      );
      if (performance.length > 0) {
        perfIssues.push(review.file);
      }
    }
    if (perfIssues.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'Performance',
        description: `Performance issues that could impact user experience`,
        files: perfIssues
      });
    }

    // Collect high-impact refactorings
    const refactorings: string[] = [];
    for (const review of fileReviews) {
      const highImpact = review.refactorings.suggestions.filter(
        s => s.impact === 'high'
      );
      if (highImpact.length > 0) {
        refactorings.push(review.file);
      }
    }
    if (refactorings.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'Refactoring',
        description: `Significant refactoring opportunities to improve maintainability`,
        files: refactorings
      });
    }

    // Collect maintainability issues
    const maintainability: string[] = [];
    for (const review of fileReviews) {
      const maint = review.codeQuality.issues.filter(
        i => i.category === 'maintainability' && i.severity !== 'low'
      );
      if (maint.length > 0) {
        maintainability.push(review.file);
      }
    }
    if (maintainability.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'Maintainability',
        description: `Code complexity issues that could hinder future development`,
        files: maintainability
      });
    }

    return recommendations.slice(0, 10); // Top 10 recommendations
  }
}
