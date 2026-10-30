import { describe, expect, it } from "vitest";
import { COURSES } from "@/courses";
import { isChoice } from "./types";

/**
 * QA safeguard: snapshots the keyed answer text of every choice question.
 * If an answer index or a correct option's text changes, this fails. Update the
 * snapshot (vitest -u) only after checking the change is intended.
 */
describe.each(COURSES.map((c) => [c.id, c] as const))("answer keys %s", (_id, course) => {
  it("match the reviewed snapshot", () => {
    const keys = Object.fromEntries(course.questions.filter(isChoice).map((q) => [q.id, q.answer.map((i) => q.options[i])]));
    expect(keys).toMatchSnapshot();
  });
});
