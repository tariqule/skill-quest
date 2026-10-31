import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { activeNav, NAV } from "./AppHeader";
import { LevelChip } from "./LevelChip";
import { TodaySkeleton } from "../home/Today";
import { Hero } from "../home/Hero";

describe("app shell", () => {
  it("marks the right nav item active", () => {
    expect(activeNav("/")).toBe("/");
    expect(activeNav("/code")).toBe("/code");
    expect(activeNav("/daily")).toBe("/daily");
    expect(activeNav("/warmup")).toBe("/daily");
    expect(activeNav("/c/aws-saa-c03/learn")).toBe("/");
    expect(activeNav("/credits")).toBe("/");
    expect(activeNav("/code/")).toBe("/code");
    expect(activeNav("/codex")).toBeNull();
    expect(NAV.map((n) => n.href)).toEqual(["/", "/code", "/daily"]);
  });
  it("level chip renders its level", () => {
    const html = renderToStaticMarkup(<LevelChip level={3} xp={120} value={0.5} />);
    expect(html).toContain("Lv 3");
  });
  it("level chip shows a skeleton, never a dash, before hydration", () => {
    const html = renderToStaticMarkup(<LevelChip level={null} xp={null} value={0} />);
    expect(html).toContain('data-slot="skeleton"');
    expect(html).not.toContain("Lv");
  });
  it("skeleton keeps the plan card's space (no empty box) and is hidden from AT", () => {
    const html = renderToStaticMarkup(<TodaySkeleton />);
    expect(html).toContain('data-slot="skeleton"');
    expect(html).toMatch(/aria-busy="true"|aria-hidden="true"/);
  });
  it("hero has no button of its own (one primary action below it)", () => {
    expect(renderToStaticMarkup(<Hero />)).not.toContain("<button");
    expect(renderToStaticMarkup(<Hero compact />)).toContain("Welcome back");
  });
});
