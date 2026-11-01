"use client";

import { useState } from "react";
import { LabHeader, type GoalProps } from "@/components/learn/blocks";
import { BlockIcon } from "@/components/learn/block-icons";

// ───────────── Shared responsibility sorter (EC2 · RDS · Lambda) ─────────────

type Owner = "aws" | "you";

const SERVICES = {
  ec2: {
    name: "Amazon EC2",
    icon: "🖥️",
    model: "Infrastructure (IaaS): you manage almost everything above the hypervisor.",
    duties: [
      { t: "Physical security of the data center", owner: "aws" },
      { t: "Hypervisor and host hardware", owner: "aws" },
      { t: "Patching the guest operating system", owner: "you" },
      { t: "Installing and patching application software", owner: "you" },
      { t: "Security group rules for the instance", owner: "you" },
      { t: "Encrypting the data on your EBS volumes", owner: "you" },
    ],
  },
  rds: {
    name: "Amazon RDS",
    icon: "🗄️",
    model: "Managed database: AWS takes over the OS and database engine.",
    duties: [
      { t: "Physical security of the data center", owner: "aws" },
      { t: "Patching the database host's operating system", owner: "aws" },
      { t: "Applying database engine patches", owner: "aws" },
      { t: "Creating database users and their permissions", owner: "you" },
      { t: "Security group rules that allow access to the database", owner: "you" },
      { t: "Choosing to turn on encryption at rest", owner: "you" },
    ],
  },
  lambda: {
    name: "AWS Lambda",
    icon: "λ",
    model: "Serverless: AWS runs the servers, OS, and managed runtimes. You bring code and permissions.",
    duties: [
      { t: "Physical security of the data center", owner: "aws" },
      { t: "Patching the OS and managed runtime", owner: "aws" },
      { t: "Provisioning and scaling the servers that run functions", owner: "aws" },
      { t: "The function's code and its dependencies", owner: "you" },
      { t: "IAM permissions in the function's execution role", owner: "you" },
      { t: "Protecting the data the function stores and returns", owner: "you" },
    ],
  },
} as const satisfies Record<string, { name: string; icon: string; model: string; duties: readonly { t: string; owner: Owner }[] }>;

type ServiceId = keyof typeof SERVICES;
const SERVICE_IDS = Object.keys(SERVICES) as ServiceId[];

function solved(svc: ServiceId, a: Record<number, Owner> | undefined) {
  return SERVICES[svc].duties.every((d, i) => a?.[i] === d.owner);
}

export function ResponsibilityShiftLab({ goal, onSolved }: GoalProps<"ec2" | "allServices">) {
  const [svc, setSvc] = useState<ServiceId>("ec2");
  const [answers, setAnswers] = useState<Partial<Record<ServiceId, Record<number, Owner>>>>({});
  const s = SERVICES[svc];
  const mine = answers[svc] ?? {};
  const done = Object.keys(mine).length === s.duties.length;
  const right = s.duties.filter((d, i) => mine[i] === d.owner).length;
  const youCount = s.duties.filter((d) => d.owner === "you").length;

  function pick(i: number, o: Owner) {
    const next = { ...answers, [svc]: { ...mine, [i]: o } };
    setAnswers(next);
    if (goal === "ec2" && solved("ec2", next.ec2)) onSolved?.();
    if (goal === "allServices" && SERVICE_IDS.every((id) => solved(id, next[id]))) onSolved?.();
  }

  return (
    <div>
      <LabHeader title="Who patches what?" hint="Pick a service, then tap AWS or You for each task. Watch the line between you and AWS move as the service gets more managed." />
      <div className="flex flex-wrap gap-2">
        {SERVICE_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setSvc(id)}
            className={`rounded-full border px-3 py-1 text-sm ${svc === id ? "border-amber-400 bg-amber-400/20 text-white" : "border-white/10 text-slate-300"}`}
          >
            <BlockIcon icon={SERVICES[id].icon} className="inline-block size-[1.1em] align-[-0.15em]" /> {SERVICES[id].name} {solved(id, answers[id]) && <BlockIcon icon="✓" className="inline-block size-[1.1em] align-[-0.15em]" />}
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm text-slate-300">{s.model}</p>
      <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-slate-800" aria-hidden>
        <div className="bg-sky-400 transition-all" style={{ width: `${((s.duties.length - youCount) / s.duties.length) * 100}%` }} />
        <div className="bg-emerald-400 transition-all" style={{ width: `${(youCount / s.duties.length) * 100}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
        <span className="text-sky-300"><BlockIcon icon="☁️" className="inline-block size-[1.1em] align-[-0.15em]" /> AWS: security OF the cloud</span>
        <span className="text-emerald-300"><BlockIcon icon="🧑‍💻" className="inline-block size-[1.1em] align-[-0.15em]" /> You: security IN the cloud</span>
      </div>
      <div className="mt-3 grid gap-2">
        {s.duties.map((d, i) => {
          const a = mine[i];
          const ok = a === d.owner;
          return (
            <div key={d.t} className={`flex flex-wrap items-center gap-2 rounded-xl border p-2 ${a ? (ok ? "border-emerald-400/50 bg-emerald-400/10" : "border-rose-400/50 bg-rose-400/10") : "border-white/10 bg-white/5"}`}>
              <span className="min-w-0 flex-1 text-sm text-slate-100">{d.t}</span>
              {(["aws", "you"] as const).map((o) => (
                <button
                  key={o}
                  type="button"
                  disabled={!!a}
                  onClick={() => pick(i, o)}
                  className={`rounded-lg px-3 py-1 text-sm font-bold ${a === o ? (ok ? "bg-emerald-400 text-slate-950" : "bg-rose-400 text-slate-950") : "bg-slate-800 text-slate-200"} disabled:cursor-default`}
                >
                  {o === "aws" ? "AWS" : "You"}
                </button>
              ))}
              {a && !ok && <span className="w-full text-xs text-rose-200">On {s.name} this is {d.owner === "aws" ? "AWS's job" : "your job"}.</span>}
            </div>
          );
        })}
      </div>
      {done && (
        <div className="pop-in mt-3 flex items-center justify-between rounded-xl bg-white/5 p-3 text-sm">
          <span className="text-white">
            {s.name}: {right}/{s.duties.length} correct
          </span>
          <button type="button" onClick={() => setAnswers({ ...answers, [svc]: {} })} className="text-sky-300 underline">
            Try again
          </button>
        </div>
      )}
      <p className="mt-2 text-xs text-muted-foreground">Shared controls on every service: patch management, configuration management, and awareness and training. Each side does its part.</p>
    </div>
  );
}

// ───────────── Pricing-model picker ─────────────

const OPTIONS = [
  { id: "od", icon: "⏱️", name: "On-Demand", blurb: "Pay by the second or hour. No commitment." },
  { id: "sp", icon: "📉", name: "Savings Plans", blurb: "Commit to $/hour of spend for 1 or 3 years. Flexible across instance families and Regions (Compute Savings Plans also cover Fargate and Lambda)." },
  { id: "ri", icon: "📌", name: "Reserved Instances", blurb: "Commit to an instance configuration for 1 or 3 years. A zonal RI also reserves capacity in one AZ." },
  { id: "spot", icon: "🎯", name: "Spot Instances", blurb: "Spare EC2 capacity at the deepest discount. AWS can reclaim it with a 2-minute warning." },
  { id: "dh", icon: "🏠", name: "Dedicated Hosts", blurb: "A whole physical server for you. Use your own per-socket or per-core licenses." },
] as const;

type OptionId = (typeof OPTIONS)[number]["id"];

const WORKLOADS: { icon: string; text: string; best: OptionId; why: string }[] = [
  { icon: "🧪", text: "A two-week load test with unpredictable usage that must not be interrupted", best: "od", why: "Short and unpredictable: no commitment pays off, and interruptions aren't allowed." },
  { icon: "🎞️", text: "Overnight video rendering that can stop and resume at any time", best: "spot", why: "Fault-tolerant and flexible on timing: the classic Spot workload." },
  { icon: "🔀", text: "Steady compute spend for 3 years, while the team moves between EC2 instance families, Fargate, and Lambda", best: "sp", why: "A Compute Savings Plan discounts steady spend across instance families, Fargate, and Lambda." },
  { icon: "📦", text: "A web server on one instance type in one AZ, 24/7 for a year, that needs capacity reserved there", best: "ri", why: "A zonal Reserved Instance gives the discount and a capacity reservation in that AZ." },
  { icon: "📜", text: "Server software whose existing license is tied to physical cores (bring your own license)", best: "dh", why: "Dedicated Hosts expose physical sockets and cores so you can use per-core licenses." },
];

const PITFALL: Record<OptionId, string> = {
  od: "Works, but you pay the highest rate for something you could have discounted.",
  sp: "A 1- or 3-year commitment for a workload that doesn't need one (or needs something Savings Plans don't give).",
  ri: "A commitment to one configuration doesn't fit this workload.",
  spot: "Spot capacity can be reclaimed with a 2-minute warning. This workload can't take that.",
  dh: "A whole physical server is the most expensive choice and only needed for license or compliance reasons.",
};

export function PricingPickerLab({ goal, onSolved }: GoalProps<"bestFit">) {
  const [picks, setPicks] = useState<Record<number, OptionId>>({});
  const right = WORKLOADS.filter((w, i) => picks[i] === w.best).length;
  const done = Object.keys(picks).length === WORKLOADS.length;

  function pick(i: number, o: OptionId) {
    const next = { ...picks, [i]: o };
    setPicks(next);
    if (goal === "bestFit" && WORKLOADS.every((w, k) => next[k] === w.best)) onSolved?.();
  }

  return (
    <div>
      <LabHeader title="Pick the pricing model" hint="Match each workload to its best EC2 purchasing option. You can change your mind until every row is green." />
      <div className="grid gap-2 sm:grid-cols-5">
        {OPTIONS.map((o) => (
          <div key={o.id} className="rounded-xl border border-white/10 bg-slate-950/60 p-2">
            <div className="text-sm font-semibold text-white">
              <BlockIcon icon={o.icon} className="inline-block size-[1.1em] align-[-0.15em]" /> {o.name}
            </div>
            <div className="mt-1 text-[11px] leading-snug text-slate-400">{o.blurb}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-2">
        {WORKLOADS.map((w, i) => {
          const p = picks[i];
          const ok = p === w.best;
          return (
            <div key={w.text} className={`rounded-xl border p-2 ${p ? (ok ? "border-emerald-400/50 bg-emerald-400/10" : "border-rose-400/50 bg-rose-400/10") : "border-white/10 bg-white/5"}`}>
              <div className="text-sm text-slate-100">
                <span className="mr-1"><BlockIcon icon={w.icon} className="inline-block size-[1.1em] align-[-0.15em]" /></span>
                {w.text}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    disabled={ok}
                    onClick={() => pick(i, o.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold ${p === o.id ? (ok ? "bg-emerald-400 text-slate-950" : "bg-rose-400 text-slate-950") : "bg-slate-800 text-slate-200"} disabled:cursor-default`}
                  >
                    <BlockIcon icon={o.icon} className="inline-block size-[1.1em] align-[-0.15em]" /> {o.name}
                  </button>
                ))}
              </div>
              {p && <div className={`mt-1.5 text-xs ${ok ? "text-emerald-200" : "text-rose-200"}`}>{ok ? w.why : PITFALL[p]}</div>}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-white/5 p-3 text-sm">
        <span className="text-white">
          {right}/{WORKLOADS.length} best fits {done && right === WORKLOADS.length && <BlockIcon icon="🎉" className="inline-block size-[1.1em] align-[-0.15em]" />}
        </span>
        <button type="button" onClick={() => setPicks({})} className="text-sky-300 underline">
          Reset
        </button>
      </div>
    </div>
  );
}

// ───────────── Support-plan chooser ─────────────

const PLANS = [
  { id: "basic", icon: "🆓", name: "Basic", color: "#94a3b8", perks: ["Included for every account", "24/7 customer service for account and billing", "Documentation, whitepapers, AWS re:Post", "Core Trusted Advisor checks and AWS Health"] },
  { id: "bplus", icon: "💼", name: "Business Support+", color: "#38bdf8", perks: ["24/7 phone, web, and chat with Cloud Support Engineers", "AI-powered contextual help", "Under 30 minutes for business-critical system down", "Full set of Trusted Advisor checks, AWS Support API"] },
  { id: "ent", icon: "🏢", name: "Enterprise Support", color: "#a78bfa", perks: ["Everything in Business Support+", "Designated Technical Account Manager (TAM)", "Up to 15-minute response for critical cases", "AWS Security Incident Response, AWS Countdown"] },
  { id: "uo", icon: "🛰️", name: "Unified Operations", color: "#f59e0b", perks: ["Designated TAM plus Domain Specialist Engineers", "Incident Management Engineers respond within about 5 minutes", "Architecture guidance and infrastructure event management", "For mission-critical workloads at scale"] },
] as const;

type PlanId = (typeof PLANS)[number]["id"];

const CASES: { text: string; best: PlanId; why: string }[] = [
  { text: "A student's learning account. Only needs billing help, documentation, and community answers.", best: "basic", why: "Basic is free and covers billing, account help, docs, and re:Post." },
  { text: "A startup running production. Wants 24/7 phone and chat with engineers and AI-assisted troubleshooting at the lowest price.", best: "bplus", why: "Business Support+ is the entry plan with 24/7 engineer access and AI-powered help." },
  { text: "A bank wants a designated Technical Account Manager and responses within 15 minutes for critical outages.", best: "ent", why: "A designated TAM and 15-minute critical response are Enterprise Support features." },
  { text: "A global retailer with mission-critical systems wants a designated team of domain specialists and incident engineers who respond in minutes.", best: "uo", why: "Unified Operations adds Domain Specialist Engineers and incident managers who respond within about 5 minutes." },
  { text: "A small team needs the full set of Trusted Advisor checks and programmatic access to the AWS Support API, nothing more.", best: "bplus", why: "Full Trusted Advisor checks and the Support API start at Business Support+." },
];

export function SupportPlanLab({ goal, onSolved }: GoalProps<"allRight">) {
  const [picks, setPicks] = useState<Record<number, PlanId>>({});
  const [peek, setPeek] = useState<PlanId>("basic");
  const right = CASES.filter((c, i) => picks[i] === c.best).length;
  const plan = PLANS.find((p) => p.id === peek) ?? PLANS[0];

  function pick(i: number, p: PlanId) {
    const next = { ...picks, [i]: p };
    setPicks(next);
    setPeek(p);
    if (goal === "allRight" && CASES.every((c, k) => next[k] === c.best)) onSolved?.();
  }

  return (
    <div>
      <LabHeader title="Choose the support plan" hint="Tap a plan to see what it includes, then pick the cheapest plan that meets each customer's needs." />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PLANS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPeek(p.id)}
            className="rounded-xl border bg-slate-950/60 p-2 text-left"
            style={{ borderColor: peek === p.id ? p.color : "rgb(255 255 255 / 0.1)", boxShadow: peek === p.id ? `0 0 0 3px ${p.color}33` : undefined }}
          >
            <div className="text-xl"><BlockIcon icon={p.icon} className="inline-block size-[1.1em] align-[-0.15em]" /></div>
            <div className="text-sm font-semibold text-white">{p.name}</div>
          </button>
        ))}
      </div>
      <ul className="pop-in mt-2 grid gap-1 rounded-xl border p-3 text-sm text-slate-200" key={plan.id} style={{ borderColor: `${plan.color}55`, background: `${plan.color}12` }}>
        {plan.perks.map((x) => (
          <li key={x}>• {x}</li>
        ))}
      </ul>
      <div className="mt-3 grid gap-2">
        {CASES.map((c, i) => {
          const p = picks[i];
          const ok = p === c.best;
          return (
            <div key={c.text} className={`rounded-xl border p-2 ${p ? (ok ? "border-emerald-400/50 bg-emerald-400/10" : "border-rose-400/50 bg-rose-400/10") : "border-white/10 bg-white/5"}`}>
              <div className="text-sm text-slate-100">{c.text}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PLANS.map((pl) => (
                  <button
                    key={pl.id}
                    type="button"
                    disabled={ok}
                    onClick={() => pick(i, pl.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold ${p === pl.id ? (ok ? "bg-emerald-400 text-slate-950" : "bg-rose-400 text-slate-950") : "bg-slate-800 text-slate-200"} disabled:cursor-default`}
                  >
                    <BlockIcon icon={pl.icon} className="inline-block size-[1.1em] align-[-0.15em]" /> {pl.name}
                  </button>
                ))}
              </div>
              {p && <div className={`mt-1.5 text-xs ${ok ? "text-emerald-200" : "text-rose-200"}`}>{ok ? c.why : "Either it doesn't meet the need, or a cheaper plan does."}</div>}
            </div>
          );
        })}
      </div>
      <div className="mt-3 rounded-xl bg-white/5 p-3 text-sm text-white">
        {right}/{CASES.length} customers matched
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Developer Support and Business Support (classic) no longer accept new subscriptions and end January 1, 2027.</p>
    </div>
  );
}
