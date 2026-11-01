import { describe, expect, it } from "vitest";
import { COURSES } from "@/courses";
import { buildPath } from "./path";
import { INITIAL_PROGRESS, type Progress } from "./store";

const course = COURSES.find((c) => c.id === "aws-saa-c03")!;
const progress = (lessonsDone: string[], level: Progress["level"] = "all"): Progress => ({ ...INITIAL_PROGRESS, level, lessonsDone });

describe("buildPath world counts", () => {
  it("counts the same lesson tiles the map lists, optional basics included", () => {
    const first = buildPath(course, progress([])).worlds[0];
    const tiles = first.nodes.filter((n) => n.type === "lesson");
    expect(first.lessonsTotal).toBe(tiles.length);
    const optional = tiles.find((n) => n.optional) ?? tiles[0];
    const after = buildPath(course, progress([optional.key])).worlds[0];
    expect(after.lessonsDone).toBe(1);
    expect(after.nodes.find((n) => n.key === optional.key)?.state).toBe("done");
  });
  it("has exactly one Up next tile", () => {
    const all = buildPath(course, progress([])).worlds.flatMap((w) => w.nodes);
    expect(all.filter((n) => n.state === "current")).toHaveLength(1);
  });
});
