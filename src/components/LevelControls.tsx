"use client";

import { useState } from "react";
import { ArrowUpCircle, GraduationCap, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LevelPicker } from "@/components/code/ui";
import { Confetti } from "@/components/fx";
import { Bar } from "@/components/ui";
import { useLevelCounts } from "@/components/levels/useLevelCounts";
import { useCourse, useProgress } from "@/engine/course-context";
import { levelUpStatus } from "@/engine/levelup";
import { effectiveLevel, LEVEL_BY_ID, levelOptions } from "@/engine/levels";

/** "How much do you know?" for the current course. Works on certification and Code Quest maps. */
export function CourseLevel({ title = "How much do you know?", note }: { title?: string; note?: string }) {
  const { course, store } = useCourse();
  const p = useProgress();
  const options = levelOptions(course);
  const { counts, labels } = useLevelCounts(course);
  const current = effectiveLevel(course, p.level);
  return (
    <section className="mt-8">
      <h2 className="font-heading text-h4 font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{note ?? "Pick the level that fits you. Lessons, practice and tests follow your choice. You can change it any time."}</p>
      <div className="mt-4">
        <LevelPicker value={current} onChange={(l) => store.setLevel(l)} counts={counts} countLabels={labels} options={options} />
      </div>
    </section>
  );
}

/** Beginner progress, and the "level up" moment when the basics are done. */
export function LevelUpBanner() {
  const { course, store } = useCourse();
  const p = useProgress();
  const [party, setParty] = useState(false);
  const status = levelUpStatus(course, p);
  if (!status) return null;
  const next = LEVEL_BY_ID[status.next];

  if (status.ready) {
    return (
      <section aria-labelledby="levelup-h" className="mt-6 grid gap-4 rounded-card border border-success/50 bg-success/10 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        {party && <Confetti count={70} />}
        <span className="flex size-12 items-center justify-center rounded-full bg-success/20 text-success-foreground">
          <GraduationCap aria-hidden="true" className="size-6" />
        </span>
        <div>
          <h2 id="levelup-h" className="text-base font-semibold text-foreground">
            You&apos;ve finished the basics
          </h2>
          <p className="text-sm text-muted-foreground">
            You got through every &quot;Start here&quot; lesson and got {status.mastered} of {status.questionsTotal} beginner questions right. You&apos;re ready
            for {next.name}.
          </p>
        </div>
        <Button
          variant="outline"
          size="xl"
          onClick={() => {
            setParty(true);
            store.setLevel(status.next);
          }}
        >
          <ArrowUpCircle aria-hidden="true" />
          Move up to {next.name}
        </Button>
      </section>
    );
  }

  const lessons = status.lessonsDone / status.lessonsTotal;
  const questions = status.mastered / Math.ceil(status.questionsTotal * 0.8);
  return (
    <section aria-labelledby="beginner-h" className="mt-6 rounded-card border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <Sprout aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <h2 id="beginner-h" className="text-base font-semibold text-foreground">
            Beginner path
          </h2>
          <p className="text-sm text-muted-foreground">
            Finish the &quot;Start here&quot; lessons and get most of the easy questions right to unlock {next.name}. No rush, and there&apos;s no timer.
          </p>
        </div>
      </div>
      <div className="mt-3 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
        <div>
          <div className="mb-1 flex justify-between">
            <span>Start-here lessons</span>
            <span className="tabular-nums">
              {status.lessonsDone}/{status.lessonsTotal}
            </span>
          </div>
          <Bar value={lessons} className="h-1.5" />
        </div>
        <div>
          <div className="mb-1 flex justify-between">
            <span>Beginner questions right</span>
            <span className="tabular-nums">
              {status.mastered}/{status.questionsTotal}
            </span>
          </div>
          <Bar value={Math.min(1, questions)} className="h-1.5" />
        </div>
      </div>
    </section>
  );
}
