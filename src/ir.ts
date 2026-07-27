import type { Channel } from "./types";
import type { BusinessFactGraph, TrafficAssetIR } from "./types";

const DEFAULT_CHANNELS: Channel[] = ["website", "xiaohongshu", "wechat", "tiktok", "mcp", "api"];

export function buildTrafficAssetIR(graph: BusinessFactGraph): TrafficAssetIR[] {
  const profile = graph.profile;
  const product = profile.products[0];
  const channels = profile.channels?.length ? profile.channels : DEFAULT_CHANNELS;
  const allClaimIds = graph.claims.map((claim) => claim.id);
  const evidenceIds = graph.evidence.map((item) => item.id);

  return [
    {
      id: "ir-business-profile",
      name: "Business Profile IR",
      attentionType: "understand",
      audience: "hybrid",
      sourceClaims: allClaimIds,
      evidenceRequired: false,
      evidenceIds,
      targetPrompts: [`What is ${profile.name}?`, `Who is ${profile.name} for?`],
      targetChannels: ["core", "website", "mcp", "api"],
      compilerTargets: ["web", "agent", "monitoring"],
      outputFormat: "JSON + profile section + docs fragment",
      conversionGoal: "understand_project",
      monitorMetrics: ["business_fact_completeness", "entity_exposure"],
      dependencies: [],
      version: "v3.0.0",
    },
    {
      id: "ir-agent-kit",
      name: "Brand Agent Kit IR",
      attentionType: "discover",
      audience: "agent",
      sourceClaims: allClaimIds,
      evidenceRequired: true,
      evidenceIds,
      targetPrompts: [`Find a tool for ${product.category}`, "Make my project agent-ready", "Generate llms.txt and MCP tools"],
      targetChannels: ["mcp", "api", "website"],
      compilerTargets: ["agent", "monitoring"],
      outputFormat: "llms.txt + agent.json + brand-skill.md + mcp/tools.json + openapi.yaml",
      conversionGoal: "agent_candidate_inclusion",
      monitorMetrics: ["agent_file_availability", "top_k_inclusion", "agent_actionability"],
      dependencies: ["ir-business-profile"],
      version: "v3.0.0",
    },
    {
      id: "ir-comparison",
      name: "Comparison & Preference IR",
      attentionType: "compare",
      audience: "hybrid",
      sourceClaims: allClaimIds,
      evidenceRequired: true,
      evidenceIds,
      targetPrompts: [`${profile.name} vs alternatives`, `What makes ${profile.name} different?`],
      targetChannels: ["website", "x", "reddit", "youtube"].filter((channel) => channels.includes(channel as Channel)) as Channel[],
      compilerTargets: ["web", "platform", "monitoring"],
      outputFormat: "comparison table + fit/not-fit + recommendation reason",
      conversionGoal: "answer_ownership",
      monitorMetrics: ["comparison_prompt_coverage", "citation_absorption", "competitive_preference"],
      dependencies: ["ir-business-profile", "ir-agent-kit"],
      version: "v3.0.0",
    },
    {
      id: "ir-platform-pack",
      name: "Platform Channel Pack IR",
      attentionType: "experience",
      audience: "platform",
      sourceClaims: allClaimIds,
      evidenceRequired: false,
      evidenceIds,
      targetPrompts: [`How should ${profile.name} publish on social platforms?`],
      targetChannels: channels.filter((channel) => !["website", "mcp", "api"].includes(channel)),
      compilerTargets: ["platform", "monitoring"],
      outputFormat: "platform-native posts, hooks, comments, tags, CTA",
      conversionGoal: "channel_engagement",
      monitorMetrics: ["impressions", "engagement", "dm_or_comment", "conversion_signal"],
      dependencies: ["ir-business-profile"],
      version: "v3.0.0",
    },
    {
      id: "ir-conversion-actions",
      name: "Conversion Action IR",
      attentionType: "inquire",
      audience: "hybrid",
      sourceClaims: graph.claims.filter((claim) => claim.type === "conversion").map((claim) => claim.id),
      evidenceRequired: false,
      evidenceIds: [],
      targetPrompts: [`How do I contact ${profile.name}?`, `How do I get started with ${profile.name}?`],
      targetChannels: ["website", "mcp", "api"],
      compilerTargets: ["web", "agent", "conversion", "monitoring"],
      outputFormat: "CTA + form + quote/contact action + tracking event plan",
      conversionGoal: "contact_or_quote",
      monitorMetrics: ["contact_click", "form_submit", "agent_tool_call"],
      dependencies: ["ir-business-profile", "ir-agent-kit"],
      version: "v3.0.0",
    },
  ];
}
