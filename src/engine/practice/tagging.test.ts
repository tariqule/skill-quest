import { describe, expect, it } from "vitest";
import { TOPICS } from "./fixtures";
import { inferConcepts } from "./tagging";

describe("inferConcepts", () => {
  it("tags every topic whose pattern matches", () => {
    expect(inferConcepts("alpha meets gamma", TOPICS)).toEqual(["a", "c"]);
  });

  it("falls back to the first candidate", () => {
    expect(inferConcepts("nothing here", TOPICS.slice(1))).toEqual(["b"]);
  });

  it("returns nothing without candidates", () => {
    expect(inferConcepts("alpha", [])).toEqual([]);
  });
});
