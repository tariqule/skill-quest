import "server-only";
import { levelOptions, questionsForLevel } from "@/engine/levels";
import { scenariosFor } from "@/scenarios";
import { createHash } from "node:crypto";
import { createElement, isValidElement, type ElementType } from "react";
import { COURSES, PLANNED } from "@/courses";
import { ON_SOLVED_PLACEHOLDER, type CatalogEntry, type CourseSummary, type WireChallenge, type WireCourse } from "@/api/wire";
import { hasCodeGames } from "@/engine/code-games";
import { indexCourse, type IndexedLesson } from "@/engine/indexes";
import type { Course, Question } from "@/engine/types";

/**
 * The only module that loads course content. Route handlers and Server Components read courses
 * through here; client code gets data from the /api/v1 endpoints or from Server Component props.
 * `server-only` makes a client import a build error, and src/server/boundary.test.ts checks the
 * client module graph too.
 */
const BY_ID = new Map(COURSES.map((c) => [c.id, c]));

export function courseIds(): string[] {
  return COURSES.map((c) => c.id);
}

export function findCourse(id: string): Course | undefined {
  return BY_ID.get(id);
}

export function summarize(c: Course): CourseSummary {
  return {
    id: c.id,
    kind: c.kind ?? "certification",
    provider: c.provider,
    code: c.code,
    title: c.title,
    shortTitle: c.shortTitle,
    tagline: c.tagline,
    level: c.level,
    category: c.category,
    tags: c.tags ?? [],
    lifecycle: c.lifecycle,
    storageKey: c.storageKey,
    exam: { questions: c.exam.questions, minutes: c.exam.minutes },
    counts: {
      domains: c.domains.length,
      lessons: indexCourse(c).allLessons.length,
      questions: c.questions.length,
      cards: c.cards.length,
      challenges: c.challenges.length,
      coding: c.coding?.length ?? 0,
    },
    hasCodeGames: hasCodeGames(c),
    scenarioKinds: [...new Set(scenariosFor(c.id).map((x) => x.type))],
    lessonMigration: c.lessonMigration,
    levelCounts: Object.fromEntries(levelOptions(c).map((l) => [l.id, questionsForLevel(c, l.id).length])),
  };
}

let summaries: CourseSummary[] | null = null;
export function courseSummaries(): CourseSummary[] {
  return (summaries ??= COURSES.map(summarize));
}

export function catalog(): CatalogEntry[] {
  return [...courseSummaries().map((course) => ({ status: "live" as const, course })), ...PLANNED.map((course) => ({ status: "planned" as const, course }))];
}

export function findLesson(c: Course, id: string): IndexedLesson | undefined {
  return indexCourse(c).lesson[id];
}

export function findQuestion(c: Course, id: string): Question | undefined {
  return indexCourse(c).question[id] ?? c.practice?.find((q) => q.id === id);
}

// ───────────── Wire encoding ─────────────

const wires = new Map<string, WireCourse>();

/**
 * The course for a Server Component prop (RSC): visuals and labs stay as client-component
 * elements. Memoised: course content is static for the life of the process.
 */
export function wireCourse(c: Course): WireCourse {
  let w = wires.get(c.id);
  if (!w) {
    w = {
      ...c,
      scenarios: scenariosFor(c.id),
      topics: c.topics?.map((t) => ({ ...t, match: { source: t.match.source, flags: t.match.flags } })),
      challenges: c.challenges.map(({ render, ...rest }): WireChallenge => {
        const lab = render(ON_SOLVED_PLACEHOLDER);
        if (!isValidElement<{ onSolved?: unknown }>(lab) || lab.props.onSolved !== ON_SOLVED_PLACEHOLDER) {
          throw new Error(`Challenge ${rest.id}: render must return one element that takes onSolved`);
        }
        // Functions can't cross the RSC boundary: send the lab without onSolved; the client adds it back.
        const { onSolved: _placeholder, ...props } = lab.props as Record<string, unknown>;
        void _placeholder;
        return { ...rest, lab: createElement(lab.type as ElementType, { ...props, key: lab.key }) as WireChallenge["lab"] };
      }),
    };
    wires.set(c.id, w);
  }
  return w;
}

/** JSON-safe copy: React elements (visuals, labs) become null. */
export function toJson<T>(value: T): unknown {
  return JSON.parse(JSON.stringify(value, (_k, v) => (isValidElement(v) ? null : v instanceof RegExp ? { source: v.source, flags: v.flags } : v)));
}

const etags = new Map<string, string>();
/** Strong ETag for a course's content: changes only when the course data does. */
export function courseEtag(c: Course): string {
  let e = etags.get(c.id);
  if (!e) {
    e = `"${createHash("sha256").update(JSON.stringify(toJson(wireCourse(c)))).digest("base64url").slice(0, 27)}"`;
    etags.set(c.id, e);
  }
  return e;
}

let catalogTag: string | null = null;
export function catalogEtag(): string {
  return (catalogTag ??= `"${createHash("sha256").update(JSON.stringify(catalog())).digest("base64url").slice(0, 27)}"`);
}

let version: string | null = null;
/**
 * One short hash over every course's content. The app appends it to API URLs (`?v=`), so a
 * response for the current version can be cached as immutable and a deploy changes every URL.
 */
export function contentVersion(): string {
  return (version ??= createHash("sha256")
    .update(catalogEtag() + COURSES.map(courseEtag).join(""))
    .digest("base64url")
    .slice(0, 12));
}

/** An ETag for something derived from a course plus request inputs (e.g. practice for a set of done lessons). */
export function derivedEtag(c: Course, ...parts: string[]): string {
  return `"${createHash("sha256").update([courseEtag(c), ...parts].join("|")).digest("base64url").slice(0, 27)}"`;
}
