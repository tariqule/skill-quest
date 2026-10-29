export type DomainId = "d1" | "d2" | "d3" | "d4" | "d5";

export interface Domain {
  id: DomainId;
  number: number;
  name: string;
  world: string;
  weight: number;
  emoji: string;
  color: string;
  summary: string;
}

export const DOMAINS: Domain[] = [
  {
    id: "d1",
    number: 1,
    name: "Fundamentals of AI and ML",
    world: "The Training Grounds",
    weight: 20,
    emoji: "🧠",
    color: "#38bdf8",
    summary:
      "AI vs ML vs deep learning, learning types, the ML lifecycle, metrics, and the pre-built AWS AI services.",
  },
  {
    id: "d2",
    number: 2,
    name: "Fundamentals of Generative AI",
    world: "The Token Forge",
    weight: 24,
    emoji: "✨",
    color: "#a78bfa",
    summary:
      "Tokens, embeddings, transformers, foundation models, GenAI use cases, limits, and AWS GenAI infrastructure.",
  },
  {
    id: "d3",
    number: 3,
    name: "Applications of Foundation Models",
    world: "The Bedrock Citadel",
    weight: 28,
    emoji: "🏰",
    color: "#f59e0b",
    summary:
      "Choosing models, inference parameters, RAG, prompt engineering, fine-tuning, agents, and evaluation.",
  },
  {
    id: "d4",
    number: 4,
    name: "Guidelines for Responsible AI",
    world: "The Hall of Fairness",
    weight: 14,
    emoji: "⚖️",
    color: "#34d399",
    summary:
      "Bias, fairness, explainability, transparency, Guardrails, Clarify, model cards, and human review.",
  },
  {
    id: "d5",
    number: 5,
    name: "Security, Compliance, and Governance for AI",
    world: "The Vault",
    weight: 14,
    emoji: "🔐",
    color: "#f87171",
    summary:
      "Shared responsibility, IAM, KMS, PrivateLink, CloudTrail, Config, Audit Manager, Artifact, and data governance.",
  },
];

export const DOMAIN_BY_ID: Record<DomainId, Domain> = Object.fromEntries(
  DOMAINS.map((d) => [d.id, d]),
) as Record<DomainId, Domain>;

export function isDomainId(value: string): value is DomainId {
  return value in DOMAIN_BY_ID;
}
