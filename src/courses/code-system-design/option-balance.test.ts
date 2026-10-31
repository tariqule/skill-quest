import { describe, expect, it } from "vitest";
import { TOPIC_CONTENT } from "@/courses/system-design/registry";
import { LONGEST_MARGIN, longestChanceLimit, rightIsLongest } from "@/courses/system-design/schema";
import type { ChoiceQuestion } from "@/engine/types";
import course from ".";

/**
 * Every single-answer choice item that topic practice can serve (all its tags are written topics)
 * must not give itself away by length: the right option may tie the longest wrong one but never
 * be the single longest.
 */
const written = new Set(TOPIC_CONTENT.map((t) => t.id));
const served = [...course.questions, ...(course.practice ?? [])].filter(
  (q): q is ChoiceQuestion => !("type" in q && q.type) && "options" in q && !(q as ChoiceQuestion).tf && (q as ChoiceQuestion).answer.length === 1 && !!q.concepts?.length && q.concepts.every((c) => written.has(c)),
);

describe("served items don't give the answer away by length", () => {
  it("covers a real pool", () => expect(served.length).toBeGreaterThan(50));
  it.each(served.map((q) => [q.id, q] as const))("%s", (_id, q) => {
    const right = q.options[q.answer[0]].length;
    const wrong = Math.max(...q.options.filter((_, i) => i !== q.answer[0]).map((o) => o.length));
    expect(right, q.options.join(" | ")).toBeLessThanOrEqual(wrong + LONGEST_MARGIN);
  });
  it("has the right option (joint) longest no more often than chance in each topic's served pool", () => {
    for (const topic of written) {
      const mine = served.filter((q) => q.concepts![0] === topic);
      const longest = mine.filter((q) => rightIsLongest(q.options, q.answer[0])).map((q) => q.id);
      expect(longest.length, `${topic}: ${longest.join(", ")}`).toBeLessThanOrEqual(longestChanceLimit(mine));
    }
  });
});
