import { describe, expect, it } from "vitest";
import { isAdvanceKey } from "./QuizSession";

describe("isAdvanceKey", () => {
  const key = (k: string, timeStamp: number, repeat = false) => ({ key: k, timeStamp, repeat });
  it("ignores the Enter that submitted the answer (pressed before the listener was armed)", () => {
    expect(isAdvanceKey(key("Enter", 100), 150)).toBe(false);
  });
  it("advances on a later Enter or Space", () => {
    expect(isAdvanceKey(key("Enter", 200), 150)).toBe(true);
    expect(isAdvanceKey(key(" ", 200), 150)).toBe(true);
  });
  it("ignores held-key repeats and other keys", () => {
    expect(isAdvanceKey(key("Enter", 200, true), 150)).toBe(false);
    expect(isAdvanceKey(key("a", 200), 150)).toBe(false);
  });
});
