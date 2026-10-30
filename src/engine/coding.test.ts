import { describe, expect, it } from "vitest";
import { COURSES } from "@/courses";
import { runLocally, summarize } from "./coding";

const CHALLENGES = COURSES.flatMap((c) => (c.coding ?? []).filter((x) => (x.language ?? "js") === "js").map((x) => [`${c.id}/${x.id}`, x] as const));

describe("runner", () => {
  it("reports a missing function, thrown errors, and wrong answers", async () => {
    const tests = [{ args: [2], expected: 4 }];
    expect((await runLocally("const x = 1;", "dbl", tests)).error).toMatch(/Define a function named dbl/);
    expect((await runLocally("function dbl(n){ throw new Error('boom'); }", "dbl", tests)).results[0].error).toMatch(/boom/);
    expect(summarize(await runLocally("function dbl(n){ return n+1 }", "dbl", tests)).allPassed).toBe(false);
    expect(summarize(await runLocally("function dbl(n){ return n*2 }", "dbl", tests)).allPassed).toBe(true);
  });

  it("compares sets, maps, nested data, and special values", async () => {
    const code = "function f(){ return { s: new Set([1,2]), m: new Map([['a',[1]]]), n: NaN, u: undefined }; }";
    const r = await runLocally(code, "f", [{ args: [], expected: { s: { $set: [1, 2] }, m: { $map: [["a", [1]]] }, n: "$NaN", u: "$undefined" } }]);
    expect(r.results[0].ok).toBe(true);
  });
});

describe.each(CHALLENGES)("%s", (_, c) => {
  it("reference solution passes every test", async () => {
    const r = await runLocally(c.solution, c.fn, c.tests);
    const failed = r.results.filter((t) => !t.ok).map((t) => `${t.name}: got ${t.got} expected ${t.expected} ${t.error ?? ""}`);
    expect(r.error).toBeUndefined();
    expect(failed).toEqual([]);
  });

  it("starter does not already pass", async () => {
    const r = await runLocally(c.starter, c.fn, c.tests);
    expect(summarize(r).allPassed).toBe(false);
  });
});
