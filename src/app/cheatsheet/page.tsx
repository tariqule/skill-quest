import type { Metadata } from "next";
import { PageShell } from "@/components/ui";
import { CARDS } from "@/data/cards";
import { DOMAINS } from "@/data/domains";

export const metadata: Metadata = { title: "Cheat Sheet · AI Practitioner Quest" };

const SECTIONS: { title: string; items: [string, string][] }[] = [
  {
    title: "Learning types",
    items: [
      ["Supervised", "Labeled data → classification (categories) or regression (numbers)"],
      ["Unsupervised", "Unlabeled data → clustering, anomaly detection, dimensionality reduction"],
      ["Reinforcement", "Agent learns from rewards and penalties (AWS DeepRacer)"],
      ["Self-supervised", "Model creates its own labels from raw data; how FMs are pre-trained"],
    ],
  },
  {
    title: "Customizing a foundation model (cheapest first)",
    items: [
      ["Prompt engineering", "Zero-shot, few-shot, chain-of-thought, system prompts. No training."],
      ["RAG", "Retrieve fresh docs at query time (Bedrock Knowledge Bases + vector store). No weight changes."],
      ["Fine-tuning", "Labeled prompt-response pairs change the weights. Needs Provisioned Throughput."],
      ["Continued pre-training", "Unlabeled domain data deepens knowledge"],
      ["Train from scratch", "Most expensive. Rarely the right answer on the exam."],
    ],
  },
  {
    title: "Inference parameters",
    items: [
      ["Temperature", "↑ creative / random · ↓ focused / deterministic"],
      ["Top P", "Sample from tokens adding up to probability P"],
      ["Top K", "Sample from the K most likely tokens"],
      ["Max tokens", "Caps output length (and cost)"],
      ["Stop sequences", "Strings that end generation"],
    ],
  },
  {
    title: "Metrics",
    items: [
      ["Accuracy", "Correct / total. Misleading with imbalanced classes."],
      ["Precision", "TP / (TP+FP). Use when false positives are costly (spam)."],
      ["Recall", "TP / (TP+FN). Use when false negatives are costly (disease, fraud)."],
      ["F1", "Balance of precision and recall"],
      ["AUC-ROC", "Classifier quality across thresholds"],
      ["RMSE / MAE / R²", "Regression error"],
      ["ROUGE · BLEU · BERTScore", "Summaries · translation · semantic similarity"],
    ],
  },
  {
    title: "Responsible AI",
    items: [
      ["Dimensions", "Fairness, explainability, privacy & security, safety, controllability, veracity & robustness, governance, transparency"],
      ["Bedrock Guardrails", "Content filters, denied topics, word filters, PII redaction, contextual grounding, prompt attack filter"],
      ["SageMaker Clarify", "Bias detection + explainability (SHAP)"],
      ["Model Cards / AI Service Cards", "Documentation for governance"],
      ["Amazon A2I", "Human review of low-confidence predictions"],
      ["RLHF", "Align models with human preferences"],
    ],
  },
  {
    title: "Security & governance",
    items: [
      ["Shared responsibility", "AWS: security OF the cloud · You: security IN the cloud (data, IAM, config)"],
      ["IAM", "Least privilege, roles over access keys"],
      ["KMS", "Encryption keys at rest; customer managed keys for custom models"],
      ["PrivateLink", "VPC → Bedrock without the public internet"],
      ["CloudTrail vs CloudWatch vs Config", "Who called which API · metrics/logs/alarms · resource config compliance"],
      ["Artifact · Audit Manager", "Download AWS compliance reports · collect your own audit evidence"],
      ["Macie · Inspector", "Find PII in S3 · scan workloads for vulnerabilities"],
      ["Bedrock data privacy", "Your prompts are not used to train base models"],
    ],
  },
];

export default function CheatSheetPage() {
  const services = CARDS.filter((c) => c.kind === "service");
  return (
    <PageShell title="📜 Cheat Sheet" subtitle="AWS Certified AI Practitioner (AIF-C01)">
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
        <h2 className="font-bold text-white">Exam domains</h2>
        <div className="mt-3 grid gap-2">
          {DOMAINS.map((d) => (
            <div key={d.id} className="flex items-center gap-3 text-sm">
              <span className="w-10 text-right font-bold" style={{ color: d.color }}>
                {d.weight}%
              </span>
              <span className="text-slate-200">
                {d.emoji} {d.name}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-400">
          65 questions (50 scored), 90 minutes, scaled score 100-1000, pass at 700. Question types: multiple choice, multiple response,
          ordering, matching, and case studies.
        </p>
      </div>

      {SECTIONS.map((s) => (
        <section key={s.title} className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <h2 className="font-bold text-white">{s.title}</h2>
          <dl className="mt-3 grid gap-2 text-sm">
            {s.items.map(([k, v]) => (
              <div key={k} className="grid gap-1 sm:grid-cols-[12rem_1fr]">
                <dt className="font-semibold text-sky-300">{k}</dt>
                <dd className="text-slate-300">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      <section className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
        <h2 className="font-bold text-white">AWS services at a glance</h2>
        <dl className="mt-3 grid gap-2 text-sm">
          {services.map((c) => (
            <div key={c.id} className="grid gap-1 sm:grid-cols-[12rem_1fr]">
              <dt className="font-semibold text-sky-300">{c.term}</dt>
              <dd className="text-slate-300">{c.definition}</dd>
            </div>
          ))}
        </dl>
      </section>
    </PageShell>
  );
}
