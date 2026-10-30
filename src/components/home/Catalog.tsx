"use client";

import Link from "next/link";
import { useState } from "react";
import { Tilt } from "@/components/fx";
import { LifecycleBadges } from "@/components/Lifecycle";
import { Bar } from "@/components/ui";
import { COURSES, getCourse } from "@/courses";
import { BUNDLES } from "@/engine/bundles";
import { overallReadiness } from "@/engine/game";
import { indexCourse } from "@/engine/indexes";
import { getCourseStore } from "@/engine/store";
import { isCodeTrack } from "@/engine/tracks";
import type { Course } from "@/engine/types";

type Section = "all" | "cert" | "interview" | "fundamentals";
const FILTERS: { id: Section; label: string }[] = [
  { id: "all", label: "All" },
  { id: "cert", label: "🎓 Certifications" },
  { id: "interview", label: "🎤 Interview prep" },
  { id: "fundamentals", label: "🌱 Fundamentals" },
];

const CERTS = COURSES.filter((c) => !isCodeTrack(c));
const INTERVIEW = COURSES.filter((c) => isCodeTrack(c) && c.kind === "interview");
const FUNDAMENTALS = COURSES.filter((c) => c.kind === "learning");

function matches(c: Course, q: string) {
  if (!q) return true;
  const hay = `${c.title} ${c.shortTitle} ${c.code} ${c.provider.name} ${c.tagline} ${c.category ?? ""}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((w) => hay.includes(w));
}

/** Sectioned course catalog with search and section filters. */
export function Catalog() {
  const [q, setQ] = useState("");
  const [section, setSection] = useState<Section>("all");
  const show = (s: Section) => section === "all" || section === s;
  const certs = CERTS.filter((c) => matches(c, q));
  const providers = [...new Set(certs.map((c) => c.provider.name))];
  const interview = INTERVIEW.filter((c) => matches(c, q));
  const bundles = BUNDLES.filter((b) => !q || `${b.title} ${b.line}`.toLowerCase().includes(q.toLowerCase()));
  const fundamentals = FUNDAMENTALS.filter((c) => matches(c, q));
  const none = certs.length + interview.length + bundles.length + fundamentals.length === 0;

  return (
    <section aria-labelledby="catalog-h" className="mt-12 border-t border-white/10 pt-8">
      <h2 id="catalog-h" className="text-2xl font-black text-white">
        All courses
      </h2>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="catalog-q" className="sr-only">
          Search courses
        </label>
        <input
          id="catalog-q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search: AWS, React, SQL, Kubernetes…"
          className="w-full rounded-xl border border-white/20 bg-slate-950 px-4 py-3 text-base text-white placeholder:text-slate-400 sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by section">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={section === f.id}
              onClick={() => setSection(f.id)}
              className={`rounded-full border px-3 py-1.5 text-sm font-bold ${section === f.id ? "border-sky-400 bg-sky-400/20 text-white" : "border-white/15 text-slate-200 hover:border-white/35"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {none && <p className="mt-6 text-base text-slate-300">No courses match “{q}”.</p>}

      {show("cert") && certs.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-black text-white">🎓 Certifications</h3>
          {providers.map((p) => (
            <div key={p} className="mt-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">{p}</h4>
              <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {certs
                  .filter((c) => c.provider.name === p)
                  .map((c) => (
                    <CourseCard key={c.id} course={c} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {show("interview") && (bundles.length > 0 || interview.length > 0) && (
        <div className="mt-10">
          <h3 className="text-xl font-black text-white">🎤 Interview prep</h3>
          {bundles.length > 0 && (
            <>
              <h4 className="mt-4 text-sm font-bold uppercase tracking-wider text-slate-300">By role</h4>
              <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {bundles.map((b) => (
                  <div key={b.id} className="rounded-2xl border-2 border-violet-400/30 bg-violet-400/[0.06] p-4">
                    <div className="text-base font-black text-white">
                      {b.icon} {b.title}
                    </div>
                    <p className="mt-1 text-sm text-slate-300">{b.line}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {b.courses.map((id) => {
                        const c = getCourse(id);
                        return c ? (
                          <Link key={id} href={`/c/${id}`} className="rounded-full bg-white/10 px-2 py-0.5 text-sm text-slate-100 hover:bg-white/20">
                            {c.shortTitle}
                          </Link>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {interview.length > 0 && (
            <>
              <h4 className="mt-6 text-sm font-bold uppercase tracking-wider text-slate-300">By topic</h4>
              <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {interview.map((c) => (
                  <CourseCard key={c.id} course={c} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {show("fundamentals") && fundamentals.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-black text-white">🌱 Fundamentals</h3>
          <p className="mt-1 text-base text-slate-300">Start from zero. No experience needed.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fundamentals.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function CourseCard({ course }: { course: Course }) {
  const p = getCourseStore(course).useProgress();
  const lessons = indexCourse(course).allLessons.length;
  const readiness = Math.round(overallReadiness(course, p));
  const code = isCodeTrack(course);
  return (
    <Tilt className="rounded-2xl" max={6}>
      <Link
        href={`/c/${course.id}`}
        className="flex h-full flex-col rounded-2xl border-2 p-4 transition hover:-translate-y-0.5"
        style={{ borderColor: `${course.provider.color}55`, background: `linear-gradient(140deg, ${course.provider.color}1c, transparent 65%)` }}
      >
        <div className="flex items-center gap-2 text-sm font-bold" style={{ color: course.provider.color }}>
          <span className="text-lg" aria-hidden>
            {course.provider.icon}
          </span>
          {code ? (course.kind === "learning" ? "Learn from zero" : "Interview prep") : course.provider.name}
          <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-xs text-slate-100">{course.code}</span>
        </div>
        <div className="mt-2 text-lg font-black leading-snug text-white">{course.title}</div>
        <p className="mt-1 line-clamp-2 flex-1 text-base text-slate-300">{course.tagline}</p>
        {!code && <LifecycleBadges course={course} />}
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-400">
          <span>{lessons} lessons</span>
          <span>{course.questions.length} questions</span>
          {course.coding?.length ? <span>💻 live coding</span> : null}
        </div>
        {p.xp > 0 && (
          <div className="mt-3">
            <Bar value={readiness / 100} color={course.provider.color} className="h-1.5" />
            <div className="mt-1 text-sm text-slate-300">{readiness}% ready</div>
          </div>
        )}
      </Link>
    </Tilt>
  );
}
