import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ALL_MODES } from "@/engine/modes";

/**
 * Practice modes (timed, flashcards, lightning, boss, match, review, study) share the PR E design system:
 * Lucide icons, coss buttons in teal, tokens instead of hex, >=14px text and no shouty uppercase.
 */
const MODE_FILES = [
  "app/c/[course]/timed/page.tsx",
  "app/c/[course]/flashcards/page.tsx",
  "app/c/[course]/lightning/page.tsx",
  "app/c/[course]/boss/page.tsx",
  "app/c/[course]/match/page.tsx",
  "app/c/[course]/review/page.tsx",
  "app/c/[course]/study/page.tsx",
  "app/c/[course]/study/[domain]/StudySession.tsx",
  "components/TimedQuiz.tsx",
];
const EMOJI = /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{23F0}-\u{23FF}]/u;
const src = (f: string) => readFileSync(join(__dirname, "..", f), "utf8");

describe.each(MODE_FILES)("%s", (f) => {
  const s = src(f);
  it("uses Lucide icons, not emoji (titles included)", () => {
    expect(s.split("\n").filter((l) => EMOJI.test(l))).toEqual([]);
  });
  it("has no text under 14px", () => {
    expect(s).not.toMatch(/\btext-xs\b|text-\[(?:[0-9]|1[0-3])px\]/);
  });
  it("has no uppercase labels, heavy weights or double borders", () => {
    expect(s).not.toMatch(/\buppercase\b|\bfont-(?:bold|black)\b|\bborder-2\b/);
  });
  it("keeps amber for XP only: no reward-coloured actions or chips", () => {
    expect(s).not.toMatch(/\b(?:bg|border|ring)-reward\b|#f59e0b|#fbbf24/);
  });
  it("uses colour tokens, not hex or white overlays", () => {
    expect(s).not.toMatch(/#[0-9a-fA-F]{6}\b|rgb\(255 255 255|\bbg-white\/|"white"/);
  });
  it("builds actions from the shared Button, not hand-rolled filled buttons", () => {
    expect(s).not.toMatch(/<(?:button|Link)\b[^>]*className="[^"]*\brounded-(?:xl|2xl)\b[^"]*\bbg-(?:primary|success|reward|secondary)(?=[\s"])/);
  });
});

describe("practice mode metadata", () => {
  it("every mode icon is a component, never an emoji string", () => {
    for (const m of ALL_MODES) expect(typeof m.icon, m.id).not.toBe("string");
  });
  it("mode names and the modes module carry no emoji", () => {
    expect(ALL_MODES.filter((m) => EMOJI.test(m.name)).map((m) => m.id)).toEqual([]);
    expect(src("engine/modes.ts")).not.toMatch(EMOJI);
  });
  it("page titles are plain text: PageShell takes an icon prop instead", () => {
    const bad = MODE_FILES.filter((f) => /<PageShell[^>]*title="[^"]*[^\x20-\x7E"][^"]*"/u.test(src(f)));
    expect(bad).toEqual([]);
  });
});
