"use client";

import Link from "next/link";
import { ChevronRight, Shuffle } from "lucide-react";
import { BlockIcon } from "@/components/learn/block-icons";
import { Bar, PageShell } from "@/components/ui";
import { CODE_GAMES, gamePool, gameRule, hasCodeGames } from "@/engine/code-games";
import { useCourse, useLevelPool, useProgress } from "@/engine/course-context";
import { useHydrated } from "@/engine/hydrated";
import { LEVEL_BY_ID, levelOf } from "@/engine/levels";
import type { SkillLevel } from "@/engine/types";

const LEVELS: SkillLevel[] = ["beginner", "junior", "intermediate", "senior", "staff"];
const card =
  "group flex min-h-11 items-start gap-4 rounded-card border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-accent/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export default function CodeGamesHub() {
  const { course, href } = useCourse();
  const p = useProgress();
  const hydrated = useHydrated();
  const { level } = useLevelPool();
  if (!hasCodeGames(course)) {
    return (
      <PageShell title="Code games">
        <p className="text-base text-muted-foreground">This track doesn&apos;t have code games yet.</p>
      </PageShell>
    );
  }
  const levelName = level in LEVEL_BY_ID ? LEVEL_BY_ID[level as SkillLevel].name.toLowerCase() : level;
  return (
    <PageShell
      title="Code games"
      subtitle={`Three quick ways to practise reading and fixing ${course.shortTitle} code. Rounds use your level (${levelName}), and anything you miss comes back in Daily Review.`}
    >
      <ul className="grid gap-3">
        <li>
          <Link href={href("/code-games/mix")} className={`${card} border-primary/50 bg-primary/5`}>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary/15 text-primary">
              <Shuffle aria-hidden="true" className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-semibold text-foreground">Mixed warm-up</span>
              <span className="block text-sm text-muted-foreground">Two of each game, unplayed ones first. A good place to start.</span>
            </span>
            <ChevronRight aria-hidden="true" className="mt-2 size-5 shrink-0 text-muted-foreground" />
          </Link>
        </li>
        {CODE_GAMES.map((g) => {
          const pool = gamePool(course, g.id);
          const cleared = hydrated ? pool.filter((q) => p.questions[q.id]?.lastCorrect).length : 0;
          const counts = LEVELS.map((l) => [l, pool.filter((q) => levelOf(q) === l).length] as const).filter(([, n]) => n > 0);
          return (
            <li key={g.id}>
              <Link href={href(`/code-games/${g.id}`)} className={card}>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-muted text-foreground">
                  <BlockIcon icon={g.icon} className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold text-foreground">{g.name}</span>
                  <span className="block text-sm text-foreground">{g.blurb}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{gameRule(g.id, course)}</span>
                  <span className="mt-3 flex items-center gap-3">
                    <Bar value={pool.length ? cleared / pool.length : 0} className="h-1.5 max-w-48 flex-1" />
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {hydrated ? cleared : "–"}/{pool.length} cleared
                    </span>
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{counts.map(([l, n]) => `${n} ${LEVEL_BY_ID[l].name.toLowerCase()}`).join(" · ")}</span>
                </span>
                <ChevronRight aria-hidden="true" className="mt-2 size-5 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}
