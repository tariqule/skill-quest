"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo } from "react";
import { DesignPromptList } from "@/components/practice/DesignPromptList";
import { LockedTopic } from "@/components/practice/LockedTopic";
import { PracticeCoverage } from "@/components/practice/PracticeCoverage";
import { unlockPhrase } from "@/components/practice/copy";
import { usePracticeSummary } from "@/components/practice/usePracticeSummary";
import { Sprout } from "lucide-react";
import { PageShell } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useCourse } from "@/engine/course-context";
import { prepare } from "@/engine/game";
import { buildPracticeDeck, entryLesson } from "@/engine/practice";
import type { Topic } from "@/engine/types";

/** The quiz runner is only needed once there is something to practise, so it loads on demand. */
const QuizSession = dynamic(() => import("@/components/QuizSession").then((m) => m.QuizSession));

/** Questions per practice round. */
const DECK_SIZE = 10;

export default function PracticePage() {
  const { course, store, href } = useCourse();
  const summary = usePracticeSummary();
  const lessonIds = useMemo(() => new Set(Object.values(course.lessons).flat().map((l) => l.id)), [course]);
  const lessonHref = (topic: Topic) => {
    const id = entryLesson(topic, lessonIds);
    return id ? href(`/lesson/${id}`) : href();
  };
  const xp = course.config.xp.reviewCorrect;

  if (!summary.total) {
    return (
      <PageShell title="Topic practice">
        <p className="text-base text-muted-foreground">This course doesn&apos;t have a topic syllabus yet. Try Fix mistakes or a mission instead.</p>
      </PageShell>
    );
  }

  const next = summary.next;
  const nextStep = next && <LockedTopic finish={{ title: next.topic.title, href: lessonHref(next.topic) }} unlocks={unlockPhrase(next.unlocks)} />;

  if (!summary.done.length) {
    return (
      <PageShell title="Topic practice" subtitle="Mixed questions from every topic you have finished, never from ones you haven't.">
        <div className="rounded-card border border-border bg-card p-6 text-center">
          <Sprout className="mx-auto size-10 text-success-foreground" aria-hidden />
          <p className="mt-3 text-base text-foreground">Nothing to practise yet. Practice opens up as you finish lessons.</p>
          {next && (
            <Button size="xl" className="mt-4 h-auto min-h-12 max-w-full whitespace-normal py-2 sm:h-auto" render={<Link href={lessonHref(next.topic)} />}>
              Start lesson 1: {next.topic.title}
            </Button>
          )}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Topic practice" subtitle="Mixed questions from every topic you have finished, weighted toward recent ones and past misses.">
      <PracticeCoverage covered={summary.covered.length} total={summary.total} available={summary.available} planned={summary.planned} />
      <div className="mt-4">{summary.full ? <p className="text-base text-success-foreground">Every written topic is done: this is full mixed practice.</p> : nextStep}</div>
      <div className="mt-6">
        <QuizSession
          startLabel={`Practise ${Math.min(summary.available, DECK_SIZE)} questions`}
          baseXp={xp}
          showDomain
          buildDeck={() => buildPracticeDeck(course, store.get(), DECK_SIZE).map(prepare)}
          emptyMessage={<p>No questions unlocked yet. Finish a lesson to open some.</p>}
          intro={<p className="text-base text-muted-foreground">Each right answer earns {xp} XP. Questions you missed come back more often.</p>}
        />
      </div>
      <DesignPromptList prompts={summary.prompts} />
    </PageShell>
  );
}
