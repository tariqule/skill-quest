import { effectiveLevel, levelOf, nearbyLevels, type LevelChoice } from "./levels";
import { EXTRA_KINDS, isCodeTrack } from "./tracks";
import type { Progress } from "./store";
import type { Course, Question, QuestionKind } from "./types";

export type PreparedKind = "choice" | "order" | "match" | "lines" | "fill" | "output";

export type PreparedQuestion = Question & {
  kind: PreparedKind;
  /**
   * choice: options in display order. order: steps in scrambled order.
   * match: responses in scrambled order.
   */
  shuffled: string[];
  /** match only: the prompts, in their original order. */
  prompts: string[];
  /**
   * choice: indexes into `shuffled` that are correct (any order).
   * order: indexes into `shuffled` in the correct sequence.
   * match: for each prompt, the index into `shuffled` of its response.
   */
  correct: number[];
  /** fill only: for each blank, the indexes into `shuffled` of its options. */
  groups?: number[][];
};

/**
 * Typed answers travel through the same `number[]` as every other answer: each number is one
 * character code. These two helpers are the only place that knows about the encoding.
 */
export function encodeText(text: string): number[] {
  return Array.from(text, (c) => c.codePointAt(0) ?? 0);
}

export function decodeText(picked: number[] | null | undefined): string {
  return (picked ?? []).map((n) => String.fromCodePoint(n)).join("");
}

/** Compare typed output ignoring trailing spaces, blank edge lines, and runs of spaces. */
export function normalizeOutput(text: string) {
  return text
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim().replace(/[ \t]+/g, " "))
    .join("\n")
    .replace(/^\n+|\n+$/g, "");
}

export function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function kindOf(q: Question): PreparedKind {
  return q.type ?? "choice";
}

export function prepare(q: Question): PreparedQuestion {
  if (q.type === "lines") {
    // Lines keep their order; `correct` holds 0-based line indexes.
    return { ...q, kind: "lines", shuffled: codeLines(q.code), prompts: [], correct: [...q.answer].sort((a, b) => a - b).map((n) => n - 1) };
  }
  if (q.type === "fill") {
    // Each blank keeps its own shuffled options; they are stored flat, with `groups` marking the ranges.
    const shuffled: string[] = [];
    const groups: number[][] = [];
    const correct: number[] = [];
    for (const b of q.blanks) {
      const order = shuffle(b.options.map((_, i) => i));
      const start = shuffled.length;
      groups.push(order.map((_, k) => start + k));
      shuffled.push(...order.map((i) => b.options[i]));
      correct.push(start + order.indexOf(b.answer));
    }
    return { ...q, kind: "fill", shuffled, prompts: [], correct, groups };
  }
  if (q.type === "output") return { ...q, kind: "output", shuffled: [...q.answers], prompts: [], correct: [] };
  if (q.type === "order") {
    const shuffled = scramble(q.items);
    return { ...q, kind: "order", shuffled, prompts: [], correct: q.items.map((it) => shuffled.indexOf(it)) };
  }
  if (q.type === "match") {
    const responses = q.pairs.map(([, r]) => r);
    const shuffled = scramble(responses);
    return { ...q, kind: "match", shuffled, prompts: q.pairs.map(([p]) => p), correct: responses.map((r) => shuffled.indexOf(r)) };
  }
  const order = shuffle(q.options.map((_, i) => i));
  return {
    ...q,
    kind: "choice",
    shuffled: order.map((i) => q.options[i]),
    prompts: [],
    correct: order.flatMap((orig, display) => (q.answer.includes(orig) ? [display] : [])),
  };
}

/** Split a snippet into lines, dropping leading and trailing blank lines. */
export function codeLines(code: string) {
  return code.replace(/^\n+|\s+$/g, "").split("\n");
}

/** Shuffle, but never hand back the answer already in order. */
function scramble(items: string[]) {
  let out = shuffle(items);
  for (let i = 0; i < 5 && out.every((x, j) => x === items[j]); i++) out = shuffle(items);
  return out;
}

export function deck(questions: Question[], count = questions.length) {
  return shuffle(questions).slice(0, count).map(prepare);
}

/**
 * A deck of up to `count` questions from `pool` at the player's level. When the level runs short
 * (a small stage at "staff", say), the rest come from the nearest levels, so a game never runs
 * short or empty. Courses without levels, or "all", just shuffle the pool.
 */
export function levelDeck(course: Course, level: LevelChoice, pool: Question[], count: number) {
  const l = effectiveLevel(course, level);
  if (l === "all") return deck(pool, count);
  if (l === "exam") {
    // Exam level: anything past the basics, topped up with basics only if a stage is tiny.
    const main = shuffle(pool.filter((q) => levelOf(q) !== "beginner")).slice(0, count);
    const extra = shuffle(pool.filter((q) => levelOf(q) === "beginner")).slice(0, count - main.length);
    return shuffle([...main, ...extra]).map(prepare);
  }
  const picks = shuffle(pool.filter((q) => levelOf(q) === l)).slice(0, count);
  for (const near of nearbyLevels(l)) {
    if (picks.length >= count) break;
    picks.push(...shuffle(pool.filter((q) => levelOf(q) === near)).slice(0, count - picks.length));
  }
  return shuffle(picks).map(prepare);
}

/**
 * Split `total` across domains by exam weight using largest remainders,
 * so the counts always add up to exactly `total`.
 */
export function allocateByWeight(course: Course, total: number): Record<string, number> {
  const raw = course.domains.map((d) => ({ id: d.id, exact: (d.weight / 100) * total }));
  const counts = Object.fromEntries(raw.map((r) => [r.id, Math.floor(r.exact)]));
  let left = total - Object.values(counts).reduce((a, b) => a + b, 0);
  for (const r of [...raw].sort((a, b) => (b.exact % 1) - (a.exact % 1))) {
    if (left-- <= 0) break;
    counts[r.id]++;
  }
  return counts;
}

/** The exam format a question uses: single-answer choice counts as "choice", several answers as "multi". */
export function questionKind(q: Question): QuestionKind {
  if (q.type === "order" || q.type === "match" || q.type === "lines" || q.type === "fill" || q.type === "output") return q.type;
  return q.answer.length > 1 ? "multi" : "choice";
}

/** Formats the real exam uses (everything not marked practice-only). */
export function officialKinds(course: Course): Set<QuestionKind> {
  const kinds = new Set(course.exam.questionTypes.filter((t) => !t.practiceOnly).map((t) => t.id));
  // Code Quest mock interviews always include the code-first formats.
  if (isCodeTrack(course)) for (const k of EXTRA_KINDS) kinds.add(k.id);
  return kinds;
}

/** Questions in formats the real exam uses. */
export function examQuestions(course: Course): Question[] {
  const kinds = officialKinds(course);
  return course.questions.filter((q) => kinds.has(questionKind(q)));
}

/**
 * Pick questions so each domain appears in proportion to its exam weight.
 * Pass a `pool` to draw from a subset, such as only official exam formats.
 */
export function weightedExamDeck(course: Course, total: number, pool: Question[] = course.questions) {
  const counts = allocateByWeight(course, total);
  const picks: Question[] = [];
  for (const d of course.domains) {
    picks.push(...shuffle(pool.filter((q) => q.domain === d.id)).slice(0, counts[d.id]));
  }
  // A small domain can run short; top up from whatever is left.
  if (picks.length < total) {
    const used = new Set(picks.map((q) => q.id));
    picks.push(...shuffle(pool.filter((q) => !used.has(q.id))).slice(0, total - picks.length));
  }
  return shuffle(picks).map(prepare);
}

export function isCorrect(q: PreparedQuestion, picked: number[]) {
  if (q.kind === "output") {
    const typed = normalizeOutput(decodeText(picked));
    return typed !== "" && q.shuffled.some((a) => normalizeOutput(a) === typed);
  }
  if (picked.length !== q.correct.length) return false;
  if (q.kind === "choice" || q.kind === "lines") return picked.every((p) => q.correct.includes(p));
  return picked.every((p, i) => p === q.correct[i]);
}

/** Share of a domain's questions whose most recent attempt was correct. */
export function domainMastery(course: Course, progress: Progress, domain: string) {
  const pool = course.questions.filter((q) => q.domain === domain);
  const mastered = pool.filter((q) => progress.questions[q.id]?.lastCorrect).length;
  return pool.length ? mastered / pool.length : 0;
}

/** Mastery weighted by each domain's share of the exam, 0-100. */
export function overallReadiness(course: Course, progress: Progress) {
  return course.domains.reduce((sum, d) => sum + domainMastery(course, progress, d.id) * d.weight, 0);
}

export function missedQuestions(course: Course, progress: Progress) {
  return course.questions.filter((q) => {
    const s = progress.questions[q.id];
    return s !== undefined && !s.lastCorrect;
  });
}

/** XP multiplier grows with combo: x1, x1.5 at 3, x2 at 5, x3 at 10. */
export function comboMultiplier(combo: number) {
  if (combo >= 10) return 3;
  if (combo >= 5) return 2;
  if (combo >= 3) return 1.5;
  return 1;
}

/** Map a raw score onto the course's reported scale (e.g. 100-1000 for AWS, 0-100 for percentage exams). */
export function scaledScore(course: Course, correct: number, total: number) {
  const { min, max } = course.exam.scale;
  return Math.round(min + ((max - min) * correct) / Math.max(total, 1));
}

/** A 0-1 fraction as a CSS percentage with fixed precision, so SSR and hydration match. */
export function pct(fraction: number) {
  return `${(fraction * 100).toFixed(2)}%`;
}

/** Trial stars (0-3) from the share correct, using the course's thresholds. */
export function starsFor(course: Course, correct: number, total: number) {
  const share = correct / Math.max(total, 1);
  const [three, two, one] = course.config.quest.starThresholds;
  return share >= three ? 3 : share >= two ? 2 : share >= one ? 1 : 0;
}

/** The correct answer written out in words, for recaps and reviews. */
export function answerText(q: Question): string {
  if (q.type === "output") return q.answers[0];
  if (q.type === "fill") return q.blanks.map((b) => b.options[b.answer]).join(" · ");
  if (q.type === "order") return q.items.join(" → ");
  if (q.type === "match") return q.pairs.map(([a, b]) => `${a} → ${b}`).join(" · ");
  if (q.type === "lines") return q.answer.map((n) => `line ${n}: ${codeLines(q.code)[n - 1]?.trim() ?? "?"}`).join(" + ");
  return q.answer.map((i) => q.options[i]).join(" + ");
}

/**
 * Questions for a timed challenge: the ones the player must master first,
 * topped up with others from the same pool, never repeating.
 */
export function challengeDeck(must: Question[], pool: Question[], count: number) {
  const ids = new Set(must.map((q) => q.id));
  const unique = [...new Map(pool.filter((q) => !ids.has(q.id)).map((q) => [q.id, q])).values()];
  const extra = shuffle(unique).slice(0, Math.max(0, count - must.length));
  return shuffle([...must, ...extra]).map(prepare);
}

/** What the player actually answered, written out in words. */
export function pickedText(q: PreparedQuestion, picked: number[] | undefined): string {
  if (!picked || picked.length === 0) return "No answer";
  if (q.kind === "output") return decodeText(picked);
  if (q.kind === "fill") return picked.map((i) => q.shuffled[i] ?? "?").join(" · ");
  if (q.kind === "order") return picked.map((i) => q.shuffled[i]).join(" → ");
  if (q.kind === "match") return q.prompts.map((p, k) => `${p} → ${q.shuffled[picked[k]] ?? "?"}`).join(" · ");
  if (q.kind === "lines") return picked.map((i) => `line ${i + 1}: ${q.shuffled[i]?.trim() ?? "?"}`).join(" + ");
  return picked.map((i) => q.shuffled[i]).join(" + ");
}

/** "1.2" → "v1.2"; non-numeric labels such as "2026 refresh" are shown as-is. */
export function versionLabel(version: string) {
  return /^\d+(\.\d+)*$/.test(version) ? `v${version}` : version;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-11-30" → "November 30, 2026". Plain string formatting, so server and client always agree. */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
