import { describe, expect, it } from "vitest";
import { COURSES } from "@/courses";
import { codeGameOf } from "./code-games";
import { checkItem, runtimeAvailable, runtimeFor } from "./code-games-runner";
import { isCodeTrack } from "./tracks";
import type { Question } from "./types";

/**
 * Every code-game item marked verified: "run" is executed here on the real runtime (node, the TypeScript
 * compiler + node, python3, go, sqlite via python3, bash + git, java). A missing runtime skips that
 * language. Items marked "reasoned" have no runtime on the box and are checked by review instead.
 */
const tracks = COURSES.filter(isCodeTrack);

for (const course of tracks) {
  const items = course.questions.filter((q): q is Question => !!codeGameOf(q) && (q as { verified?: string }).verified === "run");
  if (items.length === 0) continue;
  const rts = [...new Set(items.map((q) => runtimeFor(q.codeLang)))];
  const missing = rts.filter((r) => !r || !runtimeAvailable(r));
  describe.skipIf(missing.length === rts.length)(`${course.id} code games run`, () => {
    it.each(items.map((q) => [q.id, q] as const))("%s", (_id, q) => {
      const r = checkItem(q);
      if (r.skipped) return;
      expect(r.problems).toEqual([]);
    }, 120_000);
  });
}

describe("code games verification markers", () => {
  it("every runnable item in a language with a runner is marked run, others reasoned", () => {
    const bad: string[] = [];
    for (const c of tracks)
      for (const q of c.questions) {
        if (!codeGameOf(q) || q.type === "output" && !(q as { verified?: string }).verified) continue;
        const v = (q as { verified?: string }).verified;
        if (v !== "run" && v !== "reasoned") bad.push(`${q.id}: missing verified`);
        if (v === "run" && !runtimeFor(q.codeLang)) bad.push(`${q.id}: marked run but ${q.codeLang} has no runner`);
      }
    expect(bad).toEqual([]);
  });
});
