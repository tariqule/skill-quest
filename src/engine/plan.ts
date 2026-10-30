/**
 * Study plan: turns "what, by when, how many minutes a day" into today's to-do list,
 * a countdown and a readiness forecast. Pure functions so they are easy to test.
 */

export type PlanGoal = "exam" | "interview" | "skill";

export interface StudyPlan {
  goal: PlanGoal;
  /** A course id, or a bundle id from bundles.ts. */
  target: string;
  /** Exam or interview date as YYYY-MM-DD, or null for "no date". */
  date: string | null;
  level: string;
  minutesPerDay: number;
  created: string;
}

export interface PlanCourseInput {
  id: string;
  title: string;
  /** Lessons in learning-path order, with whether each is done. */
  lessons: { id: string; title: string; done: boolean }[];
  /** 0-100. */
  readiness: number;
  hasExam: boolean;
}

export type PlanItem =
  | { kind: "review"; minutes: number; count: number }
  | { kind: "lesson"; minutes: number; courseId: string; lessonId: string; title: string; courseTitle: string }
  | { kind: "practice"; minutes: number; courseId: string; courseTitle: string }
  | { kind: "mock"; minutes: number; courseId: string; courseTitle: string };

export const LESSON_MINUTES = 8;
export const PRACTICE_MINUTES = 10;
export const MOCK_MINUTES = 30;
const SECONDS_PER_REVIEW = 30;

/** Whole days from `today` to `date` (both YYYY-MM-DD). Negative once the date has passed. */
export function daysLeft(date: string | null, today: string): number | null {
  if (!date) return null;
  const a = Date.UTC(+today.slice(0, 4), +today.slice(5, 7) - 1, +today.slice(8, 10));
  const b = Date.UTC(+date.slice(0, 4), +date.slice(5, 7) - 1, +date.slice(8, 10));
  return Math.round((b - a) / 86_400_000);
}

/** Final days reserved for mock exams and review: about 20% of the time left, 1 to 7 days. */
export function mockWindow(days: number) {
  return Math.max(1, Math.min(7, Math.floor(days * 0.2)));
}

/** Lessons left across the target courses, interleaved so a bundle moves forward evenly. */
function remainingLessons(courses: PlanCourseInput[]) {
  const queues = courses.map((c) => c.lessons.filter((l) => !l.done).map((l) => ({ ...l, course: c })));
  const out: (typeof queues)[number] = [];
  for (let i = 0; queues.some((q) => i < q.length); i++) for (const q of queues) if (i < q.length) out.push(q[i]);
  return out;
}

/** How many new lessons a day keep the learner on track for the date. */
export function lessonsPerDay(remaining: number, days: number | null, minutesPerDay: number) {
  const budget = Math.max(1, Math.floor(minutesPerDay / LESSON_MINUTES));
  if (remaining === 0) return 0;
  if (days === null) return Math.min(remaining, Math.max(1, Math.floor(budget / 2)));
  const studyDays = Math.max(1, days - mockWindow(days));
  return Math.min(remaining, Math.max(1, Math.ceil(remaining / studyDays)));
}

/** Today's plan: due reviews first (retrieval), then new lessons, then practice or a mock exam. */
export function buildDailyPlan(plan: Pick<StudyPlan, "date" | "minutesPerDay">, courses: PlanCourseInput[], today: string, due: number): PlanItem[] {
  const items: PlanItem[] = [];
  let left = plan.minutesPerDay;
  const days = daysLeft(plan.date, today);

  if (due > 0) {
    const minutes = Math.max(1, Math.min(Math.ceil((due * SECONDS_PER_REVIEW) / 60), Math.ceil(plan.minutesPerDay * 0.4)));
    items.push({ kind: "review", minutes, count: Math.min(due, Math.floor((minutes * 60) / SECONDS_PER_REVIEW)) });
    left -= minutes;
  }

  const rest = remainingLessons(courses);
  const inMockWindow = days !== null && days >= 0 && days <= mockWindow(days);
  const examCourse = courses.find((c) => c.hasExam) ?? courses[0];

  if (inMockWindow && examCourse && left >= MOCK_MINUTES / 2) {
    items.push({ kind: "mock", minutes: Math.min(MOCK_MINUTES, left), courseId: examCourse.id, courseTitle: examCourse.title });
    left -= Math.min(MOCK_MINUTES, left);
  }

  const wanted = lessonsPerDay(rest.length, days, plan.minutesPerDay);
  for (const l of rest.slice(0, wanted)) {
    if (left < LESSON_MINUTES) break;
    items.push({ kind: "lesson", minutes: LESSON_MINUTES, courseId: l.course.id, lessonId: l.id, title: l.title, courseTitle: l.course.title });
    left -= LESSON_MINUTES;
  }

  if (left >= PRACTICE_MINUTES / 2 && courses.length > 0) {
    const weakest = [...courses].sort((a, b) => a.readiness - b.readiness)[0];
    items.push({ kind: "practice", minutes: Math.min(PRACTICE_MINUTES, left), courseId: weakest.id, courseTitle: weakest.title });
  }
  return items;
}

/** Average readiness across the target courses, 0-100. */
export function combinedReadiness(courses: Pick<PlanCourseInput, "readiness">[]) {
  if (courses.length === 0) return 0;
  return Math.round(courses.reduce((s, c) => s + c.readiness, 0) / courses.length);
}

/**
 * A simple, explainable forecast of readiness on the target date (0-100):
 * the share of remaining lessons the plan will cover by then closes that share
 * of the gap, discounted 15% because learning a lesson isn't mastering it.
 */
export function forecastReadiness(current: number, remainingLessons: number, perDay: number, days: number | null) {
  if (days === null || days <= 0 || remainingLessons === 0) return Math.round(current);
  const coverage = Math.min(1, (perDay * Math.max(1, days - mockWindow(days))) / remainingLessons);
  return Math.round(Math.min(100, current + (100 - current) * coverage * 0.85));
}

/** "On track" when the forecast reaches the pass bar (default 75% ready). */
export function onTrack(forecast: number, bar = 75) {
  return forecast >= bar;
}
