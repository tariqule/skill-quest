"use client";

import { useState, type CSSProperties } from "react";
import { CodeBlock, LabHeader, type GoalProps } from "@/components/learn/blocks";
import { js } from "./js";

/** Hands-on labs for the Node.js Interview Quest. */

const btn = "btn-3d rounded-xl px-3 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40";
const edge = (c: string) => ({ "--edge": c }) as CSSProperties;

// ───────────── Event loop: predict, then step through ─────────────

type Kind = "tick" | "micro" | "timer" | "immediate";
type Op = { log: string } | { kind: Kind; label: string; body: Op[] };
type LoopPhase = "main" | "timers" | "poll" | "check" | "done";

interface Scenario {
  id: "basics" | "io" | "nested" | "chain";
  name: string;
  start: "main" | "io";
  code: string;
  body: Op[];
}

const log = (s: string): Op => ({ log: s });
const sched = (kind: Kind, label: string, body: Op[]): Op => ({ kind, label, body });

export const SCENARIOS: Scenario[] = [
  {
    id: "basics",
    name: "The classic",
    start: "main",
    code: js`
      console.log('A');
      setTimeout(() => console.log('B'), 0);
      Promise.resolve().then(() => console.log('C'));
      process.nextTick(() => console.log('D'));
      console.log('E');
    `,
    body: [log("A"), sched("timer", "timeout B", [log("B")]), sched("micro", "then C", [log("C")]), sched("tick", "tick D", [log("D")]), log("E")],
  },
  {
    id: "io",
    name: "Inside an I/O callback",
    start: "io",
    code: js`
      fs.readFile(__filename, () => {
        setTimeout(() => console.log('timeout'), 0);
        setImmediate(() => console.log('immediate'));
        process.nextTick(() => console.log('tick'));
        console.log('io');
      });
    `,
    body: [
      sched("timer", "timeout cb", [log("timeout")]),
      sched("immediate", "immediate cb", [log("immediate")]),
      sched("tick", "tick cb", [log("tick")]),
      log("io"),
    ],
  },
  {
    id: "nested",
    name: "Ticks between immediates",
    start: "main",
    code: js`
      setImmediate(() => {
        console.log('I1');
        process.nextTick(() => console.log('T'));
      });
      setImmediate(() => console.log('I2'));
      Promise.resolve().then(() => console.log('P'));
      console.log('S');
    `,
    body: [
      sched("immediate", "immediate I1", [log("I1"), sched("tick", "tick T", [log("T")])]),
      sched("immediate", "immediate I2", [log("I2")]),
      sched("micro", "then P", [log("P")]),
      log("S"),
    ],
  },
  {
    id: "chain",
    name: "Promise chain vs nextTick",
    start: "main",
    code: js`
      Promise.resolve()
        .then(() => {
          console.log('1');
          process.nextTick(() => console.log('2'));
        })
        .then(() => console.log('3'));
    `,
    body: [sched("micro", "then #1", [log("1"), sched("tick", "tick 2", [log("2")]), sched("micro", "then #2", [log("3")])])],
  },
];

const QUEUE_NAME: Record<Kind, string> = { tick: "nextTick queue", micro: "microtask queue", timer: "timers queue", immediate: "check queue" };

interface Frame {
  phase: LoopPhase;
  draining: "tick" | "micro" | null;
  running: string | null;
  queues: Record<Kind, string[]>;
  out: string[];
  note: string;
}

/** A small, faithful model of Node's ordering rules for these scenarios. */
export function simulate(s: Scenario): Frame[] {
  const q: Record<Kind, { label: string; body: Op[] }[]> = { tick: [], micro: [], timer: [], immediate: [] };
  const out: string[] = [];
  const frames: Frame[] = [];
  let phase: LoopPhase = s.start === "main" ? "main" : "poll";
  let draining: Frame["draining"] = null;

  const snap = (running: string | null, note: string) =>
    frames.push({
      phase,
      draining,
      running,
      note,
      out: [...out],
      queues: { tick: q.tick.map((c) => c.label), micro: q.micro.map((c) => c.label), timer: q.timer.map((c) => c.label), immediate: q.immediate.map((c) => c.label) },
    });

  const run = (label: string, body: Op[]) => {
    for (const op of body) {
      if ("log" in op) {
        out.push(op.log);
        snap(label, `${label} logs '${op.log}'.`);
      } else {
        q[op.kind].push({ label: op.label, body: op.body });
        snap(label, `${label} queues "${op.label}" on the ${QUEUE_NAME[op.kind]}.`);
      }
    }
  };

  const drain = () => {
    while (q.tick.length || q.micro.length) {
      while (q.tick.length) {
        draining = "tick";
        const cb = q.tick.shift()!;
        snap(cb.label, `Drain the nextTick queue first: run "${cb.label}".`);
        run(cb.label, cb.body);
      }
      while (q.micro.length) {
        draining = "micro";
        const cb = q.micro.shift()!;
        snap(cb.label, `nextTick queue is empty, so drain promise microtasks: run "${cb.label}".`);
        run(cb.label, cb.body);
      }
    }
    draining = null;
  };

  const startLabel = s.start === "main" ? "main script" : "I/O callback";
  snap(null, s.start === "main" ? "Node runs the whole script synchronously first." : "The file read finished, so its callback runs in the poll phase.");
  run(startLabel, s.body);
  snap(null, `${startLabel} finished. The call stack is empty.`);
  drain();

  const cycle: LoopPhase[] = ["timers", "poll", "check"];
  let i = s.start === "main" ? 0 : 2;
  for (let guard = 0; (q.timer.length || q.immediate.length) && guard < 12; guard++, i = (i + 1) % cycle.length) {
    phase = cycle[i];
    const batch = phase === "timers" ? q.timer.splice(0) : phase === "check" ? q.immediate.splice(0) : [];
    if (!batch.length) continue;
    snap(null, phase === "timers" ? "Timers phase: run expired timer callbacks." : "Check phase: run setImmediate callbacks.");
    for (const cb of batch) {
      snap(cb.label, `Run "${cb.label}".`);
      run(cb.label, cb.body);
      drain();
    }
  }
  phase = "done";
  snap(null, "Every queue is empty and nothing is pending, so the process exits.");
  return frames;
}

function logsInCodeOrder(body: Op[]): string[] {
  return body.flatMap((op) => ("log" in op ? [op.log] : logsInCodeOrder(op.body)));
}

const PHASE_STRIP: { id: LoopPhase; label: string }[] = [
  { id: "main", label: "Main script" },
  { id: "timers", label: "⏰ Timers" },
  { id: "poll", label: "📥 Poll" },
  { id: "check", label: "✅ Check" },
  { id: "done", label: "🏁 Exit" },
];

export function EventLoopLab({ goal, onSolved }: GoalProps<"basics" | "io" | "nested" | "chain">) {
  const [sid, setSid] = useState<Scenario["id"]>(goal ?? "basics");
  const [guess, setGuess] = useState<string[]>([]);
  const [verdict, setVerdict] = useState<"right" | "wrong" | null>(null);
  const [step, setStep] = useState(0);

  const scenario = SCENARIOS.find((s) => s.id === sid)!;
  const frames = simulate(scenario);
  const expected = frames[frames.length - 1].out;
  const chips = logsInCodeOrder(scenario.body);
  const frame = frames[Math.min(step, frames.length - 1)];

  function pick(id: Scenario["id"]) {
    setSid(id);
    setGuess([]);
    setVerdict(null);
    setStep(0);
  }

  function check() {
    const ok = guess.join(" ") === expected.join(" ");
    setVerdict(ok ? "right" : "wrong");
    if (ok && (!goal || goal === sid)) onSolved?.();
  }

  const remaining = chips.filter((c) => !guess.includes(c));

  return (
    <div>
      <LabHeader title="Event loop: predict the output" hint="Tap the logs in the order you think they print, check, then step through the queues to see why." />
      <div className="mb-3 flex flex-wrap gap-1.5">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => pick(s.id)}
            className={`rounded-full border px-3 py-1 text-xs font-bold ${sid === s.id ? "border-emerald-400 bg-emerald-400/20 text-emerald-100" : "border-white/10 text-slate-300"}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid content-start gap-3">
          <CodeBlock code={scenario.code} lang={scenario.start === "main" ? "js · CommonJS main script" : "js · CommonJS"} />
          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Your prediction</div>
            <div className="mt-2 flex min-h-9 flex-wrap gap-1.5">
              {guess.length === 0 && <span className="text-sm text-slate-500">Tap the logs below in order…</span>}
              {guess.map((g, i) => (
                <span key={i} className="pop-in rounded-md bg-emerald-400/20 px-2 py-1 font-mono text-sm text-emerald-100">
                  {g}
                </span>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {remaining.map((c, i) => (
                <button
                  key={`${c}-${i}`}
                  type="button"
                  onClick={() => {
                    setGuess([...guess, c]);
                    setVerdict(null);
                  }}
                  className={`${btn} bg-slate-700 font-mono text-white`}
                  style={edge("#0f172a")}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" disabled={guess.length !== chips.length} onClick={check} className={`${btn} bg-emerald-400 text-slate-950`} style={edge("#166534")}>
                Check
              </button>
              <button
                type="button"
                disabled={!guess.length}
                onClick={() => {
                  setGuess([]);
                  setVerdict(null);
                }}
                className={`${btn} bg-slate-800 text-slate-300`}
                style={edge("#020617")}
              >
                Clear
              </button>
            </div>
            {verdict === "right" && <div className="pop-in mt-2 text-sm font-semibold text-emerald-300">✅ Exactly right: {expected.join(" ")}</div>}
            {verdict === "wrong" && <div className="pop-in mt-2 text-sm font-semibold text-rose-300">❌ Not quite. Step through the loop to see the real order, then try again.</div>}
          </div>
        </div>

        <div className="grid content-start gap-3">
          <div className="flex flex-wrap gap-1">
            {PHASE_STRIP.map((p) => (
              <span
                key={p.id}
                className={`rounded-md px-2 py-1 text-xs font-bold ${frame.phase === p.id ? "bg-emerald-400 text-slate-950" : "bg-white/5 text-slate-400"}`}
              >
                {p.label}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["tick", "micro", "timer", "immediate"] as Kind[]).map((k) => (
              <div
                key={k}
                className={`rounded-lg border p-2 ${frame.draining === k ? "border-amber-400 bg-amber-400/10" : "border-white/10 bg-slate-950/60"}`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{QUEUE_NAME[k]}</div>
                <div className="mt-1 flex min-h-6 flex-wrap gap-1">
                  {frame.queues[k].map((l, i) => (
                    <span key={`${l}-${i}`} className="rounded bg-sky-400/20 px-1.5 py-0.5 font-mono text-[11px] text-sky-100">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-950/60 p-2 text-sm">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Call stack</div>
            <div className="mt-1 font-mono text-violet-200">{frame.running ?? "(empty)"}</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/60 p-2 font-mono text-sm text-emerald-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Console</div>
            {frame.out.length ? frame.out.join(" ") : <span className="text-slate-600">…</span>}
          </div>
          <p className="text-sm text-slate-300">{frame.note}</p>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)} className={`${btn} bg-slate-800 text-slate-300`} style={edge("#020617")}>
              ◀ Back
            </button>
            <button
              type="button"
              disabled={step >= frames.length - 1}
              onClick={() => setStep(step + 1)}
              className={`${btn} bg-sky-400 text-slate-950`}
              style={edge("#075985")}
            >
              Step ▶
            </button>
            <button type="button" onClick={() => setStep(frames.length - 1)} className={`${btn} bg-slate-700 text-white`} style={edge("#0f172a")}>
              Run all
            </button>
            <span className="text-xs text-slate-500">
              {Math.min(step, frames.length - 1) + 1} / {frames.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────── Stream backpressure simulator ─────────────

const TOTAL = 60;
const LIMIT = 40;

interface Tick {
  peak: number;
  paused: boolean;
}

interface Run {
  ticks: Tick[];
  events: string[];
  crashed: boolean;
  delivered: number;
  pauses: number;
  drains: number;
  maxBuffer: number;
}

export function simulateStream(producer: number, consumer: number, hwm: number, respect: boolean): Run {
  let buffer = 0;
  let sent = 0;
  let delivered = 0;
  let paused = false;
  let warned = false;
  let pauses = 0;
  let drains = 0;
  let maxBuffer = 0;
  const ticks: Tick[] = [];
  const events: string[] = [];

  for (let t = 1; t <= 300 && delivered < TOTAL; t++) {
    if (!paused) {
      for (let i = 0; i < producer && sent < TOTAL; i++) {
        buffer++;
        sent++;
        if (buffer >= hwm) {
          if (respect) {
            paused = true;
            pauses++;
            if (pauses <= 3) events.push(`t${t}: write() returned false at ${buffer} chunks, so the producer pauses`);
            break;
          } else if (!warned) {
            warned = true;
            events.push(`t${t}: write() returned false at ${buffer} chunks… and the loop keeps writing anyway`);
          }
        }
      }
    }
    maxBuffer = Math.max(maxBuffer, buffer);
    ticks.push({ peak: buffer, paused });
    if (buffer > LIMIT) {
      events.push(`t${t}: ${buffer} chunks buffered > ${LIMIT} 💥 FATAL ERROR: JavaScript heap out of memory`);
      return { ticks, events, crashed: true, delivered, pauses, drains, maxBuffer };
    }
    const take = Math.min(consumer, buffer);
    buffer -= take;
    delivered += take;
    if (paused && buffer === 0) {
      paused = false;
      drains++;
      if (drains <= 3) events.push(`t${t}: buffer is empty, so 'drain' fires and the producer resumes`);
    }
  }
  events.push(`Done: all ${TOTAL} chunks delivered.`);
  return { ticks, events, crashed: false, delivered, pauses, drains, maxBuffer };
}

function Slider({ label, value, min, max, onChange, note, accent }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; note: string; accent: string }) {
  return (
    <label className="block rounded-xl border border-white/10 bg-slate-950/60 p-3">
      <div className="flex items-baseline justify-between">
        <span className="font-semibold text-white">{label}</span>
        <span className="font-mono text-sm text-slate-200">{value}</span>
      </div>
      <input type="range" min={min} max={max} step={1} value={value} onChange={(e) => onChange(Number(e.target.value))} className={`mt-1 w-full ${accent}`} aria-label={label} />
      <div className="text-xs text-slate-400">{note}</div>
    </label>
  );
}

export function BackpressureLab({ goal, onSolved }: GoalProps<"crash" | "tame">) {
  const [producer, setProducer] = useState(goal === "crash" ? 3 : 6);
  const [consumer, setConsumer] = useState(goal === "crash" ? 3 : 2);
  const [hwm, setHwm] = useState(8);
  const [respect, setRespect] = useState(goal === "crash");
  const [run, setRun] = useState<Run | null>(null);

  const change = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setRun(null);
  };

  function go() {
    const r = simulateStream(producer, consumer, hwm, respect);
    setRun(r);
    if (goal === "crash" && r.crashed) onSolved?.();
    if (goal === "tame" && !r.crashed && respect && producer > consumer && r.delivered === TOTAL) onSolved?.();
  }

  return (
    <div>
      <LabHeader title="Backpressure simulator" hint="A fast producer writes to a slow consumer. Ignore write()'s return value and the buffer grows until the heap gives up." />
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="grid content-start gap-2">
          <Slider label="🚰 Producer" value={producer} min={1} max={8} onChange={change(setProducer)} note="Chunks it tries to write per tick" accent="accent-sky-400" />
          <Slider label="🐢 Consumer" value={consumer} min={1} max={8} onChange={change(setConsumer)} note="Chunks the destination drains per tick" accent="accent-emerald-400" />
          <Slider label="🌊 highWaterMark" value={hwm} min={2} max={16} onChange={change(setHwm)} note="write() returns false once this many are buffered" accent="accent-violet-400" />
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-200">
            <input type="checkbox" checked={respect} onChange={(e) => change(setRespect)(e.target.checked)} className="accent-emerald-400" />
            Respect backpressure (stop on <span className="font-mono">false</span>, resume on <span className="font-mono">&apos;drain&apos;</span>)
          </label>
          <CodeBlock
            lang="js"
            code={
              respect
                ? js`
                    function writeMore() {
                      while (hasMore()) {
                        if (!out.write(next())) {
                          out.once('drain', writeMore);
                          return;
                        }
                      }
                    }
                  `
                : js`
                    while (hasMore()) {
                      out.write(next()); // return value ignored
                    }
                  `
            }
          />
          <button type="button" onClick={go} className={`${btn} bg-sky-400 text-slate-950`} style={edge("#075985")}>
            ▶ Stream {TOTAL} chunks
          </button>
        </div>

        <div className="grid content-start gap-3">
          <div className="relative h-44 rounded-xl border border-white/10 bg-slate-950/60">
            <div className="absolute inset-2">
              <div className="absolute inset-x-0 border-t-2 border-dashed border-rose-400/70" style={{ bottom: "95%" }}>
                <span className="absolute -top-4 right-0 text-[10px] font-bold text-rose-300">heap limit ({LIMIT})</span>
              </div>
              <div className="absolute inset-x-0 border-t-2 border-dashed border-violet-400/70" style={{ bottom: `${(hwm / LIMIT) * 95}%` }}>
                <span className="absolute -top-4 left-0 text-[10px] font-bold text-violet-300">highWaterMark ({hwm})</span>
              </div>
              <div className="flex h-full items-end gap-px">
                {run?.ticks.map((t, i) => {
                  const h = Math.min(t.peak / LIMIT, 1.05);
                  const color = t.peak > LIMIT ? "bg-rose-500" : t.peak >= hwm ? "bg-amber-400" : "bg-emerald-400";
                  return <div key={i} className={`min-w-0 flex-1 rounded-t-sm ${color} ${t.paused ? "opacity-60" : ""}`} style={{ height: `${h * 95}%` }} />;
                })}
                {!run && <div className="m-auto text-sm text-slate-500">Buffered chunks per tick appear here</div>}
              </div>
            </div>
          </div>
          {run && (
            <div className="pop-in grid gap-2">
              <div className="grid grid-cols-2 gap-2 text-center text-sm sm:grid-cols-4">
                {[
                  ["Peak buffer", String(run.maxBuffer)],
                  ["Delivered", `${run.delivered}/${TOTAL}`],
                  ["Pauses", String(run.pauses)],
                  ["Drains", String(run.drains)],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-white/10 bg-slate-950/60 p-2">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">{k}</div>
                    <div className="font-mono font-bold text-white">{v}</div>
                  </div>
                ))}
              </div>
              <div className={`rounded-lg px-3 py-2 text-sm font-semibold ${run.crashed ? "bg-rose-500/15 text-rose-200" : "bg-emerald-400/15 text-emerald-200"}`}>
                {run.crashed ? "💥 The process ran out of memory. Every ignored false let the buffer grow." : "✅ Finished with bounded memory."}
              </div>
              <ul className="grid gap-1 font-mono text-xs text-slate-300">
                {run.events.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
