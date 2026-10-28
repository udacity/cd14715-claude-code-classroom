import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import {
  CodeQualityResultSchema,
  TestCoverageResultSchema,
  RefactoringSuggestionSchema,
  FileAnalysisResultSchema
} from './analysis-results';

/**
 * Executive Summary Schema
 * High-level overview of findings
 */
export const ExecutiveSummarySchema = z.object({
  totalFiles: z.number().describe('Total files analyzed'),
  filesWithIssues: z.number().describe('Files with at least one issue'),
  criticalCount: z.number().describe('Number of critical issues'),
  highCount: z.number().describe('Number of high-severity issues'),
  mediumCount: z.number().describe('Number of medium-severity issues'),
  overallQualityScore: z.number().min(0).max(100).describe('Average code quality score'),
  estimatedTestCoverage: z.number().min(0).max(100).describe('Average test coverage estimate'),
  keyFindings: z.array(z.string().max(500)).describe('Top 3-5 most important findings'),
  recommendedActions: z.array(z.string().max(500)).describe('Prioritized action items'),
});
export type ExecutiveSummary = z.infer<typeof ExecutiveSummarySchema>;

/**
 * Synthesized Finding Schema
 * Correlates insights across multiple agents
 */
export const SynthesizedFindingSchema = z.object({
  file: z.string().describe('File path'),
  pattern: z.string().describe('Type of pattern detected'),
  severity: z.enum(['critical', 'high', 'medium', 'low']).describe('Overall severity'),
  relatedAgents: z.array(z.enum(['code-quality', 'test-coverage', 'refactoring'])).describe('Which agents identified this'),
  description: z.string().describe('Comprehensive description'),
  recommendation: z.string().describe('Specific action to take'),
});
export type SynthesizedFinding = z.infer<typeof SynthesizedFindingSchema>;

/**
 * Prioritized Recommendation Schema
 */
export const PrioritizedRecommendationSchema = z.object({
  id: z.string().describe('Unique ID for tracking'),
  priority: z.enum(['critical', 'high', 'medium', 'low']).describe('Priority level'),
  category: z.enum(['code-quality', 'testing', 'architecture', 'performance', 'security', 'maintainability']).describe('Issue category'),
  description: z.string().describe('Clear description of the recommendation'),
  files: z.array(z.string()).describe('Affected files'),
  estimatedEffort: z.enum(['low', 'medium', 'high']).describe('Estimated effort to implement'),
  impact: z.enum(['low', 'medium', 'high']).describe('Expected impact'),
});
export type PrioritizedRecommendation = z.infer<typeof PrioritizedRecommendationSchema>;

/**
 * Complete Review Report Schema
 * Aggregates all subagent results into a unified report
 */
export const ReviewReportSchema = z.object({
  metadata: z.object({
    prNumber: z.number().describe('Pull request number'),
    prTitle: z.string().describe('Pull request title'),
    author: z.string().describe('PR author'),
    repository: z.string().describe('Repository name (owner/repo)'),
    analyzedAt: z.string().describe('ISO timestamp of analysis'),
    analysisDuration: z.number().describe('Total analysis time in milliseconds'),
    analysisVersion: z.string().describe('Version of analysis system'),
  }).describe('Report metadata'),

  executiveSummary: ExecutiveSummarySchema.describe('High-level overview'),

  fileAnalyses: z.array(FileAnalysisResultSchema).describe('Detailed analysis per file'),

  synthesizedFindings: z.array(SynthesizedFindingSchema).describe('Cross-agent insights and correlations'),

  recommendations: z.array(PrioritizedRecommendationSchema).describe('Actionable, prioritized recommendations'),

  pullRequest: z.object({
    owner: z.string(),
    repo: z.string(),
    number: z.number()
  }).describe('PR identifier'),

  summary: z.object({
    totalFiles: z.number(),
    overallScore: z.number(),
    criticalIssues: z.number(),
    highPriorityTests: z.number(),
    refactoringOpportunities: z.number()
  }).describe('Summary statistics')
});

/**
 * TypeScript type inferred from Zod schema
 */
export type ReviewReport = z.infer<typeof ReviewReportSchema>;

type JsonSchema = Record<string, unknown>;
const toJsonSchema = (schema: z.ZodTypeAny): JsonSchema =>
  (zodToJsonSchema as (s: unknown, options?: unknown) => unknown)(
    schema,
    { $refStrategy: 'root' }
  ) as JsonSchema;

/**
 * JSON Schema for SDK structured outputs
 * Per SDK docs: https://platform.claude.com/docs/en/agent-sdk/structured-outputs
 * Use $refStrategy: 'root' to properly inline all $ref definitions
 */
const rawSchema: JsonSchema = toJsonSchema(ReviewReportSchema);
export const ReviewReportJSONSchema = rawSchema;

// ============================================================================
// REPORT GENERATION OPTIONS
// ============================================================================

export interface ReportGenerationOptions {
  format: 'markdown' | 'html' | 'json' | 'all';
  outputDir?: string;
  includeRawAgentOutput?: boolean;
  theme?: 'light' | 'dark';
}

export interface GeneratedReport {
  markdown?: string;
  html?: string;
  json?: ReviewReport;
}
