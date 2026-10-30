"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { ScenarioPlay } from "@/components/scenarios/ScenarioPlay";
import { PageShell } from "@/components/ui";
import { useCourse } from "@/engine/course-context";
import { gameText, gradeFor, SCENARIO_GAME_BY_ID, type ScenarioGameId, type ScenarioItem } from "@/engine/scenarios";
import { itemKey } from "@/engine/srs";
import { getSrs, gradeItem } from "@/engine/srs-store";
import { completeScenario, makeOnce } from "@/engine/scenario-progress";
import { scenariosFor } from "@/scenarios";

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
  const all = info ? scenariosFor(course.id, info.id) : [];
  const [queue, setQueue] = useState<ScenarioItem[] | null>(null);
  const [i, setI] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [xp, setXp] = useState(0);
  const [once] = useState(makeOnce);
  if (!info) notFound();
  if (!all.length) {
    return (
      <PageShell title={`${info.icon} ${info.name}`}>
        <p className="text-slate-300">No {info.name} items for {course.shortTitle} yet.</p>
        <Link href={href("/scenarios")} className="mt-4 inline-block text-sky-300 underline">
          Back to scenario games
        </Link>
      </PageShell>
    );
  }
  const q = queue ?? [];
  return (
    <PageShell title={`${info.icon} ${info.name}`} subtitle={gameText(info.id, all).rule}>
      {!queue ? (
        <div>
          <p className="text-base text-slate-300">{all.length} items. Unplayed ones come first.</p>
          <button type="button" className="mt-4 min-h-11 rounded-2xl bg-sky-400 px-5 py-2.5 text-base font-black text-slate-950" onClick={() => setQueue(order(course.id, all))}>
            Start
          </button>
        </div>
      ) : i < q.length ? (
        <div>
          <p className="mb-2 text-sm text-slate-300">
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
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-center" aria-live="polite">
          <p className="text-2xl font-black text-white">Round done 🎉</p>
          <p className="mt-2 text-base text-slate-300">Average score {Math.round((scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length)) * 100)}%, +{xp} XP. These items are now scheduled in Daily Review.</p>
          <Link href={href("/scenarios")} className="mt-4 inline-block rounded-2xl bg-sky-400 px-5 py-2.5 font-black text-slate-950">
            Back to scenario games
          </Link>
        </div>
      )}
    </PageShell>
  );
}
