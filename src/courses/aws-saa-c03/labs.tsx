"use client";

import { useState } from "react";
import { LabHeader, type GoalProps } from "@/components/learn/blocks";
import { pct } from "@/engine/game";
import { BlockIcon } from "@/components/learn/block-icons";

// ───────────── VPC builder ─────────────

type NatPlace = "none" | "public" | "private";
type PrivRoute = "none" | "nat" | "igw";

export interface VpcState {
  igw: boolean;
  nat: NatPlace;
  pubRoute: boolean;
  privRoute: PrivRoute;
  publicIp: boolean;
  s3Endpoint: boolean;
}

interface Probe {
  ok: boolean;
  text: string;
}

/** Pure evaluation of the VPC so the lab (and tests) agree on what works. */
export function probeVpc(v: VpcState) {
  const natProblem =
    v.nat === "none"
      ? "There's no NAT gateway."
      : v.nat === "private"
        ? "The NAT gateway sits in the private subnet. A public NAT gateway must live in a public subnet, whose route table sends 0.0.0.0/0 to the internet gateway."
        : !v.igw
          ? "No internet gateway is attached to the VPC, so the NAT gateway has nowhere to send traffic."
          : !v.pubRoute
            ? "The public subnet's route table has no route sending 0.0.0.0/0 to the IGW, so the NAT gateway can't reach the internet."
            : null;

  let egress: Probe;
  if (v.privRoute === "none") egress = { ok: false, text: "The private route table has no default route: only local VPC traffic (and endpoints) can leave the subnet." };
  else if (v.privRoute === "igw") {
    if (!v.igw) egress = { ok: false, text: "The route points at an internet gateway that isn't attached." };
    else if (!v.publicIp) egress = { ok: false, text: "The route goes straight to the IGW, but the instance has no public IP, so the IGW has no address to translate it to." };
    else egress = { ok: true, text: "Works, but only because the subnet is now really public: it routes to the IGW and the instance has a public IP." };
  } else egress = natProblem ? { ok: false, text: natProblem } : { ok: true, text: "Outbound via the NAT gateway in the public subnet. Replies come back; new inbound connections don't." };

  const reachable = v.privRoute === "igw" && v.igw && v.publicIp;
  const inbound: Probe = reachable
    ? { ok: false, text: "Reachable from the internet: the subnet routes to the IGW and the instance has a public IP. Only its security group stands in the way." }
    : { ok: true, text: "Not reachable: there's no inbound path. A NAT gateway only lets through traffic the instance started." };

  const s3: Probe = v.s3Endpoint
    ? { ok: true, text: "Private path through the S3 gateway endpoint (a prefix-list route). No internet, no NAT data-processing charge." }
    : egress.ok
      ? { ok: true, text: "Works over the internet path. Through a NAT gateway you pay per GB processed; a gateway endpoint would be free." }
      : { ok: false, text: "No route to S3: no internet path and no VPC endpoint." };

  return { egress, inbound, s3, viaEndpoint: v.s3Endpoint };
}

const VPC_START: VpcState = { igw: true, nat: "private", pubRoute: false, privRoute: "igw", publicIp: true, s3Endpoint: false };

export function VpcBuilderLab({ goal, onSolved }: GoalProps<"egress" | "endpoint">) {
  const [v, setV] = useState<VpcState>(VPC_START);
  const [result, setResult] = useState<ReturnType<typeof probeVpc> | null>(null);
  const set = (patch: Partial<VpcState>) => {
    setV({ ...v, ...patch });
    setResult(null);
  };

  function test() {
    const r = probeVpc(v);
    setResult(r);
    if (goal === "egress" && r.egress.ok && r.inbound.ok) onSolved?.();
    if (goal === "endpoint" && r.viaEndpoint && !r.egress.ok && r.inbound.ok) onSolved?.();
  }

  const chip = (on: boolean) => `rounded-lg border px-2 py-1 text-xs font-mono transition ${on ? "text-white" : "border-white/10 text-muted-foreground line-through"}`;
  const routeTargets: PrivRoute[] = ["none", "nat", "igw"];

  return (
    <div>
      <LabHeader
        title="VPC builder"
        hint="This VPC is broken. Attach gateways, move the NAT gateway, and edit the route tables, then run the connectivity tests."
      />
      <div className="relative rounded-2xl border-2 border-dashed border-amber-400/50 bg-amber-400/[0.03] p-3 pt-7">
        <span className="absolute left-3 top-1.5 text-xs font-bold text-amber-300">VPC 10.0.0.0/16</span>
        <button
          type="button"
          onClick={() => set({ igw: !v.igw })}
          className={`absolute -top-4 right-4 rounded-full border px-3 py-1 text-xs font-bold ${v.igw ? "border-emerald-400 bg-emerald-400/20 text-emerald-100" : "border-white/20 bg-slate-900 text-slate-400"}`}
        >
          <BlockIcon icon="🚪" className="inline-block size-[1.1em] align-[-0.15em]" /> Internet gateway: {v.igw ? "attached" : "detached"}
        </button>
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Public subnet */}
          <div className="rounded-xl border border-sky-400/40 bg-sky-400/5 p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-300">Public subnet · 10.0.1.0/24</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-lg bg-slate-900 px-2 py-1 text-sm"><BlockIcon icon="🌐" className="inline-block size-[1.1em] align-[-0.15em]" /> Web server (public IP)</span>
              <button
                type="button"
                onClick={() => set({ nat: v.nat === "public" ? "none" : "public" })}
                className={`rounded-lg border px-2 py-1 text-sm ${v.nat === "public" ? "border-emerald-400 bg-emerald-400/20 text-white" : "border-dashed border-white/20 text-slate-400"}`}
              >
                <BlockIcon icon="🔁" className="inline-block size-[1.1em] align-[-0.15em]" /> {v.nat === "public" ? "NAT gateway" : "+ place NAT here"}
              </button>
            </div>
            <div className="mt-3 text-[11px] uppercase tracking-wider text-slate-400">Route table</div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <span className={chip(true)} style={{ borderColor: "#38bdf855" }}>10.0.0.0/16 → local</span>
              <button type="button" onClick={() => set({ pubRoute: !v.pubRoute })} className={chip(v.pubRoute)} style={v.pubRoute ? { borderColor: "#34d399" } : undefined}>
                0.0.0.0/0 → igw
              </button>
            </div>
          </div>
          {/* Private subnet */}
          <div className="rounded-xl border border-fuchsia-400/40 bg-fuchsia-400/5 p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-fuchsia-300">Private subnet · 10.0.2.0/24</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => set({ publicIp: !v.publicIp })}
                className={`rounded-lg border px-2 py-1 text-sm ${v.publicIp ? "border-rose-400/60 text-rose-100" : "border-white/10 text-slate-200"}`}
              >
                <BlockIcon icon="🗄️" className="inline-block size-[1.1em] align-[-0.15em]" /> App instance {v.publicIp ? "(public IP!)" : "(private IP only)"}
              </button>
              <button
                type="button"
                onClick={() => set({ nat: v.nat === "private" ? "none" : "private" })}
                className={`rounded-lg border px-2 py-1 text-sm ${v.nat === "private" ? "border-rose-400/60 bg-rose-400/10 text-white" : "border-dashed border-white/20 text-slate-400"}`}
              >
                <BlockIcon icon="🔁" className="inline-block size-[1.1em] align-[-0.15em]" /> {v.nat === "private" ? "NAT gateway" : "+ place NAT here"}
              </button>
            </div>
            <div className="mt-3 text-[11px] uppercase tracking-wider text-slate-400">Route table</div>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span className={chip(true)} style={{ borderColor: "#a78bfa55" }}>10.0.0.0/16 → local</span>
              <span className="flex overflow-hidden rounded-lg border border-white/10 text-xs">
                <span className="bg-white/5 px-2 py-1 font-mono text-slate-300">0.0.0.0/0 →</span>
                {routeTargets.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set({ privRoute: t })}
                    className={`px-2 py-1 font-mono ${v.privRoute === t ? "bg-fuchsia-400/30 text-white" : "text-slate-400"}`}
                  >
                    {t === "none" ? "(none)" : t}
                  </button>
                ))}
              </span>
              <button type="button" onClick={() => set({ s3Endpoint: !v.s3Endpoint })} className={chip(v.s3Endpoint)} style={v.s3Endpoint ? { borderColor: "#34d399" } : undefined}>
                pl-s3 → vpce (gateway endpoint)
              </button>
            </div>
          </div>
        </div>
      </div>

      <button type="button" onClick={test} className="mt-3 rounded-lg bg-reward px-4 py-2 font-semibold text-primary-foreground">
        <BlockIcon icon="🧪" className="inline-block size-[1.1em] align-[-0.15em]" /> Run connectivity tests
      </button>

      {result && (
        <div className="pop-in mt-3 grid gap-2">
          {[
            { label: "App instance → internet (download patches)", p: result.egress },
            { label: "Internet → app instance (new inbound connection)", p: result.inbound },
            { label: "App instance → Amazon S3", p: result.s3 },
          ].map(({ label, p }) => (
            <div key={label} className={`rounded-xl border p-3 text-sm ${p.ok ? "border-emerald-400/40 bg-emerald-400/10" : "border-rose-400/40 bg-rose-400/10"}`}>
              <div className="font-semibold text-white">
                {p.ok ? <BlockIcon icon="✓" className="inline-block size-[1.1em] align-[-0.15em]" /> : <BlockIcon icon="✗" className="inline-block size-[1.1em] align-[-0.15em]" />} {label}
              </div>
              <div className="mt-0.5 text-slate-300">{p.text}</div>
            </div>
          ))}
        </div>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        A subnet is &quot;public&quot; only because its route table sends 0.0.0.0/0 to an internet gateway. For high availability, run one NAT gateway per Availability Zone.
      </p>
    </div>
  );
}

// ───────────── Disaster recovery strategy picker ─────────────

const DR_STEPS = [0, 1, 5, 15, 30, 60, 240, 720, 1440];
const DR_LABELS = ["≈ 0", "1 min", "5 min", "15 min", "30 min", "1 h", "4 h", "12 h", "24 h"];

export const DR_STRATEGIES = [
  {
    id: "backup",
    name: "Backup & restore",
    icon: "💾",
    rpo: 60,
    rto: 240,
    band: "Hours",
    cost: 1,
    text: "Back up data and configuration, copy backups to the recovery Region, and rebuild everything from infrastructure as code after a disaster.",
  },
  {
    id: "pilot",
    name: "Pilot light",
    icon: "🕯️",
    rpo: 15,
    rto: 30,
    band: "Tens of minutes",
    cost: 2,
    text: "Data replicates live to the recovery Region and core infrastructure exists, but application servers are switched off. Turn them on and scale out to recover.",
  },
  {
    id: "warm",
    name: "Warm standby",
    icon: "♨️",
    rpo: 5,
    rto: 5,
    band: "Minutes",
    cost: 3,
    text: "A scaled-down but fully working copy of production runs all the time. Scale it up to full size and shift traffic to recover.",
  },
  {
    id: "active",
    name: "Multi-site active/active",
    icon: "🌍",
    rpo: 0,
    rto: 0,
    band: "Near zero",
    cost: 4,
    text: "Full production runs in two or more Regions and serves traffic at the same time. Lowest downtime and data loss, highest cost.",
  },
] as const;

export const DR_SCENARIOS = [
  { id: "wiki", icon: "📚", name: "Internal wiki", note: "Losing a day of edits is acceptable; back tomorrow is fine.", rpo: 8, rto: 8 },
  { id: "inventory", icon: "📦", name: "Inventory service", note: "Lose at most 30 minutes of updates; be back within an hour.", rpo: 4, rto: 5 },
  { id: "portal", icon: "🧑‍💻", name: "Customer portal", note: "Lose at most 15 minutes of data; be back within 15 minutes.", rpo: 3, rto: 3 },
  { id: "payments", icon: "💳", name: "Payments platform", note: "No data loss and no noticeable downtime, whatever it costs.", rpo: 0, rto: 0 },
] as const;

/** Cheapest strategy whose typical RPO and RTO meet the targets (in minutes). */
export function cheapestDr(rpoMin: number, rtoMin: number) {
  return DR_STRATEGIES.find((s) => s.rpo <= rpoMin && s.rto <= rtoMin) ?? DR_STRATEGIES[DR_STRATEGIES.length - 1];
}

export function DrStrategyLab({ goal, onSolved }: GoalProps<"all">) {
  const [rpoI, setRpoI] = useState(6);
  const [rtoI, setRtoI] = useState(6);
  const [scenario, setScenario] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [solved, setSolved] = useState<string[]>([]);

  const rpo = DR_STEPS[rpoI];
  const rto = DR_STEPS[rtoI];
  const best = cheapestDr(rpo, rto);

  function chooseScenario(id: string) {
    const s = DR_SCENARIOS.find((x) => x.id === id)!;
    setScenario(id);
    setRpoI(s.rpo);
    setRtoI(s.rto);
    setPicked(null);
  }

  function pick(id: string) {
    setPicked(id);
    if (id === best.id && scenario && !solved.includes(scenario)) {
      const next = [...solved, scenario];
      setSolved(next);
      if (goal === "all" && next.length === DR_SCENARIOS.length) onSolved?.();
    }
  }

  const p = DR_STRATEGIES.find((s) => s.id === picked);
  const verdict = p
    ? p.rpo > rpo || p.rto > rto
      ? {
          tone: "border-rose-400/40 bg-rose-400/10",
          text: `Misses the target: ${p.name} typically gives ${p.band.toLowerCase()} of ${p.rpo > rpo && p.rto > rto ? "data loss and downtime" : p.rpo > rpo ? "data loss (RPO)" : "downtime (RTO)"}.`,
        }
      : p.id === best.id
        ? { tone: "border-emerald-400/40 bg-emerald-400/10", text: `${p.name} meets both targets, and nothing cheaper does.` }
        : { tone: "border-amber-400/40 bg-amber-400/10", text: `It works, but ${best.name} also meets both targets for less money.` }
    : null;

  return (
    <div>
      <LabHeader title="Pick the DR strategy" hint="Pick a workload (or drag the sliders), then choose the cheapest strategy that meets both the RPO and the RTO." />
      <div className="flex flex-wrap gap-2">
        {DR_SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => chooseScenario(s.id)}
            className={`rounded-full border px-3 py-1 text-sm ${scenario === s.id ? "border-emerald-400 bg-emerald-400/20 text-white" : "border-white/10 text-slate-300"}`}
          >
            <BlockIcon icon={solved.includes(s.id) ? "✅" : s.icon} className="inline-block size-[1.1em] align-[-0.15em]" /> {s.name}
          </button>
        ))}
      </div>
      {scenario && <p className="mt-2 text-sm text-slate-300">{DR_SCENARIOS.find((s) => s.id === scenario)!.note}</p>}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {[
          { label: "RPO: how much data can you lose?", i: rpoI, set: setRpoI, color: "accent-sky-400" },
          { label: "RTO: how long can you be down?", i: rtoI, set: setRtoI, color: "accent-fuchsia-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-white">{s.label}</span>
              <span className="font-mono text-amber-300">{DR_LABELS[s.i]}</span>
            </div>
            <input
              type="range"
              min={0}
              max={DR_STEPS.length - 1}
              value={s.i}
              onChange={(e) => {
                s.set(Number(e.target.value));
                setScenario(null);
                setPicked(null);
              }}
              className={`w-full ${s.color}`}
              aria-label={s.label}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {DR_STRATEGIES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => pick(s.id)}
            className={`rounded-xl border bg-slate-950/60 p-3 text-left transition hover:-translate-y-0.5 ${picked === s.id ? "border-amber-400" : "border-white/10"}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">
                <BlockIcon icon={s.icon} className="inline-block size-[1.1em] align-[-0.15em]" /> {s.name}
              </span>
              <span className="font-mono text-xs text-emerald-300">{"$".repeat(s.cost)}</span>
            </div>
            <div className="mt-1 text-xs text-slate-400">{s.text}</div>
            <div className="mt-1 text-xs text-sky-300">Typical RPO/RTO: {s.band.toLowerCase()}</div>
          </button>
        ))}
      </div>
      {verdict && <div className={`pop-in mt-3 rounded-xl border p-3 text-sm text-white ${verdict.tone}`}>{verdict.text}</div>}
      <p className="mt-2 text-xs text-muted-foreground">
        Bands follow the AWS disaster recovery whitepaper. Real RPO and RTO depend on your implementation, so test your recovery. Solved {solved.length}/{DR_SCENARIOS.length} workloads.
      </p>
    </div>
  );
}

// ───────────── S3 storage-class cost chooser ─────────────

/**
 * Illustrative unit prices (cents per GB-month for storage, cents per GB retrieved).
 * Chosen to show the trade-offs, not AWS list prices: prices vary by Region and change.
 */
export const S3_CLASSES = [
  { id: "standard", name: "S3 Standard", icon: "🪣", storage: 2.3, retrieval: 0, minDays: 0, waitHours: 0, multiAz: true },
  { id: "it", name: "S3 Intelligent-Tiering", icon: "🤖", storage: 0, retrieval: 0, minDays: 0, waitHours: 0, multiAz: true },
  { id: "sia", name: "S3 Standard-IA", icon: "🧊", storage: 1.25, retrieval: 1, minDays: 30, waitHours: 0, multiAz: true },
  { id: "ozia", name: "S3 One Zone-IA", icon: "1️⃣", storage: 1.0, retrieval: 1, minDays: 30, waitHours: 0, multiAz: false },
  { id: "gir", name: "S3 Glacier Instant Retrieval", icon: "⚡", storage: 0.4, retrieval: 3, minDays: 90, waitHours: 0, multiAz: true },
  { id: "gfr", name: "S3 Glacier Flexible Retrieval", icon: "🏔️", storage: 0.36, retrieval: 1, minDays: 90, waitHours: 5, multiAz: true },
  { id: "da", name: "S3 Glacier Deep Archive", icon: "🕳️", storage: 0.099, retrieval: 2, minDays: 180, waitHours: 12, multiAz: true },
] as const;

type S3Class = (typeof S3_CLASSES)[number];

export interface S3Scenario {
  id: string;
  icon: string;
  name: string;
  gb: number;
  /** Share of the data read back per month (1 = all of it once). */
  reads: number;
  /** How long each object is kept. */
  days: number;
  /** Longest acceptable wait for a read, in hours (0 = milliseconds). */
  maxWait: number;
  multiAz: boolean;
  unpredictable?: boolean;
}

export const S3_SCENARIOS: S3Scenario[] = [
  { id: "photos", icon: "🛍️", name: "Busy store's product photos", gb: 2000, reads: 3, days: 365, maxWait: 0, multiAz: true },
  { id: "builds", icon: "🏗️", name: "CI build artifacts, deleted after 7 days", gb: 500, reads: 0.5, days: 7, maxWait: 0, multiAz: true },
  { id: "docs", icon: "📁", name: "Team documents, about half read each month", gb: 1000, reads: 0.6, days: 365, maxWait: 0, multiAz: true },
  { id: "thumbs", icon: "🖼️", name: "Thumbnails you can regenerate, about half read each month", gb: 1000, reads: 0.6, days: 365, maxWait: 0, multiAz: false },
  { id: "scans", icon: "🩻", name: "Patient scans: opened a few times a year, must open instantly", gb: 5000, reads: 0.04, days: 1825, maxWait: 0, multiAz: true },
  { id: "media", icon: "🎞️", name: "Media archive: rare restores, needed within 5 hours", gb: 20000, reads: 0.01, days: 3650, maxWait: 5, multiAz: true },
  { id: "records", icon: "🗄️", name: "Compliance records kept 7 years, 48-hour retrieval is fine", gb: 8000, reads: 0.001, days: 2555, maxWait: 48, multiAz: true },
  { id: "lake", icon: "🌊", name: "Data lake with unknown, changing access patterns", gb: 10000, reads: 0.2, days: 1095, maxWait: 0, multiAz: true, unpredictable: true },
];

const IT_MONITORING = 0.25;

function itStorage(reads: number) {
  return reads >= 0.3 ? 2.3 : reads >= 0.05 ? 1.25 : 0.4;
}

/** Cents per GB-month, including minimum-duration charges and retrieval. */
export function s3CostPerGb(c: S3Class, s: S3Scenario) {
  const base = c.id === "it" ? itStorage(s.reads) + IT_MONITORING : c.storage;
  const storage = c.minDays > s.days ? base * (c.minDays / s.days) : base;
  return storage + c.retrieval * s.reads;
}

export function s3Problem(c: S3Class, s: S3Scenario): string | null {
  if (s.unpredictable && c.id !== "it") return "Access changes unpredictably: any fixed class means guessing, then paying retrieval spikes or idle Standard storage.";
  if (c.waitHours > s.maxWait) return s.maxWait === 0 ? "Reads must be instant (milliseconds), but this class needs a restore first." : `Restores take longer than ${s.maxWait} hours.`;
  if (s.multiAz && !c.multiAz) return "Data must survive the loss of an Availability Zone; One Zone-IA keeps it in one AZ.";
  return null;
}

export function cheapestS3(s: S3Scenario) {
  const valid = S3_CLASSES.filter((c) => !s3Problem(c, s));
  return valid.reduce((a, b) => (s3CostPerGb(b, s) < s3CostPerGb(a, s) ? b : a));
}

const money = (cents: number) => `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export function S3ClassLab({ goal, onSolved }: GoalProps<"five">) {
  const [si, setSi] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [solved, setSolved] = useState<string[]>([]);
  const s = S3_SCENARIOS[si];
  const best = cheapestS3(s);
  const need = 5;

  function pick(id: string) {
    setPicked(id);
    if (id === best.id && !solved.includes(s.id)) {
      const next = [...solved, s.id];
      setSolved(next);
      if (goal === "five" && next.length === need) onSolved?.();
    }
  }

  const rows = S3_CLASSES.map((c) => ({ c, cost: s3CostPerGb(c, s) * s.gb, problem: s3Problem(c, s) }));
  const max = Math.max(...rows.map((r) => r.cost));
  const p = rows.find((r) => r.c.id === picked);

  return (
    <div>
      <LabHeader title="Storage-class cost chooser" hint="Pick a workload, then pick the cheapest S3 storage class that still meets its requirements." />
      <div className="flex flex-wrap gap-2">
        {S3_SCENARIOS.map((x, i) => (
          <button
            key={x.id}
            type="button"
            onClick={() => {
              setSi(i);
              setPicked(null);
            }}
            className={`rounded-full border px-3 py-1 text-sm ${si === i ? "border-sky-400 bg-sky-400/20 text-white" : "border-white/10 text-slate-300"}`}
          >
            <BlockIcon icon={solved.includes(x.id) ? "✅" : x.icon} className="inline-block size-[1.1em] align-[-0.15em]" /> {x.name.split(":")[0].split(",")[0]}
          </button>
        ))}
      </div>
      <div className="mt-3 grid gap-2 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-200 sm:grid-cols-2">
        <div className="sm:col-span-2 font-semibold text-white">
          <BlockIcon icon={s.icon} className="inline-block size-[1.1em] align-[-0.15em]" /> {s.name}
        </div>
        <div><BlockIcon icon="💾" className="inline-block size-[1.1em] align-[-0.15em]" /> {s.gb.toLocaleString("en-US")} GB stored</div>
        <div><BlockIcon icon="📖" className="inline-block size-[1.1em] align-[-0.15em]" /> {s.unpredictable ? "Access pattern unknown and changing" : `${Math.round(s.reads * 100)}% of the data read per month`}</div>
        <div><BlockIcon icon="⏳" className="inline-block size-[1.1em] align-[-0.15em]" /> Each object kept {s.days >= 365 ? `${Math.round(s.days / 365)} year${s.days >= 730 ? "s" : ""}` : `${s.days} days`}</div>
        <div>
          <BlockIcon icon="⚡" className="inline-block size-[1.1em] align-[-0.15em]" /> {s.maxWait === 0 ? "Millisecond access" : `Retrieval within ${s.maxWait} h`} · {s.multiAz ? "must survive an AZ loss" : "re-creatable, one AZ is OK"}
        </div>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {S3_CLASSES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => pick(c.id)}
            className={`rounded-xl border bg-slate-950/60 p-2 text-left text-sm transition hover:-translate-y-0.5 ${picked === c.id ? "border-amber-400" : "border-white/10"}`}
          >
            <div className="font-semibold text-white">
              <BlockIcon icon={c.icon} className="inline-block size-[1.1em] align-[-0.15em]" /> {c.name.replace("S3 ", "")}
            </div>
            <div className="mt-0.5 text-[11px] text-slate-400">
              {c.minDays ? `min ${c.minDays} days` : "no minimum"} · {c.waitHours === 0 ? "ms access" : c.id === "gfr" ? "minutes–hours restore" : "≤ 12–48 h restore"}
              {c.multiAz ? "" : " · 1 AZ"}
            </div>
          </button>
        ))}
      </div>
      {p && (
        <div className="pop-in mt-3 grid gap-2">
          <div
            className={`rounded-xl border p-3 text-sm text-white ${
              p.problem ? "border-rose-400/40 bg-rose-400/10" : p.c.id === best.id ? "border-emerald-400/40 bg-emerald-400/10" : "border-amber-400/40 bg-amber-400/10"
            }`}
          >
            {p.problem ? p.problem : p.c.id === best.id ? `Cheapest class that meets every requirement: about ${money(p.cost)} a month.` : `It works (${money(p.cost)}/month), but ${best.name} meets the requirements for ${money(s3CostPerGb(best, s) * s.gb)}.`}
          </div>
          <div className="grid gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            {rows.map((r) => (
              <div key={r.c.id} className="grid grid-cols-[9rem_1fr_4.5rem] items-center gap-2 text-xs">
                <span className={`truncate ${r.problem ? "text-muted-foreground line-through" : "text-slate-200"}`}>{r.c.name.replace("S3 ", "")}</span>
                <span className="h-3 overflow-hidden rounded-full bg-white/10">
                  <span className="block h-full rounded-full" style={{ width: pct(r.cost / max), background: r.problem ? "#64748b" : r.c.id === best.id ? "#34d399" : "#38bdf8" }} />
                </span>
                <span className="text-right font-mono text-slate-300">{s.unpredictable && r.c.id !== "it" ? "?" : money(r.cost)}</span>
              </div>
            ))}
            <div className="mt-1 text-[11px] text-muted-foreground">Monthly storage + retrieval, including minimum-duration charges. Illustrative unit prices, not AWS list prices.</div>
          </div>
        </div>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        Solved {solved.length} of {S3_SCENARIOS.length} workloads{goal === "five" ? ` (goal: ${need})` : ""}. Check the Amazon S3 pricing page for real prices in your Region.
      </p>
    </div>
  );
}
