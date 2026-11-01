"use client";

import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import type { ReactNode } from "react";
import { BlockIcon } from "@/components/learn/block-icons";
import { useOptionalCourse } from "@/engine/course-context";
import { pct } from "@/engine/game";
import { cn } from "@/lib/utils";

/** Progress bar. Colour defaults to the primary token; a track accent may be passed for track progress only. */
export function Bar({ value, color = "var(--primary)", className = "h-2" }: { value: number; color?: string; className?: string }) {
  return (
    <div className={cn("w-full overflow-hidden rounded-full bg-muted", className)}>
      <div className="h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none" style={{ width: pct(Math.max(0, Math.min(1, value))), background: color }} />
    </div>
  );
}

/** 0–3 stars: reward amber when earned, an outline when not. */
export function Stars({ count, size = "size-5" }: { count: number; size?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${count} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <Star key={i} aria-hidden="true" className={cn(size, i < count ? "fill-reward text-reward" : "text-muted-foreground")} />
      ))}
    </span>
  );
}

export function PageShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const course = useOptionalCourse();
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
      <Link href={course ? course.href() : "/"} className="-my-3 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground print:hidden">
        <ArrowLeft aria-hidden="true" className="size-4" />
        {course ? "Back to course" : "Home"}
      </Link>
      <h1 className="mt-3 font-heading text-h2 font-semibold tracking-tight text-foreground print:text-black">{title}</h1>
      {subtitle && <p className="mt-1 max-w-[65ch] text-base text-muted-foreground">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </main>
  );
}

export function Button({ children, onClick, variant = "primary", className = "" }: { children: ReactNode; onClick?: () => void; variant?: "primary" | "ghost"; className?: string }) {
  const styles = variant === "primary" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-input text-foreground hover:bg-accent";
  return (
    <button type="button" onClick={onClick} className={cn("min-h-11 rounded-control px-5 py-2.5 font-semibold transition-colors", styles, className)}>
      {children}
    </button>
  );
}

export function StatPill({ icon, label, value }: { icon: string; label: string; value: ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-control border border-border bg-card px-3 py-2">
      <BlockIcon icon={icon} className="size-5" />
      <div className="leading-tight">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-semibold text-foreground">{value}</div>
      </div>
    </div>
  );
}
