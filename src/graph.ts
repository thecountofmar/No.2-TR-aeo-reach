import type { BusinessProfile } from "./types";
import type { ActionNode, BusinessFactGraph, ClaimNode, EvidenceNode } from "./types";

function id(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-").replace(/^-|-$/g, "");
}

function firstProduct(profile: BusinessProfile) {
  return profile.products[0];
}

export function buildBusinessFactGraph(profile: BusinessProfile): BusinessFactGraph {
  const product = firstProduct(profile);
  const evidence: EvidenceNode[] = (profile.evidence || []).map((item, index) => ({
    id: `evidence-${index + 1}`,
    evidence: item.claim,
    source: item.source,
    url: item.url,
    type: item.url ? "third-party" as const : item.source.includes("docs/") ? "project-doc" as const : "internal-test" as const,
    verifiability: item.url ? "public" as const : "manual-review" as const,
    strength: item.url ? 85 : item.source.includes("docs/") ? 72 : 58,
  }));

  const claims: ClaimNode[] = [
    {
      id: "claim-positioning",
      claim: profile.tagline || profile.description,
      type: "positioning" as const,
      targetAudience: profile.targetAudiences,
      relatedProduct: product.id || product.name,
      evidenceIds: evidence.map((item) => item.id).slice(0, 2),
      riskLevel: "low" as const,
      disclaimers: [],
      supportedAssets: ["home-page", "llms", "brand-skill"],
    },
    ...product.features.map((feature, index) => ({
      id: `claim-feature-${index + 1}`,
      claim: feature,
      type: "feature" as const,
      targetAudience: profile.targetAudiences,
      relatedProduct: product.id || product.name,
      evidenceIds: evidence.map((item) => item.id).slice(0, 1),
      riskLevel: "medium" as const,
      disclaimers: product.disclaimers || [],
      supportedAssets: ["product-facts", "faq", "channel-assets"],
    })),
    {
      id: "claim-action",
      claim: `${profile.name} provides a concrete next step through ${profile.contactEmail || profile.website || "its official website"}.`,
      type: "conversion" as const,
      targetAudience: profile.targetAudiences,
      relatedProduct: product.id || product.name,
      evidenceIds: [],
      riskLevel: "low" as const,
      disclaimers: product.disclaimers || [],
      supportedAssets: ["conversion-actions", "mcp-tools", "openapi"],
    },
  ];

  const actions: ActionNode[] = [
    {
      id: "visit-site",
      type: "visit" as const,
      label: "Visit official website",
      target: profile.website || "/",
      requiredFacts: ["website", "brand", "product"],
      successMetric: "website_visit",
    },
    {
      id: "contact-or-quote",
      type: profile.businessType === "supplier" ? "quote" as const : "contact" as const,
      label: profile.businessType === "supplier" ? "Request quote" : "Contact project",
      target: profile.contactEmail || profile.website || "/contact",
      requiredFacts: ["contactEmail", "product", "targetAudience"],
      successMetric: "contact_or_quote",
    },
  ];

  if (profile.channels?.includes("api") || profile.channels?.includes("mcp")) {
    actions.push({
      id: "agent-tool-call",
      type: "download" as const,
      label: "Use agent-callable interface",
      target: "/mcp/tools.json",
      requiredFacts: ["agentJson", "mcpTools", "productFacts"],
      successMetric: "agent_tool_call",
    });
  }

  return { profile: { ...profile, id: profile.id || id(profile.name) }, claims, evidence, actions };
}
