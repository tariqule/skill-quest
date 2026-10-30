import { buildPath } from "./path";
import { planCourses } from "./plan-inputs";
import type { StudyPlan } from "./plan";
import { pathLessons } from "./levels";
import type { Progress } from "./store";
import type { Course } from "./types";

export interface NextStep {
  course: Course;
  lessonId: string;
  title: string;
  href: string;
  /** 1-based position of this lesson on the learner's path in this course, and the path's length. */
  number: number;
  total: number;
  /** True while nothing on the path is done yet. */
  isFirst: boolean;
}

/**
 * The one answer to "what should this learner do next?": the first unfinished lesson on the
 * map's own path (`buildPath`), across the plan's courses. Home, the plan wizard and the intro
 * all use this, so they can never disagree with the map.
 */
export function nextStep(plan: StudyPlan, progressOf: (c: Course) => Progress): NextStep | null {
  for (const course of planCourses(plan)) {
    const p = progressOf(course);
    const { current } = buildPath(course, p);
    if (current?.type !== "lesson") continue;
    const path = pathLessons(course, p.level);
    const idx = path.findIndex((l) => l.id === current.key);
    return {
      course,
      lessonId: current.key,
      title: current.title,
      href: `/c/${course.id}/lesson/${current.key}`,
      number: idx >= 0 ? idx + 1 : 1,
      total: path.length,
      isFirst: !path.some((l) => p.lessonsDone.includes(l.id)),
    };
  }
  return null;
}

/** How many lessons the learner has finished across the plan's courses. */
export function lessonsDoneIn(plan: StudyPlan, progressOf: (c: Course) => Progress) {
  return planCourses(plan).reduce((n, c) => n + progressOf(c).lessonsDone.length, 0);
}
