/**
 * Sample Support Tickets
 *
 * Different complexity levels to demonstrate model selection.
 */

export const TICKETS = {
  // Simple ticket -> Use Haiku (fast & cheap)
  simple: `Subject: Password Reset
How do I reset my password? I forgot it and can't log in.`,

  // Moderate ticket -> Use Sonnet (balanced)
  moderate: `Subject: Billing Issue
I was charged twice for my subscription this month ($29.99 on Jan 5 and Jan 7).
I only have one account. Please refund the duplicate charge and explain why this happened.
My account email is john@example.com. I've attached my bank statement showing both charges.`,

  // Complex ticket -> Use Opus (powerful reasoning)
  complex: `Subject: Multiple Critical Issues - Enterprise Account

We're experiencing several interconnected issues with our enterprise deployment:

1. API Integration: Our webhook endpoints stopped receiving events 3 days ago.
   We've verified our SSL certs are valid and firewall rules unchanged.

2. Data Sync: User data between our CRM and your platform is mismatched.
   ~500 users show different subscription tiers than what we have on record.

3. Performance: Dashboard load times increased from 2s to 15s since your last update.

4. Billing: We're being charged for 1000 seats but only provisioned 750.

This is affecting our Q1 product launch. We need a comprehensive action plan
with root cause analysis and timeline for resolution. Our contract renewal
is in 30 days and this will impact our decision.`,
};
