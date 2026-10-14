/**
 * Test Coverage Analyzer Agent
 * Analyzes test completeness and suggests missing test cases
 */

import { query } from '@anthropic-ai/claude-agent-sdk';
import { TestCoverageResult, TestCoverageResultSchema, TestCoverageResultJSONSchema } from '../types/analysis-results.js';
import { TEST_COVERAGE_ANALYZER_PROMPT } from '../prompts/index.js';

const model = process.env.ANTHROPIC_MODEL;

if (!model) {
  throw new Error('ANTHROPIC_MODEL is not set');
}

/**
 * Analyze test coverage for a given file
 * @param fileContent - The content of the file to analyze
 * @param filePath - Path of the file being analyzed
 * @param testFiles - Array of related test files (if any)
 * @returns Test coverage analysis results
 */
export async function analyzeTestCoverage(
  fileContent: string,
  filePath: string,
  testFiles: string[] = []
): Promise<TestCoverageResult> {
  const testFilesInfo = testFiles.length > 0
    ? `\n\nRelated test files found:\n${testFiles.map(f => `- ${f}`).join('\n')}`
    : '\n\nNo related test files found.';

  const prompt = `${TEST_COVERAGE_ANALYZER_PROMPT}

## File to Analyze

File: ${filePath}
${testFilesInfo}

\`\`\`
${fileContent}
\`\`\`

Analyze this file's test coverage and provide your assessment in the required structured format.`;

  try {
    for await (const message of query({
      prompt,
      options: {
        model,
        allowedTools: [], // No tools needed - we're analyzing provided content
        outputFormat: {
          type: 'json_schema',
          schema: TestCoverageResultJSONSchema
        }
      }
    })) {
      if (message.type === 'result') {
        if (message.subtype === 'success' && message.structured_output) {
          return TestCoverageResultSchema.parse(message.structured_output);
        } else if (message.subtype === 'error_max_structured_output_retries') {
          throw new Error('Failed to produce valid test coverage analysis output');
        }
      }
    }

    throw new Error('No result received from test coverage analyzer');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Test coverage analysis failed: ${error.message}`);
    }
    throw new Error('Test coverage analysis failed: Unknown error');
  }
}
