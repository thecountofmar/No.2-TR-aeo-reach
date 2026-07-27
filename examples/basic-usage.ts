/**
 * Basic usage example for AEO-reach Core
 *
 * Run: npx tsx examples/basic-usage.ts
 */

import { generateAeoV3 } from "../src/generate";

// A simple business profile
const profile = {
  name: "QuickAnalytics",
  description: "Real-time product analytics for lean teams",
  targetMarkets: ["Global"],
  targetAudiences: ["Startup founders", "Product managers", "Indie hackers"],
  products: [{
    name: "QuickAnalytics Dashboard",
    category: "SaaS analytics",
    description: "One-click analytics setup with AI-powered insights",
    features: [
      "5-minute setup with no coding required",
      "AI-powered anomaly detection",
      "Team workspace with role-based access",
      "Custom dashboard builder",
    ],
    useCases: [
      "Track user acquisition and retention",
      "Monitor feature adoption rates",
      "Identify churn risks before they happen",
    ],
    disclaimers: ["Analytics accuracy depends on data quality and integration completeness."],
  }],
  evidence: [
    { claim: "Used by 200+ indie products in beta", source: "Internal usage data" },
    { claim: "Average setup time under 5 minutes", source: "User testing sessions" },
  ],
  channels: ["website", "x", "mcp"],
};

// Generate full v3 result
const result = generateAeoV3(profile);

console.log("=== Preference Scores ===");
for (const [key, value] of Object.entries(result.preferenceScores)) {
  console.log(`  ${key}: ${value}`);
}

console.log(`\n=== Traffic Asset IR (${result.trafficAssetIR.length} assets) ===`);
for (const ir of result.trafficAssetIR) {
  console.log(`  - ${ir.name} [${ir.attentionType}] target: ${ir.compilerTargets.join(", ")}`);
}

console.log(`\n=== Compiled Assets (${result.compiledAssets.length} outputs) ===`);
for (const asset of result.compiledAssets.slice(0, 5)) {
  console.log(`  - ${asset.path}`);
}

console.log(`\n=== Findings (${result.findings.length}) ===`);
for (const finding of result.findings) {
  console.log(`  [${finding.severity}] ${finding.finding}`);
  console.log(`    -> ${finding.recommendedAction}`);
}
