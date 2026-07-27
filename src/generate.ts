import type { BusinessProfile } from "./types";
import type { AeoV3Result } from "./types";
import { buildBusinessFactGraph } from "./graph";
import { buildTrafficAssetIR } from "./ir";
import { compileAssets } from "./compiler";
import { compareWithV1, evaluatePreference } from "./evaluator";

export function generateAeoV3(profile: BusinessProfile): AeoV3Result {
  const graph = buildBusinessFactGraph(profile);
  const trafficAssetIR = buildTrafficAssetIR(graph);
  const compiledAssets = compileAssets(graph, trafficAssetIR);
  const { scores, findings } = evaluatePreference(graph, trafficAssetIR, compiledAssets);
  const partial = { version: "aeo-v3" as const, graph, trafficAssetIR, compiledAssets, preferenceScores: scores, findings };
  return {
    ...partial,
    benchmarkComparison: compareWithV1(partial),
  };
}
