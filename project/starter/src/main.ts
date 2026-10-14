import * as dotenv from 'dotenv';
import { mkdir, writeFile } from 'node:fs/promises';

import { CodeReviewOrchestrator } from './orchestrator';
import { ReportGenerator } from './utils/report-generator';

// Load environment variables
dotenv.config();

/**
 * Main entry point for the Claude Multi-Agent Code Review System
 * Usage: npm run dev <owner> <repo> <pr-number>
 */
async function main() {
  const [owner, repo, prStr] = process.argv.slice(2);

  // Validate command-line arguments
  if (!owner || !repo || !prStr) {
    console.error(
      'Usage: npm run dev -- <owner> <repo> <pr-number>'
    );
    process.exit(1);
  }

  const prNumber = Number(prStr);

  if (
    !Number.isInteger(prNumber) ||
    prNumber <= 0
  ) {
    console.error('PR number must be a positive integer.');
    process.exit(1);
  }

  // Validate authentication
  const hasAnthropicAPI = Boolean(
    process.env.ANTHROPIC_API_KEY
  );

  const hasAWSCredentials = Boolean(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY
  );

  if (!hasAnthropicAPI && !hasAWSCredentials) {
    console.error('Authentication required. Set one of:');
    console.error('  - ANTHROPIC_API_KEY, or');
    console.error(
      '  - AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY + AWS_REGION'
    );
    process.exit(1);
  }

  if (hasAWSCredentials && !hasAnthropicAPI) {
    if (!process.env.AWS_REGION) {
      console.error(
        'AWS_REGION is required when using AWS Bedrock authentication.'
      );
      process.exit(1);
    }

    console.log('🔐 Using AWS Bedrock authentication');
  } else {
    console.log('🔐 Using Anthropic API authentication');
  }

  // Validate model
  const model = process.env.ANTHROPIC_MODEL;

  if (!model) {
    console.error('ANTHROPIC_MODEL is required.');
    console.error(
      'Anthropic API: claude-sonnet-4-5-20250929'
    );
    console.error(
      'AWS Bedrock: us.anthropic.claude-sonnet-4-5-20250929-v1:0'
    );
    process.exit(1);
  }

  try {
    console.log(
      `🔍 Reviewing ${owner}/${repo} pull request #${prNumber}...`
    );

    const orchestrator = new CodeReviewOrchestrator({
      model,
      cwd: process.env.PROJECT_ROOT || process.cwd(),
    });

    const report = await orchestrator.reviewPullRequest(
      owner,
      repo,
      prNumber
    );

    const reportGenerator = new ReportGenerator();

    const markdownReport =
      reportGenerator.generateMarkdownReport(report);

    const htmlReport =
      reportGenerator.generateHTMLReport(report);

    const jsonReport =
      reportGenerator.generateJSONReport(report);

    await mkdir('reports', { recursive: true });

    const baseName = `${owner}-${repo}-pr-${prNumber}`;

    const markdownPath = `reports/${baseName}.md`;
    const htmlPath = `reports/${baseName}.html`;
    const jsonPath = `reports/${baseName}.json`;

    await writeFile(markdownPath, markdownReport, 'utf8');
    await writeFile(htmlPath, htmlReport, 'utf8');
    await writeFile(jsonPath, jsonReport, 'utf8');

    console.log('✅ Review completed successfully.');
    console.log(`📄 Markdown report: ${markdownPath}`);
    console.log(`🌐 HTML report: ${htmlPath}`);
    console.log(`🧾 JSON report: ${jsonPath}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);

    console.error(`❌ Review failed: ${message}`);
    process.exit(1);
  }
}

main().catch((error) => {
  const message =
    error instanceof Error ? error.message : String(error);

  console.error(`❌ Unexpected error: ${message}`);
  process.exit(1);
});
