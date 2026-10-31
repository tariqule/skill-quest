import type { Course, Domain, Lesson, Question } from "./types";

export interface IndexedLesson extends Lesson {
  domain: string;
  /** Position within its world, 0-based. */
  index: number;
}

/** Lookup tables built once per course. */
export interface CourseIndex {
  domain: Record<string, Domain>;
  question: Record<string, Question>;
  lesson: Record<string, IndexedLesson>;
  allLessons: IndexedLesson[];
  /** The lesson (concept) each question tests. */
  lessonForQuestion: Record<string, IndexedLesson>;
}

const indexes = new WeakMap<Course, CourseIndex>();

export function indexCourse(course: Course): CourseIndex {
  let idx = indexes.get(course);
  if (!idx) {
    const allLessons = course.domains.flatMap((d) => (course.lessons[d.id] ?? []).map((l, index) => ({ ...l, domain: d.id, index })));
    const byId = Object.fromEntries(allLessons.map((l) => [l.id, l]));
    idx = {
      domain: Object.fromEntries(course.domains.map((d) => [d.id, d])),
      question: Object.fromEntries(course.questions.map((q) => [q.id, q])),
      lesson: byId,
      allLessons,
      lessonForQuestion: Object.fromEntries(
        course.questions.flatMap((q) => {
          const l = revisitLesson(q, byId, course.topics);
          return l ? [[q.id, l]] : [];
        }),
      ),
    };
    indexes.set(course, idx);
  }
  return idx;
}

/**
 * The lesson "Revisit the concept" opens for a question. A tagged question points at the lesson
 * of its first (primary) tagged topic that has one (its own lesson, else its first stand-in), so retagged legacy items never send the
 * player back to the lesson they were written for. Untagged questions keep their own lesson.
 */
export function revisitLesson<L>(
  q: Question,
  byId: Record<string, L>,
  topics: readonly { id: string; standIns?: readonly string[] }[] = [],
): L | undefined {
  for (const c of q.concepts ?? []) {
    if (byId[c]) return byId[c];
    const standIn = topics.find((t) => t.id === c)?.standIns?.find((id) => byId[id]);
    if (standIn) return byId[standIn];
  }
  return q.lesson ? byId[q.lesson] : undefined;
}
