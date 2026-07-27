// ===== Core Domain Types for AEO-reach =====
// Business Profile, Fact Graph, Traffic Asset IR, Evaluation

export type BusinessType = "product" | "service" | "supplier" | "saas" | "content";

export type Channel =
  | "website"
  | "xiaohongshu"
  | "wechat"
  | "tiktok"
  | "x"
  | "reddit"
  | "youtube"
  | "mcp"
  | "api";

export interface BusinessProfile {
  id?: string;
  name: string;
  businessType: BusinessType;
  tagline?: string;
  description: string;
  website?: string;
  contactEmail?: string;
  targetMarkets: string[];
  targetAudiences: string[];
  products: ProductProfile[];
  competitors?: string[];
  channels?: Channel[];
  evidence?: Evidence[];
}

export interface ProductProfile {
  id?: string;
  name: string;
  category: string;
  price?: string;
  currency?: string;
  description: string;
  features: string[];
  specs?: Record<string, string>;
  useCases: string[];
  certifications?: string[];
  moq?: string;
  leadTime?: string;
  disclaimers?: string[];
}

export interface Evidence {
  claim: string;
  source: string;
  url?: string;
}

// ===== Business Fact Graph Types =====

export type ClaimType =
  | "positioning" | "feature" | "comparison" | "trust"
  | "conversion" | "risk" | "platform";

export type EvidenceType =
  | "internal-test" | "user-review" | "third-party" | "certification"
  | "case-study" | "public-data" | "project-doc";

export interface ClaimNode {
  id: string;
  claim: string;
  type: ClaimType;
  targetAudience: string[];
  relatedProduct?: string;
  evidenceIds: string[];
  riskLevel: "low" | "medium" | "high";
  disclaimers: string[];
  supportedAssets: string[];
}

export interface EvidenceNode {
  id: string;
  evidence: string;
  source: string;
  url?: string;
  type: EvidenceType;
  verifiability: "public" | "internal" | "manual-review";
  strength: number;
}

export interface ActionNode {
  id: string;
  type: "visit" | "contact" | "quote" | "buy" | "subscribe" | "download" | "book" | "follow";
  label: string;
  target: string;
  requiredFacts: string[];
  successMetric: string;
}

export interface BusinessFactGraph {
  profile: BusinessProfile;
  claims: ClaimNode[];
  evidence: EvidenceNode[];
  actions: ActionNode[];
}

// ===== Traffic Asset IR Types =====

export type AssetAudience = "human" | "agent" | "platform" | "hybrid";
export type AttentionType =
  | "discover" | "understand" | "compare" | "trust" | "choose"
  | "experience" | "inquire" | "transact" | "relationship";
export type CompilerTarget = "web" | "agent" | "platform" | "conversion" | "monitoring";

export interface TrafficAssetIR {
  id: string;
  name: string;
  attentionType: AttentionType;
  audience: AssetAudience;
  sourceClaims: string[];
  evidenceRequired: boolean;
  evidenceIds: string[];
  targetPrompts: string[];
  targetChannels: Array<Channel | "core">;
  compilerTargets: CompilerTarget[];
  outputFormat: string;
  conversionGoal?: string;
  monitorMetrics: string[];
  dependencies: string[];
  version: string;
}

export interface CompiledAsset {
  id: string;
  irId: string;
  target: CompilerTarget;
  channel: Channel | "core";
  path: string;
  title: string;
  content: string;
  format: string;
}

// ===== Preference Evaluation Types =====

export interface PreferenceScores {
  trafficAssetCompleteness: number;
  agentAttentionCapture: number;
  humanJudgmentSupport: number;
  citationAbsorption: number;
  entityExposure: number;
  actionability: number;
  platformFit: number;
  competitivePreference: number;
  total: number;
}

export interface EvaluationFinding {
  id: string;
  severity: "info" | "warning" | "critical";
  dimension: keyof PreferenceScores | "readiness" | "assetops";
  finding: string;
  recommendedAction: string;
}

export interface V3BenchmarkComparison {
  baselineVersion: string;
  improvedDimensions: string[];
  newCapabilities: string[];
  comparableMetrics: Record<string, number | string>;
}

export interface AeoV3Result {
  version: "aeo-v3";
  graph: BusinessFactGraph;
  trafficAssetIR: TrafficAssetIR[];
  compiledAssets: CompiledAsset[];
  preferenceScores: PreferenceScores;
  findings: EvaluationFinding[];
  benchmarkComparison: V3BenchmarkComparison;
}

// ===== Competitive Gap Types =====

export interface CompetitiveGapResult {
  version: "competitive-gap-v1";
  subject: string;
  competitor: string;
  subjectScores: PreferenceScores;
  competitorScores: PreferenceScores;
  gaps: Array<{
    dimension: keyof PreferenceScores;
    subject: number;
    competitor: number;
    gap: number;
    winner: "subject" | "competitor" | "tie";
    recommendation: string;
  }>;
  prioritizedActions: string[];
}
