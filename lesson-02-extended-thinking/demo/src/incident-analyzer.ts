/**
 * Incident Analyzer with Extended Thinking
 *
 * Uses extended thinking to analyze production incidents
 * and provide transparent reasoning for stakeholders.
 */

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const model = "claude-sonnet-4-5-20250929";

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export interface IncidentAnalysis {
  root_cause: string;
  confidence: number;
  reasoning_steps: string[];
  contributing_factors: string[];
  recommendation: string;
  severity: "low" | "medium" | "high" | "critical";
}

// -----------------------------------------------------------------------------
// Exported Function: analyzeIncident()
// -----------------------------------------------------------------------------

export async function analyzeIncident(incidentReport: string): Promise<IncidentAnalysis> {
  const response = await client.messages.create({
    model,
    max_tokens: 16000,
    thinking: {
      type: "enabled",
      budget_tokens: 10000,
    },
    messages: [
      {
        role: "user",
        content: `You are a senior SRE investigating a production incident.

Analyze this incident and identify the root cause:

${incidentReport}

Respond with JSON:
{
  "root_cause": "Primary cause of the incident",
  "confidence": 0.0-1.0,
  "contributing_factors": ["factor1", "factor2"],
  "recommendation": "Immediate action to resolve",
  "severity": "low|medium|high|critical"
}`,
      },
    ],
  });

  // Extract reasoning steps and final response
  const reasoning_steps: string[] = [];
  let finalResponse = "";

  for (const block of response.content) {
    if (block.type === "thinking") {
      reasoning_steps.push(block.thinking);
    } else if (block.type === "text") {
      finalResponse = block.text;
    }
  }

  // Parse JSON result
  try {
    const jsonMatch = finalResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      root_cause: parsed.root_cause || "Unknown",
      confidence: parsed.confidence || 0.5,
      reasoning_steps,
      contributing_factors: parsed.contributing_factors || [],
      recommendation: parsed.recommendation || "Investigate further",
      severity: parsed.severity || "medium",
    };
  } catch {
    return {
      root_cause: "Analysis parsing failed",
      confidence: 0,
      reasoning_steps,
      contributing_factors: [],
      recommendation: "Manual review required",
      severity: "medium",
    };
  }
}
