import type { ScenarioGameId, ScenarioItem } from "@/engine/scenarios";
import { AIF_ARCH, AZURE_ARCH, CLF_ARCH, DVA_C02_ARCH, DVA_C03_ARCH, GCP_ARCH, KCNA_ARCH, SAA_ARCH, SD_ARCH } from "./architect";
import { AIF_CHAINS, AZURE_CHAINS, CLF_CHAINS, DOCKER_CHAINS, DVA_C02_CHAINS, DVA_C03_CHAINS, GCP_CHAINS, GIT_CHAINS, KCNA_CHAINS, SAA_CHAINS, SD_CHAINS } from "./chains";
import { INTERVIEWS } from "./interviews";
import { AIF_MATCH, AZURE_MATCH, CLF_MATCH, DVA_MATCH, GCP_MATCH, KCNA_MATCH, SAA_MATCH, SD_MATCH } from "./matcher";

/** Scenario-game items by course id. Courses missing here simply don't show the Scenarios mode. */
export const SCENARIOS: Record<string, ScenarioItem[]> = {
  "aws-saa-c03": [...SAA_ARCH, ...SAA_CHAINS, ...SAA_MATCH],
  "aws-dva-c02": [...DVA_C02_ARCH, ...DVA_C02_CHAINS, ...DVA_MATCH("d1-patterns")],
  "aws-dva-c03": [...DVA_C03_ARCH, ...DVA_C03_CHAINS, ...DVA_MATCH("d1-patterns")],
  "aws-aif-c01": [...AIF_ARCH, ...AIF_CHAINS, ...AIF_MATCH],
  "aws-clf-c02": [...CLF_ARCH, ...CLF_CHAINS, ...CLF_MATCH],
  "azure-ai-901": [...AZURE_ARCH, ...AZURE_CHAINS, ...AZURE_MATCH],
  "gcp-genai-leader": [...GCP_ARCH, ...GCP_CHAINS, ...GCP_MATCH],
  "cncf-kcna": [...KCNA_ARCH, ...KCNA_CHAINS, ...KCNA_MATCH],
  "code-system-design": [...SD_ARCH, ...SD_CHAINS, ...SD_MATCH, ...INTERVIEWS["code-system-design"]],
  "code-git": [...GIT_CHAINS, ...INTERVIEWS["code-git"]],
  "code-docker": [...DOCKER_CHAINS, ...INTERVIEWS["code-docker"]],
  ...Object.fromEntries(Object.entries(INTERVIEWS).filter(([c]) => !["code-system-design", "code-git", "code-docker"].includes(c))),
};

export function scenariosFor(courseId: string, game?: ScenarioGameId): ScenarioItem[] {
  const all = SCENARIOS[courseId] ?? [];
  return game ? all.filter((x) => x.type === game) : all;
}

export function scenarioById(courseId: string, id: string): ScenarioItem | undefined {
  return SCENARIOS[courseId]?.find((x) => x.id === id);
}

export const hasScenarios = (courseId: string) => (SCENARIOS[courseId]?.length ?? 0) > 0;
