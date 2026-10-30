import { describe, expect, it } from "vitest";
import { COURSES } from "@/courses";
import { overlap, repeatedPoints } from "./dedupe";

describe("lesson point dedupe", () => {
  it("scores near-copies high and different points low", () => {
    expect(overlap("Mark a node visited when you add it to the queue.", "Mark the node as visited when you add it to the queue.")).toBeGreaterThan(0.6);
    expect(overlap("Heaps give the smallest item fast.", "Tries store words by prefix.")).toBeLessThan(0.1);
  });

  it("finds no repeated points within any lesson", () => {
    expect(COURSES.flatMap((c) => repeatedPoints(c, 0.45))).toEqual([]);
  });

  it("holds the Phase 5 expanded courses to a stricter bar", () => {
    const ids = ["azure-ai-901", "code-data-structures", "code-nextjs", "code-algorithms"];
    expect(COURSES.filter((c) => ids.includes(c.id)).flatMap((c) => repeatedPoints(c, 0.38))).toEqual([]);
  });
});
