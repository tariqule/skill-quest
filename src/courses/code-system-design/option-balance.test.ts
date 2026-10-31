import { describe, expect, it } from "vitest";
import { practicePool } from "@/engine/practice";
import { LONGEST_MARGIN, longestChanceLimit, rightIsLongest } from "@/courses/system-design/schema";
import type { ChoiceQuestion } from "@/engine/types";
import course from ".";

/**
 * Every choice item practice can serve, topic and legacy alike, must not give itself away by
 * length: a right option may tie the longest wrong one but never be the single longest.
 */
const served = practicePool(course).filter(
  (q): q is ChoiceQuestion => !("type" in q && q.type) && "options" in q && !(q as ChoiceQuestion).tf && !!q.concepts?.length,
);
const single = served.filter((q) => q.answer.length === 1);
const topicIds = [...new Set(served.flatMap((q) => q.concepts!))];

describe("served items don't give the answer away by length", () => {
  it("covers a real pool", () => expect(served.length).toBeGreaterThan(50));
  it("covers every legacy item too", () => expect(served.some((q) => q.id === "d3-05")).toBe(true));
  it.each(served.map((q) => [q.id, q] as const))("%s", (_id, q) => {
    const right = Math.max(...q.answer.map((i) => q.options[i].length));
    const wrong = Math.max(...q.options.filter((_, i) => !q.answer.includes(i)).map((o) => o.length));
    expect(right, q.options.join(" | ")).toBeLessThanOrEqual(wrong + LONGEST_MARGIN);
  });
  it("has the right option (joint) longest no more often than chance in each topic's served pool", () => {
    for (const topic of topicIds) {
      const mine = single.filter((q) => q.concepts![0] === topic);
      const longest = mine.filter((q) => rightIsLongest(q.options, q.answer[0])).map((q) => q.id);
      expect(longest.length, `${topic}: ${longest.join(", ")}`).toBeLessThanOrEqual(longestChanceLimit(mine));
    }
  });
});
