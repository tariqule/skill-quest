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

/** The status chips above an exercise: whether it was solved on an earlier run, and how the latest run went. */
export function runStatusChips(solvedBefore: boolean, run: { passed: number; total: number; allPassed: boolean; error?: boolean; timedOut?: boolean } | null): { text: string; tone: "good" | "bad" }[] {
  const chips: { text: string; tone: "good" | "bad" }[] = [];
  if (run?.allPassed) return [{ text: "✅ Passed this run", tone: "good" }];
  if (solvedBefore) chips.push({ text: "✅ Solved before", tone: "good" });
  if (run) chips.push({ text: run.timedOut ? "✗ This run: stopped (too slow)" : run.error && run.total === 0 ? "✗ This run: error" : `✗ This run: ${run.passed}/${run.total} passed`, tone: "bad" });
  return chips;
}
