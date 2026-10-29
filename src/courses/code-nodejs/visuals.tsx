"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/learn/blocks";
import { js } from "./js";

/** Concept diagrams for the Node.js Interview Quest. */

// ───────────── Event loop phases ─────────────

const PHASES = [
  { id: "timers", icon: "⏰", name: "Timers", text: "Runs setTimeout and setInterval callbacks whose delay has passed. A delay is a minimum, never an exact time." },
  { id: "pending", icon: "📮", name: "Pending callbacks", text: "Some system-level callbacks deferred from the previous iteration, such as certain TCP errors." },
  { id: "idle", icon: "🔧", name: "Idle / prepare", text: "Used internally by Node and libuv. Your code never runs here." },
  { id: "poll", icon: "📥", name: "Poll", text: "Waits for new I/O events and runs their callbacks: a file read finished, a socket has data, a connection arrived. If nothing is queued, the loop may wait here." },
  { id: "check", icon: "✅", name: "Check", text: "Runs setImmediate callbacks, right after poll. That's why setImmediate inside an I/O callback always beats setTimeout(fn, 0)." },
  { id: "close", icon: "🚪", name: "Close callbacks", text: "Runs 'close' handlers, such as socket.on('close')." },
] as const;

export function LoopPhases() {
  const [sel, setSel] = useState<number>(3);
  const p = PHASES[sel];
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {PHASES.map((ph, i) => (
          <button
            key={ph.id}
            type="button"
            onClick={() => setSel(i)}
            className="relative rounded-xl border bg-slate-950/60 p-3 text-left transition hover:-translate-y-0.5"
            style={{ borderColor: sel === i ? "#5fa04e" : "rgb(255 255 255 / 0.1)", boxShadow: sel === i ? "0 0 0 3px #5fa04e33" : undefined }}
          >
            <span className="absolute right-2 top-1.5 font-mono text-[10px] text-slate-500">{i + 1}</span>
            <div className="text-xl">{ph.icon}</div>
            <div className="mt-1 text-sm font-semibold text-white">{ph.name}</div>
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3">
        <div className="font-bold text-emerald-200">
          {p.icon} {p.name}
        </div>
        <p className="mt-1 text-sm text-slate-200">{p.text}</p>
      </div>
      <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
        ⚡ Between every callback, in every phase, Node empties the <b>process.nextTick queue</b> first and then the <b>promise microtask queue</b>. Then
        the loop moves on. ↺ After close callbacks it goes back to timers, and exits when nothing is left to wait for.
      </div>
      <p className="text-xs text-slate-500">Tap a phase.</p>
    </div>
  );
}

// ───────────── Middleware chain ─────────────

type Step = { id: string; code: string; label: string };
const CHAIN: Step[] = [
  { id: "log", code: "app.use(logger)", label: "Logger" },
  { id: "json", code: "app.use(express.json())", label: "Body parser" },
  { id: "auth", code: "app.use(requireAuth)", label: "Auth" },
  { id: "route", code: "app.get('/orders', listOrders)", label: "Route handler" },
  { id: "404", code: "app.use(notFound)", label: "404 handler" },
  { id: "err", code: "app.use((err, req, res, next) => …)", label: "Error handler" },
];

type Status = "ran" | "responded" | "skipped" | "idle";

function walk(loggedIn: boolean, routeExists: boolean, throws: boolean): { status: Record<string, Status>; result: string } {
  const status: Record<string, Status> = Object.fromEntries(CHAIN.map((s) => [s.id, "idle"]));
  status.log = "ran";
  status.json = "ran";
  if (!loggedIn) {
    status.auth = "responded";
    for (const id of ["route", "404", "err"]) status[id] = "skipped";
    return { status, result: "401 Unauthorized: auth sent a response and never called next()" };
  }
  status.auth = "ran";
  if (!routeExists) {
    status.route = "skipped";
    status["404"] = "responded";
    status.err = "skipped";
    return { status, result: "404 Not Found: no route matched, so the request fell through to the catch-all" };
  }
  if (throws) {
    status.route = "ran";
    status["404"] = "skipped";
    status.err = "responded";
    return { status, result: "500: next(err) skipped every normal middleware and jumped to the 4-argument error handler" };
  }
  status.route = "responded";
  status["404"] = "skipped";
  status.err = "skipped";
  return { status, result: "200 OK: the route handler responded, so nothing after it runs" };
}

export function MiddlewareChain() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [routeExists, setRouteExists] = useState(true);
  const [throws, setThrows] = useState(false);
  const [sent, setSent] = useState(false);
  const { status, result } = walk(loggedIn, routeExists, throws);

  const toggle = (set: (v: boolean) => void, v: boolean) => {
    set(v);
    setSent(false);
  };

  const style: Record<Status, string> = {
    ran: "border-sky-400/50 bg-sky-400/10 text-sky-100",
    responded: "border-emerald-400/60 bg-emerald-400/15 text-emerald-100",
    skipped: "border-white/5 bg-slate-950/40 text-slate-500 line-through",
    idle: "border-white/10 bg-slate-950/60 text-slate-300",
  };
  const badge: Record<Status, string> = { ran: "next() →", responded: "📤 responds", skipped: "skipped", idle: "" };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2 text-sm">
        {[
          ["🔑 Logged in", loggedIn, setLoggedIn],
          ["🗺️ Route /orders exists", routeExists, setRouteExists],
          ["💥 Handler throws", throws, setThrows],
        ].map(([label, v, set]) => (
          <label key={label as string} className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-1.5 text-slate-200">
            <input type="checkbox" checked={v as boolean} onChange={(e) => toggle(set as (v: boolean) => void, e.target.checked)} className="accent-emerald-400" />
            {label as string}
          </label>
        ))}
        <button
          type="button"
          onClick={() => setSent(true)}
          className="btn-3d rounded-xl bg-emerald-400 px-4 py-1.5 font-bold text-slate-950"
          style={{ "--edge": "#166534" } as React.CSSProperties}
        >
          Send GET /orders
        </button>
      </div>
      <div className="grid gap-1.5">
        {CHAIN.map((s, i) => {
          const st: Status = sent ? status[s.id] : "idle";
          return (
            <div key={s.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition ${style[st]}`}>
              <span className="w-5 text-center font-mono text-xs text-slate-500">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="font-semibold">{s.label}</span>
                <span className="ml-2 font-mono text-xs opacity-80">{s.code}</span>
              </span>
              {st !== "idle" && <span className="shrink-0 text-xs font-bold">{badge[st]}</span>}
            </div>
          );
        })}
      </div>
      {sent ? (
        <div className="pop-in rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-100">{result}</div>
      ) : (
        <p className="text-xs text-slate-500">Set the switches, then send the request. Middleware runs top to bottom, in registration order.</p>
      )}
    </div>
  );
}

// ───────────── Small code visuals reused in lessons ─────────────

export function NextTickVsPromise() {
  return (
    <CodeBlock
      lang="js"
      caption="CommonJS script. Sync code first, then the nextTick queue, then promise microtasks, then the loop phases."
      code={js`
        console.log('A');                               // 1. sync
        setTimeout(() => console.log('B'), 0);          // 5. timers phase
        Promise.resolve().then(() => console.log('C')); // 4. microtask
        process.nextTick(() => console.log('D'));       // 3. nextTick queue
        console.log('E');                               // 2. sync
        // A E D C B
      `}
    />
  );
}
