import type { Course, Lesson, Question } from "./types";
import { longestOptionWarnings } from "./validate";

/** A concept label and the pattern that spots it in text. */
export type ConceptList = [label: string, pattern: RegExp][];

/** What a question tests: its prompt plus its correct content. Distractors don't need teaching. */
export function testedText(q: Question): string {
  const x = q as unknown as Record<string, unknown>;
  const parts = [String(x.prompt ?? "")];
  if (Array.isArray(x.options) && Array.isArray(x.answer)) for (const i of x.answer as number[]) parts.push(String((x.options as string[])[i]));
  if (Array.isArray(x.items)) parts.push(...(x.items as string[]));
  if (Array.isArray(x.pairs)) parts.push(...(x.pairs as string[][]).flat());
  if (typeof x.answer === "string") parts.push(x.answer);
  return parts.join(" ");
}

function defaultLessonText(l: Lesson) {
  return [l.title, ...l.points, l.tip ?? ""].join(" ").replace(/\*\*|`/g, "");
}

/**
 * Teach before test, for any course: each question must link to a lesson, and every
 * concept it tests (from the course's concept list) must be taught in that lesson or
 * an earlier one on the path. An empty concept list only checks the lesson links.
 */
export function teachBeforeTestWarnings(course: Course, concepts: ConceptList = [], lessonText: (l: Lesson) => string = defaultLessonText): string[] {
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
    for (const [label, re] of concepts) if (re.test(text) && !re.test(taught)) out.push(`${q.id} (${q.lesson}): ${label}`);
  }
  return out;
}

export interface QualityRow {
  course: string;
  longestOption: number;
  teachBeforeTest: number;
  conceptsChecked: number;
}

/** One row per course for the non-blocking quality report. */
export function qualityReport(courses: Course[], conceptLists: Record<string, ConceptList> = {}, lessonText?: (l: Lesson) => string): QualityRow[] {
  return courses.map((c) => ({
    course: c.id,
    longestOption: longestOptionWarnings(c).length,
    teachBeforeTest: teachBeforeTestWarnings(c, conceptLists[c.id] ?? [], lessonText).length,
    conceptsChecked: (conceptLists[c.id] ?? []).length,
  }));
}
