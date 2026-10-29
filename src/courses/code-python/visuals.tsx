"use client";

import { useState } from "react";

/** Concept diagrams for the Python Interview Quest. */

// ───────────── Slicing ruler ─────────────

const WORD = "PYTHON";

/** Python's slice index rules (as in slice.indices) for a sequence of length `len`. */
function sliceIndices(len: number, start: number | null, stop: number | null, step: number): number[] {
  const out: number[] = [];
  if (step > 0) {
    const lo = start === null ? 0 : start < 0 ? Math.max(start + len, 0) : Math.min(start, len);
    const hi = stop === null ? len : stop < 0 ? Math.max(stop + len, 0) : Math.min(stop, len);
    for (let i = lo; i < hi; i += step) out.push(i);
  } else {
    const lo = start === null ? len - 1 : start < 0 ? Math.max(start + len, -1) : Math.min(start, len - 1);
    const hi = stop === null ? -1 : stop < 0 ? Math.max(stop + len, -1) : Math.min(stop, len - 1);
    for (let i = lo; i > hi; i += step) out.push(i);
  }
  return out;
}

function Bound({ label, value, onChange }: { label: string; value: number | null; onChange: (v: number | null) => void }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-white">{label}</span>
        <label className="flex items-center gap-1 text-xs text-slate-400">
          <input type="checkbox" checked={value === null} onChange={(e) => onChange(e.target.checked ? null : 0)} />
          omit
        </label>
      </div>
      <input
        type="range"
        min={-7}
        max={7}
        value={value ?? 0}
        disabled={value === null}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-sky-400 disabled:opacity-30"
        aria-label={label}
      />
      <div className="text-center font-mono text-xs text-sky-300">{value === null ? "(default)" : value}</div>
    </div>
  );
}

export function SliceRuler() {
  const [start, setStart] = useState<number | null>(1);
  const [stop, setStop] = useState<number | null>(4);
  const [step, setStep] = useState(1);
  const picked = sliceIndices(WORD.length, start, stop, step);
  const expr = `s[${start ?? ""}:${stop ?? ""}${step !== 1 ? `:${step}` : ""}]`;
  const result = picked.map((i) => WORD[i]).join("");

  return (
    <div>
      <div className="mx-auto grid max-w-md grid-cols-6 gap-1 text-center">
        {WORD.split("").map((ch, i) => {
          const order = picked.indexOf(i);
          return (
            <div key={i}>
              <div className="font-mono text-[11px] text-slate-500">{i}</div>
              <div
                className={`rounded-lg py-2 font-mono text-xl font-black transition ${order >= 0 ? "bg-sky-400 text-slate-950" : "bg-white/5 text-slate-400"}`}
              >
                {ch}
              </div>
              <div className="font-mono text-[11px] text-slate-500">{i - WORD.length}</div>
              <div className="h-4 font-mono text-[10px] text-sky-300">{order >= 0 ? `#${order + 1}` : ""}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <Bound label="start" value={start} onChange={setStart} />
        <Bound label="stop" value={stop} onChange={setStop} />
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
          <div className="text-sm font-semibold text-white">step</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {[-2, -1, 1, 2, 3].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setStep(v)}
                className={`rounded-md px-2 py-1 font-mono text-sm ${v === step ? "bg-sky-400 text-slate-950" : "bg-white/10 text-white"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 rounded-xl border border-white/10 bg-slate-950 p-3 font-mono text-sm">
        <span className="text-slate-400">&gt;&gt;&gt; s = &quot;PYTHON&quot;; {expr}</span>
        <div className="text-emerald-300">&apos;{result}&apos;</div>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Top row: positive indexes. Bottom row: negative indexes. The stop index is never included, and out-of-range bounds are clipped instead of
        raising.
      </p>
    </div>
  );
}

// ───────────── Complexity explorer ─────────────

type Cost = "O(1)" | "O(1)*" | "O(log n)" | "O(n)" | "O(n log n)" | "O(k)";

const STRUCTS: { name: string; icon: string; note: string; ops: [string, Cost, string][] }[] = [
  {
    name: "list",
    icon: "📚",
    note: "A dynamic array of references. Fast at the end, slow at the front and for searching.",
    ops: [
      ["lst[i]", "O(1)", "Index straight into the array"],
      ["lst.append(x)", "O(1)*", "Amortized: occasional resize"],
      ["lst.pop()", "O(1)", "Remove from the end"],
      ["x in lst", "O(n)", "Scans every item"],
      ["lst.insert(0, x)", "O(n)", "Shifts every item right"],
      ["lst.pop(0)", "O(n)", "Shifts every item left"],
      ["lst.sort()", "O(n log n)", "Timsort, stable"],
    ],
  },
  {
    name: "dict",
    icon: "🗂️",
    note: "A hash table. Keys must be hashable. Keeps insertion order (guaranteed since 3.7).",
    ops: [
      ["d[k]", "O(1)", "Average case: hash the key"],
      ["d[k] = v", "O(1)", "Average case"],
      ["k in d", "O(1)", "Checks keys, not values"],
      ["del d[k]", "O(1)", "Average case"],
      ["v in d.values()", "O(n)", "Values aren't hashed"],
    ],
  },
  {
    name: "set",
    icon: "🎯",
    note: "A hash table of unique, hashable items. Unordered.",
    ops: [
      ["x in s", "O(1)", "Average case: the reason to use a set"],
      ["s.add(x)", "O(1)", "Duplicates are ignored"],
      ["s.remove(x)", "O(1)", "KeyError if missing (discard() doesn't raise)"],
      ["s & t", "O(k)", "k = size of the smaller set"],
    ],
  },
  {
    name: "deque",
    icon: "🚇",
    note: "collections.deque: a double-ended queue. Fast at both ends, slow in the middle.",
    ops: [
      ["dq.append(x)", "O(1)", "Add to the right"],
      ["dq.appendleft(x)", "O(1)", "Add to the left"],
      ["dq.popleft()", "O(1)", "Perfect for BFS queues"],
      ["dq[i]", "O(n)", "Slow toward the middle"],
    ],
  },
  {
    name: "heapq",
    icon: "⛰️",
    note: "heapq functions keep a plain list as a min-heap.",
    ops: [
      ["heap[0]", "O(1)", "Peek at the smallest"],
      ["heappush(h, x)", "O(log n)", "Sift up"],
      ["heappop(h)", "O(log n)", "Sift down"],
      ["heapify(lst)", "O(n)", "Build a heap in place"],
    ],
  },
];

const COST_COLOR: Record<Cost, string> = {
  "O(1)": "#34d399",
  "O(1)*": "#34d399",
  "O(k)": "#a3e635",
  "O(log n)": "#facc15",
  "O(n)": "#fb7185",
  "O(n log n)": "#f59e0b",
};

export function ComplexityExplorer() {
  const [sel, setSel] = useState(0);
  const s = STRUCTS[sel];
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {STRUCTS.map((st, i) => (
          <button
            key={st.name}
            type="button"
            onClick={() => setSel(i)}
            className={`rounded-xl px-3 py-1.5 font-mono text-sm font-bold ${i === sel ? "bg-sky-400 text-slate-950" : "bg-white/10 text-white"}`}
          >
            {st.icon} {st.name}
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm text-slate-300">{s.note}</p>
      <div className="mt-2 grid gap-1.5">
        {s.ops.map(([op, cost, why]) => (
          <div key={op} className="pop-in grid grid-cols-[minmax(0,1fr)_5.5rem] items-center gap-2 rounded-lg bg-slate-950/60 px-3 py-1.5 sm:grid-cols-[12rem_5.5rem_1fr]">
            <span className="font-mono text-sm text-slate-100">{op}</span>
            <span className="rounded-md px-2 py-0.5 text-center font-mono text-xs font-bold text-slate-950" style={{ background: COST_COLOR[cost] }}>
              {cost}
            </span>
            <span className="col-span-2 text-xs text-slate-400 sm:col-span-1">{why}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-slate-500">* amortized. Hash-table costs are averages; heavy collisions can degrade them.</p>
    </div>
  );
}

// ───────────── LEGB rings ─────────────

const SCOPES = [
  { key: "B", name: "Built-in", color: "#94a3b8", text: "Names Python ships with: len, print, range, ValueError. Searched last." },
  { key: "G", name: "Global", color: "#a78bfa", text: "Names at the top level of the module. Rebinding one inside a function needs `global`." },
  { key: "E", name: "Enclosing", color: "#f59e0b", text: "Locals of any outer function. Closures read them; rebinding one needs `nonlocal`." },
  { key: "L", name: "Local", color: "#34d399", text: "Names assigned inside the current function. Searched first. Any assignment makes a name local for the whole function." },
];

export function LegbRings() {
  const [sel, setSel] = useState(3);
  return (
    <div className="grid items-center gap-5 sm:grid-cols-[minmax(0,15rem)_1fr]">
      <div className="relative mx-auto aspect-square w-full max-w-[15rem]">
        {SCOPES.map((r, i) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setSel(i)}
            aria-label={r.name}
            className="absolute rounded-full border-2 transition"
            style={{ inset: `${i * 12}%`, borderColor: r.color, background: sel === i ? `${r.color}33` : `${r.color}10` }}
          >
            <span className="absolute left-1/2 top-[5%] -translate-x-1/2 text-xs font-black" style={{ color: r.color }}>
              {r.key}
            </span>
          </button>
        ))}
      </div>
      <div>
        <div className="text-lg font-bold" style={{ color: SCOPES[sel].color }}>
          {SCOPES[sel].key} · {SCOPES[sel].name}
        </div>
        <p className="mt-1 text-slate-300">{SCOPES[sel].text.replace(/`/g, "")}</p>
        <div className="mt-3 flex flex-wrap items-center gap-1 text-sm">
          <span className="text-slate-400">Lookup order:</span>
          {[...SCOPES].reverse().map((r, i) => (
            <span key={r.key} className="flex items-center gap-1">
              <span className="rounded px-1.5 font-bold text-slate-950" style={{ background: r.color }}>
                {r.key}
              </span>
              {i < 3 && <span className="text-slate-500">→</span>}
            </span>
          ))}
          <span className="text-slate-400">→ NameError</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">Tap a ring.</p>
      </div>
    </div>
  );
}

// ───────────── MRO diamond ─────────────

const MRO = ["D", "B", "C", "A", "object"];

export function MroDiamond() {
  const [step, setStep] = useState(0);
  const box = (name: string) => {
    const at = MRO.indexOf(name);
    const visited = at < step;
    const current = at === step - 1;
    return (
      <div
        className={`rounded-xl border-2 px-4 py-2 text-center font-mono font-bold transition ${current ? "scale-110" : ""}`}
        style={{
          borderColor: visited ? "#f59e0b" : "rgb(255 255 255 / 0.15)",
          background: visited ? "#f59e0b22" : "rgb(2 6 23 / 0.6)",
          color: visited ? "#fde68a" : "#e2e8f0",
        }}
      >
        {name}
        {visited && <span className="ml-1 text-xs">#{at + 1}</span>}
      </div>
    );
  };
  return (
    <div>
      <div className="mx-auto grid max-w-xs gap-3">
        <div className="flex justify-center">{box("object")}</div>
        <div className="flex justify-center">{box("A")}</div>
        <div className="flex justify-around">
          {box("B")}
          {box("C")}
        </div>
        <div className="flex justify-center">{box("D")}</div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(s + 1, MRO.length))}
          className="btn-3d rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950"
          style={{ "--edge": "#b45309" } as React.CSSProperties}
        >
          Next in MRO ▶
        </button>
        <button type="button" onClick={() => setStep(0)} className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white">
          ↺
        </button>
      </div>
      <div className="mt-2 text-center font-mono text-sm text-slate-300">
        D.__mro__ → ({MRO.slice(0, step).join(", ")}
        {step < MRO.length ? ", …" : ""})
      </div>
      <p className="mt-1 text-center text-xs text-slate-500">
        class D(B, C) where B(A) and C(A). C3 linearization: children before parents, left before right, each class once.
      </p>
    </div>
  );
}

// ───────────── try / except / else / finally paths ─────────────

const TRY_LINES = ["try:", "    risky()", "except ValueError:", "    handle()", "else:", "    on_success()", "finally:", "    cleanup()", "after()"];

const PATHS: { id: string; label: string; lines: number[]; result: string }[] = [
  { id: "ok", label: "risky() succeeds", lines: [1, 2, 5, 6, 7, 8, 9], result: "else runs only when the try block finished without an exception." },
  { id: "value", label: "raises ValueError", lines: [1, 2, 3, 4, 7, 8, 9], result: "The matching except handles it, else is skipped, finally still runs." },
  { id: "key", label: "raises KeyError", lines: [1, 2, 7, 8], result: "No handler matches: finally runs, then the KeyError propagates and after() never runs." },
];

export function ExceptionPaths() {
  const [sel, setSel] = useState(0);
  const p = PATHS[sel];
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {PATHS.map((x, i) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setSel(i)}
            className={`rounded-xl px-3 py-1.5 text-sm font-bold ${i === sel ? "bg-rose-400 text-slate-950" : "bg-white/10 text-white"}`}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-slate-950 font-mono text-[13px]">
        {TRY_LINES.map((l, i) => {
          const ran = p.lines.includes(i + 1);
          return (
            <div key={i} className={`flex gap-3 px-3 py-0.5 transition ${ran ? "bg-emerald-400/15 text-slate-100" : "text-slate-600 line-through decoration-slate-700"}`}>
              <span className="w-4 text-right text-slate-600">{i + 1}</span>
              <span className="whitespace-pre">{l}</span>
              {ran && <span className="ml-auto text-emerald-300">✓</span>}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-sm text-slate-300">{p.result}</p>
    </div>
  );
}
