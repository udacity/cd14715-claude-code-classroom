import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
import {
  CODE_QUALITY_PROMPT,
  TEST_COVERAGE_PROMPT,
  REFACTORING_PROMPT,
} from '../prompts/index';

const tools = ['Read', 'Glob', 'Grep', 'Skill'];

export const subagents: Record<string, AgentDefinition> = {
  codeQualityAnalyzer: {
    description: 'Finds actionable correctness, security, performance, and maintainability issues.',
    prompt: CODE_QUALITY_PROMPT,
    tools,
    model: 'sonnet',
  },
  testCoverageAnalyzer: {
    description: 'Identifies important missing tests and untested behavior.',
    prompt: TEST_COVERAGE_PROMPT,
    tools,
    model: 'sonnet',
  },
  refactoringSuggester: {
    description: 'Suggests focused, behavior-preserving refactorings.',
    prompt: REFACTORING_PROMPT,
    tools,
    model: 'sonnet',
  },
};
