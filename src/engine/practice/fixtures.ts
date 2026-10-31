import { INITIAL_PROGRESS, type Progress } from "../store";
import type { ChoiceQuestion, DesignPrompt, Topic } from "../types";

/** A tiny syllabus for unit tests: a → b → c, plus d (planned) which e depends on. */
export const TOPICS: Topic[] = [
  { id: "a", title: "A", module: "m1", status: "ready", prereqs: [], match: /\balpha\b/i },
  { id: "b", title: "B", module: "m1", status: "ready", prereqs: ["a"], standIns: ["old-b"], match: /\bbeta\b/i },
  { id: "c", title: "C", module: "m1", status: "ready", prereqs: ["b"], match: /\bgamma\b/i },
  { id: "d", title: "D", module: "m2", status: "planned", prereqs: [], match: /\bdelta\b/i },
  { id: "e", title: "E", module: "m2", status: "ready", prereqs: ["d"], match: /\bepsilon\b/i },
];

export const question = (id: string, concepts?: string[]): ChoiceQuestion => ({
  id, domain: "d1", lesson: "a", prompt: id, explanation: "x", options: ["p", "q"], answer: [0], ...(concepts ? { concepts } : {}),
});

export const QUESTIONS = [question("qa", ["a"]), question("qb", ["b"]), question("qab", ["a", "b"]), question("qc", ["c"]), question("qe", ["e"]), question("untagged")];

export const PROMPTS: DesignPrompt[] = [{ id: "pab", title: "P", prompt: "p", concepts: ["a", "b"], href: "/x", linkLabel: "Go" }];

export const progress = (lessonsDone: string[], questions: Progress["questions"] = {}): Progress => ({ ...INITIAL_PROGRESS, lessonsDone, questions });

/** Deterministic pseudo-random source (mulberry32) for property-style tests. */
export function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
