"use client";

import { ArrowRight, CheckCircle2, Code2, RotateCcw, Zap } from "lucide-react";
import { NextSteps, PageIntro, PageSkeleton } from "@/components/shell/PageIntro";
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
      <main className="mx-auto w-full max-w-5xl px-4 py-6 text-base sm:py-10">
        <PageIntro icon={Zap} title="Daily code warm-up">
          Six quick code games from your tracks: put lines in order, spot the bug, predict the output. Anything you miss comes back in your review.
        </PageIntro>
        {mounted ? <Warmup /> : <PageSkeleton />}
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
    return (
      <NextSteps
        icon={Code2}
        title="No code games in your plan yet"
        line="Warm-ups come from code tracks. Add one to your plan, or open any code track to play its games there."
        primary={{ href: "/#plan", label: plan ? "Change my plan" : "Start a plan", icon: ArrowRight }}
        more={[
          { href: "/code", label: "Browse code tracks", icon: Code2, line: "JavaScript, React, SQL, system design and more." },
          { href: "/daily", label: "Quick refresher", icon: RotateCcw, line: "Review what you've already learned." },
        ]}
      />
    );
  }
  if (i >= picks.length) {
    return (
      <NextSteps
        icon={CheckCircle2}
        title="Warm-up done. Good effort."
        line={`${right} of ${picks.length} right. Anything you missed will come back in your review.`}
        primary={{ href: "/", label: "Back to today's plan", icon: ArrowRight }}
        more={[{ href: "/daily", label: "Quick refresher", icon: RotateCcw, line: "Review what's due." }]}
      />
    );
  }
  const { course, q } = picks[i];
  return (
    <div className="mt-6 max-w-3xl">
      <div className="mb-2 text-sm text-muted-foreground" aria-live="polite">{i + 1} of {picks.length}</div>
      <GameItem key={`${course.id}-${q.id}`} course={course} q={q} onDone={(ok) => { if (ok) setRight((r) => r + 1); setI((n) => n + 1); }} />
    </div>
  );
}
