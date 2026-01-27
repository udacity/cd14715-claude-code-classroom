# Video: Introduction to Custom Tools in Claude Agent SDK
*Module 6.1 | Topic: Custom Tool Development*

---

## Opening Hook

> *"Built-in tools like Read, Edit, and Bash are powerful—but what if your agent needs to call your company's API, query a proprietary database, or interact with a custom service? Custom tools let you extend what agents can do. You define the interface, Claude decides when to use it, and your code handles the execution."*

---

## Key Discussion Points

1. **What is tool use in Claude?**
   - Tools are functions Claude can call during execution
   - Claude sees the tool's NAME, DESCRIPTION, and PARAMETERS
   - Based on the task, Claude decides WHEN and HOW to use tools
   - This is the "action" part of the perception-reasoning-action cycle
   - Tools bridge Claude's intelligence with real-world capabilities

2. **Built-in vs custom tools**
   - **Built-in tools**: Provided by the SDK (Read, Edit, Bash, Glob, Grep, WebSearch, etc.)
   - **Custom tools**: You define them for your specific use case
   - Built-in tools cover common development tasks
   - Custom tools extend to YOUR domain: APIs, databases, services, business logic
   - Both work the same way from Claude's perspective

3. **The tool function pattern**
   - Every tool has three parts:
     - **Name**: How Claude references it (e.g., `calculate_tax`, `fetch_customer`)
     - **Description**: What it does—Claude reads this to decide when to use it
     - **Parameters**: What inputs it needs (with types and descriptions)
   - The description is CRITICAL—it's how Claude knows when this tool applies
   - Think of it as documentation for an AI reader

4. **Tool schemas: Defining the interface**
   - Parameters are defined using JSON Schema
   - Types: string, number, boolean, array, object
   - Required vs optional parameters
   - Descriptions for each parameter help Claude provide correct values
   - Schema = contract between Claude and your code
   - Example schema concepts:
     - `type`: What kind of data
     - `description`: What this parameter means
     - `enum`: Constrained set of valid values
     - `required`: Which parameters must be provided

5. **When to create custom tools**
   - External API integration (your company's services)
   - Database queries (business data access)
   - Domain-specific calculations (tax, pricing, compliance)
   - System integrations (internal tools, third-party services)
   - Anything built-in tools can't do
   - Rule of thumb: If Claude needs to DO something in YOUR system, you need a custom tool

6. **Tool execution flow**
   - Claude decides to use a tool based on the task
   - Claude provides arguments matching the schema
   - YOUR code executes and returns results
   - Claude observes the result and continues reasoning
   - The SDK handles the orchestration—you just implement the function

7. **Design principles for good tools**
   - **Single responsibility**: One tool, one job
   - **Clear naming**: `get_customer_orders` not `do_stuff`
   - **Descriptive descriptions**: Tell Claude exactly when to use it
   - **Typed parameters**: Prevent errors, guide Claude's choices
   - **Informative returns**: Give Claude enough context to continue

---

## Examples to Include

| Example | Description | Level of Detail |
|---------|-------------|-----------------|
| Built-in vs custom comparison | Table showing when each applies | Deep dive - decision framework |
| Tool anatomy diagram | Name + description + parameters visual | Deep dive - core concept |
| JSON Schema basics | Type, description, required fields | Walkthrough - practical reference |
| Tool selection by Claude | How description influences tool choice | Walkthrough - key insight |
| Use case examples | API call, database query, calculation | Brief - inspiration |

---

## What NOT to Cover

- Actual TypeScript/Python implementation syntax - covered in Module 6.2
- MCP tools and server configuration - covered in Module 9
- Structured outputs from tools - covered in Module 7
- Multi-tool orchestration patterns - covered in Module 10
- Error handling and retries - implementation detail for 6.2

---

## Additional Notes

- This is CONCEPTUAL—students should understand WHY and WHEN before HOW
- Module 6.2 will have them implement a tax calculator and weather API tool

- Key insight: "The description is the most important part"
  - Claude READS the description to decide when to use a tool
  - Bad description = tool never gets used (or used incorrectly)
  - Good description = Claude knows exactly when it applies

- Contrast with regular function calls:
  - Regular code: YOU call the function
  - Tool use: CLAUDE calls the function
  - This inversion is what makes agents autonomous

- Connect to Module 5:
  - "Remember allowedTools in query()? Those are built-in tools."
  - "Custom tools get added the same way—you're expanding the toolkit."

- Terminology:
  - "Tool" - a function Claude can call
  - "Schema" - the definition of a tool's interface
  - "Parameters" - inputs the tool needs
  - "Tool call" - when Claude invokes the tool
  - "Tool result" - what your code returns

- Analogy: "Think of tools like apps on a phone. Built-in tools are pre-installed apps. Custom tools are apps you download for specific needs. Claude is the user who picks which app to use based on what they're trying to accomplish."

- Common mistake to address:
  - "Don't make tools too broad ('do_everything') or too narrow ('add_two_specific_numbers')"
  - "Find the right granularity—one clear job per tool"

- Preview for Module 6.2: "In the next module, you'll build custom tools for tax calculation and weather data, seeing how Claude automatically chooses the right tool for each task."

---
