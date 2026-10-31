import { describe, expect, it } from "vitest";
import { quickQuestions, quizIntro } from "./copy";

describe("lesson quiz copy", () => {
  it("uses the real count", () => {
    expect(quickQuestions(1)).toBe("one quick question");
    expect(quickQuestions(2)).toBe("two quick questions");
    expect(quickQuestions(5)).toBe("five quick questions");
    expect(quickQuestions(12)).toBe("12 quick questions");
  });

  it("matches between the reader's last card and the quiz header", () => {
    expect(quizIntro(5)).toBe("Five quick questions about what you just read. Take your time.");
    expect(quizIntro(1)).toBe("One quick question about what you just read. Take your time.");
  });
});
