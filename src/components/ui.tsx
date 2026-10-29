"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useOptionalCourse } from "@/engine/course-context";
import { pct } from "@/engine/game";

export function Bar({ value, color = "#38bdf8", className = "h-2" }: { value: number; color?: string; className?: string }) {
  return (
    <div className={`w-full overflow-hidden rounded-full bg-white/10 ${className}`}>
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{ width: pct(Math.max(0, Math.min(1, value))), background: color }}
      />
    </div>
  );
}

export function Stars({ count, size = "text-xl" }: { count: number; size?: string }) {
  return (
    <span className={size} aria-label={`${count} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={i < count ? "" : "opacity-20 grayscale"}>
          ⭐
        </span>
      ))}
    </span>
  );
}

export function PageShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const course = useOptionalCourse();
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
      <Link href={course ? course.href() : "/"} className="text-sm text-slate-400 hover:text-white">
        ← Back to map
      </Link>
      <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-white">{title}</h1>
      {subtitle && <p className="mt-1 text-slate-400">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </main>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const styles =
    variant === "primary"
      ? "bg-sky-500 text-slate-950 hover:bg-sky-400"
      : "border border-white/15 text-slate-200 hover:bg-white/10";
  return (
    <button type="button" onClick={onClick} className={`rounded-xl px-5 py-2.5 font-semibold transition ${styles} ${className}`}>
      {children}
    </button>
  );
}

export function StatPill({ icon, label, value }: { icon: string; label: string; value: ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <span className="text-lg">{icon}</span>
      <div className="leading-tight">
        <div className="text-[11px] uppercase tracking-wider text-slate-400">{label}</div>
        <div className="font-semibold text-white">{value}</div>
      </div>
    </div>
  );
}
