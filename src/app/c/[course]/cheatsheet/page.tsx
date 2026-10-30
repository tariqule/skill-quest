"use client";

import { RichText } from "@/components/learn/code";
import { PageShell } from "@/components/ui";
import { useCourse } from "@/engine/course-context";

const card = "cheat-card mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-5 break-inside-avoid";

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function CheatSheetPage() {
  const { course } = useCourse();
  const services = course.cards.filter((c) => c.kind === "service");
  const hasTasks = course.domains.some((d) => (course.guide.tasks[d.id] ?? []).length > 0);
  const nav = [
    ...(hasTasks ? ["Task statements"] : []),
    ...course.cheatsheet.map((s) => s.title),
    ...(services.length > 0 ? ["Services at a glance"] : []),
  ];
  return (
    <PageShell title="📜 Cheat Sheet" subtitle={`${course.title} (${course.code})`}>
      <div className="cheat-sheet text-base leading-relaxed">
        <div className="flex flex-wrap items-center gap-3 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 font-semibold text-white hover:bg-white/10"
          >
            🖨️ Print or save as PDF
          </button>
        </div>
        <nav aria-label="Cheat sheet sections" className="mt-4 flex flex-wrap gap-2 print:hidden">
          {nav.map((t) => (
            <a key={t} href={`#${slug(t)}`} className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-200 hover:bg-white/10">
              {t}
            </a>
          ))}
        </nav>

        <div className={card}>
          <h2 className="text-lg font-bold text-white">Exam domains</h2>
          <div className="mt-3 grid gap-2">
            {course.domains.map((d) => (
              <div key={d.id} className="flex items-center gap-3">
                <span className="w-12 text-right font-bold" style={{ color: d.color }}>
                  {d.weight}%
                </span>
                <span className="text-slate-100">
                  {d.emoji} {d.name}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-slate-300">
            {course.exam.questions} questions{course.exam.unscored > 0 && ` (${course.exam.questions - course.exam.unscored} scored)`}, {course.exam.minutes} minutes,
            scored {course.exam.scale.min} to {course.exam.scale.max}, pass at {course.exam.scale.pass}. Question types:{" "}
            {course.exam.questionTypes.map((t) => t.name.toLowerCase()).join(", ")}.
          </p>
        </div>

        {hasTasks && (
          <section id="task-statements" className={card}>
            <h2 className="text-lg font-bold text-white">Task statements</h2>
            {course.domains.map((d) => (
              <div key={d.id} className="mt-4">
                <h3 className="font-semibold" style={{ color: d.color }}>
                  Domain {d.number}: {d.name}
                </h3>
                <ul className="mt-2 grid gap-2">
                  {(course.guide.tasks[d.id] ?? []).map((t) => (
                    <li key={t.id} className="text-slate-200">
                      <span className="font-semibold text-white">{t.id}</span> {t.title}
                      {t.covers.length > 0 && <span className="block text-slate-300">{t.covers.join(" · ")}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {course.cheatsheet.map((s) => (
          <section key={s.title} id={slug(s.title)} className={card}>
            <h2 className="text-lg font-bold text-white">{s.title}</h2>
            <TermList items={s.items} />
          </section>
        ))}

        {services.length > 0 && (
          <section id="services-at-a-glance" className={card}>
            <h2 className="text-lg font-bold text-white">Services at a glance</h2>
            <TermList items={services.map((c) => [c.term, c.definition])} />
          </section>
        )}
      </div>
    </PageShell>
  );
}

function TermList({ items }: { items: [string, string][] }) {
  return (
    <dl className="mt-3 grid gap-3">
      {items.map(([k, v]) => (
        <div key={k} className="grid gap-1 sm:grid-cols-[13rem_1fr]">
          <dt className="font-semibold text-sky-300"><RichText text={k} /></dt>
          <dd className="max-w-[70ch] text-slate-200"><RichText text={v} /></dd>
        </div>
      ))}
    </dl>
  );
}
