# Video: Introduction to Model Context Protocol
*Module 9.1 | Topic: Model Context Protocol*

---

## Opening Hook

> *"Your agent can read files, run code, and search the web. But what about your company's database? Your CRM? GitHub? Slack? You could build custom integrations for each—or you could use MCP, the universal protocol that's become the industry standard for connecting AI to external systems. Over 10,000 MCP servers already exist. Let's understand how this protocol works."*

---

## Key Discussion Points

1. **What is MCP?**
   - Model Context Protocol: An open standard for connecting AI to external data and tools
   - Created by Anthropic, now governed by the Linux Foundation's Agentic AI Foundation
   - The "USB-C of AI integrations"—one protocol, universal compatibility
   - Solves the N×M problem: Instead of every AI building integrations with every service, everyone speaks MCP
   - Adopted by Claude, ChatGPT, Gemini, VS Code, Cursor, Microsoft Copilot, and more

2. **MCP architecture: Three components**
   - **Hosts**: The AI application (Claude Code, your agent, an IDE)
   - **Clients**: Connectors inside the host that manage server connections
   - **Servers**: Services that expose data and capabilities
   - Flow: Host → Client → Server → External System
   - Think of it like a web browser (host) connecting to websites (servers) via HTTP (protocol)

3. **What servers expose: The three primitives**
   - **Resources**: Data and context (files, database records, API responses)
   - **Tools**: Functions the AI can call (create ticket, send message, query database)
   - **Prompts**: Pre-built templates and workflows
   - Servers declare their capabilities; clients discover and use them
   - This is how Claude "learns" what a server can do

4. **Industry standard status**
   - Started as Anthropic internal project (2024)
   - Open-sourced and rapidly adopted across the industry
   - Now under Linux Foundation governance with support from:
     - Anthropic, OpenAI, Google, Microsoft, AWS, Cloudflare
   - 10,000+ published MCP servers covering developer tools to enterprise systems
   - Official MCP Registry for discovering available servers

5. **Pre-built servers: The ecosystem**
   - **Developer tools**: GitHub, GitLab, Linear, Jira
   - **Databases**: PostgreSQL, MongoDB, Supabase
   - **Communication**: Slack, Discord, email
   - **Cloud services**: AWS, GCP, Azure
   - **File systems**: Local files, Google Drive, S3
   - Most common integrations already exist—you just configure them

6. **The MCP ecosystem advantage**
   - Write once, use everywhere: Server works with any MCP-compatible AI
   - Community-driven: Thousands of contributors building servers
   - Enterprise-ready: Fortune 500 deployments in production
   - Composable: Connect multiple servers to one agent
   - Future-proof: As new AI platforms emerge, they'll speak MCP

7. **How MCP connects to what you've learned**
   - Module 6 (Custom Tools): MCP servers expose tools—same concept, standardized protocol
   - Module 5 (Agent SDK): `mcpServers` option in query() connects to MCP servers
   - The difference: Custom tools = you implement; MCP = you configure pre-built servers
   - MCP is tool use at ecosystem scale

---

## Examples to Include

| Example | Description | Level of Detail |
|---------|-------------|-----------------|
| Architecture diagram | Host → Client → Server → External System | Deep dive - visual mental model |
| Three primitives | Resources vs Tools vs Prompts comparison | Walkthrough - core concepts |
| Ecosystem map | Categories of available MCP servers | Deep dive - practical reference |
| Before/after MCP | N×M problem vs universal protocol | Brief - motivation |
| GitHub MCP example | What capabilities GitHub server exposes | Walkthrough - concrete example |

---

## What NOT to Cover

- MCP server configuration syntax - covered in Module 9.2
- Building custom MCP servers - advanced topic
- Security implementation details - briefly mention, don't deep dive
- Transport mechanisms (stdio, HTTP, SSE) - implementation detail
- Server authentication setup - covered in Module 9.2

---

## Additional Notes

- This is CONCEPTUAL—students should understand the architecture and ecosystem
- Module 9.2 will have them configure GitHub MCP server to build a file summarizer

- The "industry standard" point is powerful:
  - "This isn't just an Anthropic thing anymore"
  - "OpenAI, Google, Microsoft all support it"
  - "Learning MCP is learning the universal language of AI integrations"

- Key insight: "MCP is to AI what HTTP is to the web"
  - Before HTTP: Every system had custom protocols
  - After HTTP: Universal web access
  - Before MCP: Every AI built custom integrations
  - After MCP: Universal tool/data access

- Connect to Module 6 (Custom Tools):
  - "Custom tools = you write the function"
  - "MCP tools = someone else wrote it, you just connect"
  - "Same underlying concept, different delivery mechanism"

- Security mention (brief):
  - "MCP servers can access sensitive data and execute code"
  - "Always review what servers can do before connecting"
  - "User consent and control are core principles"
  - Don't go deep—just establish awareness

- Terminology:
  - "Host" - the AI application (Claude Code, your agent)
  - "Client" - connector that manages server communication
  - "Server" - service exposing capabilities via MCP
  - "Resources" - data/context a server provides
  - "Tools" - functions a server exposes
  - "Registry" - directory of available MCP servers

- Analogy: "Think of MCP like app stores for AI capabilities. The protocol is like the app store interface—standardized so any app can be installed. MCP servers are like apps—pre-built, reviewed, ready to use. Your agent is like a phone—it can install and use any app that follows the standard."

- The ecosystem scale:
  - "10,000+ servers means most integrations you need already exist"
  - "You're configuring, not building from scratch"
  - "Focus on your unique business logic, not plumbing"

- Preview for Module 9.2: "In the next module, you'll connect Claude to GitHub using the pre-built GitHub MCP server and build an agent that can fetch and summarize files from any repository."

---

## Sources

- [Anthropic: Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2025-11-25)
- [Anthropic: Donating MCP to Agentic AI Foundation](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation)
- [Linux Foundation: Agentic AI Foundation Announcement](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)
- [Model Context Protocol GitHub](https://github.com/modelcontextprotocol)

---
