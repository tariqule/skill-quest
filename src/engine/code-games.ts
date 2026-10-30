import type { BugQuestion, Course, ParsonsQuestion, Question } from "./types";

/**
 * Code games: Parsons puzzles, Spot the Bug and Predict the Output. They are ordinary questions
 * (types "parsons", "bug" and "output"), so they also feed quests, Fix mistakes and Daily Review.
 * Every answer travels as the usual `number[]`; the encodings live here.
 */

export type CodeGameId = "parsons" | "bug" | "output";

export const CODE_GAMES: { id: CodeGameId; name: string; icon: string; blurb: string; rule: string }[] = [
  { id: "parsons", name: "Parsons Puzzle", icon: "🧱", blurb: "Rebuild working code from shuffled lines.", rule: "Put the lines in order (and set the indentation where it matters). Some lines are decoys that don't belong." },
  { id: "bug", name: "Spot the Bug", icon: "🐞", blurb: "Find the broken line, then pick the fix.", rule: "Tap the line with the bug, then choose the change that fixes it." },
  { id: "output", name: "Predict the Output", icon: "🔮", blurb: "Run the code in your head.", rule: "Type or choose exactly what the code prints. The answer traces it step by step." },
];

export const CODE_GAME_BY_ID = Object.fromEntries(CODE_GAMES.map((g) => [g.id, g])) as Record<CodeGameId, (typeof CODE_GAMES)[number]>;

export function codeGameOf(q: Question): CodeGameId | null {
  return q.type === "parsons" || q.type === "bug" || q.type === "output" ? q.type : null;
}

export function gamePool(course: Course, game: CodeGameId): Question[] {
  return course.questions.filter((q) => codeGameOf(q) === game);
}

export function hasCodeGames(course: Course) {
  return CODE_GAMES.every((g) => gamePool(course, g.id).length > 0);
}

// ───────────── Parsons ─────────────

/** A pick is `block + INDENT_STRIDE * indentLevel`. */
export const INDENT_STRIDE = 100;
export const MAX_INDENT = 6;

export interface ParsonsLine {
  text: string;
  indent: number;
}

/** Indentation of each line in levels: tabs count one each; spaces use the smallest indent in the snippet as the unit. */
export function parseIndented(code: string): { lines: ParsonsLine[]; unit: string } {
  const raw = code.replace(/^\n+|\s+$/g, "").split("\n").filter((l) => l.trim() !== "");
  const tabs = raw.some((l) => l.startsWith("\t"));
  const spaceCounts = raw.map((l) => /^ */.exec(l)![0].length).filter((n) => n > 0);
  const unit = tabs ? 1 : spaceCounts.length ? Math.min(...spaceCounts) : 4;
  const lines = raw.map((l) => {
    const lead = /^[\t ]*/.exec(l)![0];
    const indent = tabs ? lead.split("\t").length - 1 : Math.round(lead.length / unit);
    return { text: l.trim(), indent };
  });
  return { lines, unit: tabs ? "\t" : " ".repeat(unit) };
}

export function encodePick(block: number, indent = 0) {
  return block + INDENT_STRIDE * indent;
}

export function decodePick(pick: number) {
  return { block: pick % INDENT_STRIDE, indent: Math.floor(pick / INDENT_STRIDE) };
}

export interface PreparedParsons {
  /** Blocks in shuffled display order (text without indentation when `indent` is on). */
  blocks: string[];
  /** Solution lines, in order. */
  solution: ParsonsLine[];
  /** Block indexes that are decoys. */
  decoys: number[];
  indent: boolean;
  unit: string;
}

export function prepareParsons(q: ParsonsQuestion, shuffle: <T>(xs: T[]) => T[]): PreparedParsons {
  const { lines, unit } = parseIndented(q.code);
  const indent = !!q.indent;
  const solution = indent ? lines : lines.map((l) => ({ text: l.text, indent: 0 }));
  // Without player indentation, a block keeps its own leading spaces so the code still reads naturally.
  const rawLines = q.code.replace(/^\n+|\s+$/g, "").split("\n").filter((l) => l.trim() !== "");
  const solTexts = indent ? lines.map((l) => l.text) : rawLines;
  const all = [...solTexts.map((t) => ({ t, decoy: false })), ...(q.distractors ?? []).map((t) => ({ t, decoy: true }))];
  let order = shuffle(all.map((_, i) => i));
  for (let k = 0; k < 5 && order.every((x, i) => x === i); k++) order = shuffle(order);
  return {
    blocks: order.map((i) => all[i].t),
    solution: indent ? solution : rawLines.map((t) => ({ text: t, indent: 0 })),
    decoys: order.flatMap((i, pos) => (all[i].decoy ? [pos] : [])),
    indent,
    unit,
  };
}

export type ParsonsStatus = "ok" | "indent" | "misplaced" | "decoy";

/** Per placed line: right, right line with the wrong indentation, belongs elsewhere, or a decoy. */
export function parsonsFeedback(p: PreparedParsons, picked: number[]): ParsonsStatus[] {
  return picked.map((pick, i) => {
    const { block, indent } = decodePick(pick);
    if (p.decoys.includes(block)) return "decoy";
    const want = p.solution[i];
    if (!want || p.blocks[block] !== want.text) return "misplaced";
    return p.indent && indent !== want.indent ? "indent" : "ok";
  });
}

export function parsonsCorrect(p: PreparedParsons, picked: number[]) {
  return picked.length === p.solution.length && parsonsFeedback(p, picked).every((s) => s === "ok");
}

/**
 * Hint number `level` (0-based): the author's hint first, then how many decoys there are,
 * then the first line that is wrong or missing.
 */
export function parsonsHint(p: PreparedParsons, picked: number[], level: number, authored?: string): string {
  const hints: string[] = [];
  if (authored) hints.push(authored);
  if (p.decoys.length) hints.push(`${p.decoys.length === 1 ? "One line is a decoy" : `${p.decoys.length} lines are decoys`}: the solution uses ${p.solution.length} of the ${p.blocks.length} lines.`);
  const status = parsonsFeedback(p, picked);
  const firstWrong = status.findIndex((s) => s !== "ok");
  const at = firstWrong >= 0 ? firstWrong : picked.length;
  const want = p.solution[at];
  if (want) {
    const where = p.indent && want.indent ? ` (indented ${want.indent} level${want.indent > 1 ? "s" : ""})` : "";
    hints.push(`Line ${at + 1} should be \`${want.text.trim()}\`${where}.`);
  } else hints.push("Every line is in place. Check for a decoy at the end.");
  return hints[Math.min(level, hints.length - 1)];
}

/** The solution as text, with indentation. */
export function parsonsSolution(p: PreparedParsons) {
  return p.solution.map((l) => (p.indent ? p.unit.repeat(l.indent) : "") + l.text).join("\n");
}

// ───────────── Spot the Bug ─────────────

/** The fix choice travels after the line pick as `FIX_BASE + option index`. */
export const FIX_BASE = 1000;

/** The code with the fix applied: line `line` replaced, keeping its indentation. */
export function applyFix(q: Pick<BugQuestion, "code" | "line">, fix: string) {
  const lines = q.code.split("\n");
  const lead = /^[\t ]*/.exec(lines[q.line - 1] ?? "")![0];
  lines[q.line - 1] = lead + fix.replace(/^[\t ]*/, "");
  return lines.join("\n");
}

export function bugCorrect(lineIdx: number, fixIdx: number, correctLine: number, correctFix: number) {
  return lineIdx === correctLine && fixIdx === correctFix;
}

// ───────────── Decks ─────────────

export const GAME_ROUND = 7;
export const WARMUP_SIZE = 6;

/**
 * Daily code warm-up: one of each game per course in turn, missed or unplayed items first,
 * until `size` items. `seen(courseId, id)` says whether the player already got it right.
 */
export function warmupPicks(courses: Course[], seen: (courseId: string, questionId: string) => boolean, size = WARMUP_SIZE, rand: () => number = Math.random): { course: Course; q: Question }[] {
  const out: { course: Course; q: Question }[] = [];
  const pools = courses.filter(hasCodeGames).map((c) => ({
    c,
    byGame: CODE_GAMES.map((g) => {
      const pool = gamePool(c, g.id);
      const fresh = pool.filter((q) => !seen(c.id, q.id));
      const from = fresh.length ? fresh : pool;
      return [...from].sort(() => rand() - 0.5);
    }),
  }));
  for (let k = 0; pools.length && out.length < size && k < size * 6; k++) {
    const p = pools[k % pools.length];
    const q = p.byGame[(Math.floor(k / pools.length) + k) % CODE_GAMES.length].shift();
    if (q) out.push({ course: p.c, q });
  }
  return out;
}
