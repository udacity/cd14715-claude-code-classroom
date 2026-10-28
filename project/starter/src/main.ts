import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { CodeReviewOrchestrator } from './orchestrator.js';
import { ReportGenerator } from './utils/report-generator.js';
import { logger } from './utils/logger.js';

// Load environment variables
dotenv.config();

/**
 * Main entry point for the Claude Multi-Agent Code Review System
 * Usage: npm run dev <owner> <repo> <pr-number>
 */
async function main() {
  const [owner, repo, prStr] = process.argv.slice(2);

  // Validate command line arguments
  if (!owner || !repo || !prStr) {
    console.error('Error: Missing required arguments');
    console.error('Usage: npm run dev <owner> <repo> <pr-number>');
    console.error('Example: npm run dev facebook react 12345');
    process.exit(1);
  }

  const prNumber = parseInt(prStr, 10);
  if (isNaN(prNumber) || prNumber <= 0) {
    console.error(`Error: Invalid PR number "${prStr}". Must be a positive integer.`);
    process.exit(1);
  }

  // Validate authentication
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const hasAwsKeys = !!process.env.AWS_ACCESS_KEY_ID && !!process.env.AWS_SECRET_ACCESS_KEY;

  if (!hasAnthropicKey && !hasAwsKeys) {
    console.error('Error: No authentication credentials found');
    console.error('');
    console.error('You must configure ONE of the following:');
    console.error('');
    console.error('Option 1: Anthropic API (recommended)');
    console.error('  Set ANTHROPIC_API_KEY in your .env file');
    console.error('  Example: ANTHROPIC_API_KEY=sk-ant-your-key-here');
    console.error('');
    console.error('Option 2: AWS Bedrock');
    console.error('  Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION in your .env file');
    console.error('');
    process.exit(1);
  }

  if (hasAwsKeys) {
    if (!process.env.AWS_REGION) {
      console.error('Error: AWS_REGION is required when using AWS Bedrock authentication');
      process.exit(1);
    }
    console.log('🔐 Using AWS Bedrock authentication');
  } else {
    console.log('🔐 Using Anthropic API authentication');
  }

  // Validate ANTHROPIC_MODEL environment variable
  if (!process.env.ANTHROPIC_MODEL) {
    console.error('Error: ANTHROPIC_MODEL environment variable is required');
    console.error('');
    console.error('Add to your .env file:');
    if (hasAwsKeys) {
      console.error('  ANTHROPIC_MODEL=us.anthropic.claude-sonnet-4-5-20250929-v1:0');
    } else {
      console.error('  ANTHROPIC_MODEL=claude-sonnet-4-5-20250929');
    }
    process.exit(1);
  }

  console.log(`\n🔍 Starting code review for ${owner}/${repo} PR #${prNumber}\n`);

  try {
    // Create orchestrator instance
    const orchestrator = new CodeReviewOrchestrator();

    // Review the pull request
    logger.info('Orchestrating code review');
    const report = await orchestrator.reviewPullRequest(owner, repo, prNumber);

    // Generate reports
    console.log('\n📊 Generating reports...');
    const reportGenerator = new ReportGenerator();

    // Create reports directory if it doesn't exist
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Generate Markdown report
    const markdownReport = reportGenerator.generateMarkdownReport(report);
    const mdPath = path.join(reportsDir, `review-${owner}-${repo}-${prNumber}.md`);
    fs.writeFileSync(mdPath, markdownReport, 'utf-8');
    console.log(`✅ Markdown report: ${mdPath}`);

    // Generate HTML report
    const htmlReport = reportGenerator.generateHTMLReport(report);
    const htmlPath = path.join(reportsDir, `review-${owner}-${repo}-${prNumber}.html`);
    fs.writeFileSync(htmlPath, htmlReport, 'utf-8');
    console.log(`✅ HTML report: ${htmlPath}`);

    // Generate JSON report
    const jsonReport = reportGenerator.generateJSONReport(report);
    const jsonPath = path.join(reportsDir, `review-${owner}-${repo}-${prNumber}.json`);
    fs.writeFileSync(jsonPath, jsonReport, 'utf-8');
    console.log(`✅ JSON report: ${jsonPath}`);

    console.log('\n🎉 Code review complete!');
    console.log(`\nOverall Score: ${report.summary.overallScore}/100`);
    console.log(`Files Reviewed: ${report.summary.totalFiles}`);
    console.log(`Critical Issues: ${report.summary.criticalIssues}`);
    console.log(`High Priority Tests Needed: ${report.summary.highPriorityTests}`);
    console.log(`Refactoring Opportunities: ${report.summary.refactoringOpportunities}\n`);

  } catch (error) {
    console.error('\n❌ Error during code review:');
    if (error instanceof Error) {
      console.error(error.message);
      logger.error('Code review failed', { error: error.message, stack: error.stack });
    } else {
      console.error(String(error));
    }
    process.exit(1);
  }
}

main();
