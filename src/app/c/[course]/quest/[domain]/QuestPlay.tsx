"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { QuizSession } from "@/components/QuizSession";
import { PageShell } from "@/components/ui";
import { useCourse, useLevelPool } from "@/engine/course-context";
import { courseCopy } from "@/engine/copy";
import { levelDeck, questStars, taughtPool } from "@/engine/game";
import { LEVEL_BY_ID, levelSplit } from "@/engine/levels";
import { finishedTopicPool } from "@/engine/practice";
import { BlockIcon } from "@/components/learn/block-icons";

export function QuestPlay() {
  const { domain: domainId } = useParams<{ domain: string }>();
  const { course, store, href, domain: domainById } = useCourse();
  const domain = domainById[domainId];
  if (!domain) notFound();
  const { level } = useLevelPool();
  const { length, starThresholds } = course.config.quest;
  const hearts = level === "beginner" ? course.config.quest.beginnerHearts : course.config.quest.hearts;
  const pool = course.questions.filter((q) => q.domain === domain.id);
  const split = levelSplit(course, level, pool, length);
  const copy = courseCopy(course);
  const percent = (n: number) => `${Math.round(n * 100)}%`;

  return (
    <PageShell title={`${domain.world}`} subtitle={`${copy.noun === "exam" ? "Domain" : "Stage"} ${domain.number}: ${domain.name} · ${domain.weight}% of the ${copy.noun}`}>
      <QuizSession
        color={domain.color}
        hearts={hearts}
        baseXp={course.config.xp.questCorrect}
        startLabel="Begin trial"
        emptyMessage={<p>No questions here yet. Trials only ask about topics you have finished, so finish a lesson in this world first.</p>}
        buildDeck={() => {
          const s = store.get();
          return levelDeck(course, level, finishedTopicPool(course, pool, s, (all) => taughtPool(all, [...s.lessonsDone, ...s.studied])), length);
        }}
        onComplete={(r) => {
          const stars = questStars(course, r);
          if (stars > 0) store.setQuestStars(domain.id, stars);
          return stars;
        }}
        intro={
          <>
            <p className="text-muted-foreground">{domain.summary}</p>
            <ul className="mt-5 grid gap-2 text-sm text-muted-foreground">
              <li>
                <BlockIcon icon="❤️" className="inline-block size-[1.1em] align-[-0.15em]" /> You have {hearts} hearts. Each wrong answer costs one.
              </li>
              <li><BlockIcon icon="🔥" className="inline-block size-[1.1em] align-[-0.15em]" /> Chain correct answers for a combo: x1.5 XP at 3, x2 at 5, x3 at 10.</li>
              <li>
                <BlockIcon icon="⭐" className="inline-block size-[1.1em] align-[-0.15em]" /> {percent(starThresholds[0])} earns 3 stars, {percent(starThresholds[1])} earns 2, {percent(starThresholds[2])} earns 1. Stars give bonus XP.
              </li>
              <li><BlockIcon icon="⌨️" className="inline-block size-[1.1em] align-[-0.15em]" /> Press 1-4 or A-D to answer, Enter for next.</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              {split.borrowed > 0 ? (
                <>
                  <BlockIcon icon={LEVEL_BY_ID[level].icon} className="inline-block size-[1.1em] align-[-0.15em]" /> {split.size} random questions: {split.atLevel} at {LEVEL_BY_ID[level].name} level, the other {split.borrowed} from the
                  nearest levels because this stage has only {split.atLevel} at yours.
                </>
              ) : level !== "all" && split.size < pool.length ? (
                <>
                  <BlockIcon icon={LEVEL_BY_ID[level].icon} className="inline-block size-[1.1em] align-[-0.15em]" /> {split.size} random {LEVEL_BY_ID[level].name}-level questions.
                </>
              ) : (
                <>
                  {split.size} random questions from a pool of {pool.length}.
                </>
              )}
            </p>
            <p className="mt-4 rounded-xl border border-info/30 bg-info/10 p-3 text-sm text-info-foreground">
              Not ready yet?{" "}
              <Link href={href(`/study/${domain.id}`)} className="font-bold underline">
                <BlockIcon icon="📚" className="inline-block size-[1.1em] align-[-0.15em]" /> Study this world first
              </Link>{" "}
              at your own pace, then come back.
            </p>
          </>
        }
      />
    </PageShell>
  );
}
