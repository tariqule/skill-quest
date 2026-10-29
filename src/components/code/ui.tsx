"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { LEVELS, type LevelChoice } from "@/engine/levels";

/** Deterministic pseudo-random so server and client render the same rain. */
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const GLYPHS = "{}[]()<>=;:+-*/&|!?01".split("");
const WORDS = ["const", "=>", "async", "return", "null", "map()", "O(n)", "def", "class", "{ }", "useState", "await", "true", "0x1F", "[]", "fn"];

/** Falling code columns behind Code Quest pages. Pure CSS animation, fixed precision for SSR. */
export function CodeRain() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#03070d]" aria-hidden>
      <div className="code-grid absolute inset-0 opacity-40" />
      {Array.from({ length: 28 }, (_, i) => {
        const text = Array.from({ length: 14 }, (_, k) =>
          rand(i * 31 + k) > 0.7 ? WORDS[Math.floor(rand(i * 17 + k) * WORDS.length)] : GLYPHS[Math.floor(rand(i * 7 + k) * GLYPHS.length)],
        ).join("\n");
        const style = {
          left: `${((i / 28) * 100 + rand(i) * 2).toFixed(2)}%`,
          animationDuration: `${(14 + rand(i + 50) * 16).toFixed(2)}s`,
          animationDelay: `${(-rand(i + 99) * 20).toFixed(2)}s`,
          opacity: Number((0.08 + rand(i + 7) * 0.18).toFixed(2)),
        } as CSSProperties;
        return (
          <pre key={i} className="code-rain-col absolute top-0 font-mono text-[11px] leading-5 text-emerald-300" style={style}>
            {text}
          </pre>
        );
      })}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#03070d]/40 to-[#03070d]" />
      <div className="scanlines absolute inset-0" />
    </div>
  );
}

/** A terminal window frame with traffic-light dots and a title bar. */
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

/** Types lines out one character at a time, with a blinking cursor. */
export function Typewriter({ lines, speed = 22 }: { lines: string[]; speed?: number }) {
  const full = lines.join("\n");
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((x) => (x >= full.length ? x : x + 1)), speed);
    return () => clearInterval(t);
  }, [full, speed]);
  return (
    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-emerald-200 sm:text-base">
      {full.slice(0, n)}
      <span className="cursor-blink">▍</span>
    </pre>
  );
}

/** Arcade-style difficulty select. `counts` shows how many questions each level has; "mixed" highlights none. */
export function LevelPicker({ value, onChange, counts }: { value: LevelChoice | "mixed"; onChange: (l: LevelChoice) => void; counts: Record<LevelChoice, number> }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {LEVELS.map((l) => {
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
            <div className="mt-2 font-mono text-[11px]" style={{ color: l.color }}>
              {counts[l.id]} questions
            </div>
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
