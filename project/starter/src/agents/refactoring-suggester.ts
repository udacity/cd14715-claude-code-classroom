/**
 * Refactoring Suggester Agent
 * Suggests architectural improvements and refactoring opportunities
 */

import { query } from '@anthropic-ai/claude-agent-sdk';
import { RefactoringSuggestion, RefactoringSuggestionSchema, RefactoringSuggestionJSONSchema } from '../types/analysis-results.js';
import { REFACTORING_SUGGESTER_PROMPT } from '../prompts/index.js';

const model = process.env.ANTHROPIC_MODEL;

if (!model) {
  throw new Error('ANTHROPIC_MODEL is not set');
}

/**
 * Suggest refactorings for a given file
 * @param fileContent - The content of the file to analyze
 * @param filePath - Path of the file being analyzed
 * @returns Refactoring suggestions
 */
export async function suggestRefactorings(
  fileContent: string,
  filePath: string
): Promise<RefactoringSuggestion> {
  const prompt = `${REFACTORING_SUGGESTER_PROMPT}

## File to Analyze

File: ${filePath}

\`\`\`
${fileContent}
\`\`\`

Analyze this file and provide refactoring suggestions in the required structured format.`;

  try {
    for await (const message of query({
      prompt,
      options: {
        model,
        allowedTools: [], // No tools needed - we're analyzing provided content
        outputFormat: {
          type: 'json_schema',
          schema: RefactoringSuggestionJSONSchema
        }
      }
    })) {
      if (message.type === 'result') {
        if (message.subtype === 'success' && message.structured_output) {
          return RefactoringSuggestionSchema.parse(message.structured_output);
        } else if (message.subtype === 'error_max_structured_output_retries') {
          throw new Error('Failed to produce valid refactoring suggestions output');
        }
      }
    }

    throw new Error('No result received from refactoring suggester');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Refactoring suggestion failed: ${error.message}`);
    }
    throw new Error('Refactoring suggestion failed: Unknown error');
  }
}
