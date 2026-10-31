"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { CourseLevel, LevelUpBanner } from "@/components/LevelControls";
import { useCourse, useProgress } from "@/engine/course-context";
import { buildPath, type PathNode } from "@/engine/path";
import type { CourseMap } from "@/engine/practice";
import { ModuleMap } from "../map/ModuleMap";
import { useCourseMap } from "../map/useCourseMap";
import { PracticeTile } from "../practice/PracticeTile";

/**
 * What a beginner sees instead of the full map: one numbered path, one big Continue button.
 * No worlds, XP, hearts, arcade or badges. Those come back when they level up.
 */
export function BeginnerMap() {
  const map = useCourseMap();
  return map ? <BeginnerTopicMap map={map} /> : <BeginnerLessonPath />;
}

/** A course with a topic syllabus: Module 1 is the beginner path, and the later modules are shown so the whole course is visible. */
function BeginnerTopicMap({ map }: { map: CourseMap }) {
  const { course, href } = useCourse();
  const first = map.modules[0];
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 pb-28 sm:py-10">
      <BeginnerHeader />
      <p className="mt-4 text-lg leading-relaxed text-slate-300">
        Start with Module 1, one topic at a time. Each lesson takes about 5 minutes: you read a little, then answer a few easy questions. {first.done} of{" "}
        {first.topics.length} Module 1 topics done, {map.done} of {map.total} in the course.
      </p>
      {map.current?.lesson && (
        <Link
          href={href(`/lesson/${map.current.lesson}`)}
          className="btn-3d mt-5 flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-4 text-xl font-black text-slate-950"
          style={{ "--edge": "#047857" } as CSSProperties}
        >
          ▶ {map.done === 0 ? "Start lesson 1" : `Continue: ${map.current.topic.title}`} <span aria-hidden>→</span>
        </Link>
      )}
      <div className="mt-4">
        <PracticeTile />
      </div>
      <LevelUpBanner />
      <section aria-labelledby="map-heading" className="mt-8">
        <h2 id="map-heading" className="text-xl font-black text-white">
          🗺️ {map.modules.length} modules, {map.total} topics
        </h2>
        <div className="mt-4">
          <ModuleMap map={map} color={course.provider.color} startHere />
        </div>
      </section>
      <ChangeLevel />
    </main>
  );
}

function BeginnerHeader() {
  const { course } = useCourse();
  return (
    <div className="flex items-center gap-3">
      <span className="text-4xl">{course.provider.icon}</span>
      <div className="min-w-0">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-rose-300">🐣 Beginner path</div>
        <h1 className="text-2xl font-black text-white sm:text-3xl">{course.title}</h1>
      </div>
    </div>
  );
}

function ChangeLevel() {
  return (
    <details className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <summary className="cursor-pointer text-base font-bold text-slate-200">Not a beginner? Change your level</summary>
      <CourseLevel title="How much do you know?" />
    </details>
  );
}

function BeginnerLessonPath() {
  const { course, href, domain: domainById } = useCourse();
  const p = useProgress();
  const { worlds, current } = buildPath(course, p);
  const total = worlds.reduce((n, w) => n + w.nodes.filter((x) => x.type === "lesson" && !x.optional).length, 0);
  const done = worlds.reduce((n, w) => n + w.nodes.filter((x) => x.type === "lesson" && !x.optional && x.state === "done").length, 0);
  // Lesson numbers run across sections: 1, 2, 3 … (section checks aren't numbered).
  const numbers = new Map<string, number>();
  worlds.forEach((w) => w.nodes.filter((n) => n.type === "lesson" && !n.optional).forEach((n) => numbers.set(n.key, numbers.size + 1)));

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6 pb-28 sm:py-10">
      <BeginnerHeader />
      <p className="mt-4 text-lg leading-relaxed text-slate-300">
        Go through these in order, one at a time. Each lesson takes about 5 minutes: you read a little, then answer a couple of easy questions. {done} of {total} done.
      </p>

      {current && (
        <Link
          href={href(current.to)}
          className="btn-3d mt-5 flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-4 text-xl font-black text-slate-950"
          style={{ "--edge": "#047857" } as CSSProperties}
        >
          ▶ {done === 0 ? "Start lesson 1" : current.type === "quest" ? "Take the short check" : "Continue"} <span aria-hidden>→</span>
        </Link>
      )}

      <LevelUpBanner />

      <ol className="mt-8 grid gap-2">
        {worlds.map((w) => {
          const d = domainById[w.domain];
          const nodes = w.nodes.filter((n) => !n.optional);
          if (nodes.length === 0) return null;
          return (
            <li key={w.domain} className="contents">
              <div className="mt-4 text-sm font-black uppercase tracking-wider" style={{ color: d.color }}>
                {d.emoji} {d.name}
              </div>
              {nodes.map((n) => (
                <Row key={n.key} node={n} label={String(numbers.get(n.key) ?? "✓")} color={d.color} />
              ))}
            </li>
          );
        })}
      </ol>

      <ChangeLevel />
    </main>
  );
}

function Row({ node, label, color }: { node: PathNode; label: string; color: string }) {
  const { href } = useCourse();
  const isQuest = node.type === "quest";
  const done = node.state === "done";
  const here = node.state === "current";
  const locked = node.state === "locked";
  const body = (
    <span
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
        here ? "border-emerald-400 bg-emerald-400/10" : done ? "border-white/10 bg-white/[0.04]" : "border-white/10 bg-slate-900/60"
      } ${locked ? "opacity-50" : "hover:border-white/30"}`}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black"
        style={{ background: done ? color : "rgb(255 255 255 / 0.1)", color: done ? "#020617" : "#e2e8f0" }}
        aria-hidden
      >
        {done ? "✓" : locked ? "🔒" : label}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-bold text-white">{isQuest ? "Short check" : node.title}</span>
        {isQuest && <span className="block text-sm text-slate-400">A few questions on this part. No rush.</span>}
      </span>
      {here && <span className="shrink-0 rounded-full bg-emerald-400 px-2.5 py-1 text-xs font-black text-slate-950">Next</span>}
    </span>
  );
  return locked ? <span aria-label={`${node.title} (finish the one before first)`}>{body}</span> : <Link href={href(node.to)}>{body}</Link>;
}
