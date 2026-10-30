import { describe, expect, it } from "vitest";
import { codingGrade } from "./coding-review";
import { itemKey, parseKey } from "./srs";

describe("coding review", () => {
  it("grades runs", () => {
    expect(codingGrade({ solved: true, hints: 0, failedBefore: false, sawSolution: false })).toBe("good");
    expect(codingGrade({ solved: true, hints: 1, failedBefore: false, sawSolution: false })).toBe("hard");
    expect(codingGrade({ solved: true, hints: 0, failedBefore: true, sawSolution: false })).toBe("hard");
    expect(codingGrade({ solved: true, hints: 0, failedBefore: false, sawSolution: true })).toBe("again");
    expect(codingGrade({ solved: false, hints: 0, failedBefore: false, sawSolution: false })).toBe("again");
  });
  it("round-trips code item keys", () => {
    expect(parseKey(itemKey("code-python", "code", "python-cc-01"))).toEqual({ courseId: "code-python", kind: "code", id: "python-cc-01" });
  });
});
