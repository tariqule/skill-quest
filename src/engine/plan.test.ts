import { describe, expect, it } from "vitest";
import { targetCourses } from "./bundles";
import { buildDailyPlan, combinedReadiness, daysLeft, forecastReadiness, lessonsPerDay, mockWindow, onTrack, type PlanCourseInput } from "./plan";

const lessons = (n: number, done = 0) => Array.from({ length: n }, (_, i) => ({ id: `l${i}`, title: `Lesson ${i}`, done: i < done }));
const course = (id: string, n: number, done = 0, readiness = 0): PlanCourseInput => ({ id, title: id, lessons: lessons(n, done), readiness, hasExam: true });

describe("plan", () => {
  it("counts days to the target date", () => {
    expect(daysLeft("2026-11-30", "2026-10-30")).toBe(31);
    expect(daysLeft("2026-10-29", "2026-10-30")).toBe(-1);
    expect(daysLeft(null, "2026-10-30")).toBeNull();
  });

  it("reserves 1-7 final days for mock exams", () => {
    expect(mockWindow(3)).toBe(1);
    expect(mockWindow(20)).toBe(4);
    expect(mockWindow(100)).toBe(7);
  });

  it("spreads remaining lessons over the study days", () => {
    expect(lessonsPerDay(30, 31, 30)).toBe(2);
    expect(lessonsPerDay(0, 31, 30)).toBe(0);
    expect(lessonsPerDay(10, null, 32)).toBe(2);
  });

  it("puts due reviews first, then lessons in path order, then practice on the weakest course", () => {
    const plan = buildDailyPlan({ date: "2026-11-30", minutesPerDay: 30 }, [course("a", 30, 2, 40), course("b", 10, 0, 10)], "2026-10-30", 20);
    expect(plan[0]).toEqual({ kind: "review", minutes: 10, count: 20 });
    const ls = plan.filter((p) => p.kind === "lesson");
    expect(ls.map((l) => (l.kind === "lesson" ? `${l.courseId}/${l.lessonId}` : ""))).toEqual(["a/l2", "b/l0"]);
    expect(plan.reduce((s, p) => s + p.minutes, 0)).toBeLessThanOrEqual(30);
  });

  it("switches to a mock exam in the final days", () => {
    const plan = buildDailyPlan({ date: "2026-10-31", minutesPerDay: 45 }, [course("a", 10, 9)], "2026-10-30", 0);
    expect(plan.some((p) => p.kind === "mock")).toBe(true);
  });

  it("never plans more than the daily minutes", () => {
    const plan = buildDailyPlan({ date: null, minutesPerDay: 10 }, [course("a", 50)], "2026-10-30", 500);
    expect(plan.reduce((s, p) => s + p.minutes, 0)).toBeLessThanOrEqual(10);
  });

  it("forecasts readiness from plan coverage and caps at 100", () => {
    expect(forecastReadiness(40, 30, 2, 31)).toBe(91);
    expect(forecastReadiness(40, 30, 1, 10)).toBe(54);
    expect(forecastReadiness(40, 0, 0, 10)).toBe(40);
    expect(forecastReadiness(40, 30, 2, null)).toBe(40);
    expect(onTrack(91)).toBe(true);
    expect(onTrack(54)).toBe(false);
  });

  it("averages readiness across a bundle and resolves bundle targets", () => {
    expect(combinedReadiness([{ readiness: 20 }, { readiness: 61 }])).toBe(41);
    expect(combinedReadiness([])).toBe(0);
    expect(targetCourses("bundle-dsa")).toEqual(["code-data-structures", "code-algorithms"]);
    expect(targetCourses("aws-aif-c01")).toEqual(["aws-aif-c01"]);
  });
});
