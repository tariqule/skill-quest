import type { Progress } from "../store";
import type { Course, Question, Topic } from "../types";
import { missingPrereqs, topicsDone, unlockedPrompts, unlockedQuestions, unlocksFor } from "./gating";
import { practiceWeight } from "./scoring";
import { weightedSample, type Random } from "./selection";

/** Every question adaptive practice can draw from: the course's tagged questions plus practice-only ones. */
export function practicePool(course: Course): Question[] {
  return [...course.questions, ...(course.practice ?? [])].filter((q) => q.concepts?.length);
}

export interface NextTopic {
  topic: Topic;
  /** Questions and prompts finishing it would unlock. */
  unlocks: { questions: number; prompts: number };
}

export interface LockedTopic {
  topic: Topic;
  /** Ready topics to finish first. */
  needs: Topic[];
}

export interface PracticeSummary {
  /** Every topic on the syllabus, planned ones included. */
  total: number;
  done: Topic[];
  /** Done topics with at least one unlocked practice question. */
  covered: Topic[];
  available: number;
  prompts: number;
  /** The first unfinished ready topic whose prerequisites are done. Null when none is left. */
  next: NextTopic | null;
  /** Ready topics still waiting on prerequisites. */
  locked: LockedTopic[];
  /** Topics with no lesson yet. */
  planned: number;
  /** Every ready topic is done: full mixed practice. */
  full: boolean;
}

/** One pass over the syllabus for the practice page. */
export function practiceSummary(course: Course, p: Pick<Progress, "lessonsDone">): PracticeSummary {
  const topics = course.topics ?? [];
  const byId = new Map(topics.map((t) => [t.id, t]));
  const done = new Set(topicsDone(topics, p));
  const pool = practicePool(course);
  const prompts = course.designPrompts ?? [];
  const available = unlockedQuestions(pool, done);
  const ready = topics.filter((t) => t.status === "ready");
  const open = ready.filter((t) => !done.has(t.id));
  const nextTopic = open.find((t) => missingPrereqs(t, byId, done).length === 0);
  return {
    total: topics.length,
    done: topics.filter((t) => done.has(t.id)),
    covered: topics.filter((t) => done.has(t.id) && available.some((q) => q.concepts?.includes(t.id))),
    available: available.length,
    prompts: unlockedPrompts(prompts, done).length,
    next: nextTopic ? { topic: nextTopic, unlocks: unlocksFor(pool, prompts, done, nextTopic.id) } : null,
    locked: open.flatMap((t) => {
      const needs = missingPrereqs(t, byId, done);
      return needs.length ? [{ topic: t, needs }] : [];
    }),
    planned: topics.length - ready.length,
    full: ready.length > 0 && open.length === 0,
  };
}

/**
 * A practice deck of up to `size` unlocked questions, weighted toward recent topics and past
 * misses. Never includes a question with an unfinished concept.
 */
export function buildPracticeDeck(course: Course, p: Pick<Progress, "lessonsDone" | "questions">, size: number, rand: Random = Math.random): Question[] {
  const order = topicsDone(course.topics ?? [], p);
  const pool = unlockedQuestions(practicePool(course), new Set(order));
  return weightedSample(pool, (q) => practiceWeight(q, p, order), size, rand);
}
