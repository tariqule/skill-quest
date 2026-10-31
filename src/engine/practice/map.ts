import type { Topic } from "../types";
import { entryLesson, lessonsFor, missingPrereqs, topicsDone, type LessonProgress } from "./gating";

/** Where a topic stands on the course map. Exactly one topic, the next to study, is "current". */
export type TopicState = "done" | "current" | "open" | "locked" | "planned";

export interface MapTopic {
  topic: Topic;
  /** "module-topic", e.g. "1-3". */
  label: string;
  /** Lesson that teaches it; undefined while planned. */
  lesson?: string;
  state: TopicState;
  /** Ready prerequisites still to finish (only when locked). */
  needs: Topic[];
}

export interface MapModule {
  number: number;
  title: string;
  topics: MapTopic[];
  done: number;
}

export interface CourseMap {
  modules: MapModule[];
  current: MapTopic | null;
  done: number;
  total: number;
}

/** The syllabus grouped into numbered modules, in syllabus order, with each topic's state. */
export function courseMap(topics: readonly Topic[], lessonIds: ReadonlySet<string>, p: LessonProgress): CourseMap {
  const byId = new Map(topics.map((t) => [t.id, t]));
  const done = new Set(topicsDone(topics, p));
  const titles = [...new Set(topics.map((t) => t.module))];
  let current: MapTopic | null = null;
  const modules = titles.map((title, mi) => {
    const mine = topics
      .filter((t) => t.module === title)
      .map((topic, ti): MapTopic => {
        const lesson = entryLesson(topic, lessonIds);
        const needs = missingPrereqs(topic, byId, done);
        const base: TopicState = !lesson ? "planned" : done.has(topic.id) ? "done" : needs.length ? "locked" : "open";
        const state = base === "open" && !current ? "current" : base;
        const node: MapTopic = { topic, label: `${mi + 1}-${ti + 1}`, lesson, state, needs: state === "locked" ? needs : [] };
        if (state === "current") current = node;
        return node;
      });
    return { number: mi + 1, title, topics: mine, done: mine.filter((t) => t.state === "done").length };
  });
  return { modules, current, done: done.size, total: topics.length };
}

/** The "Start here" lessons: the written lessons of the first module, in order. */
export function startHereLessons(topics: readonly Topic[], lessonIds: ReadonlySet<string>): string[] {
  const first = topics[0]?.module;
  return topics.filter((t) => t.module === first && lessonIds.has(t.id)).map((t) => t.id);
}

/** The map node a lesson belongs to: the topic it teaches, or the topic it stands in for. */
export function topicForLesson(map: CourseMap, lessonId: string): { module: MapModule; node: MapTopic; index: number } | null {
  for (const m of map.modules) {
    const index = m.topics.findIndex((n) => lessonsFor(n.topic).includes(lessonId));
    if (index >= 0) return { module: m, node: m.topics[index], index };
  }
  return null;
}

/**
 * The soft gate for a lesson opened out of order: the unfinished prerequisites, as map nodes so
 * they can link to their lessons. Empty when the lesson's topic isn't locked. The gate only
 * advises; finishing the lesson still counts, the same as on the map and in practice.
 */
export function lessonGate(map: CourseMap, lessonId: string): MapTopic[] {
  const hit = topicForLesson(map, lessonId);
  if (hit?.node.state !== "locked") return [];
  const nodes = map.modules.flatMap((m) => m.topics);
  return hit.node.needs.flatMap((t) => nodes.filter((n) => n.topic.id === t.id));
}

/** "Module 2 · Lesson 1 of 4": numbered the same way as the map's "2-1" tiles. Null off the syllabus. */
export function moduleLessonLabel(map: CourseMap, lessonId: string): string | null {
  const hit = topicForLesson(map, lessonId);
  return hit ? `Module ${hit.module.number} · Lesson ${hit.index + 1} of ${hit.module.topics.length}` : null;
}

/**
 * Where "Continue" goes after a lesson in a topic course: the lesson of the map's current topic
 * (the next one to study), or null when none is open. Following the map, not the older
 * domain path, keeps the learner on the syllabus instead of sending them into a stand-in lesson.
 */
export function nextMapLesson(topics: readonly Topic[], lessonIds: ReadonlySet<string>, p: LessonProgress): string | null {
  return courseMap(topics, lessonIds, p).current?.lesson ?? null;
}
