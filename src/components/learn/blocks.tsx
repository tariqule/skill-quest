"use client";

import { useState } from "react";

/**
 * Course-agnostic building blocks for lesson visuals. Courses compose these
 * with their own concept-specific diagrams and labs.
 */

export interface FlowStep {
  icon: string;
  label: string;
  sub?: string;
}

/** Left-to-right pipeline (stacks vertically on phones). Tap a step to highlight it. */
export function Flow({ steps, color = "#38bdf8", loop }: { steps: FlowStep[]; color?: string; loop?: string }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div>
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-2 sm:flex-1 sm:flex-row">
            <button
              type="button"
              onClick={() => setActive(active === i ? null : i)}
              className="w-full rounded-xl border bg-slate-950/60 p-3 text-center transition hover:-translate-y-0.5"
              style={{ borderColor: active === i ? color : "rgb(255 255 255 / 0.1)", boxShadow: active === i ? `0 0 0 3px ${color}33` : undefined }}
            >
              <div className="text-2xl">{s.icon}</div>
              <div className="mt-1 text-sm font-semibold leading-tight text-white">{s.label}</div>
              {s.sub && (active === i || steps.length <= 4) && <div className="mt-1 text-xs leading-snug text-slate-400">{s.sub}</div>}
            </button>
            {i < steps.length - 1 && (
              <span className="text-lg text-slate-500 sm:shrink-0" aria-hidden>
                <span className="sm:hidden">↓</span>
                <span className="hidden sm:inline">→</span>
              </span>
            )}
          </div>
        ))}
      </div>
      {loop && <div className="mt-2 text-center text-xs text-slate-400">↺ {loop}</div>}
      {steps.length > 4 && <div className="mt-2 text-center text-[11px] text-slate-500">Tap a step for details</div>}
    </div>
  );
}

export interface Tile {
  icon: string;
  title: string;
  text: string;
  color?: string;
}

export function Tiles({ tiles, cols = 2 }: { tiles: Tile[]; cols?: 2 | 3 | 4 }) {
  const grid = cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <div className={`grid gap-3 ${grid}`}>
      {tiles.map((t) => (
        <div
          key={t.title}
          className="rounded-xl border border-white/10 bg-slate-950/60 p-3"
          style={t.color ? { boxShadow: `inset 3px 0 0 0 ${t.color}` } : undefined}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{t.icon}</span>
            <span className="font-semibold text-white">{t.title}</span>
          </div>
          <p className="mt-1.5 text-sm leading-snug text-slate-300">{t.text}</p>
        </div>
      ))}
    </div>
  );
}

/** "Input → Service → Output" rows for the pre-built AI services. */
export function ServiceRows({ rows }: { rows: { input: string; service: string; output: string }[] }) {
  return (
    <div className="grid gap-2">
      {rows.map((r) => (
        <div key={r.service} className="grid grid-cols-[1fr_auto_1.3fr_auto_1fr] items-center gap-2 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm">
          <span className="text-slate-300">{r.input}</span>
          <span className="text-slate-500">→</span>
          <span className="rounded-lg bg-sky-400/15 px-2 py-1 text-center font-semibold text-sky-200">{r.service}</span>
          <span className="text-slate-500">→</span>
          <span className="text-slate-300">{r.output}</span>
        </div>
      ))}
    </div>
  );
}

export function Layers({ layers }: { layers: { name: string; color: string; items: string[] }[] }) {
  return (
    <div className="grid gap-2">
      {layers.map((l) => (
        <div key={l.name} className="rounded-xl border p-3" style={{ borderColor: `${l.color}55`, background: `${l.color}12` }}>
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: l.color }}>
            {l.name}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {l.items.map((it) => (
              <span key={it} className="rounded-md bg-slate-950/70 px-2 py-1 text-sm text-slate-100">
                {it}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Ladder({ rungs }: { rungs: { icon: string; name: string; text: string }[] }) {
  return (
    <div className="flex flex-col-reverse gap-2">
      {rungs.map((r, i) => (
        <div
          key={r.name}
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-3"
          style={{ marginLeft: `${i * 6}%`, boxShadow: `inset 4px 0 0 0 hsl(${140 - i * 40} 70% 55%)` }}
        >
          <span className="text-2xl">{r.icon}</span>
          <div className="min-w-0">
            <div className="font-semibold text-white">
              {i + 1}. {r.name} <span className="ml-1 text-xs text-slate-400">{"$".repeat(i + 1)}</span>
            </div>
            <div className="text-sm text-slate-400">{r.text}</div>
          </div>
        </div>
      ))}
      <div className="text-xs text-slate-500">⬆ more cost, effort, and data as you climb</div>
    </div>
  );
}

/**
 * Props every lab accepts so it can double as a challenge: `goal` picks one of
 * the lab's built-in goals, and the lab calls `onSolved` when it's met.
 */
export interface GoalProps<G extends string> {
  goal?: G;
  onSolved?: () => void;
}

/** "🧪 Lab" header used by every hands-on lab. */
export function LabHeader({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-fuchsia-400/20 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-fuchsia-200">🧪 Lab</span>
      <span className="font-bold text-white">{title}</span>
      <span className="w-full text-sm text-slate-400">{hint}</span>
    </div>
  );
}
