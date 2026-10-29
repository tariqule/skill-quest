"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { CodeBlock, LabHeader, type GoalProps } from "@/components/learn/blocks";

/** Concept diagrams for the Java interview track. */

export function Btn({
  onClick,
  children,
  tone = "amber",
  disabled,
}: {
  onClick: () => void;
  children: ReactNode;
  tone?: "amber" | "slate" | "sky" | "violet";
  disabled?: boolean;
}) {
  const styles = {
    amber: { cls: "bg-amber-400 text-slate-950", edge: "#b45309" },
    slate: { cls: "bg-slate-700 text-white", edge: "#0f172a" },
    sky: { cls: "bg-sky-400 text-slate-950", edge: "#0369a1" },
    violet: { cls: "bg-violet-400 text-slate-950", edge: "#6d28d9" },
  }[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`btn-3d rounded-xl px-3 py-1.5 text-sm font-bold disabled:opacity-40 ${styles.cls}`}
      style={{ "--edge": styles.edge } as CSSProperties}
    >
      {children}
    </button>
  );
}

/** A code listing with one highlighted line (for step-through visuals). */
function SteppedCode({ lines, active }: { lines: string[]; active: number }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950 p-2 font-mono text-[13px] leading-relaxed">
      {lines.map((l, i) => (
        <div key={i} className={`flex gap-3 rounded px-2 ${i + 1 === active ? "bg-amber-400/20 text-white" : "text-slate-300"}`}>
          <span className="w-4 shrink-0 text-right text-slate-600">{i + 1}</span>
          <span className="whitespace-pre">{l}</span>
        </div>
      ))}
    </div>
  );
}

// ───────────── Integer cache ─────────────

const MIN = -200;
const MAX = 300;

export function IntegerCacheLab({ goal, onSolved }: GoalProps<"edge">) {
  const [v, setV] = useState(100);
  const cached = v >= -128 && v <= 127;

  function change(n: number) {
    const next = Math.max(MIN, Math.min(MAX, n));
    setV(next);
    if (goal === "edge" && next === 128) onSolved?.();
  }
  const pos = (n: number) => `${((n - MIN) / (MAX - MIN)) * 100}%`;

  return (
    <div>
      <LabHeader title="Integer cache explorer" hint="Pick a number. Both variables autobox it with Integer.valueOf. Does == still say true?" />
      <div className="relative h-12 rounded-xl border border-white/10 bg-slate-950/60">
        <div className="absolute inset-y-0 bg-emerald-400/20" style={{ left: pos(-128), width: `${(256 / (MAX - MIN)) * 100}%` }} />
        <span className="absolute bottom-1 -translate-x-1/2 text-[10px] font-bold text-emerald-300" style={{ left: pos(-128) }}>
          -128
        </span>
        <span className="absolute bottom-1 -translate-x-1/2 text-[10px] font-bold text-emerald-300" style={{ left: pos(127) }}>
          127
        </span>
        <span className="absolute top-1 -translate-x-1/2 text-[10px] text-emerald-200/80" style={{ left: pos(0) }}>
          cached
        </span>
        <div className="absolute inset-y-0 w-0.5 bg-amber-400 transition-all" style={{ left: pos(v) }} />
      </div>
      <input
        type="range"
        min={MIN}
        max={MAX}
        value={v}
        onChange={(e) => change(Number(e.target.value))}
        className="mt-2 w-full accent-amber-400"
        aria-label="Value to box"
      />
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <Btn tone="slate" onClick={() => change(v - 1)}>
          −1
        </Btn>
        <Btn tone="slate" onClick={() => change(v + 1)}>
          +1
        </Btn>
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${cached ? "bg-emerald-400/20 text-emerald-200" : "bg-rose-400/20 text-rose-200"}`}>
          {`a == b → ${cached}`}
        </span>
      </div>
      <div className="mt-3">
        <CodeBlock
          lang="java"
          code={`Integer a = ${v};\nInteger b = ${v};\nSystem.out.println(a == b);       // ${cached}\nSystem.out.println(a.equals(b));  // true`}
        />
      </div>
      <p className="mt-3 text-sm text-slate-300">
        {cached
          ? "Inside the cache: Integer.valueOf hands back one shared object, so == compares two references to the same object and says true."
          : "Outside the cache: each autobox makes a new Integer object, so == compares two different objects and says false. equals still compares the values."}
      </p>
      <p className="mt-1 text-xs text-slate-500">The upper bound can be raised with -XX:AutoBoxCacheMax, which is one more reason never to rely on it.</p>
    </div>
  );
}

// ───────────── String pool ─────────────

const POOL_EXPRS = [
  { expr: "a == b", result: "true", hl: ["p"], note: "Both literals point at the single pooled \"java\" object." },
  { expr: "a == c", result: "false", hl: ["p", "h"], note: "new String always builds a separate heap object, so the references differ." },
  { expr: "a.equals(c)", result: "true", hl: ["p", "h"], note: "equals compares the characters, not the references." },
  { expr: "a == c.intern()", result: "true", hl: ["p"], note: "intern() returns the pooled copy, which is the object a already points to." },
];

export function StringPool() {
  const [sel, setSel] = useState(0);
  const e = POOL_EXPRS[sel];
  const box = (id: string, label: string, vars: string, color: string) => (
    <div
      className="rounded-xl border-2 bg-slate-950/70 px-3 py-2 text-center transition"
      style={{ borderColor: e.hl.includes(id) ? color : "rgb(255 255 255 / 0.1)", boxShadow: e.hl.includes(id) ? `0 0 0 3px ${color}33` : undefined }}
    >
      <div className="font-mono text-white">{label}</div>
      <div className="mt-1 text-xs text-slate-400">{vars}</div>
    </div>
  );
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <CodeBlock lang="java" code={`String a = "java";\nString b = "java";\nString c = new String("java");`} />
        <div className="mt-3 flex flex-wrap gap-2">
          {POOL_EXPRS.map((x, i) => (
            <button
              key={x.expr}
              type="button"
              onClick={() => setSel(i)}
              className={`rounded-lg border px-2.5 py-1 font-mono text-sm transition ${i === sel ? "border-amber-400 bg-amber-400/15 text-amber-100" : "border-white/10 text-slate-300 hover:border-white/30"}`}
            >
              {x.expr}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">Tap an expression.</p>
      </div>
      <div className="grid gap-3">
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3">
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-300">String pool (inside the heap)</div>
          {box("p", "\"java\"  #1", "a → #1 · b → #1", "#34d399")}
        </div>
        <div className="rounded-xl border border-sky-400/30 bg-sky-400/5 p-3">
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-sky-300">Regular heap</div>
          {box("h", "\"java\"  #2", "c → #2", "#38bdf8")}
        </div>
        <div className="rounded-xl bg-white/5 p-3 text-sm">
          <span className="font-mono text-white">{e.expr}</span>
          <span className="text-slate-400">{" → "}</span>
          <span className={`font-mono font-bold ${e.result === "true" ? "text-emerald-300" : "text-rose-300"}`}>{e.result}</span>
          <p className="mt-1 text-slate-300">{e.note}</p>
        </div>
      </div>
    </div>
  );
}

// ───────────── Lazy stream stepper ─────────────

const STAGES = ["source", "filter(n -> n > 4)", "map(n -> n * 10)", "limit(2)", "toList()"];
const SRC = [3, 8, 5, 12, 7];
const EVENTS: { stage: number; el: string; text: string; pulled: number; out: string[] }[] = [
  { stage: 0, el: "3", text: "toList() asks for an element. The source hands over 3.", pulled: 1, out: [] },
  { stage: 1, el: "3", text: "3 > 4? No. 3 is dropped and the pipeline pulls the next element.", pulled: 1, out: [] },
  { stage: 0, el: "8", text: "The source hands over 8.", pulled: 2, out: [] },
  { stage: 1, el: "8", text: "8 > 4? Yes, it passes the filter.", pulled: 2, out: [] },
  { stage: 2, el: "80", text: "map turns 8 into 80.", pulled: 2, out: [] },
  { stage: 3, el: "80", text: "limit lets it through: 1 of 2.", pulled: 2, out: [] },
  { stage: 4, el: "80", text: "80 is collected.", pulled: 2, out: ["80"] },
  { stage: 0, el: "5", text: "The source hands over 5.", pulled: 3, out: ["80"] },
  { stage: 1, el: "5", text: "5 > 4? Yes.", pulled: 3, out: ["80"] },
  { stage: 2, el: "50", text: "map turns 5 into 50.", pulled: 3, out: ["80"] },
  { stage: 3, el: "50", text: "limit lets it through: 2 of 2. The limit is reached, so the stream stops pulling.", pulled: 3, out: ["80"] },
  { stage: 4, el: "50", text: "50 is collected. Result: [80, 50]. 12 and 7 were never touched.", pulled: 3, out: ["80", "50"] },
];

export function StreamStepper({ goal, onSolved }: GoalProps<"predict">) {
  const [step, setStep] = useState(-1);
  const [guess, setGuess] = useState<number | null>(null);
  const ev = step >= 0 ? EVENTS[step] : null;
  const done = step === EVENTS.length - 1;

  function next() {
    const n = Math.min(step + 1, EVENTS.length - 1);
    setStep(n);
    if (n === EVENTS.length - 1 && goal === "predict" && guess === EVENTS[n].pulled) onSolved?.();
  }

  return (
    <div>
      <LabHeader title="Lazy stream stepper" hint="Streams pull one element at a time through every stage. Predict how many source elements get pulled, then step." />
      <CodeBlock lang="java" code={`List.of(3, 8, 5, 12, 7).stream()\n    .filter(n -> n > 4)\n    .map(n -> n * 10)\n    .limit(2)\n    .toList();`} />
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-300">
        <span>How many source elements will be pulled?</span>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            disabled={step >= 0}
            onClick={() => setGuess(n)}
            className={`h-8 w-8 rounded-lg border font-bold transition disabled:opacity-60 ${guess === n ? "border-amber-400 bg-amber-400/20 text-amber-100" : "border-white/10 text-slate-300"}`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {SRC.map((n, i) => (
          <span
            key={n}
            className={`rounded-lg px-2.5 py-1 font-mono text-sm ${ev && i < ev.pulled ? "bg-slate-800 text-slate-500 line-through" : "bg-sky-400/15 text-sky-100"}`}
          >
            {n}
          </span>
        ))}
        <span className="self-center text-xs text-slate-500">source</span>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-5">
        {STAGES.map((s, i) => (
          <div
            key={s}
            className="rounded-xl border bg-slate-950/60 p-2 text-center transition"
            style={{ borderColor: ev?.stage === i ? "#fbbf24" : "rgb(255 255 255 / 0.1)" }}
          >
            <div className="font-mono text-[11px] text-slate-400">{s}</div>
            <div className="mt-1 h-7">
              {ev?.stage === i && <span className="pop-in inline-block rounded-full bg-amber-400 px-2.5 py-0.5 font-mono font-bold text-slate-950">{ev.el}</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-white/5 p-3 text-sm text-slate-200">
        {ev ? ev.text : "Nothing runs until the terminal operation (toList) asks for elements."}
        <div className="mt-1 font-mono text-xs text-slate-400">{`collected: [${ev ? ev.out.join(", ") : ""}]`}</div>
        {done && guess !== null && (
          <div className={`mt-2 font-semibold ${guess === 3 ? "text-emerald-300" : "text-rose-300"}`}>
            {guess === 3 ? "Spot on: only 3 elements were pulled." : `You predicted ${guess}; only 3 were pulled. Reset and try again.`}
          </div>
        )}
      </div>
      <div className="mt-3 flex gap-2">
        <Btn onClick={next} disabled={done}>
          ▶ Step
        </Btn>
        <Btn tone="slate" onClick={() => setStep(-1)}>
          Reset
        </Btn>
      </div>
    </div>
  );
}

// ───────────── Stack vs heap ─────────────

const HS_CODE = ["void demo() {", "  int n = 3;", "  Point p = new Point(1, 2);", "  Point q = p;", "  p = null;", "  q = null;", "}"];
type Slot = { name: string; val: string };
const HS_STEPS: { line: number; stack: Slot[] | null; heap: "none" | "live" | "dead"; refs: number; note: string }[] = [
  { line: 1, stack: [], heap: "none", refs: 0, note: "Calling demo() pushes a new frame onto this thread's stack." },
  { line: 2, stack: [{ name: "n", val: "3" }], heap: "none", refs: 0, note: "A primitive local lives right inside the frame. No object, nothing for the GC to do." },
  { line: 3, stack: [{ name: "n", val: "3" }, { name: "p", val: "→ #1" }], heap: "live", refs: 1, note: "new allocates the object on the heap. p holds only a reference to it." },
  {
    line: 4,
    stack: [{ name: "n", val: "3" }, { name: "p", val: "→ #1" }, { name: "q", val: "→ #1" }],
    heap: "live",
    refs: 2,
    note: "Copying a reference does not copy the object: two arrows, one object.",
  },
  { line: 5, stack: [{ name: "n", val: "3" }, { name: "p", val: "null" }, { name: "q", val: "→ #1" }], heap: "live", refs: 1, note: "#1 is still reachable through q." },
  { line: 6, stack: [{ name: "n", val: "3" }, { name: "p", val: "null" }, { name: "q", val: "null" }], heap: "dead", refs: 0, note: "No path from any GC root reaches #1: it is now eligible for garbage collection." },
  { line: 7, stack: null, heap: "dead", refs: 0, note: "The method returns and its frame is popped. The GC frees #1 whenever it next runs; you never free it yourself." },
];

export function HeapStack() {
  const [i, setI] = useState(0);
  const s = HS_STEPS[i];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <SteppedCode lines={HS_CODE} active={s.line} />
        <div className="mt-3 flex gap-2">
          <Btn tone="slate" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>
            ◀ Back
          </Btn>
          <Btn onClick={() => setI(Math.min(HS_STEPS.length - 1, i + 1))} disabled={i === HS_STEPS.length - 1}>
            Step ▶
          </Btn>
        </div>
      </div>
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-violet-400/30 bg-violet-400/5 p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-violet-300">Stack (per thread)</div>
            {s.stack === null ? (
              <div className="mt-2 text-sm text-slate-500">frame popped</div>
            ) : (
              <div className="mt-2 rounded-lg border border-white/10 bg-slate-950/70 p-2">
                <div className="text-[10px] text-slate-500">demo() frame</div>
                {s.stack.map((v) => (
                  <div key={v.name} className="pop-in font-mono text-sm text-white">
                    {v.name} <span className="text-slate-400">{v.val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-xl border border-sky-400/30 bg-sky-400/5 p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-300">Heap (shared)</div>
            {s.heap !== "none" && (
              <div
                className={`pop-in mt-2 rounded-lg border p-2 font-mono text-sm ${s.heap === "dead" ? "border-rose-400/50 bg-rose-400/10 text-rose-200" : "border-white/10 bg-slate-950/70 text-white"}`}
              >
                #1 Point(x=1, y=2)
                <div className="text-[10px] text-slate-400">{s.heap === "dead" ? "unreachable: GC eligible" : `${s.refs} reference${s.refs === 1 ? "" : "s"}`}</div>
              </div>
            )}
          </div>
        </div>
        <p className="rounded-xl bg-white/5 p-3 text-sm text-slate-200">{s.note}</p>
      </div>
    </div>
  );
}

// ───────────── Race condition stepper ─────────────

type T = { pc: number; reg: number | null };
const OPS = ["read count", "add 1", "write count", "done"];

export function RaceStepper({ goal, onSolved }: GoalProps<"lost">) {
  const [count, setCount] = useState(0);
  const [threads, setThreads] = useState<[T, T]>([
    { pc: 0, reg: null },
    { pc: 0, reg: null },
  ]);
  const [lock, setLock] = useState<number | null>(null);
  const [sync, setSync] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  function reset(nextSync = sync) {
    setCount(0);
    setThreads([
      { pc: 0, reg: null },
      { pc: 0, reg: null },
    ]);
    setLock(null);
    setSync(nextSync);
    setLog([]);
  }

  function step(t: 0 | 1) {
    const me = threads[t];
    const name = `T${t + 1}`;
    if (me.pc >= 3) return;
    if (sync && me.pc === 0 && lock !== null && lock !== t) {
      setLog((l) => [...l, `${name} is blocked: T${lock + 1} holds the lock`]);
      return;
    }
    let c = count;
    let nextLock = lock;
    const nt: T = { ...me };
    let msg = "";
    if (me.pc === 0) {
      if (sync) nextLock = t;
      nt.reg = c;
      msg = `${name} ${sync ? "locks, then " : ""}reads count = ${c}`;
    } else if (me.pc === 1) {
      nt.reg = (me.reg ?? 0) + 1;
      msg = `${name} adds 1 in its register → ${nt.reg}`;
    } else {
      c = me.reg ?? 0;
      msg = `${name} writes count = ${c}${sync ? " and unlocks" : ""}`;
      if (sync) nextLock = null;
    }
    nt.pc = me.pc + 1;
    const next: [T, T] = t === 0 ? [nt, threads[1]] : [threads[0], nt];
    setThreads(next);
    setCount(c);
    setLock(nextLock);
    setLog((l) => [...l, msg]);
    if (next[0].pc === 3 && next[1].pc === 3 && c < 2 && goal === "lost" && !sync) onSolved?.();
  }

  const finished = threads[0].pc === 3 && threads[1].pc === 3;
  return (
    <div>
      <LabHeader title="count++ race" hint="count++ is really three steps. Interleave the two threads by hand and see whether both increments survive." />
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1].map((t) => (
          <div key={t} className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
            <div className="font-bold text-white">{`Thread T${t + 1}`}</div>
            <div className="mt-1 font-mono text-xs text-slate-400">{`register: ${threads[t].reg ?? "–"}`}</div>
            <ol className="mt-2 grid gap-1 text-sm">
              {OPS.slice(0, 3).map((op, i) => (
                <li
                  key={op}
                  className={`rounded px-2 ${threads[t].pc === i ? "bg-amber-400/20 text-amber-100" : threads[t].pc > i ? "text-slate-500 line-through" : "text-slate-300"}`}
                >
                  {op}
                </li>
              ))}
            </ol>
            <div className="mt-2">
              <Btn tone={t === 0 ? "sky" : "violet"} onClick={() => step(t as 0 | 1)} disabled={threads[t].pc >= 3}>
                {`▶ T${t + 1} step`}
              </Btn>
            </div>
          </div>
        ))}
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-3 text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-300">Shared memory</div>
          <div className="mt-2 font-mono text-4xl font-black text-white">{count}</div>
          <div className="text-xs text-slate-400">count</div>
          {sync && <div className="mt-2 text-xs text-slate-300">{lock === null ? "🔓 lock free" : `🔒 held by T${lock + 1}`}</div>}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={sync} onChange={(e) => reset(e.target.checked)} className="accent-amber-400" />
          <span className="font-mono">synchronized</span>
        </label>
        <Btn tone="slate" onClick={() => reset()}>
          Reset
        </Btn>
      </div>
      {log.length > 0 && (
        <ol className="mt-3 grid gap-0.5 rounded-xl bg-white/5 p-3 font-mono text-xs text-slate-300">
          {log.map((l, i) => (
            <li key={i}>{`${i + 1}. ${l}`}</li>
          ))}
        </ol>
      )}
      {finished && (
        <p className={`mt-2 text-sm font-semibold ${count === 2 ? "text-emerald-300" : "text-rose-300"}`}>
          {count === 2
            ? "count = 2. Both increments survived."
            : "Lost update! Two increments ran but count = 1: both threads read 0 before either wrote."}
        </p>
      )}
    </div>
  );
}
