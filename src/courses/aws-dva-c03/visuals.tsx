"use client";

import { useState } from "react";
import { pct } from "@/engine/game";

/** Concept diagrams specific to the AWS Developer Associate course. */

// ───────────── Deployment strategies ─────────────

/** Each step is a row of instance slots: "1" old version, "2" new version, "-" out of service. */
const STRATEGIES = [
  {
    id: "all",
    name: "All at once",
    steps: [["1", "1", "1", "1"], ["-", "-", "-", "-"], ["2", "2", "2", "2"]],
    facts: { Downtime: "Yes, briefly", Capacity: "Drops to 0", Rollback: "Redeploy the old version", Cost: "No extra instances" },
    where: "Elastic Beanstalk, CodeDeploy AllAtOnce, Lambda AllAtOnce",
  },
  {
    id: "rolling",
    name: "Rolling",
    steps: [["1", "1", "1", "1"], ["-", "-", "1", "1"], ["2", "2", "1", "1"], ["2", "2", "-", "-"], ["2", "2", "2", "2"]],
    facts: { Downtime: "No", Capacity: "Reduced by one batch", Rollback: "Redeploy the old version", Cost: "No extra instances" },
    where: "Elastic Beanstalk, CodeDeploy HalfAtATime or OneAtATime",
  },
  {
    id: "rolling-batch",
    name: "Rolling with an additional batch",
    steps: [["1", "1", "1", "1"], ["1", "1", "1", "1", "2", "2"], ["2", "2", "1", "1", "2", "2"], ["2", "2", "2", "2"]],
    facts: { Downtime: "No", Capacity: "Full the whole time", Rollback: "Redeploy the old version", Cost: "One extra batch while deploying" },
    where: "Elastic Beanstalk",
  },
  {
    id: "immutable",
    name: "Immutable",
    steps: [["1", "1", "1", "1"], ["1", "1", "1", "1", "2", "2", "2", "2"], ["2", "2", "2", "2"]],
    facts: { Downtime: "No", Capacity: "Full, then double", Rollback: "Fast: terminate the new instances", Cost: "Double while deploying" },
    where: "Elastic Beanstalk (new instances in a temporary Auto Scaling group)",
  },
  {
    id: "bluegreen",
    name: "Blue/green",
    steps: [["1", "1", "1", "1"], ["1", "1", "1", "1", "2", "2", "2", "2"], ["2", "2", "2", "2"]],
    facts: { Downtime: "No", Capacity: "Two full environments", Rollback: "Fast: switch traffic back", Cost: "Double while both run" },
    where: "Beanstalk URL swap, CodeDeploy blue/green (EC2, ECS)",
  },
  {
    id: "canary",
    name: "Canary or linear",
    steps: [["1", "1", "1", "1", "1", "1", "1", "1", "1", "1"], ["2", "1", "1", "1", "1", "1", "1", "1", "1", "1"], ["2", "2", "2", "2", "2", "2", "2", "2", "2", "2"]],
    facts: { Downtime: "No", Capacity: "Full", Rollback: "Automatic on a CloudWatch alarm", Cost: "No extra instances" },
    where: "Lambda aliases through CodeDeploy, API Gateway canary, ECS blue/green",
  },
] as const;

export function DeployStrategies() {
  const [sel, setSel] = useState(0);
  const [step, setStep] = useState(0);
  const s = STRATEGIES[sel];
  const isTraffic = s.id === "canary";
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {STRATEGIES.map((x, i) => (
          <button
            key={x.id}
            type="button"
            onClick={() => {
              setSel(i);
              setStep(0);
            }}
            className={`rounded-full border px-3 py-1 text-sm ${sel === i ? "border-emerald-400 bg-emerald-400/20 text-white" : "border-white/10 text-slate-300"}`}
          >
            {x.name}
          </button>
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-3">
        <div className="flex flex-wrap gap-1.5">
          {s.steps[step].map((v, i) => (
            <span
              key={i}
              className={`flex h-9 items-center justify-center rounded-lg text-xs font-bold ${isTraffic ? "w-7" : "w-11"} ${v === "1" ? "bg-sky-500/70 text-white" : v === "2" ? "bg-emerald-400 text-slate-950" : "border border-dashed border-rose-400/60 text-rose-300"}`}
            >
              {v === "-" ? "⏸" : isTraffic ? "" : `v${v}`}
            </span>
          ))}
        </div>
        <div className="mt-2 text-xs text-slate-400">
          {isTraffic ? "Each block is 10% of traffic. " : "Each block is an instance. "}
          <span className="text-sky-300">Blue is the old version</span>, <span className="text-emerald-300">green is the new one</span>
          {!isTraffic && <span className="text-rose-300">, ⏸ is out of service</span>}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)} className="rounded-lg bg-slate-800 px-3 py-1 text-sm text-slate-200 disabled:opacity-40">
            ◀
          </button>
          <span className="text-sm text-slate-300">
            Step {step + 1} of {s.steps.length}
          </span>
          <button type="button" disabled={step === s.steps.length - 1} onClick={() => setStep(step + 1)} className="rounded-lg bg-slate-800 px-3 py-1 text-sm text-slate-200 disabled:opacity-40">
            ▶
          </button>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Object.entries(s.facts).map(([k, v]) => (
          <div key={k} className="rounded-xl bg-white/5 p-2">
            <div className="text-[11px] uppercase tracking-wider text-slate-400">{k}</div>
            <div className="text-sm font-semibold text-white">{v}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-slate-400">Where you see it: {s.where}</div>
    </div>
  );
}

// ───────────── DynamoDB partition key cardinality ─────────────

const KEY_CHOICES = [
  { key: "status", label: "status (3 values)", loads: [0.78, 0.17, 0.05, 0], note: "Most items are \"PENDING\", so one partition takes almost all the traffic and gets throttled." },
  { key: "orderId", label: "orderId (millions of values)", loads: [0.26, 0.24, 0.25, 0.25], note: "Many distinct values hash evenly, so every partition shares the load." },
] as const;

export function PartitionHeat() {
  const [k, setK] = useState(0);
  const c = KEY_CHOICES[k];
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {KEY_CHOICES.map((x, i) => (
          <button
            key={x.key}
            type="button"
            onClick={() => setK(i)}
            className={`rounded-full border px-3 py-1 text-sm ${k === i ? "border-amber-400 bg-amber-400/20 text-white" : "border-white/10 text-slate-300"}`}
          >
            Partition key: {x.label}
          </button>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {c.loads.map((l, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-slate-950/60 p-2 text-center">
            <div className="text-[11px] text-slate-400">Partition {i + 1}</div>
            <div className="mx-auto mt-2 flex h-24 w-8 items-end overflow-hidden rounded-md bg-white/10">
              <div className={`w-full transition-all duration-500 ${l > 0.5 ? "bg-rose-500" : "bg-emerald-400"}`} style={{ height: pct(l) }} />
            </div>
            <div className={`mt-1 font-mono text-xs ${l > 0.5 ? "text-rose-300" : "text-slate-300"}`}>{Math.round(l * 100)}%</div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-sm text-slate-300">{c.note}</p>
    </div>
  );
}

// ───────────── X-Ray trace waterfall ─────────────

const SEGMENTS = [
  { name: "API Gateway", start: 0, dur: 100, depth: 0, color: "#a78bfa" },
  { name: "Lambda: checkout", start: 4, dur: 94, depth: 1, color: "#f59e0b" },
  { name: "Initialization (cold start)", start: 4, dur: 22, depth: 2, color: "#94a3b8" },
  { name: "DynamoDB GetItem", start: 28, dur: 6, depth: 2, color: "#38bdf8" },
  { name: "HTTP: payments.example.com", start: 36, dur: 58, depth: 2, color: "#f87171" },
] as const;

export function TraceWaterfall() {
  const [sel, setSel] = useState(4);
  return (
    <div>
      <div className="grid gap-1.5 rounded-xl border border-white/10 bg-slate-950/60 p-3">
        {SEGMENTS.map((s, i) => (
          <button key={s.name} type="button" onClick={() => setSel(i)} className="grid grid-cols-[9.5rem_1fr] items-center gap-2 text-left text-xs">
            <span className={`truncate ${sel === i ? "font-bold text-white" : "text-slate-300"}`} style={{ paddingLeft: `${s.depth * 0.6}rem` }}>
              {s.name}
            </span>
            <span className="relative h-4 rounded bg-white/5">
              <span className="absolute inset-y-0 rounded" style={{ left: pct(s.start / 100), width: pct(s.dur / 100), background: s.color, opacity: sel === i ? 1 : 0.6 }} />
            </span>
          </button>
        ))}
        <div className="grid grid-cols-[9.5rem_1fr] text-[10px] text-slate-500">
          <span />
          <span className="flex justify-between">
            <span>0 ms</span>
            <span>500 ms</span>
            <span>1,000 ms</span>
          </span>
        </div>
      </div>
      <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
        <div className="rounded-xl bg-white/5 p-2 text-slate-300">
          <b className="text-white">{SEGMENTS[sel].name}</b>: {SEGMENTS[sel].dur * 10} ms.{" "}
          {sel === 4 ? "The third-party call is the bottleneck." : sel === 2 ? "A cold start. Provisioned concurrency would remove it." : sel === 0 ? "This segment covers the whole request." : "Only a small part of the total."}
        </div>
        <div className="rounded-xl bg-white/5 p-2 text-xs text-slate-400">
          <div>
            <span className="text-amber-300">Annotation</span> customerTier: &quot;gold&quot;. Indexed, so you can search traces by it
          </div>
          <div className="mt-1">
            <span className="text-sky-300">Metadata</span> cartJson: {"{…}"}. Stored with the trace, but you can&apos;t search by it
          </div>
        </div>
      </div>
    </div>
  );
}
