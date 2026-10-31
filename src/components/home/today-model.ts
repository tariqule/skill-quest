/**
 * Pure presentation logic for home and the shell, kept out of components so it is unit-tested.
 * Copy follows the redesign's learning-psychology rules:
 * - review first (retrieval practice / spacing),
 * - praise effort and strategy, never talent,
 * - streaks without anxiety: no loss framing, nothing shown at zero.
 */
import type { PlanItem } from "@/engine/plan";

/** Review comes first, then the rest in plan order (stable). */
export function reviewFirst<T extends Pick<PlanItem, "kind">>(items: readonly T[]): T[] {
  return [...items.filter((i) => i.kind === "review"), ...items.filter((i) => i.kind !== "review")];
}

/** "4-day streak", or null at zero so a break is never called out. */
export function streakLabel(days: number): string | null {
  if (!Number.isFinite(days) || days <= 0) return null;
  return `${days}-day streak`;
}

/** Effort-praising progress line for the plan. */
export function effortLine(done: number, total: number): string {
  if (total <= 0) return "Your plan is ready when you are.";
  if (done <= 0) return `${total} lessons in your plan. The first one takes about 5 minutes.`;
  if (done >= total) return `All ${total} lessons done. That steady work shows.`;
  const left = total - done;
  return `${done} of ${total} lessons done. ${left === 1 ? "1 lesson" : `${left} lessons`} to go. Showing up is what makes it stick.`;
}

export type PaceTone = "good" | "nudge" | "neutral";

/** Countdown and pace copy. Behind schedule is a suggestion, not a warning. */
export function paceCopy(days: number | null, forecast: number, onTrack: boolean): { line: string; pace: string | null; tone: PaceTone } {
  if (days === null) return { line: "No date set. You're going at a steady pace.", pace: null, tone: "neutral" };
  if (days < 0) return { line: "Your date has passed. Pick a new one whenever you're ready.", pace: null, tone: "neutral" };
  if (days === 0) return { line: "It's today. You've put in the work.", pace: null, tone: "good" };
  const line = `${days} ${days === 1 ? "day" : "days"} to go`;
  return onTrack
    ? { line, pace: `On track: about ${forecast}% ready by then.`, tone: "good" }
    : { line, pace: `About ${forecast}% ready by then. A few more minutes a day would close the gap.`, tone: "nudge" };
}

/** stroke-dasharray for a progress ring of radius r at value 0..1. */
export function levelRingDash(value: number, r: number): string {
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
  return `${(v * c).toFixed(2)} ${c.toFixed(2)}`;
}

/** Minutes for a list of plan items. */
export function totalMinutes(items: readonly Pick<PlanItem, "minutes">[]): number {
  return items.reduce((n, i) => n + i.minutes, 0);
}
