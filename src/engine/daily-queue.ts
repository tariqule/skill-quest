import { getCourse } from "@/courses";
import { targetCourses } from "./bundles";
import { activeCourseIds } from "./plan-inputs";
import type { StudyPlan } from "./plan";
import { interleaveDue, itemKey, parseKey } from "./srs";
import { getSrs, syncFromProgress } from "./srs-store";
import { getCourseStore } from "./store";
import { isChoice, type Card, type ChoiceQuestion, type Course } from "./types";

export const SESSION = 30;
export const NEW_CARDS = 5;
export const NEW_QUESTIONS = 3;

export type Item = { key: string; course: Course; fresh?: boolean } & ({ kind: "card"; card: Card } | { kind: "q"; q: ChoiceQuestion });

const progressOf = (c: Course) => getCourseStore(c).get();

/** Build today's queue once: due items interleaved across courses, then a few new cards from the plan. */
export function buildQueue(plan: StudyPlan | null): Item[] {
  syncFromProgress();
  const now = new Date();
  const srs = getSrs();
  const active = activeCourseIds(plan, progressOf);
  const resolve = (key: string): Item | null => {
    const k = parseKey(key);
    const course = k && getCourse(k.courseId);
    if (!k || !course) return null;
    if (k.kind === "card") {
      const card = course.cards.find((c) => c.id === k.id);
      return card ? { key, course, kind: "card", card } : null;
    }
    const q = course.questions.find((x) => x.id === k.id);
    return q && isChoice(q) ? { key, course, kind: "q", q } : null;
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
      const card = course?.cards.find((c) => !srs[itemKey(id, "card", c.id)] && !fresh.some((f) => f.key === itemKey(id, "card", c.id)));
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
      const q = course.questions.filter(isChoice).find((x) => {
        const k = itemKey(id, "q", x.id);
        return !srs[k] && !seen.has(k);
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
