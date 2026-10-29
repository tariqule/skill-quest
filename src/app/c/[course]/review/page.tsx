"use client";

import { QuizSession } from "@/components/QuizSession";
import { PageShell } from "@/components/ui";
import { useCourse, useProgress } from "@/engine/course-context";
import { deck, missedQuestions } from "@/engine/game";

export default function ReviewPage() {
  const { course, store } = useCourse();
  const missed = missedQuestions(course, useProgress());
  const { maxQuestions } = course.config.review;
  const xp = course.config.xp.reviewCorrect;

  return (
    <PageShell title="🔁 Fix mistakes" subtitle="Questions you got wrong last time. Fix them to raise your mastery.">
      <QuizSession
        startLabel={`Review ${Math.min(missed.length, maxQuestions)} questions`}
        baseXp={xp}
        showDomain
        buildDeck={() => deck(missedQuestions(course, store.get()), maxQuestions)}
        emptyMessage={
          <>
            <div className="text-5xl">🎉</div>
            <p className="mt-3">No mistakes to review. Go play a mission or a trial.</p>
          </>
        }
        intro={
          <p className="text-slate-300">
            You have <span className="font-semibold text-white">{missed.length}</span> question{missed.length === 1 ? "" : "s"} to fix.
            Each fix earns {xp} XP and counts toward the Comeback Kid badge.
          </p>
        }
      />
    </PageShell>
  );
}
