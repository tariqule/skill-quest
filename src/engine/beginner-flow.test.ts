import { describe, expect, it } from "vitest";
import { COURSES } from "@/courses";
import { readerSteps } from "@/components/learn/LessonReader";
import { buildQueue, taughtIn } from "./daily-queue";
import { hasBeginnerLessons, pathLessons } from "./levels";
import { lessonsDoneIn, nextStep } from "./next-step";
import { buildPath } from "./path";
import { buildDailyPlan, EASE_IN_LESSONS, isNewLearner, type PlanCourseInput, type StudyPlan } from "./plan";
import { todaySummary } from "./plan-inputs";
import { INITIAL_PROGRESS, type Progress } from "./store";

const TODAY = "2026-10-30";
const plan = (target: string, level = "beginner"): StudyPlan => ({ goal: "skill", target, date: null, level, minutesPerDay: 20, created: TODAY });
const progressFor = (level: string, lessonsDone: string[] = []) => (): Progress => ({ ...INITIAL_PROGRESS, level: level as Progress["level"], lessonsDone });

describe("buildDailyPlan for a new learner", () => {
  const input: PlanCourseInput = { id: "a", title: "A", lessons: ["l1", "l2", "l3"].map((id) => ({ id, title: id, done: false })), readiness: 0, hasExam: true };

  it("is lessons only: no review, mock exam or practice, however much is 'due'", () => {
    const items = buildDailyPlan({ date: "2026-11-05", minutesPerDay: 45 }, [input], TODAY, 17, true);
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((i) => i.kind === "lesson")).toBe(true);
    expect(items.length).toBeLessThanOrEqual(2);
  });

  it("still gives one lesson on a tiny time budget", () => {
    expect(buildDailyPlan({ date: null, minutesPerDay: 5 }, [input], TODAY, 9, true).map((i) => i.kind)).toEqual(["lesson"]);
  });

  it("keeps the usual plan (review first) for everyone else", () => {
    expect(buildDailyPlan({ date: null, minutesPerDay: 30 }, [input], TODAY, 9, false)[0].kind).toBe("review");
  });
});

describe("isNewLearner", () => {
  it("is true for Beginner until a few lessons are done, never for other levels", () => {
    expect(isNewLearner({ level: "beginner" }, 0)).toBe(true);
    expect(isNewLearner({ level: "beginner" }, EASE_IN_LESSONS - 1)).toBe(true);
    expect(isNewLearner({ level: "beginner" }, EASE_IN_LESSONS)).toBe(false);
    expect(isNewLearner({ level: "junior" }, 0)).toBe(false);
    expect(isNewLearner({ level: "exam" }, 0)).toBe(false);
  });
});

describe.each(COURSES.filter(hasBeginnerLessons).map((c) => [c.id, c] as const))("%s beginner flow", (_, course) => {
  it("sends a brand-new beginner to the first 'Start here' lesson, the same one the map shows", () => {
    const p = plan(course.id);
    const step = nextStep(p, progressFor("beginner"));
    const path = pathLessons(course, "beginner");
    expect(step).not.toBeNull();
    expect(step!.isFirst).toBe(true);
    expect(step!.number).toBe(1);
    expect(step!.total).toBe(path.length);
    expect(step!.lessonId).toBe(path[0].id);
    expect(path[0].level).toBe("beginner");
    expect(step!.lessonId).toBe(buildPath(course, progressFor("beginner")()).current!.key);
    expect(step!.href).toBe(`/c/${course.id}/lesson/${step!.lessonId}`);
  });

  it("Today shows only lessons for a new beginner, starting with that first lesson, and opens up after a few", () => {
    const p = plan(course.id);
    const fresh = todaySummary(p, progressFor("beginner"), TODAY, 17);
    expect(fresh.newLearner).toBe(true);
    expect(fresh.items.every((i) => i.kind === "lesson")).toBe(true);
    expect(fresh.items[0]).toMatchObject({ kind: "lesson", lessonId: pathLessons(course, "beginner")[0].id });

    const first = pathLessons(course, "beginner").slice(0, EASE_IN_LESSONS).map((l) => l.id);
    const later = todaySummary(p, progressFor("beginner", first), TODAY, 17);
    expect(later.newLearner).toBe(false);
    expect(later.items.some((i) => i.kind === "review")).toBe(true);
    expect(lessonsDoneIn(p, progressFor("beginner", first))).toBe(EASE_IN_LESSONS);
  });

  it("does not change the plan for someone who already knows the basics", () => {
    const level = course.kind ? "junior" : "exam";
    const s = todaySummary(plan(course.id, level), progressFor(level), TODAY, 17);
    expect(s.newLearner).toBe(false);
    expect(s.items[0].kind).toBe("review");
  });
});

describe("Daily Review only draws from what has been taught", () => {
  const course = COURSES.find((c) => c.id === "code-html-css")!;

  it("knows which lessons and sections are taught", () => {
    expect(taughtIn(course, { lessonsDone: [] }).domains.size).toBe(0);
    const first = pathLessons(course, "beginner")[0];
    const t = taughtIn(course, { lessonsDone: [first.id] });
    expect(t.lessons.has(first.id)).toBe(true);
    expect(t.domains.size).toBe(1);
  });

  it("a learner with no finished lessons gets no new cards or questions", () => {
    const queue = buildQueue(plan(course.id));
    expect(queue.filter((x) => x.fresh || x.kind === "card" || x.kind === "q")).toEqual([]);
  });
});

describe("every 'Start here' lesson works one idea per screen", () => {
  const lessons = COURSES.flatMap((c) => Object.values(c.lessons).flat().filter((l) => l.level === "beginner").map((l) => [`${c.id}/${l.id}`, l] as const));

  it("has beginner lessons to test", () => expect(lessons.length).toBeGreaterThan(100));

  it.each(lessons)("%s: picture, then one card per point, then the tip; two questions after", (_, lesson) => {
    const steps = readerSteps(lesson);
    expect(steps[0].kind).toBe("picture");
    expect(steps.filter((s) => s.kind === "point")).toHaveLength(lesson.points.length);
    expect(steps).toHaveLength(1 + lesson.points.length + (lesson.tip ? 1 : 0));
    expect(lesson.points.length).toBeGreaterThanOrEqual(1);
    expect(lesson.check.length).toBeGreaterThanOrEqual(2);
  });
});
