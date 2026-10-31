"use client";

import { RichText } from "./code";
import { useState } from "react";

export { CodeBlock, CodeCompare, dedent, RichText } from "./code";

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
              <span className="text-lg text-slate-400 sm:shrink-0" aria-hidden>
                <span className="sm:hidden">↓</span>
                <span className="hidden sm:inline">→</span>
              </span>
            )}
          </div>
        ))}
      </div>
      {loop && <div className="mt-2 text-center text-xs text-slate-400">↺ {loop}</div>}
      {steps.length > 4 && <div className="mt-2 text-center text-[11px] text-slate-400">Tap a step for details</div>}
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
          <p className="mt-1.5 text-base leading-normal text-slate-300"><RichText text={t.text} /></p>
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
          <span className="text-slate-400">→</span>
          <span className="rounded-lg bg-sky-400/15 px-2 py-1 text-center font-semibold text-sky-200">{r.service}</span>
          <span className="text-slate-400">→</span>
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

/**
 * A climbing ladder: the first rung is at the bottom. Rungs only show $ marks when `dollars` is set, and the
 * caption is whatever the lesson says the climb means, so non-cost ladders don't claim to be about cost.
 */
export function Ladder({ rungs, caption, dollars = false, list = false }: { rungs: { icon: string; name: string; text: string }[]; caption?: string; dollars?: boolean; /** Plain numbered list, 1 at the top, aligned, no climb arrow. */ list?: boolean }) {
  return (
    <div className={`flex gap-2 ${list ? "flex-col" : "flex-col-reverse"}`}>
      {rungs.map((r, i) => (
        <div
          key={r.name}
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-3"
          style={{ marginLeft: list ? 0 : `${i * 6}%`, boxShadow: `inset 4px 0 0 0 hsl(${140 - i * 40} 70% 55%)` }}
        >
          <span className="text-2xl" aria-hidden="true">{r.icon}</span>
          <div className="min-w-0">
            <div className="font-semibold text-white">
              {i + 1}. {r.name}
              {dollars && (
                <>
                  <span className="ml-1 text-sm text-slate-200" aria-hidden="true">{"$".repeat(i + 1)}</span>
                  <span className="sr-only">, cost level {i + 1} of {rungs.length}</span>
                </>
              )}
            </div>
            <div className="text-base text-slate-300">{r.text}</div>
          </div>
        </div>
      ))}
      {caption && <div className={`text-sm text-slate-200 ${list ? "order-first" : ""}`}>{list ? caption : `⬆ ${caption}`}</div>}
    </div>
  );
}

/**
 * Severity levels with the filter settings that block them. Each setting row marks which levels it blocks,
 * so "block from low upward" reads straight off the grid.
 */
export function SeverityScale({ levels, settings, caption }: { levels: { name: string; color: string; text: string }[]; settings: { name: string; blocksFrom: number | null; note?: string }[]; caption?: string }) {
  return (
    <div className="grid gap-3">
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${levels.length}, minmax(0, 1fr))` }}>
        {levels.map((l) => (
          <div key={l.name} className="rounded-xl border border-white/10 bg-slate-950/60 p-2 text-center" style={{ boxShadow: `inset 0 4px 0 0 ${l.color}` }}>
            <div className="font-semibold text-white">{l.name}</div>
            <div className="text-sm text-slate-300">{l.text}</div>
          </div>
        ))}
      </div>
      <table className="w-full border-separate border-spacing-1 text-sm">
        <caption className="sr-only">Which severity levels each filter setting blocks</caption>
        <thead>
          <tr>
            <th scope="col" className="text-left font-semibold text-slate-200">Setting</th>
            {levels.map((l) => (
              <th key={l.name} scope="col" className="font-semibold text-slate-200">{l.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {settings.map((st) => (
            <tr key={st.name}>
              <th scope="row" className="text-left font-semibold text-white">
                {st.name}
                {st.note && <span className="ml-1 font-normal text-slate-300">({st.note})</span>}
              </th>
              {levels.map((l, i) => {
                const blocked = st.blocksFrom !== null && i >= st.blocksFrom;
                return (
                  <td key={l.name} className={`rounded-md px-1 py-1 text-center font-semibold ${blocked ? "bg-rose-500/25 text-rose-100" : "bg-white/5 text-slate-200"}`}>
                    {blocked ? "⛔ blocked" : "✓ allowed"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && <div className="text-sm text-slate-200">{caption}</div>}
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
