import { describe, expect, it } from "vitest";
import { progress } from "./fixtures";
import { migrateLessonIds } from "./migration";

const M = { version: 1, aliases: { old1: "new1", old2: "new1" } };

describe("migrateLessonIds", () => {
  it("renames finished and studied lessons, deduping while keeping finish order", () => {
    const p = { ...progress(["x", "old1", "new1", "old2", "y"]), studied: ["old2"] };
    const out = migrateLessonIds(p, M);
    expect(out.lessonsDone).toEqual(["x", "new1", "y"]);
    expect(out.studied).toEqual(["new1"]);
    expect(out.lessonIdVersion).toBe(1);
  });

  it("doesn't mutate its input", () => {
    const p = progress(["old1"]);
    migrateLessonIds(p, M);
    expect(p.lessonsDone).toEqual(["old1"]);
    expect(p.lessonIdVersion).toBeUndefined();
  });

  it("is idempotent and returns the same object once applied", () => {
    const once = migrateLessonIds(progress(["old1"]), M);
    expect(migrateLessonIds(once, M)).toBe(once);
  });

  it("skips progress already at a newer version", () => {
    const p = { ...progress(["old1"]), lessonIdVersion: 2 };
    expect(migrateLessonIds(p, M)).toBe(p);
  });

  it("runs a later version over earlier-migrated progress", () => {
    const v1 = migrateLessonIds(progress(["old1"]), M);
    const v2 = migrateLessonIds(v1, { version: 2, aliases: { new1: "newer" } });
    expect(v2.lessonsDone).toEqual(["newer"]);
    expect(v2.lessonIdVersion).toBe(2);
  });

  it("handles empty progress", () => {
    expect(migrateLessonIds(progress([]), M).lessonsDone).toEqual([]);
  });
});
