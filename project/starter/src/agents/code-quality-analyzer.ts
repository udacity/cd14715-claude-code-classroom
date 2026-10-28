/**
 * Code Quality Analyzer Agent
 * Analyzes code for quality issues and best practice violations
 */

import { query } from '@anthropic-ai/claude-agent-sdk';
import { CodeQualityResult, CodeQualityResultSchema, CodeQualityResultJSONSchema } from '../types/analysis-results.js';
import { CODE_QUALITY_ANALYZER_PROMPT } from '../prompts/index.js';

const model = process.env.ANTHROPIC_MODEL;

if (!model) {
  throw new Error('ANTHROPIC_MODEL is not set');
}

/**
 * Analyze code quality for a given file
 * @param fileContent - The content of the file to analyze
 * @param filePath - Path of the file being analyzed
 * @returns Code quality analysis results
 */
export async function analyzeCodeQuality(
  fileContent: string,
  filePath: string
): Promise<CodeQualityResult> {
  const prompt = `${CODE_QUALITY_ANALYZER_PROMPT}

## File to Analyze

File: ${filePath}

\`\`\`
${fileContent}
\`\`\`

Analyze this file and provide your assessment in the required structured format.`;

  try {
    for await (const message of query({
      prompt,
      options: {
        model,
        allowedTools: [], // No tools needed - we're analyzing provided content
        outputFormat: {
          type: 'json_schema',
          schema: CodeQualityResultJSONSchema
        }
      }
    })) {
      if (message.type === 'result') {
        if (message.subtype === 'success' && message.structured_output) {
          return CodeQualityResultSchema.parse(message.structured_output);
        } else if (message.subtype === 'error_max_structured_output_retries') {
          throw new Error('Failed to produce valid code quality analysis output');
        }
      }
    }

    throw new Error('No result received from code quality analyzer');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Code quality analysis failed: ${error.message}`);
    }
    throw new Error('Code quality analysis failed: Unknown error');
  }
}
