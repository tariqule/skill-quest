import { isChoice, type Course } from "./types";

/** How deep a course's teaching is, used to find thin courses. Words count lesson points and tips. */
export interface Depth {
  id: string;
  lessons: number;
  points: number;
  words: number;
  wordsPerLesson: number;
  /** Lessons with a worked example: a point that walks through an example, or a traced output game in the course. */
  examples: number;
  pitfalls: number;
  questions: number;
  /** Lesson points per question: how much teaching stands behind each question. */
  pointsPerQ: number;
  cheatItems: number;
  /** Cheat sheet entries per lesson. */
  cheatPerLesson: number;
  sourced: number;
  /** Rough single number to rank courses (lower is thinner). */
  score: number;
}

const EXAMPLE = /\b(for example|example:|worked example|say you|suppose|imagine|picture)\b/i;
const PITFALL = /\b(pitfall|trap|common mistake|gotcha|watch out|careful|don't|do not|never)\b/i;
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

export function depthOf(c: Course): Depth {
  const lessons = Object.values(c.lessons).flat();
  const points = lessons.flatMap((l) => l.points);
  const w = lessons.reduce((n, l) => n + l.points.reduce((m, p) => m + words(p), 0) + words(l.tip ?? ""), 0);
  const traced = c.questions.filter((q) => !isChoice(q) && q.type === "output" && q.trace?.length).length;
  const examples = lessons.filter((l) => l.points.some((p) => EXAMPLE.test(p)) || EXAMPLE.test(l.tip ?? "")).length + traced;
  const pitfalls = lessons.filter((l) => l.points.some((p) => PITFALL.test(p)) || PITFALL.test(l.tip ?? "")).length;
  const cheatItems = c.cheatsheet.reduce((n, s) => n + s.items.length, 0);
  const L = Math.max(1, lessons.length);
  const r = (x: number) => Math.round(x * 100) / 100;
  const d = {
    id: c.id,
    lessons: lessons.length,
    points: points.length,
    words: w,
    wordsPerLesson: r(w / L),
    examples,
    pitfalls,
    questions: c.questions.length,
    pointsPerQ: r(points.length / Math.max(1, c.questions.length)),
    cheatItems,
    cheatPerLesson: r(cheatItems / L),
    sourced: lessons.filter((l) => l.sources?.length).length,
  };
  // Lessons and words dominate; examples, pitfalls and cheat sheet coverage per lesson add the rest.
  const score = r(d.lessons * 2 + d.words / 100 + (examples / L) * 20 + (pitfalls / L) * 10 + Math.min(1, d.cheatPerLesson) * 10 + Math.min(1, d.pointsPerQ) * 10);
  return { ...d, score };
}
