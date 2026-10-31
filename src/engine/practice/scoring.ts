import type { Progress } from "../store";
import type { Question } from "../types";

/** How much a just-finished topic boosts its questions; the boost fades by this much per newer topic. */
const RECENCY_BOOST = 2;
const RECENCY_DECAY = 0.5;
const MISSED_LAST_TIME = 3;
const LOW_HIT_RATE = 1.5;
const LOW_HIT_THRESHOLD = 0.6;
const MASTERED_FACTOR = 0.5;

/**
 * Draw weight of one unlocked question (always > 0). Recent topics and past misses come up
 * more often so practice follows what the learner just studied and what they got wrong.
 * `doneOrder` is `topicsDone` output: oldest first.
 */
export function practiceWeight(q: Question, p: Pick<Progress, "questions">, doneOrder: readonly string[]): number {
  let w = 1;
  const rank = Math.max(-1, ...(q.concepts ?? []).map((c) => doneOrder.indexOf(c)));
  if (rank >= 0) w += Math.max(0, RECENCY_BOOST - (doneOrder.length - 1 - rank) * RECENCY_DECAY);
  const s = p.questions[q.id];
  if (s && s.seen > 0) {
    if (!s.lastCorrect) w += MISSED_LAST_TIME;
    if (s.correct / s.seen < LOW_HIT_THRESHOLD) w += LOW_HIT_RATE;
    if (s.lastCorrect) w *= MASTERED_FACTOR;
  }
  return w;
}
