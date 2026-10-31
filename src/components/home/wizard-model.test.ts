import { describe, expect, it } from "vitest";
import { canJumpTo, clampStep, LAST_STEP, primaryLabel, WIZARD_STEPS } from "./wizard-model";

describe("plan wizard steps", () => {
  it("has three steps", () => expect(WIZARD_STEPS).toHaveLength(LAST_STEP + 1));
  it("clamps steps", () => {
    expect(clampStep(-1)).toBe(0);
    expect(clampStep(9)).toBe(2);
    expect(clampStep(NaN)).toBe(0);
  });
  it("one primary label per step", () => {
    expect(primaryLabel(0, false)).toBe("Next");
    expect(primaryLabel(2, false)).toBe("Build my plan");
    expect(primaryLabel(2, true)).toBe("Update my plan");
  });
  it("only jumps back to reached steps", () => {
    expect(canJumpTo(1, 0)).toBe(false);
    expect(canJumpTo(0, 2)).toBe(true);
  });
});
