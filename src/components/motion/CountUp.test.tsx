import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { COUNT_UP_MS, CountUp } from "./CountUp";

describe("CountUp", () => {
  it("renders the final value on first paint (nothing animates on load)", () => {
    const html = renderToStaticMarkup(<CountUp value={1250} format={(n) => `${n.toLocaleString("en-US")} XP`} />);
    expect(html).toContain('aria-hidden="true" class="tabular-nums">1,250 XP');
    expect(html).toContain('<span class="sr-only">1,250 XP</span>');
  });

  it("stays within the 600 ms motion budget and honours reduced motion", () => {
    expect(COUNT_UP_MS).toBeLessThanOrEqual(600);
    const src = readFileSync(new URL("./CountUp.tsx", import.meta.url), "utf8");
    expect(src).toMatch(/useReducedMotion\(\)/);
    expect(src).toMatch(/if \(reduce \|\|/);
  });
});
