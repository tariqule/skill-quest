import type { Progress } from "../store";
import type { Course, DesignPrompt, Question, Topic } from "../types";
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
  /** Unlocked design prompts. */
  prompts: DesignPrompt[];
  /**
   * The unfinished ready topic, prerequisites done, to study next: one a finished topic still
   * builds on comes first (so a lesson taken early points back at what it needs), then syllabus
   * order. Null when none is left.
   */
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
  const candidates = open.filter((t) => missingPrereqs(t, byId, done).length === 0);
  const owed = owedPrereqs(topics.filter((t) => done.has(t.id)), byId, done);
  const nextTopic = candidates.find((t) => owed.has(t.id)) ?? candidates[0];
  return {
    total: topics.length,
    done: topics.filter((t) => done.has(t.id)),
    covered: topics.filter((t) => done.has(t.id) && available.some((q) => q.concepts?.includes(t.id))),
    available: available.length,
    prompts: unlockedPrompts(prompts, done),
    next: nextTopic ? { topic: nextTopic, unlocks: unlocksFor(pool, prompts, done, nextTopic.id) } : null,
    locked: open.flatMap((t) => {
      const needs = missingPrereqs(t, byId, done);
      return needs.length ? [{ topic: t, needs }] : [];
    }),
    planned: topics.length - ready.length,
    full: ready.length > 0 && open.length === 0,
  };
}

/** Every unfinished prerequisite, direct or deeper, that the `from` topics still rest on. */
function owedPrereqs(from: readonly Topic[], byId: ReadonlyMap<string, Topic>, done: ReadonlySet<string>): Set<string> {
  const owed = new Set<string>();
  const stack = [...from];
  for (let t = stack.pop(); t; t = stack.pop()) {
    for (const pre of missingPrereqs(t, byId, done)) {
      if (owed.has(pre.id)) continue;
      owed.add(pre.id);
      stack.push(pre);
    }
  }
  return owed;
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
