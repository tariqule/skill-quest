"use client";

import { useState } from "react";
import { BlockIcon } from "@/components/learn/block-icons";

/** Concept diagrams specific to the Azure AI Fundamentals (AI-901) course. */

// ───────────── Tokens → embeddings → cosine similarity ─────────────

const TOKENS = [
  { t: "I", id: 1 },
  { t: "heard", id: 2 },
  { t: "a", id: 3 },
  { t: "dog", id: 4 },
  { t: "bark", id: 5 },
];

/** Toy 2-D embeddings. Real models use thousands of dimensions. */
const EMBED: { word: string; icon: string; v: [number, number] }[] = [
  { word: "dog", icon: "🐕", v: [9, 3] },
  { word: "puppy", icon: "🐶", v: [8, 4] },
  { word: "cat", icon: "🐈", v: [9, 1] },
  { word: "bark", icon: "🔊", v: [6, 7] },
  { word: "heard", icon: "👂", v: [1, 8] },
  { word: "car", icon: "🚗", v: [-7, -3] },
  { word: "skateboard", icon: "🛹", v: [-6, -5] },
];

function cosine(a: [number, number], b: [number, number]) {
  return (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b));
}

export function TokenEmbeddings() {
  const [sel, setSel] = useState("dog");
  const me = EMBED.find((e) => e.word === sel)!;
  const ranked = EMBED.filter((e) => e.word !== sel)
    .map((e) => ({ ...e, sim: cosine(me.v, e.v) }))
    .sort((a, b) => b.sim - a.sim);
  const toX = (x: number) => 50 + x * 4.5;
  const toY = (y: number) => 50 - y * 4.5;

  return (
    <div className="grid gap-4">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-sky-300">1 · Tokenize</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {TOKENS.map((k) => (
            <span key={k.t} className="rounded-lg border border-sky-400/30 bg-sky-400/10 px-2 py-1 font-mono text-sm text-sky-100">
              {k.t} <span className="text-[10px] text-sky-300/70">#{k.id}</span>
            </span>
          ))}
          <span className="self-center text-xs text-slate-400">Tokens can be words, sub-words (&quot;un&quot;), or punctuation.</span>
        </div>
      </div>
      <div className="grid items-center gap-4 sm:grid-cols-[minmax(0,15rem)_1fr]">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-violet-300">2 · Embed (attention learns the vectors)</div>
          <svg viewBox="0 0 100 100" className="mt-2 aspect-square w-full max-w-[15rem] rounded-xl border border-white/10 bg-slate-950/60" role="img" aria-label="Embedding space">
            <line x1="50" y1="2" x2="50" y2="98" stroke="rgb(255 255 255 / 0.12)" strokeWidth="0.5" />
            <line x1="2" y1="50" x2="98" y2="50" stroke="rgb(255 255 255 / 0.12)" strokeWidth="0.5" />
            {EMBED.map((e) => (
              <g key={e.word}>
                <line x1="50" y1="50" x2={toX(e.v[0])} y2={toY(e.v[1])} stroke={e.word === sel ? "#a78bfa" : "rgb(148 163 184 / 0.35)"} strokeWidth={e.word === sel ? 1.2 : 0.6} />
                <text
                  x={toX(e.v[0])}
                  y={toY(e.v[1])}
                  fontSize="7"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="cursor-pointer"
                  onClick={() => setSel(e.word)}
                >
                  <BlockIcon icon={e.icon} className="inline-block size-[1.1em] align-[-0.15em]" />
                </text>
              </g>
            ))}
          </svg>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">3 · Compare meaning</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {EMBED.map((e) => (
              <button
                key={e.word}
                type="button"
                onClick={() => setSel(e.word)}
                className={`rounded-lg px-2 py-1 text-sm font-semibold ${e.word === sel ? "bg-violet-400 text-slate-950" : "bg-slate-800 text-slate-200"}`}
              >
                <BlockIcon icon={e.icon} className="inline-block size-[1.1em] align-[-0.15em]" /> {e.word}
              </button>
            ))}
          </div>
          <div className="mt-3 grid gap-1">
            {ranked.map((r) => (
              <div key={r.word} className="grid grid-cols-[6.5rem_1fr_3rem] items-center gap-2 text-sm">
                <span className="text-slate-200">
                  <BlockIcon icon={r.icon} className="inline-block size-[1.1em] align-[-0.15em]" /> {r.word}
                </span>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-emerald-400 transition-all duration-300" style={{ width: `${Math.max(0, r.sim) * 100}%` }} />
                </div>
                <span className="text-right font-mono text-xs text-slate-300">{r.sim.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Cosine similarity: vectors pointing the same way have similar meaning. Tap a word to compare it with the others.
          </p>
        </div>
      </div>
    </div>
  );
}

// ───────────── Deployment type chooser ─────────────

type Residency = "none" | "zone" | "geo";
type Pattern = "bursty" | "steady" | "batch";

const RESIDENCY: { id: Residency; label: string }[] = [
  { id: "none", label: "Any Azure region is fine" },
  { id: "zone", label: "🇪🇺 Stay inside a data zone (EU, US, APAC)" },
  { id: "geo", label: "Stay inside one Azure geography" },
];

const PATTERN: { id: Pattern; label: string }[] = [
  { id: "bursty", label: "Variable, bursty traffic" },
  { id: "steady", label: "Steady high volume that needs consistent speed" },
  { id: "batch", label: "A huge background job that isn't urgent" },
];

const PICK: Record<Residency, Record<Pattern, { name: string; note: string }>> = {
  none: {
    bursty: { name: "Global Standard", note: "The default starting point: pay per token, newest models first, highest default quota." },
    steady: { name: "Global Provisioned", note: "Reserved capacity in provisioned throughput units (PTUs) for predictable throughput." },
    batch: { name: "Global Batch", note: "Send a file of requests. It aims to finish within 24 hours and costs 50% less than Global Standard." },
  },
  zone: {
    bursty: { name: "Data Zone Standard", note: "Pay per token, processed only inside the Microsoft-defined data zone." },
    steady: { name: "Data Zone Provisioned", note: "Reserved PTUs plus data zone processing." },
    batch: { name: "Data Zone Batch", note: "Batch discount with processing kept inside the data zone." },
  },
  geo: {
    bursty: { name: "Standard", note: "Pay per token, processed inside the Azure geography you choose." },
    steady: { name: "Regional Provisioned", note: "Reserved PTUs inside your Azure geography." },
    batch: { name: "No geography batch type", note: "Batch comes in Global and Data Zone flavours only. Use Data Zone Batch if a data zone is acceptable." },
  },
};

export function DeploymentChooser() {
  const [res, setRes] = useState<Residency>("none");
  const [pat, setPat] = useState<Pattern>("bursty");
  const pick = PICK[res][pat];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="grid gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Where may prompts be processed?</div>
          <div className="mt-1.5 grid gap-1.5">
            {RESIDENCY.map((r) => (
              <button key={r.id} type="button" onClick={() => setRes(r.id)} className={`rounded-lg px-3 py-1.5 text-left text-sm ${res === r.id ? "bg-sky-400 font-semibold text-slate-950" : "bg-slate-800 text-slate-200"}`}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">What does the traffic look like?</div>
          <div className="mt-1.5 grid gap-1.5">
            {PATTERN.map((p) => (
              <button key={p.id} type="button" onClick={() => setPat(p.id)} className={`rounded-lg px-3 py-1.5 text-left text-sm ${pat === p.id ? "bg-orange-400 font-semibold text-slate-950" : "bg-slate-800 text-slate-200"}`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center rounded-xl border border-white/10 bg-slate-950/60 p-4">
        <div className="text-xs uppercase tracking-wider text-slate-400">Recommended deployment type</div>
        <div key={pick.name} className="pop-in mt-1 text-2xl font-semibold text-white">
          {pick.name}
        </div>
        <p className="mt-2 text-sm text-slate-300">{pick.note}</p>
        <p className="mt-3 text-xs text-muted-foreground">You also set the model version and a tokens-per-minute (TPM) limit on every deployment.</p>
      </div>
    </div>
  );
}

// ───────────── Computer vision tasks ─────────────

type CvTask = "classify" | "detect" | "segment" | "context";

const CV_TABS: { id: CvTask; label: string; text: string }[] = [
  { id: "classify", label: "Image classification", text: "One label for the whole image: its main subject." },
  { id: "detect", label: "Object detection", text: "Each object gets a label and a rectangular bounding box." },
  { id: "segment", label: "Semantic segmentation", text: "Every pixel is classified, giving a precise mask for each object." },
  { id: "context", label: "Contextual image analysis", text: "Multimodal models describe objects, activities, and relationships in words." },
];

const FRUIT = [
  { icon: "🍎", name: "apple", color: "#f87171" },
  { icon: "🍊", name: "orange", color: "#fb923c" },
  { icon: "🍌", name: "banana", color: "#facc15" },
];

export function CvTasks() {
  const [task, setTask] = useState<CvTask>("classify");
  const tab = CV_TABS.find((t) => t.id === task)!;
  const items = task === "classify" ? FRUIT.slice(0, 1) : FRUIT;
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {CV_TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => setTask(t.id)} className={`rounded-lg px-3 py-1 text-sm font-semibold ${task === t.id ? "bg-sky-400 text-slate-950" : "bg-slate-800 text-slate-200"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-3 grid items-center gap-4 sm:grid-cols-[minmax(0,16rem)_1fr]">
        <div className="relative flex h-36 items-center justify-center gap-5 rounded-xl border border-white/10 bg-slate-950/70">
          {items.map((f) => (
            <div key={f.name} className="relative flex flex-col items-center">
              <span
                className="text-5xl transition"
                style={
                  task === "segment"
                    ? { filter: `drop-shadow(0 0 0 ${f.color}) drop-shadow(0 0 6px ${f.color})` }
                    : undefined
                }
              >
                <BlockIcon icon={f.icon} className="inline-block size-[1.1em] align-[-0.15em]" />
              </span>
              {task === "detect" && (
                <>
                  <span className="pointer-events-none absolute -inset-2 rounded border-2" style={{ borderColor: f.color }} />
                  <span className="absolute -top-6 rounded px-1 text-[10px] font-bold text-slate-950" style={{ background: f.color }}>
                    {f.name} 0.9{FRUIT.indexOf(f) + 4}
                  </span>
                </>
              )}
            </div>
          ))}
          {task === "classify" && <span className="absolute bottom-2 rounded-full bg-sky-400 px-2 py-0.5 text-xs font-bold text-slate-950">label: apple</span>}
          {task === "context" && <span className="absolute bottom-2 px-2 text-center text-xs italic text-slate-200">&quot;Three pieces of fruit lined up on a counter.&quot;</span>}
        </div>
        <div>
          <div className="text-lg font-bold text-sky-300">{tab.label}</div>
          <p className="mt-1 text-slate-300">{tab.text}</p>
          <p className="mt-3 text-xs text-muted-foreground">Older models (CNNs) learned from labeled images. Newer vision transformers and multimodal models also connect images to text.</p>
        </div>
      </div>
    </div>
  );
}

// ───────────── Foundry resource → project → assets ─────────────

export function FoundryMap() {
  const [open, setOpen] = useState<"resource" | "project">("project");
  const resource = ["Model hosting and deployments", "Foundry Agent Service", "Deployment governance", "Monitoring and observability", "Security boundary", "Quotas"];
  const project = ["Agents", "Evaluations", "Files and datasets", "Vector indexes", "Connections", "Project settings"];
  return (
    <div className="grid gap-3">
      <div className="rounded-2xl border-2 p-3" style={{ borderColor: open === "resource" ? "#38bdf8" : "rgb(56 189 248 / 0.35)", background: "rgb(56 189 248 / 0.06)" }}>
        <button type="button" onClick={() => setOpen("resource")} className="text-left text-xs font-bold uppercase tracking-wider text-sky-300">
          <BlockIcon icon="🟦" className="inline-block size-[1.1em] align-[-0.15em]" /> Foundry resource (the Azure resource) {open === "resource" ? "▾" : "▸"}
        </button>
        {open === "resource" && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {resource.map((r) => (
              <span key={r} className="rounded-md bg-slate-950/70 px-2 py-1 text-sm text-slate-100">
                {r}
              </span>
            ))}
          </div>
        )}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {["Support agent project", "Invoice extraction project"].map((p, i) => (
            <div key={p} className="rounded-xl border p-2" style={{ borderColor: open === "project" && i === 0 ? "#f97316" : "rgb(249 115 22 / 0.35)", background: "rgb(249 115 22 / 0.06)" }}>
              <button type="button" onClick={() => setOpen("project")} className="text-left text-xs font-bold uppercase tracking-wider text-orange-300">
                <BlockIcon icon="🗂️" className="inline-block size-[1.1em] align-[-0.15em]" /> Foundry project: {p}
              </button>
              {open === "project" && i === 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.map((r) => (
                    <span key={r} className="rounded-md bg-slate-950/70 px-2 py-1 text-sm text-slate-100">
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">One resource per team, many projects inside it, one per AI use case. Tap the resource or a project.</p>
    </div>
  );
}

// ───────────── Content Understanding: schema-driven extraction ─────────────

const INVOICE_LINES = [
  { raw: "Invoice #  INV-2207", field: "InvoiceNumber", value: "INV-2207" },
  { raw: "Skyline Outfitters Ltd.", field: "VendorName", value: "Skyline Outfitters Ltd." },
  { raw: "Dated 4 March 2026", field: "InvoiceDate", value: "2026-03-04" },
  { raw: "2 × Trail tent @ 189.00", field: "Items[0]", value: "{ description: Trail tent, quantity: 2, unitPrice: 189.00 }" },
  { raw: "Amount due   412.80", field: "InvoiceTotal", value: "412.80" },
];

export function SchemaExtraction() {
  const [mode, setMode] = useState<"ocr" | "schema">("ocr");
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" onClick={() => setMode("ocr")} className={`rounded-lg px-3 py-1 text-sm font-semibold ${mode === "ocr" ? "bg-slate-200 text-slate-950" : "bg-slate-800 text-slate-200"}`}>
          <BlockIcon icon="🔤" className="inline-block size-[1.1em] align-[-0.15em]" /> Basic OCR
        </button>
        <button type="button" onClick={() => setMode("schema")} className={`rounded-lg px-3 py-1 text-sm font-semibold ${mode === "schema" ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-200"}`}>
          <BlockIcon icon="🧾" className="inline-block size-[1.1em] align-[-0.15em]" /> Content Understanding analyzer
        </button>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-slate-100 p-3 font-mono text-[13px] leading-relaxed text-slate-800">
          {INVOICE_LINES.map((l) => (
            <div key={l.raw}>{l.raw}</div>
          ))}
        </div>
        <div key={mode} className="pop-in rounded-xl border border-white/10 bg-slate-950/70 p-3 font-mono text-[12px] leading-relaxed">
          {mode === "ocr" ? (
            <div className="text-slate-300">
              &quot;Invoice # INV-2207 Skyline Outfitters Ltd. Dated 4 March 2026 2 × Trail tent @ 189.00 Amount due 412.80&quot;
              <div className="mt-2 font-sans text-xs text-muted-foreground">Just text. No idea which number is the total.</div>
            </div>
          ) : (
            <div className="grid gap-0.5">
              {INVOICE_LINES.map((l) => (
                <div key={l.field}>
                  <span className="text-sky-300">{l.field}</span>: <span className="text-emerald-300">{l.value}</span>
                </div>
              ))}
              <div className="mt-2 font-sans text-xs text-muted-foreground">&quot;Amount due&quot; still maps to InvoiceTotal: schemas are applied by meaning, not by label.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
