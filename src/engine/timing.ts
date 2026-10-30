import type { Question } from "./types";

/** Seconds a type gets at minimum, before reading-length extra. */
const TYPE_BASE: Record<string, number> = { choice: 20, multi: 30, output: 35, fill: 35, lines: 45, order: 50, match: 50, bug: 50, parsons: 60 };
const TYPE_CAP: Record<string, number> = { choice: 40, multi: 45, output: 50, fill: 50, lines: 60, order: 60, match: 60, bug: 60, parsons: 75 };

function kind(q: Question) {
  if (!q.type || q.type === "choice") return "answer" in q && Array.isArray(q.answer) && q.answer.length > 1 ? "multi" : "choice";
  return q.type;
}

function textLength(q: Question) {
  const parts: string[] = [q.prompt, "code" in q && q.code ? q.code : ""];
  if ("options" in q) parts.push(...q.options);
  if ("items" in q) parts.push(...q.items);
  if ("pairs" in q) for (const [a, b] of q.pairs) parts.push(a, b);
  if (q.type === "bug") parts.push(...q.fixes);
  if (q.type === "parsons") parts.push(...(q.distractors ?? []));
  if ("blanks" in q) for (const b of q.blanks) parts.push(...b.options);
  return parts.join(" ").length;
}

/**
 * Seconds to allow for one timed question: a floor by type (20 s single choice, 45 to 50 s for
 * bug hunt, ordering and matching), plus 1 s per 25 characters past the first 200, capped per type.
 * `base` (the course's configured seconds) only ever raises the floor.
 */
export function secondsFor(q: Question, base = 20) {
  const k = kind(q);
  const floor = Math.max(TYPE_BASE[k] ?? 20, k === "choice" ? base : 0);
  const extra = Math.max(0, Math.ceil((textLength(q) - 200) / 25));
  return Math.min(Math.max(TYPE_CAP[k] ?? 40, floor), floor + extra);
}
