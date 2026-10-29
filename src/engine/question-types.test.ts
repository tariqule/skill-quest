import { describe, expect, it } from "vitest";
import { answerText, decodeText, encodeText, isCorrect, normalizeOutput, pickedText, prepare, questionKind } from "./game";
import type { FillQuestion, OutputQuestion } from "./types";

const base = { id: "q", domain: "d1", lesson: "l", level: "junior" as const, prompt: "p", explanation: "e" };

const fill: FillQuestion = {
  ...base,
  type: "fill",
  code: "const a = {{1}}([1, 2]);\nconsole.log(a {{2}} 3);",
  blanks: [
    { options: ["Array.from", "Object.keys", "new Set"], answer: 2 },
    { options: ["===", "==", ">"], answer: 1 },
  ],
};

const output: OutputQuestion = { ...base, type: "output", code: "console.log([1,2].map(n => n * 2))", answers: ["[2,4]", "[ 2, 4 ]"] };

describe("fill", () => {
  it("keeps every blank's options together and finds the right one after shuffling", () => {
    for (let run = 0; run < 25; run++) {
      const q = prepare(fill);
      expect(q.kind).toBe("fill");
      expect(q.groups).toHaveLength(2);
      expect(q.correct.map((i) => q.shuffled[i])).toEqual(["new Set", "=="]);
      expect(q.groups!.map((g) => g.map((i) => q.shuffled[i]).sort())).toEqual([[...fill.blanks[0].options].sort(), [...fill.blanks[1].options].sort()]);
      expect(isCorrect(q, q.correct)).toBe(true);
      expect(isCorrect(q, [q.correct[0], q.groups![1].find((i) => i !== q.correct[1])!])).toBe(false);
      expect(isCorrect(q, [q.correct[0]])).toBe(false);
    }
  });

  it("describes answers", () => {
    const q = prepare(fill);
    expect(answerText(fill)).toBe("new Set · ==");
    expect(pickedText(q, q.correct)).toBe("new Set · ==");
    expect(questionKind(fill)).toBe("fill");
  });
});

describe("output", () => {
  it("round-trips typed text, including emoji and newlines", () => {
    for (const s of ["[2,4]", "a\nb", "héllo ✓ 😀", ""]) expect(decodeText(encodeText(s))).toBe(s);
  });

  it("accepts any listed spelling and ignores spacing noise, but not wrong or empty answers", () => {
    const q = prepare(output);
    expect(isCorrect(q, encodeText("[2,4]"))).toBe(true);
    expect(isCorrect(q, encodeText("  [ 2,   4 ]  "))).toBe(true);
    expect(isCorrect(q, encodeText("[2, 4]"))).toBe(false);
    expect(isCorrect(q, encodeText("[4,2]"))).toBe(false);
    expect(isCorrect(q, encodeText("   "))).toBe(false);
    expect(pickedText(q, encodeText("[4,2]"))).toBe("[4,2]");
    expect(answerText(output)).toBe("[2,4]");
  });

  it("compares multi-line output line by line", () => {
    expect(normalizeOutput("a  b \r\n\n c ")).toBe("a b\n\nc");
    const q = prepare({ ...output, answers: ["1\n2\n3"] });
    expect(isCorrect(q, encodeText("1 \n2\n3\n"))).toBe(true);
    expect(isCorrect(q, encodeText("1\n3\n2"))).toBe(false);
  });
});
