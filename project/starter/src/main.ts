import * as dotenv from 'dotenv';
import fs from 'node:fs/promises';
import path from 'node:path';
import { CodeReviewOrchestrator } from './orchestrator.js';
import { ReportGenerator } from './utils/report-generator.js';

dotenv.config();

async function main() {
  const [owner, repo, prStr] = process.argv.slice(2);

  if (!owner || !repo || !prStr) {
    console.error('Usage: npm run dev -- <owner> <repo> <pr-number>');
    process.exit(1);
  }

  const prNumber = Number(prStr);

  if (!Number.isInteger(prNumber) || prNumber <= 0) {
    console.error('Error: PR number must be a positive integer.');
    process.exit(1);
  }

  const hasAnthropicApiKey = Boolean(process.env.ANTHROPIC_API_KEY);
  const hasBedrockCredentials =
    Boolean(process.env.AWS_ACCESS_KEY_ID) &&
    Boolean(process.env.AWS_SECRET_ACCESS_KEY);

  if (!hasAnthropicApiKey && !hasBedrockCredentials) {
    console.error(
      'Authentication error: configure ANTHROPIC_API_KEY or AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY.'
    );
    process.exit(1);
  }

  if (hasBedrockCredentials && !process.env.AWS_REGION) {
    console.error('Authentication error: AWS_REGION is required for Bedrock.');
    process.exit(1);
  }

  if (hasAnthropicApiKey) {
    console.log('Using Anthropic API authentication');
  } else {
    console.log('Using AWS Bedrock authentication');
  }

  const model = process.env.ANTHROPIC_MODEL;

  if (!model) {
    console.error('Configuration error: ANTHROPIC_MODEL is not set.');
    process.exit(1);
  }

  if (!process.env.GITHUB_TOKEN) {
    console.error('Configuration error: GITHUB_TOKEN is not set.');
    process.exit(1);
  }

  try {
    console.log(`Reviewing ${owner}/${repo} PR #${prNumber}...`);
    console.log(`Model: ${model}`);

    const orchestrator = new CodeReviewOrchestrator();

    const report = await orchestrator.reviewPullRequest(
      owner,
      repo,
      prNumber
    );

    const generator = new ReportGenerator();

    const outputDir = path.resolve('reports');
    await fs.mkdir(outputDir, { recursive: true });

    const baseName = `${owner}-${repo}-pr-${prNumber}`;

    const jsonReport = generator.generateJSONReport(report);
    const markdownReport = generator.generateMarkdownReport(report);
    const htmlReport = generator.generateHTMLReport(report);

    await Promise.all([
      fs.writeFile(
        path.join(outputDir, `${baseName}.json`),
        jsonReport,
        'utf8'
      ),
      fs.writeFile(
        path.join(outputDir, `${baseName}.md`),
        markdownReport,
        'utf8'
      ),
      fs.writeFile(
        path.join(outputDir, `${baseName}.html`),
        htmlReport,
        'utf8'
      ),
    ]);

    console.log('Review completed successfully.');
    console.log(`Reports saved in: ${outputDir}`);
  } catch (error) {
    console.error(
      'Review failed:',
      error instanceof Error ? (error.stack || error.message) : error
    );
    process.exitCode = 1;
  }
}

main();
