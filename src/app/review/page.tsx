"use client";

import { QuizSession } from "@/components/QuizSession";
import { PageShell } from "@/components/ui";
import { deck, missedQuestions } from "@/lib/game";
import { getProgress, useProgress } from "@/lib/store";

export default function ReviewPage() {
  const missed = missedQuestions(useProgress());

  return (
    <PageShell title="🔁 Review Mistakes" subtitle="Questions you got wrong last time. Fix them to raise your mastery.">
      <QuizSession
        startLabel={`Review ${Math.min(missed.length, 15)} questions`}
        baseXp={12}
        showDomain
        buildDeck={() => deck(missedQuestions(getProgress()), 15)}
        emptyMessage={
          <>
            <div className="text-5xl">🎉</div>
            <p className="mt-3">No mistakes to review. Go play a quest or the Boss Battle.</p>
          </>
        }
        intro={
          <p className="text-slate-300">
            You have <span className="font-semibold text-white">{missed.length}</span> question{missed.length === 1 ? "" : "s"} to fix.
            Each fix earns 12 XP and counts toward the Comeback Kid badge.
          </p>
        }
      />
    </PageShell>
  );
}
