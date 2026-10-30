import { createEmptyCard, fsrs, Rating, State, type Card as FsrsCard, type Grade } from "ts-fsrs";

/**
 * Daily Review scheduling. A thin wrapper over ts-fsrs (MIT) so the rest of the app
 * only deals with plain JSON records and item keys like "aws-aif-c01:card:c1".
 * Pure functions here; persistence lives in srs-store.ts.
 */

/** card: flashcard; q: quiz question; sc: scenario-game item (src/scenarios). */
export type ItemKind = "card" | "q" | "sc";

/** One scheduled item, stored as JSON (dates as ISO strings). */
export interface SrsRecord {
  due: string;
  stability: number;
  difficulty: number;
  scheduledDays: number;
  learningSteps: number;
  reps: number;
  lapses: number;
  state: number;
  lastReview: string | null;
}

export type SrsState = Record<string, SrsRecord>;

/** The answer a learner gives on a review item. */
export type ReviewGrade = "again" | "hard" | "good" | "easy";

const GRADE: Record<ReviewGrade, Grade> = { again: Rating.Again, hard: Rating.Hard, good: Rating.Good, easy: Rating.Easy };

const scheduler = fsrs({ enable_fuzz: false, request_retention: 0.9, maximum_interval: 365 });

export function itemKey(courseId: string, kind: ItemKind, id: string) {
  return `${courseId}:${kind}:${id}`;
}

export function parseKey(key: string): { courseId: string; kind: ItemKind; id: string } | null {
  const m = /^([^:]+):(card|q|sc):(.+)$/.exec(key);
  return m ? { courseId: m[1], kind: m[2] as ItemKind, id: m[3] } : null;
}

function toRecord(c: FsrsCard): SrsRecord {
  return {
    due: c.due.toISOString(),
    stability: c.stability,
    difficulty: c.difficulty,
    scheduledDays: c.scheduled_days,
    learningSteps: c.learning_steps,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state,
    lastReview: c.last_review ? c.last_review.toISOString() : null,
  };
}

function fromRecord(r: SrsRecord): FsrsCard {
  return {
    due: new Date(r.due),
    stability: r.stability,
    difficulty: r.difficulty,
    scheduled_days: r.scheduledDays,
    learning_steps: r.learningSteps,
    reps: r.reps,
    lapses: r.lapses,
    state: r.state as State,
    last_review: r.lastReview ? new Date(r.lastReview) : undefined,
    elapsed_days: 0,
  } as FsrsCard;
}

/** A brand-new item, due immediately. */
export function newRecord(now: Date): SrsRecord {
  return toRecord(createEmptyCard(now));
}

/** Schedule one review and return the updated record. Never mutates its input. */
export function review(record: SrsRecord | undefined, grade: ReviewGrade, now: Date): SrsRecord {
  const card = record ? fromRecord(record) : createEmptyCard(now);
  return toRecord(scheduler.next(card, now, GRADE[grade]).card);
}

/** What Daily Review tells the player after grading: a miss comes back soon, otherwise when it is next due. */
export function reviewNote(record: SrsRecord | undefined, grade: ReviewGrade, now: Date) {
  if (grade === "again") return "This will come back soon.";
  const days = daysUntil(review(record, grade, now), now);
  return days <= 0 ? "Next review later today." : `Next review in ${days} day${days === 1 ? "" : "s"}.`;
}

export function isDue(record: SrsRecord | undefined, now: Date) {
  return record !== undefined && new Date(record.due).getTime() <= now.getTime();
}

/** Days until the next review (0 if due), for "see you in 3 days" feedback. */
export function daysUntil(record: SrsRecord, now: Date) {
  return Math.max(0, Math.round((new Date(record.due).getTime() - now.getTime()) / 86_400_000));
}

/**
 * Seed SRS records from progress saved before Daily Review existed, so returning
 * players don't start from scratch. Missed questions are due now; Leitner boxes
 * become a first review graded by how well the card was known.
 */
export function migrateProgress(
  courseId: string,
  progress: { questions: Record<string, { lastCorrect: boolean }>; cards: Record<string, number> },
  existing: SrsState,
  now: Date,
): SrsState {
  const out: SrsState = {};
  for (const [id, stat] of Object.entries(progress.questions)) {
    const key = itemKey(courseId, "q", id);
    if (existing[key] || stat.lastCorrect) continue;
    out[key] = newRecord(now);
  }
  for (const [id, box] of Object.entries(progress.cards)) {
    const key = itemKey(courseId, "card", id);
    if (existing[key]) continue;
    const grade: ReviewGrade = box >= 4 ? "easy" : box >= 2 ? "good" : "again";
    out[key] = review(undefined, grade, now);
  }
  return out;
}

/**
 * Interleave due keys across courses (round-robin), most overdue first within a course,
 * then cap the session. Mixing subjects is the "interleaving" study effect.
 */
export function interleaveDue(state: SrsState, now: Date, activeCourses: string[], limit = 30): string[] {
  const byCourse = new Map<string, { key: string; due: number }[]>();
  for (const [key, rec] of Object.entries(state)) {
    const p = parseKey(key);
    if (!p || !activeCourses.includes(p.courseId) || !isDue(rec, now)) continue;
    const list = byCourse.get(p.courseId) ?? [];
    list.push({ key, due: new Date(rec.due).getTime() });
    byCourse.set(p.courseId, list);
  }
  const queues = activeCourses.map((c) => (byCourse.get(c) ?? []).sort((a, b) => a.due - b.due || a.key.localeCompare(b.key)));
  const out: string[] = [];
  for (let i = 0; out.length < limit && queues.some((q) => i < q.length); i++) {
    for (const q of queues) if (i < q.length && out.length < limit) out.push(q[i].key);
  }
  return out;
}

/** How many items are due now among the given courses. */
export function dueCount(state: SrsState, now: Date, activeCourses: string[]) {
  let n = 0;
  for (const [key, rec] of Object.entries(state)) {
    const p = parseKey(key);
    if (p && activeCourses.includes(p.courseId) && isDue(rec, now)) n++;
  }
  return n;
}
