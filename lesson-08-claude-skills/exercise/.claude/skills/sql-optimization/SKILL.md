# SQL Query Optimization Skill

## Expertise

SQL query performance optimization for relational databases. Provides expertise in detecting anti-patterns, recommending indexes, and suggesting query rewrites for improved performance.

## Capabilities

- Detecting performance anti-patterns (SELECT *, N+1, missing WHERE)
- Index recommendations with justification
- Query rewriting for performance
- JOIN optimization strategies
- Subquery to JOIN conversion
- Conceptual explain plan analysis
- Pagination optimization

## Analysis Criteria

### Performance Anti-Patterns

**SELECT * Usage**
- Problem: Fetches unnecessary columns, increases I/O
- Impact: High on wide tables (>10 columns)
- Fix: Select only required columns

**Missing WHERE Clauses**
- Problem: Full table scans on large tables
- Impact: Critical on tables >10k rows
- Fix: Add filtering conditions

**N+1 Query Problem**
- Problem: Loop executing one query per row
- Impact: Critical - scales linearly with data
- Fix: Use JOIN or batch queries

**Missing Indexes**
- Problem: Full table scan for filtered columns
- Impact: High on frequently queried columns
- Fix: Create index on filter/join columns

**Inefficient JOINs**
- Problem: Wrong join type or unnecessary joins
- Impact: Medium to High
- Fix: Review join necessity and type

**Subqueries That Should Be JOINs**
- Problem: Correlated subqueries execute per row
- Impact: High on large datasets
- Fix: Convert to JOIN when possible

**Functions on Indexed Columns**
- Problem: Prevents index usage
- Impact: High - forces full table scan
- Fix: Restructure to use index

### Red Flags (Immediate Attention)

- `SELECT *` on tables with >10 columns
- Queries scanning >100k rows without indexes
- Multiple sequential queries that could be one JOIN
- `LIKE '%pattern%'` (non-prefix wildcard, can't use index)
- Functions on filtered columns: `WHERE YEAR(date) = 2024`
- `ORDER BY` on non-indexed columns with large result sets
- `DISTINCT` on large result sets (often indicates JOIN issues)

### Optimization Techniques

**Column Selection**
```sql
-- Bad
SELECT * FROM users WHERE status = 'active';

-- Good
SELECT id, name, email FROM users WHERE status = 'active';
```

**Index Usage**
```sql
-- Create index on frequently filtered columns
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
```

**JOIN Optimization**
```sql
-- Bad: N+1 queries
SELECT * FROM users;
-- Then loop: SELECT * FROM orders WHERE user_id = ?

-- Good: Single JOIN
SELECT u.*, o.* FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
```

**Subquery to JOIN**
```sql
-- Bad: Correlated subquery
SELECT * FROM orders
WHERE user_id IN (SELECT id FROM users WHERE status = 'active');

-- Good: JOIN
SELECT o.* FROM orders o
INNER JOIN users u ON o.user_id = u.id
WHERE u.status = 'active';
```

**Function on Column**
```sql
-- Bad: Function prevents index usage
SELECT * FROM events WHERE YEAR(created_at) = 2024;

-- Good: Range query uses index
SELECT * FROM events
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';
```

**Pagination**
```sql
-- Bad: OFFSET scales poorly
SELECT * FROM orders ORDER BY id LIMIT 10 OFFSET 10000;

-- Good: Keyset pagination
SELECT * FROM orders WHERE id > 10000 ORDER BY id LIMIT 10;
```

## Output Format

Return JSON with:
```json
{
  "issues": [
    {
      "line": 1,
      "type": "anti-pattern" | "missing-index" | "inefficient-join" | "function-on-column",
      "severity": "low" | "medium" | "high" | "critical",
      "description": "What the problem is",
      "impact": "Performance impact description"
    }
  ],
  "indexRecommendations": [
    {
      "table": "table_name",
      "columns": ["col1", "col2"],
      "reason": "Why this index helps"
    }
  ],
  "optimizedQuery": "The rewritten optimized query",
  "estimatedImprovement": "Description of expected speedup"
}
```

## Examples

### Example 1: SELECT * Anti-Pattern

**Input:**
```sql
SELECT * FROM orders WHERE status = 'pending';
```

**Analysis:**
```json
{
  "issues": [
    {
      "line": 1,
      "type": "anti-pattern",
      "severity": "high",
      "description": "SELECT * fetches all columns unnecessarily",
      "impact": "Increased I/O and memory usage"
    },
    {
      "line": 1,
      "type": "missing-index",
      "severity": "medium",
      "description": "No index on status column for filtering",
      "impact": "Full table scan required"
    }
  ],
  "indexRecommendations": [
    {
      "table": "orders",
      "columns": ["status"],
      "reason": "Frequently filtered column in WHERE clause"
    }
  ],
  "optimizedQuery": "SELECT id, user_id, total, created_at FROM orders WHERE status = 'pending'",
  "estimatedImprovement": "2-10x faster with index and column selection"
}
```

### Example 2: N+1 Query Problem

**Input:**
```sql
-- Query 1: Get all users
SELECT * FROM users WHERE status = 'active';

-- Query 2 (in loop): Get orders for each user
SELECT * FROM orders WHERE user_id = ?;
```

**Analysis:**
```json
{
  "issues": [
    {
      "line": 1,
      "type": "anti-pattern",
      "severity": "critical",
      "description": "N+1 query pattern - executing one query per user",
      "impact": "100 users = 101 queries. Scales linearly with data."
    }
  ],
  "indexRecommendations": [
    {
      "table": "orders",
      "columns": ["user_id"],
      "reason": "JOIN key should be indexed"
    }
  ],
  "optimizedQuery": "SELECT u.id, u.name, o.id as order_id, o.total FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.status = 'active'",
  "estimatedImprovement": "100x+ faster - single query instead of N+1"
}
```

### Example 3: Function on Indexed Column

**Input:**
```sql
SELECT * FROM events WHERE YEAR(created_at) = 2024 AND MONTH(created_at) = 6;
```

**Analysis:**
```json
{
  "issues": [
    {
      "line": 1,
      "type": "function-on-column",
      "severity": "high",
      "description": "YEAR() and MONTH() functions prevent index usage on created_at",
      "impact": "Full table scan even if index exists"
    }
  ],
  "indexRecommendations": [
    {
      "table": "events",
      "columns": ["created_at"],
      "reason": "Date range queries can use index if restructured"
    }
  ],
  "optimizedQuery": "SELECT id, name, created_at FROM events WHERE created_at >= '2024-06-01' AND created_at < '2024-07-01'",
  "estimatedImprovement": "10-100x faster with proper index usage"
}
```
