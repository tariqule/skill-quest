"use client";

import { useState, type CSSProperties } from "react";
import { CodeBlock, Flow, LabHeader, type FlowStep, type GoalProps } from "@/components/learn/blocks";
import { pct } from "@/engine/game";

/** Hands-on labs for the KCNA course. Each one doubles as a challenge through `goal` + `onSolved`. */

// ───────────── Pod scheduling: taints, tolerations, and nodeSelector ─────────────

type TaintKey = "gpu" | "control-plane";
type SelectorKey = "none" | "gpu" | "ssd";

interface LabNode {
  id: string;
  name: string;
  icon: string;
  labels: Partial<Record<Exclude<SelectorKey, "none">, true>>;
  taint?: TaintKey;
}

const NODES: LabNode[] = [
  { id: "std", name: "node-std", icon: "🖥️", labels: {} },
  { id: "ssd", name: "node-ssd", icon: "💽", labels: { ssd: true } },
  { id: "gpu", name: "node-gpu", icon: "🎮", labels: { gpu: true }, taint: "gpu" },
  { id: "cp", name: "control-plane", icon: "🏛️", labels: {}, taint: "control-plane" },
];

const TAINT_TEXT: Record<TaintKey, string> = {
  gpu: "gpu=true:NoSchedule",
  "control-plane": "node-role.kubernetes.io/control-plane:NoSchedule",
};

const SELECTOR_TEXT: Record<Exclude<SelectorKey, "none">, string> = { gpu: "gpu: \"true\"", ssd: "disktype: ssd" };

interface PodSpec {
  selector: SelectorKey;
  tolerations: TaintKey[];
}

const PODS = [
  { id: "trainer", name: "ml-trainer", icon: "🧠", needs: "must run on the GPU node" },
  { id: "db", name: "postgres", icon: "🗄️", needs: "must run on the SSD node" },
  { id: "web", name: "web", icon: "🌐", needs: "anywhere except the GPU and control plane nodes" },
] as const;

type PodId = (typeof PODS)[number]["id"];

interface Placement {
  node: string | null;
  reason: string;
}

/** A tiny, deterministic scheduler: filter (taints, selector), then score (fewest Pods), tie-break by node order. */
function schedule(specs: Record<PodId, PodSpec>): Record<PodId, Placement> {
  const load: Record<string, number> = Object.fromEntries(NODES.map((n) => [n.id, 0]));
  const out = {} as Record<PodId, Placement>;
  for (const p of PODS) {
    const s = specs[p.id];
    let tainted = 0;
    let mismatch = 0;
    const feasible = NODES.filter((n) => {
      if (n.taint && !s.tolerations.includes(n.taint)) {
        tainted++;
        return false;
      }
      if (s.selector !== "none" && !n.labels[s.selector]) {
        mismatch++;
        return false;
      }
      return true;
    });
    if (feasible.length === 0) {
      const parts = [];
      if (tainted) parts.push(`${tainted} node(s) had untolerated taint`);
      if (mismatch) parts.push(`${mismatch} node(s) didn't match Pod's node affinity/selector`);
      out[p.id] = { node: null, reason: `0/${NODES.length} nodes are available: ${parts.join(", ")}.` };
      continue;
    }
    const best = [...feasible].sort((a, b) => load[a.id] - load[b.id] || NODES.indexOf(a) - NODES.indexOf(b))[0];
    load[best.id]++;
    out[p.id] = { node: best.id, reason: `Scheduled to ${best.name} (${feasible.length} feasible node${feasible.length > 1 ? "s" : ""}, fewest Pods wins).` };
  }
  return out;
}

function placementOk(id: PodId, node: string | null) {
  if (id === "trainer") return node === "gpu";
  if (id === "db") return node === "ssd";
  return node === "std" || node === "ssd";
}

function podYaml(p: (typeof PODS)[number], s: PodSpec) {
  const lines = ["apiVersion: v1", "kind: Pod", "metadata:", `  name: ${p.name}`, "spec:"];
  if (s.selector !== "none") lines.push("  nodeSelector:", `    ${SELECTOR_TEXT[s.selector]}`);
  if (s.tolerations.length) {
    lines.push("  tolerations:");
    for (const t of s.tolerations) {
      lines.push(t === "gpu" ? "  - key: gpu" : "  - key: node-role.kubernetes.io/control-plane", "    operator: Exists", "    effect: NoSchedule");
    }
  }
  lines.push("  containers:", `  - name: ${p.id}`, `    image: example/${p.id}:1.0`);
  return lines.join("\n");
}

export function SchedulingLab({ goal, onSolved }: GoalProps<"place">) {
  const [specs, setSpecs] = useState<Record<PodId, PodSpec>>({
    trainer: { selector: "none", tolerations: [] },
    db: { selector: "none", tolerations: [] },
    web: { selector: "none", tolerations: [] },
  });
  const [sel, setSel] = useState<PodId>("trainer");
  const [result, setResult] = useState<Record<PodId, Placement> | null>(null);

  function update(id: PodId, next: PodSpec) {
    setSpecs({ ...specs, [id]: next });
    setResult(null);
  }

  function run() {
    const r = schedule(specs);
    setResult(r);
    if (goal === "place" && PODS.every((p) => placementOk(p.id, r[p.id].node))) onSolved?.();
  }

  const pod = PODS.find((p) => p.id === sel)!;
  const spec = specs[sel];
  const allGood = result && PODS.every((p) => placementOk(p.id, result[p.id].node));

  return (
    <div>
      <LabHeader title="Place the Pods" hint="Give each Pod a nodeSelector and tolerations, then let the scheduler place them. Tolerations let a Pod onto a tainted node; selectors pull it there." />

      <div className="grid gap-2 sm:grid-cols-4">
        {NODES.map((n) => (
          <div key={n.id} className={`rounded-xl border p-2 ${n.taint ? "border-amber-400/40 bg-amber-400/5" : "border-white/10 bg-slate-950/60"}`}>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
              <span className="text-xl">{n.icon}</span> {n.name}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              {Object.keys(n.labels).length ? `label ${Object.keys(n.labels).map((k) => SELECTOR_TEXT[k as "gpu" | "ssd"]).join(", ")}` : "no special labels"}
            </div>
            {n.taint && <div className="mt-0.5 break-all font-mono text-[10px] text-amber-300">taint {TAINT_TEXT[n.taint]}</div>}
            <div className="mt-2 flex min-h-8 flex-wrap gap-1">
              {result &&
                PODS.filter((p) => result[p.id].node === n.id).map((p) => (
                  <span key={p.id} className={`pop-in rounded-md px-1.5 py-0.5 text-xs font-bold ${placementOk(p.id, n.id) ? "bg-emerald-400 text-slate-950" : "bg-rose-400 text-slate-950"}`}>
                    {p.icon} {p.name}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>

      {result && PODS.some((p) => !result[p.id].node) && (
        <div className="mt-2 rounded-xl border border-rose-400/40 bg-rose-400/10 p-2 text-xs text-rose-200">
          <b>Pending:</b>{" "}
          {PODS.filter((p) => !result[p.id].node)
            .map((p) => `${p.icon} ${p.name}`)
            .join(", ")}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {PODS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSel(p.id)}
            className={`rounded-full border px-3 py-1 text-sm ${sel === p.id ? "border-sky-400 bg-sky-400/20 text-white" : "border-white/10 text-slate-300"}`}
          >
            {p.icon} {p.name}
          </button>
        ))}
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm">
          <div className="font-semibold text-white">
            {pod.icon} {pod.name} <span className="font-normal text-slate-400">· {pod.needs}</span>
          </div>
          <div className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">nodeSelector</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {(["none", "gpu", "ssd"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => update(sel, { ...spec, selector: k })}
                className={`rounded-lg border px-2 py-1 font-mono text-xs ${spec.selector === k ? "border-sky-400 bg-sky-400/20 text-white" : "border-white/10 text-slate-300"}`}
              >
                {k === "none" ? "(none)" : SELECTOR_TEXT[k]}
              </button>
            ))}
          </div>
          <div className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">tolerations</div>
          <div className="mt-1 grid gap-1">
            {(["gpu", "control-plane"] as const).map((t) => (
              <label key={t} className="flex items-center gap-2 font-mono text-xs text-slate-200">
                <input
                  type="checkbox"
                  checked={spec.tolerations.includes(t)}
                  onChange={(e) => update(sel, { ...spec, tolerations: e.target.checked ? [...spec.tolerations, t] : spec.tolerations.filter((x) => x !== t) })}
                />
                {TAINT_TEXT[t]}
              </label>
            ))}
          </div>
          {result && (
            <div className={`mt-3 rounded-lg p-2 font-mono text-[11px] ${result[sel].node ? "bg-white/5 text-slate-300" : "bg-rose-400/10 text-rose-200"}`}>
              {result[sel].node ? "✓ " : "⚠ FailedScheduling: "}
              {result[sel].reason}
            </div>
          )}
        </div>
        <CodeBlock code={podYaml(pod, spec)} lang="yaml" />
      </div>

      <button type="button" onClick={run} className="btn-3d mt-3 rounded-xl bg-sky-400 px-4 py-2 font-bold text-slate-950" style={{ "--edge": "#0369a1" } as CSSProperties}>
        ☸️ Schedule all Pods
      </button>
      {allGood && <div className="pop-in mt-2 text-sm font-semibold text-emerald-300">Every Pod landed where it should. Taint repels, toleration permits, selector attracts.</div>}
    </div>
  );
}

// ───────────── Service type picker ─────────────

type Expose = "ClusterIP" | "NodePort" | "LoadBalancer" | "Ingress" | "ExternalName" | "Headless";

const EXPOSE: { id: Expose; icon: string; note: string; path: FlowStep[] }[] = [
  {
    id: "ClusterIP",
    icon: "🔒",
    note: "The default type. A stable virtual IP and DNS name reachable only from inside the cluster.",
    path: [
      { icon: "📦", label: "Client Pod" },
      { icon: "🎯", label: "ClusterIP", sub: "cart.shop.svc.cluster.local" },
      { icon: "📦", label: "Ready Pods" },
    ],
  },
  {
    id: "NodePort",
    icon: "🚪",
    note: "Opens the same port (30000–32767 by default) on every node and forwards it to a ClusterIP.",
    path: [
      { icon: "🌍", label: "Client" },
      { icon: "🖥️", label: "<any node IP>:30080" },
      { icon: "🎯", label: "ClusterIP" },
      { icon: "📦", label: "Ready Pods" },
    ],
  },
  {
    id: "LoadBalancer",
    icon: "⚖️",
    note: "Asks the cloud (through the cloud controller manager) for an external load balancer that forwards to the Service.",
    path: [
      { icon: "🌍", label: "Internet" },
      { icon: "☁️", label: "Cloud load balancer", sub: "External IP" },
      { icon: "🖥️", label: "Nodes" },
      { icon: "🎯", label: "ClusterIP" },
      { icon: "📦", label: "Ready Pods" },
    ],
  },
  {
    id: "Ingress",
    icon: "🛣️",
    note: "Not a Service type: an HTTP(S) routing object served by an Ingress controller. Gateway API (HTTPRoute) is the newer, more expressive option.",
    path: [
      { icon: "🌍", label: "https://shop.example.com" },
      { icon: "🛣️", label: "Ingress controller", sub: "TLS, host and path rules" },
      { icon: "🎯", label: "Service per route" },
      { icon: "📦", label: "Ready Pods" },
    ],
  },
  {
    id: "ExternalName",
    icon: "🔗",
    note: "No proxying and no selector: cluster DNS returns a CNAME to an outside hostname.",
    path: [
      { icon: "📦", label: "Client Pod" },
      { icon: "🧭", label: "CoreDNS", sub: "orders-db → CNAME" },
      { icon: "🏢", label: "db.prod.example.com" },
    ],
  },
  {
    id: "Headless",
    icon: "👤",
    note: "clusterIP: None. No virtual IP: DNS returns the Pod IPs directly, and StatefulSet Pods get their own names.",
    path: [
      { icon: "📦", label: "Peer Pod" },
      { icon: "🧭", label: "CoreDNS", sub: "kafka-0.kafka.data.svc" },
      { icon: "📦", label: "That exact Pod" },
    ],
  },
];

const SCENARIOS: { icon: string; text: string; answer: Expose; why: string }[] = [
  { icon: "🛒", text: "The cart API is called only by other Pods in the cluster.", answer: "ClusterIP", why: "Internal-only traffic needs nothing more than the default ClusterIP." },
  {
    icon: "🧪",
    text: "On a bare-metal lab cluster with no cloud load balancer, testers want to reach the app at any node's IP on port 30080.",
    answer: "NodePort",
    why: "NodePort exposes a fixed high port on every node, with no cloud integration needed.",
  },
  {
    icon: "🎮",
    text: "A TCP game server on a cloud cluster needs its own external IP address.",
    answer: "LoadBalancer",
    why: "Plain TCP plus an external IP is exactly what a cloud LoadBalancer Service provides.",
  },
  {
    icon: "🛍️",
    text: "shop.example.com/ and shop.example.com/api must reach two different Services, with TLS, through one entry point.",
    answer: "Ingress",
    why: "Host- and path-based HTTP routing with TLS termination is the job of Ingress (or Gateway API).",
  },
  {
    icon: "🏢",
    text: "Pods should reach a managed database outside the cluster at db.prod.example.com using the in-cluster name orders-db.",
    answer: "ExternalName",
    why: "ExternalName maps an in-cluster name to an external DNS name with a CNAME.",
  },
  {
    icon: "🧬",
    text: "Kafka brokers in a StatefulSet must find each other by individual Pod DNS names like kafka-0.",
    answer: "Headless",
    why: "A headless Service gives each StatefulSet Pod a stable DNS record instead of one load-balanced IP.",
  },
];

export function ServiceTypeLab({ goal, onSolved }: GoalProps<"all">) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<(Expose | null)[]>(SCENARIOS.map(() => null));

  const s = SCENARIOS[i];
  const pick = picks[i];
  const shown = EXPOSE.find((e) => e.id === (pick ?? s.answer))!;
  const correct = picks.filter((p, k) => p === SCENARIOS[k].answer).length;

  function choose(e: Expose) {
    const next = picks.map((p, k) => (k === i ? e : p));
    setPicks(next);
    if (goal === "all" && next.every((p, k) => p === SCENARIOS[k].answer)) onSolved?.();
  }

  return (
    <div>
      <LabHeader title="Expose the app" hint="Read each request, pick how to expose it, and watch the traffic path. Get all six right." />
      <div className="flex flex-wrap gap-1.5">
        {SCENARIOS.map((x, k) => {
          const p = picks[k];
          const tone = p === null ? "border-white/10 text-slate-300" : p === x.answer ? "border-emerald-400 bg-emerald-400/20 text-emerald-100" : "border-rose-400 bg-rose-400/20 text-rose-100";
          return (
            <button key={k} type="button" onClick={() => setI(k)} className={`rounded-full border px-2.5 py-1 text-sm ${tone} ${k === i ? "ring-2 ring-sky-400" : ""}`}>
              {x.icon} {k + 1}
            </button>
          );
        })}
        <span className="ml-auto self-center text-xs text-slate-400">
          {correct}/{SCENARIOS.length} correct
        </span>
      </div>

      <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-100">
        <span className="mr-1 text-xl">{s.icon}</span> {s.text}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {EXPOSE.map((e) => {
          const on = pick === e.id;
          const tone = !on ? "border-white/10 bg-white/[0.03] text-slate-200" : e.id === s.answer ? "border-emerald-400 bg-emerald-400/15 text-white" : "border-rose-400 bg-rose-400/15 text-white shake";
          return (
            <button key={e.id} type="button" onClick={() => choose(e.id)} className={`rounded-xl border px-3 py-2 text-left text-sm font-semibold transition hover:-translate-y-0.5 ${tone}`}>
              <span className="mr-1">{e.icon}</span>
              {e.id}
            </button>
          );
        })}
      </div>

      {pick && (
        <div className="pop-in mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className={`text-sm font-semibold ${pick === s.answer ? "text-emerald-300" : "text-rose-300"}`}>
            {pick === s.answer ? `✓ ${s.why}` : `✗ ${pick} isn't the best fit. Here's how ${pick} routes traffic:`}
          </div>
          <div className="mt-3">
            <Flow steps={shown.path} color={pick === s.answer ? "#34d399" : "#fb7185"} />
          </div>
          <div className="mt-2 text-xs text-slate-400">{shown.note}</div>
        </div>
      )}
    </div>
  );
}

// ───────────── Scale the Deployment: requests, limits, and the HPA ─────────────

const NODE_COUNT = 3;
const NODE_ALLOCATABLE = 3500; // millicores per node
const LOADS = {
  peak: { name: "Flash sale", icon: "🔥", demand: 6000, note: "Traffic needs 6,000m (6 CPUs) of work in total." },
  night: { name: "Overnight", icon: "🌙", demand: 300, note: "Traffic needs only 300m of work in total." },
} as const;
type LoadId = keyof typeof LOADS;

interface ScaleSettings {
  request: number;
  limit: number;
  min: number;
  max: number;
  target: number;
}

function simulateScale(s: ScaleSettings, load: LoadId) {
  const demand = LOADS[load].demand;
  const raw = Math.ceil(demand / ((s.request * s.target) / 100));
  const desired = Math.min(s.max, Math.max(s.min, raw));
  const perNode = Math.floor(NODE_ALLOCATABLE / s.request);
  const fits = perNode * NODE_COUNT;
  const running = Math.min(desired, fits);
  const pending = desired - running;
  const perPod = running ? demand / running : 0;
  const throttled = perPod > s.limit;
  const usage = Math.min(perPod, s.limit);
  const utilization = Math.round((usage / s.request) * 100);
  const nodes = Array.from({ length: NODE_COUNT }, (_, n) => Math.max(0, Math.min(perNode, running - n * perNode)));
  return { demand, raw, desired, perNode, running, pending, perPod, throttled, utilization, nodes, cappedByMax: raw > s.max };
}

function hpaYaml(s: ScaleSettings) {
  return [
    "apiVersion: autoscaling/v2",
    "kind: HorizontalPodAutoscaler",
    "metadata:",
    "  name: web",
    "spec:",
    "  scaleTargetRef:",
    "    apiVersion: apps/v1",
    "    kind: Deployment",
    "    name: web",
    `  minReplicas: ${s.min}`,
    `  maxReplicas: ${s.max}`,
    "  metrics:",
    "  - type: Resource",
    "    resource:",
    "      name: cpu",
    "      target:",
    "        type: Utilization",
    `        averageUtilization: ${s.target}`,
    "# Deployment container resources:",
    `#   requests: { cpu: ${s.request}m }`,
    `#   limits:   { cpu: ${s.limit}m }`,
  ].join("\n");
}

export function ScaleLab({ goal, onSolved }: GoalProps<"peak" | "ha">) {
  const [s, setS] = useState<ScaleSettings>({ request: 500, limit: 500, min: 1, max: 5, target: 80 });
  const [load, setLoad] = useState<LoadId>(goal === "ha" ? "night" : "peak");
  const [ran, setRan] = useState<{ load: LoadId; s: ScaleSettings } | null>(null);

  const invalid = s.limit < s.request ? "The API server rejects this Pod template: the CPU limit must be greater than or equal to the request." : s.min > s.max ? "minReplicas can't be larger than maxReplicas." : null;

  function set<K extends keyof ScaleSettings>(k: K, v: number) {
    setS({ ...s, [k]: v });
    setRan(null);
  }

  function run() {
    if (invalid) return;
    setRan({ load, s });
    const r = simulateScale(s, load);
    if (goal === "peak" && load === "peak" && r.pending === 0 && !r.throttled && !r.cappedByMax) onSolved?.();
    if (goal === "ha" && load === "night" && r.running >= 2 && !r.throttled && r.running * s.request <= 2000) onSolved?.();
  }

  const r = ran ? simulateScale(ran.s, ran.load) : null;

  return (
    <div>
      <LabHeader
        title="Scale the Deployment"
        hint={`Three worker nodes with ${NODE_ALLOCATABLE.toLocaleString()}m of allocatable CPU each. Tune the Pod's CPU request and limit and the HPA, then send traffic.`}
      />
      <div className="flex flex-wrap gap-2">
        {(Object.keys(LOADS) as LoadId[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setLoad(k);
              setRan(null);
            }}
            className={`rounded-full border px-3 py-1 text-sm ${load === k ? "border-violet-400 bg-violet-400/20 text-white" : "border-white/10 text-slate-300"}`}
          >
            {LOADS[k].icon} {LOADS[k].name}
          </button>
        ))}
        <span className="self-center text-xs text-slate-400">{LOADS[load].note}</span>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <Slider label="CPU request per Pod" unit="m" value={s.request} min={100} max={2000} step={100} onChange={(v) => set("request", v)} />
        <Slider label="CPU limit per Pod" unit="m" value={s.limit} min={100} max={2000} step={100} onChange={(v) => set("limit", v)} />
        <Slider label="HPA target CPU utilization" unit="%" value={s.target} min={30} max={100} step={5} onChange={(v) => set("target", v)} />
        <Slider label="minReplicas" value={s.min} min={1} max={10} step={1} onChange={(v) => set("min", v)} />
        <Slider label="maxReplicas" value={s.max} min={1} max={30} step={1} onChange={(v) => set("max", v)} />
      </div>

      {invalid && <div className="mt-2 rounded-xl border border-rose-400/40 bg-rose-400/10 p-2 text-sm text-rose-200">⛔ {invalid}</div>}

      <button
        type="button"
        onClick={run}
        disabled={!!invalid}
        className="btn-3d mt-3 rounded-xl bg-violet-400 px-4 py-2 font-bold text-slate-950 disabled:opacity-40"
        style={{ "--edge": "#6d28d9" } as CSSProperties}
      >
        📈 Send traffic
      </button>

      {r && ran && (
        <div className="pop-in mt-3 grid gap-3">
          <div className="grid gap-2 sm:grid-cols-3">
            {r.nodes.map((count, n) => (
              <div key={n} className="rounded-xl border border-white/10 bg-slate-950/60 p-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white">worker-{n + 1}</span>
                  <span className="font-mono text-slate-400">
                    {count * ran.s.request}m / {NODE_ALLOCATABLE}m requested
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-violet-400" style={{ width: pct((count * ran.s.request) / NODE_ALLOCATABLE) }} />
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {Array.from({ length: count }, (_, k) => (
                    <span key={k} className={`h-5 w-5 rounded ${r.throttled ? "bg-amber-400" : "bg-emerald-400"}`} title="Running Pod" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {r.pending > 0 && (
            <div className="rounded-xl border border-rose-400/40 bg-rose-400/10 p-2 text-sm text-rose-200">
              ⏳ {r.pending} Pod{r.pending > 1 ? "s" : ""} Pending: 0/{NODE_COUNT} nodes have {ran.s.request}m of CPU left to request. Smaller requests, or more nodes (Cluster Autoscaler), would fix it.
            </div>
          )}
          <div className="overflow-x-auto rounded-xl bg-slate-950 p-2 font-mono text-[12px] text-slate-200">
            <div className="text-slate-500">$ kubectl get hpa web</div>
            <div className="whitespace-pre">{"NAME  REFERENCE       TARGETS          MINPODS  MAXPODS  REPLICAS"}</div>
            <div className="whitespace-pre">{`web   Deployment/web  cpu: ${r.utilization}%/${ran.s.target}%`.padEnd(41) + `${ran.s.min}`.padEnd(9) + `${ran.s.max}`.padEnd(9) + `${r.desired}`}</div>
          </div>
          <ul className="grid gap-1 text-sm">
            <Check ok={!r.cappedByMax} text={r.cappedByMax ? `The HPA wants ${r.raw} replicas but maxReplicas caps it at ${ran.s.max}.` : `The HPA computed ${r.raw} replica${r.raw > 1 ? "s" : ""} (⌈${r.demand}m ÷ (${ran.s.request}m × ${ran.s.target}%)⌉) within its bounds.`} />
            <Check ok={r.pending === 0} text={r.pending === 0 ? `All ${r.running} Pods fit (${r.perNode} per node by requests).` : `Only ${r.perNode} Pods fit per node at ${ran.s.request}m each.`} />
            <Check ok={!r.throttled} text={r.throttled ? `Each Pod needs ${Math.round(r.perPod)}m but its limit is ${ran.s.limit}m: CPU is throttled and latency climbs.` : `Each Pod uses about ${Math.round(r.perPod)}m, under its ${ran.s.limit}m limit.`} />
            {ran.load === "night" && <Check ok={r.running >= 2} text={r.running >= 2 ? `${r.running} replicas overnight: one node can fail without an outage.` : "Only 1 replica overnight: a single node failure takes the app down. Raise minReplicas."} />}
            {ran.load === "night" && (
              <Check ok={r.running * ran.s.request <= 2000} text={`${(r.running * ran.s.request).toLocaleString()}m of CPU reserved overnight${r.running * ran.s.request > 2000 ? ": more than 2,000m is paying for idle capacity." : "."}`} />
            )}
          </ul>
        </div>
      )}
      <details className="mt-3">
        <summary className="cursor-pointer text-xs text-slate-400">Show the manifest</summary>
        <div className="mt-2">
          <CodeBlock code={hpaYaml(s)} lang="yaml" />
        </div>
      </details>
    </div>
  );
}

function Check({ ok, text }: { ok: boolean; text: string }) {
  return (
    <li className={`flex gap-2 ${ok ? "text-emerald-200" : "text-rose-200"}`}>
      <span>{ok ? "✅" : "❌"}</span>
      <span>{text}</span>
    </li>
  );
}

function Slider({ label, unit = "", value, min, max, step, onChange }: { label: string; unit?: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <label className="block rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-white">{label}</span>
        <span className="font-mono text-violet-200">
          {value}
          {unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1.5 w-full accent-violet-400" aria-label={label} />
    </label>
  );
}
