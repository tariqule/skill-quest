"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type CSSProperties } from "react";
import { Core3D, Tilt } from "@/components/fx";
import { Galaxy3D } from "@/components/three";
import { AppBar, APP_NAME } from "@/components/Hud";
import { LifecycleBadges } from "@/components/Lifecycle";
import { Bar } from "@/components/ui";
import { COURSES, PLANNED } from "@/courses";
import { overallReadiness } from "@/engine/game";
import { indexCourse } from "@/engine/indexes";
import { getCourseStore } from "@/engine/store";
import type { Course, PlannedCourse, Provider } from "@/engine/types";
import { isCodeTrack } from "@/engine/tracks";

const CERTS = COURSES.filter((c) => !isCodeTrack(c));
const TRACKS = COURSES.filter(isCodeTrack);
const PLANNED_CERTS = PLANNED.filter((c) => !isCodeTrack(c));

export default function Catalog() {
  const router = useRouter();
  const providers = uniqueProviders([...CERTS, ...PLANNED_CERTS]);
  const [filter, setFilter] = useState<string>("all");
  const show = <T extends { provider: Provider }>(list: T[]) => list.filter((c) => filter === "all" || c.provider.id === filter);

  return (
    <>
      <AppBar />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
        <section className="grid items-center gap-6 md:grid-cols-[1fr_1fr]">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">Learn by playing</div>
            <h1 className="mt-2 text-4xl sm:text-5xl font-black text-white">{APP_NAME}</h1>
            <p className="mt-3 max-w-xl text-lg text-slate-300">
              Visual, hands-on prep for cloud and AI certifications. Every concept is taught with a picture or a lab, then proven in games and a real-format
              exam simulator.
            </p>
          </div>
          <div className="min-w-0">
            <Galaxy3D
              items={show(CERTS).map((c) => ({ id: c.id, label: c.code, icon: c.provider.icon, color: c.provider.color }))}
              onSelect={(id) => router.push(`/c/${id}`)}
              coreColor="#38bdf8"
              shape="gem"
              className="h-56 w-full sm:h-80"
              fallback={
                <div className="hidden justify-center md:flex">
                  <Core3D size={100} domains={COURSES[0]?.domains} icon="🎓" />
                </div>
              }
            />
            <p className="text-center text-xs text-slate-500">Each gem is a certification. <span className="hidden pointer-fine:inline">Hover to name it, click to start.</span><span className="pointer-fine:hidden">Tap to name it, tap again to start.</span></p>
          </div>
        </section>

        <CodeQuestBanner />

        <h2 className="mt-12 text-2xl font-black text-white">🎓 Certification quests</h2>
        <p className="mt-1 text-sm text-slate-400">Built from each vendor&apos;s official exam guide, with a real-format exam simulator.</p>
        <div className="mt-4 flex flex-wrap gap-2">
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
          {show(CERTS).map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
          {show(PLANNED_CERTS).map((c) => (
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
        <LifecycleBadges course={course} />
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

/** Neon entry point to the Code Quests hub. */
function CodeQuestBanner() {
  return (
    <Link
      href="/code"
      className="group relative mt-10 block overflow-hidden rounded-3xl border-2 border-emerald-400/40 bg-[#03070d] p-6 transition hover:-translate-y-0.5 sm:p-8"
      style={{ boxShadow: "0 0 0 1px #34d39922, 0 24px 60px -30px #34d399" }}
    >
      <div className="code-grid absolute inset-0 opacity-60" />
      <pre className="pointer-events-none absolute -right-4 top-2 hidden font-mono text-xs leading-5 text-emerald-300/20 sm:block">
        {"const quest = await interview();\nif (quest.passed) hire(you);\n// bug hunt · predict · build\nfor (const level of levels) {\n  level.up();\n}"}
      </pre>
      <div className="relative">
        <div className="font-mono text-xs font-black uppercase tracking-[0.25em] text-emerald-300">&lt;/&gt; New · learn to code &amp; interview prep</div>
        <div className="glitch mt-2 font-mono text-3xl font-black text-white sm:text-4xl">Code Quests</div>
        <p className="mt-2 max-w-xl text-slate-300">
          Learn a skill from scratch or prep for the interview: {TRACKS.length} tracks from {TRACKS.slice(0, 4).map((t) => t.shortTitle).join(", ")} and more.
          Junior to staff level, with hands-on labs, bug hunts, predict-the-output puzzles, and timed challenges.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(TRACKS.length ? TRACKS : []).map((t) => (
            <span key={t.id} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-200">
              {t.provider.icon} {t.shortTitle}
            </span>
          ))}
        </div>
        <span className="mt-5 inline-block rounded-xl bg-emerald-400 px-5 py-2.5 font-mono text-sm font-black uppercase tracking-wider text-slate-950 transition group-hover:brightness-110">
          ▶ Enter Code Quests
        </span>
      </div>
    </Link>
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
