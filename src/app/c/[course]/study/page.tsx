"use client";

import Link from "next/link";
import { Tilt } from "@/components/fx";
import { Bar, PageShell } from "@/components/ui";
import { useCourse, useProgress } from "@/engine/course-context";

export default function StudyHub() {
  const { course, href } = useCourse();
  const p = useProgress();
  const total = Object.values(p.studyMinutes).reduce((a, b) => a + b, 0);

  return (
    <PageShell title="📚 Study mode" subtitle="Learn at your own pace first, then play with what you learned. No questions until you're ready.">
      <div className="mb-5 flex flex-wrap gap-3 text-sm text-slate-300">
        <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">⏱️ {total} minutes studied</span>
        <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          🎯 {p.challengesSolved.length}/{course.challenges.length} hands-on challenges solved
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {course.domains.map((d) => {
          const lessons = course.lessons[d.id] ?? [];
          const seen = lessons.filter((l) => p.studied.includes(l.id)).length;
          const labs = course.challenges.filter((c) => c.domain === d.id).length;
          return (
            <Tilt key={d.id} className="rounded-2xl">
              <Link
                href={href(`/study/${d.id}`)}
                className="block rounded-2xl border p-4 transition hover:-translate-y-0.5"
                style={{ borderColor: `${d.color}55`, background: `linear-gradient(130deg, ${d.color}20, transparent 70%)` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{d.emoji}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-wider" style={{ color: d.color }}>
                      World {d.number} · {d.weight}%
                    </div>
                    <div className="font-black text-white">{d.world}</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
                  <span>📖 {lessons.length} concepts</span>
                  <span>🎯 {labs} challenges</span>
                  <span>⏱️ {p.studyMinutes[d.id] ?? 0} min studied</span>
                </div>
                <Bar value={lessons.length ? seen / lessons.length : 0} color={d.color} className="mt-3 h-1.5" />
                <div className="mt-1 text-xs text-slate-400">
                  {seen}/{lessons.length} concepts opened
                </div>
              </Link>
            </Tilt>
          );
        })}
      </div>
    </PageShell>
  );
}
