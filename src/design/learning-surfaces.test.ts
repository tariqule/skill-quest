import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** Learning screens from PR C: text stays >=14px and decoration is Lucide icons, not emoji. */
const FILES = [
  "components/QuestionCard.tsx",
  "components/QuizSession.tsx",
  "components/practice/TrueFalse.tsx",
  "components/feedback/AnswerFeedback.tsx",
  "components/feedback/ChoiceOption.tsx",
  "components/learn/LessonReader.tsx",
  "components/learn/ReaderParts.tsx",
  "components/learn/LessonParts.tsx",
  "components/learn/Sources.tsx",
  "components/Guide.tsx",
  "app/c/[course]/lesson/[id]/LessonPlay.tsx",
  "app/c/[course]/practice/page.tsx",
  "app/daily/page.tsx",
];
const src = (f: string) => readFileSync(join(__dirname, "..", f), "utf8");
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

describe.each(FILES)("%s", (f) => {
  it("has no text under 14px", () => {
    expect(src(f)).not.toMatch(/\btext-xs\b|text-\[(?:[0-9]|1[0-3])px\]/);
  });
  it("uses no emoji as decoration", () => {
    expect(src(f).split("\n").filter((l) => EMOJI.test(l))).toEqual([]);
  });
  // The Guide drawer's slide-over (PR B) is navigation chrome, not a learning-card transition.
  it.skipIf(f === "components/Guide.tsx")("keeps motion at 200ms or less", () => {
    expect(src(f)).not.toMatch(/duration-(?:[3-9]\d\d|[1-9]\d{3})\b/);
  });
});

describe("globals.css card motion", () => {
  const css = readFileSync(join(__dirname, "..", "app/globals.css"), "utf8");
  it("card-in and pop-in run in 200ms with no rotation", () => {
    expect(css).toMatch(/\.card-in\s*\{\s*animation: card-in 0\.2s/);
    expect(css).toMatch(/\.pop-in\s*\{\s*animation: pop-in 0\.2s/);
    expect(css.match(/@keyframes card-in \{[^}]*\}[^}]*\}/)?.[0]).not.toMatch(/rotate/);
  });
});
