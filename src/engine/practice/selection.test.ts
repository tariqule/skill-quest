import { describe, expect, it } from "vitest";
import { seeded } from "./fixtures";
import { weightedSample } from "./selection";

const items = Array.from({ length: 20 }, (_, i) => i);

describe("weightedSample", () => {
  it("returns distinct items, at most `size`, never more than are drawable", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const out = weightedSample(items, () => 1, 7, seeded(seed));
      expect(out).toHaveLength(7);
      expect(new Set(out).size).toBe(7);
    }
    expect(weightedSample(items.slice(0, 3), () => 1, 10, seeded(1))).toHaveLength(3);
  });

  it("never draws a zero or negative weight item", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const out = weightedSample(items, (i) => (i % 3 === 0 ? 0 : i % 3 === 1 ? -1 : 1), 20, seeded(seed));
      expect(out.every((i) => i % 3 === 2)).toBe(true);
    }
  });

  it("handles empty input, size 0, and a rand at the top of its range", () => {
    expect(weightedSample([], () => 1, 5, seeded(1))).toEqual([]);
    expect(weightedSample(items, () => 1, 0, seeded(1))).toEqual([]);
    expect(weightedSample([1, 2], () => 1, 1, () => 0.999999)).toEqual([2]);
  });

  it("favours heavier items", () => {
    const rand = seeded(42);
    let heavy = 0;
    for (let n = 0; n < 2000; n++) if (weightedSample([0, 1], (i) => (i ? 9 : 1), 1, rand)[0] === 1) heavy++;
    expect(heavy / 2000).toBeGreaterThan(0.85);
  });
});
