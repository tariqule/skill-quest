import type { LessonSource, SkillLevel } from "./types";

/**
 * Scenario games (Phase 4): Architecture Builder, Mock Interview, Scenario Chains and Service Matcher.
 * They are not quiz questions, so they live in their own registry (src/scenarios) keyed by course id,
 * and are scheduled in Daily Review under keys like "aws-saa-c03:sc:arch-01". Everything here is pure.
 */

export type ScenarioGameId = "architect" | "interview" | "chain" | "matcher";

export const SCENARIO_GAMES: { id: ScenarioGameId; name: string; icon: string; blurb: string; rule: string }[] = [
  { id: "architect", name: "Architecture Builder", icon: "🏗️", blurb: "Read the requirements, then fill each slot of the design.", rule: "Pick a slot, then pick the component tile that fits it. Every choice is explained when you check." },
  { id: "chain", name: "Scenario Chains", icon: "🧭", blurb: "Make 3 to 5 decisions; each one changes what happens next.", rule: "Choose what you'd do. The situation changes with your choice, and each step explains the trade-off." },
  { id: "matcher", name: "Service Matcher", icon: "🔗", blurb: "Match equivalent services across clouds, or a need to its service.", rule: "Pick an item on the left, then its match on the right. Facts come from the providers' official docs." },
  { id: "interview", name: "Mock Interview", icon: "🎤", blurb: "Answer against the clock, then score yourself with a rubric.", rule: "Write your answer before time runs out, then compare it with the key points and model answer and score each rubric line honestly." },
];

export const SCENARIO_GAME_BY_ID = Object.fromEntries(SCENARIO_GAMES.map((g) => [g.id, g])) as Record<ScenarioGameId, (typeof SCENARIO_GAMES)[number]>;

interface Base {
  id: string;
  /** Lesson that teaches what this item practises. Behavioral interview prompts teach STAR in-game instead. */
  lesson?: string;
  level?: SkillLevel;
  title: string;
  /** Official docs the facts were checked against. */
  sources?: LessonSource[];
}

// ───────────── Architecture Builder ─────────────

export interface ArchTile {
  id: string;
  label: string;
  /** Why this tile fits, or doesn't, for this scenario. Shown after checking. */
  why: string;
}

export interface ArchItem extends Base {
  type: "architect";
  requirements: string[];
  slots: { id: string; label: string }[];
  tiles: ArchTile[];
  /** Every accepted design, as slot id → tile id. A design scores against the closest one. */
  solutions: Record<string, string>[];
}

export interface ArchScore {
  /** Slots that match the closest accepted design. */
  right: string[];
  total: number;
  solution: Record<string, string>;
  correct: boolean;
}

export function scoreArch(item: ArchItem, picks: Record<string, string | undefined>): ArchScore {
  let best: ArchScore | null = null;
  for (const sol of item.solutions) {
    const right = item.slots.filter((s) => picks[s.id] !== undefined && picks[s.id] === sol[s.id]).map((s) => s.id);
    if (!best || right.length > best.right.length) best = { right, total: item.slots.length, solution: sol, correct: right.length === item.slots.length };
  }
  return best!;
}

// ───────────── Mock Interview ─────────────

export type InterviewKind = "behavioral" | "technical" | "system-design";

export interface InterviewItem extends Base {
  type: "interview";
  kind: InterviewKind;
  prompt: string;
  minutes: number;
  /** Each line is self-scored 0 (missing), 1 (partly) or 2 (clearly). `good` says what a full mark looks like. */
  rubric: { name: string; good: string }[];
  keyPoints: string[];
  model: string;
}

/** Self-score as a share 0-1: rubric marks (0-2 each) count double the key-point ticks. */
export function interviewShare(item: InterviewItem, marks: number[], ticked: number) {
  const max = item.rubric.length * 2 * 2 + item.keyPoints.length;
  const got = marks.reduce((a, m) => a + Math.max(0, Math.min(2, m)), 0) * 2 + Math.max(0, Math.min(item.keyPoints.length, ticked));
  return max ? got / max : 0;
}

export const INTERVIEW_PASS = 0.7;

export const STAR_PRIMER = [
  "**Situation**: one or two sentences of context (team, product, stakes).",
  "**Task**: what you were responsible for.",
  "**Action**: what *you* did, step by step. Say \"I\", not \"we\".",
  "**Result**: the outcome with a number if you can, and what you learned.",
];

// ───────────── Scenario Chains ─────────────

export interface ChainChoice {
  text: string;
  /** Next step id; omit to end the chain after this choice. */
  next?: string;
  best: boolean;
  why: string;
}

export interface ChainStep {
  situation: string;
  choices: ChainChoice[];
}

export interface ChainItem extends Base {
  type: "chain";
  intro: string;
  start: string;
  steps: Record<string, ChainStep>;
}

/** Every path from the start, as the list of step ids visited (for validation). */
export function chainPaths(item: ChainItem): string[][] {
  const out: string[][] = [];
  const walk = (id: string, path: string[]) => {
    if (path.includes(id) || path.length > 8) {
      out.push([...path, id, "∞"]);
      return;
    }
    const step = item.steps[id];
    if (!step) {
      out.push([...path, id, "?"]);
      return;
    }
    for (const c of step.choices) {
      if (c.next) walk(c.next, [...path, id]);
      else out.push([...path, id]);
    }
  };
  walk(item.start, []);
  return out;
}

/** Share of decisions where the player took the best choice. */
export function chainShare(taken: ChainChoice[]) {
  return taken.length ? taken.filter((c) => c.best).length / taken.length : 0;
}

// ───────────── Service Matcher ─────────────

export interface MatcherItem extends Base {
  type: "matcher";
  mode: "clouds" | "usecase";
  prompt: string;
  leftLabel: string;
  rightLabel: string;
  /** [left, right] pairs; every right is distinct. */
  pairs: [string, string][];
  /** Shown after checking: one line per pair, same order. */
  notes?: string[];
}

export function matcherRight(item: MatcherItem, picks: Record<number, number | undefined>) {
  return item.pairs.map((_, i) => picks[i] === i);
}

// ───────────── Registry and grading ─────────────

export type ScenarioItem = ArchItem | InterviewItem | ChainItem | MatcherItem;

export const gameOf = (x: ScenarioItem): ScenarioGameId => x.type;

/** Map a 0-1 score to a Daily Review grade. */
export function gradeFor(share: number): "again" | "hard" | "good" | "easy" {
  return share < 0.5 ? "again" : share < 0.7 ? "hard" : share < 0.95 ? "good" : "easy";
}

/** Shuffle helper with an injectable random source for tests. */
export function shuffled<T>(xs: T[], rand: () => number = Math.random): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
