import type { ReviewGrade } from "./srs";

/**
 * Daily Review grade for a live-coding run. A clean first solve is "good", a solve after failed runs,
 * hints or a peek at the solution is "hard", and a failing run is "again" (it comes back soon).
 */
export function codingGrade(r: { solved: boolean; hints: number; failedBefore: boolean; sawSolution: boolean }): ReviewGrade {
  if (!r.solved) return "again";
  if (r.sawSolution) return "again";
  return r.hints > 0 || r.failedBefore ? "hard" : "good";
}
