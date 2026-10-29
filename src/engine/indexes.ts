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
        course.questions.flatMap((q) => (q.lesson && byId[q.lesson] ? [[q.id, byId[q.lesson]]] : [])),
      ),
    };
    indexes.set(course, idx);
  }
  return idx;
}
