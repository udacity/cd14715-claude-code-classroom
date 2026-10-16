import { describe, expect, it } from 'vitest';

import {
  ReviewReportSchema,
  ReviewReportJSONSchema,
} from '../src/types/report-types';

const validReport = {
  pullRequest: {
    owner: 'octocat',
    repo: 'Hello-World',
    number: 1,
  },
  fileReviews: [
    {
      file: 'src/example.ts',
      codeQuality: {
        file: 'src/example.ts',
        issues: [
          {
            line: 10,
            severity: 'medium' as const,
            category: 'maintainability' as const,
            description: 'Example issue',
            suggestion: 'Improve the implementation',
          },
        ],
        overallScore: 85,
        summary: 'Generally good code quality',
      },
      testCoverage: {
        file: 'src/example.ts',
        hasTests: true,
        testFiles: ['tests/example.test.ts'],
        untestedPaths: [
          {
            type: 'edge-case' as const,
            location: 'example()',
            priority: 'low' as const,
            reasoning: 'An edge case is not covered',
            suggestedTest: 'Add an edge-case test',
          },
        ],
        coverageEstimate: 90,
        summary: 'Good test coverage',
      },
      refactorings: {
        file: 'src/example.ts',
        suggestions: [
          {
            type: 'simplify' as const,
            location: 'example()',
            impact: 'low' as const,
            description: 'Simplify the function',
            before: 'Complex implementation',
            after: 'Simpler implementation',
            benefits: 'Improved readability',
          },
        ],
        summary: 'Minor refactoring opportunity',
      },
    },
  ],
  summary: {
    totalFiles: 1,
    overallScore: 85,
    criticalIssues: 0,
    highPriorityTests: 0,
    refactoringOpportunities: 1,
  },
  recommendations: [
    {
      priority: 'medium' as const,
      category: 'maintainability',
      description: 'Improve code readability',
      files: ['src/example.ts'],
    },
  ],
  metadata: {
    analyzedAt: '2026-09-27T00:00:00.000Z',
    duration: 1000,
    agentVersions: {
      'code-quality-analyzer': '1.0.0',
      'test-coverage-analyzer': '1.0.0',
      'refactoring-suggester': '1.0.0',
    },
  },
};

describe('ReviewReportSchema', () => {
  it('accepts valid review report data', () => {
    const result = ReviewReportSchema.safeParse(validReport);

    expect(result.success).toBe(true);
  });

  it('rejects invalid review report data', () => {
    const invalidReport = {
      ...validReport,
      pullRequest: {
        ...validReport.pullRequest,
        number: '1',
      },
    };

    const result = ReviewReportSchema.safeParse(invalidReport);

    expect(result.success).toBe(false);
  });

  it('accepts valid empty collections', () => {
    const edgeCaseReport = {
      ...validReport,
      fileReviews: [],
      recommendations: [],
      summary: {
        ...validReport.summary,
        totalFiles: 0,
        refactoringOpportunities: 0,
      },
    };

    const result = ReviewReportSchema.safeParse(edgeCaseReport);

    expect(result.success).toBe(true);
  });

  it('rejects invalid enum and numeric boundary values', () => {
    const invalidReport = {
      ...validReport,
      fileReviews: [
        {
          ...validReport.fileReviews[0],
          codeQuality: {
            ...validReport.fileReviews[0].codeQuality,
            issues: [
              {
                ...validReport.fileReviews[0].codeQuality.issues[0],
                severity: 'urgent',
              },
            ],
            overallScore: 101,
          },
        },
      ],
    };

    const result = ReviewReportSchema.safeParse(invalidReport);

    expect(result.success).toBe(false);
  });
});

describe('ReviewReportJSONSchema', () => {
  it('exports a JSON Schema object', () => {
    expect(ReviewReportJSONSchema).toBeDefined();
    expect(typeof ReviewReportJSONSchema).toBe('object');
    expect(ReviewReportJSONSchema).not.toBeNull();
  });

  it('contains an object schema with expected properties', () => {
    const schema = ReviewReportJSONSchema as {
      type?: string;
      properties?: Record<string, unknown>;
    };

    expect(schema.type).toBe('object');
    expect(schema.properties).toBeDefined();
    expect(schema.properties).toHaveProperty('pullRequest');
    expect(schema.properties).toHaveProperty('fileReviews');
    expect(schema.properties).toHaveProperty('summary');
    expect(schema.properties).toHaveProperty('recommendations');
    expect(schema.properties).toHaveProperty('metadata');
  });
});
