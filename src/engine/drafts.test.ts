import { describe, expect, it } from "vitest";
import { draftKey, readDraft, writeDraft } from "./drafts";

const mem = () => {
  const m = new Map<string, string>();
  return { m, getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
};
const fizz = { id: "python-cc-02", fn: "fizz_buzz", starter: "def fizz_buzz(n):\n    pass\n" };
const sum = { id: "python-cc-01", fn: "sum_evens", starter: "def sum_evens(nums):\n    pass\n" };

describe("per-exercise drafts", () => {
  it("keys drafts by course and exercise", () => {
    const s = mem();
    writeDraft(s, "code-python", sum, "def sum_evens(nums):\n    return 1\n");
    expect(readDraft(s, "code-python", fizz)).toBe(fizz.starter);
    expect(readDraft(s, "code-python", sum)).toMatch(/return 1/);
    expect(readDraft(s, "other-course", sum)).toBe(sum.starter);
    expect([...s.m.keys()]).toEqual([draftKey("code-python", "python-cc-01")]);
  });

  it("ignores a draft that holds another exercise's code", () => {
    const s = mem();
    s.setItem(draftKey("code-python", fizz.id), "def two_sum(nums, target):\n    pass\n");
    expect(readDraft(s, "code-python", fizz)).toBe(fizz.starter);
  });

  it("moves a matching legacy draft to the new key and drops a mismatched one", () => {
    const s = mem();
    s.setItem("cq-draft:python-cc-01", "def sum_evens(nums):\n    return 2\n");
    s.setItem("cq-draft:python-cc-02", "def two_sum(nums, target):\n    pass\n");
    expect(readDraft(s, "code-python", sum)).toMatch(/return 2/);
    expect(readDraft(s, "code-python", fizz)).toBe(fizz.starter);
    expect(s.getItem("cq-draft:python-cc-01")).toBeNull();
    expect(s.getItem("cq-draft:python-cc-02")).toBeNull();
  });
});
