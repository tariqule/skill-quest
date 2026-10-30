"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { AppBar } from "@/components/Hud";
import { GameItem } from "@/components/code-games/GameItem";
import { getCourse } from "@/courses";
import { targetCourses } from "@/engine/bundles";
import { hasCodeGames, warmupPicks } from "@/engine/code-games";
import { usePlan } from "@/engine/plan-store";
import { getCourseStore } from "@/engine/store";
import type { Course } from "@/engine/types";

const noop = () => () => {};

/** Code tracks in the plan that have games; with no plan, every code track the player has started. */
function warmupCourses(target: string | null): Course[] {
  const ids = target ? targetCourses(target) : [];
  return ids.map((id) => getCourse(id)).filter((c): c is Course => !!c && hasCodeGames(c));
}

export default function WarmupPage() {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  return (
    <>
      <AppBar />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 text-base sm:py-10">
        <Link href="/" className="text-sm font-bold text-sky-300 hover:text-sky-200">
          ← Home
        </Link>
        <h1 className="mt-2 text-3xl font-black text-white">⚡ Daily code warm-up</h1>
        <p className="mt-1 text-base text-slate-300">Six quick code games across your interview tracks: put lines in order, spot the bug, predict the output. Misses come back in Daily Review.</p>
        {mounted ? <Warmup /> : <div className="mt-6 h-64 rounded-3xl bg-slate-900/40" aria-hidden />}
      </main>
    </>
  );
}

function Warmup() {
  const plan = usePlan();
  const [picks] = useState(() => warmupPicks(warmupCourses(plan?.target ?? null), (c, id) => !!getCourseStore(getCourse(c)!).get().questions[id]?.lastCorrect));
  const [i, setI] = useState(0);
  const [right, setRight] = useState(0);
  if (picks.length === 0) {
    return <p className="mt-6 text-slate-300">Your plan has no code tracks with games yet. Pick an interview plan with a code track on the home page.</p>;
  }
  if (i >= picks.length) {
    return (
      <div className="mt-6 rounded-3xl border-2 border-emerald-400/30 bg-slate-900/70 p-6">
        <div className="text-xl font-black text-white">Warm-up done ✅ {right}/{picks.length}</div>
        <Link href="/" className="mt-4 inline-block rounded-2xl bg-sky-400 px-5 py-2.5 font-black text-slate-950">Back to today&apos;s plan</Link>
      </div>
    );
  }
  const { course, q } = picks[i];
  return (
    <div className="mt-6">
      <div className="mb-2 text-sm text-slate-400" aria-live="polite">{i + 1} of {picks.length}</div>
      <GameItem key={`${course.id}-${q.id}`} course={course} q={q} onDone={(ok) => { if (ok) setRight((r) => r + 1); setI((n) => n + 1); }} />
    </div>
  );
}
