/**
 * Sample Contracts
 *
 * 4 test cases for contract standardization with varying formats.
 */

export const CONTRACTS = {
  // Well-structured SaaS agreement
  saas: `SOFTWARE AS A SERVICE AGREEMENT

This Agreement is entered into as of January 15, 2024 between CloudTech Solutions Inc.
("Provider") and Acme Corporation ("Customer").

1. SERVICES: Provider will provide access to its cloud-based project management platform.

2. TERM: This Agreement begins on the Effective Date and continues for 12 months.

3. FEES: Customer will pay $2,500 per month, billed annually in advance ($30,000/year).
   Payment due within 30 days of invoice.

4. LIABILITY: Provider's total liability shall not exceed fees paid in the prior 12 months.
   Neither party liable for indirect, consequential, or punitive damages.

5. TERMINATION: Either party may terminate with 60 days written notice.
   Customer may terminate immediately if Provider breaches and fails to cure within 30 days.

6. DATA: Provider will store data in US data centers. Customer retains ownership of all data.
   Provider will delete data within 30 days of termination upon request.

7. IP: Provider retains all IP rights to the platform. Customer retains rights to their data.

8. CONFIDENTIALITY: Both parties agree to maintain confidentiality of proprietary information
   for 3 years following termination.`,

  // Less formal consulting agreement
  consulting: `CONSULTING SERVICES AGREEMENT

Date: February 1, 2024
Consultant: Jane Smith Consulting LLC
Client: TechStartup Inc.

Scope: Strategic product consulting for mobile app development
Duration: 3 months (Feb 1 - Apr 30, 2024)
Rate: $200/hour, estimated 40 hours/month
Payment: Net 15 from invoice date

Deliverables:
- Product roadmap document
- Competitive analysis report
- Weekly strategy calls

Termination: 2 weeks notice by either party
IP: All deliverables become property of Client upon payment`,

  // Complex vendor MSA
  vendor: `MASTER SERVICES AGREEMENT

Effective Date: March 1, 2024
Vendor: GlobalSupply Co.
Customer: Manufacturing Corp.

Services: Supply chain management and logistics
Contract Value: $500,000 annually
Payment Terms: Net 45

Liability Cap: $2,000,000
Insurance Required: $5,000,000 general liability

Termination: 90 days notice required
Auto-renewal: Yes, for successive 1-year terms unless cancelled

Data Protection: Vendor will comply with GDPR and CCPA requirements.
Confidentiality: Perpetual for trade secrets.`,

  // Minimal email proposal
  email: `Hi Team,

Following our call, here's our proposal:

We'll provide website redesign services for $15,000.
Timeline: 6 weeks
50% deposit to start, 50% on completion.

Let me know if you want to proceed.

Thanks,
Bob from DesignCo`,
};
