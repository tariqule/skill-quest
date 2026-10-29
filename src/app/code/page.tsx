"use client";

import Link from "next/link";
import { type CSSProperties } from "react";
import { CodeRain, TerminalWindow, Typewriter } from "@/components/code/ui";
import { COURSES } from "@/courses";
import { overallReadiness, pct } from "@/engine/game";
import { indexCourse } from "@/engine/indexes";
import { LEVEL_BY_ID, LEVELS } from "@/engine/levels";
import { getCourseStore, levelInfo } from "@/engine/store";
import type { Course } from "@/engine/types";

/** The Code Quests hub: every interview-prep track, in a terminal/arcade skin. */
export default function CodeHub() {
  const tracks = COURSES.filter((c) => c.kind === "interview");
  const totalQuestions = tracks.reduce((n, c) => n + c.questions.length, 0);

  return (
    <div className="code-theme flex min-h-full flex-1 flex-col">
      <CodeRain />
      <header className="sticky top-0 z-20 border-b border-emerald-400/20 bg-[#03070d]/90 font-mono backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5 text-sm">
          <span className="font-black text-emerald-300">&lt;/&gt;</span>
          <span className="font-bold text-white">code-quest</span>
          <Link href="/" className="ml-auto text-slate-400 hover:text-white">
            🎓 certifications →
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
        <TerminalWindow title="~/code-quest — zsh">
          <h1 className="glitch text-4xl font-black text-white sm:text-5xl">Code Quests</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Interview prep you play. Learn each concept with code you can poke at, hunt bugs line by line, predict output, then face a timed mock
            interview at your level.
          </p>
          <div className="mt-4">
            <Typewriter
              lines={[
                `$ code-quest --list`,
                `${tracks.length} tracks · ${totalQuestions} questions · 4 skill levels`,
                `$ code-quest --levels`,
                LEVELS.map((l) => `${l.icon} ${l.name}`).join("  "),
              ]}
            />
          </div>
        </TerminalWindow>

        {tracks.length === 0 ? (
          <p className="mt-8 font-mono text-slate-400">No tracks installed yet.</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((c) => (
              <Cartridge key={c.id} course={c} />
            ))}
          </div>
        )}

        <section className="mt-10 grid gap-3 sm:grid-cols-4">
          {[
            { icon: "🐞", t: "Bug hunt", d: "Tap the line that breaks." },
            { icon: "🔮", t: "Predict output", d: "Run the code in your head." },
            { icon: "🧱", t: "Build it", d: "Order the lines or steps." },
            { icon: "🎤", t: "Mock interview", d: "Timed, at your level." },
          ].map((f) => (
            <div key={f.t} className="rounded-xl border border-white/10 bg-[#07111c]/90 p-4">
              <div className="text-2xl">{f.icon}</div>
              <div className="mt-1 font-mono text-sm font-black uppercase tracking-wider text-white">{f.t}</div>
              <div className="text-xs text-slate-400">{f.d}</div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

function Cartridge({ course }: { course: Course }) {
  const p = getCourseStore(course).useProgress();
  const lvl = levelInfo(p.xp, course.levelTitles);
  const readiness = Math.round(overallReadiness(course, p));
  const lessons = indexCourse(course).allLessons.length;
  const skill = LEVEL_BY_ID[p.level];
  const color = course.provider.color;

  return (
    <Link
      href={`/c/${course.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-[#07111c]/95 p-5 transition hover:-translate-y-1"
      style={{ borderColor: `${color}66`, boxShadow: `0 0 0 1px ${color}22, 0 18px 40px -26px ${color}` } as CSSProperties}
    >
      <div className="absolute -right-6 -top-6 text-8xl opacity-10 transition group-hover:scale-110 group-hover:opacity-20">{course.provider.icon}</div>
      <div className="flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider" style={{ color }}>
        <span className="text-2xl">{course.provider.icon}</span>
        {course.code}
        {p.xp > 0 && (
          <span className="ml-auto rounded px-1.5 py-0.5 text-[10px]" style={{ background: `${skill.color}22`, color: skill.color }}>
            {skill.icon} {skill.name}
          </span>
        )}
      </div>
      <div className="mt-3 font-mono text-xl font-black text-white">{course.shortTitle}</div>
      <p className="mt-1 flex-1 text-sm text-slate-400">{course.tagline}</p>
      <div className="mt-4 flex flex-wrap gap-3 font-mono text-[11px] text-slate-400">
        <span>{course.domains.length} stages</span>
        <span>{lessons} levels</span>
        <span>{course.questions.length} questions</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full" style={{ width: pct(readiness / 100), background: color }} />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[11px] text-slate-500">
        <span>lv {lvl.level}</span>
        <span>{readiness}% ready</span>
      </div>
      <span
        className="btn-3d mt-4 rounded-xl py-2.5 text-center font-mono text-sm font-black uppercase tracking-wider text-slate-950"
        style={{ background: color, "--edge": "#00000088" } as CSSProperties}
      >
        ▶ {p.xp > 0 ? "Continue" : "Play"}
      </span>
    </Link>
  );
}
