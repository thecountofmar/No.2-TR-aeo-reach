import type { AeoV3Result, BusinessFactGraph, CompiledAsset, EvaluationFinding, PreferenceScores, TrafficAssetIR } from "./types";

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function avg(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function evaluatePreference(
  graph: BusinessFactGraph,
  ir: TrafficAssetIR[],
  compiled: CompiledAsset[]
): { scores: PreferenceScores; findings: EvaluationFinding[] } {
  const findings: EvaluationFinding[] = [];
  const profile = graph.profile;
  const product = profile.products[0];
  const hasEvidence = graph.evidence.length > 0;
  const hasActions = graph.actions.length > 0;
  const agentAssets = ir.filter((asset) => asset.audience === "agent" || asset.audience === "hybrid");
  const platformTargets = compiled.filter((asset) => asset.target === "platform");
  const evidenceStrength = avg(graph.evidence.map((item) => item.strength));

  const trafficAssetCompleteness = clamp(
    20 +
      (profile.name ? 8 : 0) +
      (profile.description ? 8 : 0) +
      (profile.targetAudiences.length ? 8 : 0) +
      (profile.targetMarkets.length ? 8 : 0) +
      (product.features.length >= 3 ? 12 : 0) +
      (product.useCases.length >= 2 ? 12 : 0) +
      (Object.keys(product.specs || {}).length >= 2 ? 12 : 0) +
      (hasEvidence ? 12 : 0)
  );

  const agentAttentionCapture = clamp(
    30 +
      agentAssets.length * 8 +
      ir.filter((asset) => asset.targetPrompts.length >= 2).length * 5 +
      (profile.channels?.includes("mcp") ? 12 : 0) +
      (profile.channels?.includes("api") ? 10 : 0)
  );

  const humanJudgmentSupport = clamp(
    25 +
      (hasEvidence ? 18 : 0) +
      (product.disclaimers?.length ? 10 : 0) +
      ir.filter((asset) => ["compare", "trust", "choose", "experience"].includes(asset.attentionType)).length * 8
  );

  const citationAbsorption = clamp(
    20 +
      graph.claims.length * 5 +
      (evidenceStrength * 0.25) +
      compiled.filter((asset) => /Key claims|Evidence|targetPrompts|claims/i.test(asset.content)).length * 2
  );

  const entityExposure = clamp(
    35 +
      (compiled.filter((asset) => asset.content.includes(profile.name)).length / Math.max(compiled.length, 1)) * 35 +
      (compiled.filter((asset) => asset.content.includes(product.name)).length / Math.max(compiled.length, 1)) * 20
  );

  const actionability = clamp(25 + (hasActions ? 25 : 0) + graph.actions.length * 12 + (profile.contactEmail ? 12 : 0) + (profile.website ? 10 : 0));

  const platformFit = clamp(20 + platformTargets.length * 8 + (profile.channels?.length || 0) * 5);

  const competitivePreference = clamp(
    trafficAssetCompleteness * 0.18 +
      agentAttentionCapture * 0.16 +
      humanJudgmentSupport * 0.14 +
      citationAbsorption * 0.14 +
      entityExposure * 0.12 +
      actionability * 0.14 +
      platformFit * 0.12
  );

  if (!hasEvidence) {
    findings.push({
      id: "missing-evidence",
      severity: "critical",
      dimension: "humanJudgmentSupport",
      finding: "No evidence nodes are attached to business claims.",
      recommendedAction: "Add public evidence, user reviews, case studies, screenshots, certifications, or project documentation references.",
    });
  }

  if (!profile.channels?.includes("mcp") || !profile.channels?.includes("api")) {
    findings.push({
      id: "agent-action-gap",
      severity: "warning",
      dimension: "actionability",
      finding: "Agent-callable channels are not fully enabled.",
      recommendedAction: "Add MCP and API channels to expose product facts and conversion actions.",
    });
  }

  if (platformTargets.length < 3) {
    findings.push({
      id: "platform-fit-gap",
      severity: "warning",
      dimension: "platformFit",
      finding: "Few platform-native compiled assets were generated.",
      recommendedAction: "Add Xiaohongshu, WeChat, TikTok, X, Reddit, YouTube, or commerce channels based on target audience.",
    });
  }

  const scores: PreferenceScores = {
    trafficAssetCompleteness,
    agentAttentionCapture,
    humanJudgmentSupport,
    citationAbsorption,
    entityExposure,
    actionability,
    platformFit,
    competitivePreference,
    total: clamp(
      trafficAssetCompleteness * 0.14 +
        agentAttentionCapture * 0.14 +
        humanJudgmentSupport * 0.14 +
        citationAbsorption * 0.14 +
        entityExposure * 0.1 +
        actionability * 0.14 +
        platformFit * 0.1 +
        competitivePreference * 0.1
    ),
  };

  return { scores, findings };
}

export function compareWithV1(result: Omit<AeoV3Result, "benchmarkComparison">): AeoV3Result["benchmarkComparison"] {
  return {
    baselineVersion: "aeo-v1-current",
    improvedDimensions: [
      "Business Fact Graph instead of flat BusinessProfile only",
      "Claim-Evidence-Action binding",
      "Traffic Asset IR as platform-neutral intermediate representation",
      "Multi-target compilation across web, agent, platform, conversion, monitoring",
      "Preference scoring beyond readiness scoring",
    ],
    newCapabilities: [
      "citationAbsorption score",
      "entityExposure score",
      "humanJudgmentSupport score",
      "competitivePreference score",
      "compiledAssets output",
      "Traffic Asset IR output",
    ],
    comparableMetrics: {
      v3TotalScore: result.preferenceScores.total,
      v3IRAssets: result.trafficAssetIR.length,
      v3CompiledAssets: result.compiledAssets.length,
      v3Findings: result.findings.length,
    },
  };
}
