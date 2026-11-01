"use client";

import { MessageCircle } from "lucide-react";
import { type CSSProperties, type ReactNode } from "react";
import { BlockIcon } from "@/components/learn/block-icons";
import type { Domain } from "@/engine/types";
import { Burst3D } from "./three";

/** Cheap deterministic pseudo-random so renders stay pure. */
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const CONFETTI_COLORS = ["#38bdf8", "#a78bfa", "#f59e0b", "#34d399", "#f87171", "#facc15"];

/** Celebration: 3D shards when WebGL is available, CSS confetti otherwise. */
export function Confetti({ count = 60 }: { count?: number }) {
  return <Burst3D count={Math.round(count * 2.2)} fallback={<CssConfetti count={count} />} />;
}

function CssConfetti({ count }: { count: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const style = {
          left: `${(rand(i) * 100).toFixed(2)}%`,
          background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          animationDelay: `${rand(i + 100) * 0.6}s`,
          animationDuration: `${2.2 + rand(i + 200) * 1.6}s`,
          "--drift": `${(rand(i + 300) - 0.5) * 220}px`,
          "--spin": `${360 + rand(i + 400) * 720}deg`,
          width: `${6 + rand(i + 500) * 6}px`,
          height: `${10 + rand(i + 600) * 8}px`,
        } as CSSProperties;
        return <span key={i} className="confetti-piece" style={style} />;
      })}
    </div>
  );
}

/**
 * Formerly a pointer-driven 3D tilt. Retired in the redesign (no hover transforms on cards);
 * kept as a plain wrapper so callers keep their layout.
 */
export function Tilt({ children, className = "" }: { children: ReactNode; className?: string; max?: number }) {
  return <div className={className}>{children}</div>;
}

/**
 * The course emblem. Formerly a spinning WebGL orb / CSS cube; now a static token-styled tile
 * with the course icon (no ambient motion outside the home hero).
 */
export function Core3D({ size = 120, icon = "☁️" }: { size?: number; domains?: Domain[]; icon?: string }) {
  const box = Math.min(size, 96);
  return (
    <div aria-hidden="true" className="flex items-center justify-center rounded-card border border-border bg-primary/10" style={{ width: box, height: box }}>
      <BlockIcon icon={icon} className="size-1/2" />
    </div>
  );
}

/** The guide mascot: a little cloud bot. */
export function Mascot({ size = 64, mood = "happy" }: { size?: number; mood?: "happy" | "wow" | "think" }) {
  return (
    <svg viewBox="0 0 100 80" width={size} height={size * 0.8} className="mascot" aria-hidden>
      <defs>
        <linearGradient id="mascot-g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#e0f2fe" />
          <stop offset="1" stopColor="#93c5fd" />
        </linearGradient>
      </defs>
      <line x1="50" y1="6" x2="50" y2="16" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="5" r="4" fill="#f59e0b" className="mascot-antenna" />
      <path d="M22 66 Q6 66 8 50 Q10 36 26 38 Q28 18 50 18 Q72 18 74 38 Q92 36 92 52 Q92 66 78 66 Z" fill="url(#mascot-g)" stroke="#38bdf8" strokeWidth="2" />
      <rect x="28" y="36" width="44" height="22" rx="11" fill="#0f172a" />
      {mood === "wow" ? (
        <>
          <circle cx="40" cy="47" r="5" fill="#38bdf8" />
          <circle cx="60" cy="47" r="5" fill="#38bdf8" />
        </>
      ) : mood === "think" ? (
        <>
          <rect x="35" y="45" width="10" height="3" rx="1.5" fill="#38bdf8" />
          <circle cx="60" cy="46" r="4" fill="#38bdf8" />
        </>
      ) : (
        <>
          <path d="M35 49 Q40 42 45 49" stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M55 49 Q60 42 65 49" stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}
      <circle cx="30" cy="60" r="3" fill="#f9a8d4" opacity="0.7" />
      <circle cx="70" cy="60" r="3" fill="#f9a8d4" opacity="0.7" />
    </svg>
  );
}

/** A short guide note: calm callout, no animated mascot. */
export function MascotSays({ children }: { children: ReactNode; mood?: "happy" | "wow" | "think" }) {
  return (
    <div className="flex items-start gap-3 rounded-card border border-border bg-card px-4 py-3 text-base text-foreground">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <MessageCircle aria-hidden="true" className="size-4" />
      </span>
      <div className="min-w-0 pt-1">{children}</div>
    </div>
  );
}
