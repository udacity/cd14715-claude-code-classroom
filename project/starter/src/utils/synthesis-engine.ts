/**
 * Synthesis Engine
 * Aggregates and correlates findings from all three analysis agents
 * Detects patterns, prioritizes issues, and generates executive summary
 */

import { FileAnalysisResult } from '../types/analysis-results.js';
import { SynthesizedFinding, ExecutiveSummary, PrioritizedRecommendation } from '../types/report-types.js';
import { logger } from './logger.js';

export interface SynthesisResult {
  executiveSummary: ExecutiveSummary;
  synthesizedFindings: SynthesizedFinding[];
  recommendations: PrioritizedRecommendation[];
}

export class SynthesisEngine {
  /**
   * Synthesize all analysis results into actionable insights
   */
  synthesize(fileAnalyses: FileAnalysisResult[]): SynthesisResult {
    logger.debug('Starting synthesis of file analyses');

    const executiveSummary = this.generateExecutiveSummary(fileAnalyses);
    const synthesizedFindings = this.detectPatterns(fileAnalyses);
    const recommendations = this.generateRecommendations(fileAnalyses, synthesizedFindings);

    return {
      executiveSummary,
      synthesizedFindings,
      recommendations: recommendations.sort((a, b) => this.priorityOrder(b.priority) - this.priorityOrder(a.priority))
    };
  }

  /**
   * Generate executive summary from all analyses
   */
  private generateExecutiveSummary(fileAnalyses: FileAnalysisResult[]): ExecutiveSummary {
    const criticalIssues: string[] = [];
    const highIssues: string[] = [];
    const qualityScores: number[] = [];
    const coverageEstimates: number[] = [];
    let filesWithIssues = 0;

    for (const analysis of fileAnalyses) {
      let fileHasIssues = false;

      // Collect code quality issues
      if (analysis.codeQuality) {
        if (analysis.codeQuality.issues.length > 0) {
          fileHasIssues = true;
        }
        qualityScores.push(analysis.codeQuality.overallScore);

        // Collect critical/high severity issues
        const criticalCount = analysis.codeQuality.issues.filter(
          i => i.severity === 'critical' || i.severity === 'high'
        ).length;
        if (criticalCount > 0) {
          criticalIssues.push(...analysis.codeQuality.issues
            .filter(i => i.severity === 'critical' || i.severity === 'high')
            .slice(0, 2)
            .map(i => `${analysis.file}: ${i.description}`)
          );
        }
      }

      // Collect test coverage gaps
      if (analysis.testCoverage) {
        if (analysis.testCoverage.untestedPaths.length > 0) {
          fileHasIssues = true;
        }
        coverageEstimates.push(analysis.testCoverage.coverageEstimate);

        const criticalTests = analysis.testCoverage.untestedPaths.filter(
          p => p.priority === 'critical' || p.priority === 'high'
        );
        if (criticalTests.length > 0) {
          highIssues.push(...criticalTests
            .slice(0, 2)
            .map(p => `${analysis.file}: Missing tests for ${p.location}`)
          );
        }
      }

      if (fileHasIssues) {
        filesWithIssues++;
      }
    }

    const avgQualityScore = qualityScores.length > 0
      ? Math.round(qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length)
      : 100;

    const avgCoverage = coverageEstimates.length > 0
      ? Math.round(coverageEstimates.reduce((a, b) => a + b, 0) / coverageEstimates.length)
      : 100;

    const allCriticalIssues = [...criticalIssues, ...highIssues];
    const topIssues = allCriticalIssues.slice(0, 5);

    const mediumCount = fileAnalyses.reduce((count, analysis) => {
      if (analysis.codeQuality) {
        count += analysis.codeQuality.issues.filter(i => i.severity === 'medium').length;
      }
      return count;
    }, 0);

    const lowCount = fileAnalyses.reduce((count, analysis) => {
      if (analysis.codeQuality) {
        count += analysis.codeQuality.issues.filter(i => i.severity === 'low' || i.severity === 'info').length;
      }
      return count;
    }, 0);

    return {
      totalFiles: fileAnalyses.length,
      filesWithIssues,
      criticalCount: criticalIssues.length,
      highCount: highIssues.length,
      mediumCount,
      overallQualityScore: avgQualityScore,
      estimatedTestCoverage: avgCoverage,
      keyFindings: topIssues,
      recommendedActions: [
        avgCoverage < 60 ? 'Increase test coverage to critical paths' : '',
        avgQualityScore < 70 ? 'Address code quality issues before merging' : '',
        criticalIssues.length > 0 ? 'Fix critical security and performance issues' : '',
        highIssues.length > 0 ? 'Add tests for untested code paths' : '',
        'Review architecture suggestions for long-term maintainability'
      ].filter(Boolean)
    };
  }

  /**
   * Detect patterns and correlations across agents
   */
  private detectPatterns(fileAnalyses: FileAnalysisResult[]): SynthesizedFinding[] {
    const findings: SynthesizedFinding[] = [];

    for (const analysis of fileAnalyses) {
      // Pattern: Security Issues
      if (analysis.codeQuality?.issues.some(i => i.category === 'security')) {
        const securityIssues = analysis.codeQuality.issues.filter(i => i.category === 'security');
        findings.push({
          file: analysis.file,
          pattern: 'Security Vulnerability',
          severity: securityIssues.some(i => i.severity === 'critical') ? 'critical' : 'high',
          relatedAgents: ['code-quality'],
          description: `Found ${securityIssues.length} security issue(s). This requires immediate attention before merging.`,
          recommendation: 'Review and fix all security vulnerabilities immediately. Consider security-focused code review.'
        });
      }

      // Pattern: Performance Issues
      if (analysis.codeQuality?.issues.some(i => i.category === 'performance')) {
        const perfIssues = analysis.codeQuality.issues.filter(i => i.category === 'performance');
        findings.push({
          file: analysis.file,
          pattern: 'Performance Risk',
          severity: perfIssues.some(i => i.severity === 'high') ? 'high' : 'medium',
          relatedAgents: ['code-quality'],
          description: `Identified ${perfIssues.length} performance concern(s). May impact user experience at scale.`,
          recommendation: 'Optimize performance-critical paths. Consider profiling under load.'
        });
      }

      // Pattern: Untested Critical Paths + Code Quality Issues
      if (
        analysis.testCoverage?.untestedPaths.some(p => p.priority === 'critical') &&
        analysis.codeQuality?.issues.some(i => i.severity === 'high')
      ) {
        findings.push({
          file: analysis.file,
          pattern: 'High-Risk Code',
          severity: 'critical',
          relatedAgents: ['code-quality', 'test-coverage'],
          description: 'Critical code path has both quality issues and lacks test coverage. This is high-risk.',
          recommendation: 'Write comprehensive tests before addressing other issues. Then fix quality concerns.'
        });
      }

      // Pattern: Complex Code Needs Refactoring + Lacks Tests
      const untestedCount = analysis.testCoverage?.untestedPaths.length ?? 0;
      if (
        analysis.refactoring?.suggestions.some(s => s.type === 'simplify' || s.type === 'extract-function') &&
        untestedCount > 2
      ) {
        findings.push({
          file: analysis.file,
          pattern: 'Complexity & Coverage Gap',
          severity: 'high',
          relatedAgents: ['refactoring', 'test-coverage'],
          description: 'Code complexity and lack of test coverage create maintainability debt.',
          recommendation: 'Start by adding tests to current behavior, then refactor with coverage as safety net.'
        });
      }

      // Pattern: Maintainability Issues
      if (analysis.codeQuality?.issues.some(i => i.category === 'maintainability')) {
        const maintIssues = analysis.codeQuality.issues.filter(i => i.category === 'maintainability');
        findings.push({
          file: analysis.file,
          pattern: 'Maintainability Concern',
          severity: 'medium',
          relatedAgents: ['code-quality'],
          description: `Found ${maintIssues.length} maintainability issue(s). May hinder future development.`,
          recommendation: 'Apply suggested refactorings to improve code clarity and maintainability.'
        });
      }

      // Pattern: Low Test Coverage
      const coverage = analysis.testCoverage?.coverageEstimate ?? 100;
      if (coverage < 70) {
        findings.push({
          file: analysis.file,
          pattern: 'Low Test Coverage',
          severity: analysis.testCoverage!.coverageEstimate < 50 ? 'high' : 'medium',
          relatedAgents: ['test-coverage'],
          description: `Test coverage is approximately ${analysis.testCoverage?.coverageEstimate ?? 0}%. Critical paths should have test coverage.`,
          recommendation: 'Add tests for critical functions and edge cases to improve reliability.'
        });
      }
    }

    return findings;
  }

  /**
   * Generate prioritized recommendations from all sources
   */
  private generateRecommendations(
    fileAnalyses: FileAnalysisResult[],
    synthesizedFindings: SynthesizedFinding[]
  ): PrioritizedRecommendation[] {
    const recommendations: PrioritizedRecommendation[] = [];
    const idMap = new Map<string, number>();

    // Critical security issues
    const securityFiles = new Set<string>();
    for (const analysis of fileAnalyses) {
      const criticalSecurity = analysis.codeQuality?.issues.filter(
        i => i.category === 'security' && (i.severity === 'critical' || i.severity === 'high')
      );
      if (criticalSecurity && criticalSecurity.length > 0) {
        securityFiles.add(analysis.file);
      }
    }

    if (securityFiles.size > 0) {
      recommendations.push({
        id: this.generateId('security', idMap),
        priority: 'critical',
        category: 'security',
        description: 'Fix critical security vulnerabilities',
        files: Array.from(securityFiles),
        estimatedEffort: 'high',
        impact: 'high'
      });
    }

    // High-risk untested code
    const unTestedCritical = new Set<string>();
    for (const analysis of fileAnalyses) {
      const critical = analysis.testCoverage?.untestedPaths.filter(p => p.priority === 'critical');
      if (critical && critical.length > 0) {
        unTestedCritical.add(analysis.file);
      }
    }

    if (unTestedCritical.size > 0) {
      recommendations.push({
        id: this.generateId('testing', idMap),
        priority: 'high',
        category: 'testing',
        description: 'Add tests for critical code paths',
        files: Array.from(unTestedCritical),
        estimatedEffort: 'high',
        impact: 'high'
      });
    }

    // Performance issues
    const perfFiles = new Set<string>();
    for (const analysis of fileAnalyses) {
      const perf = analysis.codeQuality?.issues.filter(
        i => i.category === 'performance' && i.severity !== 'low'
      );
      if (perf && perf.length > 0) {
        perfFiles.add(analysis.file);
      }
    }

    if (perfFiles.size > 0) {
      recommendations.push({
        id: this.generateId('performance', idMap),
        priority: 'high',
        category: 'performance',
        description: 'Optimize performance-critical code',
        files: Array.from(perfFiles),
        estimatedEffort: 'medium',
        impact: 'high'
      });
    }

    // Code quality improvements
    const qualityFiles = new Set<string>();
    for (const analysis of fileAnalyses) {
      const issues = analysis.codeQuality?.issues.filter(i => i.severity === 'medium');
      if (issues && issues.length > 0) {
        qualityFiles.add(analysis.file);
      }
    }

    if (qualityFiles.size > 0) {
      recommendations.push({
        id: this.generateId('code-quality', idMap),
        priority: 'medium',
        category: 'code-quality',
        description: 'Address code quality issues',
        files: Array.from(qualityFiles),
        estimatedEffort: 'medium',
        impact: 'medium'
      });
    }

    // Refactoring opportunities
    const refactorFiles = new Set<string>();
    for (const analysis of fileAnalyses) {
      const highImpact = analysis.refactoring?.suggestions.filter(s => s.impact === 'high');
      if (highImpact && highImpact.length > 0) {
        refactorFiles.add(analysis.file);
      }
    }

    if (refactorFiles.size > 0) {
      recommendations.push({
        id: this.generateId('architecture', idMap),
        priority: 'medium',
        category: 'architecture',
        description: 'Apply suggested refactorings to improve architecture',
        files: Array.from(refactorFiles),
        estimatedEffort: 'high',
        impact: 'medium'
      });
    }

    // Maintainability improvements
    const maintFiles = new Set<string>();
    for (const analysis of fileAnalyses) {
      const maint = analysis.codeQuality?.issues.filter(
        i => i.category === 'maintainability' && i.severity !== 'low'
      );
      if (maint && maint.length > 0) {
        maintFiles.add(analysis.file);
      }
    }

    if (maintFiles.size > 0) {
      recommendations.push({
        id: this.generateId('maintainability', idMap),
        priority: 'medium',
        category: 'maintainability',
        description: 'Improve code clarity and maintainability',
        files: Array.from(maintFiles),
        estimatedEffort: 'medium',
        impact: 'medium'
      });
    }

    return recommendations;
  }

  /**
   * Generate unique ID for recommendation
   */
  private generateId(category: string, idMap: Map<string, number>): string {
    const count = (idMap.get(category) ?? 0) + 1;
    idMap.set(category, count);
    return `${category}-${count}`;
  }

  /**
   * Get numeric value for priority sorting
   */
  private priorityOrder(priority: 'critical' | 'high' | 'medium' | 'low'): number {
    const order: Record<string, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1
    };
    return order[priority] || 0;
  }
}
