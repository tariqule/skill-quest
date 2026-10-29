"use client";

import { useState } from "react";
import { LabHeader, type GoalProps } from "@/components/learn/blocks";

// ───────────── Capacity and latency lab ─────────────

const WRITE_SHARE = 0.1;
const NODE_CAP = 5000;
const APP_MS = 10;
const CACHE_MS = 1;
/** p99 of a single-server queue with a 5 ms mean service time: ln(100) × 5 ms ≈ 23 ms, stretched by 1 / (1 − utilisation). */
const DB_P99_IDLE_MS = 23;

interface Capacity {
  reads: number;
  writes: number;
  cacheServed: number;
  dbReads: number;
  primaryLoad: number;
  replicaLoad: number;
  utilisation: number;
  saturated: boolean;
  p99: number;
}

function capacity(qps: number, hit: number, replicas: number): Capacity {
  const writes = qps * WRITE_SHARE;
  const reads = qps - writes;
  const cacheServed = reads * hit;
  const dbReads = reads - cacheServed;
  // Reads go to replicas when there are any; the primary takes every write.
  const primaryLoad = replicas > 0 ? writes : writes + dbReads;
  const replicaLoad = replicas > 0 ? dbReads / replicas : 0;
  const utilisation = Math.max(primaryLoad, replicaLoad) / NODE_CAP;
  const saturated = utilisation >= 1;
  const p99 = saturated ? Infinity : APP_MS + CACHE_MS + DB_P99_IDLE_MS / (1 - utilisation);
  return { reads, writes, cacheServed, dbReads, primaryLoad, replicaLoad, utilisation, saturated, p99 };
}

type CapacityGoal = "p99" | "wall";

function capacitySolved(goal: CapacityGoal | undefined, qps: number, hit: number, replicas: number) {
  const c = capacity(qps, hit, replicas);
  if (goal === "p99") return qps >= 20_000 && c.p99 < 100;
  if (goal === "wall") return hit >= 0.95 && replicas >= 4 && c.primaryLoad >= NODE_CAP;
  return false;
}

/**
 * App servers → cache → primary + read replicas. Slide QPS, cache hit ratio and
 * replica count; watch each database node's load and the p99 latency.
 * Goals: "p99" (20k QPS with p99 under 100 ms) and "wall" (show that replicas and
 * cache can't save a write-saturated primary).
 */
export function CapacityLab({ goal, onSolved }: GoalProps<CapacityGoal>) {
  const [qps, setQps] = useState(goal === "wall" ? 30_000 : 20_000);
  const [hit, setHit] = useState(goal === "wall" ? 0.9 : 0.6);
  const [replicas, setReplicas] = useState(0);
  const c = capacity(qps, hit, replicas);
  const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

  function update(nextQps: number, nextHit: number, nextReplicas: number) {
    setQps(nextQps);
    setHit(nextHit);
    setReplicas(nextReplicas);
    if (capacitySolved(goal, nextQps, nextHit, nextReplicas)) onSolved?.();
  }

  const nodes = [{ name: "Primary", load: c.primaryLoad, role: replicas > 0 ? "all writes" : "writes + reads" }, ...Array.from({ length: replicas }, (_, i) => ({ name: `Replica ${i + 1}`, load: c.replicaLoad, role: "reads" }))];

  return (
    <div>
      <LabHeader title="Capacity and latency" hint="Every database node handles about 5,000 queries/s. 10% of traffic is writes. Drag the sliders and watch load and p99." />
      <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
        <div className="grid content-start gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-200">
          <label className="grid gap-1">
            <span className="flex justify-between">Traffic <span className="font-mono text-white">{fmt(qps)} QPS</span></span>
            <input type="range" min={1000} max={60_000} step={1000} value={qps} onChange={(e) => update(Number(e.target.value), hit, replicas)} className="accent-teal-400" />
          </label>
          <label className="grid gap-1">
            <span className="flex justify-between">Cache hit ratio <span className="font-mono text-white">{Math.round(hit * 100)}%</span></span>
            <input type="range" min={0} max={99} step={1} value={Math.round(hit * 100)} onChange={(e) => update(qps, Number(e.target.value) / 100, replicas)} className="accent-teal-400" />
          </label>
          <label className="grid gap-1">
            <span className="flex justify-between">Read replicas <span className="font-mono text-white">{replicas}</span></span>
            <input type="range" min={0} max={8} step={1} value={replicas} onChange={(e) => update(qps, hit, Number(e.target.value))} className="accent-teal-400" />
          </label>
          <div className="grid grid-cols-2 gap-2 text-center">
            <Stat label="Reads / writes" value={`${fmt(c.reads)} / ${fmt(c.writes)}`} />
            <Stat label="Cache absorbs" value={`${fmt(c.cacheServed)} QPS`} />
            <Stat label="Reads reaching DB" value={`${fmt(c.dbReads)} QPS`} />
            <Stat label="Busiest node" value={`${Math.round(c.utilisation * 100)}%`} tone={c.utilisation >= 1 ? "bad" : c.utilisation > 0.75 ? "warn" : "ok"} />
          </div>
        </div>
        <div className="grid content-start gap-3">
          <div className={`rounded-xl border p-3 text-center ${c.saturated ? "border-rose-400/70 bg-rose-500/15" : c.p99 < 100 ? "border-emerald-400/50 bg-emerald-500/10" : "border-amber-400/50 bg-amber-500/10"}`}>
            <div className="text-xs uppercase tracking-wider text-slate-400">p99 latency</div>
            <div className="font-mono text-3xl font-black text-white">{c.saturated ? "∞ (timeouts)" : `${Math.round(c.p99)} ms`}</div>
            <div className="mt-1 text-xs text-slate-300">
              {c.saturated ? "A node is past 100%: its queue grows without bound." : "Writes always hit the database, so the slowest 1% are DB requests; latency explodes as a node nears 100%."}
            </div>
          </div>
          <div className="grid gap-1.5">
            {nodes.map((n) => {
              const u = n.load / NODE_CAP;
              return (
                <div key={n.name} className="grid grid-cols-[6rem_1fr_3.5rem] items-center gap-2 text-xs">
                  <span className="text-slate-200">
                    {n.name}
                    <span className="block text-[10px] text-slate-500">{n.role}</span>
                  </span>
                  <span className="h-3 overflow-hidden rounded-full bg-white/5">
                    <span className="block h-3 rounded-full transition-all" style={{ width: `${Math.min(100, u * 100)}%`, background: u >= 1 ? "#f43f5e" : u > 0.75 ? "#fbbf24" : "#2dd4bf" }} />
                  </span>
                  <span className="text-right font-mono text-slate-300">{Math.round(u * 100)}%</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-400" aria-live="polite">
            {c.saturated && replicas > 0 && c.primaryLoad >= NODE_CAP
              ? "The primary is drowning in writes. Replicas and caches only scale reads: next stop is sharding or batching writes."
              : c.utilisation > 0.75
                ? "Above ~75% utilisation, queueing makes tail latency climb steeply."
                : "Healthy headroom."}
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "ok" | "warn" | "bad" }) {
  const color = tone === "bad" ? "text-rose-300" : tone === "warn" ? "text-amber-300" : "text-white";
  return (
    <div className="rounded-lg bg-black/30 p-2">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`font-mono text-sm font-bold ${color}`}>{value}</div>
    </div>
  );
}

// ───────────── Consistent hashing ring ─────────────

const POOL = ["A", "B", "C", "D", "E", "F"];
const NODE_COLORS: Record<string, string> = { A: "#2dd4bf", B: "#f472b6", C: "#facc15", D: "#60a5fa", E: "#a78bfa", F: "#fb923c" };
const KEYS = Array.from({ length: 40 }, (_, i) => `user:${i + 1}`);
const VNODES = 8;

/** 32-bit FNV-1a with a finaliser, so similar strings land far apart on the ring. */
function hash32(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) >>> 0;
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35) >>> 0;
  h ^= h >>> 16;
  return h >>> 0;
}

function ringPoints(nodes: string[], vnodes: boolean) {
  return nodes.flatMap((n) => Array.from({ length: vnodes ? VNODES : 1 }, (_, i) => ({ node: n, h: hash32(`${n}#${i}`) }))).sort((a, b) => a.h - b.h);
}

function ringOwners(nodes: string[], vnodes: boolean): Record<string, string> {
  const pts = ringPoints(nodes, vnodes);
  return Object.fromEntries(KEYS.map((k) => {
    const h = hash32(k);
    return [k, (pts.find((p) => p.h >= h) ?? pts[0]).node];
  }));
}

function moduloOwners(nodes: string[]): Record<string, string> {
  return Object.fromEntries(KEYS.map((k) => [k, nodes[hash32(k) % nodes.length]]));
}

const moved = (a: Record<string, string>, b: Record<string, string>) => KEYS.filter((k) => a[k] !== b[k]);

type RingGoal = "add" | "balance";

/**
 * Keys and nodes hashed onto a ring; a key belongs to the next node clockwise.
 * Add or remove nodes and compare how many keys move with hash % N.
 * Goals: "add" (add a node, moving under a third of the keys) and
 * "balance" (with ≥ 4 nodes, busiest node ≤ 1.25× its fair share).
 */
export function HashRingLab({ goal, onSolved }: GoalProps<RingGoal>) {
  const [nodes, setNodes] = useState<string[]>(["A", "B", "C"]);
  const [vnodes, setVnodes] = useState(false);
  const [last, setLast] = useState<{ ring: string[]; modulo: number | null; action: string } | null>(null);
  const owners = ringOwners(nodes, vnodes);
  const loads = nodes.map((n) => KEYS.filter((k) => owners[k] === n).length);
  const fair = KEYS.length / nodes.length;
  const busiest = Math.max(...loads) / fair;

  function change(next: string[], nextV: boolean, action: string) {
    const before = ringOwners(nodes, vnodes);
    const after = ringOwners(next, nextV);
    const ringMoved = moved(before, after);
    const modMoved = next.length !== nodes.length ? moved(moduloOwners(nodes), moduloOwners(next)).length : null;
    setNodes(next);
    setVnodes(nextV);
    setLast({ ring: ringMoved, modulo: modMoved, action });
    if (goal === "add" && next.length > nodes.length && ringMoved.length * 3 < KEYS.length) onSolved?.();
    if (goal === "balance" && nextV && next.length >= 4) {
      const o = ringOwners(next, nextV);
      const max = Math.max(...next.map((n) => KEYS.filter((k) => o[k] === n).length));
      if (max <= 1.25 * (KEYS.length / next.length)) onSolved?.();
    }
  }

  const free = POOL.filter((n) => !nodes.includes(n));
  const pts = ringPoints(nodes, vnodes);
  const R = 110;
  const pos = (h: number, r: number) => {
    const a = (h / 2 ** 32) * 2 * Math.PI - Math.PI / 2;
    return { x: 150 + r * Math.cos(a), y: 150 + r * Math.sin(a) };
  };
  const movedSet = new Set(last?.ring ?? []);

  return (
    <div>
      <LabHeader title="Consistent hashing ring" hint="Keys (dots) belong to the next node clockwise. Add or remove nodes, toggle virtual nodes, and compare with hash % N." />
      <div className="grid gap-4 md:grid-cols-[1.1fr_1fr]">
        <svg viewBox="0 0 300 300" className="mx-auto w-full max-w-sm" role="img" aria-label="Hash ring with nodes and keys">
          <circle cx="150" cy="150" r={R} fill="none" stroke="rgb(255 255 255 / 0.15)" strokeWidth="2" />
          {KEYS.map((k) => {
            const p = pos(hash32(k), R - 18);
            const m = movedSet.has(k);
            return (
              <circle key={k} cx={p.x} cy={p.y} r={m ? 5.5 : 4} fill={NODE_COLORS[owners[k]]} stroke={m ? "#fff" : "none"} strokeWidth={m ? 2 : 0}>
                <title>{`${k} → ${owners[k]}`}</title>
              </circle>
            );
          })}
          {pts.map((p) => {
            const q = pos(p.h, R);
            return (
              <g key={`${p.node}-${p.h}`}>
                <rect x={q.x - 8} y={q.y - 8} width="16" height="16" rx="4" fill={NODE_COLORS[p.node]} />
                <text x={q.x} y={q.y + 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a">{p.node}</text>
              </g>
            );
          })}
          <text x="150" y="146" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="bold">{nodes.length} nodes</text>
          <text x="150" y="162" textAnchor="middle" fill="#94a3b8" fontSize="10">{vnodes ? `${VNODES} virtual nodes each` : "1 point each"}</text>
        </svg>
        <div className="grid content-start gap-3 text-sm">
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={free.length === 0} onClick={() => change([...nodes, free[0]].sort(), vnodes, `added ${free[0]}`)} className="rounded-lg bg-teal-400 px-3 py-1.5 font-bold text-slate-950 disabled:opacity-40">
              + Add node {free[0] ?? ""}
            </button>
            <label className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-slate-100">
              <input type="checkbox" checked={vnodes} onChange={(e) => change(nodes, e.target.checked, e.target.checked ? "virtual nodes on" : "virtual nodes off")} className="accent-teal-400" />
              Virtual nodes
            </label>
          </div>
          <div className="grid gap-1.5">
            {nodes.map((n, i) => (
              <div key={n} className="grid grid-cols-[2rem_1fr_3rem_auto] items-center gap-2 text-xs">
                <span className="grid h-6 w-6 place-items-center rounded font-bold text-slate-950" style={{ background: NODE_COLORS[n] }}>{n}</span>
                <span className="h-2.5 overflow-hidden rounded-full bg-white/5">
                  <span className="block h-2.5 rounded-full" style={{ width: `${(loads[i] / KEYS.length) * 100}%`, background: NODE_COLORS[n] }} />
                </span>
                <span className="font-mono text-slate-300">{loads[i]} keys</span>
                <button type="button" disabled={nodes.length <= 2} onClick={() => change(nodes.filter((x) => x !== n), vnodes, `removed ${n}`)} className="rounded bg-white/10 px-1.5 py-0.5 text-slate-300 disabled:opacity-30" aria-label={`Remove node ${n}`}>
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className={`rounded-lg p-2 text-xs ${busiest > 1.25 ? "bg-amber-500/10 text-amber-100" : "bg-emerald-500/10 text-emerald-100"}`}>
            Busiest node holds {busiest.toFixed(2)}× its fair share ({fair.toFixed(1)} keys).
          </div>
          <div className="rounded-lg bg-black/30 p-3 text-slate-200" aria-live="polite">
            {last ? (
              <>
                <div className="font-semibold text-white">After “{last.action}”:</div>
                <div>Ring moved <span className="font-mono text-teal-300">{last.ring.length}/{KEYS.length}</span> keys (outlined in white).</div>
                {last.modulo !== null ? (
                  <div>hash % N would have moved <span className="font-mono text-rose-300">{last.modulo}/{KEYS.length}</span>.</div>
                ) : null}
              </>
            ) : (
              "Make a change to see which keys move."
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────── Token bucket ─────────────

type Shot = { ok: boolean; id: number };

/**
 * A token bucket rate limiter with discrete time. Capacity sets the burst; refill sets the
 * sustained rate. Goal "burst": a burst of 10 passes, an immediate second burst is mostly rejected.
 */
export function TokenBucketLab({ goal, onSolved }: GoalProps<"burst">) {
  const [cap, setCap] = useState(5);
  const [rate, setRate] = useState(2);
  const [tokens, setTokens] = useState(5);
  const [shots, setShots] = useState<Shot[]>([]);
  const [t, setT] = useState(0);
  /** Time of the last burst that passed completely, or null. */
  const [cleanBurstAt, setCleanBurstAt] = useState<number | null>(null);
  const [msg, setMsg] = useState("The bucket starts full.");

  function configure(nextCap: number, nextRate: number) {
    setCap(nextCap);
    setRate(nextRate);
    setTokens(nextCap);
    setShots([]);
    setCleanBurstAt(null);
    setMsg("Bucket reset to full.");
  }

  function send(n: number) {
    let left = tokens;
    const next: Shot[] = [];
    const base = shots.length ? shots[shots.length - 1].id + 1 : 0;
    for (let i = 0; i < n; i++) {
      const ok = left >= 1;
      if (ok) left -= 1;
      next.push({ ok, id: base + i });
    }
    const passed = next.filter((s) => s.ok).length;
    setTokens(left);
    setShots([...shots, ...next].slice(-40));
    setMsg(`${passed} allowed, ${n - passed} rejected with 429. ${Math.floor(left)} token${Math.floor(left) === 1 ? "" : "s"} left.`);
    if (n === 10) {
      if (goal === "burst" && cleanBurstAt === t && n - passed >= 7) onSolved?.();
      setCleanBurstAt(passed === 10 ? t : null);
    }
  }

  function wait() {
    setT(t + 1);
    setTokens(Math.min(cap, tokens + rate));
    setMsg(`1 s passes: +${rate} tokens (capped at ${cap}).`);
  }

  return (
    <div>
      <LabHeader title="Token bucket" hint="Each request takes a token; the bucket refills at a steady rate up to its capacity. Capacity = allowed burst, refill = sustained rate." />
      <div className="grid gap-4 md:grid-cols-[1fr_1.1fr]">
        <div className="grid content-start gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-200">
          <label className="grid gap-1">
            <span className="flex justify-between">Capacity <span className="font-mono text-white">{cap} tokens</span></span>
            <input type="range" min={1} max={20} value={cap} onChange={(e) => configure(Number(e.target.value), rate)} className="accent-teal-400" />
          </label>
          <label className="grid gap-1">
            <span className="flex justify-between">Refill <span className="font-mono text-white">{rate} tokens/s</span></span>
            <input type="range" min={1} max={10} value={rate} onChange={(e) => configure(cap, Number(e.target.value))} className="accent-teal-400" />
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => send(1)} className="rounded-lg bg-white/10 px-3 py-1.5 font-semibold text-slate-100">Send 1</button>
            <button type="button" onClick={() => send(10)} className="rounded-lg bg-teal-400 px-3 py-1.5 font-bold text-slate-950">Burst of 10</button>
            <button type="button" onClick={wait} className="rounded-lg bg-white/10 px-3 py-1.5 font-semibold text-slate-100">⏱ Wait 1 s</button>
          </div>
          <div className="font-mono text-xs text-slate-400">t = {t} s</div>
        </div>
        <div className="grid content-start gap-3">
          <div className="flex items-end gap-3">
            <div className="relative h-28 w-16 overflow-hidden rounded-b-xl border-2 border-t-0 border-teal-300/60 bg-slate-950/60">
              <div className="absolute inset-x-0 bottom-0 bg-teal-400/70 transition-all" style={{ height: `${(tokens / cap) * 100}%` }} />
            </div>
            <div className="text-sm text-slate-300">
              <div className="font-mono text-2xl font-black text-white">{Math.floor(tokens)}</div>
              tokens in the bucket
            </div>
          </div>
          <div className="flex flex-wrap gap-1" aria-label="Recent requests">
            {shots.map((s) => (
              <span key={s.id} className={`h-3 w-3 rounded-sm ${s.ok ? "bg-emerald-400" : "bg-rose-500"}`} title={s.ok ? "allowed" : "429"} />
            ))}
          </div>
          <p className="text-sm text-slate-300" aria-live="polite">{msg}</p>
        </div>
      </div>
    </div>
  );
}
