import { describe, expect, it } from "vitest";
import { COURSES } from "@/courses";
import { SCENARIOS, scenariosFor } from "@/scenarios";
import { validateScenarios } from "./scenario-validate";
import { withResult, playedCounts } from "./scenario-progress";
import { DEFAULT_CONFIG } from "./config";
import { chainPaths, chainShare, gameText, gradeFor, plural, scenarioXp, timerLabel, MASTERED_AT, interviewShare, matcherRight, scoreArch, type ArchItem, type ChainItem, type InterviewItem, type MatcherItem } from "./scenarios";

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
    d: { situation: "You went with “bad one”. D", consequenceOf: "bad one", choices: [{ text: "fix", best: true, why: "y", next: "b" }, { text: "ignore", best: false, why: "y", next: "b" }] },
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
  it("requires consequence steps to name their one parent choice and rejoin steps to be choice-neutral", () => {
    const v = (c: ChainItem) => validateScenarios("c", [c], new Set(["l"]));
    const unnamed: ChainItem = { ...chain, steps: { ...chain.steps, d: { ...chain.steps.d, situation: "D" } } };
    expect(v(unnamed).some((e) => e.includes("must name its parent choice"))).toBe(true);
    const unmarked: ChainItem = { ...chain, steps: { ...chain.steps, d: { ...chain.steps.d, consequenceOf: undefined } } };
    expect(v(unmarked).some((e) => e.includes("isn't marked as its consequence"))).toBe(true);
    const shared: ChainItem = { ...chain, steps: { ...chain.steps, a: { situation: "A", choices: [{ text: "good", best: true, why: "y", next: "b" }, { text: "bad one", best: false, why: "y", next: "d" }, { text: "bad two", best: false, why: "y", next: "d" }] } } };
    expect(v(shared).some((e) => e.includes("exactly one parent choice"))).toBe(true);
    const biased: ChainItem = { ...chain, steps: { ...chain.steps, b: { ...chain.steps.b, situation: "You deleted the file, and now B" } } };
    expect(v(biased).some((e) => e.includes("rejoin step"))).toBe(true);
  });
  it("every real chain routes each weak pick to a step that names it (DVA GSI regression)", () => {
    for (const c of Object.keys(SCENARIOS)) {
      for (const x of scenariosFor(c, "chain") as ChainItem[]) {
        for (const [, st] of Object.entries(x.steps))
          for (const ch of st.choices.filter((k) => !k.best && k.next)) {
            const nxt = x.steps[ch.next!];
            if (nxt.consequenceOf !== undefined) expect(nxt.situation, `${c}/${x.id}`).toContain(`“${ch.text}”`);
          }
        const s2 = x.steps.s2;
        for (const ch of s2?.choices.filter((k) => !k.best) ?? []) expect(x.steps[ch.next!].consequenceOf, `${c}/${x.id}`).toBe(ch.text);
      }
    }
    const dva = scenariosFor("aws-dva-c02", "chain").find((x) => x.id === "chain-dva-throttle") as ChainItem | undefined;
    expect(dva).toBeTruthy();
    {
      const gsi = dva!.steps.s2.choices.find((k) => k.text.includes("global secondary index"))!;
      expect(dva!.steps[gsi.next!].situation).not.toMatch(/strongly consistent/i);
    }
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

describe("scenario polish", () => {
  it("pluralises the chain summary", () => {
    expect(plural(1, "strong call")).toBe("1 strong call");
    expect(plural(0, "strong call")).toBe("0 strong calls");
    expect(plural(3, "decision")).toBe("3 decisions");
  });
  it("only says Time's up when the clock actually ran out", () => {
    expect(timerLabel(0, false, "0:00")).toBe("Time's up");
    expect(timerLabel(0, true, "0:00")).toBe("Time's up");
    expect(timerLabel(95, true, "1:35")).toBe("Stopped at 1:35");
    expect(timerLabel(95, false, "1:35")).toBe("1:35");
  });
  it("counts every completion as played, whatever the score, and mastery separately", () => {
    let r = withResult({}, "c:a", 0.67);
    r = withResult(r, "c:b", 0.75);
    r = withResult(r, "c:a", 0.5);
    expect(r["c:a"]).toEqual({ plays: 2, best: 0.67, last: 0.5 });
    expect(playedCounts(r, "c", ["a", "b", "x"], MASTERED_AT)).toEqual({ played: 2, mastered: 1 });
    expect(playedCounts(withResult({}, "c:z", 0), "c", ["z"], MASTERED_AT)).toEqual({ played: 1, mastered: 0 });
  });
  it("awards XP scaled by score, never zero for a completion", () => {
    const base = DEFAULT_CONFIG.xp.scenarioComplete;
    expect(base).toBeGreaterThan(0);
    expect(scenarioXp(base, 1)).toBe(base);
    expect(scenarioXp(20, 0.67)).toBe(13);
    expect(scenarioXp(20, 0)).toBe(1);
    expect(scenarioXp(20, 1.5)).toBe(20);
  });
  it("words the matcher description for the course's own items", () => {
    const sd = gameText("matcher", scenariosFor("code-system-design", "matcher")).blurb;
    expect(sd).toMatch(/building block/);
    expect(sd).not.toMatch(/^Match equivalent services across clouds/);
    const k8s = gameText("matcher", scenariosFor("cncf-kcna", "matcher").filter((m) => m.type === "matcher" && m.mode === "usecase"));
    expect(k8s.blurb).toBe("Match each need to the right object.");
    expect(k8s.rule).not.toMatch(/providers/);
    for (const c of Object.keys(SCENARIOS)) {
      const items = scenariosFor(c, "matcher");
      if (items.length) expect(gameText("matcher", items).blurb, c).not.toMatch(/undefined/);
    }
  });
});
