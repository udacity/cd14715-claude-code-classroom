---
description: "Intelligent support ticket routing system for analyzing, classifying, and routing 5,000+ customer support tickets daily"
tools:
  - bash
  - read
  - grep
  - glob
---

# Support Ticket System

## Project Overview

This intelligent support ticket routing system analyzes and routes more than 5,000 customer support tickets daily.

Main features include:

- **Classification**: Determines ticket urgency and category.
- **Routing**: Sends tickets to the appropriate support team.
- **SLA monitoring**: Tracks response-time requirements based on customer tier and ticket urgency.

The system is designed for support teams that need consistent and efficient ticket triage and for customers who need their issues handled by the appropriate team within the required SLA.

## Architecture

This system uses:

- **Ticket Analyzer Subagent**: A specialized subagent that analyzes individual support tickets, determines urgency and category, and recommends the appropriate routing team. It uses a restricted set of tools and the Haiku model for fast ticket analysis.
- **Ticket Classification Skill**: A domain-specific skill that provides the rules, urgency matrix, keywords, category definitions, routing rules, and examples needed to classify support tickets consistently.

## How to Use

```bash
# Analyze a single ticket
claude "Analyze the ticket in sample-tickets/technical.txt"

# Classify all tickets
claude "Classify all tickets in sample-tickets/ and route appropriately"

# Check SLA status
claude "Check the SLA status for all tickets in sample-tickets/"
