import { describe, expect, it } from "vitest";
import { TOPICS, progress, seeded } from "./fixtures";
import { courseMap, startHereLessons } from "./map";

const LESSONS = new Set(["a", "old-b", "c", "e"]);
const states = (lessonsDone: string[]) =>
  courseMap(TOPICS, LESSONS, progress(lessonsDone)).modules.flatMap((m) => m.topics.map((t) => `${t.label}:${t.topic.id}:${t.state}`));

describe("courseMap", () => {
  it("numbers topics within modules and marks the first open one current", () => {
    expect(states([])).toEqual(["1-1:a:current", "1-2:b:locked", "1-3:c:locked", "2-1:d:planned", "2-2:e:open"]);
  });

  it("opens a topic through its stand-in lesson and moves current along", () => {
    const map = courseMap(TOPICS, LESSONS, progress(["a"]));
    expect(map.current?.topic.id).toBe("b");
    expect(map.current?.lesson).toBe("old-b");
    expect(map.modules[0].done).toBe(1);
    expect(map.done).toBe(1);
    expect(map.total).toBe(5);
  });

  it("names the missing prerequisites of a locked topic", () => {
    const c = courseMap(TOPICS, LESSONS, progress([])).modules[0].topics[2];
    expect(c.needs.map((t) => t.id)).toEqual(["b"]);
  });

  it("has at most one current topic, and it is never locked or planned, for any progress", () => {
    const ids = ["a", "old-b", "c", "e"];
    for (let seed = 1; seed <= 200; seed++) {
      const r = seeded(seed);
      const done = ids.filter(() => r() < 0.5);
      const map = courseMap(TOPICS, LESSONS, progress(done));
      const all = map.modules.flatMap((m) => m.topics);
      expect(all.filter((t) => t.state === "current").length).toBeLessThanOrEqual(1);
      expect(all.filter((t) => t.state === "done")).toHaveLength(map.done);
      if (map.current) expect(map.current.needs).toEqual([]);
    }
  });

  it("starts beginners on the written lessons of the first module", () => {
    expect(startHereLessons(TOPICS, LESSONS)).toEqual(["a", "c"]);
    expect(startHereLessons([], LESSONS)).toEqual([]);
  });
});
