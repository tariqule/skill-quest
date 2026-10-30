"use client";

import Link from "next/link";
import { PageShell } from "@/components/ui";
import { useCourse } from "@/engine/course-context";
import { SCENARIO_GAMES } from "@/engine/scenarios";
import { itemKey } from "@/engine/srs";
import { useSrs } from "@/engine/srs-store";
import { scenariosFor } from "@/scenarios";

export default function ScenariosHub() {
  const { course, href } = useCourse();
  const srs = useSrs();
  const games = SCENARIO_GAMES.filter((g) => scenariosFor(course.id, g.id).length > 0);
  if (!games.length) {
    return (
      <PageShell title="🏗️ Scenario games">
        <p className="text-slate-300">This course doesn&apos;t have scenario games yet.</p>
      </PageShell>
    );
  }
  return (
    <PageShell title="🏗️ Scenario games" subtitle={`Apply ${course.shortTitle} to realistic situations. Every item links the lesson that teaches it, and what you play comes back in Daily Review.`}>
      <ul className="grid gap-4">
        {games.map((g) => {
          const items = scenariosFor(course.id, g.id);
          const played = items.filter((x) => srs[itemKey(course.id, "sc", x.id)]).length;
          return (
            <li key={g.id}>
              <Link href={href(`/scenarios/${g.id}`)} className="group flex min-h-11 items-start gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition hover:-translate-y-0.5 hover:border-emerald-400/50">
                <span className="text-4xl transition group-hover:scale-110" aria-hidden>
                  {g.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-lg font-black text-white">{g.name}</span>
                  <span className="block text-base text-slate-300">{g.blurb}</span>
                  <span className="mt-1 block text-sm text-slate-400">{g.rule}</span>
                  <span className="mt-2 block font-mono text-xs text-emerald-300">
                    {played}/{items.length} played
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}
