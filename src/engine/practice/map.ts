import type { Topic } from "../types";
import { entryLesson, missingPrereqs, topicsDone, type LessonProgress } from "./gating";

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
