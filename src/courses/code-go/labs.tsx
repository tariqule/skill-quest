"use client";

import { useState } from "react";
import { LabHeader, type GoalProps } from "@/components/learn/blocks";

/** Hands-on labs for the Go Interview Quest. */

const btn = "rounded-lg px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40";

// ───────────── Slice capacity lab ─────────────

interface View {
  arr: number;
  off: number;
  len: number;
  cap: number;
}
interface SliceState {
  arrays: Record<number, number[]>;
  a: View;
  b: View | null;
  next: number;
}

const SLICE_START: SliceState = { arrays: { 1: [1, 2, 3, 4] }, a: { arr: 1, off: 0, len: 4, cap: 4 }, b: null, next: 2 };
const ARR_COLORS = ["#00add8", "#f59e0b", "#34d399", "#f472b6", "#a78bfa", "#fb7185", "#facc15", "#2dd4bf"];
const arrColor = (id: number) => ARR_COLORS[(id - 1) % ARR_COLORS.length];
const readView = (s: SliceState, v: View) => s.arrays[v.arr].slice(v.off, v.off + v.len);
const fmtSlice = (xs: number[]) => `[${xs.join(" ")}]`;

type SliceOpId = "head" | "mid" | "full" | "copy" | "appendB" | "setB" | "appendA";

const SLICE_OPS: { id: SliceOpId; code: string; needsB: boolean }[] = [
  { id: "head", code: "b := a[:2]", needsB: false },
  { id: "mid", code: "b := a[1:3]", needsB: false },
  { id: "full", code: "b := a[:2:2]", needsB: false },
  { id: "copy", code: "b := make([]int, 2); copy(b, a)", needsB: false },
  { id: "appendB", code: "b = append(b, 9)", needsB: true },
  { id: "setB", code: "b[0] = 7", needsB: true },
  { id: "appendA", code: "a = append(a, 5)", needsB: false },
];

/** Re-slice `v[lo:hi]` (or `v[lo:hi:max]`), sharing the same backing array. */
const reslice = (v: View, lo: number, hi: number, max?: number): View => ({ arr: v.arr, off: v.off + lo, len: hi - lo, cap: (max ?? v.cap) - lo });

function appendTo(s: SliceState, v: View, x: number): { s: SliceState; v: View; grew: boolean } {
  if (v.len < v.cap) {
    const arr = [...s.arrays[v.arr]];
    arr[v.off + v.len] = x;
    return { s: { ...s, arrays: { ...s.arrays, [v.arr]: arr } }, v: { ...v, len: v.len + 1 }, grew: false };
  }
  const cap = Math.max(1, v.cap * 2);
  const cells = [...readView(s, v), x];
  while (cells.length < cap) cells.push(0);
  const id = s.next;
  return { s: { ...s, arrays: { ...s.arrays, [id]: cells }, next: id + 1 }, v: { arr: id, off: 0, len: v.len + 1, cap }, grew: true };
}

function applySlice(s: SliceState, op: SliceOpId): { s: SliceState; note: string } {
  switch (op) {
    case "head":
      return { s: { ...s, b: reslice(s.a, 0, 2) }, note: "b shares a's backing array. len(b) is 2, but cap(b) runs to the end of the array." };
    case "mid":
      return { s: { ...s, b: reslice(s.a, 1, 3) }, note: "b starts at a[1], so cap(b) = cap(a) - 1. Still the same array." };
    case "full":
      return { s: { ...s, b: reslice(s.a, 0, 2, 2) }, note: "The full slice expression a[low:high:max] caps b at 2. Same array, but b can't grow into a's elements." };
    case "copy": {
      const id = s.next;
      const cells = readView(s, s.a).slice(0, 2);
      return {
        s: { ...s, arrays: { ...s.arrays, [id]: cells }, b: { arr: id, off: 0, len: 2, cap: 2 }, next: id + 1 },
        note: "make allocates a new array and copy fills it. b and a no longer share anything.",
      };
    }
    case "appendB": {
      if (!s.b) return { s, note: "" };
      const r = appendTo(s, s.b, 9);
      return {
        s: { ...r.s, b: r.v },
        note: r.grew
          ? "b was full (len == cap), so append allocated a NEW array, copied b's elements, and added 9. a is untouched."
          : "b had spare capacity, so append wrote 9 straight into the shared array. Anything else viewing that slot sees it.",
      };
    }
    case "setB":
      if (!s.b) return { s, note: "" };
      return {
        s: { ...s, arrays: { ...s.arrays, [s.b.arr]: s.arrays[s.b.arr].map((x, i) => (i === s.b!.off ? 7 : x)) } },
        note: "Indexing writes into whatever array b points at. If a shares it, a sees the 7 too.",
      };
    case "appendA": {
      const r = appendTo(s, s.a, 5);
      return {
        s: { ...r.s, a: r.v },
        note: r.grew
          ? "a was full, so append moved a to a new, bigger array. b (if any) still points at the old one: they've drifted apart."
          : "a had room, so 5 went into the existing array.",
      };
    }
  }
}

function Cell({ v, inA, inACap, inB, inBCap }: { v: number; inA: boolean; inACap: boolean; inB: boolean; inBCap: boolean }) {
  const live = inA || inB;
  return (
    <div className="w-12 text-center">
      <div className={`rounded-lg border-2 py-1.5 font-mono text-lg font-semibold ${live ? "border-white/40 bg-white/10 text-white" : "border-dashed border-white/15 text-muted-foreground"}`}>
        {v}
      </div>
      <div className="mt-1 h-1.5 rounded-full" style={{ background: inA ? "#00add8" : inACap ? "#00add855" : "transparent" }} />
      <div className="mt-0.5 h-1.5 rounded-full" style={{ background: inB ? "#f472b6" : inBCap ? "#f472b655" : "transparent" }} />
    </div>
  );
}

export function SliceLab({ goal, onSolved }: GoalProps<"isolate" | "overwrite">) {
  const [s, setS] = useState<SliceState>(SLICE_START);
  const [log, setLog] = useState<string[]>([]);
  const [note, setNote] = useState("a := []int{1, 2, 3, 4} (len 4, cap 4). Slice it into b, then append and watch the backing arrays.");

  function run(op: (typeof SLICE_OPS)[number]) {
    const before = fmtSlice(readView(s, s.a));
    const r = applySlice(s, op.id);
    const after = fmtSlice(readView(r.s, r.s.a));
    setS(r.s);
    setNote(r.note);
    setLog((l) => [...l, op.code]);
    if (op.id === "appendB") {
      if (goal === "isolate" && before === after) onSolved?.();
      if (goal === "overwrite" && before !== after) onSolved?.();
    }
  }

  function reset() {
    setS(SLICE_START);
    setLog([]);
    setNote("Reset. a := []int{1, 2, 3, 4} and b doesn't exist yet.");
  }

  const live = [...new Set([s.a.arr, ...(s.b ? [s.b.arr] : [])])].sort((x, y) => x - y);
  const inside = (v: View | null, arr: number, i: number, cap: boolean) => !!v && v.arr === arr && i >= v.off && i < v.off + (cap ? v.cap : v.len);

  return (
    <div>
      <LabHeader title="Slice capacity lab" hint="A slice is a window (pointer, len, cap) onto a backing array. Run lines and see who shares what." />
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="grid content-start gap-2">
          {SLICE_OPS.map((op) => (
            <button
              key={op.id}
              type="button"
              disabled={op.needsB && s.b === null}
              onClick={() => run(op)}
              className={`${btn} bg-slate-700 text-left font-mono text-white`}
            >
              {op.code}
            </button>
          ))}
          <button type="button" onClick={reset} className={`${btn} bg-slate-800 text-slate-300`}>
            ↺ Reset
          </button>
        </div>

        <div className="grid content-start gap-3">
          {live.map((id) => (
            <div key={id} className="pop-in rounded-xl border-2 bg-slate-950/70 p-2" style={{ borderColor: arrColor(id) }}>
              <div className="mb-1 text-[11px] font-bold uppercase tracking-wider" style={{ color: arrColor(id) }}>
                backing array #{id} · {s.arrays[id].length} slots
              </div>
              <div className="flex flex-wrap gap-1">
                {s.arrays[id].map((v, i) => (
                  <Cell key={i} v={v} inA={inside(s.a, id, i, false)} inACap={inside(s.a, id, i, true)} inB={inside(s.b, id, i, false)} inBCap={inside(s.b, id, i, true)} />
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
            <span>
              <span className="mr-1 inline-block h-2 w-5 rounded-full bg-[#00add8]" />a&apos;s len · <span className="mr-1 inline-block h-2 w-5 rounded-full bg-[#00add855]" />a&apos;s spare cap
            </span>
            <span>
              <span className="mr-1 inline-block h-2 w-5 rounded-full bg-[#f472b6]" />b&apos;s len · <span className="mr-1 inline-block h-2 w-5 rounded-full bg-[#f472b655]" />b&apos;s spare cap
            </span>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-950 p-3 font-mono text-sm">
            <div className="text-slate-400">fmt.Println(a, len(a), cap(a))</div>
            <div className={fmtSlice(readView(s, s.a)).startsWith("[1 2 3 4") ? "text-emerald-300" : "text-rose-300"}>
              {fmtSlice(readView(s, s.a))} {s.a.len} {s.a.cap}
            </div>
            <div className="mt-1 text-slate-400">fmt.Println(b, len(b), cap(b))</div>
            <div className="text-pink-300">{s.b ? `${fmtSlice(readView(s, s.b))} ${s.b.len} ${s.b.cap}` : "undefined: b"}</div>
          </div>
          <p className="text-sm text-slate-300">{note}</p>
          <p className="text-xs text-muted-foreground">
            New arrays here double in size. The real growth amount is a runtime detail; only &quot;a new, bigger array when len would exceed cap&quot; is
            guaranteed.
          </p>
          {log.length > 0 && <div className="text-xs text-muted-foreground">Ran: {log.join(" ; ")}</div>}
        </div>
      </div>
    </div>
  );
}

// ───────────── Channel visualizer ─────────────

const MAIN_LINES = ["ch <- 1", "ch <- 2", "ch <- 3", "close(ch)", "<-done", "return  // main exits"];
const RECV_LINES = ["go func() {", "    for v := range ch {", "        fmt.Println(v)", "    }", "    close(done)", "}()"];

type GState = "ready" | "blocked" | "done" | "off";
type Outcome = null | "deadlock" | "exit";

interface ChanState {
  cap: number;
  receiver: boolean;
  buf: number[];
  closed: boolean;
  doneClosed: boolean;
  pc: number;
  main: GState;
  pending: number | null;
  recv: GState;
  printed: number[];
  everBlocked: boolean;
  outcome: Outcome;
  log: string[];
}

const freshChan = (cap: number, receiver: boolean): ChanState => ({
  cap,
  receiver,
  buf: [],
  closed: false,
  doneClosed: false,
  pc: 0,
  main: "ready",
  pending: null,
  recv: receiver ? "ready" : "off",
  printed: [],
  everBlocked: false,
  outcome: null,
  log: [],
});

function checkDeadlock(s: ChanState): ChanState {
  if (s.main === "blocked" && s.recv !== "ready") {
    return { ...s, outcome: "deadlock", log: [...s.log, "fatal error: all goroutines are asleep - deadlock!"] };
  }
  return s;
}

function stepMain(s: ChanState): ChanState {
  if (s.outcome || s.main !== "ready") return s;
  if (s.pc <= 2) {
    const v = s.pc + 1;
    if (s.recv === "blocked") {
      return { ...s, pc: s.pc + 1, recv: "ready", printed: [...s.printed, v], log: [...s.log, `main: ch <- ${v} handed straight to the waiting receiver`] };
    }
    if (s.buf.length < s.cap) return { ...s, pc: s.pc + 1, buf: [...s.buf, v], log: [...s.log, `main: ch <- ${v} went into the buffer`] };
    return checkDeadlock({ ...s, main: "blocked", pending: v, everBlocked: true, log: [...s.log, `main: ch <- ${v} BLOCKS (no buffer space, no receiver waiting)`] });
  }
  if (s.pc === 3) {
    return { ...s, pc: 4, closed: true, recv: s.recv === "blocked" ? "ready" : s.recv, log: [...s.log, "main: close(ch)"] };
  }
  if (s.pc === 4) {
    if (s.doneClosed) return { ...s, pc: 5, log: [...s.log, "main: <-done returned"] };
    return checkDeadlock({ ...s, main: "blocked", everBlocked: true, log: [...s.log, "main: <-done BLOCKS until the receiver closes done"] });
  }
  return { ...s, main: "done", outcome: "exit", log: [...s.log, "main returned: program exits"] };
}

function stepRecv(s: ChanState): ChanState {
  if (s.outcome || s.recv !== "ready") return s;
  const sendBlocked = s.main === "blocked" && s.pending !== null;
  if (s.buf.length > 0) {
    const [v, ...rest] = s.buf;
    const buf = sendBlocked ? [...rest, s.pending!] : rest;
    return {
      ...s,
      buf,
      printed: [...s.printed, v],
      ...(sendBlocked ? { main: "ready" as GState, pending: null, pc: s.pc + 1 } : {}),
      log: [...s.log, `receiver: got ${v} from the buffer${sendBlocked ? "; main's blocked send moves into the freed slot" : ""}`],
    };
  }
  if (sendBlocked) {
    return { ...s, printed: [...s.printed, s.pending!], main: "ready", pending: null, pc: s.pc + 1, log: [...s.log, `receiver: took ${s.pending} directly from main (rendezvous)`] };
  }
  if (s.closed) {
    return {
      ...s,
      recv: "done",
      doneClosed: true,
      main: s.main === "blocked" ? "ready" : s.main,
      log: [...s.log, "receiver: ch is closed and empty, so range ends; close(done)"],
    };
  }
  return checkDeadlock({ ...s, recv: "blocked", log: [...s.log, "receiver: <-ch BLOCKS (nothing to receive yet)"] });
}

const STATE_STYLE: Record<GState, string> = {
  ready: "bg-emerald-400/20 text-emerald-200",
  blocked: "bg-rose-400/20 text-rose-200",
  done: "bg-slate-500/20 text-slate-300",
  off: "bg-slate-800 text-muted-foreground",
};

function GoroutineCard({ title, lines, active, state, onStep, disabled }: { title: string; lines: string[]; active: number | null; state: GState; onStep: () => void; disabled: boolean }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950 font-mono text-[13px]">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</span>
        <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${STATE_STYLE[state]}`}>{state === "off" ? "not started" : state}</span>
      </div>
      {lines.map((l, i) => (
        <div key={i} className={`whitespace-pre px-3 py-0.5 ${active === i ? (state === "blocked" ? "bg-rose-400/20" : "bg-amber-400/20") : ""} ${state === "off" ? "text-muted-foreground" : "text-slate-100"}`}>
          {l}
        </div>
      ))}
      <div className="border-t border-white/10 p-2">
        <button type="button" disabled={disabled} onClick={onStep} className={`${btn} w-full bg-primary text-primary-foreground`}>
          ▶ Step {title}
        </button>
      </div>
    </div>
  );
}

export function ChannelLab({ goal, onSolved }: GoalProps<"nonblocking" | "finish" | "deadlock">) {
  const [s, setS] = useState<ChanState>(freshChan(0, true));

  function update(next: ChanState) {
    setS(next);
    if (goal === "nonblocking" && s.pc < 3 && next.pc === 3 && !next.everBlocked) onSolved?.();
    if (goal === "finish" && next.outcome === "exit" && s.outcome !== "exit") onSolved?.();
    if (goal === "deadlock" && next.outcome === "deadlock" && s.outcome !== "deadlock") onSolved?.();
  }

  const recvLine = s.recv === "off" ? null : s.recv === "done" ? 4 : s.printed.length > 0 && s.recv === "ready" ? 2 : 1;

  return (
    <div>
      <LabHeader title="Channel visualizer" hint="You are the scheduler: step each goroutine. Unbuffered sends wait for a receiver; buffered sends wait only when the buffer is full." />
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-300">
        <span className="font-mono">ch := make(chan int, </span>
        {[0, 1, 2, 3].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setS(freshChan(n, s.receiver))}
            className={`rounded-lg px-2.5 py-1 font-mono font-bold ${n === s.cap ? "bg-sky-400 text-slate-950" : "bg-white/10 text-white"}`}
          >
            {n}
          </button>
        ))}
        <span className="font-mono">)</span>
        <label className="ml-2 flex items-center gap-1.5 text-xs">
          <input type="checkbox" checked={s.receiver} onChange={(e) => setS(freshChan(s.cap, e.target.checked))} />
          start the receiver goroutine
        </label>
        <button type="button" onClick={() => setS(freshChan(s.cap, s.receiver))} className={`${btn} ml-auto bg-slate-700 text-white`}>
          ↺ Restart
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr]">
        <GoroutineCard title="main" lines={MAIN_LINES} active={s.main === "done" ? null : s.pc} state={s.main} onStep={() => update(stepMain(s))} disabled={!!s.outcome || s.main !== "ready"} />
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">ch {s.closed && <span className="text-amber-300">(closed)</span>}</div>
          <div className="flex gap-1">
            {s.cap === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-white/20 px-3 py-2 text-xs text-slate-400">no buffer: hand-off only</div>
            ) : (
              Array.from({ length: s.cap }, (_, i) => (
                <div key={i} className={`grid h-10 w-10 place-items-center rounded-lg border-2 font-mono text-lg font-semibold ${s.buf[i] !== undefined ? "border-sky-400 bg-sky-400/20 text-white" : "border-white/15 text-muted-foreground"}`}>
                  {s.buf[i] ?? "·"}
                </div>
              ))
            )}
          </div>
          <div className="text-xs text-slate-400">
            len {s.buf.length} / cap {s.cap}
          </div>
          {s.pending !== null && <div className="text-xs text-rose-300">main waiting to send {s.pending}</div>}
        </div>
        <GoroutineCard title="receiver" lines={RECV_LINES} active={recvLine} state={s.recv} onStep={() => update(stepRecv(s))} disabled={!!s.outcome || s.recv !== "ready"} />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="min-h-20 rounded-xl border border-white/10 bg-slate-950 p-3 font-mono text-sm">
          <div className="text-xs text-muted-foreground">stdout</div>
          {s.printed.length === 0 ? <span className="text-muted-foreground">(nothing printed)</span> : s.printed.map((v, i) => <div key={i} className="text-slate-100">{v}</div>)}
          {s.outcome === "deadlock" && <div className="pop-in mt-1 text-rose-300">fatal error: all goroutines are asleep - deadlock!</div>}
          {s.outcome === "exit" && <div className="pop-in mt-1 text-emerald-300">exit status 0</div>}
        </div>
        <div className="max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-slate-950 p-3 text-xs text-slate-300">
          {s.log.length === 0 ? <span className="text-muted-foreground">Step a goroutine to begin.</span> : s.log.map((l, i) => <div key={i} className={l.includes("BLOCKS") || l.startsWith("fatal") ? "text-rose-300" : ""}>{l}</div>)}
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        The runtime reports a deadlock only when every goroutine is blocked. A single blocked goroutine while others keep running is a leak, which nothing reports.
      </p>
    </div>
  );
}

// ───────────── Defer stepper ─────────────

interface DeferStep {
  line: number;
  stack: string[];
  n: number;
  out: string[];
  note: string;
  result?: number;
}

const DEFER_CODE = {
  named: ["func f() (n int) {", '    defer fmt.Println("A", n)', "    defer func() { n *= 10 }()", '    defer func() { fmt.Println("B", n) }()', "    n = 2", "    return n + 1", "}"],
  plain: ["func f() int {", "    n := 0", '    defer fmt.Println("A", n)', "    defer func() { n *= 10 }()", '    defer func() { fmt.Println("B", n) }()', "    n = 2", "    return n + 1", "}"],
};

const A = 'Println("A", 0)';
const X = "func() { n *= 10 }";
const B = 'func() { Println("B", n) }';

const DEFER_STEPS: Record<keyof typeof DEFER_CODE, DeferStep[]> = {
  named: [
    { line: 1, stack: [A], n: 0, out: [], note: "defer works out the call's arguments right now: n is 0, so the deferred call is Println(\"A\", 0)." },
    { line: 2, stack: [A, X], n: 0, out: [], note: "A closure is deferred. It reads n when it runs, not now." },
    { line: 3, stack: [A, X, B], n: 0, out: [], note: "Another closure. Deferred calls stack up: last in, first out." },
    { line: 4, stack: [A, X, B], n: 2, out: [], note: "n = 2." },
    { line: 5, stack: [A, X, B], n: 3, out: [], note: "With a named result, return n + 1 first assigns n = 3, then the deferred calls run." },
    { line: 6, stack: [A, X], n: 3, out: ["B 3"], note: "Top of the stack: the closure prints n, which is 3." },
    { line: 6, stack: [A], n: 30, out: ["B 3"], note: "The next closure changes the named result: n = 30." },
    { line: 6, stack: [], n: 30, out: ["B 3", "A 0"], note: "Finally Println(\"A\", 0) runs with the value captured back at the defer line." },
    { line: 6, stack: [], n: 30, out: ["B 3", "A 0"], note: "f returns the named result as the defers left it.", result: 30 },
  ],
  plain: [
    { line: 1, stack: [], n: 0, out: [], note: "n is an ordinary local variable here, not the result." },
    { line: 2, stack: [A], n: 0, out: [], note: "Arguments are evaluated now: the deferred call is Println(\"A\", 0)." },
    { line: 3, stack: [A, X], n: 0, out: [], note: "A closure that will multiply the local n." },
    { line: 4, stack: [A, X, B], n: 0, out: [], note: "A closure that will print n." },
    { line: 5, stack: [A, X, B], n: 2, out: [], note: "n = 2." },
    { line: 6, stack: [A, X, B], n: 2, out: [], note: "The result value 3 is copied out now. n is separate and stays 2." },
    { line: 7, stack: [A, X], n: 2, out: ["B 2"], note: "The closure prints the local n: 2." },
    { line: 7, stack: [A], n: 20, out: ["B 2"], note: "n = 20, but the result was already fixed at 3." },
    { line: 7, stack: [], n: 20, out: ["B 2", "A 0"], note: "Println(\"A\", 0) runs last." },
    { line: 7, stack: [], n: 20, out: ["B 2", "A 0"], note: "f returns 3: deferred code can only change named results.", result: 3 },
  ],
};

export function DeferLab({ goal, onSolved }: GoalProps<"named" | "plain">) {
  const [variant, setVariant] = useState<keyof typeof DEFER_CODE>("named");
  const [i, setI] = useState(-1);
  const [guess, setGuess] = useState<number | null>(null);
  const steps = DEFER_STEPS[variant];
  const step = i >= 0 ? steps[i] : null;
  const answer = steps[steps.length - 1].result!;

  function pick(v: keyof typeof DEFER_CODE) {
    setVariant(v);
    setI(-1);
    setGuess(null);
  }

  function predict(g: number) {
    setGuess(g);
    if (g === answer && goal === variant) onSolved?.();
  }

  return (
    <div>
      <LabHeader title="Defer stepper" hint="Predict what f() returns, then step through: when are defer arguments evaluated, and can a defer change the result?" />
      <div className="mb-3 flex flex-wrap gap-2">
        {(["named", "plain"] as const).map((v) => (
          <button key={v} type="button" onClick={() => pick(v)} className={`rounded-lg px-3 py-1 font-mono text-sm font-bold ${v === variant ? "bg-sky-400 text-slate-950" : "bg-white/10 text-white"}`}>
            {v === "named" ? "func f() (n int)" : "func f() int"}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950 font-mono text-[13px]">
          {DEFER_CODE[variant].map((l, li) => (
            <div key={li} className={`flex gap-3 px-3 py-0.5 ${step?.line === li ? "bg-amber-400/20" : ""}`}>
              <span className="w-4 text-right text-muted-foreground">{li + 1}</span>
              <span className="whitespace-pre text-slate-100">{l}</span>
            </div>
          ))}
          <div className="flex flex-wrap gap-3 border-t border-white/10 px-3 py-2 text-xs text-slate-400">
            <span>
              n = <span className="text-amber-300">{step ? step.n : 0}</span>
            </span>
            {step?.result !== undefined && (
              <span>
                f() returned <span className="text-emerald-300">{step.result}</span>
              </span>
            )}
          </div>
        </div>
        <div className="grid content-start gap-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Predict: f() returns…</div>
          <div className="flex flex-wrap gap-2">
            {[0, 3, 20, 30].map((g) => (
              <button key={g} type="button" onClick={() => predict(g)} className={`${btn} bg-violet-500 text-white`}>
                {g}
              </button>
            ))}
          </div>
          {guess !== null && <div className="pop-in text-sm text-slate-200">{guess === answer ? "Right! Step through to see why." : "Not quite. Step through and watch n."}</div>}
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={i >= steps.length - 1} onClick={() => setI(i + 1)} className={`${btn} bg-primary text-primary-foreground`}>
              ▶ Step
            </button>
            <button type="button" onClick={() => setI(-1)} className={`${btn} bg-slate-700 text-white`}>
              ↺ Restart
            </button>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-950 p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">defer stack (top runs first)</div>
            <div className="mt-1 flex flex-col-reverse gap-1 font-mono text-xs">
              {(step?.stack ?? []).map((d, di) => (
                <div key={di} className="rounded bg-white/10 px-2 py-1 text-slate-100">
                  {d}
                </div>
              ))}
              {(step?.stack.length ?? 0) === 0 && <span className="text-muted-foreground">(empty)</span>}
            </div>
          </div>
          <div className="min-h-12 rounded-xl border border-white/10 bg-slate-950 p-3 font-mono text-sm">
            {(step?.out ?? []).length === 0 ? <span className="text-muted-foreground">(no output yet)</span> : step!.out.map((o, oi) => <div key={oi} className="text-slate-100">{o}</div>)}
          </div>
          <p className="text-sm text-slate-300">{step ? step.note : "Press Step to run the first line."}</p>
        </div>
      </div>
    </div>
  );
}
