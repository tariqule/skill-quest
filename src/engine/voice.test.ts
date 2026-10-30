import { describe, expect, it } from "vitest";
import { COURSES } from "@/courses";
import { voiceProblems } from "./voice";

describe.each(COURSES.map((c) => [c.id, c] as const))("%s voice", (_, course) => {
  it("reads like a person wrote it (no banned phrases or em dashes)", () => {
    expect(voiceProblems(course)).toEqual([]);
  });
});
