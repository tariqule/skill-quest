"use client";

import { useState } from "react";

/** Concept diagrams for the System Design track. */

const btn = (on: boolean) =>
  `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${on ? "bg-teal-400 text-slate-950" : "bg-white/10 text-slate-200 hover:bg-white/20"}`;

// ───────────── Latency ladder ─────────────

const LATENCIES: { op: string; ns: number; label: string; note: string }[] = [
  { op: "L1 cache reference", ns: 1, label: "~1 ns", note: "Data already on the CPU core. Effectively free." },
  { op: "Main memory reference", ns: 100, label: "~100 ns", note: "RAM is ~100× slower than L1, still tiny. In-memory caches (Redis, Memcached) live here, plus network time." },
  { op: "SSD random read", ns: 100_000, label: "~100 µs", note: "Order of magnitude for a random read from flash. Databases try hard to serve hot pages from memory instead." },
  { op: "Round trip in one data centre", ns: 500_000, label: "~0.5 ms", note: "Every network hop between services costs about this. Ten sequential calls ≈ 5 ms before any work is done." },
  { op: "Disk seek (spinning HDD)", ns: 10_000_000, label: "~10 ms", note: "Why random I/O on HDDs is avoided and why logs are written sequentially." },
  { op: "Round trip across an ocean", ns: 100_000_000, label: "~100 ms+", note: "Physics: light in fibre needs tens of ms per direction. Only CDNs and regional replicas beat it." },
];

/** "Numbers to know": a log-scale ladder of rough latencies. Tap a row for what it means in a design. */
export function LatencyLadder() {
  const [sel, setSel] = useState(3);
  const max = Math.log10(LATENCIES[LATENCIES.length - 1].ns);
  return (
    <div className="grid gap-2">
      {LATENCIES.map((l, i) => (
        <button
          key={l.op}
          type="button"
          onClick={() => setSel(i)}
          className={`grid grid-cols-[minmax(0,10rem)_1fr_auto] items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-sm ${
            i === sel ? "border-teal-300 bg-teal-300/10" : "border-white/10 bg-slate-950/60"
          }`}
        >
          <span className="truncate text-slate-200">{l.op}</span>
          <span className="h-2.5 rounded-full bg-white/5">
            <span
              className="block h-2.5 rounded-full"
              style={{ width: `${Math.max(3, (Math.log10(l.ns) / max) * 100)}%`, background: `hsl(${170 - i * 30} 70% 55%)` }}
            />
          </span>
          <span className="font-mono text-xs text-slate-300">{l.label}</span>
        </button>
      ))}
      <p className="rounded-lg bg-black/30 p-3 text-sm text-slate-300">{LATENCIES[sel].note}</p>
      <p className="text-[11px] text-slate-500">Log scale. Rough orders of magnitude; exact numbers vary by hardware.</p>
    </div>
  );
}

// ───────────── Cache strategies ─────────────

const STRATEGIES = {
  "cache-aside": {
    read: ["App asks the cache", "Miss → app reads the DB", "App writes the value into the cache (with a TTL)"],
    write: ["App writes the DB", "App deletes the cache key", "Next read repopulates it"],
    good: "Simple, cache holds only what's read, a cache outage only slows things down.",
    bad: "First read after a write or expiry is a miss; stampedes on hot keys.",
  },
  "write-through": {
    read: ["App asks the cache", "Hits are the norm: writes already filled it"],
    write: ["App writes the cache", "Cache synchronously writes the DB", "Ack only after both succeed"],
    good: "Cache never stale for data written through it; reads after writes hit.",
    bad: "Every write pays two writes of latency; cold data fills the cache.",
  },
  "write-back": {
    read: ["App asks the cache", "Hits are the norm"],
    write: ["App writes the cache and gets an ack", "Cache flushes to the DB later, in batches"],
    good: "Lowest write latency, absorbs write bursts, coalesces repeated writes.",
    bad: "Data loss if the cache dies before flushing; harder to reason about.",
  },
} as const;
type Strategy = keyof typeof STRATEGIES;

/** Compare cache-aside, write-through and write-back step by step. */
export function CacheStrategies() {
  const [s, setS] = useState<Strategy>("cache-aside");
  const st = STRATEGIES[s];
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(STRATEGIES) as Strategy[]).map((k) => (
          <button key={k} type="button" onClick={() => setS(k)} className={btn(s === k)}>
            {k}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {(["read", "write"] as const).map((path) => (
          <div key={path} className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-teal-300">{path} path</div>
            <ol className="mt-2 grid gap-1.5 text-sm text-slate-200">
              {st[path].map((step, i) => (
                <li key={step} className="flex gap-2">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-400/20 text-[11px] font-bold text-teal-200">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <div className="grid gap-2 text-sm sm:grid-cols-2">
        <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-100">✅ {st.good}</div>
        <div className="rounded-lg bg-rose-500/10 p-2 text-rose-100">⚠️ {st.bad}</div>
      </div>
    </div>
  );
}

// ───────────── Replication lag ─────────────

/** Write to the primary, then read from a replica: async replication can return the old value until it catches up. */
export function ReplicationVisual() {
  const [sync, setSync] = useState(false);
  const [primary, setPrimary] = useState(1);
  const [replica, setReplica] = useState(1);
  const [read, setRead] = useState<string | null>(null);

  function write() {
    const v = primary + 1;
    setPrimary(v);
    if (sync) setReplica(v);
    setRead(null);
  }
  function mode(next: boolean) {
    setSync(next);
    setPrimary(1);
    setReplica(1);
    setRead(null);
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => mode(false)} className={btn(!sync)}>Async replication</button>
        <button type="button" onClick={() => mode(true)} className={btn(sync)}>Sync replication</button>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
        <div className="rounded-xl border border-teal-300/50 bg-teal-300/10 p-3">
          <div className="text-xs uppercase tracking-wider text-teal-200">Primary</div>
          <div className="font-mono text-2xl font-black text-white">x = {primary}</div>
        </div>
        <div className={`text-xs ${primary === replica ? "text-emerald-300" : "animate-pulse text-amber-300"}`}>{primary === replica ? "in sync →" : "lagging ⋯→"}</div>
        <div className="rounded-xl border border-white/15 bg-slate-950/60 p-3">
          <div className="text-xs uppercase tracking-wider text-slate-400">Replica</div>
          <div className="font-mono text-2xl font-black text-white">x = {replica}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={write} className="rounded-lg bg-teal-400 px-3 py-1.5 text-sm font-bold text-slate-950">Write x = {primary + 1}</button>
        <button type="button" onClick={() => setRead(replica === primary ? `Read x = ${replica} ✅ fresh` : `Read x = ${replica} ❌ stale (primary has ${primary})`)} className="rounded-lg bg-white/10 px-3 py-1.5 text-sm text-slate-100">
          Read from replica
        </button>
        <button type="button" onClick={() => { setReplica(primary); setRead(null); }} className="rounded-lg bg-white/10 px-3 py-1.5 text-sm text-slate-100">
          ⏱ Replica catches up
        </button>
      </div>
      <p className="min-h-5 text-sm text-slate-300" aria-live="polite">
        {read ?? (sync ? "Sync: the write isn't acknowledged until the replica has it. Slower writes, no stale reads." : "Async: the primary acks immediately; the replica applies the change a little later.")}
      </p>
    </div>
  );
}

// ───────────── CAP under a partition ─────────────

/** Cut the network between two replicas, then pick CP or AP and see what each side answers. */
export function CapVisual() {
  const [partition, setPartition] = useState(true);
  const [choice, setChoice] = useState<"CP" | "AP">("CP");
  const left = "Node 1 (has the latest write x = 2)";
  const rightAnswer = !partition ? "x = 2 ✅ (replicated normally)" : choice === "CP" ? "Error / timeout ⛔ — refuses rather than risk a stale answer" : "x = 1 ⚠️ — answers, but it's stale until the partition heals";
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setPartition(!partition)} className={btn(partition)}>
          {partition ? "✂️ Network partitioned" : "🔗 Network healthy"}
        </button>
        {(["CP", "AP"] as const).map((c) => (
          <button key={c} type="button" onClick={() => setChoice(c)} className={btn(choice === c)} disabled={!partition}>
            Choose {c}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 320 90" className="w-full" role="img" aria-label="Two replicas with a network link">
        <rect x="10" y="20" width="110" height="50" rx="10" fill="#14b8a633" stroke="#2dd4bf" />
        <text x="65" y="50" textAnchor="middle" fill="#e2e8f0" fontSize="12">Node 1</text>
        <rect x="200" y="20" width="110" height="50" rx="10" fill="#33415566" stroke="#94a3b8" />
        <text x="255" y="50" textAnchor="middle" fill="#e2e8f0" fontSize="12">Node 2</text>
        <line x1="120" y1="45" x2="200" y2="45" stroke={partition ? "#f43f5e" : "#2dd4bf"} strokeWidth="3" strokeDasharray={partition ? "6 6" : undefined} />
        {partition && <text x="160" y="38" textAnchor="middle" fill="#fda4af" fontSize="16">✂</text>}
      </svg>
      <div className="grid gap-2 text-sm sm:grid-cols-2">
        <div className="rounded-lg bg-slate-950/60 p-2 text-slate-200">Client → {left}: x = 2 ✅</div>
        <div className="rounded-lg bg-slate-950/60 p-2 text-slate-200">Client → Node 2: {rightAnswer}</div>
      </div>
      <p className="text-xs text-slate-400">CAP only bites during a partition. PACELC adds the everyday trade-off: Else, Latency vs Consistency.</p>
    </div>
  );
}

// ───────────── News feed fan-out ─────────────

/** Fan-out on write vs on read vs hybrid, with a follower-count slider for the celebrity problem. */
export function FanoutVisual() {
  const [followers, setFollowers] = useState(300);
  const [mode, setMode] = useState<"write" | "read" | "hybrid">("write");
  const CELEB = 10_000;
  const following = 200;
  const celeb = followers >= CELEB;
  const writes = mode === "write" ? followers : mode === "read" ? 0 : celeb ? 0 : followers;
  const reads = mode === "write" ? 1 : mode === "read" ? following : celeb ? 2 : 1;
  const fmt = (n: number) => n.toLocaleString("en-US");
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        {(["write", "read", "hybrid"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} className={btn(mode === m)}>
            {m === "hybrid" ? "Hybrid" : `Fan-out on ${m}`}
          </button>
        ))}
      </div>
      <label className="grid gap-1 text-sm text-slate-300">
        Author has <span className="font-mono text-white">{fmt(followers)}</span> followers
        <input type="range" min={0} max={6} step={0.1} value={Math.log10(Math.max(1, followers))} onChange={(e) => setFollowers(Math.round(10 ** Number(e.target.value)))} className="accent-teal-400" />
      </label>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className={`rounded-xl border p-3 ${writes > 100_000 ? "border-rose-400/60 bg-rose-500/10" : "border-white/10 bg-slate-950/60"}`}>
          <div className="text-xs uppercase tracking-wider text-slate-400">Timeline inserts per post</div>
          <div className="font-mono text-2xl font-black text-white">{fmt(writes)}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
          <div className="text-xs uppercase tracking-wider text-slate-400">Lookups per feed load</div>
          <div className="font-mono text-2xl font-black text-white">{mode === "read" ? `${following} authors merged` : reads === 2 ? "1 cached feed + celeb posts" : "1 precomputed feed"}</div>
        </div>
      </div>
      <p className="text-sm text-slate-300">
        {mode === "write" && "Push: each post is copied into every follower's cached timeline. Reads are one lookup, but a celebrity post means millions of writes."}
        {mode === "read" && "Pull: nothing happens at post time; every feed load queries everyone you follow and merges. Cheap writes, expensive reads."}
        {mode === "hybrid" && `Hybrid: push for normal authors, pull for accounts above ${fmt(CELEB)} followers and merge their posts at read time.`}
      </p>
    </div>
  );
}

// ───────────── Circuit breaker ─────────────

/** Step a circuit breaker through closed → open → half-open with failures, successes and the cool-down timer. */
export function CircuitBreakerVisual() {
  const [state, setState] = useState<"closed" | "open" | "half-open">("closed");
  const [fails, setFails] = useState(0);
  const [log, setLog] = useState<string>("Closed: calls flow through; failures are counted.");
  const THRESHOLD = 3;

  function call(ok: boolean) {
    if (state === "open") return setLog("Open: the call fails fast without touching the sick dependency.");
    if (state === "half-open") {
      if (ok) {
        setState("closed");
        setFails(0);
        return setLog("Trial call succeeded → closed again.");
      }
      setState("open");
      return setLog("Trial call failed → back to open for another cool-down.");
    }
    if (ok) {
      setFails(0);
      return setLog("Success: failure count resets.");
    }
    const f = fails + 1;
    setFails(f);
    if (f >= THRESHOLD) {
      setState("open");
      setLog(`${f} failures in a row → trip to OPEN.`);
    } else setLog(`Failure ${f}/${THRESHOLD}.`);
  }

  const color = state === "closed" ? "#34d399" : state === "open" ? "#f43f5e" : "#fbbf24";
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-around gap-2">
        {(["closed", "open", "half-open"] as const).map((s) => (
          <div
            key={s}
            className="rounded-full border-2 px-3 py-2 text-center font-mono text-sm font-bold"
            style={{ borderColor: s === state ? color : "rgb(255 255 255 / 0.15)", color: s === state ? color : "#94a3b8", boxShadow: s === state ? `0 0 0 4px ${color}33` : undefined }}
          >
            {s}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" onClick={() => call(false)} className="rounded-lg bg-rose-400/90 px-3 py-1.5 text-sm font-bold text-slate-950">Call fails</button>
        <button type="button" onClick={() => call(true)} className="rounded-lg bg-emerald-400/90 px-3 py-1.5 text-sm font-bold text-slate-950">Call succeeds</button>
        <button
          type="button"
          onClick={() => {
            if (state === "open") {
              setState("half-open");
              setLog("Cool-down elapsed → half-open: let one trial call through.");
            } else setLog("The cool-down timer only matters while open.");
          }}
          className="rounded-lg bg-white/10 px-3 py-1.5 text-sm text-slate-100"
        >
          ⏱ Cool-down elapses
        </button>
      </div>
      <p className="text-center text-sm text-slate-300" aria-live="polite">{log}</p>
    </div>
  );
}
