"use client";

import Link from "next/link";
import { Award, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { BlockIcon } from "@/components/learn/block-icons";
import { BADGES } from "@/engine/badges";
import { useCourse, useProgress } from "@/engine/course-context";
import { useHydrated } from "@/engine/hydrated";
import { MODE_BY_ID } from "@/engine/modes";
import type { ModeId } from "@/engine/types";
import { cn } from "@/lib/utils";

/** Section heading for hub pages: icon, title, optional count on the right. */
export function HubSection({ id, icon: Icon, title, aside, children, className }: { id: string; icon: LucideIcon; title: string; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section aria-labelledby={id} className={cn("mt-10", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={id} className="flex items-center gap-2 font-heading text-h3 font-semibold text-foreground">
          <Icon aria-hidden="true" className="size-5 text-primary" />
          {title}
        </h2>
        {aside && <span className="text-sm text-muted-foreground">{aside}</span>}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Practice modes as calm cards: icon, name, one status line. */
export function ModeGrid({ modes }: { modes: ModeId[] }) {
  const { course, href } = useCourse();
  const p = useProgress();
  const hydrated = useHydrated();
  return (
    <ul className="grid grid-cols-1 gap-3 min-[375px]:grid-cols-2 lg:grid-cols-4">
      {modes.map((id) => {
        const m = MODE_BY_ID[id];
        return (
          <li key={m.id}>
            <Link href={href(m.to)} className="flex h-full min-h-11 flex-col rounded-card border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-accent/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              <BlockIcon icon={m.icon} className="size-6" />
              <span className="mt-2 text-base font-semibold text-foreground">{m.name}</span>
              <span className="mt-0.5 text-sm text-muted-foreground">{hydrated ? m.status(p, course) : " "}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Earned badges in reward amber with a word, not-yet badges as quiet outlines. */
export function BadgeShelf() {
  const p = useProgress();
  const hydrated = useHydrated();
  const earned = hydrated ? p.badges : [];
  return (
    <HubSection id="badges-heading" icon={Award} title="Achievements" aside={`${earned.length}/${BADGES.length} earned`}>
      <ul className="flex flex-wrap gap-2">
        {BADGES.map((b) => {
          const got = earned.includes(b.id);
          return (
            <li key={b.id} title={b.description} className={cn("inline-flex min-h-9 items-center gap-1.5 rounded-control border px-2.5 py-1 text-sm", got ? "border-reward/50 bg-reward/10 text-foreground" : "border-border text-muted-foreground")}>
              <BlockIcon icon={b.icon} className={cn("size-4", !got && "opacity-60")} />
              {b.name}
              <span className="sr-only">{got ? " (earned)" : " (not yet)"}: {b.description}</span>
            </li>
          );
        })}
      </ul>
    </HubSection>
  );
}
