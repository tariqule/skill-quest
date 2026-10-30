"use client";

import { useState } from "react";
import { CodeBlock, LabHeader, type GoalProps } from "@/components/learn/blocks";

// ───────────── Re-render counter ─────────────

type Comp = "App" | "Header" | "Counter" | "Sidebar";
const TREE: { name: Comp; depth: number; note: string }[] = [
  { name: "App", depth: 0, note: "page root" },
  { name: "Header", depth: 1, note: "static title" },
  { name: "Counter", depth: 1, note: "shows the count and a button" },
  { name: "Sidebar", depth: 1, note: "receives a style prop" },
];

/** Which components React calls when the +1 button is clicked, given where state lives and what is memoized. */
function renderedOnClick(stateIn: "App" | "Counter", memoHeader: boolean, memoSidebar: boolean, stableStyle: boolean): Set<Comp> {
  if (stateIn === "Counter") return new Set<Comp>(["Counter"]);
  const out = new Set<Comp>(["App", "Counter"]);
  if (!memoHeader) out.add("Header");
  if (!(memoSidebar && stableStyle)) out.add("Sidebar");
  return out;
}

function why(c: Comp, stateIn: "App" | "Counter", memoHeader: boolean, memoSidebar: boolean, stableStyle: boolean, rendered: boolean) {
  if (stateIn === "Counter") return c === "Counter" ? "owns the state that changed" : "its parent didn't render, so it's untouched";
  if (c === "App") return "owns the state that changed";
  if (c === "Counter") return "gets the new count as a prop";
  if (c === "Header") return memoHeader ? "memo: props unchanged, skipped" : "parent rendered, so it renders too";
  if (!rendered) return "memo: same style object, skipped";
  return memoSidebar ? "memo, but the inline style is a new object every render" : "parent rendered, so it renders too";
}

/**
 * A pretend component tree. Move state and toggle memo, then press +1 to see
 * which components React calls. Goals: "isolate" (only Counter renders) and
 * "memo" (state must stay in App; only App and Counter may render).
 */
export function RenderCounterLab({ goal, onSolved }: GoalProps<"isolate" | "memo">) {
  const [stateIn, setStateIn] = useState<"App" | "Counter">("App");
  const [memoHeader, setMemoHeader] = useState(false);
  const [memoSidebar, setMemoSidebar] = useState(false);
  const [stableStyle, setStableStyle] = useState(false);
  const [counts, setCounts] = useState<Record<Comp, number>>({ App: 1, Header: 1, Counter: 1, Sidebar: 1 });
  const [last, setLast] = useState<Set<Comp>>(new Set());
  const [clicks, setClicks] = useState(0);
  const [count, setCount] = useState(0);
  const lockState = goal === "memo";
  const effectiveStateIn = lockState ? "App" : stateIn;

  function reset() {
    setCounts({ App: 1, Header: 1, Counter: 1, Sidebar: 1 });
    setLast(new Set());
    setClicks(0);
  }

  function change(fn: () => void) {
    fn();
    reset();
  }

  function click() {
    const r = renderedOnClick(effectiveStateIn, memoHeader, memoSidebar, stableStyle);
    setCounts((c) => {
      const next = { ...c };
      for (const n of r) next[n] += 1;
      return next;
    });
    setLast(r);
    setClicks((n) => n + 1);
    setCount((n) => n + 1);
    if (goal === "isolate" && r.size === 1 && r.has("Counter")) onSolved?.();
    if (goal === "memo" && r.size === 2 && r.has("App") && r.has("Counter")) onSolved?.();
  }

  const appCode =
    effectiveStateIn === "App"
      ? `function App() {
  const [count, setCount] = useState(0)${stableStyle ? `\n  const style = useMemo(() => ({ width: 240 }), [])` : ""}
  return (<>
    <Header />
    <Counter count={count} onAdd={() => setCount(count + 1)} />
    <Sidebar style={${stableStyle ? "style" : "{{ width: 240 }}"}} />
  </>)
}`
      : `function App() {${stableStyle ? `\n  const style = useMemo(() => ({ width: 240 }), [])` : ""}
  return (<>
    <Header />
    <Counter />   {/* owns its own count */}
    <Sidebar style={${stableStyle ? "style" : "{{ width: 240 }}"}} />
  </>)
}`;
  const memoCode = [memoHeader && "const Header = memo(function Header() { … })", memoSidebar && "const Sidebar = memo(function Sidebar({ style }) { … })"]
    .filter(Boolean)
    .join("\n");

  return (
    <div>
      <LabHeader
        title="Re-render counter"
        hint="Move the state and toggle memo, then press +1. Components that React calls flash and their render count goes up."
      />
      <div className="grid gap-4 md:grid-cols-[1fr_1.1fr]">
        <div className="grid content-start gap-3">
          <fieldset className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
            <legend className="px-1 text-xs font-bold uppercase tracking-wider text-slate-400">Where does `count` live?</legend>
            <div className="flex flex-wrap gap-2">
              {(["App", "Counter"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={lockState && s === "Counter"}
                  onClick={() => change(() => setStateIn(s))}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    effectiveStateIn === s ? "bg-sky-400 text-slate-950" : "bg-white/10 text-slate-200 hover:bg-white/20"
                  }`}
                >
                  In {s}
                </button>
              ))}
            </div>
            {lockState && <p className="mt-2 text-xs text-amber-300">Locked: for this goal the count must stay in App.</p>}
          </fieldset>
          <fieldset className="grid gap-2 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-200">
            <legend className="px-1 text-xs font-bold uppercase tracking-wider text-slate-400">Optimisations</legend>
            <Toggle label="Wrap Header in memo()" on={memoHeader} set={(v) => change(() => setMemoHeader(v))} />
            <Toggle label="Wrap Sidebar in memo()" on={memoSidebar} set={(v) => change(() => setMemoSidebar(v))} />
            <Toggle label="Give Sidebar a stable style (useMemo)" on={stableStyle} set={(v) => change(() => setStableStyle(v))} />
          </fieldset>
          <button
            type="button"
            onClick={click}
            className="rounded-xl bg-gradient-to-r from-sky-400 to-cyan-300 px-4 py-2.5 font-black text-slate-950 shadow transition hover:-translate-y-0.5"
          >
            +1 (count is {count})
          </button>
        </div>
        <div className="grid content-start gap-2">
          {TREE.map((n) => {
            const hit = last.has(n.name);
            return (
              <div
                key={`${n.name}-${hit ? clicks : "idle"}`}
                className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 transition ${
                  hit ? "animate-pulse border-rose-400/70 bg-rose-500/15" : "border-white/10 bg-slate-950/60"
                }`}
                style={{ marginLeft: `${n.depth * 1.5}rem` }}
              >
                <div className="min-w-0">
                  <div className="font-mono text-sm font-bold text-white">
                    {"<"}
                    {n.name}
                    {" />"}
                  </div>
                  <div className="text-xs text-slate-400">
                    {clicks > 0 ? why(n.name, effectiveStateIn, memoHeader, memoSidebar, stableStyle, hit) : n.note}
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-xs ${hit ? "bg-rose-400 text-slate-950" : "bg-white/10 text-slate-300"}`}>
                  renders: {counts[n.name]}
                </span>
              </div>
            );
          })}
          <div className="text-xs text-slate-400" aria-live="polite">
            {clicks === 0 ? "Press +1 to see who re-renders." : `Last click re-rendered ${last.size} component${last.size === 1 ? "" : "s"}.`}
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <CodeBlock lang="jsx" code={appCode} />
        {memoCode ? <CodeBlock lang="jsx" code={memoCode} /> : <CodeBlock lang="jsx" code={"// no memo yet: every child renders\n// whenever its parent renders"} />}
      </div>
    </div>
  );
}

function Toggle({ label, on, set }: { label: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span>{label}</span>
      <input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} className="h-4 w-4 accent-sky-400" />
    </label>
  );
}

// ───────────── useEffect dependency lab ─────────────

type Deps = "none" | "empty" | "userId";
interface Fetch {
  seq: number;
  userId: number;
  ignored: boolean;
}
interface Sim {
  userId: number;
  shown: number | null;
  runs: number;
  changes: number;
  rerenders: number;
  pending: Fetch[];
  seq: number;
  /** Highest request number that has already resolved. */
  maxResolved: number;
  outOfOrder: boolean;
  log: string[];
}

const NAMES = ["", "Ada", "Grace", "Linus"];

function mount(): Sim {
  return { userId: 1, shown: null, runs: 1, changes: 0, rerenders: 0, pending: [{ seq: 1, userId: 1, ignored: false }], seq: 1, maxResolved: 0, outOfOrder: false, log: ["mount → effect runs: fetchUser(1)"] };
}

/** Run cleanup for the previous effect, then the effect again, as React does when deps change. */
function rerun(s: Sim, cleanup: boolean, reason: string): Sim {
  const pending = cleanup ? s.pending.map((f) => ({ ...f, ignored: true })) : s.pending;
  const seq = s.seq + 1;
  const log = [...s.log, `${reason} → ${cleanup ? "cleanup (ignore = true), then " : ""}effect runs: fetchUser(${s.userId})`];
  return { ...s, pending: [...pending, { seq, userId: s.userId, ignored: false }], seq, runs: s.runs + 1, log };
}

/**
 * A step-through simulator of `useEffect(() => { fetchUser(userId)… }, DEPS)`.
 * Goals: "sync" (the effect runs exactly once per userId change and the screen
 * matches the prop) and "race" (resolve an old request last and still show the right user).
 */
export function EffectDepsLab({ goal, onSolved }: GoalProps<"sync" | "race">) {
  const [deps, setDeps] = useState<Deps>(goal === "race" ? "userId" : "empty");
  const [cleanup, setCleanup] = useState(goal !== "race");
  const [sim, setSim] = useState<Sim>(mount);

  function restart(nextDeps: Deps, nextCleanup: boolean) {
    setDeps(nextDeps);
    setCleanup(nextCleanup);
    setSim(mount());
  }

  function parentRender() {
    setSim((s) => {
      const base = { ...s, rerenders: s.rerenders + 1 };
      return deps === "none" ? rerun(base, cleanup, "parent re-render") : { ...base, log: [...s.log, "parent re-render → deps unchanged, effect skipped"] };
    });
  }

  function changeUser() {
    setSim((s) => {
      const userId = (s.userId % 3) + 1;
      const base = { ...s, userId, changes: s.changes + 1 };
      if (deps === "empty") return { ...base, log: [...s.log, `userId → ${userId} → [] never changes, effect skipped`] };
      return rerun(base, cleanup, `userId → ${userId}`);
    });
  }

  function resolve(f: Fetch) {
    const late = f.seq < sim.maxResolved;
    const outOfOrder = sim.outOfOrder || late;
    const shown = f.ignored ? sim.shown : f.userId;
    const pending = sim.pending.filter((p) => p.seq !== f.seq);
    const line = f.ignored ? `request #${f.seq} (user ${f.userId}) resolves → ignored` : `request #${f.seq} (user ${f.userId}) resolves → setUser(${NAMES[f.userId]})`;
    const next: Sim = { ...sim, shown, pending, outOfOrder, maxResolved: Math.max(sim.maxResolved, f.seq), log: [...sim.log, line + (late ? " (arrived late!)" : "")] };
    setSim(next);
    if (pending.length > 0 || next.shown !== next.userId) return;
    if (goal === "sync" && next.changes >= 1 && next.rerenders >= 1 && next.runs === 1 + next.changes) onSolved?.();
    if (goal === "race" && next.changes >= 1 && next.outOfOrder) onSolved?.();
  }

  const depsCode = deps === "none" ? "" : deps === "empty" ? ", []" : ", [userId]";
  const inSync = sim.shown === sim.userId;
  const wasted = sim.runs - 1 - (deps === "empty" ? 0 : sim.changes);

  return (
    <div>
      <LabHeader
        title="useEffect dependency lab"
        hint="Pick the dependency array and cleanup, then step through events. Resolve network requests in any order you like."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid content-start gap-3">
          <CodeBlock
            lang="jsx"
            code={`function Profile({ userId }) {
  const [user, setUser] = useState(null)
  useEffect(() => {${cleanup ? "\n    let ignore = false" : ""}
    fetchUser(userId).then((u) => {
      ${cleanup ? "if (!ignore) setUser(u)" : "setUser(u)"}
    })${cleanup ? "\n    return () => { ignore = true }" : ""}
  }${depsCode})
  return <h2>{user?.name}</h2>
}`}
          />
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["none", "no array"],
                ["empty", "[]"],
                ["userId", "[userId]"],
              ] as const
            ).map(([d, label]) => (
              <button
                key={d}
                type="button"
                onClick={() => restart(d, cleanup)}
                className={`rounded-lg px-3 py-1.5 font-mono text-sm font-semibold transition ${deps === d ? "bg-violet-400 text-slate-950" : "bg-white/10 text-slate-200 hover:bg-white/20"}`}
              >
                {label}
              </button>
            ))}
            <label className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-sm text-slate-200">
              <input type="checkbox" checked={cleanup} onChange={(e) => restart(deps, e.target.checked)} className="accent-violet-400" />
              cleanup with `ignore`
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={parentRender} className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold text-slate-100 hover:bg-white/20">
              🔁 Parent re-renders
            </button>
            <button type="button" onClick={changeUser} className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold text-slate-100 hover:bg-white/20">
              👤 Change userId
            </button>
            <button type="button" onClick={() => setSim(mount())} className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/15">
              ↺ Remount
            </button>
          </div>
        </div>
        <div className="grid content-start gap-3">
          <div className={`rounded-xl border p-3 ${inSync ? "border-emerald-400/50 bg-emerald-500/10" : "border-rose-400/50 bg-rose-500/10"}`}>
            <div className="text-xs text-slate-400">
              prop <span className="font-mono text-slate-200">userId = {sim.userId}</span> · screen shows
            </div>
            <div className="text-2xl font-black text-white">{sim.shown ? NAMES[sim.shown] : "…loading"}</div>
            <div className={`text-xs font-semibold ${inSync ? "text-emerald-300" : "text-rose-300"}`}>
              {inSync ? "✔ in sync with the prop" : sim.shown === null ? "waiting for the first request" : `✖ stale: showing user ${sim.shown}`}
            </div>
            <div className="mt-2 font-mono text-xs text-slate-300">
              effect runs: {sim.runs} {wasted > 0 && <span className="text-amber-300">({wasted} wasted)</span>}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Network (tap to resolve)</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {sim.pending.length === 0 && <span className="text-sm text-slate-500">No requests in flight</span>}
              {sim.pending.map((f) => (
                <button
                  key={f.seq}
                  type="button"
                  onClick={() => resolve(f)}
                  className={`rounded-lg border px-2.5 py-1 font-mono text-xs transition hover:-translate-y-0.5 ${f.ignored ? "border-slate-500/40 text-slate-400 line-through" : "border-sky-400/60 text-sky-200"}`}
                >
                  #{f.seq} user {f.userId}
                </button>
              ))}
            </div>
          </div>
          <ol className="max-h-40 overflow-y-auto rounded-xl border border-white/10 bg-slate-950/60 p-3 font-mono text-[11px] leading-relaxed text-slate-300">
            {sim.log.map((l, i) => (
              <li key={i}>
                {i + 1}. {l}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
