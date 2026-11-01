"use client";

import { BookOpenIcon, TargetIcon, TimerIcon } from "lucide-react";
import Link from "next/link";
import { Tilt } from "@/components/fx";
import { Bar, PageShell } from "@/components/ui";
import { useCourse, useProgress } from "@/engine/course-context";
import { BlockIcon } from "@/components/learn/block-icons";

export default function StudyHub() {
  const { course, href } = useCourse();
  const p = useProgress();
  const total = Object.values(p.studyMinutes).reduce((a, b) => a + b, 0);

  return (
    <PageShell title="Study mode" subtitle="Learn at your own pace first, then play with what you learned. No questions until you're ready.">
      <div className="mb-5 flex flex-wrap gap-3 text-sm text-muted-foreground">
        <span className="rounded-xl border border-border bg-muted px-3 py-2"><TimerIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> {total} minutes studied</span>
        <span className="rounded-xl border border-border bg-muted px-3 py-2">
          <TargetIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> {p.challengesSolved.length}/{course.challenges.length} hands-on challenges solved
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
                
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl"><BlockIcon icon={d.emoji} className="inline-block size-[1.1em] align-[-0.15em]" /></span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold" style={{ color: d.color }}>
                      World {d.number} · {d.weight}%
                    </div>
                    <div className="font-semibold text-foreground">{d.world}</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span><BookOpenIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> {lessons.length} concepts</span>
                  <span><TargetIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> {labs} challenges</span>
                  <span><TimerIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> {p.studyMinutes[d.id] ?? 0} min studied</span>
                </div>
                <Bar value={lessons.length ? seen / lessons.length : 0} color={d.color} className="mt-3 h-1.5" />
                <div className="mt-1 text-sm text-muted-foreground">
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
