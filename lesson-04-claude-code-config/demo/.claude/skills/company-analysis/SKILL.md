---
name: company-analysis
description: Analyze companies and generate comprehensive research reports. Use when user asks to research, analyze, profile, or investigate a company.
allowed-tools: Read, Grep, WebSearch, WebFetch
---

# Company Analysis Skill

This skill teaches Claude how to conduct thorough company research and generate structured reports.

## When to Use This Skill

Use this skill when the user requests:
- "Research [Company Name]"
- "Analyze [Company Name]"
- "Tell me about [Company Name]"
- "Generate a company profile for [Company Name]"
- "What does [Company Name] do?"

## Research Methodology

### Phase 1: Initial Discovery (5 minutes)

**Gather Basic Information:**
- Company name and website
- Industry/sector
- Company size (employees)
- Headquarters location
- Founding date

**Quick searches:**
```bash
"[Company Name] official website"
"[Company Name] about"
"[Company Name] crunchbase"
```

### Phase 2: Detailed Research (10-15 minutes)

**Products & Services:**
- Main products/services offered
- Target market (B2B, B2C, enterprise, SMB)
- Pricing model (if public)
- Key features and differentiators

**Business Information:**
- Business model (SaaS, marketplace, ecommerce, etc.)
- Revenue model (subscription, transaction, ads, etc.)
- Customer segments
- Competitive positioning

**Leadership & Team:**
- Founders and founding story
- CEO and executive team
- Notable advisors or board members
- Company culture highlights

**Technical Details:**
- Technology stack
- Infrastructure and platforms
- API/developer ecosystem
- Open source contributions

**Recent Activity:**
- Latest product launches
- Funding rounds (last 2 years)
- Press mentions and news
- Partnerships and acquisitions

### Phase 3: Analysis & Synthesis (5 minutes)

**Connect the dots:**
- What problem does the company solve?
- Who are their main competitors?
- What's their growth trajectory?
- What makes them unique?

## Standard Report Format

Use this structure for all company research reports:

```markdown
# Company Research Report: [Company Name]

## Executive Summary

[2-3 sentence overview of what the company does, who they serve, and why they matter]

## Company Overview

**Founded**: [Year]
**Founders**: [Names]
**Headquarters**: [City, State/Country]
**Company Size**: [Number of employees]
**Industry**: [Primary industry/sector]
**Website**: [URL]

## Products & Services

### Core Offerings

**[Product/Service Name]**
- **Description**: [What it does]
- **Target Market**: [Who uses it]
- **Key Features**: [Main capabilities]

**[Product/Service Name]**
- [Same structure]

### Business Model

[How they make money - subscription, freemium, transaction fees, etc.]

## Leadership Team

### Founders
- **[Name]**, [Title] - [Brief background]

### Executive Team
- **CEO**: [Name] - [Brief background]
- **CTO**: [Name] - [Brief background]
- **[Other C-suite]**: [Name] - [Brief background]

## Technology & Stack

**Frontend**: [Technologies]
**Backend**: [Technologies]
**Infrastructure**: [Cloud providers, databases]
**Developer Tools**: [APIs, SDKs, open source projects]

## Market Position

**Target Customers**: [Description of ideal customer]
**Competitive Landscape**: [Main competitors and differentiation]
**Market Size**: [If available - TAM, SAM]

## Recent Developments

**Last 12 Months:**
- [Funding rounds, acquisitions, product launches]
- [Key hires or leadership changes]
- [Partnerships or integrations]
- [Notable press or awards]

## Key Metrics (if public)

- **Funding**: [Total raised, latest round]
- **Valuation**: [Last known valuation]
- **Growth**: [User count, revenue growth, etc.]

## Sources

- [URL 1 - Company website]
- [URL 2 - Crunchbase]
- [URL 3 - News article]
- [URL 4 - Tech blog]
```

## Research Tips

### Finding Company Information

**Official Sources (highest priority):**
1. Company website (about, products, team pages)
2. Company blog and press releases
3. LinkedIn company page
4. Official social media accounts

**Third-Party Sources:**
1. Crunchbase (funding, team, metrics)
2. TechCrunch and tech news sites
3. Industry analyst reports
4. GitHub (for tech companies)

**Technical Stack Research:**
1. Company careers page (technologies they hire for)
2. Engineering blog posts
3. GitHub repositories
4. BuiltWith or Wappalyzer
5. API documentation

### Search Patterns That Work

```bash
# Basic company info
"[Company] about"
"[Company] what we do"

# Funding and growth
"[Company] funding"
"[Company] series A/B/C"
"[Company] raised"

# Technical details
"[Company] tech stack"
"[Company] engineering blog"
"site:github.com [Company]"

# Leadership
"[Company] leadership team"
"[Company] founders"
"[Company] CEO"

# Recent news
"[Company] news [current year]"
"[Company] launched [current year]"
```

## Example Analysis

### Research Request: "Research Stripe"

**Step 1: Initial Discovery**
- Search "Stripe official website"
- Visit stripe.com
- Found: Payment processing platform, founded 2010, San Francisco

**Step 2: Detailed Research**
- Products: Payment processing, Stripe Connect, Stripe Atlas
- Tech stack: Ruby, JavaScript, APIs
- Leadership: Patrick & John Collison (founders)
- Recent: Embedded finance, crypto support

**Step 3: Generate Report**
[Use standard format above]

## Quality Checklist

Before delivering the report, verify:

- [ ] All sections have relevant information (or marked "Not available")
- [ ] Sources are cited for key facts
- [ ] Information is current (check dates)
- [ ] Technical details are accurate
- [ ] Leadership information is up-to-date
- [ ] No speculation - only facts
- [ ] Formatted consistently

## Common Pitfalls to Avoid

❌ **Don't:**
- Include outdated information without noting the date
- Speculate about company strategy or financials
- Mix up different companies with similar names
- Include unverified rumors
- Copy marketing language verbatim

✅ **Do:**
- Focus on verifiable facts
- Note when information is unavailable
- Cite sources for all claims
- Use neutral, analytical tone
- Update research if company has changed significantly

## Delegating to Subagents

When appropriate, delegate portions of research:

**Use `web-researcher` for:**
- Gathering product information
- Finding tech stack details
- Collecting company metrics

**Use `people-finder` for:**
- Leadership team research
- Founder backgrounds
- Organizational structure

**Example:**
```markdown
Let me delegate to specialized subagents for thorough research:
- Using `web-researcher` to gather company and product details
- Using `people-finder` to identify leadership team
- I'll synthesize the information into a comprehensive report
```

## Report Variations

### Quick Profile (2-3 paragraphs)
When user asks for a "quick overview" or "brief summary":

```markdown
[Company Name] is a [industry] company founded in [year] that provides [core offering]. They serve [target market] with products including [main products]. The company was founded by [founders] and is headquartered in [location]. [Recent notable achievement or funding].
```

### Technical Deep Dive
When user asks specifically about technology:

Focus on:
- Architecture and infrastructure
- Programming languages and frameworks
- APIs and developer tools
- Open source projects
- Engineering blog highlights

### Competitive Analysis
When user asks "Compare [Company A] to [Company B]":

Create side-by-side comparison table:
| Aspect | Company A | Company B |
|--------|-----------|-----------|
| Founded | [Year] | [Year] |
| Products | [List] | [List] |
| Target Market | [Description] | [Description] |
| Pricing | [Model] | [Model] |

## Success Criteria

A good company research report should:

1. ✅ Answer the user's question comprehensively
2. ✅ Provide accurate, current information
3. ✅ Include proper source citations
4. ✅ Use clear, professional formatting
5. ✅ Distinguish facts from speculation
6. ✅ Be actionable (user can make decisions from it)
