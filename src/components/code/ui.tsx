"use client";

import { type CSSProperties, type ReactNode } from "react";
import { LEVELS, type LevelChoice, type LevelInfo } from "@/engine/levels";

export function TerminalWindow({ title, children, className = "", glow = "#34d399" }: { title: string; children: ReactNode; className?: string; glow?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 bg-[#07111c]/90 backdrop-blur ${className}`} style={{ boxShadow: `0 0 0 1px ${glow}22, 0 20px 60px -30px ${glow}` }}>
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2">
        <span className="h-3 w-3 rounded-full bg-rose-400/80" />
        <span className="h-3 w-3 rounded-full bg-amber-300/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        <span className="ml-2 truncate font-mono text-xs text-slate-400">{title}</span>
      </div>
      <div className="min-w-0 p-4 sm:p-6">{children}</div>
    </div>
  );
}

/**
 * Terminal-style lines, shown in full. The type-out effect and blinking cursor are retired
 * (no ambient motion: the redesign's seductive-details rule).
 */
export function Typewriter({ lines }: { lines: string[]; speed?: number }) {
  return <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-emerald-200 sm:text-base">{lines.join("\n")}</pre>;
}

const CODE_LEVELS = LEVELS.filter((l) => l.id !== "exam");

/**
 * Arcade-style difficulty select. `counts` shows how many questions each level has and
 * `countLabels` says what was counted when it isn't every question; "mixed" highlights none.
 */
export function LevelPicker({
  value,
  onChange,
  counts,
  countLabels,
  options = CODE_LEVELS,
}: {
  value: LevelChoice | "mixed";
  onChange: (l: LevelChoice) => void;
  counts?: Partial<Record<LevelChoice, number>>;
  countLabels?: Partial<Record<LevelChoice, string>>;
  options?: LevelInfo[];
}) {
  const cols = options.length <= 3 ? "sm:grid-cols-3" : "sm:grid-cols-3 lg:grid-cols-6";
  return (
    <div className={`grid grid-cols-2 gap-3 ${cols}`}>
      {options.map((l) => {
        const on = value === l.id;
        return (
          <button
            key={l.id}
            type="button"
            onClick={() => onChange(l.id)}
            aria-pressed={on}
            className={`group relative rounded-xl border-2 p-3 text-left transition ${on ? "scale-[1.03]" : "opacity-80 hover:opacity-100"}`}
            style={{
              borderColor: on ? l.color : "rgb(255 255 255 / 0.1)",
              background: on ? `${l.color}1f` : "rgb(7 17 28 / 0.8)",
              boxShadow: on ? `0 0 24px -6px ${l.color}` : undefined,
            }}
          >
            {on && <span className="absolute right-2 top-2 font-mono text-[10px] font-black" style={{ color: l.color }}>◉ ON</span>}
            <div className="text-2xl">{l.icon}</div>
            <div className="mt-1 font-mono text-sm font-black uppercase tracking-wider text-white">{l.name}</div>
            <div className="mt-0.5 text-[11px] leading-snug text-slate-400">{l.blurb}</div>
            {counts?.[l.id] !== undefined && (
              <div className="mt-2 font-mono text-[11px]" style={{ color: l.color }}>
                {counts[l.id]} {countLabels?.[l.id] ?? "questions"}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Neon arcade button. */
export function NeonButton({ children, color = "#34d399", onClick, className = "" }: { children: ReactNode; color?: string; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-3d rounded-xl px-5 py-3 font-mono text-sm font-black uppercase tracking-wider text-slate-950 ${className}`}
      style={{ background: color, "--edge": "#00000088", boxShadow: `0 5px 0 0 #00000088, 0 0 24px -4px ${color}` } as CSSProperties}
    >
      {children}
    </button>
  );
}
