"use client";

import { useState, type CSSProperties } from "react";
import { LabHeader, type GoalProps } from "@/components/learn/blocks";

/** Hands-on labs for the Python Interview Quest. */

const btn = "btn-3d rounded-xl px-3 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40";
const edge = (c: string) => ({ "--edge": c }) as CSSProperties;

// ───────────── Names → objects: aliasing, copy, deepcopy ─────────────

type Item = { kind: "int"; v: number } | { kind: "ref"; id: number };
interface Heap {
  objs: Record<number, Item[]>;
  a: number;
  b: number | null;
  next: number;
}

const int = (v: number): Item => ({ kind: "int", v });
const ref = (id: number): Item => ({ kind: "ref", id });
const START: Heap = { objs: { 1: [int(1), int(2), ref(2)], 2: [int(3), int(4)] }, a: 1, b: null, next: 3 };
const ORIGINAL = "[1, 2, [3, 4]]";
const COLORS = ["#38bdf8", "#f59e0b", "#34d399", "#f472b6", "#a78bfa", "#fb7185", "#facc15", "#2dd4bf"];
const colorOf = (id: number) => COLORS[(id - 1) % COLORS.length];

function repr(h: Heap, id: number): string {
  return "[" + h.objs[id].map((it) => (it.kind === "int" ? String(it.v) : repr(h, it.id))).join(", ") + "]";
}

function reachable(h: Heap): number[] {
  const seen: number[] = [];
  const walk = (id: number) => {
    if (seen.includes(id)) return;
    seen.push(id);
    for (const it of h.objs[id]) if (it.kind === "ref") walk(it.id);
  };
  walk(h.a);
  if (h.b !== null) walk(h.b);
  return seen.sort((x, y) => x - y);
}

type OpId = "alias" | "copy" | "deep" | "append" | "inner" | "concat" | "iadd";

const OPS: { id: OpId; code: string; needsB: boolean; note: string }[] = [
  { id: "alias", code: "b = a", needsB: false, note: "Bind b to the same object as a. No copy is made." },
  { id: "copy", code: "b = a.copy()", needsB: false, note: "New outer list, but its items are the same objects (shallow)." },
  { id: "deep", code: "b = copy.deepcopy(a)", needsB: false, note: "New outer list and new copies of every nested list." },
  { id: "append", code: "b.append(5)", needsB: true, note: "Mutates the object b points to." },
  { id: "inner", code: "b[2].append(9)", needsB: true, note: "Mutates the nested list that b[2] points to." },
  { id: "concat", code: "b = b + [6]", needsB: true, note: "Builds a NEW list and rebinds b. The old object is untouched." },
  { id: "iadd", code: "b += [7]", needsB: true, note: "For lists, += extends the SAME object in place." },
];

function apply(h: Heap, op: OpId): Heap {
  const objs = { ...h.objs };
  const b = h.b;
  switch (op) {
    case "alias":
      return { ...h, b: h.a };
    case "copy":
      objs[h.next] = [...h.objs[h.a]];
      return { ...h, objs, b: h.next, next: h.next + 1 };
    case "deep": {
      let next = h.next;
      const clone = (src: number): number => {
        const id = next++;
        objs[id] = [];
        objs[id] = h.objs[src].map((it) => (it.kind === "ref" ? ref(clone(it.id)) : it));
        return id;
      };
      const id = clone(h.a);
      return { ...h, objs, b: id, next };
    }
    case "append":
    case "iadd":
      if (b === null) return h;
      objs[b] = [...h.objs[b], int(op === "append" ? 5 : 7)];
      return { ...h, objs };
    case "inner": {
      if (b === null) return h;
      const nested = h.objs[b][2];
      if (nested?.kind !== "ref") return h;
      objs[nested.id] = [...h.objs[nested.id], int(9)];
      return { ...h, objs };
    }
    case "concat":
      if (b === null) return h;
      objs[h.next] = [...h.objs[b], int(6)];
      return { ...h, objs, b: h.next, next: h.next + 1 };
  }
}

export function AliasLab({ goal, onSolved }: GoalProps<"deep" | "outer">) {
  const [heap, setHeap] = useState<Heap>(START);
  const [log, setLog] = useState<string[]>([]);
  const [note, setNote] = useState("a starts as [1, 2, [3, 4]]. Run lines and watch which objects change.");

  function run(op: (typeof OPS)[number]) {
    const next = apply(heap, op.id);
    setHeap(next);
    setLog((l) => [...l, op.code]);
    setNote(op.note);
    const aSafe = repr(next, next.a) === ORIGINAL;
    if (goal === "deep" && op.id === "inner" && aSafe) onSolved?.();
    if (goal === "outer" && op.id === "append" && aSafe) onSolved?.();
  }

  function reset() {
    setHeap(START);
    setLog([]);
    setNote("Reset. a is [1, 2, [3, 4]] and b doesn't exist yet.");
  }

  const live = reachable(heap);
  const aVal = repr(heap, heap.a);
  const bVal = heap.b === null ? null : repr(heap, heap.b);
  const aNested = heap.objs[heap.a][2];
  const bNested = heap.b === null ? undefined : heap.objs[heap.b][2];
  const sameNested = aNested?.kind === "ref" && bNested?.kind === "ref" && aNested.id === bNested.id;

  return (
    <div>
      <LabHeader title="Names point at objects" hint="Python names are labels on objects. Run lines on b and see whether a changes too." />
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="grid content-start gap-2">
          {OPS.map((op) => (
            <button
              key={op.id}
              type="button"
              disabled={op.needsB && heap.b === null}
              onClick={() => run(op)}
              className={`${btn} bg-slate-700 text-left font-mono text-white`}
              style={edge("#0f172a")}
            >
              {op.code}
            </button>
          ))}
          <button type="button" onClick={reset} className={`${btn} bg-slate-800 text-slate-300`} style={edge("#020617")}>
            ↺ Reset
          </button>
        </div>

        <div className="grid content-start gap-3">
          <div className="grid gap-2">
            {(["a", "b"] as const).map((name) => {
              const id = name === "a" ? heap.a : heap.b;
              return (
                <div key={name} className="flex items-center gap-2 font-mono text-sm">
                  <span className="w-6 rounded bg-white/10 text-center font-bold text-white">{name}</span>
                  <span className="text-slate-500">──▶</span>
                  {id === null ? (
                    <span className="text-slate-500">not defined</span>
                  ) : (
                    <span className="rounded px-2 py-0.5 font-bold text-slate-950" style={{ background: colorOf(id) }}>
                      list #{id}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {live.map((id) => (
              <div key={id} className="pop-in rounded-xl border-2 bg-slate-950/70 p-2" style={{ borderColor: colorOf(id) }}>
                <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: colorOf(id) }}>
                  list #{id}
                </div>
                <div className="mt-1 flex flex-wrap gap-1 font-mono text-sm">
                  {heap.objs[id].map((it, i) =>
                    it.kind === "int" ? (
                      <span key={i} className="rounded bg-white/10 px-1.5 text-slate-100">
                        {it.v}
                      </span>
                    ) : (
                      <span key={i} className="rounded px-1.5 font-bold text-slate-950" style={{ background: colorOf(it.id) }}>
                        → #{it.id}
                      </span>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950 p-3 font-mono text-sm">
            <div className="text-slate-400">&gt;&gt;&gt; print(a, b)</div>
            <div className={aVal === ORIGINAL ? "text-emerald-300" : "text-rose-300"}>
              {aVal} {bVal ?? "NameError: name 'b' is not defined"}
            </div>
            {heap.b !== null && (
              <div className="mt-1 text-slate-400">
                a is b → <span className="text-sky-300">{String(heap.a === heap.b)}</span> · a[2] is b[2] →{" "}
                <span className="text-sky-300">{String(sameNested)}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-slate-300">{note}</p>
          {log.length > 0 && <div className="text-xs text-slate-500">Ran: {log.join(" ; ")}</div>}
        </div>
      </div>
    </div>
  );
}

// ───────────── Generator stepper ─────────────

const GEN_LINES = ["def countdown(n):", '    print("start")', "    while n > 0:", "        yield n", "        n -= 1", '    print("done")'];

interface GenState {
  status: "created" | "suspended" | "done";
  n: number;
  line: number | null;
  out: string[];
  calls: number;
  correct: number;
  perfect: boolean;
}

const fresh = (n: number): GenState => ({ status: "created", n, line: null, out: [], calls: 0, correct: 0, perfect: true });

/** Run the generator until its next yield (or the end). */
function advance(s: GenState): { state: GenState; result: number | "stop" } {
  const out = [...s.out];
  if (s.status === "done") {
    out.push("✗ StopIteration (already finished)");
    return { state: { ...s, out, calls: s.calls + 1 }, result: "stop" };
  }
  let n = s.n;
  if (s.status === "created") out.push("start");
  else n -= 1;
  if (n > 0) {
    out.push(`→ next() returned ${n}`);
    return { state: { ...s, status: "suspended", n, line: 4, out, calls: s.calls + 1 }, result: n };
  }
  out.push("done", "✗ StopIteration");
  return { state: { ...s, status: "done", n, line: null, out, calls: s.calls + 1 }, result: "stop" };
}

export function GeneratorLab({ goal, onSolved }: GoalProps<"exhaust" | "predict">) {
  const [start, setStart] = useState(3);
  const [s, setS] = useState<GenState>(fresh(3));
  const [feedback, setFeedback] = useState<string | null>(null);

  function step(guess?: number | "stop") {
    const wasDone = s.status === "done";
    const { state, result } = advance(s);
    let next = state;
    if (guess !== undefined) {
      const right = guess === result;
      next = { ...state, correct: state.correct + (right ? 1 : 0), perfect: state.perfect && right };
      setFeedback(right ? "✅ Correct prediction!" : `❌ It was ${result === "stop" ? "StopIteration" : result}.`);
    } else {
      next = { ...state, perfect: false };
      setFeedback(null);
    }
    setS(next);
    if (result === "stop" && !wasDone) {
      if (goal === "exhaust") onSolved?.();
      if (goal === "predict" && next.perfect && next.correct === start + 1) onSolved?.();
    }
  }

  function restart(n: number) {
    setStart(n);
    setS(fresh(n));
    setFeedback(null);
  }

  const guesses: (number | "stop")[] = [...Array.from({ length: start }, (_, i) => start - i), "stop"];

  return (
    <div>
      <LabHeader title="Generator stepper" hint="Each next() resumes the function until the next yield, then freezes it again. Predict what comes out." />
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-300">
        <span className="font-mono">gen = countdown(</span>
        {[1, 2, 3, 4].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => restart(n)}
            className={`rounded-lg px-2.5 py-1 font-mono font-bold ${n === start ? "bg-emerald-400 text-slate-950" : "bg-white/10 text-white"}`}
          >
            {n}
          </button>
        ))}
        <span className="font-mono">)</span>
        <span className="text-xs text-slate-500">(creating it runs nothing yet)</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950 font-mono text-[13px]">
          {GEN_LINES.map((l, i) => {
            const paused = s.line === i + 1;
            return (
              <div key={i} className={`flex gap-3 px-3 py-0.5 ${paused ? "bg-amber-400/20" : ""}`}>
                <span className="w-4 text-right text-slate-600">{i + 1}</span>
                <span className="whitespace-pre text-slate-100">{l}</span>
                {paused && <span className="ml-auto text-amber-300">⏸ paused</span>}
              </div>
            );
          })}
          <div className="flex flex-wrap gap-3 border-t border-white/10 px-3 py-2 text-xs">
            <span className="text-slate-400">
              state: <span className="text-sky-300">{s.status === "created" ? "created (not started)" : s.status}</span>
            </span>
            {s.status !== "created" && (
              <span className="text-slate-400">
                n = <span className="text-amber-300">{s.n}</span>
              </span>
            )}
            <span className="text-slate-400">
              next() calls: <span className="text-white">{s.calls}</span>
            </span>
          </div>
        </div>

        <div className="grid content-start gap-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Predict, then step</div>
          <div className="flex flex-wrap gap-2">
            {guesses.map((g) => (
              <button key={String(g)} type="button" onClick={() => step(g)} className={`${btn} bg-violet-500 text-white`} style={edge("#4c1d95")}>
                {g === "stop" ? "StopIteration" : `yields ${g}`}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => step()} className={`${btn} bg-emerald-400 text-slate-950`} style={edge("#047857")}>
              ▶ next(gen)
            </button>
            <button type="button" onClick={() => restart(start)} className={`${btn} bg-slate-700 text-white`} style={edge("#0f172a")}>
              ↺ New generator
            </button>
          </div>
          {feedback && <div className="pop-in text-sm text-slate-200">{feedback}</div>}
          <div className="min-h-24 rounded-xl border border-white/10 bg-slate-950 p-3 font-mono text-sm">
            {s.out.length === 0 ? (
              <span className="text-slate-500">Console is empty: the body hasn&apos;t started.</span>
            ) : (
              s.out.map((o, i) => (
                <div key={i} className={o.startsWith("✗") ? "text-rose-300" : o.startsWith("→") ? "text-amber-300" : "text-slate-100"}>
                  {o}
                </div>
              ))
            )}
          </div>
          <p className="text-xs text-slate-400">
            A <span className="font-mono">for</span> loop calls next() for you and stops quietly at StopIteration. Run it again after it finishes: a
            generator is single-use.
          </p>
        </div>
      </div>
    </div>
  );
}
