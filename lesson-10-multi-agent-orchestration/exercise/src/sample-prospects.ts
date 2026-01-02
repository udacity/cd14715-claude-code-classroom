/**
 * Sample Prospects for Testing the Sales Qualifier
 */

export interface ProspectInfo {
  name: string;
  companyName: string;
  title: string;
  email: string;
  source: "inbound" | "outbound";
  companyType: "enterprise" | "smb" | "startup";
}

export const sampleProspects: ProspectInfo[] = [
  {
    name: "Sarah Chen",
    companyName: "TechCorp Industries",
    title: "VP of Engineering",
    email: "sarah.chen@techcorp.com",
    source: "inbound",
    companyType: "enterprise",
  },
  {
    name: "Mike Johnson",
    companyName: "GrowthStartup Inc",
    title: "CTO",
    email: "mike@growthstartup.io",
    source: "inbound",
    companyType: "startup",
  },
  {
    name: "Lisa Park",
    companyName: "LocalBiz Solutions",
    title: "IT Director",
    email: "lpark@localbiz.com",
    source: "outbound",
    companyType: "smb",
  },
];

// Mock company data for consistent testing
export const mockCompanyData: Record<string, object> = {
  "TechCorp Industries": {
    industry: "Enterprise Software",
    employees: 2500,
    revenue: "$500M-$1B",
    techStack: ["AWS", "Kubernetes", "PostgreSQL", "React"],
    recentNews: [
      "Raised $200M Series D",
      "Expanding to European market",
      "New CTO hired from Google",
    ],
    decisionMakers: ["Sarah Chen (VP Engineering)", "Tom Wilson (CIO)", "CFO"],
  },
  "GrowthStartup Inc": {
    industry: "SaaS / Developer Tools",
    employees: 45,
    revenue: "$5M-$10M ARR",
    techStack: ["Vercel", "Node.js", "MongoDB", "React"],
    recentNews: ["Raised $8M Seed round", "Launched v2.0 of platform"],
    decisionMakers: ["Mike Johnson (CTO)", "CEO/Founder"],
  },
  "LocalBiz Solutions": {
    industry: "Professional Services",
    employees: 150,
    revenue: "$20M-$50M",
    techStack: ["Azure", "Salesforce", "Legacy .NET apps"],
    recentNews: ["Acquired smaller competitor", "Hiring for tech modernization"],
    decisionMakers: ["Lisa Park (IT Director)", "COO"],
  },
};
