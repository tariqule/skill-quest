import { DOMAINS, type DomainId } from "@/data/domains";
import { QUESTIONS, type Question } from "@/data/questions";
import type { Progress } from "./store";

export interface PreparedQuestion extends Question {
  /** Options in display order. */
  shuffled: string[];
  /** Correct indexes into `shuffled`. */
  correct: number[];
}

export function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function prepare(q: Question): PreparedQuestion {
  const order = shuffle(q.options.map((_, i) => i));
  return {
    ...q,
    shuffled: order.map((i) => q.options[i]),
    correct: order.flatMap((orig, display) => (q.answer.includes(orig) ? [display] : [])),
  };
}

export function deck(questions: Question[], count = questions.length) {
  return shuffle(questions).slice(0, count).map(prepare);
}

/** Pick questions so each domain appears in proportion to its exam weight. */
export function weightedExamDeck(total: number) {
  const picks: Question[] = [];
  for (const d of DOMAINS) {
    const pool = shuffle(QUESTIONS.filter((q) => q.domain === d.id));
    picks.push(...pool.slice(0, Math.round((d.weight / 100) * total)));
  }
  return shuffle(picks).slice(0, total).map(prepare);
}

export function isCorrect(q: PreparedQuestion, picked: number[]) {
  return picked.length === q.correct.length && picked.every((p) => q.correct.includes(p));
}

/** Share of a domain's questions whose most recent attempt was correct. */
export function domainMastery(progress: Progress, domain: DomainId) {
  const pool = QUESTIONS.filter((q) => q.domain === domain);
  const mastered = pool.filter((q) => progress.questions[q.id]?.lastCorrect).length;
  return mastered / pool.length;
}

export function overallReadiness(progress: Progress) {
  return DOMAINS.reduce((sum, d) => sum + domainMastery(progress, d.id) * d.weight, 0);
}

export function missedQuestions(progress: Progress) {
  return QUESTIONS.filter((q) => {
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

/** AWS reports scaled scores from 100 to 1000; 700 passes. */
export function scaledScore(correct: number, total: number) {
  return Math.round(100 + (900 * correct) / Math.max(total, 1));
}
