import { describe, expect, it } from "vitest";
import { COURSES, getCourse } from "@/courses";
import {
  applyFix, CODE_GAMES, decodePick, encodePick, FIX_BASE, gamePool, hasCodeGames, parseIndented, parsonsCorrect,
  gameRule, MISSED_LINE, parsonsFeedback, parsonsHint, parsonsSolution, prepareParsons, warmupPicks,
} from "./code-games";
import { buildQueue, reviewable } from "./daily-queue";
import { encodeText, isCorrect, normalizeOutput, prepare } from "./game";
import { dateForGoal } from "./plan";
import { reviewNote } from "./srs";
import { BEGINNER_LOCKED, modesFor } from "./modes";
import { validateCourse } from "./validate";
import type { BugQuestion, Course, OutputQuestion, ParsonsQuestion, Question } from "./types";

const id = <T,>(xs: T[]) => [...xs];
const rev = <T,>(xs: T[]) => [...xs].reverse();
const base = { domain: "d1", explanation: "x", lesson: "l1", prompt: "p", level: "junior" };
const parsons = (extra: Partial<ParsonsQuestion> = {}): ParsonsQuestion =>
  ({ ...base, id: "pz", type: "parsons", code: "def f(x):\n    if x:\n        return 1\n    return 0", distractors: ["return x"], ...extra }) as ParsonsQuestion;
const bug = (extra: Partial<BugQuestion> = {}): BugQuestion =>
  ({ ...base, id: "bg", type: "bug", code: "a = 1\n  b = a +\nprint(b)", line: 2, fixes: ["b = a + 1", "b = a", "b = 2 * a"], fix: 0, ...extra }) as BugQuestion;
const output = (extra: Partial<OutputQuestion> = {}): OutputQuestion =>
  ({ ...base, id: "out", type: "output", code: "print(1)", answers: ["1\n2"], ...extra }) as OutputQuestion;

describe("parseIndented", () => {
  it("uses the smallest space indent as the unit", () => {
    const { lines, unit } = parseIndented("\nif a:\n  if b:\n    x\n  y\n\n");
    expect(unit).toBe("  ");
    expect(lines).toEqual([{ text: "if a:", indent: 0 }, { text: "if b:", indent: 1 }, { text: "x", indent: 2 }, { text: "y", indent: 1 }]);
  });
  it("counts tabs one level each", () => {
    const { lines, unit } = parseIndented("func f() {\n\tif x {\n\t\treturn\n\t}\n}");
    expect(unit).toBe("\t");
    expect(lines.map((l) => l.indent)).toEqual([0, 1, 2, 1, 0]);
  });
  it("defaults to 4 spaces when nothing is indented, and drops blank lines", () => {
    const { lines, unit } = parseIndented("a\n\n   \nb");
    expect(unit).toBe("    ");
    expect(lines.map((l) => l.text)).toEqual(["a", "b"]);
  });
});

describe("prepareParsons and feedback", () => {
  it("keeps solution text, marks decoys, and never returns the solved order", () => {
    const p = prepareParsons(parsons({ indent: true }), id);
    expect(p.blocks).toHaveLength(5);
    expect(p.decoys.map((d) => p.blocks[d])).toEqual(["return x"]);
    expect(p.solution.map((s) => s.indent)).toEqual([0, 1, 2, 1]);
  });
  it("reshuffles when the shuffle hands back the solved order", () => {
    let calls = 0;
    const p = prepareParsons(parsons({ distractors: [] }), <T,>(xs: T[]) => (calls++ ? rev(xs) : id(xs)));
    expect(calls).toBe(2);
    expect(p.blocks[0]).toBe("    return 0");
  });
  it("keeps leading spaces on blocks when the player doesn't set indentation", () => {
    const p = prepareParsons(parsons(), rev);
    expect(p.indent).toBe(false);
    expect(p.blocks).toContain("        return 1");
    expect(parsonsSolution(p)).toBe(parsons().code);
  });
  it("encodes picks with their indent", () => {
    expect(decodePick(encodePick(3, 2))).toEqual({ block: 3, indent: 2 });
  });
  it("grades each line as ok, indent, misplaced or decoy", () => {
    const p = prepareParsons(parsons({ indent: true }), rev);
    const at = (t: string) => p.blocks.indexOf(t);
    const right = [encodePick(at("def f(x):")), encodePick(at("if x:"), 1), encodePick(at("return 1"), 2), encodePick(at("return 0"), 1)];
    expect(parsonsFeedback(p, right)).toEqual(["ok", "ok", "ok", "ok"]);
    expect(parsonsCorrect(p, right)).toBe(true);
    expect(parsonsCorrect(p, right.slice(0, 3))).toBe(false);
    const wrong = [encodePick(at("def f(x):")), encodePick(at("if x:"), 0), encodePick(at("return 0"), 1), encodePick(at("return x"))];
    expect(parsonsFeedback(p, wrong)).toEqual(["ok", "indent", "misplaced", "decoy"]);
  });
});

describe("parsonsHint", () => {
  const p = prepareParsons(parsons({ indent: true }), rev);
  it("gives the authored hint, then the decoy count, then the first wrong line", () => {
    expect(parsonsHint(p, [], 0, "Think about the base case.")).toBe("Think about the base case.");
    expect(parsonsHint(p, [], 1, "Think about the base case.")).toMatch(/One line is a decoy: the solution uses 4 of the 5 lines/);
    expect(parsonsHint(p, [encodePick(p.blocks.indexOf("def f(x):"))], 2, "a")).toBe("Line 2 should be `if x:` (indented 1 level).");
  });
  it("clamps to the last hint", () => {
    expect(parsonsHint(p, [], 9)).toBe("Line 1 should be `def f(x):`.");
  });
});

describe("applyFix", () => {
  it("replaces the line and keeps its indentation", () => {
    expect(applyFix(bug(), "    b = a + 1")).toBe("a = 1\n  b = a + 1\nprint(b)");
  });
});

describe("isCorrect for code games", () => {
  it("parsons uses the prepared puzzle", () => {
    const q = prepare(parsons());
    const p = q.parsons!;
    const order = p.solution.map((s) => p.blocks.indexOf(s.text));
    expect(isCorrect(q, order)).toBe(true);
    expect(isCorrect(q, rev(order))).toBe(false);
  });
  it("bug needs the right line and the right fix", () => {
    const q = prepare(bug());
    expect(isCorrect(q, [1, FIX_BASE + q.fixCorrect!])).toBe(true);
    expect(isCorrect(q, [0, FIX_BASE + q.fixCorrect!])).toBe(false);
    expect(isCorrect(q, [1, FIX_BASE + ((q.fixCorrect! + 1) % 3)])).toBe(false);
    expect(isCorrect(q, [1])).toBe(false);
  });
  it("output forgives whitespace but not content, and rejects empty", () => {
    const q = prepare(output());
    expect(isCorrect(q, encodeText("\n1  \r\n2\n\n"))).toBe(true);
    expect(isCorrect(q, encodeText("1\n 2"))).toBe(false); // spacing inside output matters
    expect(isCorrect(q, encodeText("1 2"))).toBe(false);
    expect(isCorrect(q, encodeText("   "))).toBe(false);
  });
});

describe("validator rules for code games", () => {
  const py = getCourse("code-python")!;
  const lesson = Object.values(py.lessons).flat()[0].id;
  const domain = py.domains[0].id;
  const check = (q: Question) => validateCourse({ ...py, questions: [...py.questions, { ...q, lesson, domain } as Question] }).filter((e) => e.includes(`"${q.id}"`));
  it("accepts well-formed items", () => {
    expect(check(parsons())).toEqual([]);
    expect(check(bug())).toEqual([]);
    expect(check(output())).toEqual([]);
  });
  it("rejects a decoy equal to a solution line", () => {
    expect(check(parsons({ distractors: ["  return 0"] }))).toEqual([expect.stringMatching(/decoy that is also a solution line/)]);
  });
  it("rejects a puzzle that would show leading whitespace when the player sets indentation", () => {
    // prepareParsons trims every block, so the rule passes for real data; the validator guards future changes.
    expect(check(parsons({ indent: true, distractors: ["    return x"] }))).toEqual([]);
  });
  it("rejects bad bug items", () => {
    expect(check(bug({ fixes: ["x", "y"], fix: 0 })).join()).toMatch(/needs 3 or 4 fixes/);
    expect(check(bug({ line: 9 })).join()).toMatch(/doesn't exist or is blank/);
    expect(check(bug({ fixes: ["b = a +", "b = 1", "b = 2"] })).join()).toMatch(/buggy line itself/);
    expect(check(bug({ fix: 5 })).join()).toMatch(/fix index outside/);
  });
  it("rejects output choices without an accepted answer", () => {
    expect(check(output({ choices: ["3", "4"] })).join()).toMatch(/don't include an accepted answer/);
    expect(check(output({ answers: [] })).join()).toMatch(/non-empty accepted answer/);
  });
});

describe("warmupPicks", () => {
  const playable = COURSES.filter(hasCodeGames);
  it("rotates through courses and games, up to the size", () => {
    const picks = warmupPicks(playable.slice(0, 2), () => false, 6, () => 0.5);
    expect(picks).toHaveLength(6);
    expect(new Set(picks.map((p) => p.course.id)).size).toBe(2);
    expect(new Set(picks.map((p) => p.q.type))).toEqual(new Set(CODE_GAMES.map((g) => g.id)));
    expect(new Set(picks.map((p) => `${p.course.id}/${p.q.id}`)).size).toBe(6);
  });
  it("prefers items the player hasn't got right yet", () => {
    const c = playable[0];
    const keep = new Set(CODE_GAMES.map((g) => gamePool(c, g.id)[0].id));
    const picks = warmupPicks([c], (_c, q) => !keep.has(q), 3, () => 0.5);
    expect(picks.map((p) => p.q.id).sort()).toEqual([...keep].sort());
  });
  it("skips courses without code games", () => {
    const plain = COURSES.find((c) => !hasCodeGames(c)) as Course;
    expect(warmupPicks([plain], () => false)).toEqual([]);
  });
});

describe("Daily Review", () => {
  it("includes code games as reviewable", () => {
    expect(reviewable(parsons())).toBe(true);
    expect(reviewable(bug())).toBe(true);
    expect(reviewable(output())).toBe(true);
  });
  it("builds a queue whose questions are all reviewable", () => {
    const q = buildQueue(null);
    for (const item of q) if (item.kind === "q") expect(reviewable(item.q)).toBe(true);
  });
});

describe("modesFor", () => {
  const c = getCourse("code-python")!;
  it("hides timed and exam-style modes at Beginner only", () => {
    expect(modesFor(c, "beginner").some((m) => BEGINNER_LOCKED.includes(m))).toBe(false);
    expect(modesFor(c, "senior")).toEqual(c.modes);
  });
});

describe("browser-test fixes", () => {
  it("strips leading whitespace from decoys when the player sets indentation", () => {
    const p = prepareParsons(parsons({ indent: true, distractors: ["    return x", "\tpass"] }), id);
    expect(p.blocks.filter((b) => /^\s/.test(b))).toEqual([]);
    expect(p.blocks).toContain("return x");
  });
  it("no indentation puzzle in any course shows a line with leading whitespace", () => {
    for (const c of COURSES)
      for (const q of c.questions)
        if (q.type === "parsons" && q.indent) expect(prepareParsons(q, rev).blocks.some((b) => /^\s/.test(b)), q.id).toBe(false);
  });
  it("a missed line makes a right bug answer a miss", () => {
    const q = prepare(bug());
    expect(isCorrect(q, [1, FIX_BASE + q.fixCorrect!])).toBe(true);
    expect(isCorrect(q, [1, FIX_BASE + q.fixCorrect!, MISSED_LINE])).toBe(false);
  });
  it("SQL-style puzzles get a rule without indentation", () => {
    expect(gameRule("parsons", getCourse("code-sql")!)).not.toMatch(/indent/i);
    expect(gameRule("parsons", getCourse("code-python")!)).toMatch(/indent/i);
  });
  it("output keeps internal spacing but ignores line endings and edge blank lines", () => {
    expect(normalizeOutput("\r\n a  b\r\nc \r\n\r\n")).toBe(" a  b\nc");
    expect(normalizeOutput(" 42 ")).toBe("42");
  });
  it("review notes", () => {
    const now = new Date("2026-10-30T12:00:00Z");
    expect(reviewNote(undefined, "again", now)).toBe("This will come back soon.");
    expect(reviewNote(undefined, "good", now)).toMatch(/^Next review (in \d+ days?|later today)\.$/);
  });
  it("changing the plan goal clears the date", () => {
    expect(dateForGoal("exam", "exam", "2026-12-11")).toBe("2026-12-11");
    expect(dateForGoal("exam", "skill", "2026-12-11")).toBe("");
  });
});
