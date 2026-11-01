import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { COURSES } from "@/courses";
import { EMOJI_PATTERN, iconFor } from "./block-icons";
import { Flow, Ladder, Tiles } from "./blocks";

const EMOJI_G = new RegExp(EMOJI_PATTERN.source, "gu");

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.tsx?$/.test(f) ? [p] : [];
  });
}

/** Every `icon: "…"` string any course passes to a picture card. */
const ICONS = [...new Set(files("src/courses").flatMap((f) => [...readFileSync(f, "utf8").matchAll(/icon: "([^"]+)"/g)].map((m) => m[1])))];

const textOf = (html: string) => html.replace(/<[^>]+>/g, " ");

describe("picture-card icons", () => {
  it("finds the course icons", () => expect(ICONS.length).toBeGreaterThan(100));

  it("maps the common emoji to a specific Lucide icon", () => {
    for (const e of ["🙋", "🎭", "📜", "📱", "🖥️", "🗄️", "📨"]) expect(iconFor(e), e).toBeTruthy();
  });

  it("no picture card renders raw emoji, for every icon in every course", () => {
    const steps = ICONS.map((icon, i) => ({ icon, label: `s${i}`, sub: "x" }));
    const html =
      renderToStaticMarkup(<Flow steps={steps} />) +
      renderToStaticMarkup(<Tiles tiles={ICONS.map((icon, i) => ({ icon, title: `t${i}`, text: "x" }))} />) +
      renderToStaticMarkup(<Ladder rungs={ICONS.map((icon, i) => ({ icon, name: `r${i}`, text: "x" }))} />);
    expect(textOf(html).match(EMOJI_G) ?? []).toEqual([]);
    expect(html).toContain("lucide");
  });

  it("the AWS and system design intro pictures render without emoji", () => {
    const lessons = COURSES.flatMap((c) => Object.values(c.lessons ?? {}).flat()).filter((l) => ["d1-start-keycards", "t-intro"].includes(l.id));
    expect(lessons.length).toBe(2);
    for (const l of lessons) expect(textOf(renderToStaticMarkup(<>{l.visual}</>)).match(EMOJI_G) ?? [], l.id).toEqual([]);
  });
});
