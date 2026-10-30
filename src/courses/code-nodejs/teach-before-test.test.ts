import { describe, expect, it } from "vitest";
import { teachBeforeTestWarnings } from "@/engine/quality";
import course from ".";
import { CONCEPTS } from "./concepts";

describe("code-nodejs teach before test", () => {
  it("every question links to a lesson", () => {
    expect(course.questions.filter((q) => !q.lesson).map((q) => q.id)).toEqual([]);
  });

  it("only tests concepts taught at or before the question's lesson", () => {
    expect(teachBeforeTestWarnings(course, CONCEPTS)).toEqual([]);
  });
});
