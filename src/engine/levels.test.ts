import { describe, expect, it } from "vitest";
import { COURSES } from "@/courses";
import { examQuestions, levelDeck, weightedExamDeck } from "./game";
import { levelOf, levelOptions, levelSplit, nearbyLevels, questionsForLevel } from "./levels";

const TRACKS = COURSES;

describe("nearbyLevels", () => {
  it("orders by distance, lower first on ties", () => {
    expect(nearbyLevels("beginner")).toEqual(["junior", "intermediate", "senior", "staff"]);
    expect(nearbyLevels("junior")).toEqual(["beginner", "intermediate", "senior", "staff"]);
    expect(nearbyLevels("senior")).toEqual(["intermediate", "staff", "junior", "beginner"]);
    expect(nearbyLevels("staff")).toEqual(["senior", "intermediate", "junior", "beginner"]);
  });
});

describe.each(TRACKS.map((c) => [c.id, c] as const))("%s at every level", (_, course) => {
  it.each(levelOptions(course).map((l) => [l.id] as const))("%s: every game deck is full, level-first, and duplicate-free", (level) => {
    const pool = questionsForLevel(course, level);
    expect(pool.length).toBeGreaterThanOrEqual(12);
    if (level === "exam") expect(pool.every((q) => levelOf(q) !== "beginner")).toBe(true);
    else if (level !== "all") expect(pool.every((q) => levelOf(q) === level)).toBe(true);

    // Stage boss, study play and timed drills draw per stage with a nearby-level top-up.
    for (const d of course.domains) {
      const stage = course.questions.filter((q) => q.domain === d.id);
      for (const count of [course.config.quest.length, course.config.study.playQuestions, course.config.timed.questions]) {
        const deck = levelDeck(course, level, stage, count);
        const split = levelSplit(course, level, stage, count);
        expect(deck.length).toBe(Math.min(count, stage.length));
        expect(new Set(deck.map((q) => q.id)).size).toBe(deck.length);
        expect(deck.every((q) => q.domain === d.id)).toBe(true);
        if (level === "exam") expect(deck.filter((q) => levelOf(q) !== "beginner").length).toBe(split.atLevel);
        else if (level !== "all") expect(deck.filter((q) => levelOf(q) === level).length).toBe(split.atLevel);
      }
    }

    // Final boss and the mock interview stay strictly at the chosen level.
    const ids = new Set(pool.map((q) => q.id));
    const boss = weightedExamDeck(course, Math.min(course.config.boss.questions, pool.length), pool);
    expect(boss.length).toBe(Math.min(course.config.boss.questions, pool.length));
    expect(boss.every((q) => ids.has(q.id))).toBe(true);
    expect(new Set(boss.map((q) => q.id)).size).toBe(boss.length);
    expect(examQuestions(course).filter((q) => ids.has(q.id)).length).toBeGreaterThan(0);
  });
});
