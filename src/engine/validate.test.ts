import { describe, expect, it } from "vitest";
import { COURSES } from "@/courses";
import template from "@/courses/_template";
import { longestOptionWarnings, validateCourse } from "./validate";

/** Courses held to the "correct option isn't clearly the longest" rule. Add a course id once its bank passes. */
const LONGEST_OPTION_STRICT = new Set(["aws-aif-c01", "aws-dva-c03", "aws-dva-c02", "aws-saa-c03", "aws-clf-c02"]);

describe.each(COURSES.map((c) => [c.id, c] as const))("course %s", (_id, course) => {
  it("has valid content", () => {
    expect(validateCourse(course)).toEqual([]);
  });

  it.runIf(LONGEST_OPTION_STRICT.has(course.id))("doesn't make the correct option clearly the longest", () => {
    expect(longestOptionWarnings(course)).toEqual([]);
  });

  it("has a unique id and storage key", () => {
    expect(COURSES.filter((c) => c.id === course.id)).toHaveLength(1);
    expect(COURSES.filter((c) => c.storageKey === course.storageKey)).toHaveLength(1);
  });
});

describe("course template", () => {
  it("is a valid starting point for a new course", () => {
    expect(validateCourse(template)).toEqual([]);
  });
});

describe("course lifecycles", () => {
  it("successor and predecessor ids point at registered courses", () => {
    const ids = new Set(COURSES.map((c) => c.id));
    for (const c of COURSES) {
      if (c.lifecycle?.successor) expect(ids.has(c.lifecycle.successor), `${c.id} successor`).toBe(true);
      if (c.lifecycle?.predecessor) expect(ids.has(c.lifecycle.predecessor), `${c.id} predecessor`).toBe(true);
    }
  });
});

describe("longestOptionWarnings", () => {
  const base = { ...template, id: "lint-probe" };
  const q = (options: string[], answer: number[]) => ({ id: "q1", domain: template.domains[0].id, lesson: "x", prompt: "p", explanation: "e", options, answer });
  it("flags a single answer that is more than 20% longer than every distractor", () => {
    const course = { ...base, questions: [q(["A much longer correct answer here", "Short one", "Short two"], [0])] };
    expect(longestOptionWarnings(course)).toHaveLength(1);
  });
  it("allows options of similar length, and skips multi-answer questions", () => {
    const course = { ...base, questions: [q(["Correct answer", "Wrong answer!", "Other"], [0]), { ...q(["A very long correct answer", "B", "C"], [0, 1]), id: "q2" }] };
    expect(longestOptionWarnings(course)).toEqual([]);
  });
});
