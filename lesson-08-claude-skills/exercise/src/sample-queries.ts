/**
 * Sample SQL Queries for Testing the SQL Optimization Skill
 */

export interface TestQuery {
  name: string;
  query: string;
  expectedIssues: string[];
}

export const sampleQueries: TestQuery[] = [
  {
    name: "SELECT * anti-pattern",
    query: `SELECT * FROM orders WHERE status = 'pending';`,
    expectedIssues: ["SELECT * usage", "Possible missing index on status"],
  },
  {
    name: "N+1 query problem",
    query: `-- Get all users
SELECT * FROM users WHERE status = 'active';

-- Then in a loop for each user:
SELECT * FROM orders WHERE user_id = ?;`,
    expectedIssues: ["N+1 query pattern", "SELECT * usage"],
  },
  {
    name: "Function on indexed column",
    query: `SELECT * FROM events
WHERE YEAR(created_at) = 2024
AND MONTH(created_at) = 6;`,
    expectedIssues: ["Function prevents index usage", "SELECT * usage"],
  },
  {
    name: "Inefficient subquery",
    query: `SELECT * FROM orders
WHERE user_id IN (
  SELECT id FROM users WHERE status = 'active'
);`,
    expectedIssues: ["Subquery could be JOIN", "SELECT * usage"],
  },
  {
    name: "Well-optimized query",
    query: `SELECT o.id, o.total, o.created_at, u.name as customer_name
FROM orders o
INNER JOIN users u ON o.user_id = u.id
WHERE o.status = 'pending'
  AND o.created_at >= '2024-01-01'
ORDER BY o.created_at DESC
LIMIT 100;`,
    expectedIssues: [], // This query follows best practices
  },
];
