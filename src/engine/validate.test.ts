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
