"use client";

import { useState } from "react";

/** Concept diagrams specific to the Google Cloud Generative AI Leader course. */

// ───────────── AI ⊃ ML ⊃ deep learning ⊃ gen AI ─────────────

const NEST = [
  { name: "Artificial intelligence", color: "#4285f4", text: "Machines doing jobs that normally need a person's intelligence, like learning, solving problems and making decisions." },
  { name: "Machine learning", color: "#a78bfa", text: "The part of AI where machines learn from data to do a task, instead of following rules someone wrote by hand." },
  { name: "Deep learning", color: "#fbbc04", text: "ML that uses neural networks with many layers to find complex patterns in data like images, audio and text." },
  { name: "Generative AI", color: "#34a853", text: "A use of ML that creates new content: text, images, code, audio and video. Foundation models and LLMs belong here." },
];

export function GenAiNesting() {
  const [sel, setSel] = useState(3);
  const box = (i: number): React.ReactNode => {
    const n = NEST[i];
    return (
      <div
        role="button"
        tabIndex={0}
        aria-label={n.name}
        onClick={(e) => {
          e.stopPropagation();
          setSel(i);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            setSel(i);
          }
        }}
        className="cursor-pointer rounded-2xl border-2 p-2 pt-1 transition"
        style={{ borderColor: n.color, background: sel === i ? `${n.color}30` : `${n.color}0d` }}
      >
        <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: n.color }}>
          {n.name}
        </div>
        {i < NEST.length - 1 ? <div className="mt-1">{box(i + 1)}</div> : <div className="h-8" />}
      </div>
    );
  };
  return (
    <div className="grid items-center gap-5 sm:grid-cols-[minmax(0,16rem)_1fr]">
      <div className="w-full">{box(0)}</div>
      <div>
        <div className="text-lg font-bold" style={{ color: NEST[sel].color }}>
          {NEST[sel].name}
        </div>
        <p className="mt-1 text-slate-300">{NEST[sel].text}</p>
        <p className="mt-3 text-sm text-slate-400">
          <span className="text-emerald-300">Foundation models</span> are trained on massive, mostly unlabeled data and adapt to many tasks.{" "}
          <span className="text-emerald-300">LLMs</span> are foundation models specialised in human language.
        </p>
        <p className="mt-2 text-xs text-slate-500">Tap a box.</p>
      </div>
    </div>
  );
}

// ───────────── The five layers of the gen AI landscape ─────────────

const LAYERS = [
  {
    name: "Applications",
    icon: "📱",
    color: "#34a853",
    what: "The layer people actually see and use.",
    google: "Gemini app, Gemini for Google Workspace, Gemini Enterprise",
    business: "Quickest to get value from, but the least room to customise.",
  },
  {
    name: "Agents",
    icon: "🤖",
    color: "#fbbc04",
    what: "Software that works toward a goal by thinking about what it's given and using the tools it has.",
    google: "Agents in Gemini Enterprise, Customer Engagement Suite agents, custom agents on Agent Platform",
    business: "Handles work with several steps, not just one answer.",
  },
  {
    name: "Platforms",
    icon: "🧰",
    color: "#ea4335",
    what: "APIs, data management and deployment tools that connect models to agents and hide the hardware details.",
    google: "Gemini Enterprise Agent Platform: Model Garden, Agent Studio, Agent Search",
    business: "Build and govern your own solutions without running hardware.",
  },
  {
    name: "Models",
    icon: "🧠",
    color: "#a78bfa",
    what: "Programs trained on huge amounts of data. They learn patterns, then create content, translate and answer questions.",
    google: "Gemini, Gemma, Imagen, Veo",
    business: "Choose one by modality, context window, performance and cost.",
  },
  {
    name: "Infrastructure",
    icon: "🏗️",
    color: "#4285f4",
    what: "The computing power underneath: servers, GPUs and TPUs, plus the software that stores and runs models and data.",
    google: "AI Hypercomputer, Google-designed TPUs, GPUs, global data centers",
    business: "The most control and the most effort. You rarely start here.",
  },
];

export function LandscapeStack() {
  const [sel, setSel] = useState(2);
  const l = LAYERS[sel];
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,15rem)_1fr]">
      <div className="grid gap-1.5">
        {LAYERS.map((x, i) => (
          <button
            key={x.name}
            type="button"
            onClick={() => setSel(i)}
            className="flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition"
            style={{
              borderColor: sel === i ? x.color : "rgb(255 255 255 / 0.1)",
              background: sel === i ? `${x.color}26` : "rgb(2 6 23 / 0.6)",
              marginLeft: `${i * 4}%`,
              marginRight: `${(LAYERS.length - 1 - i) * 4}%`,
            }}
          >
            <span className="text-xl">{x.icon}</span>
            <span className="text-white">{x.name}</span>
          </button>
        ))}
        <div className="text-center text-[11px] text-slate-500">⬆ closer to the user · ⬇ closer to the hardware</div>
      </div>
      <div className="rounded-xl border bg-slate-950/60 p-3" style={{ borderColor: `${l.color}66` }}>
        <div className="text-lg font-bold" style={{ color: l.color }}>
          {l.icon} {l.name}
        </div>
        <p className="mt-1 text-slate-200">{l.what}</p>
        <div className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">On Google Cloud</div>
        <p className="text-sm text-slate-200">{l.google}</p>
        <div className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">Business implication</div>
        <p className="text-sm text-slate-200">{l.business}</p>
      </div>
    </div>
  );
}

// ───────────── Agent anatomy: model + tools + reasoning loop ─────────────

const LOOP = [
  { icon: "👀", label: "Observe", text: "Take in the user's request and what's happening in the environment." },
  { icon: "🧩", label: "Interpret", text: "Work out what the information means for the goal." },
  { icon: "🧠", label: "Reason", text: "Plan the next step, often guided by prompting techniques such as ReAct." },
  { icon: "🛠️", label: "Act", text: "Call a tool (an extension, function, data store, or plugin), then observe the result and loop." },
];

export function AgentAnatomy() {
  const [i, setI] = useState(0);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="grid gap-2">
        <div className="rounded-xl border border-violet-400/40 bg-violet-400/10 p-3">
          <div className="font-semibold text-violet-200">🧠 Model</div>
          <div className="text-sm text-slate-300">The brain: it understands, plans and writes.</div>
        </div>
        <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-3">
          <div className="font-semibold text-amber-200">🛠️ Tools</div>
          <div className="text-sm text-slate-300">How the agent reaches the outside world: APIs, data and actions.</div>
        </div>
        <div className="rounded-xl border border-sky-400/40 bg-sky-400/10 p-3">
          <div className="font-semibold text-sky-200">🔁 Reasoning loop</div>
          <div className="text-sm text-slate-300">Observe, interpret, reason, act, and repeat until the goal is met.</div>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-2">
          {LOOP.map((s, k) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setI(k)}
              className={`rounded-xl border p-3 text-center transition ${i === k ? "border-sky-400 bg-sky-400/20" : "border-white/10 bg-slate-950/60"}`}
            >
              <div className="text-2xl">{s.icon}</div>
              <div className="text-sm font-semibold text-white">
                {k + 1}. {s.label}
              </div>
            </button>
          ))}
        </div>
        <div className="mt-2 rounded-xl border border-sky-400/30 bg-slate-950/60 p-3 text-sm text-slate-200">{LOOP[i].text}</div>
        <button type="button" onClick={() => setI((i + 1) % LOOP.length)} className="mt-2 rounded-lg bg-sky-400 px-3 py-1.5 text-sm font-semibold text-slate-950">
          {i === LOOP.length - 1 ? "Loop again ↺" : "Next step →"}
        </button>
      </div>
    </div>
  );
}

// ───────────── RAG: retrieve, augment, generate (iterate) ─────────────

const RAG = [
  { icon: "🙋", label: "Question", text: "An employee asks: \"How many vacation days do new hires get?\"" },
  { icon: "🔎", label: "1. Retrieve", text: "A retrieval tool (for example Agent Search) finds the most relevant passages in your HR documents." },
  { icon: "📎", label: "2. Augment", text: "Those passages are added to the prompt as context, alongside the question." },
  { icon: "✨", label: "3. Generate", text: "The model answers from the supplied context: \"18 days in year one\", with a citation." },
  { icon: "🔁", label: "4. Iterate (optional)", text: "If the context isn't enough, the model can retrieve again before answering." },
];

export function RagSteps() {
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="flex items-center gap-1">
        {RAG.map((s, k) => (
          <div key={s.label} className="flex flex-1 items-center gap-1">
            <button
              type="button"
              onClick={() => setI(k)}
              aria-label={s.label}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-xl transition ${k <= i ? "border-emerald-400 bg-emerald-400/20" : "border-white/15 bg-white/5 opacity-50"}`}
            >
              {s.icon}
            </button>
            {k < RAG.length - 1 && <div className={`h-0.5 flex-1 rounded ${k < i ? "bg-emerald-400" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-emerald-400/30 bg-slate-950/60 p-3">
        <div className="text-sm font-bold text-emerald-300">{RAG[i].label}</div>
        <div className="text-slate-200">{RAG[i].text}</div>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => setI(Math.max(0, i - 1))} className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-slate-200">
          ← Back
        </button>
        <button type="button" onClick={() => setI((i + 1) % RAG.length)} className="rounded-lg bg-emerald-400 px-3 py-1.5 text-sm font-semibold text-slate-950">
          {i === RAG.length - 1 ? "Replay ↺" : "Next step →"}
        </button>
      </div>
    </div>
  );
}

// ───────────── Sampling settings ─────────────

const TEMPS = [
  { label: "Low (0.0–0.3)", out: "Our return window is 30 days from delivery.", note: "Focused and repeatable. Best for facts, extraction, and policy answers." },
  { label: "Medium (~0.5–0.7)", out: "You can return items within 30 days of delivery, no questions asked.", note: "Balanced. A common default for assistants." },
  { label: "High (0.9+)", out: "Thirty sunrises after your parcel lands, the door to returns swings wide open!", note: "Creative and varied. Good for brainstorming, risky for facts." },
];

export function SamplingDial() {
  const [v, setV] = useState(0);
  const [len, setLen] = useState(1);
  const t = TEMPS[v];
  const lengthNote = ["Short cap: cheaper and faster, but answers may be cut off.", "Medium cap: enough for a paragraph.", "Long cap: room for detail, more tokens to pay for."][len];
  return (
    <div className="grid gap-3">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-white">🌡️ Temperature</span>
          <span className="font-mono text-amber-300">{t.label}</span>
        </div>
        <input type="range" min={0} max={2} step={1} value={v} onChange={(e) => setV(Number(e.target.value))} className="w-full accent-amber-400" aria-label="Temperature" />
        <div className="rounded-lg bg-slate-950/70 px-3 py-2 text-slate-100">🤖 {t.out}</div>
        <div className="mt-1 text-xs text-slate-400">{t.note}</div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-white">📏 Output length (max tokens)</span>
          <span className="font-mono text-sky-300">{["64", "256", "1024"][len]}</span>
        </div>
        <input type="range" min={0} max={2} step={1} value={len} onChange={(e) => setLen(Number(e.target.value))} className="w-full accent-sky-400" aria-label="Output length" />
        <div className="text-xs text-slate-400">{lengthNote}</div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-violet-400/30 bg-violet-400/5 p-3 text-sm text-slate-200">
          <b className="text-violet-200">🎯 Top-p (nucleus sampling)</b>: only the most likely tokens whose probabilities add up to p are considered. Lower p means safer, less varied word choices.
        </div>
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3 text-sm text-slate-200">
          <b className="text-emerald-200">🛡️ Safety settings</b>: filter potentially harmful or inappropriate content out of the model&apos;s output.
        </div>
      </div>
    </div>
  );
}
