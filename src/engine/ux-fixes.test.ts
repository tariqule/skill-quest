import { describe, expect, it, beforeEach } from "vitest";
import { getCourse } from "@/courses";
import { pickContinue, rememberLesson, recentLessons, type LastLesson } from "./last-opened";
import { planLevelOptions } from "./levels";
import { questStars } from "./game";
import { secondsFor } from "./timing";
import type { Question } from "./types";
import { blankPlaceholder } from "@/components/QuestionCard";
import { reviewLabel } from "@/components/home/Today";

const L = (courseId: string, at: number): LastLesson => ({ courseId, lessonId: "x", title: "t", at });

describe("Continue target", () => {
  const recent = [L("code-react", 30), L("aws-saa-c03", 20), L("aws-clf-c02", 10)];
  it("prefers the newest lesson inside the plan's courses", () => {
    expect(pickContinue(recent, ["aws-clf-c02", "aws-saa-c03"])?.courseId).toBe("aws-saa-c03");
  });
  it("falls back to the newest anywhere with no plan or nothing opened in plan courses", () => {
    expect(pickContinue(recent, null)?.courseId).toBe("code-react");
    expect(pickContinue(recent, ["code-go"])?.courseId).toBe("code-react");
    expect(pickContinue([], ["code-go"])).toBeNull();
  });

  describe("storage", () => {
    beforeEach(() => {
      const m = new Map<string, string>();
      globalThis.localStorage = { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), clear: () => m.clear(), key: () => null, length: 0 } as Storage;
    });
    it("keeps the last lesson per course, newest first", () => {
      rememberLesson({ courseId: "a", lessonId: "1", title: "A1" }, 1);
      rememberLesson({ courseId: "b", lessonId: "1", title: "B1" }, 2);
      rememberLesson({ courseId: "a", lessonId: "2", title: "A2" }, 3);
      expect(recentLessons().map((l) => `${l.courseId}/${l.lessonId}`)).toEqual(["a/2", "b/1"]);
    });
  });
});

describe("plan builder levels", () => {
  it("gives certifications two clearly named levels", () => {
    expect(planLevelOptions({ kind: "exam" } as never).map((l) => l.name)).toEqual(["New to this", "I know the basics"]);
  });
  it("keeps seniority levels for code tracks, without Everything", () => {
    const names = planLevelOptions(getCourse("code-react")!).map((l) => l.id);
    expect(names).toEqual(["beginner", "junior", "intermediate", "senior", "staff"]);
  });
});

describe("quest stars", () => {
  const course = getCourse("aws-saa-c03")!;
  it("gives no stars when the player runs out of hearts, whatever the score", () => {
    expect(questStars(course, { correct: 1, total: 4, failed: true })).toBe(0);
    expect(questStars(course, { correct: 4, total: 4, failed: true })).toBe(0);
  });
  it("scales with accuracy otherwise", () => {
    expect(questStars(course, { correct: 10, total: 10, failed: false })).toBe(3);
    expect(questStars(course, { correct: 0, total: 10, failed: false })).toBe(0);
  });
});

describe("timed drill seconds", () => {
  const base = { id: "q", domain: "d1", prompt: "Short?", explanation: "" };
  it("gives single choice 20 s and slower types 45 to 60 s", () => {
    expect(secondsFor({ ...base, options: ["a", "b"], answer: [0] } as Question)).toBe(20);
    expect(secondsFor({ ...base, type: "order", items: ["a", "b", "c"] } as Question)).toBe(50);
    expect(secondsFor({ ...base, type: "match", pairs: [["a", "b"]] } as Question)).toBe(50);
    expect(secondsFor({ ...base, type: "lines", code: "x", answer: [1] } as Question)).toBe(45);
  });
  it("adds time for long questions, within a cap", () => {
    const long = "word ".repeat(200);
    expect(secondsFor({ ...base, prompt: long, options: ["a", "b"], answer: [0] } as Question)).toBe(40);
    expect(secondsFor({ ...base, prompt: long, type: "order", items: ["a"] } as Question)).toBe(60);
  });
  it("gives every question in every course at least 20 s", () => {
    for (const id of ["code-java", "aws-saa-c03"]) for (const q of getCourse(id)!.questions) expect(secondsFor(q)).toBeGreaterThanOrEqual(20);
  });
});

describe("labels", () => {
  it("uses Choose… placeholders for blanks", () => {
    expect(blankPlaceholder(1, 1)).toBe("Choose…");
    expect(blankPlaceholder(2, 3)).toBe("Blank 2: choose…");
  });
  it("labels the review session as due + new, matching /daily's queue length", () => {
    expect(reviewLabel({ total: 15, due: 7, fresh: 8 })).toBe("15 (7 due + 8 new)");
    expect(reviewLabel({ total: 4, due: 4, fresh: 0 })).toBe("4 due");
  });
});
