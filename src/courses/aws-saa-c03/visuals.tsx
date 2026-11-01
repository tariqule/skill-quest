"use client";

import { useState } from "react";
import { BlockIcon } from "@/components/learn/block-icons";

/** Concept diagrams specific to the Solutions Architect Associate course. */

// ───────────── Route 53 routing policies ─────────────

const ENDPOINTS = ["🇺🇸 us-east-1", "🇮🇪 eu-west-1", "🇦🇺 ap-southeast-2"];

const POLICIES = [
  { id: "simple", name: "Simple", shares: ["one record", "", ""], text: "One record for one resource. If it holds several values, Route 53 returns them all in random order. No health checks.", use: "A single web server" },
  { id: "weighted", name: "Weighted", shares: ["70%", "20%", "10%"], text: "Split traffic by the weights you assign to records with the same name. Weight 0 stops traffic to a record.", use: "Canary releases, blue/green, A/B tests" },
  { id: "latency", name: "Latency", shares: ["users in the Americas", "users in Europe", "users in Oceania"], text: "Answer with the Region that gives the user the lowest network latency, as measured by AWS.", use: "A global app in several Regions" },
  { id: "failover", name: "Failover", shares: ["primary ✓", "secondary (standby)", ""], text: "Active-passive: answer with the primary while its health check passes, otherwise the secondary.", use: "DR to a standby Region or a static S3 site" },
  { id: "geolocation", name: "Geolocation", shares: ["US users", "EU users", "default record"], text: "Answer by the user's continent, country, or US state. Add a default record for locations you don't match.", use: "Content localization, licensing, compliance" },
  { id: "geoproximity", name: "Geoproximity", shares: ["bias +25 (bigger area)", "bias 0", "bias −10"], text: "Route by the distance between users and resources, and shift traffic with a bias. Configured with traffic flow.", use: "Gradually moving traffic between Regions" },
  { id: "multivalue", name: "Multivalue answer", shares: ["healthy ✓", "healthy ✓", "unhealthy ✗"], text: "Return up to eight healthy records, chosen at random. Client-side load balancing with health checks; not a replacement for ELB.", use: "Several healthy IPs for one name" },
  { id: "ip", name: "IP-based", shares: ["ISP A's CIDR", "ISP B's CIDR", "everyone else"], text: "Route by the client's source IP range (CIDR blocks you define).", use: "Sending a known network to a specific endpoint" },
] as const;

export function RoutingPolicies() {
  const [sel, setSel] = useState(1);
  const p = POLICIES[sel];
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {POLICIES.map((x, i) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setSel(i)}
            className={`rounded-full border px-3 py-1 text-sm ${sel === i ? "border-sky-400 bg-sky-400/20 text-white" : "border-white/10 text-slate-300"}`}
          >
            {x.name}
          </button>
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-3">
        <div className="flex items-center justify-center gap-2 text-sm text-slate-200">
          <span className="rounded-lg bg-white/5 px-2 py-1"><BlockIcon icon="🙋" className="inline-block size-[1.1em] align-[-0.15em]" /> users</span>
          <span className="text-muted-foreground">→</span>
          <span className="rounded-lg bg-sky-400/15 px-2 py-1 font-semibold text-sky-200"><BlockIcon icon="🧭" className="inline-block size-[1.1em] align-[-0.15em]" /> Route 53: {p.name}</span>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {ENDPOINTS.map((e, i) => (
            <div
              key={e}
              className={`rounded-xl border p-2 text-center text-sm transition ${p.shares[i] ? (p.shares[i].includes("✗") ? "border-rose-400/50 bg-rose-400/10" : "border-emerald-400/50 bg-emerald-400/10") : "border-white/10 opacity-40"}`}
            >
              <div className="font-semibold text-white">{e}</div>
              <div className="mt-1 text-xs text-slate-300">
                {p.shares[i] ? (
                  <>
                    {p.shares[i].replace(/ [✓✗]$/u, "")}{" "}
                    {/[✓✗]$/u.test(p.shares[i]) && <BlockIcon icon={p.shares[i].slice(-1)} className="inline-block size-[1.1em] align-[-0.15em]" />}
                  </>
                ) : (
                  "not used"
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-2 text-sm text-slate-300">{p.text}</p>
      <p className="mt-1 text-xs text-slate-400">Typical use: {p.use}</p>
    </div>
  );
}

// ───────────── Security groups vs network ACLs ─────────────

const FILTERS = [
  { k: "Applies to", sg: "An ENI / instance", nacl: "A whole subnet" },
  { k: "State", sg: "Stateful: replies are allowed automatically", nacl: "Stateless: allow the return traffic (ephemeral ports) too" },
  { k: "Rules", sg: "Allow rules only", nacl: "Allow and deny rules" },
  { k: "Evaluation", sg: "All rules are evaluated together", nacl: "Numbered rules, lowest number first; first match wins" },
  { k: "Can reference", sg: "Other security groups (for example, allow the ALB's group)", nacl: "CIDR ranges only" },
  { k: "Best for", sg: "Least-privilege access between tiers", nacl: "Blocking a specific IP range at the subnet edge" },
] as const;

export function SgVsNacl() {
  const [row, setRow] = useState<number | null>(null);
  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[30rem] grid-cols-[7rem_1fr_1fr] gap-1.5 text-sm">
        <span />
        <span className="rounded-lg bg-emerald-400/15 px-2 py-1 font-bold text-emerald-200"><BlockIcon icon="🛡️" className="inline-block size-[1.1em] align-[-0.15em]" /> Security group</span>
        <span className="rounded-lg bg-amber-400/15 px-2 py-1 font-bold text-amber-200"><BlockIcon icon="🚧" className="inline-block size-[1.1em] align-[-0.15em]" /> Network ACL</span>
        {FILTERS.map((f, i) => (
          <button key={f.k} type="button" onClick={() => setRow(row === i ? null : i)} className="contents text-left">
            <span className={`rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-wider ${row === i ? "bg-white/10 text-white" : "text-slate-400"}`}>{f.k}</span>
            <span className={`rounded-lg px-2 py-1 ${row === i ? "bg-emerald-400/10 text-white" : "bg-white/[0.03] text-slate-300"}`}>{f.sg}</span>
            <span className={`rounded-lg px-2 py-1 ${row === i ? "bg-amber-400/10 text-white" : "bg-white/[0.03] text-slate-300"}`}>{f.nacl}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
