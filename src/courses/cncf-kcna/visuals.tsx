"use client";

import { useState } from "react";

/** Concept diagrams specific to the KCNA course. */

// ───────────── Cluster architecture map ─────────────

const COMPONENTS = {
  apiserver: { icon: "🚪", name: "kube-apiserver", text: "The front door. Every client (kubectl, kubelets, controllers) talks to it over REST. It authenticates, authorizes, runs admission, validates, and is the only component that reads and writes etcd." },
  etcd: { icon: "🗃️", name: "etcd", text: "Consistent, highly available key-value store holding all cluster state. Uses the Raft consensus algorithm, so run an odd number of members (3 or 5) and back it up." },
  scheduler: { icon: "🧩", name: "kube-scheduler", text: "Watches for Pods with no node, filters out nodes that can't run them (resources, taints, selectors), scores the rest, and binds the Pod to the best node." },
  cm: { icon: "🔁", name: "kube-controller-manager", text: "Runs the built-in control loops (Deployment, ReplicaSet, Node, Job, EndpointSlice, ServiceAccount, …). Each loop compares desired with actual state and acts to close the gap." },
  ccm: { icon: "☁️", name: "cloud-controller-manager", text: "Optional. Holds cloud-specific loops: node lifecycle, routes, and load balancers for Services of type LoadBalancer." },
  kubelet: { icon: "🧑‍✈️", name: "kubelet", text: "The node agent. Registers the node, watches for Pods bound to it, asks the container runtime (over CRI) to run them, runs probes, and reports status back to the API server." },
  proxy: { icon: "🔀", name: "kube-proxy", text: "Programs node networking rules (iptables, IPVS, or nftables) so traffic to a Service's virtual IP reaches a backing Pod. Some CNI plugins replace it." },
  runtime: { icon: "🐳", name: "Container runtime", text: "Pulls images and runs containers through the Container Runtime Interface. containerd and CRI-O are common; both use a low-level OCI runtime such as runc." },
  pods: { icon: "📦", name: "Pods", text: "The smallest deployable unit: one or more containers sharing a network namespace (one IP, localhost) and volumes." },
} as const;

type ComponentId = keyof typeof COMPONENTS;

export function ClusterMap() {
  const [sel, setSel] = useState<ComponentId>("apiserver");
  const chip = (id: ComponentId) => (
    <button
      key={id}
      type="button"
      onClick={() => setSel(id)}
      className={`rounded-lg border px-2 py-1.5 text-left text-xs font-semibold transition hover:-translate-y-0.5 ${sel === id ? "border-sky-400 bg-sky-400/20 text-white" : "border-white/10 bg-slate-950/70 text-slate-200"}`}
    >
      <span className="mr-1">{COMPONENTS[id].icon}</span>
      {COMPONENTS[id].name}
    </button>
  );
  const c = COMPONENTS[sel];
  return (
    <div>
      <div className="grid gap-3 md:grid-cols-[1.2fr_1fr]">
        <div className="rounded-xl border border-sky-400/40 bg-sky-400/5 p-3">
          <div className="text-xs font-bold uppercase tracking-wider text-sky-300">Control plane</div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">{(["apiserver", "etcd", "scheduler", "cm", "ccm"] as const).map(chip)}</div>
          <div className="mt-2 text-[11px] text-slate-400">Everything goes through the API server. Only the API server touches etcd.</div>
        </div>
        <div className="grid gap-2">
          {[1, 2].map((n) => (
            <div key={n} className="rounded-xl border border-emerald-400/40 bg-emerald-400/5 p-3">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">Worker node {n}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">{(["kubelet", "proxy", "runtime", "pods"] as const).map(chip)}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="pop-in mt-3 rounded-xl border border-white/10 bg-white/[0.04] p-3" key={sel}>
        <div className="font-semibold text-white">
          {c.icon} {c.name}
        </div>
        <p className="mt-1 text-sm leading-snug text-slate-300">{c.text}</p>
      </div>
    </div>
  );
}

// ───────────── Rolling update stepper ─────────────

interface Frame {
  old: number;
  ready: number;
  starting: number;
}

/** Simplified Deployment controller: scale the old ReplicaSet down within maxUnavailable, the new one up within maxSurge. */
function rollout(replicas: number, surge: number, unavailable: number): Frame[] {
  const frames: Frame[] = [{ old: replicas, ready: 0, starting: 0 }];
  let old = replicas;
  let total = 0;
  for (let guard = 0; guard < 20; guard++) {
    const ready = total; // Pods created last tick are ready now
    const remove = Math.min(old, Math.max(0, old + ready - (replicas - unavailable)));
    old -= remove;
    const add = Math.max(0, Math.min(replicas + surge - (old + total), replicas - total));
    total += add;
    frames.push({ old, ready, starting: total - ready });
    if (old === 0 && ready === replicas) break;
  }
  return frames;
}

export function RollingUpdateViz() {
  const replicas = 4;
  const [surge, setSurge] = useState(1);
  const [unavail, setUnavail] = useState(0);
  const [step, setStep] = useState(0);
  const invalid = surge === 0 && unavail === 0;
  const frames = invalid ? [] : rollout(replicas, surge, unavail);
  const f = frames[Math.min(step, frames.length - 1)];

  const knob = (label: string, value: number, setter: (v: number) => void) => (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
      <div className="text-xs font-semibold text-white">{label}</div>
      <div className="mt-1.5 flex gap-1">
        {[0, 1, 2].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => {
              setter(v);
              setStep(0);
            }}
            className={`rounded-lg px-3 py-1 font-mono text-sm ${value === v ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-200"}`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {knob("maxSurge (extra Pods allowed)", surge, setSurge)}
        {knob("maxUnavailable (Pods allowed down)", unavail, setUnavail)}
      </div>
      {invalid ? (
        <div className="mt-3 rounded-xl border border-rose-400/40 bg-rose-400/10 p-3 text-sm text-rose-200">
          ⛔ Rejected: maxSurge and maxUnavailable can&apos;t both be 0, or the rollout could never make progress.
        </div>
      ) : (
        <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-3">
          <div className="flex min-h-10 flex-wrap gap-1.5">
            {Array.from({ length: f.old }, (_, i) => (
              <span key={`o${i}`} className="flex h-9 w-11 items-center justify-center rounded-lg bg-sky-500/70 text-xs font-bold text-white">
                v1
              </span>
            ))}
            {Array.from({ length: f.ready }, (_, i) => (
              <span key={`r${i}`} className="flex h-9 w-11 items-center justify-center rounded-lg bg-emerald-400 text-xs font-bold text-slate-950">
                v2
              </span>
            ))}
            {Array.from({ length: f.starting }, (_, i) => (
              <span key={`s${i}`} className="flex h-9 w-11 items-center justify-center rounded-lg border border-dashed border-emerald-400 text-xs text-emerald-300">
                ⏳
              </span>
            ))}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Ready: <b className="text-white">{f.old + f.ready}</b> (minimum {replicas - unavail}) · Total: <b className="text-white">{f.old + f.ready + f.starting}</b> (maximum {replicas + surge}) ·{" "}
            <span className="text-sky-300">blue v1</span> · <span className="text-emerald-300">green v2</span> · ⏳ starting, not Ready yet
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)} className="rounded-lg bg-slate-800 px-3 py-1 text-sm text-slate-200 disabled:opacity-40">
              ◀
            </button>
            <span className="text-sm text-slate-300">
              Step {Math.min(step, frames.length - 1) + 1} of {frames.length}
            </span>
            <button type="button" disabled={step >= frames.length - 1} onClick={() => setStep(step + 1)} className="rounded-lg bg-slate-800 px-3 py-1 text-sm text-slate-200 disabled:opacity-40">
              ▶
            </button>
          </div>
        </div>
      )}
      <div className="mt-2 text-xs text-slate-400">Defaults are 25% for both. maxUnavailable 0 keeps full capacity; a bigger maxSurge finishes faster but needs spare room in the cluster.</div>
    </div>
  );
}

// ───────────── Pod status decoder ─────────────

const STATUSES = [
  { status: "Pending", tone: "#fbbf24", cause: "No node can take the Pod yet: not enough CPU or memory to satisfy requests, an untolerated taint, a nodeSelector or affinity no node matches, or an unbound PersistentVolumeClaim.", cmd: "kubectl describe pod <name>  # read the FailedScheduling event" },
  { status: "ImagePullBackOff", tone: "#fb7185", cause: "The kubelet can't pull the image: a typo in the name or tag, the tag doesn't exist, or a private registry without imagePullSecrets.", cmd: "kubectl describe pod <name>  # Events show the pull error" },
  { status: "CrashLoopBackOff", tone: "#fb7185", cause: "The container starts and exits again and again; the kubelet restarts it with a growing back-off delay. Usually an app error, a bad command, or missing config.", cmd: "kubectl logs <name> --previous" },
  { status: "OOMKilled", tone: "#f472b6", cause: "The container used more memory than its limit and the kernel killed it (exit code 137). Raise the limit or fix the leak.", cmd: "kubectl describe pod <name>  # Last State: Terminated, Reason: OOMKilled" },
  { status: "CreateContainerConfigError", tone: "#c084fc", cause: "The Pod references a ConfigMap, Secret, or key that doesn't exist, so the container can't be created.", cmd: "kubectl describe pod <name>" },
  { status: "Running, 0/1 Ready", tone: "#38bdf8", cause: "The readiness probe is failing, so the Pod is removed from Service endpoints and gets no traffic. The container isn't restarted for this.", cmd: "kubectl describe pod <name>  # Readiness probe failed" },
] as const;

export function PodStatusDecoder() {
  const [sel, setSel] = useState(0);
  const s = STATUSES[sel];
  return (
    <div>
      <div className="overflow-x-auto rounded-xl bg-slate-950 p-2 font-mono text-[12px]">
        <div className="text-slate-500">$ kubectl get pods</div>
        <div className="whitespace-pre text-slate-400">{"NAME                     READY   STATUS"}</div>
        {STATUSES.map((x, i) => (
          <button
            key={x.status}
            type="button"
            onClick={() => setSel(i)}
            className={`block w-full whitespace-pre rounded px-1 text-left ${sel === i ? "bg-white/10" : "hover:bg-white/5"}`}
          >
            <span className="text-slate-200">{`shop-${["7d9f", "5c2a", "8b1e", "3f6d", "9a4c", "2e7b"][i]}-x${i}k2p`.padEnd(25)}</span>
            <span className="text-slate-300">{"0/1".padEnd(8)}</span>
            <span style={{ color: x.tone }}>{x.status.startsWith("Running") ? "Running" : x.status}</span>
          </button>
        ))}
      </div>
      <div className="pop-in mt-3 rounded-xl border border-white/10 bg-white/[0.04] p-3" key={sel}>
        <div className="font-semibold" style={{ color: s.tone }}>
          {s.status}
        </div>
        <p className="mt-1 text-sm leading-snug text-slate-300">{s.cause}</p>
        <div className="mt-2 rounded-lg bg-slate-950 px-2 py-1 font-mono text-xs text-emerald-300">$ {s.cmd}</div>
      </div>
      <div className="mt-2 text-[11px] text-slate-500">Tap a row to decode it.</div>
    </div>
  );
}
