import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * Structured output schemas for subagent analysis results
 * Uses Zod for runtime validation and converts to JSON Schema for SDK
 */

// Code Quality Analyzer output schema
export const CodeQualityResultSchema = z.object({
  file: z.string(),
  issues: z.array(z.object({
    line: z.number(),
    severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
    category: z.enum([
      'security',
      'performance',
      'maintainability',
      'style',
      'bug-risk',
      'best-practice'
    ]),
    description: z.string(),
    suggestion: z.string()
  })),
  overallScore: z.number().min(0).max(100),
  summary: z.string()
});

// Test Coverage Analyzer output schema
export const TestCoverageResultSchema = z.object({
  file: z.string(),
  hasTests: z.boolean(),
  testFiles: z.array(z.string()),
  untestedPaths: z.array(z.object({
    type: z.enum(['function', 'class', 'branch', 'edge-case']),
    location: z.string(),
    priority: z.enum(['critical', 'high', 'medium', 'low']),
    reasoning: z.string(),
    suggestedTest: z.string()
  })),
  coverageEstimate: z.number().min(0).max(100),
  summary: z.string()
});

// Refactoring Suggester output schema
export const RefactoringSuggestionSchema = z.object({
  file: z.string(),
  suggestions: z.array(z.object({
    type: z.enum([
      'extract-function',
      'rename',
      'modernize',
      'simplify',
      'pattern-improvement'
    ]),
    location: z.string(),
    impact: z.enum(['low', 'medium', 'high']),
    description: z.string(),
    before: z.string(),
    after: z.string(),
    benefits: z.string()
  })),
  summary: z.string()
});

// TypeScript type exports
export type CodeQualityResult = z.infer<typeof CodeQualityResultSchema>;
export type TestCoverageResult = z.infer<typeof TestCoverageResultSchema>;
export type RefactoringSuggestion = z.infer<typeof RefactoringSuggestionSchema>;

/**
 * Convert Zod schemas to JSON Schema for SDK structured outputs
 * Per SDK docs: https://platform.claude.com/docs/en/agent-sdk/structured-outputs
 * Use $refStrategy: 'root' to properly inline all $ref definitions
 */
export const CodeQualityResultJSONSchema = zodToJsonSchema(CodeQualityResultSchema, {
  $refStrategy: 'root'
}) as Record<string, unknown>;

export const TestCoverageResultJSONSchema = zodToJsonSchema(TestCoverageResultSchema, {
  $refStrategy: 'root'
}) as Record<string, unknown>;

export const RefactoringSuggestionJSONSchema = zodToJsonSchema(RefactoringSuggestionSchema, {
  $refStrategy: 'root'
}) as Record<string, unknown>;
