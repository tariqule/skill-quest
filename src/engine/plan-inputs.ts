import { COURSES, getCourse } from "@/courses";
import { targetCourses } from "./bundles";
import { overallReadiness } from "./game";
import { indexCourse } from "./indexes";
import { buildDailyPlan, combinedReadiness, daysLeft, forecastReadiness, lessonsPerDay, type PlanCourseInput, type PlanItem, type StudyPlan } from "./plan";
import type { Progress } from "./store";
import { isCodeTrack } from "./tracks";
import type { Course } from "./types";

/** Plan inputs for a list of courses, given each one's saved progress. */
export function planInputs(courses: Course[], progressOf: (c: Course) => Progress): PlanCourseInput[] {
  return courses.map((c) => {
    const p = progressOf(c);
    const done = new Set(p.lessonsDone);
    return {
      id: c.id,
      title: c.shortTitle,
      lessons: indexCourse(c).allLessons.map((l) => ({ id: l.id, title: l.title, done: done.has(l.id) })),
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
}

/** Everything the "Today" panel shows for a plan. */
export function todaySummary(plan: StudyPlan, progressOf: (c: Course) => Progress, today: string, due: number): TodaySummary {
  const inputs = planInputs(planCourses(plan), progressOf);
  const remaining = inputs.reduce((s, c) => s + c.lessons.filter((l) => !l.done).length, 0);
  const total = inputs.reduce((s, c) => s + c.lessons.length, 0);
  const days = daysLeft(plan.date, today);
  const readiness = combinedReadiness(inputs);
  const perDay = lessonsPerDay(remaining, days, plan.minutesPerDay);
  return { items: buildDailyPlan(plan, inputs, today, due), days, readiness, forecast: forecastReadiness(readiness, remaining, perDay, days), remaining, total };
}

/** Courses the player is studying: anything with progress, plus the plan's targets. */
export function activeCourseIds(plan: StudyPlan | null, progressOf: (c: Course) => Progress): string[] {
  const ids = new Set(COURSES.filter((c) => progressOf(c).xp > 0).map((c) => c.id));
  if (plan) for (const id of targetCourses(plan.target)) ids.add(id);
  return [...ids];
}
