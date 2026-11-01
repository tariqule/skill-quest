"use client";

import Link from "next/link";
import { Flame, Play, Sparkles, Target, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { Button } from "@/components/ui/button";
import { Bar } from "@/components/ui";
import { useHydrated } from "@/engine/hydrated";

export type HubAction = { href: string; label: string; icon: LucideIcon };

export interface HubHeaderProps {
  /** Small line above the title: provider or track kind and the course code. */
  eyebrow: string;
  /** Per-track accent: used only on the eyebrow dot and the readiness bar. */
  accent: string;
  title: string;
  tagline?: ReactNode;
  /** The one primary action on the page. */
  primary: { href: string; label: string; line?: string };
  /** Up to two quieter actions, drawn as outline buttons. */
  secondary?: HubAction[];
  xp: number;
  streak: number;
  readiness: number;
  level: { level: number; title: string; into: number; needed: number };
}

/**
 * The course hub header, shared by certification and code tracks: title, one primary "Continue",
 * quiet secondary actions, and the XP / streak / readiness counters (count up when they change).
 * Progress lives in localStorage, so counters show a placeholder until hydrated.
 */
export function HubHeader({ eyebrow, accent, title, tagline, primary, secondary = [], xp, streak, readiness, level }: HubHeaderProps) {
  const hydrated = useHydrated();
  return (
    <header className="rounded-card border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ background: accent }} />
        <span className="min-w-0 truncate">{eyebrow}</span>
      </div>
      <h1 className="mt-2 font-heading text-h2 font-semibold tracking-tight text-foreground [overflow-wrap:anywhere]">{title}</h1>
      {tagline && <p className="mt-2 max-w-[65ch] text-base text-muted-foreground">{tagline}</p>}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Button size="xl" className="w-full sm:w-auto" render={<Link href={primary.href} />}>
          <Play aria-hidden="true" />
          {primary.label}
        </Button>
        {secondary.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:flex">
            {secondary.slice(0, 2).map((a) => {
              const I = a.icon;
              return (
                <Button key={a.href} variant="outline" size="xl" render={<Link href={a.href} />}>
                  <I aria-hidden="true" />
                  {a.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>
      {primary.line && <p className="mt-2 text-sm text-muted-foreground">{primary.line}</p>}

      <dl className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-5">
        <Stat icon={Sparkles} label="XP" tone="text-reward">
          {hydrated ? <CountUp value={xp} /> : "–"}
        </Stat>
        <Stat icon={Flame} label="Day streak" tone="text-reward">
          {hydrated ? <CountUp value={streak} /> : "–"}
        </Stat>
        <Stat icon={Target} label="Ready" tone="text-primary">
          {hydrated ? <CountUp value={readiness} format={(n) => `${n}%`} /> : "–"}
        </Stat>
      </dl>
      <div className="mt-4">
        <div className="mb-1.5 flex flex-wrap justify-between gap-x-3 text-sm text-muted-foreground">
          <span>
            Level {hydrated ? level.level : "–"} · {hydrated ? level.title : ""}
          </span>
          <span className="tabular-nums">{hydrated ? `${level.into}/${level.needed} XP to level ${level.level + 1}` : ""}</span>
        </div>
        <Bar value={hydrated ? level.into / level.needed : 0} color="var(--reward)" className="h-1.5" />
      </div>
    </header>
  );
}

function Stat({ icon: Icon, label, tone, children }: { icon: LucideIcon; label: string; tone: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Icon aria-hidden="true" className={`size-4 shrink-0 ${tone}`} />
        <span className="truncate">{label}</span>
      </dt>
      <dd className="mt-0.5 text-xl font-semibold text-foreground">{children}</dd>
    </div>
  );
}
