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

/**
 * Emoji that stay as literal text on purpose: simulated terminal output, a screen-reader demo
 * button, a Unicode string-length example, and mark strings that labs parse (`includes("✗")`).
 */
/** Typographic arrows and marks that read as text, not pictures. */
const SYMBOLS = /[▶◀⬆⬇↕↔✂←→↑↓]\uFE0F?/gu;
const KEEP = /hi👋|⌨️ shows|>🔍<|Search button 🔍|"(?:healthy|unhealthy|primary) [✓✗]"|"[✓✗] |`[✓✗] \$\{t\.text\}`|out\.push\(|startsWith\("[✓✗]"\)|includes\("[✓✗]"\)/;

describe("course visuals and labs", () => {
  const sources = files("src/courses").filter((f) => /[/\\](visuals|labs)\.tsx$/.test(f));
  it("finds every course's visuals and labs", () => expect(sources.length).toBeGreaterThan(20));

  it("render emoji through BlockIcon, never as JSX text or UI strings", () => {
    const bad: string[] = [];
    for (const f of sources) {
      readFileSync(f, "utf8").split("\n").forEach((line, i) => {
        if (!new RegExp(EMOJI_PATTERN.source, "u").test(line) || KEEP.test(line)) return;
        // Icon data (`icon: "☁️"`, `emoji: "🐉"`, `["⭐", "XP"]`) and BlockIcon props are fine.
        const stripped = line.replace(SYMBOLS, "").replace(/<BlockIcon[^>]*\/>/g, "").replace(/(?:icon|emoji|glyph)(?:=|: )"[^"]*"/g, "").replace(/\["[^"]{1,4}",/g, "");
        if (new RegExp(EMOJI_PATTERN.source, "u").test(stripped)) bad.push(`${f}:${i + 1}`);
      });
    }
    expect(bad).toEqual([]);
  });

  it("every lesson visual in every course renders without raw emoji", () => {
    const bad: string[] = [];
    for (const c of COURSES)
      for (const l of Object.values(c.lessons ?? {}).flat()) {
        if (!l.visual) continue;
        const text = textOf(renderToStaticMarkup(<>{l.visual}</>)).replace(SYMBOLS, "");
        // 😬 and 👍 sit inside rendered code samples (a comment and a JSX button), which stay verbatim.
        const hits = (text.match(EMOJI_G) ?? []).filter((e) => !["👋", "🔍", "😬", "👍"].includes(e));
        if (hits.length) bad.push(`${c.id}/${l.id}: ${hits.join(" ")}`);
      }
    expect(bad).toEqual([]);
  });
});
