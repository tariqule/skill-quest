"use client";

import { PageShell } from "@/components/ui";
import { useCourse } from "@/engine/course-context";

export default function CheatSheetPage() {
  const { course } = useCourse();
  const services = course.cards.filter((c) => c.kind === "service");
  return (
    <PageShell title="📜 Cheat Sheet" subtitle={`${course.title} (${course.code})`}>
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
        <h2 className="font-bold text-white">Exam domains</h2>
        <div className="mt-3 grid gap-2">
          {course.domains.map((d) => (
            <div key={d.id} className="flex items-center gap-3 text-sm">
              <span className="w-10 text-right font-bold" style={{ color: d.color }}>
                {d.weight}%
              </span>
              <span className="text-slate-200">
                {d.emoji} {d.name}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-400">
          {course.exam.questions} questions{course.exam.unscored > 0 && ` (${course.exam.questions - course.exam.unscored} scored)`}, {course.exam.minutes} minutes,
          scored {course.exam.scale.min}–{course.exam.scale.max}, pass at {course.exam.scale.pass}. Question types:{" "}
          {course.exam.questionTypes.map((t) => t.name.toLowerCase()).join(", ")}.
        </p>
      </div>

      {course.cheatsheet.map((s) => (
        <section key={s.title} className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <h2 className="font-bold text-white">{s.title}</h2>
          <TermList items={s.items} />
        </section>
      ))}

      {services.length > 0 && (
        <section className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <h2 className="font-bold text-white">Services at a glance</h2>
          <TermList items={services.map((c) => [c.term, c.definition])} />
        </section>
      )}
    </PageShell>
  );
}

function TermList({ items }: { items: [string, string][] }) {
  return (
    <dl className="mt-3 grid gap-2 text-sm">
      {items.map(([k, v]) => (
        <div key={k} className="grid gap-1 sm:grid-cols-[12rem_1fr]">
          <dt className="font-semibold text-sky-300">{k}</dt>
          <dd className="text-slate-300">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
