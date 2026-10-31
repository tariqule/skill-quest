import { describe, expect, it } from "vitest";
import { checkItem } from "@/engine/code-games-runner";
import type { OutputQuestion } from "@/engine/types";
import course from ".";

/** Every "type the output" item is executed: the snippet must print exactly its first accepted answer. */
const items = [...course.questions, ...(course.practice ?? [])].filter((q): q is OutputQuestion => q.type === "output");

describe("code-system-design predict-output items", () => {
  it("are all marked run", () => {
    expect(items.filter((q) => q.verified !== "run").map((q) => q.id)).toEqual([]);
  });
  it.each(items.map((q) => [q.id, q] as const))("%s prints its answer", (_id, q) => {
    const r = checkItem(q);
    expect(r.skipped).toBeFalsy();
    expect(r.problems).toEqual([]);
  }, 60_000);
});
