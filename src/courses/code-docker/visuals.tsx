"use client";

import { useState } from "react";

/** Concept diagrams for Learn Docker & Containers. */

// ───────────── Container vs VM ─────────────

type Stack = "vm" | "container";

const STACKS: Record<Stack, { apps: string[]; mid: { label: string; color: string }[]; base: string[]; text: string }> = {
  vm: {
    apps: ["App A", "App B", "App C"],
    mid: [
      { label: "Bins/libs", color: "#a78bfa" },
      { label: "Guest OS (full kernel)", color: "#fb7185" },
    ],
    base: ["Hypervisor", "Host hardware"],
    text: "Each VM boots its own operating system and kernel on virtual hardware. That isolates them strongly, but each one costs gigabytes and takes a while to start.",
  },
  container: {
    apps: ["App A", "App B", "App C"],
    mid: [{ label: "Bins/libs (from the image)", color: "#a78bfa" }],
    base: ["Container runtime + host OS kernel", "Host hardware"],
    text: "Containers are isolated processes sharing the host's kernel. Linux namespaces give each one its own view of files, network and processes, and cgroups cap its CPU and memory. They start about as fast as the program itself.",
  },
};

export function ContainerVsVm() {
  const [s, setS] = useState<Stack>("container");
  const st = STACKS[s];
  return (
    <div className="grid gap-3">
      <div className="flex gap-2">
        {(["vm", "container"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setS(k)}
            className={`rounded-lg px-3 py-1.5 text-sm font-bold ${s === k ? "bg-sky-400 text-slate-950" : "bg-white/10 text-white"}`}
          >
            {k === "vm" ? "Virtual machines" : "Containers"}
          </button>
        ))}
      </div>
      <div className="grid gap-1.5">
        <div className="grid grid-cols-3 gap-1.5">
          {st.apps.map((a) => (
            <div key={a} className="grid gap-1">
              <div className="rounded-lg bg-emerald-400/20 py-2 text-center text-sm font-bold text-emerald-200">{a}</div>
              {st.mid.map((m) => (
                <div key={m.label} className="rounded-lg py-1.5 text-center text-[11px] font-semibold" style={{ background: `${m.color}26`, color: m.color }}>
                  {m.label}
                </div>
              ))}
            </div>
          ))}
        </div>
        {st.base.map((b) => (
          <div key={b} className="rounded-lg border border-white/10 bg-slate-950/70 py-2 text-center text-sm font-semibold text-slate-200">
            {b}
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-300">{st.text}</p>
      <p className="text-xs text-muted-foreground">On macOS and Windows, Docker Desktop runs a small Linux VM, and Linux containers share that VM&apos;s kernel.</p>
    </div>
  );
}

// ───────────── Image layers + container layer ─────────────

const LAYERS = [
  { text: "FROM node:22-slim", size: "base layers", color: "#64748b" },
  { text: "COPY package*.json ./", size: "few KB", color: "#38bdf8" },
  { text: "RUN npm ci", size: "node_modules", color: "#a3e635" },
  { text: "COPY . .", size: "your code", color: "#f472b6" },
];

export function ImageLayers() {
  const [containers, setContainers] = useState(2);
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
        Containers running from this image:
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setContainers(n)}
            className={`rounded-md px-2.5 py-1 font-mono font-bold ${containers === n ? "bg-sky-400 text-slate-950" : "bg-white/10 text-white"}`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${containers}, minmax(0, 1fr))` }}>
        {Array.from({ length: containers }, (_, i) => (
          <div key={i} className="pop-in rounded-lg border border-dashed border-amber-400/70 bg-amber-400/10 px-2 py-1.5 text-center text-[11px] font-bold text-amber-200">
            container {i + 1}: writable layer
          </div>
        ))}
      </div>
      <div className="grid gap-1">
        {[...LAYERS].reverse().map((l) => (
          <div key={l.text} className="flex items-center justify-between rounded-lg px-3 py-1.5 font-mono text-xs" style={{ background: `${l.color}22`, boxShadow: `inset 3px 0 0 0 ${l.color}` }}>
            <span className="text-slate-100">{l.text}</span>
            <span className="text-slate-400">{l.size}</span>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-300">
        Image layers are read-only and shared: {containers} container{containers > 1 ? "s" : ""} use one copy of them on disk. Each container only adds a thin
        writable layer, which is deleted with the container.
      </p>
    </div>
  );
}
