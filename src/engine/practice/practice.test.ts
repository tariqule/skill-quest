import { describe, expect, it } from "vitest";
import course from "@/courses/code-system-design";
import type { Course } from "../types";
import { PROMPTS, QUESTIONS, TOPICS, progress, question, seeded } from "./fixtures";
import { buildPracticeDeck, practicePool, practiceSummary } from "./practice";

const fixture: Course = { ...course, topics: TOPICS, questions: QUESTIONS, practice: [question("pc", ["c"])], designPrompts: PROMPTS };

describe("practicePool", () => {
  it("includes tagged course and practice questions only", () => {
    expect(practicePool(fixture).map((q) => q.id)).toEqual(["qa", "qb", "qab", "qc", "qe", "pc"]);
  });
});

describe("practiceSummary", () => {
  it("has an empty state that points at the first topic", () => {
    const s = practiceSummary(fixture, progress([]));
    expect(s).toMatchObject({ total: 5, available: 0, prompts: [], planned: 1, full: false });
    expect(s.done).toEqual([]);
    expect(s.next?.topic.id).toBe("a");
    expect(s.next?.unlocks).toEqual({ questions: 1, prompts: 0 });
    expect(s.locked.map((l) => [l.topic.id, l.needs.map((t) => t.id)])).toEqual([["b", ["a"]], ["c", ["b"]]]);
  });

  it("gives the right subset for partial progress, stand-ins included", () => {
    const s = practiceSummary(fixture, progress(["old-b", "a"]));
    expect(s.done.map((t) => t.id)).toEqual(["a", "b"]);
    expect(s.covered.map((t) => t.id)).toEqual(["a", "b"]);
    expect(s.available).toBe(3);
    expect(s.prompts).toEqual(PROMPTS);
    expect(s.next).toEqual({ topic: TOPICS[2], unlocks: { questions: 2, prompts: 0 } });
  });

  it("skips planned topics and doesn't let them block", () => {
    const s = practiceSummary(fixture, progress(["a", "b", "c"]));
    expect(s.next?.topic.id).toBe("e");
    expect(s.locked).toEqual([]);
  });

  it("is full once every ready topic is done", () => {
    const s = practiceSummary(fixture, progress(["a", "b", "c", "e"]));
    expect(s).toMatchObject({ full: true, next: null, available: 6 });
  });

  it("is never full on a course without topics", () => {
    expect(practiceSummary({ ...fixture, topics: undefined }, progress(["a"]))).toMatchObject({ total: 0, full: false, next: null });
  });
});

describe("buildPracticeDeck", () => {
  it("never includes a question with an unfinished concept, for any progress and seed", () => {
    const lessons = ["a", "old-b", "b", "c", "e", "noise"];
    for (let seed = 1; seed <= 300; seed++) {
      const rand = seeded(seed);
      const done = lessons.filter(() => rand() < 0.5);
      const finished = new Set(practiceSummary(fixture, progress(done)).done.map((t) => t.id));
      const deck = buildPracticeDeck(fixture, progress(done), 4, rand);
      for (const q of deck) expect(q.concepts?.every((c) => finished.has(c))).toBe(true);
      expect(new Set(deck.map((q) => q.id)).size).toBe(deck.length);
    }
  });

  it("is empty before any topic is done", () => {
    expect(buildPracticeDeck(fixture, progress([]), 10, seeded(1))).toEqual([]);
  });
});
