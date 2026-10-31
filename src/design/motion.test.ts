import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cardChange, duration, fade, MAX_SLIDE_PX, motionSafe, spring } from "./motion";

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.tsx?$/.test(f) && !f.includes(".test.") ? [p] : [];
  });
}

describe("motion presets", () => {
  it("falls back to a plain fade under reduced motion", () => {
    expect(motionSafe(cardChange, true)).toBe(fade);
    expect(motionSafe(cardChange, false)).toBe(cardChange);
  });
  it("keeps slides short and celebrations bounded", () => {
    expect(MAX_SLIDE_PX).toBeLessThanOrEqual(8);
    expect(duration.celebrate).toBeLessThanOrEqual(1.2);
    expect(spring.snappy.stiffness).toBeGreaterThan(spring.gentle.stiffness);
  });
});

describe("Motion usage (LazyMotion strict)", () => {
  const src = files(join(__dirname, ".."));
  it("never renders full motion.* components or imports framer-motion", () => {
    const bad = src.filter((f) => {
      const s = readFileSync(f, "utf8");
      return /<motion\.[a-z]/.test(s) || /from ["']framer-motion["']/.test(s) || /import\s*\{[^}]*\bmotion\b[^}]*\}\s*from ["']motion\/react["']/.test(s);
    });
    expect(bad).toEqual([]);
  });
  it("root layout wraps the app in MotionProvider", () => {
    const layout = readFileSync(join(__dirname, "../app/layout.tsx"), "utf8");
    expect(layout).toContain("<MotionProvider>");
    const provider = readFileSync(join(__dirname, "../components/providers/MotionProvider.tsx"), "utf8");
    expect(provider).toMatch(/LazyMotion features=\{domAnimation\} strict/);
    expect(provider).toContain('reducedMotion="user"');
  });
});
