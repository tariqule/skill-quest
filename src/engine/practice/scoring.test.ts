import { describe, expect, it } from "vitest";
import { question } from "./fixtures";
import { practiceWeight } from "./scoring";

const q = question("q", ["a"]);

describe("practiceWeight", () => {
  it("boosts the most recently finished topic over older ones", () => {
    expect(practiceWeight(q, { questions: {} }, ["b", "a"])).toBeGreaterThan(practiceWeight(q, { questions: {} }, ["a", "b", "c", "d", "e"]));
  });

  it("boosts a question missed last time and damps one answered right", () => {
    const fresh = practiceWeight(q, { questions: {} }, ["a"]);
    expect(practiceWeight(q, { questions: { q: { seen: 2, correct: 1, lastCorrect: false } } }, ["a"])).toBeGreaterThan(fresh);
    expect(practiceWeight(q, { questions: { q: { seen: 3, correct: 3, lastCorrect: true } } }, ["a"])).toBeLessThan(fresh);
  });

  it("stays positive so every unlocked question can be drawn", () => {
    const old = Array.from({ length: 30 }, (_, i) => `t${i}`);
    expect(practiceWeight(q, { questions: { q: { seen: 9, correct: 9, lastCorrect: true } } }, ["a", ...old])).toBeGreaterThan(0);
    expect(practiceWeight(question("u"), { questions: {} }, [])).toBeGreaterThan(0);
  });
});
