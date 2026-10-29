"use client";

import { useState } from "react";
import type { GoalProps } from "@/components/learn/blocks";
import { LabHeader } from "@/components/learn/blocks";
import { pct } from "@/engine/game";

/** Concept diagrams specific to the AWS Cloud Practitioner course. */

// ───────────── Elasticity: fixed capacity vs Auto Scaling ─────────────

/** Requests per hour across a day, in "servers needed". Peak 8, trough 2. */
const DEMAND = [2, 2, 2, 3, 5, 7, 8, 8, 7, 6, 4, 3];

export function ElasticityLab({ goal, onSolved }: GoalProps<"elastic">) {
  const [mode, setMode] = useState<"fixed" | "auto">("fixed");
  const [fixed, setFixed] = useState(5);
  const [min, setMin] = useState(4);
  const [max, setMax] = useState(6);

  const capacity = DEMAND.map((d) => (mode === "fixed" ? fixed : Math.min(max, Math.max(min, d))));
  const idle = capacity.reduce((s, c, i) => s + Math.max(0, c - DEMAND[i]), 0);
  const short = capacity.reduce((s, c, i) => s + Math.max(0, DEMAND[i] - c), 0);
  const peak = Math.max(...DEMAND);

  function check(next: { mode: "fixed" | "auto"; min: number; max: number }) {
    const caps = DEMAND.map((d) => Math.min(next.max, Math.max(next.min, d)));
    const nextShort = caps.reduce((s, c, i) => s + Math.max(0, DEMAND[i] - c), 0);
    const nextIdle = caps.reduce((s, c, i) => s + Math.max(0, c - DEMAND[i]), 0);
    if (goal === "elastic" && next.mode === "auto" && nextShort === 0 && nextIdle === 0) onSolved?.();
  }

  return (
    <div>
      <LabHeader title="Capacity planner" hint="Buy a fixed number of servers like a data center, or let Auto Scaling follow demand. Watch idle (wasted) and missing capacity." />
      <div className="flex flex-wrap gap-2">
        {(["fixed", "auto"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              check({ mode: m, min, max });
            }}
            className={`rounded-full border px-3 py-1 text-sm ${mode === m ? "border-amber-400 bg-amber-400/20 text-white" : "border-white/10 text-slate-300"}`}
          >
            {m === "fixed" ? "🏢 Fixed capacity (on-premises)" : "📈 Auto Scaling (cloud)"}
          </button>
        ))}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {mode === "fixed" ? (
          <Range label="Servers bought up front" value={fixed} min={1} max={10} onChange={setFixed} />
        ) : (
          <>
            <Range
              label="Minimum servers"
              value={min}
              min={1}
              max={10}
              onChange={(v) => {
                const m2 = Math.min(v, max);
                setMin(m2);
                check({ mode, min: m2, max });
              }}
            />
            <Range
              label="Maximum servers"
              value={max}
              min={1}
              max={10}
              onChange={(v) => {
                const m2 = Math.max(v, min);
                setMax(m2);
                check({ mode, min, max: m2 });
              }}
            />
          </>
        )}
      </div>
      <div className="mt-3 flex h-36 items-end gap-1 rounded-xl border border-white/10 bg-slate-950/60 p-2">
        {DEMAND.map((d, i) => (
          <div key={i} className="relative flex h-full flex-1 items-end">
            <div className="absolute inset-x-0 bottom-0 rounded-t bg-sky-500/25 ring-1 ring-sky-400/40" style={{ height: pct(capacity[i] / 10) }} />
            <div className={`relative w-full rounded-t ${d > capacity[i] ? "bg-rose-500" : "bg-emerald-400"}`} style={{ height: pct(Math.min(d, capacity[i]) / 10) }} />
            {d > capacity[i] && <div className="absolute inset-x-0 rounded-t border border-dashed border-rose-400" style={{ bottom: pct(capacity[i] / 10), height: pct((d - capacity[i]) / 10) }} />}
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-slate-500">
        <span>6 am</span>
        <span>noon (peak {peak})</span>
        <span>6 pm</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div className={`rounded-xl p-2 ${idle ? "bg-amber-400/10 text-amber-100" : "bg-emerald-400/10 text-emerald-100"}`}>
          💤 Idle server-hours: <b>{idle}</b>
          <div className="text-xs opacity-80">Paid for but unused</div>
        </div>
        <div className={`rounded-xl p-2 ${short ? "bg-rose-400/10 text-rose-100" : "bg-emerald-400/10 text-emerald-100"}`}>
          🚫 Missing server-hours: <b>{short}</b>
          <div className="text-xs opacity-80">Users turned away</div>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        <span className="text-sky-300">Light blue</span> = capacity you have · <span className="text-emerald-300">green</span> = demand served · <span className="text-rose-300">red</span> = demand you can&apos;t serve.
      </p>
    </div>
  );
}

function Range({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <label className="block rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-white">{label}</span>
        <span className="font-mono text-amber-300">{value}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-amber-400" aria-label={label} />
    </label>
  );
}

// ───────────── Well-Architected pillars ─────────────

const PILLARS = [
  { icon: "⚙️", name: "Operational excellence", color: "#38bdf8", focus: "Run and monitor systems, and keep improving processes.", ideas: ["Safely automate where possible", "Make frequent, small, reversible changes", "Anticipate failure", "Learn from all operational events and metrics"] },
  { icon: "🔐", name: "Security", color: "#f87171", focus: "Protect data, systems, and assets.", ideas: ["Implement a strong identity foundation", "Maintain traceability", "Apply security at all layers", "Protect data in transit and at rest"] },
  { icon: "🛟", name: "Reliability", color: "#34d399", focus: "Recover from failures and meet demand.", ideas: ["Automatically recover from failure", "Test recovery procedures", "Scale horizontally", "Stop guessing capacity"] },
  { icon: "⚡", name: "Performance efficiency", color: "#a78bfa", focus: "Use computing resources efficiently as demand changes.", ideas: ["Go global in minutes", "Use serverless architectures", "Experiment more often", "Democratize advanced technologies"] },
  { icon: "💰", name: "Cost optimization", color: "#f59e0b", focus: "Deliver business value at the lowest price point.", ideas: ["Adopt a consumption model", "Measure overall efficiency", "Stop spending on undifferentiated heavy lifting", "Analyze and attribute expenditure"] },
  { icon: "🌱", name: "Sustainability", color: "#4ade80", focus: "Minimize the environmental impact of running workloads.", ideas: ["Understand your impact", "Maximize utilization", "Use managed services", "Reduce the downstream impact of your workloads"] },
] as const;

export function PillarWheel() {
  const [sel, setSel] = useState(0);
  const p = PILLARS[sel];
  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {PILLARS.map((x, i) => (
          <button
            key={x.name}
            type="button"
            onClick={() => setSel(i)}
            className="rounded-xl border bg-slate-950/60 p-2 text-left transition hover:-translate-y-0.5"
            style={{ borderColor: sel === i ? x.color : "rgb(255 255 255 / 0.1)", boxShadow: sel === i ? `0 0 0 3px ${x.color}33` : undefined }}
          >
            <span className="text-xl">{x.icon}</span> <span className="text-sm font-semibold text-white">{x.name}</span>
          </button>
        ))}
      </div>
      <div className="pop-in mt-3 rounded-xl border p-3" key={p.name} style={{ borderColor: `${p.color}55`, background: `${p.color}12` }}>
        <div className="font-bold" style={{ color: p.color }}>
          {p.icon} {p.name}
        </div>
        <p className="mt-1 text-sm text-slate-200">{p.focus}</p>
        <ul className="mt-2 grid gap-1 text-sm text-slate-300">
          {p.ideas.map((i) => (
            <li key={i}>• {i}</li>
          ))}
        </ul>
      </div>
      <p className="mt-2 text-xs text-slate-500">Six pillars. The AWS Well-Architected Tool reviews a workload against them.</p>
    </div>
  );
}

// ───────────── Global infrastructure: Regions, AZs, edge locations ─────────────

const AZS = ["AZ a", "AZ b", "AZ c"] as const;

export function MultiAzLab({ goal, onSolved }: GoalProps<"survive">) {
  const [placed, setPlaced] = useState<boolean[]>([true, false, false]);
  const [down, setDown] = useState<number | null>(null);
  const up = placed.some((p, i) => p && i !== down);

  function toggle(i: number) {
    const next = placed.map((p, k) => (k === i ? !p : p));
    setPlaced(next);
    setDown(null);
  }

  function fail(i: number) {
    setDown(i);
    const survives = placed.some((p, k) => p && k !== i);
    const count = placed.filter(Boolean).length;
    if (goal === "survive" && placed[i] && survives && count >= 2) onSolved?.();
  }

  return (
    <div>
      <LabHeader title="Region in a box" hint="Place your app's servers in Availability Zones, then simulate an AZ failure. Tap 💥 on a zone that runs your app." />
      <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-3">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-300">🌍 AWS Region (for example, eu-west-1)</div>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {AZS.map((az, i) => (
            <div key={az} className={`rounded-xl border p-2 transition ${down === i ? "border-rose-400 bg-rose-500/15" : "border-white/10 bg-slate-950/60"}`}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-white">{az}</span>
                <button type="button" onClick={() => fail(i)} className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-rose-200" aria-label={`Fail ${az}`}>
                  💥 Fail
                </button>
              </div>
              <div className="mt-1 text-[11px] text-slate-500">One or more data centers · own power, cooling, networking</div>
              <button
                type="button"
                onClick={() => toggle(i)}
                className={`mt-2 w-full rounded-lg px-2 py-1.5 text-sm font-bold ${placed[i] ? (down === i ? "bg-rose-400/60 text-slate-950 line-through" : "bg-emerald-400 text-slate-950") : "border border-dashed border-white/20 text-slate-400"}`}
              >
                {placed[i] ? "🖥️ App server" : "+ Place server"}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-2 text-center text-[11px] text-slate-400">AZs are linked by low-latency, redundant networking and don&apos;t share single points of failure.</div>
      </div>
      <div className={`mt-3 rounded-xl border p-3 text-sm ${down === null ? "border-white/10 bg-white/5 text-slate-300" : up ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100" : "border-rose-400/40 bg-rose-400/10 text-rose-100"}`}>
        {down === null
          ? `Your app runs in ${placed.filter(Boolean).length} of 3 AZs. Simulate a failure to test it.`
          : up
            ? "✓ The app stays up: a load balancer sends traffic to the healthy AZ."
            : "✗ Outage. Every copy of the app was in the failed AZ (or nowhere)."}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="rounded-md bg-sky-400/15 px-2 py-1 text-sky-200">📍 Edge locations</span>
        <span>Many more sites than Regions. CloudFront caches content there, close to users.</span>
      </div>
    </div>
  );
}

// ───────────── VPC: security groups vs network ACLs ─────────────

export function VpcDiagram() {
  const [layer, setLayer] = useState<"sg" | "nacl">("sg");
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setLayer("sg")} className={`rounded-full border px-3 py-1 text-sm ${layer === "sg" ? "border-emerald-400 bg-emerald-400/20 text-white" : "border-white/10 text-slate-300"}`}>
          🛡️ Security group
        </button>
        <button type="button" onClick={() => setLayer("nacl")} className={`rounded-full border px-3 py-1 text-sm ${layer === "nacl" ? "border-sky-400 bg-sky-400/20 text-white" : "border-white/10 text-slate-300"}`}>
          🚧 Network ACL
        </button>
      </div>
      <div className="mt-3 rounded-2xl border border-violet-400/40 bg-violet-400/5 p-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-violet-300">
          <span>☁️ VPC</span>
          <span className="rounded-md bg-slate-950/70 px-2 py-0.5 normal-case text-slate-200">🌐 Internet gateway</span>
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {[
            { name: "Public subnet", note: "Route to the internet gateway", box: "🖥️ Web server" },
            { name: "Private subnet", note: "No direct internet route (NAT gateway for outbound)", box: "🗄️ Database" },
          ].map((s) => (
            <div key={s.name} className={`rounded-xl border-2 p-2 ${layer === "nacl" ? "border-sky-400" : "border-white/10"}`}>
              <div className="text-sm font-semibold text-white">{s.name}</div>
              <div className="text-[11px] text-slate-400">{s.note}</div>
              <div className={`mt-2 rounded-lg p-2 text-center text-sm ${layer === "sg" ? "ring-2 ring-emerald-400" : ""} bg-slate-950/70 text-slate-100`}>{s.box}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        {(layer === "sg"
          ? [
              ["Applies to", "Instances (network interfaces)"],
              ["State", "Stateful: return traffic is allowed automatically"],
              ["Rules", "Allow rules only"],
              ["Default", "Denies all inbound until you allow it"],
            ]
          : [
              ["Applies to", "Whole subnets"],
              ["State", "Stateless: return traffic needs its own rule"],
              ["Rules", "Allow and deny rules, evaluated in number order"],
              ["Use it for", "Blocking a specific IP range at the subnet edge"],
            ]
        ).map(([k, v]) => (
          <div key={k} className="rounded-xl bg-white/5 p-2">
            <div className="text-[11px] uppercase tracking-wider text-slate-400">{k}</div>
            <div className="text-sm font-semibold text-white">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
