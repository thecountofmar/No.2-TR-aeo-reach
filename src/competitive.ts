import type { BusinessProfile } from "./types";
import type { AeoV3Result } from "./types";
import { generateAeoV3 } from "./generate";

export interface CompetitiveGapResult {
  version: "competitive-gap-v1";
  subject: string;
  competitor: string;
  subjectScores: AeoV3Result["preferenceScores"];
  competitorScores: AeoV3Result["preferenceScores"];
  gaps: Array<{
    dimension: keyof AeoV3Result["preferenceScores"];
    subject: number;
    competitor: number;
    gap: number;
    winner: "subject" | "competitor" | "tie";
    recommendation: string;
  }>;
  prioritizedActions: string[];
}

const recommendations: Record<keyof AeoV3Result["preferenceScores"], string> = {
  trafficAssetCompleteness: "Enrich business facts, use cases, specs, evidence, and channel coverage to raise baseline completeness.",
  agentAttentionCapture: "Add llms.txt, agent.json, MCP/OpenAPI interfaces and prompt mappings to improve agent retrievability.",
  humanJudgmentSupport: "Add cases, screenshots, reviews, comparisons, risk disclosures, and real experience content.",
  citationAbsorption: "Write short, evidence-backed claims and structured tables that can be directly cited.",
  entityExposure: "Standardize brand, product, sameAs, external references, and structured entity markup.",
  actionability: "Add clear CTAs, contact/purchase/inquiry entry points, and agent-callable actions.",
  platformFit: "Add Xiaohongshu, WeChat, TikTok, Xianyu or other platform-native assets based on target audience.",
  competitivePreference: "Strengthen facts, evidence, scenarios, comparisons, and action paths to raise preference probability in shared prompts.",
  total: "Prioritize the widest gap dimensions first, then re-validate.",
};

export function compareProfiles(subject: BusinessProfile, competitor: BusinessProfile): CompetitiveGapResult {
  const subjectResult = generateAeoV3(subject);
  const competitorResult = generateAeoV3(competitor);
  const keys = Object.keys(subjectResult.preferenceScores) as Array<keyof AeoV3Result["preferenceScores"]>;
  const gaps = keys.map((dimension) => {
    const subjectScore = subjectResult.preferenceScores[dimension];
    const competitorScore = competitorResult.preferenceScores[dimension];
    const gap = subjectScore - competitorScore;
    return {
      dimension,
      subject: subjectScore,
      competitor: competitorScore,
      gap,
      winner: gap > 3 ? "subject" as const : gap < -3 ? "competitor" as const : "tie" as const,
      recommendation: gap < 0 ? recommendations[dimension] : "Maintain advantage and solidify as reusable asset.",
    };
  });

  const prioritizedActions = gaps
    .filter((item) => item.winner === "competitor")
    .sort((a, b) => a.gap - b.gap)
    .slice(0, 5)
    .map((item) => `${item.dimension}: ${item.recommendation}`);

  return {
    version: "competitive-gap-v1",
    subject: subject.name,
    competitor: competitor.name,
    subjectScores: subjectResult.preferenceScores,
    competitorScores: competitorResult.preferenceScores,
    gaps,
    prioritizedActions,
  };
}
