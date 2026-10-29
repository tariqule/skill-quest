import { describe, expect, it } from "vitest";
import { COURSES } from "@/courses";
import { allocateByWeight, challengeDeck, examQuestions, officialKinds, questionKind, weightedExamDeck } from "./game";

describe.each(COURSES.map((c) => [c.id, c] as const))("decks for %s", (_id, course) => {
  it.each([9, 10, 40, course.exam.questions])("weighted deck of %i has exactly that many unique questions", (n) => {
    const d = weightedExamDeck(course, n);
    expect(d).toHaveLength(n);
    expect(new Set(d.map((q) => q.id)).size).toBe(n);
  });

  it("allocates by weight and sums to the total", () => {
    const counts = allocateByWeight(course, 65);
    expect(Object.values(counts).reduce((a, b) => a + b, 0)).toBe(65);
  });

  it("timed challenge never repeats a question, even if the pool has duplicates", () => {
    const pool = [...course.questions.slice(0, 3), ...course.questions.slice(0, 3)];
    for (let i = 0; i < 20; i++) {
      const d = challengeDeck([], pool, 3);
      expect(new Set(d.map((q) => q.id)).size).toBe(d.length);
    }
  });

  it("timed challenge includes every must-have question", () => {
    const must = course.questions.slice(0, 2);
    const d = challengeDeck(must, course.questions, 4);
    expect(d).toHaveLength(4);
    for (const q of must) expect(d.map((x) => x.id)).toContain(q.id);
  });
});

describe.each(COURSES.map((c) => [c.id, c] as const))("exam formats for %s", (_id, course) => {
  it("full simulations use only official question formats", () => {
    const kinds = officialKinds(course);
    const full = course.config.examModes[0];
    const d = weightedExamDeck(course, full.questions, examQuestions(course));
    expect(d).toHaveLength(full.questions);
    for (const q of d) expect(kinds.has(questionKind(q))).toBe(true);
  });
});
