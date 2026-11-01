"use client";

import { useState } from "react";
import { BlockIcon } from "@/components/learn/block-icons";
import { CodeBlock, LabHeader, type GoalProps } from "@/components/learn/blocks";


// ───────────── Event loop lab ─────────────

interface LoopStep {
  /** 1-based line being run, if any. */
  line?: number;
  note: string;
  stack: string[];
  micro: string[];
  macro: string[];
  out: string[];
}

interface LoopPuzzle {
  id: "classic" | "async" | "nested";
  name: string;
  code: string;
  answer: string[];
  steps: LoopStep[];
}

const PUZZLES: LoopPuzzle[] = [
  {
    id: "classic",
    name: "The classic",
    code: `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");`,
    answer: ["A", "D", "C", "B"],
    steps: [
      { line: 1, note: "Synchronous code runs first, top to bottom. A prints right away.", stack: ["script"], micro: [], macro: [], out: ["A"] },
      { line: 2, note: "setTimeout hands the callback to the timer. When the timer fires, the callback waits in the macrotask queue.", stack: ["script"], micro: [], macro: ["log B"], out: ["A"] },
      { line: 3, note: "The promise is already resolved, so .then queues its callback as a microtask.", stack: ["script"], micro: ["log C"], macro: ["log B"], out: ["A"] },
      { line: 4, note: "This line is still synchronous, so D prints.", stack: ["script"], micro: ["log C"], macro: ["log B"], out: ["A", "D"] },
      { note: "The script is done and the call stack is empty. The event loop runs every microtask first.", stack: ["log C"], micro: [], macro: ["log B"], out: ["A", "D", "C"] },
      { note: "No microtasks left, so the loop takes the next macrotask: the timer callback.", stack: ["log B"], micro: [], macro: [], out: ["A", "D", "C", "B"] },
    ],
  },
  {
    id: "async",
    name: "await joins in",
    code: `console.log("1");
setTimeout(() => console.log("2"), 0);
queueMicrotask(() => console.log("3"));
(async () => {
  console.log("4");
  await null;
  console.log("5");
})();
console.log("6");`,
    answer: ["1", "4", "6", "3", "5", "2"],
    steps: [
      { line: 1, note: "This line is synchronous, so 1 prints.", stack: ["script"], micro: [], macro: [], out: ["1"] },
      { line: 2, note: "The timer callback will wait in the macrotask queue.", stack: ["script"], micro: [], macro: ["log 2"], out: ["1"] },
      { line: 3, note: "queueMicrotask puts its callback straight into the microtask queue.", stack: ["script"], micro: ["log 3"], macro: ["log 2"], out: ["1"] },
      { line: 5, note: "An async function runs synchronously until its first await, so 4 prints now.", stack: ["script", "async IIFE"], micro: ["log 3"], macro: ["log 2"], out: ["1", "4"] },
      { line: 6, note: "await pauses the function. The rest of it (log 5) is queued as a microtask, behind log 3.", stack: ["script"], micro: ["log 3", "resume, then log 5"], macro: ["log 2"], out: ["1", "4"] },
      { line: 9, note: "Back in the script, 6 prints.", stack: ["script"], micro: ["log 3", "resume, then log 5"], macro: ["log 2"], out: ["1", "4", "6"] },
      { note: "The stack is empty, so the microtasks run in order. First 3,", stack: ["log 3"], micro: ["resume, then log 5"], macro: ["log 2"], out: ["1", "4", "6", "3"] },
      { note: "and then the async function carries on and prints 5.", stack: ["async IIFE"], micro: [], macro: ["log 2"], out: ["1", "4", "6", "3", "5"] },
      { note: "Only now does the timer's macrotask run.", stack: ["log 2"], micro: [], macro: [], out: ["1", "4", "6", "3", "5", "2"] },
    ],
  },
  {
    id: "nested",
    name: "Queues inside queues",
    code: `setTimeout(() => console.log("t1"), 0);
Promise.resolve()
  .then(() => {
    console.log("p1");
    setTimeout(() => console.log("t2"), 0);
  })
  .then(() => console.log("p2"));
console.log("sync");`,
    answer: ["sync", "p1", "p2", "t1", "t2"],
    steps: [
      { line: 1, note: "Timer t1 is scheduled: its callback will wait in the macrotask queue.", stack: ["script"], micro: [], macro: ["log t1"], out: [] },
      { line: 3, note: "The first .then is queued as a microtask. The second .then waits until the first one finishes.", stack: ["script"], micro: ["then #1"], macro: ["log t1"], out: [] },
      { line: 8, note: "This line is synchronous, so sync prints.", stack: ["script"], micro: ["then #1"], macro: ["log t1"], out: ["sync"] },
      { line: 4, note: "The stack is empty, so the first microtask, then #1, runs. p1 prints.", stack: ["then #1"], micro: [], macro: ["log t1"], out: ["sync", "p1"] },
      { line: 5, note: "A new timer t2 joins the macrotask queue, behind t1.", stack: ["then #1"], micro: [], macro: ["log t1", "log t2"], out: ["sync", "p1"] },
      { line: 7, note: "then #1 returned, so then #2 is queued. It's a microtask, so it still runs before any timer.", stack: [], micro: ["then #2"], macro: ["log t1", "log t2"], out: ["sync", "p1"] },
      { note: "The next microtask runs, and p2 prints.", stack: ["then #2"], micro: [], macro: ["log t1", "log t2"], out: ["sync", "p1", "p2"] },
      { note: "The microtask queue is empty, so one macrotask runs: t1.", stack: ["log t1"], micro: [], macro: ["log t2"], out: ["sync", "p1", "p2", "t1"] },
      { note: "Then the next macrotask, t2.", stack: ["log t2"], micro: [], macro: [], out: ["sync", "p1", "p2", "t1", "t2"] },
    ],
  },
];

function Lane({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/60 p-2">
      <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>
        {title}
      </div>
      <div className="mt-1 flex min-h-8 flex-wrap gap-1">
        {items.length === 0 && <span className="text-xs text-muted-foreground">empty</span>}
        {items.map((it, i) => (
          <span key={`${it}-${i}`} className="pop-in rounded-md px-2 py-0.5 font-mono text-xs text-slate-950" style={{ background: color }}>
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Predict the console output, then step through the call stack and both queues. */
export function EventLoopLab({ goal, onSolved }: GoalProps<"classic" | "async" | "nested">) {
  const [pid, setPid] = useState<LoopPuzzle["id"]>(goal ?? "classic");
  const [guess, setGuess] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [step, setStep] = useState(-1);
  const puzzle = PUZZLES.find((p) => p.id === pid)!;
  const chips = [...puzzle.answer].sort();
  const left = chips.filter((c) => !guess.includes(c));
  const correct = checked && guess.every((g, i) => g === puzzle.answer[i]);
  const s = step >= 0 ? puzzle.steps[step] : null;

  function pick(id: LoopPuzzle["id"]) {
    setPid(id);
    setGuess([]);
    setChecked(false);
    setStep(-1);
  }

  function check() {
    setChecked(true);
    const ok = guess.every((g, i) => g === puzzle.answer[i]);
    if (ok && (!goal || goal === pid)) onSolved?.();
  }

  const lineNo = s?.line;
  const numbered = puzzle.code
    .split("\n")
    .map((l, i) => `${i + 1 === lineNo ? "▶" : " "} ${l}`)
    .join("\n");

  return (
    <div>
      <LabHeader title="Event loop simulator" hint="Tap the outputs in the order you think they print, then Check. Use Step to watch the stack and queues." />
      {!goal && (
        <div className="mb-3 flex flex-wrap gap-2">
          {PUZZLES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => pick(p.id)}
              className={`rounded-full border px-3 py-1 text-sm font-semibold ${p.id === pid ? "border-sky-400 bg-sky-400/20 text-sky-100" : "border-white/10 text-slate-300"}`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <CodeBlock code={numbered} lang="js" />
        <div className="grid content-start gap-2">
          <Lane title="Call stack" items={s?.stack ?? []} color="#fbbf24" />
          <Lane title="Microtask queue" items={s?.micro ?? []} color="#34d399" />
          <Lane title="Macrotask (task) queue" items={s?.macro ?? []} color="#38bdf8" />
          <div className="rounded-xl border border-white/10 bg-black/60 p-2 font-mono text-xs text-emerald-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Console</div>
            {(s?.out ?? []).map((o, i) => (
              <div key={i}>&gt; {o}</div>
            ))}
          </div>
          {s && <p className="text-sm text-slate-300">{s.note}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep((n) => Math.min(n + 1, puzzle.steps.length - 1))}
              disabled={step >= puzzle.steps.length - 1}
              className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
            >
              Step ▶ {step + 1}/{puzzle.steps.length}
            </button>
            <button type="button" onClick={() => setStep(-1)} className="rounded-xl px-3 py-1.5 text-sm text-slate-400 hover:text-white">
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/60 p-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Your prediction</div>
        <div className="mt-2 flex min-h-9 flex-wrap gap-1.5">
          {guess.map((g, i) => {
            const state = !checked ? "border-white/20 bg-white/10 text-white" : g === puzzle.answer[i] ? "border-emerald-400 bg-emerald-400/20 text-emerald-100" : "border-rose-400 bg-rose-400/20 text-rose-100";
            return (
              <span key={g} className={`pop-in rounded-lg border px-2.5 py-1 font-mono text-sm ${state}`}>
                {g}
              </span>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {left.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setGuess((g) => [...g, c]);
                setChecked(false);
              }}
              className="rounded-lg border border-sky-400/40 bg-sky-400/10 px-2.5 py-1 font-mono text-sm text-sky-100 hover:bg-sky-400/25"
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={check}
            disabled={guess.length !== puzzle.answer.length}
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-40"
          >
            Check
          </button>
          <button
            type="button"
            onClick={() => {
              setGuess([]);
              setChecked(false);
            }}
            className="rounded-xl px-3 py-2 text-sm text-slate-400 hover:text-white"
          >
            Clear
          </button>
        </div>
        {checked && (
          <p className={`mt-2 text-sm ${correct ? "text-emerald-300" : "text-rose-300"}`}>
            {correct ? "Exactly right: sync code, then every microtask, then one macrotask at a time." : "Not quite. Step through the simulation to see where the order changes."}
          </p>
        )}
      </div>
    </div>
  );
}

// ───────────── this binder lab ─────────────

type Who = "ada" | "bob" | "undefined";

const CALLS: { code: string; who: Who; why: string }[] = [
  { code: "ada.greet()", who: "ada", why: "Implicit binding: the object before the dot." },
  { code: "const g = ada.greet;\ng()", who: "undefined", why: "Detached: a plain call, so this is undefined in strict mode." },
  { code: "ada.greet.call(bob)", who: "bob", why: "Explicit binding with call." },
  { code: "const b = ada.greet.bind(bob);\nb()", who: "bob", why: "bind returns a function with this locked to bob." },
  { code: "bob.greet = ada.greet;\nbob.greet()", who: "bob", why: "It doesn't matter where the function was written, only how it's called." },
  { code: "ada.greet.bind(bob).call(ada)", who: "bob", why: "A bound function ignores call/apply: bind wins." },
  { code: "[1].map(ada.greet)", who: "undefined", why: "map calls the callback as a plain function (no thisArg given)." },
];

const WHO_LABEL: Record<Who, string> = { ada: "ada", bob: "bob", undefined: "undefined" };

/** Decide what `this` is at each call site, then run them all. */
export function ThisBinderLab({ onSolved }: GoalProps<"all">) {
  const [picks, setPicks] = useState<(Who | null)[]>(CALLS.map(() => null));
  const [ran, setRan] = useState(false);
  const allPicked = picks.every((p) => p !== null);
  const score = picks.filter((p, i) => p === CALLS[i].who).length;

  function run() {
    setRan(true);
    if (picks.every((p, i) => p === CALLS[i].who)) onSolved?.();
  }

  const greet = (w: Who) => (w === "undefined" ? "Hi, undefined" : `Hi, ${w === "ada" ? "Ada" : "Bob"}`);

  return (
    <div>
      <LabHeader title="The this binder" hint="For each call, pick what this will be inside greet. Then run them all. (Strict mode, as in modules and classes.)" />
      <CodeBlock
        lang="js"
        code={`"use strict";
const ada = { name: "Ada", greet() { return "Hi, " + this?.name; } };
const bob = { name: "Bob" };`}
      />
      <div className="mt-3 grid gap-2">
        {CALLS.map((c, i) => {
          const pick = picks[i];
          const right = ran && pick === c.who;
          const wrong = ran && pick !== c.who;
          return (
            <div
              key={c.code}
              className={`grid gap-2 rounded-xl border p-2 sm:grid-cols-[1fr_auto] sm:items-center ${right ? "border-emerald-400/60 bg-emerald-400/5" : wrong ? "border-rose-400/60 bg-rose-400/5" : "border-white/10 bg-slate-950/60"}`}
            >
              <pre className="overflow-x-auto font-mono text-[13px] text-slate-100">{c.code}</pre>
              <div className="flex flex-wrap gap-1">
                {(Object.keys(WHO_LABEL) as Who[]).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => {
                      setPicks((p) => p.map((x, j) => (j === i ? w : x)));
                      setRan(false);
                    }}
                    className={`rounded-lg border px-2 py-1 font-mono text-xs ${pick === w ? "border-fuchsia-400 bg-fuchsia-400/20 text-fuchsia-100" : "border-white/10 text-slate-300 hover:border-white/30"}`}
                  >
                    this = {WHO_LABEL[w]}
                  </button>
                ))}
              </div>
              {ran && (
                <div className="text-xs text-slate-300 sm:col-span-2">
                  <span className="font-mono text-emerald-200">→ &quot;{greet(c.who)}&quot;</span> · {c.why}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={run} disabled={!allPicked} className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-40">
          ▶ Run all
        </button>
        {ran && (
          <span className={`text-sm font-semibold ${score === CALLS.length ? "text-emerald-300" : "text-amber-300"}`}>
            {score}/{CALLS.length} correct{score === CALLS.length && <> <BlockIcon icon="🎉" className="inline-block size-[1.1em] align-[-0.15em]" /></>}
          </span>
        )}
      </div>
    </div>
  );
}

// ───────────── Closure loop lab ─────────────

type Decl = "var" | "let";
type Timing = "sync" | "timeout";

/** Flip var/let and sync/async to see when callbacks share one binding. */
export function LoopClosureLab({ goal, onSolved }: GoalProps<"zero-one-two">) {
  const [decl, setDecl] = useState<Decl>("var");
  const [timing, setTiming] = useState<Timing>("timeout");
  const [out, setOut] = useState<string | null>(null);

  const result = timing === "sync" || decl === "let" ? "0 1 2" : "3 3 3";
  const code =
    timing === "timeout"
      ? `for (${decl} i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}`
      : `for (${decl} i = 0; i < 3; i++) {\n  console.log(i);\n}`;

  function run() {
    setOut(result);
    if (goal === "zero-one-two" && timing === "timeout" && result === "0 1 2") onSolved?.();
  }

  const boxes = decl === "let" ? ["i = 0", "i = 1", "i = 2"] : ["i = 3"];

  return (
    <div>
      <LabHeader title="Closures in a loop" hint="Change the declaration and timing, then run. Watch how many i boxes the callbacks can see." />
      <div className="mb-3 flex flex-wrap gap-2">
        {(["var", "let"] as Decl[]).map((d) => (
          <button key={d} type="button" onClick={() => { setDecl(d); setOut(null); }} className={`rounded-lg border px-3 py-1 font-mono text-sm ${decl === d ? "border-amber-400 bg-amber-400/20 text-amber-100" : "border-white/10 text-slate-300"}`}>
            {d}
          </button>
        ))}
        <span className="w-px bg-white/10" />
        {(["timeout", "sync"] as Timing[]).map((t) => (
          <button key={t} type="button" onClick={() => { setTiming(t); setOut(null); }} className={`rounded-lg border px-3 py-1 text-sm ${timing === t ? "border-sky-400 bg-sky-400/20 text-sky-100" : "border-white/10 text-slate-300"}`}>
            {t === "timeout" ? "log later (setTimeout)" : "log now"}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <CodeBlock code={code} lang="js" />
        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
          <div className="text-xs text-slate-400">{timing === "timeout" ? "Bindings the three callbacks close over when they finally run:" : "Logged during each iteration:"}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(timing === "timeout" ? boxes : ["i = 0", "i = 1", "i = 2"]).map((b) => (
              <span key={b} className="rounded-lg border border-amber-400/50 bg-amber-400/10 px-3 py-2 font-mono text-sm text-amber-100">
                {b}
                {timing === "timeout" && decl === "var" && <span className="ml-1 text-xs text-slate-400">(shared ×3)</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={run} className="rounded-lg bg-reward px-4 py-2 font-semibold text-primary-foreground">
          ▶ Run
        </button>
        {out && <span className="pop-in rounded-lg bg-black/60 px-3 py-1.5 font-mono text-emerald-200">&gt; {out}</span>}
      </div>
      {out && (
        <p className="mt-2 text-sm text-slate-300">
          {timing === "sync"
            ? "Logging during the loop reads i before it changes, so var and let both print 0 1 2."
            : decl === "var"
              ? "var creates one function-scoped i. The callbacks run after the loop ends, when i is 3."
              : "let creates a fresh i for every iteration, so each callback closes over its own value."}
        </p>
      )}
    </div>
  );
}
