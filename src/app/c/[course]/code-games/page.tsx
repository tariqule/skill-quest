"use client";

import Link from "next/link";
import { PageShell } from "@/components/ui";
import { CODE_GAMES, gamePool, gameRule, hasCodeGames } from "@/engine/code-games";
import { useCourse, useLevelPool, useProgress } from "@/engine/course-context";
import { levelOf } from "@/engine/levels";
import type { SkillLevel } from "@/engine/types";

const LEVELS: SkillLevel[] = ["beginner", "junior", "intermediate", "senior", "staff"];

export default function CodeGamesHub() {
  const { course, href } = useCourse();
  const p = useProgress();
  const { level } = useLevelPool();
  if (!hasCodeGames(course)) {
    return (
      <PageShell title="🧱 Code games">
        <p className="text-slate-300">This track doesn&apos;t have code games yet.</p>
      </PageShell>
    );
  }
  return (
    <PageShell title="🧱 Code games" subtitle={`Three quick ways to practise reading and fixing ${course.shortTitle} code. Rounds use your level (${level}) and missed items come back in Daily Review.`}>
      <ul className="grid gap-4">
        {CODE_GAMES.map((g) => {
          const pool = gamePool(course, g.id);
          const cleared = pool.filter((q) => p.questions[q.id]?.lastCorrect).length;
          const counts = LEVELS.map((l) => [l, pool.filter((q) => levelOf(q) === l).length] as const).filter(([, n]) => n > 0);
          return (
            <li key={g.id}>
              <Link href={href(`/code-games/${g.id}`)} className="group flex min-h-11 items-start gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition hover:-translate-y-0.5 hover:border-emerald-400/50">
                <span className="text-4xl transition group-hover:scale-110" aria-hidden>{g.icon}</span>
                <span className="min-w-0">
                  <span className="block text-lg font-black text-white">{g.name}</span>
                  <span className="block text-base text-slate-300">{g.blurb}</span>
                  <span className="mt-1 block text-sm text-slate-400">{gameRule(g.id, course)}</span>
                  <span className="mt-2 block font-mono text-xs text-emerald-300">
                    {cleared}/{pool.length} cleared · {counts.map(([l, n]) => `${n} ${l}`).join(" · ")}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
        <li>
          <Link href={href("/code-games/mix")} className="flex min-h-11 items-center gap-4 rounded-2xl border border-sky-400/30 bg-sky-400/10 p-5 transition hover:border-sky-300">
            <span className="text-4xl" aria-hidden>🎲</span>
            <span>
              <span className="block text-lg font-black text-white">Mixed warm-up</span>
              <span className="block text-base text-slate-300">Two of each game, unplayed ones first.</span>
            </span>
          </Link>
        </li>
      </ul>
    </PageShell>
  );
}
