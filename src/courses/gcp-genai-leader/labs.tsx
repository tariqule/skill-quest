"use client";

import { useState } from "react";
import { LabHeader, type GoalProps } from "@/components/learn/blocks";

// ───────────── Pick the right Google Cloud AI product ─────────────

const JOBS = [
  {
    need: "Sales reps want help drafting emails in Gmail and summarising Meet calls, inside the apps they already use.",
    options: ["Gemini for Google Workspace", "Agent Platform AutoML", "Conversational Insights"],
    answer: "Gemini for Google Workspace",
    why: "Gemini for Google Workspace builds gen AI into Gmail, Docs, Slides, Meet, and the other Workspace apps.",
  },
  {
    need: "Employees need one place to search across company data sources and use AI agents for everyday work.",
    options: ["Gemini Enterprise", "Cloud Vision API", "Google AI Studio"],
    answer: "Gemini Enterprise",
    why: "Gemini Enterprise brings multimodal search over enterprise data and custom agents to employees.",
  },
  {
    need: "A product manager wants to try a Gemini prompt idea this afternoon, free of charge, before any project is approved.",
    options: ["Google AI Studio", "Agent Studio", "Security Command Center"],
    answer: "Google AI Studio",
    why: "Google AI Studio is free and built for quick prototyping with the Gemini API. Agent Studio is for production at scale.",
  },
  {
    need: "A data science team wants to compare Google, third-party, and open models, then tune and deploy one with enterprise controls.",
    options: ["Model Garden on Agent Platform", "Gemini app", "Text-to-Speech API"],
    answer: "Model Garden on Agent Platform",
    why: "Model Garden on Gemini Enterprise Agent Platform offers Google, third-party, and open-source models to choose from.",
  },
  {
    need: "A contact center wants real-time suggestions and knowledge articles shown to live human agents during calls.",
    options: ["Agent Assist", "Conversational Agents", "Gemini Notebook"],
    answer: "Agent Assist",
    why: "Agent Assist supports live human agents. Conversational Agents talk to customers directly.",
  },
  {
    need: "An analyst uploads 15 research reports and wants answers grounded only in those files, plus an audio overview.",
    options: ["Gemini Notebook", "Agent Platform Pipelines", "Translation API"],
    answer: "Gemini Notebook",
    why: "Gemini Notebook acts as a research assistant that stays grounded in the sources you upload.",
  },
  {
    need: "Finance wants fields pulled automatically out of thousands of scanned supplier invoices.",
    options: ["Document AI API", "Natural Language API", "Veo"],
    answer: "Document AI API",
    why: "The Document AI API extracts data from documents and automates document processing.",
  },
];

export function ProductPickerLab({ goal, onSolved }: GoalProps<"allCorrect">) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const done = Object.keys(answers).length === JOBS.length;
  const right = JOBS.filter((j, i) => answers[i] === j.answer).length;

  function pick(i: number, option: string) {
    const next = { ...answers, [i]: option };
    setAnswers(next);
    if (goal === "allCorrect" && JOBS.every((j, k) => next[k] === j.answer)) onSolved?.();
  }

  return (
    <div>
      <LabHeader title="Pick the right Google Cloud AI product" hint="Read each business need and tap the offering that fits best. You'll see straight away if you're right." />
      <div className="grid gap-2">
        {JOBS.map((j, i) => {
          const a = answers[i];
          const ok = a === j.answer;
          return (
            <div key={j.need} className={`rounded-xl border p-2 ${a ? (ok ? "border-emerald-400/50 bg-emerald-400/10" : "border-rose-400/50 bg-rose-400/10") : "border-white/10 bg-white/5"}`}>
              <div className="text-sm text-slate-100">💼 {j.need}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {j.options.map((o) => (
                  <button
                    key={o}
                    type="button"
                    disabled={!!a}
                    onClick={() => pick(i, o)}
                    className={`rounded-lg px-3 py-1 text-sm font-semibold ${
                      a === o ? (ok ? "bg-emerald-400 text-slate-950" : "bg-rose-400 text-slate-950") : a && o === j.answer ? "bg-emerald-400/30 text-emerald-100" : "bg-slate-800 text-slate-200"
                    } disabled:cursor-default`}
                  >
                    {o}
                  </button>
                ))}
              </div>
              {a && <div className={`mt-1.5 text-xs ${ok ? "text-emerald-200" : "text-rose-200"}`}>{j.why}</div>}
            </div>
          );
        })}
      </div>
      {done && (
        <div className="pop-in mt-3 flex items-center justify-between rounded-xl bg-white/5 p-3 text-sm">
          <span className="text-white">
            {right}/{JOBS.length} correct
          </span>
          <button type="button" onClick={() => setAnswers({})} className="text-sky-300 underline">
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

// ───────────── Grounding source switcher ─────────────

type Source = "none" | "enterprise" | "search";

const SOURCES: { id: Source; label: string }[] = [
  { id: "none", label: "🧠 No grounding (model memory)" },
  { id: "enterprise", label: "🏢 Your enterprise data (Agent Search)" },
  { id: "search", label: "🌐 Grounding with Google Search" },
];

const G_QUESTIONS: {
  q: string;
  best: Source | null;
  answers: Record<Source, { text: string; good: boolean; note: string }>;
}[] = [
  {
    q: "How many vacation days do new Lumen Bikes employees get?",
    best: "enterprise",
    answers: {
      none: { text: "New employees typically get 10 to 15 vacation days.", good: false, note: "A confident guess. The model has never seen your HR policy, so it may be making this up." },
      enterprise: { text: "New employees get 18 vacation days in their first year. [Source: People Handbook, section 4.2]", good: true, note: "Grounded in first-party enterprise data, with a citation." },
      search: { text: "Public web results suggest many employers offer around 10 days.", good: false, note: "World data can't see your private policy documents." },
    },
  },
  {
    q: "What did the city council decide about new bike lanes yesterday?",
    best: "search",
    answers: {
      none: { text: "The council is still discussing bike lane proposals.", good: false, note: "The model's knowledge stops at its training cutoff, so it can't know about yesterday." },
      enterprise: { text: "No internal documents mention yesterday's council vote.", good: false, note: "Your own documents don't cover fresh public news." },
      search: { text: "The council approved 12 km of new protected lanes. [Source: city news release, published yesterday]", good: true, note: "Grounded in fresh world data from Google Search, with a source." },
    },
  },
  {
    q: "Suggest three playful names for our spring sale.",
    best: null,
    answers: {
      none: { text: "\"Pedal into Spring\", \"Gear Up Days\", \"The Big Bloom Ride\".", good: true, note: "A creative task: there is no fact to verify, so grounding adds little." },
      enterprise: { text: "\"Pedal into Spring\", \"Lumen Spring Spin\", \"Gear Up Days\".", good: true, note: "Fine, but grounding wasn't needed. It matters when facts matter." },
      search: { text: "\"Spring Into Cycling\", \"Bloom & Bike\", \"Gear Up Days\".", good: true, note: "Fine, but grounding wasn't needed. It matters when facts matter." },
    },
  },
];

export function GroundingLab({ goal, onSolved }: GoalProps<"allGrounded">) {
  const [qi, setQi] = useState(0);
  const [source, setSource] = useState<Source>("none");
  const [asked, setAsked] = useState(false);
  const [solved, setSolved] = useState<number[]>([]);

  function ask() {
    setAsked(true);
    const item = G_QUESTIONS[qi];
    if (item.best && item.best === source) {
      const next = [...new Set([...solved, qi])];
      setSolved(next);
      const needed = G_QUESTIONS.map((g, i) => (g.best ? i : -1)).filter((i) => i >= 0);
      if (goal === "allGrounded" && needed.every((i) => next.includes(i))) onSolved?.();
    }
  }
  const item = G_QUESTIONS[qi];
  const ans = item.answers[source];

  return (
    <div>
      <LabHeader title="Choose the grounding source" hint="Pick a question, choose where the model should get its facts, then ask. Compare the answers." />
      <div className="flex flex-wrap gap-2">
        {G_QUESTIONS.map((g, i) => (
          <button
            key={g.q}
            type="button"
            onClick={() => {
              setQi(i);
              setAsked(false);
            }}
            className={`rounded-full border px-3 py-1 text-sm ${qi === i ? "border-sky-400 bg-sky-400/20 text-white" : "border-white/10 text-slate-300"}`}
          >
            {solved.includes(i) ? "✅ " : "🙋 "}
            {g.q}
          </button>
        ))}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {SOURCES.map((s) => (
          <label
            key={s.id}
            className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2 text-sm ${source === s.id ? "border-emerald-400/50 bg-emerald-400/10 text-white" : "border-white/10 text-slate-400"}`}
          >
            <input
              type="radio"
              name="grounding-source"
              checked={source === s.id}
              onChange={() => {
                setSource(s.id);
                setAsked(false);
              }}
              className="accent-emerald-400"
            />
            {s.label}
          </label>
        ))}
      </div>
      <button type="button" onClick={ask} className="btn-3d mt-3 rounded-xl bg-sky-400 px-4 py-2 font-bold text-slate-950" style={{ "--edge": "#0369a1" } as React.CSSProperties}>
        Ask Gemini
      </button>
      {asked && (
        <div key={`${qi}-${source}`} className={`pop-in mt-3 rounded-xl border p-3 ${ans.good ? "border-emerald-400/40 bg-emerald-400/10" : "border-rose-400/40 bg-rose-400/10"}`}>
          🤖 {ans.text}
          <div className={`mt-1 text-xs font-semibold ${ans.good ? "text-emerald-300" : "text-rose-300"}`}>
            {ans.good ? "✓ " : "✗ "}
            {ans.note}
          </div>
        </div>
      )}
    </div>
  );
}
