import { describe, expect, it } from "vitest";
import { fieldCount, makeBurst, makeField, seeded, stepBurst, stepField } from "./engine";

describe("particle engine", () => {
  it("keeps the field sparse on phones and capped on big screens", () => {
    expect(fieldCount(390, 400)).toBeLessThan(20);
    expect(fieldCount(4000, 3000)).toBe(80);
  });
  it("wraps field particles at the edges", () => {
    const ps = makeField(100, 100, 5, seeded(3));
    ps[0].x = 101.9;
    ps[0].vx = 1;
    stepField(ps, 100, 100);
    expect(ps[0].x).toBe(-2);
  });
  it("ends a burst within 1.2s (72 frames) so it never outlives the celebration", () => {
    const ps = makeBurst(50, 50, 36, 54, seeded(7));
    let frames = 0;
    while (stepBurst(ps)) frames++;
    expect(frames).toBeLessThanOrEqual(72);
    expect(ps.every((p) => p.alpha === 0)).toBe(true);
  });
});
