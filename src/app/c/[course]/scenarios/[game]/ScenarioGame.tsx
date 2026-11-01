"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Play, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScenarioPlay } from "@/components/scenarios/ScenarioPlay";
import { PageShell } from "@/components/ui";
import { useCourse } from "@/engine/course-context";
import { gameText, gradeFor, SCENARIO_GAME_BY_ID, scenariosOf, type ScenarioGameId, type ScenarioItem } from "@/engine/scenarios";
import { itemKey } from "@/engine/srs";
import { getSrs, gradeItem } from "@/engine/srs-store";
import { completeScenario, makeOnce } from "@/engine/scenario-progress";

/** Unplayed items first, then the ones due soonest. */
function order(courseId: string, items: ScenarioItem[]) {
  const srs = getSrs();
  const due = (x: ScenarioItem) => srs[itemKey(courseId, "sc", x.id)]?.due ?? "";
  return [...items].sort((a, b) => due(a).localeCompare(due(b)));
}

export function ScenarioGame() {
  const { game } = useParams<{ game: string }>();
  const { course, href, store } = useCourse();
  const info = SCENARIO_GAME_BY_ID[game as ScenarioGameId];
  const all = info ? scenariosOf(course, info.id) : [];
  const [queue, setQueue] = useState<ScenarioItem[] | null>(null);
  const [i, setI] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [xp, setXp] = useState(0);
  const [once] = useState(makeOnce);
  if (!info) notFound();
  if (!all.length) {
    return (
      <PageShell title={info.name}>
        <p className="text-base text-muted-foreground">No {info.name} items for {course.shortTitle} yet.</p>
        <Link href={href("/scenarios")} className="mt-4 inline-flex min-h-11 items-center gap-1 font-medium text-primary underline underline-offset-4">
          Back to scenario games
        </Link>
      </PageShell>
    );
  }
  const q = queue ?? [];
  return (
    <PageShell title={info.name} subtitle={gameText(info.id, all).rule} width="play">
      {!queue ? (
        <div className="flex flex-col gap-4 rounded-card border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base text-muted-foreground">
            <span className="font-semibold text-foreground">{all.length} scenarios.</span> Unplayed ones come first.
          </p>
          <Button size="lg" className="shrink-0" onClick={() => setQueue(order(course.id, all))}>
            <Play aria-hidden="true" />
            Start round ({all.length} scenarios)
          </Button>
        </div>
      ) : i < q.length ? (
        <div>
          <p className="mb-2 text-sm tabular-nums text-muted-foreground">
            {i + 1} / {q.length}
          </p>
          <ScenarioPlay
            key={q[i].id}
            courseId={course.id}
            item={q[i]}
            doneLabel={i + 1 < q.length ? "Next scenario" : "Finish"}
            onResult={(share) => {
              const it = q[i];
              once(`${i}:${it.id}`, () => {
                gradeItem(itemKey(course.id, "sc", it.id), gradeFor(share));
                const gained = completeScenario(store, course.config.xp.scenarioComplete, course.id, it.id, share);
                setXp((n) => n + gained);
                setScores((s) => [...s, share]);
              });
            }}
            onDone={() => {
              setI((n) => n + 1);
              window.scrollTo({ top: 0 });
            }}
          />
        </div>
      ) : (
        <div className="rounded-card border border-border bg-card p-6 text-center" aria-live="polite">
          <Trophy aria-hidden="true" className="mx-auto size-8 text-reward" />
          <p className="mt-2 font-heading text-h3 font-semibold text-foreground">Round done</p>
          <p className="mt-2 text-base text-muted-foreground">Average score {Math.round((scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length)) * 100)}%, +{xp} XP. These items are now scheduled in Daily Review.</p>
          <Button size="xl" className="mt-4" render={<Link href={href("/scenarios")} />}>
            <ArrowLeft aria-hidden="true" />
            Back to scenario games
          </Button>
        </div>
      )}
    </PageShell>
  );
}
