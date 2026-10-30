import { describe, expect, it } from "vitest";
import { codingGrade, runStatusChips } from "./coding-review";
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

describe("runStatusChips", () => {
  it("separates an earlier solve from a failing current run", () => {
    expect(runStatusChips(true, null)).toEqual([{ text: "✅ Solved before", tone: "good" }]);
    expect(runStatusChips(true, { passed: 0, total: 4, allPassed: false }).map((c) => c.text)).toEqual(["✅ Solved before", "✗ This run: 0/4 passed"]);
    expect(runStatusChips(false, { passed: 4, total: 4, allPassed: true }).map((c) => c.text)).toEqual(["✅ Passed this run"]);
    expect(runStatusChips(false, { passed: 0, total: 0, allPassed: false, timedOut: true })[0].text).toMatch(/stopped/);
    expect(runStatusChips(false, null)).toEqual([]);
  });
});
