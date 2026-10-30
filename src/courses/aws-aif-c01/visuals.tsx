"use client";

import { useState } from "react";
import { Flow, type GoalProps } from "@/components/learn/blocks";

/** Concept diagrams specific to the AWS AI Practitioner course. */

const RINGS = [
  { name: "Artificial Intelligence", color: "#38bdf8", text: "Any technique that makes a machine act smart, from fixed rules to search to learning." },
  { name: "Machine Learning", color: "#a78bfa", text: "AI that learns patterns from data instead of hand-written rules." },
  { name: "Deep Learning", color: "#f59e0b", text: "Machine learning that uses neural networks with many layers. Great for images, speech and text." },
  { name: "Generative AI", color: "#34d399", text: "Deep learning models that create new content, like text, images, code and audio." },
];

export function AiRings() {
  const [sel, setSel] = useState(3);
  return (
    <div className="grid items-center gap-5 sm:grid-cols-[minmax(0,15rem)_1fr]">
      <div className="relative mx-auto aspect-square w-full max-w-[15rem]">
        {RINGS.map((r, i) => {
          const inset = i * 12;
          return (
            <button
              key={r.name}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSel(i);
              }}
              aria-label={r.name}
              className="absolute rounded-full border-2 transition"
              style={{
                inset: `${inset}%`,
                borderColor: r.color,
                background: sel === i ? `${r.color}33` : `${r.color}10`,
              }}
            >
              <span className="absolute left-1/2 top-[6%] -translate-x-1/2 whitespace-nowrap text-[10px] font-bold uppercase tracking-wide" style={{ color: r.color }}>
                {i === 3 ? "GenAI" : r.name.split(" ").map((w) => w[0]).join("")}
              </span>
            </button>
          );
        })}
      </div>
      <div>
        <div className="text-lg font-bold" style={{ color: RINGS[sel].color }}>
          {RINGS[sel].name}
        </div>
        <p className="mt-1 text-slate-300">{RINGS[sel].text}</p>
        <p className="mt-3 text-sm text-slate-400">
          Each ring sits inside the one before it. <span className="text-emerald-300">Agentic AI</span> builds on GenAI: it uses a model to plan and
          take actions with tools.
        </p>
        <p className="mt-2 text-xs text-slate-500">Tap a ring.</p>
      </div>
    </div>
  );
}

export function LearningTypes() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-sky-400/30 bg-slate-950/60 p-3">
        <div className="font-semibold text-sky-300">Supervised</div>
        <div className="mt-2 flex flex-wrap gap-1 text-xl">
          <span>🐱<sub className="text-[9px] text-slate-400">cat</sub></span>
          <span>🐶<sub className="text-[9px] text-slate-400">dog</sub></span>
          <span>🐱<sub className="text-[9px] text-slate-400">cat</sub></span>
          <span>🐶<sub className="text-[9px] text-slate-400">dog</sub></span>
        </div>
        <p className="mt-2 text-sm text-slate-300">Learns from <b>labeled</b> examples, then predicts labels for new data.</p>
      </div>
      <div className="rounded-xl border border-violet-400/30 bg-slate-950/60 p-3">
        <div className="font-semibold text-violet-300">Unsupervised</div>
        <svg viewBox="0 0 120 50" className="mt-2 h-12 w-full" aria-hidden>
          {[
            [15, 15], [22, 25], [12, 30], [25, 12],
            [60, 30], [68, 22], [58, 38], [72, 35],
            [100, 12], [108, 20], [96, 22],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill={i < 4 ? "#38bdf8" : i < 8 ? "#a78bfa" : "#f59e0b"} />
          ))}
        </svg>
        <p className="mt-2 text-sm text-slate-300">Finds <b>groups</b> in unlabeled data by itself (clustering).</p>
      </div>
      <div className="rounded-xl border border-amber-400/30 bg-slate-950/60 p-3">
        <div className="font-semibold text-amber-300">Reinforcement</div>
        <div className="mt-2 text-xl">🤖 → 🧱 <span className="text-rose-300 text-sm">-1</span> · 🤖 → 🏁 <span className="text-emerald-300 text-sm">+10</span></div>
        <p className="mt-2 text-sm text-slate-300">An agent learns by <b>trial and error</b>, chasing rewards.</p>
      </div>
    </div>
  );
}

export function ConfusionMatrix() {
  const [focus, setFocus] = useState<"precision" | "recall">("recall");
  const cell = (label: string, n: number, on: boolean, good: boolean) => (
    <div className={`rounded-lg p-3 text-center transition ${on ? (good ? "bg-emerald-400/25 ring-2 ring-emerald-400" : "bg-rose-400/25 ring-2 ring-rose-400") : "bg-white/5"}`}>
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-2xl font-bold text-white">{n}</div>
    </div>
  );
  return (
    <div>
      <div className="mb-3 flex gap-2">
        {(["recall", "precision"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFocus(f)}
            className={`rounded-full border px-3 py-1 text-sm capitalize ${focus === f ? "border-sky-400 bg-sky-400/20 text-white" : "border-white/10 text-slate-300"}`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-2 text-sm">
        <span />
        <span className="text-center text-xs text-slate-400">Model says FRAUD</span>
        <span className="text-center text-xs text-slate-400">Model says OK</span>
        <span className="text-xs text-slate-400">Really fraud</span>
        {cell("True positive", 40, true, true)}
        {cell("False negative", 10, focus === "recall", false)}
        <span className="text-xs text-slate-400">Really OK</span>
        {cell("False positive", 20, focus === "precision", false)}
        {cell("True negative", 930, false, true)}
      </div>
      <p className="mt-3 text-sm text-slate-300">
        {focus === "recall" ? (
          <>
            <b className="text-white">Recall</b> = 40 ÷ (40 + 10) = <b className="text-emerald-300">80%</b>. Of all real fraud, how much did we catch? Use when
            <b> missing</b> one is costly.
          </>
        ) : (
          <>
            <b className="text-white">Precision</b> = 40 ÷ (40 + 20) = <b className="text-emerald-300">67%</b>. Of everything we flagged, how much was real? Use
            when <b>false alarms</b> are costly.
          </>
        )}
      </p>
      <p className="mt-1 text-xs text-slate-500">Accuracy here is 97%, yet 10 frauds slipped through. That&apos;s why accuracy can mislead.</p>
    </div>
  );
}

/** Illustrative tokenizer: short letter runs, numbers, and punctuation. */
function tokenize(text: string) {
  return text.match(/[A-Za-z]{1,4}|[0-9]+|[^\sA-Za-z0-9]|\s+/g)?.filter((t) => t.trim()) ?? [];
}

export function TokenDemo({ goal, onSolved }: GoalProps<"exact12">) {
  const [text, setText] = useState("Amazon Bedrock makes generative AI easy!");
  const tokens = tokenize(text);
  const colors = ["#38bdf8", "#a78bfa", "#f59e0b", "#34d399", "#f87171"];
  return (
    <div>
      <input
        value={text}
        onChange={(e) => {
          const next = e.target.value.slice(0, 120);
          setText(next);
          if (goal === "exact12" && tokenize(next).length === 12) onSolved?.();
        }}
        aria-label="Type a sentence"
        className="w-full rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-slate-100"
      />
      <div className="mt-3 flex flex-wrap gap-1">
        {tokens.map((t, i) => (
          <span key={i} className="rounded px-1.5 py-0.5 font-mono text-sm text-slate-950" style={{ background: colors[i % colors.length] }}>
            {t}
          </span>
        ))}
      </div>
      <p className="mt-2 text-sm text-slate-400">
        About <b className="text-white">{tokens.length}</b> tokens. Models read and charge by tokens, not words. Real tokenizers split text a little differently, so treat this as a demo.
      </p>
    </div>
  );
}

export function EmbeddingMap() {
  const pts = [
    { w: "cat", x: 30, y: 30, c: "#38bdf8" },
    { w: "kitten", x: 42, y: 22, c: "#38bdf8" },
    { w: "dog", x: 22, y: 45, c: "#38bdf8" },
    { w: "puppy", x: 38, y: 50, c: "#38bdf8" },
    { w: "car", x: 160, y: 40, c: "#f59e0b" },
    { w: "truck", x: 175, y: 55, c: "#f59e0b" },
    { w: "bus", x: 150, y: 60, c: "#f59e0b" },
    { w: "invoice", x: 95, y: 110, c: "#a78bfa" },
    { w: "receipt", x: 112, y: 120, c: "#a78bfa" },
    { w: "bill", x: 85, y: 125, c: "#a78bfa" },
  ];
  return (
    <div>
      <svg viewBox="0 0 220 145" className="w-full rounded-xl border border-white/10 bg-slate-950/60" role="img" aria-label="Words placed by meaning; similar words cluster together">
        {pts.map((p) => (
          <g key={p.w}>
            <circle cx={p.x} cy={p.y} r="3.5" fill={p.c} />
            <text x={p.x + 6} y={p.y + 3} fontSize="8" fill="#cbd5e1">
              {p.w}
            </text>
          </g>
        ))}
      </svg>
      <p className="mt-2 text-sm text-slate-400">Each word becomes a vector (a list of numbers). Similar meanings land close together, so search can find &quot;bill&quot; when you type &quot;invoice&quot;.</p>
    </div>
  );
}

export function DiffusionSteps() {
  const steps = [24, 14, 7, 2, 0];
  return (
    <div className="flex items-end justify-between gap-2">
      {steps.map((blur, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-sky-400 via-violet-500 to-amber-400 text-3xl"
            style={{ filter: `blur(${blur / 6}px) saturate(${1 - blur / 40})` }}
          >
            <span style={{ opacity: 1 - blur / 26 }}>🏔️</span>
          </div>
          <span className="text-[10px] text-slate-400">{i === 0 ? "noise" : i === steps.length - 1 ? "image" : `step ${i}`}</span>
        </div>
      ))}
    </div>
  );
}

export function AgentLoop() {
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
      <div className="relative mx-auto aspect-square w-full max-w-[14rem]">
        <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full border-2 border-emerald-400/60 bg-emerald-400/10 text-center">
          <span className="text-3xl">🤖</span>
          <span className="text-xs font-semibold text-emerald-200">Agent + FM</span>
        </div>
        {[
          { t: "🎯 Goal", pos: "left-1/2 top-0 -translate-x-1/2" },
          { t: "🧠 Plan", pos: "right-0 top-1/2 -translate-y-1/2" },
          { t: "🛠️ Act", pos: "bottom-0 left-1/2 -translate-x-1/2" },
          { t: "👀 Observe", pos: "left-0 top-1/2 -translate-y-1/2" },
        ].map((n) => (
          <span key={n.t} className={`absolute ${n.pos} rounded-full border border-white/15 bg-slate-900 px-2 py-1 text-xs font-semibold text-white`}>
            {n.t}
          </span>
        ))}
      </div>
      <div className="grid content-center gap-2 text-sm">
        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
          <b className="text-white">🔌 MCP</b>
          <span className="text-slate-300"> is a universal plug between agents and their tools, like databases, APIs and files.</span>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
          <b className="text-white">🧠 Memory</b>
          <span className="text-slate-300"> holds short-term context (this chat) and long-term context (past chats).</span>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
          <b className="text-white">👥 Multi-agent</b>
          <span className="text-slate-300"> means a supervisor agent hands parts of the job to specialist agents.</span>
        </div>
      </div>
    </div>
  );
}

export function RagFlow() {
  const steps = [
    { icon: "🙋", label: "Question", text: "\"What's our refund window?\"" },
    { icon: "🔢", label: "Embed", text: "The question becomes a vector." },
    { icon: "🗄️", label: "Search vectors", text: "Find the closest document chunks (OpenSearch, Aurora, Neptune…)." },
    { icon: "📎", label: "Augment prompt", text: "Add the best chunks to the prompt as context." },
    { icon: "🤖", label: "Generate", text: "The FM answers from those chunks: \"30 days, per policy v4.\"" },
  ];
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="flex items-center gap-1">
        {steps.map((s, k) => (
          <div key={k} className="flex flex-1 items-center gap-1">
            <button
              type="button"
              onClick={() => setI(k)}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-xl transition ${k <= i ? "border-amber-400 bg-amber-400/20" : "border-white/15 bg-white/5 opacity-50"}`}
              aria-label={s.label}
            >
              {s.icon}
            </button>
            {k < steps.length - 1 && <div className={`h-0.5 flex-1 rounded ${k < i ? "bg-amber-400" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-amber-400/30 bg-slate-950/60 p-3">
        <div className="text-sm font-bold text-amber-300">
          Step {i + 1}: {steps[i].label}
        </div>
        <div className="text-slate-200">{steps[i].text}</div>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => setI(Math.max(0, i - 1))} className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-slate-200">
          ← Back
        </button>
        <button type="button" onClick={() => setI((i + 1) % steps.length)} className="rounded-lg bg-amber-400 px-3 py-1.5 text-sm font-semibold text-slate-950">
          {i === steps.length - 1 ? "Replay ↺" : "Next step →"}
        </button>
      </div>
    </div>
  );
}

const TEMPS = [
  { t: 0, out: "The sky is blue.", note: "Same answer every time. Best for facts and extraction." },
  { t: 0.5, out: "The sky looks bright blue today.", note: "Balanced. Good default for assistants." },
  { t: 1, out: "The sky hums a cobalt lullaby over sleepy rooftops.", note: "Creative and varied. Riskier for facts." },
];

export function TemperatureDial() {
  const [v, setV] = useState(0);
  const cur = TEMPS[v];
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="text-xl">🧊</span>
        <input type="range" min={0} max={2} step={1} value={v} onChange={(e) => setV(Number(e.target.value))} className="flex-1 accent-amber-400" aria-label="Temperature" />
        <span className="text-xl">🔥</span>
      </div>
      <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-3">
        <div className="text-xs text-slate-400">Temperature {cur.t} · prompt: &quot;Describe the sky.&quot;</div>
        <div className="mt-1 text-lg text-white">&ldquo;{cur.out}&rdquo;</div>
        <div className="mt-1 text-sm text-slate-400">{cur.note}</div>
      </div>
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
        <div className="rounded-lg bg-white/5 p-2"><b className="text-white">Top P</b> <span className="text-slate-400">picks from the likeliest tokens until their chances add up to P</span></div>
        <div className="rounded-lg bg-white/5 p-2"><b className="text-white">Top K</b> <span className="text-slate-400">picks only from the K likeliest next tokens</span></div>
        <div className="rounded-lg bg-white/5 p-2"><b className="text-white">Max tokens</b> <span className="text-slate-400">caps how long, and how costly, the answer can be</span></div>
      </div>
    </div>
  );
}

const PROMPT_PARTS = [
  { k: "Role / instruction", c: "#38bdf8", t: "You are a support agent for AnyBank. Summarise the customer's issue" },
  { k: "Context", c: "#a78bfa", t: " using the account notes below." },
  { k: "Input data", c: "#f59e0b", t: " Notes: \"Card declined twice abroad on 3 May.\"" },
  { k: "Output format", c: "#34d399", t: " Reply in two bullet points." },
  { k: "Negative prompt", c: "#f87171", t: " Do not include account numbers." },
];

export function PromptAnatomy() {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div>
      <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4 font-mono text-sm leading-relaxed">
        {PROMPT_PARTS.map((p) => (
          <span
            key={p.k}
            onMouseEnter={() => setHover(p.k)}
            onMouseLeave={() => setHover(null)}
            className="rounded px-0.5 transition"
            style={{ color: p.c, background: hover === p.k ? `${p.c}30` : undefined }}
          >
            {p.t}
          </span>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {PROMPT_PARTS.map((p) => (
          <button
            type="button"
            key={p.k}
            onClick={() => setHover(hover === p.k ? null : p.k)}
            className="rounded-full border px-2.5 py-1 text-xs font-semibold"
            style={{ borderColor: p.c, color: p.c, background: hover === p.k ? `${p.c}25` : undefined }}
          >
            {p.k}
          </button>
        ))}
      </div>
    </div>
  );
}

export function BiasVariance() {
  const boards = [
    { title: "Low bias, low variance", note: "Just right 🎯", dots: [[0, 0], [3, -2], [-2, 3], [2, 2], [-3, -1]], cx: 0, cy: 0 },
    { title: "Low bias, high variance", note: "Overfitting", dots: [[-14, 8], [12, -10], [6, 14], [-10, -12], [15, 6]], cx: 0, cy: 0 },
    { title: "High bias, low variance", note: "Underfitting", dots: [[0, 0], [3, -2], [-2, 3], [2, 2], [-3, -1]], cx: 16, cy: -14 },
    { title: "High bias, high variance", note: "Worst of both", dots: [[-8, 6], [10, -8], [4, 12], [-6, -10], [12, 4]], cx: 14, cy: -12 },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {boards.map((b) => (
        <div key={b.title} className="text-center">
          <svg viewBox="-30 -30 60 60" className="mx-auto w-full max-w-[8rem]" aria-hidden>
            {[28, 19, 10].map((r, i) => (
              <circle key={r} r={r} fill={i === 2 ? "#f8717133" : "none"} stroke="#ffffff30" />
            ))}
            {b.dots.map(([x, y], i) => (
              <circle key={i} cx={x + b.cx} cy={y + b.cy} r="2.6" fill="#38bdf8" />
            ))}
          </svg>
          <div className="mt-1 text-xs font-semibold text-white">{b.title}</div>
          <div className="text-xs text-slate-400">{b.note}</div>
        </div>
      ))}
    </div>
  );
}

export function TradeoffSlider() {
  const models = [
    { name: "Linear regression", explain: 95, power: 35 },
    { name: "Decision tree", explain: 80, power: 55 },
    { name: "Random forest", explain: 50, power: 75 },
    { name: "Deep neural network / FM", explain: 15, power: 95 },
  ];
  const [i, setI] = useState(1);
  const m = models[i];
  return (
    <div>
      <input type="range" min={0} max={3} value={i} onChange={(e) => setI(Number(e.target.value))} className="w-full accent-emerald-400" aria-label="Model complexity" />
      <div className="mt-1 text-center font-semibold text-white">{m.name}</div>
      <div className="mt-3 grid gap-2 text-sm">
        <div>
          <div className="flex justify-between text-slate-300"><span>🔍 Explainability</span><span>{m.explain}%</span></div>
          <div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${m.explain}%` }} /></div>
        </div>
        <div>
          <div className="flex justify-between text-slate-300"><span>💪 Performance on complex tasks</span><span>{m.power}%</span></div>
          <div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-sky-400 transition-all" style={{ width: `${m.power}%` }} /></div>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500">Illustrative. The more complex the model, the harder it is to explain.</p>
    </div>
  );
}

export function SharedResponsibility() {
  return (
    <div className="grid gap-2">
      <div className="rounded-xl border-2 border-sky-400/50 bg-sky-400/10 p-3">
        <div className="text-xs font-bold uppercase tracking-wider text-sky-300">🧑‍💻 You: security IN the cloud</div>
        <div className="mt-2 flex flex-wrap gap-1.5 text-sm">
          {["Your data and prompts", "IAM users and roles", "Encryption choices (KMS)", "Guardrails config", "App code", "Network setup (VPC)"].map((x) => (
            <span key={x} className="rounded-md bg-slate-950/70 px-2 py-1 text-slate-100">{x}</span>
          ))}
        </div>
      </div>
      <div className="rounded-xl border-2 border-amber-400/50 bg-amber-400/10 p-3">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-300">☁️ AWS: security OF the cloud</div>
        <div className="mt-2 flex flex-wrap gap-1.5 text-sm">
          {["Data centers", "Hardware", "Global network", "Managed service infrastructure, such as Bedrock hosting"].map((x) => (
            <span key={x} className="rounded-md bg-slate-950/70 px-2 py-1 text-slate-100">{x}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ScopingMatrix() {
  const scopes = [
    { n: 1, name: "Consumer app", ex: "Public chatbot", buy: true },
    { n: 2, name: "Enterprise app", ex: "SaaS with GenAI built in", buy: true },
    { n: 3, name: "Pre-trained models", ex: "Your app on a Bedrock model", buy: false },
    { n: 4, name: "Fine-tuned models", ex: "Bedrock model tuned on your data", buy: false },
    { n: 5, name: "Self-trained models", ex: "Trained from scratch", buy: false },
  ];
  return (
    <div>
      <div className="grid grid-cols-5 gap-1.5">
        {scopes.map((s) => (
          <div key={s.n} className="flex flex-col justify-end">
            <div
              className="flex flex-col items-center justify-center rounded-t-lg px-1 text-center"
              style={{ height: `${3 + s.n * 1.6}rem`, background: `hsl(${200 - s.n * 30} 70% 55% / 0.25)`, borderTop: `3px solid hsl(${200 - s.n * 30} 70% 60%)` }}
            >
              <span className="text-xl font-black text-white">{s.n}</span>
            </div>
            <div className="mt-1 text-center text-[11px] font-semibold leading-tight text-white">{s.name}</div>
            <div className="text-center text-[10px] leading-tight text-slate-400">{s.ex}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1.5 text-center text-[11px]">
        <div className="col-span-2 rounded bg-white/5 py-1 text-slate-300">🛒 Buy (prebuilt)</div>
        <div className="col-span-3 rounded bg-white/5 py-1 text-slate-300">🔨 Build (self-built)</div>
      </div>
      <p className="mt-2 text-xs text-slate-500">The higher the scope, the more of the data, model and security controls you own.</p>
    </div>
  );
}

export function GuardrailsPipeline() {
  return (
    <Flow
      color="#34d399"
      steps={[
        { icon: "🙋", label: "User prompt", sub: "Might contain something harmful, or an attack" },
        { icon: "🛡️", label: "Input guardrail", sub: "Content filters, denied topics, prompt-attack filter" },
        { icon: "🤖", label: "Foundation model", sub: "Generates a response" },
        { icon: "🛡️", label: "Output guardrail", sub: "PII redaction, word filters, grounding check" },
        { icon: "✅", label: "Safe answer", sub: "Or a blocked message you write yourself" },
      ]}
    />
  );
}
