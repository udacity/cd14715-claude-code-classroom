/**
 * Sample Code Files for Testing the Code Quality Reviewer
 */

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface CodeFile {
  id: string;
  name: string;
  path: string;
  expectedIssues: string[];
}

export const CODE_FILES: CodeFile[] = [
  {
    id: "clean",
    name: "Clean Code",
    path: path.join(__dirname, "sample-code", "clean.js"),
    expectedIssues: [],
  },
  {
    id: "issues",
    name: "Code with Issues",
    path: path.join(__dirname, "sample-code", "issues.js"),
    expectedIssues: ["no-unused-vars", "no-var", "no-eval", "no-console"],
  },
  {
    id: "errors",
    name: "Code with Errors",
    path: path.join(__dirname, "sample-code", "errors.js"),
    expectedIssues: ["no-var", "no-cond-assign", "missing-semicolons"],
  },
];
