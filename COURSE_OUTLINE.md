# Claude Code Classroom - Course Outline

## Lesson 05: Claude Agent SDK

### Demo: Document Summarizer

**Tools:**
- @anthropic-ai/claude-agent-sdk package
- TypeScript/Node.js
- Sample markdown file (API documentation)

**Key Insights:**
- The `query()` function from Agent SDK
- How `allowedTools` enables agent capabilities
- Automatic tool execution (ReAct loop)
- Streaming response handling with `for await`
- Extracting results from agent messages

**Steps:**
1. Install @anthropic-ai/claude-agent-sdk package
2. Import `query` from the SDK
3. Create a prompt function that includes the file path
4. Call `query()` with prompt and `allowedTools: ["Read"]`
5. Iterate over messages with `for await`
6. Check for `message.type === "result"` to get final output
7. Parse the raw result into structured format

---

### Exercise: Contract Standardizer

**Tools:**
- @anthropic-ai/claude-agent-sdk package
- TypeScript/Node.js
- Contract text files (.txt)

**Key Insights:**
- Using multiple tools together (Read + Write)
- Agent reads input files and writes output files
- File-based document processing workflow
- Defining output templates in prompts

**Steps:**
1. Create contract files in `src/contracts/` folder
2. Create `src/standardized/` folder for output
3. Define `StandardizedContract` interface with inputPath, outputPath, raw
4. Create prompt function with input path and output path
5. Call `query()` with `allowedTools: ["Read", "Write"]`
6. Agent reads contract, extracts terms, writes standardized output
7. Return result with file paths

---

## Lesson 06: Custom Tools

### Demo: Tax Calculator

**Tools:**
- @anthropic-ai/claude-agent-sdk package
- Zod schema library
- TypeScript/Node.js

**Key Insights:**
- Creating custom MCP tools with `createSdkMcpServer`
- Using `tool()` helper for tool definition
- Zod schemas for parameter validation
- Tool naming convention: `mcp__<server>__<tool>`
- Connecting custom tools to agents via `mcpServers` option

**Steps:**
1. Import `createSdkMcpServer` and `tool` from SDK
2. Import `z` from Zod
3. Define tool parameter schema with Zod
4. Create tool with name, description, schema, and handler function
5. Create MCP server with `createSdkMcpServer`
6. Pass server to `query()` via `mcpServers` option
7. Add tool to `allowedTools` with `mcp__` prefix

---

### Exercise: API Validator

**Tools:**
- @anthropic-ai/claude-agent-sdk package
- Zod schema library
- TypeScript/Node.js
- fetch API for HTTP requests

**Key Insights:**
- Building validation tools for API testing
- Checking schema compliance and SLA performance
- Returning structured validation results
- Real-world tool use case for CI/CD pipelines

**Steps:**
1. Define `ValidationResult` interface with success, statusCode, latencyMs, etc.
2. Create Zod schema for tool parameters (apiUrl, method, expectedFields, maxLatencyMs)
3. Implement validation logic (fetch, check fields, measure latency)
4. Create tool with `tool()` helper
5. Create MCP server with `createSdkMcpServer`
6. Test with agent using `mcpServers` and `allowedTools`

---

## Lesson 07: Structured Outputs

### Demo: Product Review Analyzer

**Tools:**
- @anthropic-ai/claude-agent-sdk package
- Zod schema library
- zod-to-json-schema package
- TypeScript/Node.js

**Key Insights:**
- Defining output schemas with Zod
- Converting Zod to JSON Schema with `zodToJsonSchema`
- Using `outputFormat` option in `query()`
- Accessing `message.structured_output` for parsed data
- Type safety with `z.infer<typeof Schema>`

**Steps:**
1. Define Zod schema for expected output structure
2. Add field descriptions with `.describe()`
3. Convert to JSON Schema with `zodToJsonSchema()`
4. Create analysis prompt
5. Call `query()` with `outputFormat: { type: "json_schema", schema }`
6. Check for `message.structured_output` in response
7. Validate with `Schema.parse()` for type safety

---

### Exercise: Meeting Notes Analyzer

**Tools:**
- @anthropic-ai/claude-agent-sdk package
- Zod schema library
- zod-to-json-schema package
- TypeScript/Node.js

**Key Insights:**
- Nested schemas (ActionItem, Decision within MeetingAnalysis)
- Arrays of objects in schemas
- Optional fields with `.optional()`
- String constraints with `.max()`
- Enum validation with `.enum()`

**Steps:**
1. Define `ActionItemSchema` with task, assignee, dueDate, priority
2. Define `DecisionSchema` with decision, rationale, impact
3. Define `MeetingAnalysisSchema` with nested arrays
4. Export types with `z.infer<>`
5. Convert to JSON Schema
6. Create `analyzeMeeting()` function with structured output
7. Return validated `MeetingAnalysis` object

---

## Lesson 08: Claude Skills

### Demo: Email Etiquette Reviewer

**Tools:**
- @anthropic-ai/claude-agent-sdk package
- TypeScript/Node.js
- SKILL.md file in .claude/skills/

**Key Insights:**
- Skills are SKILL.md files in `.claude/skills/<name>/`
- Skills loaded via `settingSources: ["project"]`
- Skills accessed via `Skill` tool
- Skills can only use Read, Grep, Glob tools
- Reusable expertise across agents

**Steps:**
1. Create `.claude/skills/email-etiquette/SKILL.md`
2. Define Expertise, Capabilities, Analysis Criteria sections
3. Add Output Format specification
4. Include Examples with before/after
5. Create agent function with `cwd` pointing to project root
6. Set `settingSources: ["project"]` to load skills
7. Set `allowedTools: ["Skill", "Read", "Grep", "Glob"]`
8. Prompt agent to use the skill for analysis

---

### Exercise: JavaScript Code Reviewer

**Tools:**
- @anthropic-ai/claude-agent-sdk package
- TypeScript/Node.js
- SKILL.md file in .claude/skills/
- Sample JavaScript files

**Key Insights:**
- Creating code review skills with detailed criteria
- Categorizing issues (quality, bugs, security, style)
- Severity levels (error, warning, info)
- Quality score calculation
- Actionable recommendations

**Steps:**
1. Create `.claude/skills/js-code-review/SKILL.md`
2. Define code quality criteria (var usage, console.log, etc.)
3. Define bug detection criteria (loose equality, missing await)
4. Define security criteria (eval, innerHTML, hardcoded secrets)
5. Specify output format with issues array and quality score
6. Create sample JS files with intentional issues
7. Create `reviewJavaScriptFile()` function
8. Use `settingSources: ["project"]` and `allowedTools: ["Skill", "Read", "Grep", "Glob"]`
