import { LONGEST_OPTION_RATIO } from "@/engine/validate";
import { BANNED_CHARACTERS, MAX_POINT_WORDS, PROSE_SHORTHAND } from "@/engine/voice";

/**
 * The shape of one topic's content. Topic files are plain data (no React), so they can be
 * validated, counted and tested without rendering anything.
 */

/** The picture shown above a topic's first screen. Rendered by the course's adapter. */
export type Visual =
  | { kind: "flow"; steps: readonly { icon: string; label: string; sub: string }[] }
  | { kind: "ladder"; caption?: string; rungs: readonly { icon: string; name: string; text: string }[] }
  | { kind: "tiles"; tiles: readonly { icon: string; title: string; text: string }[] }
  | { kind: "code"; lang: string; code: string; caption?: string };

/** One screen teaches one idea. A worked example walks through a calculation or a trace. */
export type Screen = { kind: "idea"; text: string } | { kind: "example"; title: string; steps: readonly string[] };

/** One end-of-topic quiz item or practice item. */
export type QuizItem =
  | { kind: "mcq"; id: string; prompt: string; options: readonly [string, string, string, string]; answer: 0 | 1 | 2 | 3; explanation: string }
  | { kind: "tf"; id: string; statement: string; answer: boolean; explanation: string };

export interface Source {
  title: string;
  url: string;
  /** e.g. "CC BY 4.0", or "Link only" when we only point at it. */
  license: string;
}

/** Module ids, in course order. */
export const MODULE_IDS = ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "m10"] as const;
export type ModuleId = (typeof MODULE_IDS)[number];

export interface TopicContent {
  /** Must match a topic id in the curriculum, e.g. "t-intro". */
  id: string;
  module: ModuleId;
  title: string;
  visual: Visual;
  screens: readonly Screen[];
  tip: string;
  /** End-of-topic quiz: exactly 3 multiple choice and 2 true/false (one true, one false). */
  quiz: readonly QuizItem[];
  /** Extra practice-only items. Tagged with this topic plus `practiceNeeds`. */
  practice: readonly QuizItem[];
  /** Earlier topics the practice items also lean on. */
  practiceNeeds?: readonly string[];
  sources: readonly Source[];
}

/** How many quiz items of each kind every topic has. */
export const QUIZ_SHAPE = { mcq: 3, tf: 2 } as const;
export const MIN_SCREENS = 4;

/**
 * Checks one topic file at the boundary, before the course turns it into lessons and questions.
 * Returns readable problems; an empty list means the topic is valid.
 */
export function validateTopic(t: TopicContent): string[] {
  const out: string[] = [];
  const where = `topic "${t.id}"`;
  if (!/^t-[a-z0-9-]+$/.test(t.id)) out.push(`${where}: id must look like "t-name"`);
  if (t.screens.length < MIN_SCREENS) out.push(`${where}: needs at least ${MIN_SCREENS} screens`);
  if (!t.screens.some((s) => s.kind === "example")) out.push(`${where}: needs a worked example screen`);
  for (const s of t.screens) if (s.kind === "example" && s.steps.length < 2) out.push(`${where}: example "${s.title}" needs at least 2 steps`);
  for (const text of t.screens.flatMap(readerScreens)) out.push(...proseProblems(text).map((m) => `${where}: screen "${text.slice(0, 40)}…" ${m}`));
  if (!t.sources.length) out.push(`${where}: credit at least one source`);
  for (const s of t.sources) if (!s.url.startsWith("https://")) out.push(`${where}: source "${s.title}" needs an https link`);

  const count = (kind: QuizItem["kind"]) => t.quiz.filter((q) => q.kind === kind).length;
  if (count("mcq") !== QUIZ_SHAPE.mcq || count("tf") !== QUIZ_SHAPE.tf) out.push(`${where}: quiz must be ${QUIZ_SHAPE.mcq} multiple choice and ${QUIZ_SHAPE.tf} true/false`);
  const tfAnswers = t.quiz.flatMap((q) => (q.kind === "tf" ? [q.answer] : []));
  if (tfAnswers.length && !(tfAnswers.includes(true) && tfAnswers.includes(false))) out.push(`${where}: quiz true/false needs one true and one false`);

  const ids = new Set<string>();
  for (const q of [...t.quiz, ...t.practice]) {
    if (ids.has(q.id)) out.push(`${where}: item id "${q.id}" is repeated`);
    ids.add(q.id);
    if (!q.id.startsWith(`${t.id}-`)) out.push(`${where}: item id "${q.id}" must start with "${t.id}-"`);
    if (!q.explanation.trim()) out.push(`${where}: item "${q.id}" needs an explanation`);
    out.push(...itemProblems(q).map((m) => `${where}: item "${q.id}" ${m}`));
  }
  return out;
}

/**
 * The reader screens one content screen becomes. A worked example gets one screen per step so
 * each stays short. Only the first step carries the title, so the steps don't read as repeats.
 * The "Step k of N" lead is what the reader keys on to drop its card-number badge (see `exampleStep`).
 */
export function readerScreens(s: Screen): string[] {
  switch (s.kind) {
    case "idea":
      return [s.text];
    case "example":
      return s.steps.map((step, i) => {
        const lead = `Step ${i + 1} of ${s.steps.length}.`;
        return i === 0 ? `**Worked example: ${s.title}. ${lead}** ${step}` : `**${lead}** ${step}`;
      });
    default:
      return assertNever(s);
  }
}

/** The course voice rules (src/engine/voice.ts) that apply to one reader screen. */
function proseProblems(text: string): string[] {
  const out = PROSE_SHORTHAND.filter(({ re }) => re.test(text)).map(({ why }) => `uses ${why}`);
  if (BANNED_CHARACTERS.some((ch) => text.includes(ch))) out.push("uses an em dash");
  if (text.split(/\s+/).length > MAX_POINT_WORDS) out.push(`is longer than ${MAX_POINT_WORDS} words`);
  return out;
}

function itemProblems(q: QuizItem): string[] {
  switch (q.kind) {
    case "mcq": {
      const out: string[] = [];
      if (new Set(q.options).size !== q.options.length) out.push("has duplicate options");
      const right = q.options[q.answer].length;
      const longestWrong = Math.max(...q.options.filter((_, i) => i !== q.answer).map((o) => o.length));
      if (right > longestWrong * LONGEST_OPTION_RATIO) out.push("gives itself away: the right option is much the longest");
      return out;
    }
    case "tf":
      return q.statement.trim().endsWith("?") ? ["should be a statement, not a question"] : [];
    default:
      return assertNever(q);
  }
}

/** Compile-time exhaustiveness guard for switches over unions. */
export function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(x)}`);
}
