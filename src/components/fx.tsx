"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import type { Domain } from "@/engine/types";

/** Cheap deterministic pseudo-random so renders stay pure. */
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const CONFETTI_COLORS = ["#38bdf8", "#a78bfa", "#f59e0b", "#34d399", "#f87171", "#facc15"];

export function Confetti({ count = 60 }: { count?: number }) {
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

/** Card that tilts toward the pointer in 3D. */
export function Tilt({ children, className = "", max = 10 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--rx", `${-y * max}deg`);
        el.style.setProperty("--ry", `${x * max}deg`);
        el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
        el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
      }}
      onPointerLeave={() => {
        ref.current?.style.setProperty("--rx", "0deg");
        ref.current?.style.setProperty("--ry", "0deg");
      }}
    >
      {children}
    </div>
  );
}

/** Spinning 3D cube with a domain on each face, wrapped in orbit rings. */
/** Faces of the cube, in order. Domains fill the first faces; the rest show `icon`. */
const FACE_TRANSFORMS = ["", "rotateY(90deg) ", "rotateY(180deg) ", "rotateY(-90deg) ", "rotateX(90deg) ", "rotateX(-90deg) "];

export function Core3D({ size = 120, domains = [], icon = "☁️" }: { size?: number; domains?: Domain[]; icon?: string }) {
  const faces = FACE_TRANSFORMS.map((t, i) => ({ t: `${t}translateZ(${size / 2}px)`, d: (domains[i] as Domain | undefined) ?? null }));
  return (
    <div className="core-scene relative" style={{ width: size * 2.2, height: size * 2.2 }} aria-hidden>
      <div className="orbit orbit-a" />
      <div className="orbit orbit-b" />
      <div className="orbit orbit-c" />
      <div className="absolute left-1/2 top-1/2" style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}>
        <div className="cube" style={{ width: size, height: size }}>
          {faces.map((f, i) => (
            <div
              key={i}
              className="cube-face"
              style={{
                transform: f.t,
                width: size,
                height: size,
                background: f.d ? `linear-gradient(135deg, ${f.d.color}55, ${f.d.color}15)` : "linear-gradient(135deg,#38bdf855,#a78bfa22)",
                borderColor: f.d ? `${f.d.color}aa` : "#38bdf8aa",
              }}
            >
              <span style={{ fontSize: size * 0.38 }}>{f.d ? f.d.emoji : icon}</span>
            </div>
          ))}
        </div>
      </div>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="spark" style={{ "--i": i } as CSSProperties} />
      ))}
    </div>
  );
}

/** Floating background particles, fixed behind content. */
export function Starfield() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="blob blob-a" />
      <div className="blob blob-b" />
      <div className="blob blob-c" />
      {Array.from({ length: 40 }, (_, i) => (
        <span
          key={i}
          className="star"
          // Fixed precision so server and client render identical strings.
          style={{
            left: `${(rand(i + 700) * 100).toFixed(2)}%`,
            top: `${(rand(i + 800) * 100).toFixed(2)}%`,
            animationDelay: `${(rand(i + 900) * 6).toFixed(2)}s`,
            opacity: Number((0.2 + rand(i + 1000) * 0.5).toFixed(2)),
          }}
        />
      ))}
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

/** Speech bubble next to the mascot. */
export function MascotSays({ children, mood }: { children: ReactNode; mood?: "happy" | "wow" | "think" }) {
  return (
    <div className="flex items-end gap-3">
      <div className="shrink-0">
        <Mascot mood={mood} />
      </div>
      <div className="relative rounded-2xl rounded-bl-sm border border-sky-400/30 bg-sky-400/10 px-4 py-3 text-slate-100">{children}</div>
    </div>
  );
}
