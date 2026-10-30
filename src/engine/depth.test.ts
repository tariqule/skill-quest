import { describe, expect, it } from "vitest";
import { COURSES } from "@/courses";
import { depthOf } from "./depth";

describe("depthOf", () => {
  it("counts lessons, points and words for every course", () => {
    for (const c of COURSES) {
      const d = depthOf(c);
      expect(d.lessons, c.id).toBeGreaterThan(0);
      expect(d.points, c.id).toBeGreaterThanOrEqual(d.lessons);
      expect(d.words, c.id).toBeGreaterThan(d.points);
      expect(d.examples, c.id).toBeGreaterThanOrEqual(0);
    }
  });

  it("keeps every course above the depth floor", () => {
    for (const c of COURSES) expect(depthOf(c).score, c.id).toBeGreaterThanOrEqual(100);
  });

  it("keeps worked examples and pitfalls in most lessons of the expanded courses", () => {
    for (const id of ["azure-ai-901", "code-data-structures", "code-nextjs", "code-algorithms"]) {
      const d = depthOf(COURSES.find((c) => c.id === id)!);
      expect(d.examples / d.lessons, id).toBeGreaterThanOrEqual(0.9);
      expect(d.pitfalls / d.lessons, id).toBeGreaterThanOrEqual(0.7);
    }
  });
});
