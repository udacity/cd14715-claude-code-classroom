// GitHub PR data types
export interface GitHubPRData {
  number: number;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  filesChanged: number;
  additions: number;
  deletions: number;
  changedFiles: DiffFile[];
}

export interface DiffFile {
  path: string;
  status: 'added' | 'deleted' | 'modified' | 'renamed' | 'copied';
  additions: number;
  deletions: number;
  patch: string; // Unified diff format
  beforeContent?: string; // Full file content before changes
  afterContent?: string; // Full file content after changes
}

export interface DiffHunk {
  oldStart: number;
  oldCount: number;
  newStart: number;
  newCount: number;
  lines: string[];
}

export interface AnalysisContext {
  prNumber: number;
  prTitle: string;
  author: string;
  repository: string;
  fileIndex: number;
  totalFiles: number;
}

export interface GitHubPRFetchOptions {
  owner: string;
  repo: string;
  prNumber: number;
}
