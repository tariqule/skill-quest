import { peekCourse as getCourse } from "@/api/client";
import { targetCourses } from "./bundles";
import { activeCourseIds } from "./plan-inputs";
import type { StudyPlan } from "./plan";
import { interleaveDue, itemKey, parseKey } from "./srs";
import { getSrs, syncFromProgress } from "./srs-store";
import { getProgressStore } from "./store";
import { codeGameOf } from "./code-games";
import type { ScenarioItem } from "./scenarios";
import { isChoice, type Card, type CodingChallenge, type Course, type Question } from "./types";

/** Daily Review shows choice questions and the code games (Parsons, Spot the Bug, Predict the Output). */
export const reviewable = (q: Question) => isChoice(q) || !!codeGameOf(q);

export const SESSION = 30;
export const NEW_CARDS = 5;
export const NEW_QUESTIONS = 3;

export type Item = { key: string; course: Course; fresh?: boolean } & ({ kind: "card"; card: Card } | { kind: "q"; q: Question } | { kind: "sc"; sc: ScenarioItem } | { kind: "code"; code: CodingChallenge });

const progressOf = (c: Course) => getProgressStore(c).get();

/**
 * What the learner has been taught in a course: lessons they finished, and the sections
 * (domains) those lessons belong to. New review items only come from this, so Daily Review
 * never asks about something nobody has explained yet.
 */
export function taughtIn(course: Course, p: { lessonsDone: string[] }) {
  const lessons = new Set(p.lessonsDone);
  const domains = new Set(course.domains.filter((d) => (course.lessons[d.id] ?? []).some((l) => lessons.has(l.id))).map((d) => d.id));
  return { lessons, domains };
}

/**
 * Course ids today's queue can draw from. Load these (`useCourses`) before `buildQueue`; an
 * unloaded course's items are skipped.
 */
export function queueCourseIds(plan: StudyPlan | null): string[] {
  return [...new Set([...activeCourseIds(plan), ...(plan ? targetCourses(plan.target) : [])])];
}

/** Build today's queue once: due items interleaved across courses, then a few new cards from the plan. */
export function buildQueue(plan: StudyPlan | null): Item[] {
  syncFromProgress();
  const now = new Date();
  const srs = getSrs();
  const active = activeCourseIds(plan);
  const resolve = (key: string): Item | null => {
    const k = parseKey(key);
    const course = k && getCourse(k.courseId);
    if (!k || !course) return null;
    if (k.kind === "card") {
      const card = course.cards.find((c) => c.id === k.id);
      return card ? { key, course, kind: "card", card } : null;
    }
    if (k.kind === "sc") {
      const sc = course.scenarios?.find((x) => x.id === k.id);
      return sc ? { key, course, kind: "sc", sc } : null;
    }
    if (k.kind === "code") {
      const code = (course.coding ?? []).find((c) => c.id === k.id);
      return code ? { key, course, kind: "code", code } : null;
    }
    const q = course.questions.find((x) => x.id === k.id);
    return q && reviewable(q) ? { key, course, kind: "q", q } : null;
  };
  const items = interleaveDue(srs, now, active, SESSION * 2)
    .map(resolve)
    .filter((x): x is Item => !!x)
    .slice(0, SESSION);
  // Introduce a few cards the player hasn't seen, from the plan's courses (or the active ones).
  const pool = plan ? targetCourses(plan.target) : active;
  const fresh: Item[] = [];
  for (let i = 0; fresh.length < NEW_CARDS && i < 50; i++) {
    for (const id of pool) {
      const course = getCourse(id);
      const taught = course ? taughtIn(course, progressOf(course)) : null;
      const card = course?.cards.find((c) => taught?.domains.has(c.domain) && !srs[itemKey(id, "card", c.id)] && !fresh.some((f) => f.key === itemKey(id, "card", c.id)));
      if (course && card && fresh.length < NEW_CARDS) fresh.push({ key: itemKey(id, "card", card.id), course, kind: "card", card });
    }
    if (fresh.length === 0) break;
  }
  // And a few quiz questions the player hasn't met, so day one isn't only flashcards.
  const freshQs: Item[] = [];
  const seen = new Set(items.map((x) => x.key));
  for (let round = 0; freshQs.length < NEW_QUESTIONS && round < 3; round++) {
    for (const id of pool) {
      const course = getCourse(id);
      if (!course || freshQs.length >= NEW_QUESTIONS) continue;
      const taught = taughtIn(course, progressOf(course));
      const q = course.questions.filter(reviewable).find((x) => {
        const k = itemKey(id, "q", x.id);
        return taught.lessons.has(x.lesson) && !srs[k] && !seen.has(k);
      });
      if (q) {
        const k = itemKey(id, "q", q.id);
        seen.add(k);
        freshQs.push({ key: k, course, kind: "q", q, fresh: true });
      }
    }
  }
  const mixed = [...fresh];
  freshQs.forEach((q, n) => mixed.splice(Math.min(mixed.length, n * 2 + 1), 0, q));
  return [...items, ...mixed].slice(0, SESSION + NEW_CARDS + NEW_QUESTIONS);
}

/** Size of today's Daily Review session, split into due and new items. Home and /daily share this. */
export function dailySessionSize(plan: StudyPlan | null) {
  const q = buildQueue(plan);
  const fresh = q.filter((x) => x.fresh || !getSrs()[x.key]).length;
  return { total: q.length, due: q.length - fresh, fresh };
}
