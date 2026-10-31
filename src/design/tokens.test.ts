import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { colors, palette, contrastPairs, MIN_FONT_PX, radius, typeScale, type ThemeName } from "./tokens";
import { duration } from "./motion";

const css = readFileSync(join(__dirname, "../styles/tokens.css"), "utf8");

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}
function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
function cssBlock(selector: string): string {
  const start = css.indexOf(selector);
  return css.slice(start, css.indexOf("}", start));
}

describe("design tokens", () => {
  it("brand colours from the plan are present", () => {
    // Plan brand hues; light mode uses the 700 shades so text passes AA.
    expect(palette.teal[600]).toBe("#0D9488");
    expect(palette.amber[600]).toBe("#D97706");
    expect(colors.light.ring).toBe("#0D9488");
  });

  for (const theme of ["dark", "light"] as ThemeName[]) {
    it(`${theme}: every text/surface pair meets WCAG AA 4.5:1`, () => {
      const t = colors[theme];
      const failures = contrastPairs
        .map(([fg, bg]) => ({ fg, bg, ratio: contrast(t[fg], t[bg]) }))
        .filter((p) => p.ratio < 4.5);
      expect(failures).toEqual([]);
    });

    it(`${theme}: tokens.css mirrors tokens.ts`, () => {
      const block = cssBlock(theme === "dark" ? '[data-theme="dark"]' : '[data-theme="light"]');
      for (const [role, value] of Object.entries(colors[theme])) {
        expect(block, `--${role}`).toContain(`--${role}: ${value};`);
      }
    });
  }

  it("dark theme keeps the current page background and text (no visual regression)", () => {
    const globals = readFileSync(join(__dirname, "../app/globals.css"), "utf8");
    expect(globals.toLowerCase()).toContain(`--background: ${colors.dark.background.toLowerCase()}`);
    expect(globals.toLowerCase()).toContain(`--foreground: ${colors.dark.foreground.toLowerCase()}`);
  });

  it("type scale never goes below the minimum and mirrors CSS", () => {
    for (const [name, { size }] of Object.entries(typeScale)) {
      expect(size).toBeGreaterThanOrEqual(MIN_FONT_PX);
      expect(css).toContain(`--sq-text-${name}: ${size / 16}rem;`);
    }
    expect(typeScale.body.size).toBeGreaterThanOrEqual(17);
  });

  it("radii and motion durations mirror CSS", () => {
    for (const [name, px] of Object.entries(radius)) expect(css).toContain(`--sq-radius-${name}: ${px}px;`);
    for (const k of ["fast", "base", "slow"] as const) {
      expect(css).toContain(`--sq-duration-${k}: ${Math.round(duration[k] * 1000)}ms;`);
    }
  });

  it("reading-surface feedback stays within 200ms", () => {
    expect(duration.fast).toBeLessThanOrEqual(0.2);
    expect(duration.base).toBeLessThanOrEqual(0.2);
  });
});

/** Token-usage guard for redesigned code: no raw hex colours or sub-14px text. */
const GUARDED_DIRS = ["../components/ui", "../components/providers", "../lib", "../components/home", "../components/shell"];
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.tsx?$/.test(f) && !f.includes(".test.") ? [p] : [];
  });
}
describe("token usage in redesigned code", () => {
  const all = GUARDED_DIRS.flatMap((d) => files(join(__dirname, d)));
  it("finds files to check", () => expect(all.length).toBeGreaterThan(0));
  it("uses colour tokens, not hex literals", () => {
    const bad = all.filter((f) => /#[0-9a-fA-F]{3,8}\b/.test(readFileSync(f, "utf8")));
    expect(bad).toEqual([]);
  });
  it("has no arbitrary text sizes below 14px", () => {
    const bad = all.filter((f) => /text-\[(?:[0-9]|1[0-3])px\]/.test(readFileSync(f, "utf8")));
    expect(bad).toEqual([]);
  });
});

/** PR B: the shell and home use Lucide icons and calm surfaces. */
const PR_B_FILES = ["../components/Hud.tsx", "../app/page.tsx", "../components/Lifecycle.tsx"];
describe("shell and home stay calm", () => {
  const all = [...GUARDED_DIRS.slice(3).flatMap((d) => files(join(__dirname, d))), ...PR_B_FILES.map((f) => join(__dirname, f))];
  const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{23F0}-\u{23FF}]/u;
  it("uses icons, not emoji", () => {
    expect(all.filter((f) => EMOJI.test(readFileSync(f, "utf8")))).toEqual([]);
  });
  it("has no text-xs or sub-14px text", () => {
    expect(all.filter((f) => /\btext-(?:xs|\[(?:[0-9]|1[0-3])px\])\b/.test(readFileSync(f, "utf8")))).toEqual([]);
  });
  it("retires code rain, glitch, the blinking cursor and the starfield", () => {
    const app = files(join(__dirname, "../app")).concat(files(join(__dirname, "../components/code")));
    const bad = app.filter((f) => /<CodeRain|<Starfield|\bglitch\b|cursor-blink/.test(readFileSync(f, "utf8")));
    expect(bad).toEqual([]);
  });
});

