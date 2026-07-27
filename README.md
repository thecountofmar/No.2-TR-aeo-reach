# AEO-reach Core

> **Open-source traffic asset architecture for the AI-agent era.**
>
> Not another `llms.txt` generator. Not a GEO checklist.
>
> A **Business Fact Graph**, a **Traffic Asset IR**, multi-channel **Compilers**, and **Preference Evaluation** for the agent-mediated web.

AEO-reach Core turns business facts into AI-readable, agent-callable, platform-native, and conversion-ready traffic assets.

## Why this exists

Search, discovery, comparison, and conversion are being mediated by AI answers, agents, platform search, and tool calls. A normal website is no longer enough.

AEO-reach Core helps projects answer four questions:

1. What business facts should become traffic assets?
2. Which attention layer does each asset target?
3. How should the same facts compile into web, agent, platform, conversion, and monitoring outputs?
4. Why would an agent or platform prefer this project over an alternative?

## Core concepts

### Business Fact Graph

Instead of treating a website as the source of truth, AEO-reach builds a **Claim-Evidence-Action graph** from a business profile.

```ts
import { buildBusinessFactGraph } from "@aeo-reach/core";

const graph = buildBusinessFactGraph(profile);
// graph.claims   -> structured business claims with evidence bindings
// graph.evidence -> verifiable facts and sources
// graph.actions  -> concrete next steps for users and agents
```

### Traffic Asset IR

A platform-neutral intermediate representation for traffic assets.

Each IR asset captures:

- attention type: discover, understand, compare, trust, choose, experience, inquire, transact, relationship
- audience: human, agent, platform, hybrid
- source claims and evidence
- target prompts
- compiler targets
- monitoring metrics
- dependencies

```ts
import { buildTrafficAssetIR } from "@aeo-reach/core";

const ir = buildTrafficAssetIR(graph);
```

### Multi-channel Compiler

The same IR compiles into multiple outputs:

| Compiler target | Output examples |
|---|---|
| `web` | Product pages, FAQ, comparison tables, evidence sections |
| `agent` | `llms.txt`, `agent.json`, `brand-skill.md`, MCP tool definitions |
| `platform` | Xiaohongshu notes, WeChat articles, TikTok scripts, X threads, Reddit replies, YouTube scripts |
| `conversion` | CTA actions, forms, inquiry entries, purchase links |
| `monitoring` | Metric plans, prompt coverage, success signals |

```ts
import { compileAssets } from "@aeo-reach/core";

const assets = compileAssets(graph, ir);
```

### Preference Evaluation

Readiness is not enough. AEO-reach evaluates why an agent, platform, or user may prefer one project over another.

8 dimensions:

1. `trafficAssetCompleteness`
2. `agentAttentionCapture`
3. `humanJudgmentSupport`
4. `citationAbsorption`
5. `entityExposure`
6. `actionability`
7. `platformFit`
8. `competitivePreference`

### Competitive Asset Gap

Compare two projects and identify why one may be preferred:

- better facts
- stronger evidence
- clearer action paths
- better platform-native assets
- stronger prompt coverage
- higher preference scores

## Quick start

```ts
import { generateAeoV3 } from "@aeo-reach/core";

const profile = {
  name: "MyProject",
  businessType: "saas",
  description: "An AI-powered analytics platform",
  targetMarkets: ["US", "EU"],
  targetAudiences: ["Data analysts", "Product managers"],
  products: [
    {
      name: "Analytics Pro",
      category: "SaaS analytics",
      description: "Real-time analytics for product teams",
      features: ["Real-time dashboards", "AI-powered insights", "Team collaboration"],
      useCases: ["Product analytics", "User behavior analysis"],
    },
  ],
};

const result = generateAeoV3(profile);

console.log(result.preferenceScores);
console.log(result.trafficAssetIR);
console.log(result.compiledAssets);
console.log(result.findings);
```

## Architecture

```text
BusinessProfile
  ↓
BusinessFactGraph (claims + evidence + actions)
  ↓
TrafficAssetIR (platform-neutral intermediate representation)
  ↓
Multi-target compilers
  ├── web
  ├── agent
  ├── platform
  ├── conversion
  └── monitoring
  ↓
Preference Evaluation
  ↓
Competitive Asset Gap
```

## Repository relationship

| Repository | Description |
|---|---|
| [`thecountofmar/No.2-TR-aeo-reach`](https://github.com/thecountofmar/No.2-TR-aeo-reach) | Open-source core library: Business Fact Graph, Traffic Asset IR, compilers, evaluators |
| `thecountofmar/aeo-reach` | Official website and private product application, deployed on Vercel |

## Official site

Current site:

```text
https://aeo-reach.vercel.app
```

## Built with

- [TypeScript](https://www.typescriptlang.org/) — Apache-2.0

## Concept acknowledgments

AEO-reach Core is informed by the broader GEO/AEO/agent-ready web community, including:

- GEOFlow and GEORank style GEO workbench ideas
- the llms.txt convention
- agent-ready website and WebMCP discussions
- AI visibility and citation research

AEO-reach contributes an independent architecture centered on **Traffic Asset IR**, **Business Fact Graph**, **attention-aware scoring**, **multi-channel compilation**, and **competitive preference evaluation**.

## License

Apache-2.0. See [LICENSE](LICENSE).
