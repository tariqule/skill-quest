import { COURSES, getCourse } from "@/courses";
import { targetCourses } from "./bundles";
import { overallReadiness } from "./game";
import { indexCourse } from "./indexes";
import { buildDailyPlan, combinedReadiness, daysLeft, forecastReadiness, isNewLearner, lessonsPerDay, type PlanCourseInput, type PlanItem, type StudyPlan } from "./plan";
import { pathLessons, type LevelChoice } from "./levels";
import type { Progress } from "./store";
import { isCodeTrack } from "./tracks";
import type { Course } from "./types";

/**
 * Plan inputs for a list of courses, given each one's saved progress. Lessons follow the map's own
 * path for the plan's level first ("Start here" lessons for Beginner, the main lessons otherwise),
 * so Today never disagrees with the map.
 */
export function planInputs(courses: Course[], progressOf: (c: Course) => Progress, level?: string): PlanCourseInput[] {
  return courses.map((c) => {
    const p = progressOf(c);
    const done = new Set(p.lessonsDone);
    const all = indexCourse(c).allLessons;
    const onPath = level ? pathLessons(c, level as LevelChoice) : [];
    const ordered = onPath.length ? [...onPath, ...all.filter((l) => !onPath.some((x) => x.id === l.id))] : all;
    return {
      id: c.id,
      title: c.shortTitle,
      lessons: ordered.map((l) => ({ id: l.id, title: l.title, done: done.has(l.id) })),
      readiness: Math.round(overallReadiness(c, p)),
      hasExam: !isCodeTrack(c),
    };
  });
}

export function planCourses(plan: StudyPlan): Course[] {
  return targetCourses(plan.target)
    .map((id) => getCourse(id))
    .filter((c): c is Course => !!c);
}

export interface TodaySummary {
  items: PlanItem[];
  days: number | null;
  readiness: number;
  forecast: number;
  remaining: number;
  total: number;
  /** Lessons finished across the plan's courses. */
  done: number;
  /** Beginner with only a few lessons done: show lessons only, no reviews or games yet. */
  newLearner: boolean;
}

/** Everything the "Today" panel shows for a plan. */
export function todaySummary(plan: StudyPlan, progressOf: (c: Course) => Progress, today: string, due: number): TodaySummary {
  const inputs = planInputs(planCourses(plan), progressOf, plan.level);
  const remaining = inputs.reduce((s, c) => s + c.lessons.filter((l) => !l.done).length, 0);
  const total = inputs.reduce((s, c) => s + c.lessons.length, 0);
  const days = daysLeft(plan.date, today);
  const readiness = combinedReadiness(inputs);
  const perDay = lessonsPerDay(remaining, days, plan.minutesPerDay);
  const done = total - remaining;
  const newLearner = isNewLearner(plan, done);
  return { items: buildDailyPlan(plan, inputs, today, due, newLearner), days, readiness, forecast: forecastReadiness(readiness, remaining, perDay, days), remaining, total, done, newLearner };
}

/** Courses the player is studying: anything with progress, plus the plan's targets. */
export function activeCourseIds(plan: StudyPlan | null, progressOf: (c: Course) => Progress): string[] {
  const ids = new Set(COURSES.filter((c) => progressOf(c).xp > 0).map((c) => c.id));
  if (plan) for (const id of targetCourses(plan.target)) ids.add(id);
  return [...ids];
}
