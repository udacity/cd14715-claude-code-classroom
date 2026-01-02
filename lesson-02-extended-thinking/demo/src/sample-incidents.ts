/**
 * Sample Incidents
 *
 * Different complexity levels for root cause analysis.
 */

export const INCIDENTS = {
  // Checkout conversion drop incident
  checkout: `Checkout conversion dropped 40% at 2:00 PM EST.

Recent changes (last 24 hours):
- 1:45 PM: Deployed new payment SDK v2.1
- Yesterday 9 AM: Updated checkout UI with new button styles
- Last week: Migrated database to new AWS region

Error logs show:
- 2:05 PM: "Payment gateway timeout" errors spike to 500/min
- 2:10 PM: "Transaction failed" responses increase 300%
- No errors related to UI or database

User complaints:
- "Checkout button does nothing"
- "Payment keeps failing"
- "Stuck on payment page"`,

  // API latency incident
  latency: `API response times increased from 200ms to 2000ms at 3:30 PM.

Recent changes:
- 3:00 PM: Deployed new caching layer
- 2:00 PM: Added new analytics tracking to all endpoints
- Yesterday: Updated rate limiting rules

Metrics:
- Database query times: Normal (50ms avg)
- Cache hit rate: Dropped from 85% to 5%
- CPU usage: Normal
- Memory usage: Normal

Error logs:
- "Cache miss" warnings increased 1700%
- No database errors
- No rate limiting blocks`,
};
