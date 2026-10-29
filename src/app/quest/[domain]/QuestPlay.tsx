"use client";

import { QuizSession } from "@/components/QuizSession";
import { PageShell } from "@/components/ui";
import type { Domain } from "@/data/domains";
import { questionsForDomain } from "@/data/questions";
import { deck } from "@/lib/game";
import { setQuestStars } from "@/lib/store";

const QUEST_LENGTH = 10;

export function QuestPlay({ domain }: { domain: Domain }) {
  const pool = questionsForDomain(domain.id);

  return (
    <PageShell title={`${domain.emoji} ${domain.world}`} subtitle={`Domain ${domain.number}: ${domain.name} · ${domain.weight}% of the exam`}>
      <QuizSession
        color={domain.color}
        hearts={3}
        startLabel="Begin quest"
        buildDeck={() => deck(pool, QUEST_LENGTH)}
        onComplete={({ correct, total, failed }) => {
          if (failed) return 0;
          const pct = correct / total;
          const stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.5 ? 1 : 0;
          if (stars > 0) setQuestStars(domain.id, stars);
          return stars;
        }}
        intro={
          <>
            <p className="text-slate-300">{domain.summary}</p>
            <ul className="mt-5 grid gap-2 text-sm text-slate-400">
              <li>❤️ You have 3 hearts. Each wrong answer costs one.</li>
              <li>🔥 Chain correct answers for a combo: x1.5 XP at 3, x2 at 5, x3 at 10.</li>
              <li>⭐ 90% earns 3 stars, 70% earns 2, 50% earns 1. Stars give bonus XP.</li>
              <li>⌨️ Press 1-4 or A-D to answer, Enter for next.</li>
            </ul>
            <p className="mt-4 text-sm text-slate-500">
              {QUEST_LENGTH} random questions from a pool of {pool.length}.
            </p>
          </>
        }
      />
    </PageShell>
  );
}
