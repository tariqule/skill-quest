import { describe, expect, it } from "vitest";
import { COURSES } from "@/courses";
import { SCENARIOS, scenariosFor } from "@/scenarios";
import { validateScenarios } from "./scenario-validate";
import { chainPaths, chainShare, gradeFor, interviewShare, matcherRight, scoreArch, type ArchItem, type ChainItem, type InterviewItem, type MatcherItem } from "./scenarios";

const byId = new Map(COURSES.map((c) => [c.id, c]));

describe("scenario content", () => {
  for (const [courseId, items] of Object.entries(SCENARIOS)) {
    it(`${courseId}: every item is valid and teaches before testing`, () => {
      const course = byId.get(courseId);
      expect(course, `unknown course ${courseId}`).toBeTruthy();
      expect(validateScenarios(courseId, items, new Set(Object.values(course!.lessons).flat().map((l) => l.id)))).toEqual([]);
    });
  }

  it("covers the courses each game was promised for", () => {
    for (const c of ["aws-saa-c03", "aws-dva-c02", "aws-dva-c03", "aws-aif-c01", "aws-clf-c02", "azure-ai-901", "gcp-genai-leader", "cncf-kcna", "code-system-design"]) {
      expect(scenariosFor(c, "architect").length, c).toBeGreaterThanOrEqual(4);
    }
    for (const c of ["aws-saa-c03", "aws-dva-c02", "aws-dva-c03", "aws-aif-c01", "aws-clf-c02", "azure-ai-901", "gcp-genai-leader", "cncf-kcna", "code-system-design"]) {
      expect(scenariosFor(c, "chain").length, c).toBeGreaterThanOrEqual(2);
      expect(scenariosFor(c, "matcher").length, c).toBeGreaterThanOrEqual(3);
    }
    for (const c of COURSES.filter((x) => x.id.startsWith("code-"))) expect(scenariosFor(c.id, "interview").length, c.id).toBeGreaterThanOrEqual(6);
  });
});

const arch: ArchItem = {
  type: "architect",
  id: "a",
  lesson: "l",
  title: "t",
  requirements: ["r1", "r2"],
  slots: [{ id: "x", label: "X" }, { id: "y", label: "Y" }],
  tiles: [{ id: "a", label: "A", why: "w" }, { id: "b", label: "B", why: "w" }, { id: "c", label: "C", why: "w" }],
  solutions: [{ x: "a", y: "b" }, { x: "c", y: "b" }],
};

describe("Architecture Builder scoring", () => {
  it("accepts any listed solution", () => {
    expect(scoreArch(arch, { x: "a", y: "b" }).correct).toBe(true);
    expect(scoreArch(arch, { x: "c", y: "b" }).correct).toBe(true);
  });
  it("scores partial designs against the closest solution", () => {
    const s = scoreArch(arch, { x: "c", y: "a" });
    expect(s.correct).toBe(false);
    expect(s.right).toEqual(["x"]);
    expect(s.solution).toEqual({ x: "c", y: "b" });
  });
  it("treats empty slots as wrong", () => expect(scoreArch(arch, {}).right).toEqual([]));
  it("validator rejects a solution with an unknown tile and no distractors", () => {
    const bad = { ...arch, tiles: arch.tiles.slice(0, 2), solutions: [{ x: "a", y: "zz" }] };
    const errs = validateScenarios("c", [bad], new Set(["l"]));
    expect(errs.some((e) => e.includes("unknown tile"))).toBe(true);
    expect(errs.some((e) => e.includes("distractors"))).toBe(true);
  });
});

const chain: ChainItem = {
  type: "chain",
  id: "c",
  lesson: "l",
  title: "t",
  intro: "i",
  start: "a",
  steps: {
    a: { situation: "A", choices: [{ text: "good", best: true, why: "y", next: "b" }, { text: "bad one", best: false, why: "y", next: "d" }] },
    d: { situation: "D", choices: [{ text: "fix", best: true, why: "y", next: "b" }, { text: "ignore", best: false, why: "y", next: "b" }] },
    b: { situation: "B", choices: [{ text: "end", best: true, why: "y", next: "e" }, { text: "stop", best: false, why: "y", next: "e" }] },
    e: { situation: "E", choices: [{ text: "ok", best: true, why: "y" }, { text: "nah", best: false, why: "y" }] },
  },
};

describe("Scenario Chains", () => {
  it("enumerates every path", () => {
    expect(new Set(chainPaths(chain).map((p) => p.join("")))).toEqual(new Set(["abe", "adbe"]));
  });
  it("accepts a well-formed chain", () => expect(validateScenarios("c", [chain], new Set(["l"]))).toEqual([]));
  it("flags cycles, short paths, two bests and the longest-option giveaway", () => {
    const cyc: ChainItem = { ...chain, steps: { ...chain.steps, e: { situation: "E", choices: [{ text: "ok", best: true, why: "y", next: "a" }, { text: "nah", best: false, why: "y" }] } } };
    expect(validateScenarios("c", [cyc], new Set(["l"])).some((e) => e.includes("cycle"))).toBe(true);
    const short: ChainItem = { ...chain, steps: { ...chain.steps, a: { situation: "A", choices: [{ text: "good", best: true, why: "y", next: "e" }, { text: "bad", best: false, why: "y", next: "e" }] } } };
    expect(validateScenarios("c", [short], new Set(["l"])).some((e) => e.includes("decisions"))).toBe(true);
    const two: ChainItem = { ...chain, steps: { ...chain.steps, e: { situation: "E", choices: [{ text: "ok", best: true, why: "y" }, { text: "nah", best: true, why: "y" }] } } };
    expect(validateScenarios("c", [two], new Set(["l"])).some((e) => e.includes("exactly one best"))).toBe(true);
    const long: ChainItem = { ...chain, steps: { ...chain.steps, e: { situation: "E", choices: [{ text: "a very long obviously right answer", best: true, why: "y" }, { text: "no", best: false, why: "y" }] } } };
    expect(validateScenarios("c", [long], new Set(["l"])).some((e) => e.includes("giveaway"))).toBe(true);
  });
  it("scores the share of best choices", () => {
    expect(chainShare([])).toBe(0);
    expect(chainShare([{ text: "", best: true, why: "" }, { text: "", best: false, why: "" }])).toBe(0.5);
  });
});

describe("Mock Interview", () => {
  const it0: InterviewItem = { type: "interview", kind: "technical", id: "i", lesson: "l", title: "t", prompt: "p", minutes: 3, rubric: [{ name: "a", good: "" }, { name: "b", good: "" }, { name: "c", good: "" }], keyPoints: ["1", "2", "3", "4"], model: "m" };
  it("weights rubric marks and key points", () => {
    expect(interviewShare(it0, [2, 2, 2], 4)).toBe(1);
    expect(interviewShare(it0, [0, 0, 0], 0)).toBe(0);
    expect(interviewShare(it0, [1, 1, 1], 2)).toBeCloseTo(14 / 28);
    expect(interviewShare(it0, [5, 9, 9], 99)).toBe(1);
  });
  it("behavioral prompts may skip a lesson; technical ones may not", () => {
    expect(validateScenarios("c", [{ ...it0, kind: "behavioral", lesson: undefined, model: "x".repeat(90) }], new Set())).toEqual([]);
    expect(validateScenarios("c", [{ ...it0, lesson: undefined, model: "x".repeat(90) }], new Set()).some((e) => e.includes("lesson"))).toBe(true);
  });
});

describe("Service Matcher", () => {
  const m: MatcherItem = { type: "matcher", id: "m", lesson: "l", title: "t", mode: "clouds", prompt: "p", leftLabel: "L", rightLabel: "R", pairs: [["a", "1"], ["b", "2"], ["c", "3"]], sources: [{ title: "s", url: "https://x", license: "x" }] };
  it("marks each pair", () => expect(matcherRight(m, { 0: 0, 1: 2, 2: 1 })).toEqual([true, false, false]));
  it("rejects ambiguous right-hand items and unsourced cross-cloud facts", () => {
    const errs = validateScenarios("c", [{ ...m, pairs: [["a", "1"], ["b", "1"], ["c", "3"]], sources: [] }], new Set(["l"]));
    expect(errs.some((e) => e.includes("ambiguous"))).toBe(true);
    expect(errs.some((e) => e.includes("official source"))).toBe(true);
  });
});

describe("grading", () => {
  it("maps scores to review grades", () => {
    expect(gradeFor(0.3)).toBe("again");
    expect(gradeFor(0.6)).toBe("hard");
    expect(gradeFor(0.8)).toBe("good");
    expect(gradeFor(1)).toBe("easy");
  });
});

describe("Daily Review keys", () => {
  it("round-trips scenario keys", async () => {
    const { itemKey, parseKey } = await import("./srs");
    expect(parseKey(itemKey("aws-saa-c03", "sc", "arch-saa-web-ha"))).toEqual({ courseId: "aws-saa-c03", kind: "sc", id: "arch-saa-web-ha" });
  });
});
