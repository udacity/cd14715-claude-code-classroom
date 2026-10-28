import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * Structured output schemas for subagent analysis results
 * Uses Zod for runtime validation and converts to JSON Schema for SDK
 */

// ============================================================================
// CODE QUALITY ANALYZER OUTPUT
// ============================================================================

const CodeIssueSeveritySchema = z.enum(['critical', 'high', 'medium', 'low', 'info']);
export type CodeIssueSeverity = z.infer<typeof CodeIssueSeveritySchema>;

const CodeIssueSchema = z.object({
  line: z.number().describe('Line number where issue occurs'),
  severity: CodeIssueSeveritySchema.describe('Issue severity level'),
  category: z.enum([
    'security',
    'performance',
    'maintainability',
    'style',
    'bug-risk',
    'best-practice'
  ]).describe('Category of issue'),
  description: z.string().describe('Clear description of the issue'),
  suggestion: z.string().describe('How to fix the issue'),
});
export type CodeIssue = z.infer<typeof CodeIssueSchema>;

export const CodeQualityResultSchema = z.object({
  file: z.string().describe('File path analyzed'),
  issues: z.array(CodeIssueSchema).describe('List of code quality issues found'),
  overallScore: z.number().min(0).max(100).describe('Overall code quality score 0-100'),
  summary: z.string().describe('Executive summary of code quality'),
  highlights: z.array(z.string()).describe('Positive aspects of the code'),
});
export type CodeQualityResult = z.infer<typeof CodeQualityResultSchema>;

// ============================================================================
// TEST COVERAGE ANALYZER OUTPUT
// ============================================================================

const UntestedPathSchema = z.object({
  type: z.enum(['function', 'class', 'branch', 'edge-case']).describe('Type of untested element'),
  location: z.string().describe('Location in code (line or function name)'),
  priority: z.enum(['critical', 'high', 'medium', 'low']).describe('Priority level'),
  reasoning: z.string().describe('Why this should be tested'),
  suggestedTest: z.string().describe('Suggested test case'),
});
export type UntestedPath = z.infer<typeof UntestedPathSchema>;

export const TestCoverageResultSchema = z.object({
  file: z.string().describe('File path analyzed'),
  hasTests: z.boolean().describe('Whether test files exist for this file'),
  testFiles: z.array(z.string()).describe('Related test file paths'),
  untestedPaths: z.array(UntestedPathSchema).describe('Gaps in test coverage'),
  coverageEstimate: z.number().min(0).max(100).describe('Estimated test coverage percentage'),
  summary: z.string().describe('Summary of test coverage analysis'),
  recommendations: z.array(z.string()).describe('Key recommendations for improving tests'),
});
export type TestCoverageResult = z.infer<typeof TestCoverageResultSchema>;

// ============================================================================
// REFACTORING SUGGESTER OUTPUT
// ============================================================================

const RefactoringSuggestionItemSchema = z.object({
  type: z.enum([
    'extract-function',
    'rename',
    'modernize',
    'simplify',
    'pattern-improvement',
    'architecture'
  ]).describe('Type of refactoring'),
  location: z.string().describe('Location in code affected'),
  impact: z.enum(['low', 'medium', 'high']).describe('Impact level of refactoring'),
  description: z.string().describe('Description of the opportunity'),
  before: z.string().describe('Current implementation'),
  after: z.string().describe('Suggested implementation'),
  benefits: z.string().describe('Benefits of the refactoring'),
});
export type RefactoringSuggestionItem = z.infer<typeof RefactoringSuggestionItemSchema>;

export const RefactoringSuggestionSchema = z.object({
  file: z.string().describe('File path analyzed'),
  suggestions: z.array(RefactoringSuggestionItemSchema).describe('Refactoring opportunities'),
  summary: z.string().describe('Summary of refactoring opportunities'),
  technicalDebtIndicators: z.array(z.string()).describe('Signs of technical debt'),
});
export type RefactoringSuggestion = z.infer<typeof RefactoringSuggestionSchema>;

// ============================================================================
// COMBINED FILE ANALYSIS
// ============================================================================

export const FileAnalysisResultSchema = z.object({
  file: z.string().describe('File path analyzed'),
  codeQuality: CodeQualityResultSchema.optional(),
  testCoverage: TestCoverageResultSchema.optional(),
  refactoring: RefactoringSuggestionSchema.optional(),
  analysisTime: z.number().describe('Time taken to analyze in milliseconds'),
});
export type FileAnalysisResult = z.infer<typeof FileAnalysisResultSchema>;

// ============================================================================
// JSON SCHEMA CONVERSIONS FOR SDK
// ============================================================================

type JsonSchema = Record<string, unknown>;
type ZodToJsonSchema = Record<string, unknown>;
const toJsonSchema = (schema: z.ZodTypeAny): ZodToJsonSchema =>
  (zodToJsonSchema as (s: unknown, options?: unknown) => unknown)(
    schema,
    { $refStrategy: 'root' }
  ) as ZodToJsonSchema;

/**
 * Convert Zod schemas to JSON Schema for SDK structured outputs
 * Per SDK docs: https://platform.claude.com/docs/en/agent-sdk/structured-outputs
 * Use $refStrategy: 'root' to properly inline all $ref definitions
 */
export const CodeQualityResultJSONSchema: JsonSchema = toJsonSchema(CodeQualityResultSchema) as JsonSchema;
export const TestCoverageResultJSONSchema: JsonSchema = toJsonSchema(TestCoverageResultSchema) as JsonSchema;
export const RefactoringSuggestionJSONSchema: JsonSchema = toJsonSchema(RefactoringSuggestionSchema) as JsonSchema;
export const FileAnalysisResultJSONSchema: JsonSchema = toJsonSchema(FileAnalysisResultSchema) as JsonSchema;
