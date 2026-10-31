/** Step model for the plan wizard: three short screens, one primary action each. */
export const WIZARD_STEPS = [
  { id: "goal", label: "Goal" },
  { id: "target", label: "Topic and level" },
  { id: "time", label: "Time" },
] as const;

export type WizardStep = 0 | 1 | 2;
export const LAST_STEP: WizardStep = 2;

export function clampStep(n: number): WizardStep {
  return Math.max(0, Math.min(LAST_STEP, Math.trunc(Number.isFinite(n) ? n : 0))) as WizardStep;
}

/** Primary button label for a step. */
export function primaryLabel(step: WizardStep, editing: boolean): string {
  if (step < LAST_STEP) return "Next";
  return editing ? "Update my plan" : "Build my plan";
}

/** A step can be jumped to from the indicator only once reached (no skipping ahead). */
export function canJumpTo(target: number, furthest: number): boolean {
  return target >= 0 && target <= furthest;
}
