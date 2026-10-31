import type { Course, Lesson, Topic } from "../types";
import { lessonsFor } from "./gating";
import { practicePool } from "./practice";

const plain = (s: string) => s.replace(/[*`_]/g, "").toLowerCase();

/** What a learner has read for `topic`: its written lessons' titles, points and tips. */
function taughtText(topic: Topic, lessons: ReadonlyMap<string, Lesson>): string {
  return lessonsFor(topic)
    .flatMap((id) => {
      const l = lessons.get(id);
      return l ? [l.title, ...l.points, l.tip ?? ""] : [];
    })
    .map(plain)
    .join(" \n ");
}

/**
 * Matching terms a learner could meet before reading about them: each left-hand term of a
 * tagged matching question must appear in what its topics teach. A planned topic has no lesson
 * yet, so its syllabus pattern stands in for the text. Returns "question id: term" per gap.
 */
export function untaughtMatchTerms(course: Course): string[] {
  const byId = new Map((course.topics ?? []).map((t) => [t.id, t]));
  const lessons = new Map(Object.values(course.lessons).flat().map((l) => [l.id, l]));
  return practicePool(course).flatMap((q) => {
    if (q.type !== "match") return [];
    const topics = (q.concepts ?? []).flatMap((c) => byId.get(c) ?? []);
    const texts = topics.map((t) => taughtText(t, lessons));
    const taught = (term: string) =>
      texts.some((text) => text.includes(plain(term))) || topics.some((t) => t.status === "planned" && t.match.test(term));
    return q.pairs.filter(([term]) => !taught(term)).map(([term]) => `${q.id}: ${term}`);
  });
}
