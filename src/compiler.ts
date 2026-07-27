import type { Channel } from "./types";
import type { BusinessFactGraph, CompiledAsset, TrafficAssetIR } from "./types";

type CompileChannel = Channel | "core";

function topClaims(graph: BusinessFactGraph, asset: TrafficAssetIR): string[] {
  return graph.claims.filter((claim) => asset.sourceClaims.includes(claim.id)).map((claim) => claim.claim);
}

function compilePlatformContent(graph: BusinessFactGraph, asset: TrafficAssetIR, channel: CompileChannel): string {
  const profile = graph.profile;
  const product = profile.products[0];
  const claims = topClaims(graph, asset).slice(0, 4);
  const cta = graph.actions[0]?.target || profile.website || "Visit official site";

  if (channel === "xiaohongshu") {
    return [
      `# Rednote / Xiaohongshu Note Asset`,
      `Title candidate: ${product.name} | Why I started caring about "${product.useCases[0] || product.category}"`,
      `Cover text: Enter agent attention, enter user cognition`,
      `Lead: If you are also working on ${product.useCases[0] || product.category}, do not just look at content volume, look at whether it can become traffic assets.`,
      `Body:`,
      `1. My specific problem: why ${profile.targetAudiences[0] || "target users"} need it`,
      `2. Key facts: ${claims.join("; ") || product.features[0]}`,
      `3. Who it is for: ${profile.targetAudiences.slice(0, 3).join(", ")}`,
      `4. Pitfall reminder: ${product.disclaimers?.[0] || "Do not confuse readiness with traffic guarantee."}`,
      `Tags: #AEO #TrafficAssets #AgentReady #indieweb`,
      `Comment prompt: What traffic asset type do you need most today? Website? Social? Agent files?`,
      `CTA: ${cta}`,
    ].join("\n");
  }

  if (channel === "wechat") {
    return [
      `# WeChat Public Account / Private Domain Asset`,
      `Title: Why every project needs its own agent traffic assets`,
      `Summary: ${profile.name}'s core thesis: traffic is attention. In the agent era, entering agent attention means entering user cognition.`,
      `Outline:`,
      `1. User attention is being partially mediated by agents`,
      `2. Traffic assets are not content -- they are structured business facts`,
      `3. How ${product.name} generates website, channel content and Agent Kit`,
      `4. Audit first, generate second, deploy third, monitor continuously`,
      `Private domain hook: If you want to know which traffic assets your project is missing, start with an AEO audit.`,
      `CTA: ${cta}`,
    ].join("\n");
  }

  if (channel === "tiktok") {
    return [
      `# TikTok / Short Video Asset`,
      `Hook 1: Your website is not enough for AI agents.`,
      `Hook 2: If agents cannot compare you, users may never see you.`,
      `Scene 1: Show a website with missing agent-readable assets.`,
      `Scene 2: Show business facts turning into traffic assets.`,
      `Scene 3: Show outputs: website, posts, llms.txt, agent.json, MCP tools.`,
      `Voiceover: ${profile.name} turns business facts into AI-readable, agent-callable and channel-distributable traffic assets.`,
      `Caption: Build traffic assets for the AI-agent era.`,
      `Hashtags: #AEO #AIagents #GEO #AgentReadyWebsite #Growth`,
      `CTA: Run an audit before publishing more content.`,
    ].join("\n");
  }

  if (channel === "x") {
    return [
      `# X / LinkedIn Thread`,
      `1/ Traffic is attention. In the agent era, entering agent attention means entering user cognition.`,
      `2/ Most projects still publish pages and posts. Agents need structured business facts, comparison-ready claims, evidence and actions.`,
      `3/ ${profile.name} turns Business Profile -> Prompt Graph -> Brand Agent Kit -> Channel Assets -> Monitoring Loop.`,
      `4/ The point is not to generate more content. The point is to create assets that can be found, compared, recommended and acted on.`,
      `5/ Start with an audit: what can agents read, compare and call today?`,
      `CTA: ${cta}`,
    ].join("\n");
  }

  if (channel === "reddit") {
    return [
      `# Reddit Reply Draft`,
      `Short answer: if you want AI agents to discover a project, do not only optimize the page copy. Make the underlying business facts readable, comparable, and actionable.`,
      `A useful setup includes a clear product/brand profile, FAQ, comparison facts, evidence, llms.txt, agent.json, and if possible MCP/OpenAPI actions.`,
      `Natural mention: ${profile.name} is an example of a toolkit exploring this workflow from business facts to traffic assets.`,
    ].join("\n");
  }

  if (channel === "youtube") {
    return [
      `# YouTube Script Outline`,
      `Title: Agent-ready websites are not enough: build traffic assets`,
      `Intro: In the AI-agent era, users outsource discovery, comparison and inquiry to agents.`,
      `Chapter 1: Why traffic is attention`,
      `Chapter 2: Why business facts need structure`,
      `Chapter 3: What ${profile.name} generates`,
      `Chapter 4: Audit -> Generate -> Deploy -> Monitor -> Update`,
      `Description CTA: ${cta}`,
    ].join("\n");
  }

  // Default fallback
  return [
    `Title: ${profile.name} - ${product.name}`,
    `Hook: ${profile.tagline || profile.description}`,
    `Key facts: ${claims.join(" | ")}`,
    `CTA: ${cta}`,
    `Comment prompts: What problem are you trying to solve? Which alternative are you comparing with?`,
  ].join("\n");
}

function compileContent(graph: BusinessFactGraph, asset: TrafficAssetIR, target: TrafficAssetIR["compilerTargets"][number], channel: CompileChannel): string {
  const profile = graph.profile;
  const product = profile.products[0];
  const claims = graph.claims.filter((claim) => asset.sourceClaims.includes(claim.id));
  const evidence = graph.evidence.filter((item) => asset.evidenceIds.includes(item.id));

  if (target === "agent") {
    return JSON.stringify(
      {
        asset: asset.name,
        brand: profile.name,
        product: product.name,
        attentionType: asset.attentionType,
        claims: claims.map((claim) => claim.claim),
        evidence: evidence.map((item) => ({ evidence: item.evidence, source: item.source, strength: item.strength })),
        actions: graph.actions,
        targetPrompts: asset.targetPrompts,
      },
      null,
      2
    );
  }

  if (target === "platform") {
    return compilePlatformContent(graph, asset, channel);
  }

  if (target === "conversion") {
    return [
      `Primary action: ${graph.actions[0]?.label}`,
      `Target: ${graph.actions[0]?.target}`,
      `Secondary action: ${graph.actions[1]?.label}`,
      `Target: ${graph.actions[1]?.target}`,
      `Success metric: ${graph.actions.map((action) => action.successMetric).join(", ")}`,
    ].join("\n");
  }

  if (target === "monitoring") {
    return [
      `Asset: ${asset.name}`,
      `Metrics: ${asset.monitorMetrics.join(", ")}`,
      `Target prompts:`,
      ...asset.targetPrompts.map((prompt) => `  - ${prompt}`),
      `Expected signal: retrieved, compared, cited, recommended, or actioned.`,
    ].join("\n");
  }

  // Default: web content
  return [
    `# ${asset.name}`,
    "",
    profile.tagline || profile.description,
    "",
    `## Who it is for`,
    profile.targetAudiences.map((audience) => `  - ${audience}`).join("\n"),
    "",
    `## Key claims`,
    claims.map((claim) => `  - ${claim.claim}`).join("\n"),
    "",
    `## Evidence`,
    evidence.length ? evidence.map((item) => `  - ${item.evidence} (${item.source})`).join("\n") : "  - Evidence needs enrichment.",
    "",
    `## Next action`,
    graph.actions.map((action) => `  - ${action.label}: ${action.target}`).join("\n"),
  ].join("\n");
}

export function compileAssets(graph: BusinessFactGraph, assets: TrafficAssetIR[]): CompiledAsset[] {
  return assets.flatMap((asset) =>
    asset.compilerTargets.flatMap((target) => {
      const channels = asset.targetChannels.length ? asset.targetChannels : ["core" as const];
      return channels.map((channel) => ({
        id: `${asset.id}-${target}-${channel}`,
        irId: asset.id,
        target,
        channel,
        path: `${target}/${channel}/${asset.id}.${target === "agent" ? "json" : "md"}`,
        title: `${asset.name} (${target}/${channel})`,
        content: compileContent(graph, asset, target, channel),
        format: target === "agent" ? "json" : "markdown",
      }));
    })
  );
}
