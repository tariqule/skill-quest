"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { QuizSession } from "@/components/QuizSession";
import { PageShell } from "@/components/ui";
import { useCourse } from "@/engine/course-context";
import { deck, starsFor } from "@/engine/game";

export function QuestPlay() {
  const { domain: domainId } = useParams<{ domain: string }>();
  const { course, store, href, domain: domainById } = useCourse();
  const domain = domainById[domainId];
  if (!domain) notFound();
  const { length, hearts, starThresholds } = course.config.quest;
  const pool = course.questions.filter((q) => q.domain === domain.id);
  const percent = (n: number) => `${Math.round(n * 100)}%`;

  return (
    <PageShell title={`${domain.emoji} ${domain.world}`} subtitle={`Domain ${domain.number}: ${domain.name} · ${domain.weight}% of the exam`}>
      <QuizSession
        color={domain.color}
        hearts={hearts}
        baseXp={course.config.xp.questCorrect}
        startLabel="Begin trial"
        buildDeck={() => deck(pool, length)}
        onComplete={({ correct, total, failed }) => {
          if (failed) return 0;
          const stars = starsFor(course, correct, total);
          if (stars > 0) store.setQuestStars(domain.id, stars);
          return stars;
        }}
        intro={
          <>
            <p className="text-slate-300">{domain.summary}</p>
            <ul className="mt-5 grid gap-2 text-sm text-slate-400">
              <li>
                ❤️ You have {hearts} hearts. Each wrong answer costs one.
              </li>
              <li>🔥 Chain correct answers for a combo: x1.5 XP at 3, x2 at 5, x3 at 10.</li>
              <li>
                ⭐ {percent(starThresholds[0])} earns 3 stars, {percent(starThresholds[1])} earns 2, {percent(starThresholds[2])} earns 1. Stars give bonus XP.
              </li>
              <li>⌨️ Press 1-4 or A-D to answer, Enter for next.</li>
            </ul>
            <p className="mt-4 text-sm text-slate-500">
              {Math.min(length, pool.length)} random questions from a pool of {pool.length}.
            </p>
            <p className="mt-4 rounded-xl border border-violet-300/30 bg-violet-400/10 p-3 text-sm text-violet-100">
              Not ready yet?{" "}
              <Link href={href(`/study/${domain.id}`)} className="font-bold underline">
                📚 Study this world first
              </Link>{" "}
              at your own pace, then come back.
            </p>
          </>
        }
      />
    </PageShell>
  );
}
