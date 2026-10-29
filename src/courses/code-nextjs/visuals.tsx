"use client";

import { useState } from "react";

// ───────────── Special-file stack ─────────────

const STACK: { file: string; role: string; color: string; detail: string }[] = [
  { file: "layout.tsx", role: "Shared shell", color: "#38bdf8", detail: "Wraps everything below. Keeps its state and does not re-render when you navigate between its children." },
  { file: "template.tsx", role: "Remounting shell", color: "#a78bfa", detail: "Like a layout, but gets a new key per segment, so client state resets and effects re-run on navigation." },
  { file: "error.tsx", role: "Error boundary", color: "#f87171", detail: "A Client Component. Catches errors thrown below it (not in the layout of the same folder) and offers retry()." },
  { file: "loading.tsx", role: "Suspense boundary", color: "#fbbf24", detail: "Shows an instant fallback while the page streams. It does not cover the layout in the same folder." },
  { file: "not-found.tsx", role: "Not-found boundary", color: "#34d399", detail: "Rendered when notFound() is called in this segment." },
  { file: "page.tsx", role: "The route's UI", color: "#e2e8f0", detail: "Makes the URL reachable. Receives params and searchParams as Promises." },
];

/** Nested boxes showing how one route segment's special files wrap each other. Tap a layer for details. */
export function FileStack() {
  const [active, setActive] = useState(0);
  const render = (i: number): React.ReactNode => {
    const s = STACK[i];
    return (
      <div
        className="rounded-xl border p-2 transition"
        style={{ borderColor: i === active ? s.color : `${s.color}55`, background: `${s.color}${i === active ? "22" : "0d"}` }}
      >
        <button type="button" onClick={() => setActive(i)} className="flex w-full items-center gap-2 text-left">
          <code className="font-mono text-sm font-bold" style={{ color: s.color }}>
            {s.file}
          </code>
          <span className="text-xs text-slate-400">{s.role}</span>
        </button>
        {i < STACK.length - 1 && <div className="mt-2 pl-2 sm:pl-4">{render(i + 1)}</div>}
      </div>
    );
  };
  return (
    <div className="grid gap-3">
      {render(0)}
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-200">
        <span className="font-mono font-bold" style={{ color: STACK[active].color }}>
          {STACK[active].file}
        </span>{" "}
        {STACK[active].detail}
      </div>
      <div className="text-center text-[11px] text-slate-500">Tap a layer. Outer files wrap inner ones; a child segment nests inside its parent&apos;s page slot.</div>
    </div>
  );
}

// ───────────── Static shell (Partial Prerendering) ─────────────

const REGIONS: { name: string; kind: "static" | "cached" | "dynamic"; code: string }[] = [
  { name: "<Header />", kind: "static", code: "Plain markup, no data" },
  { name: "<Posts />", kind: "cached", code: '"use cache" + cacheLife("hours")' },
  { name: "<Cart />", kind: "dynamic", code: "reads cookies() inside <Suspense>" },
];

const KIND = {
  static: { label: "Static", color: "#38bdf8" },
  cached: { label: "Cached", color: "#a78bfa" },
  dynamic: { label: "Runtime", color: "#fbbf24" },
};

/** Toggle build time vs request time to see what the static shell contains. */
export function ShellDiagram() {
  const [phase, setPhase] = useState<"build" | "request">("build");
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        {(["build", "request"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPhase(p)}
            className={`rounded-lg px-3 py-1.5 text-sm font-bold ${phase === p ? "bg-sky-400 text-slate-950" : "bg-white/10 text-slate-200"}`}
          >
            {p === "build" ? "🏗️ At build (static shell)" : "📨 At request time"}
          </button>
        ))}
      </div>
      <div className="grid gap-2 rounded-xl border border-white/10 bg-slate-950/60 p-3">
        {REGIONS.map((r) => {
          const k = KIND[r.kind];
          const filled = r.kind !== "dynamic" || phase === "request";
          return (
            <div
              key={r.name}
              className="flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 transition"
              style={{ borderColor: `${k.color}66`, background: filled ? `${k.color}1f` : "transparent", borderStyle: filled ? "solid" : "dashed" }}
            >
              <code className="font-mono text-sm font-bold text-white">{r.name}</code>
              <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase" style={{ background: `${k.color}33`, color: k.color }}>
                {k.label}
              </span>
              <span className="text-xs text-slate-400">{r.code}</span>
              <span className="ml-auto text-xs text-slate-300">{filled ? "✅ in the HTML" : "⏳ fallback shown, streams later"}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-400">
        {phase === "build"
          ? "The shell (static markup, cached output, and Suspense fallbacks) is prerendered and can be served from a CDN."
          : "At request time only the runtime hole renders, then streams in and replaces its fallback."}
      </p>
    </div>
  );
}
