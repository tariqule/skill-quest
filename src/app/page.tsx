"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { Core3D, Tilt } from "@/components/fx";
import { AppBar, APP_NAME } from "@/components/Hud";
import { Bar } from "@/components/ui";
import { COURSES, PLANNED } from "@/courses";
import { overallReadiness } from "@/engine/game";
import { indexCourse } from "@/engine/indexes";
import { getCourseStore } from "@/engine/store";
import type { Course, PlannedCourse, Provider } from "@/engine/types";

export default function Catalog() {
  const providers = uniqueProviders([...COURSES, ...PLANNED]);
  const [filter, setFilter] = useState<string>("all");
  const show = <T extends { provider: Provider }>(list: T[]) => list.filter((c) => filter === "all" || c.provider.id === filter);

  return (
    <>
      <AppBar />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
        <section className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">Learn by playing</div>
            <h1 className="mt-2 text-4xl sm:text-5xl font-black text-white">{APP_NAME}</h1>
            <p className="mt-3 max-w-xl text-lg text-slate-300">
              Visual, hands-on prep for cloud and AI certifications. Every concept is taught with a picture or a lab, then proven in games and a real-format
              exam simulator.
            </p>
          </div>
          <div className="hidden md:block">
            <Core3D size={100} domains={COURSES[0]?.domains} icon="🎓" />
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-2">
          <Chip active={filter === "all"} onClick={() => setFilter("all")}>
            All
          </Chip>
          {providers.map((p) => (
            <Chip key={p.id} active={filter === p.id} onClick={() => setFilter(p.id)}>
              {p.icon} {p.name}
            </Chip>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {show(COURSES).map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
          {show(PLANNED).map((c) => (
            <PlannedCard key={c.id} course={c} />
          ))}
        </div>
      </main>
    </>
  );
}

function CourseCard({ course }: { course: Course }) {
  const progress = getCourseStore(course).useProgress();
  const lessons = indexCourse(course).allLessons.length;
  const started = progress.xp > 0;
  const readiness = Math.round(overallReadiness(course, progress));

  return (
    <Tilt className="rounded-3xl">
      <Link
        href={`/c/${course.id}`}
        className="flex h-full flex-col rounded-3xl border-2 p-5 transition hover:-translate-y-0.5"
        style={{ borderColor: `${course.provider.color}66`, background: `linear-gradient(140deg, ${course.provider.color}22, transparent 65%)` }}
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: course.provider.color }}>
          <span className="text-lg">{course.provider.icon}</span>
          {course.provider.name} · {course.level}
          <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-200">{course.code}</span>
        </div>
        <div className="mt-3 text-xl font-black text-white">{course.title}</div>
        <p className="mt-1 flex-1 text-sm text-slate-300">{course.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
          <span>🗺️ {course.domains.length} worlds</span>
          <span>📖 {lessons} missions</span>
          <span>❓ {course.questions.length} questions</span>
          <span>🏛️ exam simulator</span>
        </div>
        {started && (
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-slate-400">
              <span>Exam readiness</span>
              <span className="font-bold text-white">{readiness}%</span>
            </div>
            <Bar value={readiness / 100} color={course.provider.color} />
          </div>
        )}
        <span
          className="btn-3d mt-5 rounded-2xl py-3 text-center font-black uppercase tracking-wide text-slate-950"
          style={{ background: course.provider.color, "--edge": "#00000066" } as CSSProperties}
        >
          {started ? "Continue →" : "Start course →"}
        </span>
      </Link>
    </Tilt>
  );
}

function PlannedCard({ course }: { course: PlannedCourse }) {
  return (
    <div className="flex flex-col rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
        <span className="text-lg grayscale">{course.provider.icon}</span>
        {course.provider.name} · {course.level}
        <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300">{course.code}</span>
      </div>
      <div className="mt-3 text-xl font-black text-slate-300">{course.title}</div>
      <p className="mt-1 flex-1 text-sm text-slate-500">{course.tagline}</p>
      <span className="mt-5 rounded-2xl border border-white/10 py-3 text-center text-sm font-bold uppercase tracking-wide text-slate-500">Coming soon</span>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${active ? "border-sky-400 bg-sky-400/20 text-white" : "border-white/10 text-slate-300 hover:bg-white/10"}`}
    >
      {children}
    </button>
  );
}

function uniqueProviders(list: { provider: Provider }[]) {
  const seen = new Map<string, Provider>();
  for (const c of list) if (!seen.has(c.provider.id)) seen.set(c.provider.id, c.provider);
  return [...seen.values()];
}
