"use client";

import Link from "next/link";
import { CheckCircle2, Lock, Map as MapIcon, Play, Sprout } from "lucide-react";
import { BlockIcon } from "@/components/learn/block-icons";
import { LayoutMotion } from "@/components/motion/LayoutMotion";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/engine/hydrated";
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
  const hydrated = useHydrated();
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 pb-28 sm:py-10">
      <BeginnerHeader />
      <p className="mt-4 max-w-prose text-base leading-relaxed text-muted-foreground sm:text-lg">
        Start with Module 1, one topic at a time. Each lesson takes about 5 minutes: you read a little, then answer a few easy questions.
        {hydrated && ` ${first.done} of ${first.topics.length} Module 1 topics done, ${map.done} of ${map.total} in the course.`}
      </p>
      {map.current?.lesson && (
        <Button size="xl" className="mt-5 w-full sm:w-auto" render={<Link href={href(`/lesson/${map.current.lesson}`)} />}>
          <Play aria-hidden="true" />
          {map.done === 0 || !hydrated ? "Start lesson 1" : `Continue: ${map.current.topic.title}`}
        </Button>
      )}
      <div className="mt-4">
        <PracticeTile />
      </div>
      <LevelUpBanner />
      <section aria-labelledby="map-heading" className="mt-8">
        <h2 id="map-heading" className="flex items-center gap-2 font-heading text-h3 font-semibold text-foreground">
          <MapIcon aria-hidden="true" className="size-5 text-primary" />
          {map.modules.length} modules, {map.total} topics
        </h2>
        <div className="mt-4">
          <LayoutMotion>
            <ModuleMap map={map} color={course.provider.color} startHere />
          </LayoutMotion>
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
      <span className="flex size-12 shrink-0 items-center justify-center rounded-card bg-muted" style={{ color: course.provider.color }}>
        <BlockIcon icon={course.provider.icon} className="size-6" />
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-sm font-medium text-primary">
          <Sprout aria-hidden="true" className="size-4" />
          Beginner path
        </p>
        <h1 className="font-heading text-h2 font-semibold text-foreground">{course.title}</h1>
      </div>
    </div>
  );
}

function ChangeLevel() {
  return (
    <details className="mt-10 rounded-card border border-border bg-card p-4">
      <summary className="flex min-h-11 cursor-pointer items-center text-base font-semibold text-foreground">Not a beginner? Change your level</summary>
      <CourseLevel title="How much do you know?" />
    </details>
  );
}

function BeginnerLessonPath() {
  const { course, href, domain: domainById } = useCourse();
  const p = useProgress();
  const { worlds, current } = buildPath(course, p);
  const hydrated = useHydrated();
  const total = worlds.reduce((n, w) => n + w.nodes.filter((x) => x.type === "lesson" && !x.optional).length, 0);
  const done = worlds.reduce((n, w) => n + w.nodes.filter((x) => x.type === "lesson" && !x.optional && x.state === "done").length, 0);
  // Lesson numbers run across sections: 1, 2, 3 … (section checks aren't numbered).
  const numbers = new Map<string, number>();
  worlds.forEach((w) => w.nodes.filter((n) => n.type === "lesson" && !n.optional).forEach((n) => numbers.set(n.key, numbers.size + 1)));

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6 pb-28 sm:py-10">
      <BeginnerHeader />
      <p className="mt-4 max-w-prose text-base leading-relaxed text-muted-foreground sm:text-lg">
        Go through these in order, one at a time. Each lesson takes about 5 minutes: you read a little, then answer a couple of easy questions.
        {hydrated && ` ${done} of ${total} done.`}
      </p>

      {current && (
        <Button size="xl" className="mt-5 w-full sm:w-auto" render={<Link href={href(current.to)} />}>
          <Play aria-hidden="true" />
          {done === 0 || !hydrated ? "Start lesson 1" : current.type === "quest" ? "Take the short check" : "Continue"}
        </Button>
      )}

      <LevelUpBanner />

      <ol className="mt-8 grid gap-2">
        {worlds.map((w) => {
          const d = domainById[w.domain];
          const nodes = w.nodes.filter((n) => !n.optional);
          if (nodes.length === 0) return null;
          return (
            <li key={w.domain} className="contents">
              <h2 className="mt-4 flex items-center gap-2 text-base font-semibold text-foreground">
                <BlockIcon icon={d.emoji} className="size-4 text-muted-foreground" />
                {d.name}
              </h2>
              {nodes.map((n) => (
                <Row key={n.key} node={n} label={String(numbers.get(n.key) ?? "")} />
              ))}
            </li>
          );
        })}
      </ol>

      <ChangeLevel />
    </main>
  );
}

function Row({ node, label }: { node: PathNode; label: string }) {
  const { href } = useCourse();
  const isQuest = node.type === "quest";
  const done = node.state === "done";
  const here = node.state === "current";
  const locked = node.state === "locked";
  const body = (
    <span
      className={`flex min-h-11 items-center gap-3 rounded-card border px-4 py-3 text-left transition-colors ${
        here ? "border-primary bg-primary/10" : done ? "border-success/40 bg-success/5" : "border-border bg-card"
      } ${locked ? "" : "hover:border-primary/60"}`}
    >
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${done ? "bg-success/20 text-success-foreground" : "bg-muted text-foreground"}`}
        aria-hidden
      >
        {done ? <CheckCircle2 className="size-4" /> : locked ? <Lock className="size-4" /> : label}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-medium text-foreground">{isQuest ? "Short check" : node.title}</span>
        {isQuest && <span className="block text-sm text-muted-foreground">A few questions on this part. No rush.</span>}
        {locked && <span className="block text-sm text-muted-foreground">Finish the one before first.</span>}
      </span>
      {done && <span className="shrink-0 text-sm text-success-foreground">Done</span>}
      {here && <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-sm font-semibold text-primary-foreground">Next</span>}
    </span>
  );
  return locked ? (
    <span aria-label={`${node.title} (finish the one before first)`}>{body}</span>
  ) : (
    <Link href={href(node.to)} aria-current={here ? "step" : undefined} className="block rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
      {body}
    </Link>
  );
}
