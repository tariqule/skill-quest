import { cloneElement, isValidElement, type ReactElement } from "react";
import type { LevelChoice } from "@/engine/levels";
import type { ScenarioGameId } from "@/engine/scenarios";
import type { Challenge, Course, PlannedCourse, Topic } from "@/engine/types";

/**
 * The wire format for a course. A `Course` is almost plain data; two fields aren't serialisable:
 * a topic's `match` (a RegExp) and a challenge's `render` (a function). On the wire the RegExp is
 * its source and flags, and a lab is the element `render` returned for a placeholder callback, so
 * the client can put the real `onSolved` back with cloneElement. Lesson visuals and labs stay
 * React elements: they are client components, so React Server Components send references to them
 * and the browser loads only the visuals of the page it renders.
 *
 * This module is shared and imports no course content.
 */
export interface WireTopic extends Omit<Topic, "match"> {
  match: { source: string; flags: string };
}

export interface WireChallenge extends Omit<Challenge, "render"> {
  /** What `render` returned; its `onSolved` prop is replaced on the client. Absent in JSON. */
  lab?: ReactElement<{ onSolved?: () => void }>;
}

export interface WireCourse extends Omit<Course, "topics" | "challenges"> {
  topics?: WireTopic[];
  challenges: WireChallenge[];
}

/** A catalog card: enough for the home page, Code Quests and lifecycle links, no questions. */
export interface CourseSummary {
  id: string;
  kind: NonNullable<Course["kind"]>;
  provider: Course["provider"];
  code: string;
  title: string;
  shortTitle: string;
  tagline: string;
  level: Course["level"];
  category?: Course["category"];
  tags: string[];
  lifecycle?: Course["lifecycle"];
  storageKey: string;
  /** Exam length, for the catalog line. */
  exam: { questions: number; minutes: number };
  counts: { domains: number; lessons: number; questions: number; cards: number; challenges: number; coding: number };
  /** Daily Review needs only these to migrate saved progress. */
  hasCodeGames: boolean;
  /** Scenario game types this course has (empty: no Scenarios mode). */
  scenarioKinds: ScenarioGameId[];
  /** Renamed lesson ids, so saved progress reads the same with or without content loaded. */
  lessonMigration?: Course["lessonMigration"];
  /** Questions at each skill level the course offers (the level picker's counts). */
  levelCounts: Partial<Record<LevelChoice, number>>;
}

export type CatalogEntry = { status: "live"; course: CourseSummary } | { status: "planned"; course: PlannedCourse };

/** The prop the server hands to the onSolved placeholder; never called. */
export const ON_SOLVED_PLACEHOLDER = (): void => {
  throw new Error("Lab placeholder callback called: the client must replace onSolved.");
};

/** `rich`: decoded from the RSC payload, with lab and visual elements. JSON copies have none. */
const decoded = new Map<string, { course: Course; rich: boolean }>();

const listeners = new Set<(course: Course) => void>();
/** Hear about every course decoded on this page (the client registry keeps them). */
export function onCourseDecoded(listener: (course: Course) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** A course already decoded in this session, if any. */
export function decodedCourse(id: string): Course | undefined {
  return decoded.get(id)?.course;
}

/**
 * Turn a wire course back into the engine's `Course`. Memoised per course id so the engine's
 * per-course caches (indexes, stores) always see one stable object.
 */
export function decodeCourse(wire: WireCourse): Course {
  // Content is static per deploy, so a decoded course is kept for the session; a JSON copy (no
  // labs or visuals) is upgraded once the same course arrives from a Server Component.
  const rich = wire.challenges.some((c) => c.lab != null) || wire.challenges.length === 0;
  const hit = decoded.get(wire.id);
  if (hit && (hit.rich || !rich)) return hit.course;
  const course: Course = {
    ...wire,
    topics: wire.topics?.map((t) => ({ ...t, match: new RegExp(t.match.source, t.match.flags) })),
    challenges: wire.challenges.map(({ lab, ...c }) => ({
      ...c,
      render: (onSolved: () => void) => (lab && isValidElement(lab) ? cloneElement(lab, { onSolved }) : null),
    })),
  };
  decoded.set(wire.id, { course, rich });
  listeners.forEach((l) => l(course));
  return course;
}

/** Tests only: forget every decoded course, as on a fresh page load. */
export function forgetDecodedCourses(): void {
  decoded.clear();
}
