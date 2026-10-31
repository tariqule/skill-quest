import { describe, expect, it } from "vitest";
import { type QuizSession, afterAnswer, clearQuiz, gateKey, quizKey, readGateDismissed, readQuiz, writeGateDismissed, writeQuiz } from "./lesson-session";

function memory() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
}

describe("prerequisite gate choice", () => {
  it("remembers Continue anyway per lesson across a reload", () => {
    const s = memory();
    expect(readGateDismissed(s, gateKey("c", "t-kafka-3"))).toBe(false);
    writeGateDismissed(s, gateKey("c", "t-kafka-3"));
    expect(readGateDismissed(s, gateKey("c", "t-kafka-3"))).toBe(true);
    expect(readGateDismissed(s, gateKey("c", "t-stream"))).toBe(false);
  });

  it("treats blocked storage as not dismissed", () => {
    const s = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); }, removeItem: () => {} };
    expect(() => writeGateDismissed(s, "k")).not.toThrow();
    expect(readGateDismissed(s, "k")).toBe(false);
  });
});

describe("quiz progress", () => {
  const ids = ["q1", "q2", "q3"];

  it("resumes at the next question with misses and re-queues kept", () => {
    const s = memory();
    const k = quizKey("c", "t-x");
    let quiz: QuizSession = { queue: ids, retried: [], missed: [] };
    quiz = afterAnswer(quiz, false, true);
    writeQuiz(s, k, quiz);
    expect(readQuiz(s, k, ids)).toEqual({ queue: ["q2", "q3", "q1"], retried: ["q1"], missed: ["q1"] });
  });

  it("drops a right answer from the front without re-queueing", () => {
    expect(afterAnswer({ queue: ids, retried: [], missed: [] }, true, false)).toEqual({ queue: ["q2", "q3"], retried: [], missed: [] });
  });

  it("forgets the quiz when it is finished or cleared", () => {
    const s = memory();
    const k = quizKey("c", "t-x");
    writeQuiz(s, k, { queue: [], retried: [], missed: [] });
    expect(readQuiz(s, k, ids)).toBeNull();
    writeQuiz(s, k, { queue: ["q2"], retried: [], missed: [] });
    clearQuiz(s, k);
    expect(readQuiz(s, k, ids)).toBeNull();
  });

  it("ignores questions the lesson no longer has and corrupt data", () => {
    const s = memory();
    s.setItem("k", JSON.stringify({ queue: ["gone", "q3"], retried: ["gone"], missed: [] }));
    expect(readQuiz(s, "k", ids)).toEqual({ queue: ["q3"], retried: [], missed: [] });
    s.setItem("k", "{not json");
    expect(readQuiz(s, "k", ids)).toBeNull();
  });
});
