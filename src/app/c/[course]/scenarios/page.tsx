"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BlockIcon } from "@/components/learn/block-icons";
import { PageShell } from "@/components/ui";
import { useHydrated } from "@/engine/hydrated";
import { useCourse } from "@/engine/course-context";
import { playedCounts, useScenarioResults } from "@/engine/scenario-progress";
import { gameText, MASTERED_AT, SCENARIO_GAMES } from "@/engine/scenarios";
import { scenariosFor } from "@/scenarios";

export default function ScenariosHub() {
  const { course, href } = useCourse();
  const results = useScenarioResults();
  const hydrated = useHydrated();
  const games = SCENARIO_GAMES.filter((g) => scenariosFor(course.id, g.id).length > 0);
  if (!games.length) {
    return (
      <PageShell title="Scenario games">
        <p className="text-base text-muted-foreground">This course doesn&apos;t have scenario games yet.</p>
      </PageShell>
    );
  }
  return (
    <PageShell title="Scenario games" subtitle={`Apply ${course.shortTitle} to realistic situations. Every item links the lesson that teaches it, and what you play comes back in Daily Review.`}>
      <ul className="grid gap-4">
        {games.map((g) => {
          const items = scenariosFor(course.id, g.id);
          const { played, mastered } = playedCounts(results, course.id, items.map((x) => x.id), MASTERED_AT);
          return (
            <li key={g.id}>
              <Link href={href(`/scenarios/${g.id}`)} className="flex min-h-11 items-start gap-4 rounded-card border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-accent/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-muted text-foreground">
                  <BlockIcon icon={g.icon} className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold text-foreground">{g.name}</span>
                  <span className="block text-sm text-foreground">{gameText(g.id, items).blurb}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{gameText(g.id, items).rule}</span>
                  <span className="mt-2 block text-sm text-muted-foreground">
                    {hydrated ? played : "–"}/{items.length} played · {hydrated ? mastered : "–"} mastered (best score ≥ {Math.round(MASTERED_AT * 100)}%)
                  </span>
                </span>
                <ChevronRight aria-hidden="true" className="mt-2 size-5 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}
