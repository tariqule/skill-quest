import { describe, expect, it } from "vitest";
import { effortLine, levelRingDash, paceCopy, reviewFirst, streakLabel, totalMinutes } from "./today-model";

describe("today-model", () => {
  it("puts review first and keeps the rest in order", () => {
    const items = [{ kind: "lesson" as const, id: 1 }, { kind: "practice" as const, id: 2 }, { kind: "review" as const, id: 3 }];
    expect(reviewFirst(items).map((i) => i.id)).toEqual([3, 1, 2]);
  });
  it("never shows a zero or broken streak", () => {
    expect(streakLabel(0)).toBeNull();
    expect(streakLabel(-1)).toBeNull();
    expect(streakLabel(NaN)).toBeNull();
    expect(streakLabel(4)).toBe("4-day streak");
  });
  it("praises effort, not talent", () => {
    for (const s of [effortLine(0, 10), effortLine(3, 10), effortLine(10, 10), effortLine(0, 0)]) {
      expect(s).not.toMatch(/smart|genius|talent|natural/i);
    }
    expect(effortLine(9, 10)).toContain("1 lesson to go");
  });
  it("frames being behind as a suggestion, with no loss words", () => {
    const p = paceCopy(10, 40, false);
    expect(p.tone).toBe("nudge");
    expect(`${p.line} ${p.pace}`).not.toMatch(/\b(fail|behind|lose|lost|miss)/i);
    expect(paceCopy(null, 0, false).tone).toBe("neutral");
    expect(paceCopy(-2, 0, false).line).toMatch(/new one/);
    expect(paceCopy(1, 90, true).line).toBe("1 day to go");
  });
  it("clamps the ring and sums minutes", () => {
    expect(levelRingDash(2, 10).split(" ")[0]).toBe(levelRingDash(1, 10).split(" ")[0]);
    expect(levelRingDash(NaN, 10).startsWith("0.00")).toBe(true);
    expect(totalMinutes([{ minutes: 5 }, { minutes: 10 }])).toBe(15);
  });
});
