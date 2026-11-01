"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { QuizSession } from "@/components/QuizSession";
import { PageShell } from "@/components/ui";
import { CODE_GAME_BY_ID, GAME_ROUND, gameRule, gamePool, warmupPicks, type CodeGameId } from "@/engine/code-games";
import { useCourse, useLevelPool } from "@/engine/course-context";
import { levelDeck, prepare } from "@/engine/game";

export function GamePlay() {
  const { game } = useParams<{ game: string }>();
  const { course, store, href } = useCourse();
  const { level } = useLevelPool();
  const mix = game === "mix";
  const info = mix ? { name: "Mixed warm-up", rule: "Two of each code game, unplayed ones first." } : CODE_GAME_BY_ID[game as CodeGameId] && { ...CODE_GAME_BY_ID[game as CodeGameId], rule: gameRule(game as CodeGameId, course) };
  if (!info) notFound();

  return (
    <PageShell title={info.name} subtitle={info.rule}>
      <QuizSession
        startLabel={mix ? "Start the warm-up" : `Play ${GAME_ROUND}`}
        baseXp={course.config.xp.reviewCorrect}
        showDomain
        buildDeck={() =>
          mix
            ? warmupPicks([course], (_c, id) => !!store.get().questions[id]?.lastCorrect).map((x) => prepare(x.q))
            : levelDeck(course, level, gamePool(course, game as CodeGameId), GAME_ROUND)
        }
        intro={
          <div className="text-base text-foreground">
            <p>{info.rule}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Each item links to the lesson that teaches it. <Link href={href("/code-games")} className="font-medium text-primary underline-offset-4 hover:underline">All code games</Link>
            </p>
          </div>
        }
        emptyMessage={<p>No items at this level yet.</p>}
      />
    </PageShell>
  );
}
