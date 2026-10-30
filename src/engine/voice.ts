import type { Course } from "./types";

/**
 * Words and phrases that make writing sound machine-made or like marketing. The voice lint
 * (voice.test.ts) fails if any course text uses them. Match is case-insensitive, on word edges.
 */
export const BANNED_PHRASES = [
  "delve",
  "delves",
  "crucial",
  "crucially",
  "leverage",
  "leverages",
  "leveraging",
  "robust",
  "seamless",
  "seamlessly",
  "it's important to note",
  "it is important to note",
  "it's worth noting",
  "it is worth noting",
  "in today's",
  "unlock the power",
  "harness the power",
  "dive into",
  "deep dive",
  "game-changer",
  "game changer",
  "plays a vital role",
  "plays a crucial role",
  "plays a key role",
  "vital role",
  "ever-evolving",
  "evolving landscape",
  "navigate the complexities",
  "embark",
  "tapestry",
  "realm",
  "furthermore",
  "moreover",
  "in conclusion",
  "utilize",
  "utilizes",
  "utilizing",
  "a testament to",
  "paramount",
  "pivotal",
  "myriad",
  "plethora",
  "meticulous",
  "meticulously",
  "elevate your",
  "empower",
  "empowers",
  "supercharge",
  "unleash",
  "in essence",
  "at its core",
];

/** Characters we don't use in course text (em dashes read as machine-written; use a comma, colon or full stop). */
export const BANNED_CHARACTERS = ["—"];

const PATTERNS = BANNED_PHRASES.map((p) => ({ p, re: new RegExp(`(^|[^a-z])${p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[^a-z])`, "i") }));

/** Every player-facing string in a course, labelled with where it came from. */
export function courseStrings(course: Course): { where: string; text: string }[] {
  const out: { where: string; text: string }[] = [];
  const add = (where: string, text: string | undefined) => text && out.push({ where, text });
  add("tagline", course.tagline);
  for (const d of course.domains) {
    add(`domain ${d.id} name`, d.name);
    add(`domain ${d.id} summary`, d.summary);
  }
  for (const [, ls] of Object.entries(course.lessons))
    for (const l of ls) {
      add(`lesson ${l.id} title`, l.title);
      l.points.forEach((p, i) => add(`lesson ${l.id} point ${i + 1}`, p));
      add(`lesson ${l.id} tip`, l.tip);
    }
  for (const q of course.questions) {
    add(`question ${q.id} prompt`, q.prompt);
    add(`question ${q.id} explanation`, q.explanation);
    if (q.type === undefined || q.type === "choice") q.options.forEach((o, i) => add(`question ${q.id} option ${i + 1}`, o));
    if (q.type === "order") q.items.forEach((o, i) => add(`question ${q.id} item ${i + 1}`, o));
    if (q.type === "match") q.pairs.forEach(([a, b], i) => add(`question ${q.id} pair ${i + 1}`, `${a} ${b}`));
  }
  for (const c of course.cards) add(`card ${c.id}`, `${c.term} ${c.definition}`);
  for (const c of course.challenges) {
    add(`challenge ${c.id} goal`, c.goal);
    add(`challenge ${c.id} hint`, c.hint);
    add(`challenge ${c.id} takeaway`, c.takeaway);
  }
  for (const c of course.coding ?? []) {
    add(`coding ${c.id} prompt`, c.prompt);
    add(`coding ${c.id} explanation`, c.explanation);
    c.hints.forEach((h, i) => add(`coding ${c.id} hint ${i + 1}`, h));
  }
  const g = course.guide;
  g.facts.forEach((f, i) => add(`guide fact ${i + 1}`, `${f.label} ${f.detail}`));
  g.tips.forEach((t, i) => add(`guide tip ${i + 1}`, typeof t === "string" ? t : JSON.stringify(t)));
  [...g.candidate.is, ...g.candidate.isNot].forEach((t, i) => add(`guide candidate ${i + 1}`, t));
  for (const sec of course.cheatsheet) sec.items.forEach(([k, v]) => add(`cheatsheet ${sec.title}`, `${k} ${v}`));
  return out;
}

/**
 * Note-taking shorthand that makes teaching text read like a cheat sheet instead of a person
 * talking. Checked only in prose: lesson points and tips, summaries, prompts, explanations and
 * flashcard definitions (options, ordering steps and code are allowed to be terse).
 */
export const PROSE_SHORTHAND: { re: RegExp; why: string }[] = [
  { re: /→|⇒|->/, why: "arrow shorthand (write the sentence out)" },
  { re: /\s=\s/, why: "\" = \" shorthand (say \"means\" or \"is\")" },
  { re: /\b(e\.g\.|i\.e\.|etc\.|vs\.)/i, why: "abbreviation (write \"for example\", \"that is\", \"and so on\", \"versus\")" },
];

/** Longest a lesson point may be, in words. Long points become two points. */
export const MAX_POINT_WORDS = 40;

const PROSE = /(lesson .* (point|tip)|summary|prompt|explanation|card )/;

/** Voice problems in a course: banned phrases or characters, shorthand in prose, overlong points. */
export function voiceProblems(course: Course): string[] {
  const problems: string[] = [];
  for (const { where, text } of courseStrings(course)) {
    const plain = text.replace(/`[^`]*`/g, ""); // code spans can contain anything
    for (const { p, re } of PATTERNS) if (re.test(plain)) problems.push(`[${course.id}] ${where}: "${p}"`);
    for (const ch of BANNED_CHARACTERS) if (plain.includes(ch)) problems.push(`[${course.id}] ${where}: "${ch}" (use a comma, colon or full stop)`);
    if (PROSE.test(where)) for (const { re, why } of PROSE_SHORTHAND) if (re.test(plain)) problems.push(`[${course.id}] ${where}: ${why}`);
    if (/lesson .* point/.test(where) && plain.split(/\s+/).length > MAX_POINT_WORDS) problems.push(`[${course.id}] ${where}: longer than ${MAX_POINT_WORDS} words`);
    // Bold only renders in rich text (points, tips, prompts, options, explanations, cards); titles and summaries show raw.
    if (/(title|name|summary|tagline)$/.test(where) && text.includes("**")) problems.push(`[${course.id}] ${where}: "**" bold isn't shown here; remove it`);
  }
  return problems;
}
