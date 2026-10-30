"use client";

import { useState } from "react";
import { LevelPicker } from "@/components/code/ui";
import { Confetti } from "@/components/fx";
import { Bar } from "@/components/ui";
import { useCourse, useProgress } from "@/engine/course-context";
import { levelUpStatus } from "@/engine/levelup";
import { effectiveLevel, LEVEL_BY_ID, levelOptions, questionsForLevel, type LevelChoice } from "@/engine/levels";

/** "How much do you know?" for the current course. Works on certification and Code Quest maps. */
export function CourseLevel({ title = "How much do you know?", note }: { title?: string; note?: string }) {
  const { course, store } = useCourse();
  const p = useProgress();
  const options = levelOptions(course);
  const counts = Object.fromEntries(options.map((l) => [l.id, questionsForLevel(course, l.id).length])) as Record<LevelChoice, number>;
  const current = effectiveLevel(course, p.level);
  return (
    <section className="mt-8">
      <h2 className="text-lg font-black text-white sm:text-xl">{title}</h2>
      <p className="mt-1 text-sm text-slate-400">{note ?? "Pick the level that fits you. Lessons, practice and tests follow your choice. You can change it any time."}</p>
      <div className="mt-4">
        <LevelPicker value={current} onChange={(l) => store.setLevel(l)} counts={counts} options={options} />
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
      <section className="pop-in mt-6 grid gap-4 rounded-3xl border-2 border-emerald-400/50 bg-gradient-to-br from-emerald-400/15 to-sky-400/10 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        {party && <Confetti count={70} />}
        <div className="text-5xl">🎓</div>
        <div>
          <div className="text-lg font-black text-white">You&apos;ve finished the basics!</div>
          <p className="text-sm text-slate-300">
            You got through every &quot;Start here&quot; lesson and got {status.mastered} of {status.questionsTotal} beginner questions right. You&apos;re ready
            for {next.name}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setParty(true);
            store.setLevel(status.next);
          }}
          className="btn-3d rounded-2xl bg-emerald-400 px-5 py-3 font-black text-slate-950"
          style={{ "--edge": "#047857" } as React.CSSProperties}
        >
          {next.icon} Level up to {next.name}
        </button>
      </section>
    );
  }

  const lessons = status.lessonsDone / status.lessonsTotal;
  const questions = status.mastered / Math.ceil(status.questionsTotal * 0.8);
  return (
    <section className="mt-6 rounded-2xl border border-rose-300/30 bg-rose-300/[0.07] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-2xl">🐣</span>
        <div className="min-w-0 flex-1">
          <div className="font-black text-white">Beginner path</div>
          <p className="text-sm text-slate-300">
            Finish the &quot;Start here&quot; lessons and get most of the easy questions right to unlock {next.name}. No rush, and there&apos;s no timer.
          </p>
        </div>
      </div>
      <div className="mt-3 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
        <div>
          <div className="mb-1 flex justify-between">
            <span>Start-here lessons</span>
            <span>
              {status.lessonsDone}/{status.lessonsTotal}
            </span>
          </div>
          <Bar value={lessons} color="#fb7185" className="h-1.5" />
        </div>
        <div>
          <div className="mb-1 flex justify-between">
            <span>Beginner questions right</span>
            <span>
              {status.mastered}/{status.questionsTotal}
            </span>
          </div>
          <Bar value={Math.min(1, questions)} color="#fb7185" className="h-1.5" />
        </div>
      </div>
    </section>
  );
}
