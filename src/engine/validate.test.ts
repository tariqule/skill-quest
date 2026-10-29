import { describe, expect, it } from "vitest";
import { COURSES } from "@/courses";
import template from "@/courses/_template";
import { validateCourse } from "./validate";

describe.each(COURSES.map((c) => [c.id, c] as const))("course %s", (_id, course) => {
  it("has valid content", () => {
    expect(validateCourse(course)).toEqual([]);
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
