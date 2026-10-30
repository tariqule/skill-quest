import { describe, expect, it } from "vitest";
import { dueCount, interleaveDue, isDue, itemKey, migrateProgress, newRecord, parseKey, review, type SrsState } from "./srs";

const NOW = new Date("2026-10-30T12:00:00Z");
const DAY = 86_400_000;

describe("srs", () => {
  it("round-trips item keys", () => {
    expect(parseKey(itemKey("aws-aif-c01", "q", "d2-05"))).toEqual({ courseId: "aws-aif-c01", kind: "q", id: "d2-05" });
    expect(parseKey("junk")).toBeNull();
  });

  it("new items are due now, and Good pushes them into the future", () => {
    const r = newRecord(NOW);
    expect(isDue(r, NOW)).toBe(true);
    const next = review(r, "good", NOW);
    expect(isDue(next, NOW)).toBe(false);
    expect(next.reps).toBe(1);
  });

  it("intervals grow with repeated Good answers and Easy beats Good", () => {
    let r = review(undefined, "good", NOW);
    r = review(r, "good", new Date(r.due));
    const second = new Date(r.due).getTime() - NOW.getTime();
    r = review(r, "good", new Date(r.due));
    expect(new Date(r.due).getTime() - NOW.getTime()).toBeGreaterThan(second);
    const easy = review(undefined, "easy", NOW);
    const good = review(undefined, "good", NOW);
    expect(new Date(easy.due).getTime()).toBeGreaterThan(new Date(good.due).getTime());
  });

  it("Again after a learned card counts a lapse and brings it back soon", () => {
    let r = review(undefined, "easy", NOW);
    const at = new Date(r.due);
    r = review(r, "again", at);
    expect(r.lapses).toBe(1);
    expect(new Date(r.due).getTime() - at.getTime()).toBeLessThan(DAY);
  });

  it("does not mutate the input record", () => {
    const r = newRecord(NOW);
    const copy = { ...r };
    review(r, "good", NOW);
    expect(r).toEqual(copy);
  });

  it("migrates missed questions (due now) and Leitner cards, skipping existing items", () => {
    const existing: SrsState = { [itemKey("c", "q", "q2")]: review(undefined, "good", NOW) };
    const out = migrateProgress("c", { questions: { q1: { lastCorrect: false }, q2: { lastCorrect: false }, q3: { lastCorrect: true } }, cards: { k1: 1, k5: 5 } }, existing, NOW);
    expect(Object.keys(out).sort()).toEqual(["c:card:k1", "c:card:k5", "c:q:q1"]);
    expect(isDue(out["c:q:q1"], NOW)).toBe(true);
    expect(new Date(out["c:card:k5"].due).getTime()).toBeGreaterThan(new Date(out["c:card:k1"].due).getTime());
  });

  it("interleaves due items across active courses, most overdue first, and caps the session", () => {
    const at = (days: number) => ({ ...newRecord(NOW), due: new Date(NOW.getTime() - days * DAY).toISOString() });
    const state: SrsState = {
      "a:q:1": at(1),
      "a:q:2": at(3),
      "a:q:3": at(2),
      "b:card:x": at(1),
      "c:card:y": at(9),
      "a:q:future": { ...newRecord(NOW), due: new Date(NOW.getTime() + DAY).toISOString() },
    };
    expect(interleaveDue(state, NOW, ["a", "b"])).toEqual(["a:q:2", "b:card:x", "a:q:3", "a:q:1"]);
    expect(interleaveDue(state, NOW, ["a", "b"], 2)).toEqual(["a:q:2", "b:card:x"]);
    expect(dueCount(state, NOW, ["a", "b", "c"])).toBe(5);
  });
});
