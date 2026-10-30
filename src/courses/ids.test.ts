import { describe, expect, it } from "vitest";
import { COURSES } from ".";
import { COURSE_IDS } from "./ids";
import { isUnknownCoursePath } from "@/proxy";

describe("COURSE_IDS", () => {
  it("lists exactly the registered courses", () => {
    expect([...COURSE_IDS].sort()).toEqual(COURSES.map((c) => c.id).sort());
  });
});

describe("isUnknownCoursePath", () => {
  it("flags /c/<id> only when the id isn't a course", () => {
    expect(isUnknownCoursePath("/c/nope")).toBe(true);
    expect(isUnknownCoursePath("/c/nope/guide")).toBe(true);
    expect(isUnknownCoursePath("/c/aws-aif-c01")).toBe(false);
    expect(isUnknownCoursePath("/c/aws-aif-c01/lesson/x")).toBe(false);
    expect(isUnknownCoursePath("/code")).toBe(false);
  });
});
