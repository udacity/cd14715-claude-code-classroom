import { describe, expect, it } from 'vitest';

import {
  CodeQualityResultSchema,
  CodeQualityResultJSONSchema,
  TestCoverageResultSchema,
  TestCoverageResultJSONSchema,
  RefactoringSuggestionSchema,
  RefactoringSuggestionJSONSchema,
} from '../src/types/analysis-results';

describe('Analysis result schemas', () => {
  it('accepts valid code quality results', () => {
    const result = CodeQualityResultSchema.safeParse({
      file: 'src/example.ts',
      issues: [
        {
          line: 10,
          severity: 'medium',
          category: 'maintainability',
          description: 'Function is too complex.',
          suggestion: 'Extract the logic into smaller functions.',
        },
      ],
      overallScore: 85,
      summary: 'Generally good code quality with minor improvements needed.',
    });

    expect(result.success).toBe(true);
  });

  it('accepts valid test coverage results', () => {
    const result = TestCoverageResultSchema.safeParse({
      file: 'src/example.ts',
      hasTests: true,
      testFiles: ['tests/example.test.ts'],
      untestedPaths: [
        {
          type: 'branch',
          location: 'line 25',
          priority: 'medium',
          reasoning: 'The error branch is not covered.',
          suggestedTest: 'Add a test for the error condition.',
        },
      ],
      coverageEstimate: 80,
      summary: 'Most paths are covered.',
    });

    expect(result.success).toBe(true);
  });

  it('accepts valid refactoring suggestions', () => {
    const result = RefactoringSuggestionSchema.safeParse({
      file: 'src/example.ts',
      suggestions: [
        {
          type: 'extract-function',
          location: 'lines 10-25',
          impact: 'medium',
          description: 'A large block can be extracted.',
          before: 'Large inline block of logic.',
          after: 'Call a dedicated helper function.',
          benefits: 'Improves readability and maintainability.',
        },
      ],
      summary: 'A small refactoring would improve maintainability.',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid code quality severity', () => {
    const result = CodeQualityResultSchema.safeParse({
      file: 'src/example.ts',
      issues: [
        {
          line: 10,
          severity: 'invalid',
          category: 'security',
          description: 'Problem',
          suggestion: 'Fix it',
        },
      ],
      overallScore: 80,
      summary: 'Summary',
    });

    expect(result.success).toBe(false);
  });

  it('rejects scores outside the 0-100 range', () => {
    expect(
      CodeQualityResultSchema.safeParse({
        file: 'src/example.ts',
        issues: [],
        overallScore: 101,
        summary: 'Summary',
      }).success
    ).toBe(false);

    expect(
      TestCoverageResultSchema.safeParse({
        file: 'src/example.ts',
        hasTests: false,
        testFiles: [],
        untestedPaths: [],
        coverageEstimate: -1,
        summary: 'Summary',
      }).success
    ).toBe(false);
  });

  it('accepts score boundary values of 0 and 100', () => {
    const codeQuality = CodeQualityResultSchema.safeParse({
      file: 'src/example.ts',
      issues: [],
      overallScore: 0,
      summary: 'No score achieved.',
    });

    const coverage = TestCoverageResultSchema.safeParse({
      file: 'src/example.ts',
      hasTests: true,
      testFiles: [],
      untestedPaths: [],
      coverageEstimate: 100,
      summary: 'Full coverage.',
    });

    expect(codeQuality.success).toBe(true);
    expect(coverage.success).toBe(true);
  });

  it('rejects invalid refactoring suggestion types', () => {
    const result = RefactoringSuggestionSchema.safeParse({
      file: 'src/example.ts',
      suggestions: [
        {
          type: 'invalid-type',
          location: 'line 10',
          impact: 'low',
          description: 'Suggestion',
          before: 'Before',
          after: 'After',
          benefits: 'Benefits',
        },
      ],
      summary: 'Summary',
    });

    expect(result.success).toBe(false);
  });

  it('exports JSON schemas for structured output', () => {
    expect(CodeQualityResultJSONSchema).toBeDefined();
    expect(TestCoverageResultJSONSchema).toBeDefined();
    expect(RefactoringSuggestionJSONSchema).toBeDefined();

    expect(typeof CodeQualityResultJSONSchema).toBe('object');
    expect(typeof TestCoverageResultJSONSchema).toBe('object');
    expect(typeof RefactoringSuggestionJSONSchema).toBe('object');
  });
});
