import type { Progress } from "../store";
import type { DesignPrompt, Question, Topic } from "../types";

/** Progress fields gating reads. */
export type LessonProgress = Pick<Progress, "lessonsDone">;

/** Lessons that count as finishing `topic`: its own lesson plus any stand-ins. */
export const lessonsFor = (topic: Topic): string[] => [topic.id, ...(topic.standIns ?? [])];

/** The lesson to open for `topic`: its own if written, else its first stand-in. Undefined for planned topics. */
export function entryLesson(topic: Topic, lessonIds: ReadonlySet<string>): string | undefined {
  return lessonsFor(topic).find((id) => lessonIds.has(id));
}

/**
 * Finished topic ids, in the order the learner finished them (oldest first). A topic finishes
 * when its first counting lesson does.
 */
export function topicsDone(topics: readonly Topic[], p: LessonProgress): string[] {
  const finishedAt = (t: Topic) => Math.min(...lessonsFor(t).map((id) => p.lessonsDone.indexOf(id)).filter((i) => i >= 0));
  return topics
    .map((t) => ({ id: t.id, at: finishedAt(t) }))
    .filter((x) => Number.isFinite(x.at))
    .sort((a, b) => a.at - b.at)
    .map((x) => x.id);
}

/** True when something tagged with `concepts` may be shown. Untagged content never unlocks. */
export function isUnlocked(concepts: readonly string[] | undefined, done: ReadonlySet<string>): boolean {
  return !!concepts?.length && concepts.every((c) => done.has(c));
}

export function unlockedQuestions(pool: readonly Question[], done: ReadonlySet<string>): Question[] {
  return pool.filter((q) => isUnlocked(q.concepts, done));
}

export function unlockedPrompts(prompts: readonly DesignPrompt[], done: ReadonlySet<string>): DesignPrompt[] {
  return prompts.filter((d) => isUnlocked(d.concepts, done));
}

/** What finishing `topic` would newly unlock, given what's done now. */
export function unlocksFor(pool: readonly Question[], prompts: readonly DesignPrompt[], done: ReadonlySet<string>, topic: string) {
  const after = new Set([...done, topic]);
  const fresh = (concepts: readonly string[]) => !isUnlocked(concepts, done) && isUnlocked(concepts, after);
  return {
    questions: pool.filter((q) => fresh(q.concepts ?? [])).length,
    prompts: prompts.filter((d) => fresh(d.concepts)).length,
  };
}

/** Ready prerequisites of `topic` that aren't done yet. Planned prerequisites can't be finished, so they never block. */
export function missingPrereqs(topic: Topic, byId: ReadonlyMap<string, Topic>, done: ReadonlySet<string>): Topic[] {
  return topic.prereqs.flatMap((id) => {
    const pre = byId.get(id);
    return pre && pre.status === "ready" && !done.has(id) ? [pre] : [];
  });
}
