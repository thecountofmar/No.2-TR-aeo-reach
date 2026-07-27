# AEO-reach Core

> **Open-source traffic asset architecture for the AI-agent era.**
>
> Not another llms.txt generator. Not a GEO checklist.
>
> A **Traffic Asset IR**, a **Business Fact Graph**, multi-channel **Compilers**, and **Preference Evaluation** for the agent-mediated web.

AEO-reach turns business facts into AI-readable, agent-callable, platform-native, and conversion-ready traffic assets.

---

## Core Concepts

### Business Fact Graph

Instead of treating a website as the source of truth, AEO-reach builds a **Claim-Evidence-Action** graph from the business profile.

```typescript
const graph = buildBusinessFactGraph(profile)
// graph.claims  -> structured business claims with evidence bindings
// graph.evidence -> verifiable facts and sources
// graph.actions  -> concrete next steps for users and agents
```

### Traffic Asset IR

A **platform-neutral intermediate representation** for traffic assets. The IR captures attention type, audience, target prompts, compiler targets, monitoring metrics, and dependency relationships.

```typescript
const ir = buildTrafficAssetIR(graph)
// Each IR asset can compile to web, agent, platform, conversion, and monitoring targets
```

### Multi-channel Compiler

The same IR compiles into different outputs for different channels:

| Compiler Target | Output Examples |
|---|---|
| `web` | Product pages, FAQ, comparison tables, evidence sections |
| `agent` | llms.txt, agent.json, brand-skill.md, MCP tool definitions |
| `platform` | Xiaohongshu notes, WeChat articles, TikTok scripts, X threads, Reddit replies, YouTube scripts |
| `conversion` | CTA actions, forms, inquiry entries, purchase links |
| `monitoring` | Metric plans, prompt coverage, success signals |

```typescript
const assets = compileAssets(graph, ir)
// 5 targets x N channels = comprehensive asset output
```

### Preference Evaluation

8-dimensional scoring beyond basic readiness:

1. **trafficAssetCompleteness** - Are all business facts captured?
2. **agentAttentionCapture** - Can agents find and use these assets?
3. **humanJudgmentSupport** - Do humans have enough to decide?
4. **citationAbsorption** - Can claims be cited directly?
5. **entityExposure** - Is the brand/product entity visible?
6. **actionability** - Are next steps clear and callable?
7. **platformFit** - Are platform-native assets generated?
8. **competitivePreference** - Why would an agent recommend this over alternatives?

### Competitive Asset Gap

Compare two projects: who has better facts, stronger evidence, clearer action paths, and higher preference scores in shared AI prompts.

---

## Quick Start

```typescript
import { buildBusinessFactGraph, buildTrafficAssetIR, compileAssets, generateAeoV3 } from "@aeo-reach/core";

// 1. Define your business profile
const profile = {
  name: "MyProject",
  description: "An AI-powered analytics platform",
  targetMarkets: ["US", "EU"],
  targetAudiences: ["Data analysts", "Product managers"],
  products: [{
    name: "Analytics Pro",
    category: "SaaS analytics",
    description: "Real-time analytics for product teams",
    features: ["Real-time dashboards", "AI-powered insights", "Team collaboration"],
    useCases: ["Product analytics", "User behavior analysis"],
  }],
};

// 2. Generate the full AEO-v3 result
const result = generateAeoV3(profile);

console.log(result.preferenceScores);   // 8-dimensional scoring
console.log(result.trafficAssetIR);    // Platform-neutral IR assets
console.log(result.compiledAssets);    // Compiled outputs for all targets
console.log(result.findings);          // Improvement recommendations
```

---

## Architecture

```
BusinessProfile
  |
  v
BusinessFactGraph (claims + evidence + actions)
  |
  v
TrafficAssetIR (platform-neutral intermediate representation)
  |
  v
  +---> Web Compiler
  +---> Agent Compiler (llms.txt, agent.json, MCP)
  +---> Platform Compiler (Xiaohongshu, WeChat, TikTok, X, Reddit, YouTube)
  +---> Conversion Compiler (CTAs, forms, purchase links)
  +---> Monitoring Compiler (metrics, prompts, signals)
  |
  v
Preference Evaluation (8-dimensional scoring + findings)
```

---

## Built With & Acknowledgments

This project builds upon open-source foundations and community ideas:

- **[Next.js](https://nextjs.org)** (MIT) — The website that demonstrates AEO-reach is built with Next.js
- **[React](https://react.dev)** (MIT) — UI library
- **[Tailwind CSS](https://tailwindcss.com)** (MIT) — Utility CSS framework
- **[TypeScript](https://www.typescriptlang.org)** (Apache-2.0) — Typed language

### Concept Acknowledgments

- **GEOFlow** (Apache-2.0) — For pioneering the GEO framework and agent-ready website concepts. AEO-reach extends these ideas with a Traffic Asset IR, Business Fact Graph, multi-channel compilers, and preference-oriented evaluation beyond readiness scoring.
- The **GEO (Generative Engine Optimization) / AEO (Answer Engine Optimization)** community — For defining the problem space of AI-mediated visibility.
- The **llms.txt** standard — For establishing a machine-readable website summary convention that this architecture adopts and generates.

All code in this repository is original. Architectural concepts are informed by community discussions and implemented as independent work.

---

## License

Apache-2.0. See [LICENSE](LICENSE).

---

## Repository Structure

| Repo | Description |
|---|---|
| `aeo-reach` | Official website, deployed on Vercel |
| `No.2-TR-aeo-reach` (this repo) | Open-source core library |
