import { isValidElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { taughtPool } from "@/engine/game";
import course from ".";
import { CONCEPTS } from "./concepts";

/** Plain text of a lesson as the learner sees it: title, points, tip and the visual. */
function lessonText(l: { title: string; points: string[]; tip?: string; visual: ReactNode }) {
  let visual = "";
  try {
    visual = isValidElement(l.visual) ? renderToStaticMarkup(l.visual) : String(l.visual ?? "");
  } catch {
    visual = "";
  }
  return [l.title, ...l.points, l.tip ?? "", visual.replace(/<[^>]+>/g, " ")].join(" ").replace(/\*\*|`/g, "");
}

/** What a question tests: its prompt plus its correct content. Distractors don't need teaching. */
function testedText(q: (typeof course.questions)[number]): string {
  const x = q as unknown as Record<string, unknown>;
  const parts = [String(x.prompt ?? "")];
  if (Array.isArray(x.options) && Array.isArray(x.answer)) for (const i of x.answer as number[]) parts.push(String((x.options as string[])[i]));
  if (Array.isArray(x.items)) parts.push(...(x.items as string[]));
  if (Array.isArray(x.pairs)) parts.push(...(x.pairs as string[][]).flat());
  if (typeof x.answer === "string") parts.push(x.answer);
  return parts.join(" ");
}

/** Matches that are not the concept, such as "temperature" readings from a sensor. */
const IGNORE: Record<string, string[]> = { "d1-27": ["temperature"] };

/** For each question, the concepts it tests that no lesson up to and including its own lesson teaches. */
export function untaught() {
  const order = course.domains.flatMap((d) => course.lessons[d.id] ?? []);
  const cumulative = new Map<string, string>();
  let acc = "";
  for (const l of order) {
    acc += " " + lessonText(l);
    cumulative.set(l.id, acc);
  }
  const out: string[] = [];
  for (const q of course.questions) {
    const taught = q.lesson ? cumulative.get(q.lesson) : undefined;
    if (!taught) {
      out.push(`${q.id}: no lesson`);
      continue;
    }
    const text = testedText(q);
    for (const [label, re] of CONCEPTS) if (re.test(text) && !re.test(taught) && !IGNORE[q.id]?.includes(label)) out.push(`${q.id} (${q.lesson}): ${label}`);
  }
  return out;
}

describe("aws-aif-c01 teach before test", () => {
  it("every question links to a lesson", () => {
    expect(course.questions.filter((q) => !q.lesson).map((q) => q.id)).toEqual([]);
  });

  it("only tests concepts taught at or before the question's lesson", () => {
    expect(untaught()).toEqual([]);
  });

  it("study and quest decks only use lessons the player has seen", () => {
    const pool = [{ id: "a", lesson: "x" }, { id: "b", lesson: "y" }];
    expect(taughtPool(pool, ["x"]).map((q) => q.id)).toEqual(["a"]);
    expect(taughtPool(pool, []).map((q) => q.id)).toEqual(["a", "b"]);
  });
});
