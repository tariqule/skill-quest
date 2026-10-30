import { examQuestions, questionKind } from "./game";
import { BEGINNER_MIN, MIN_PER_LEVEL, SENIORITY } from "./levels";
import { EXTRA_KINDS, isCodeTrack } from "./tracks";
import type { Course } from "./types";

/**
 * Checks a course for authoring mistakes. Returns a list of human-readable
 * problems (empty when the course is valid). Run by `npm test`.
 */
export function validateCourse(course: Course): string[] {
  const errors: string[] = [];
  const err = (msg: string) => errors.push(`[${course.id}] ${msg}`);

  const dupes = (label: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) err(`duplicate ${label} id "${id}"`);
      seen.add(id);
    }
  };

  const domainIds = new Set(course.domains.map((d) => d.id));
  const questionIds = new Set(course.questions.map((q) => q.id));
  const lessons = Object.values(course.lessons).flat();

  dupes("domain", course.domains.map((d) => d.id));
  dupes("question", course.questions.map((q) => q.id));
  dupes("card", course.cards.map((c) => c.id));
  dupes("lesson", lessons.map((l) => l.id));

  const weight = course.domains.reduce((s, d) => s + d.weight, 0);
  if (weight !== 100) err(`domain weights add up to ${weight}, expected 100`);

  const { min, max, pass } = course.exam.scale;
  if (!(min < pass && pass <= max)) err(`exam scale must satisfy min < pass <= max (got ${min}/${pass}/${max})`);
  if (course.exam.unscored >= course.exam.questions) err("exam.unscored must be less than exam.questions");

  const declared = new Set(course.exam.questionTypes.map((t) => t.id));
  for (const q of course.questions) {
    const where = `question "${q.id}"`;
    if (!declared.has(questionKind(q)) && !(isCodeTrack(course) && (EXTRA_KINDS.some((k) => k.id === questionKind(q)) || q.type === "parsons" || q.type === "bug"))) err(`${where} uses the "${questionKind(q)}" format, which exam.questionTypes doesn't list`);
    if (!domainIds.has(q.domain)) err(`${where} has unknown domain "${q.domain}"`);
    if (!q.prompt.trim()) err(`${where} has an empty prompt`);
    if (!q.explanation.trim()) err(`${where} has no explanation`);
    if (!q.lesson) err(`${where} isn't linked to a lesson (add \`lesson: "<lesson id>"\`)`);
    else if (!lessons.some((l) => l.id === q.lesson)) err(`${where} links unknown lesson "${q.lesson}"`);
    if (q.type === "lines") {
      const n = q.code.trim() ? q.code.replace(/^\n+|\s+$/g, "").split("\n").length : 0;
      if (n < 3) err(`${where} needs a code snippet of at least 3 lines`);
      if (q.answer.length === 0) err(`${where} has no correct line`);
      if (q.answer.some((l) => l < 1 || l > n)) err(`${where} has an answer line outside its ${n}-line snippet`);
      const src = q.code.replace(/^\n+|\s+$/g, "").split("\n");
      if (q.answer.some((l) => /^[\s{}()[\];]*$/.test(src[l - 1] ?? ""))) err(`${where} points at a blank line or a lone brace`);
      if (q.answer.length > 1 && !/choose|tap|select/i.test(q.prompt)) err(`${where} has ${q.answer.length} answer lines but the prompt doesn't say how many to pick`);
    } else if (q.type === "fill") {
      const markers = [...q.code.matchAll(/\{\{(\d+)\}\}/g)].map((m) => Number(m[1]));
      if (q.blanks.length < 1 || q.blanks.length > 4) err(`${where} needs 1 to 4 blanks`);
      if (markers.length !== q.blanks.length || markers.some((n, i) => n !== i + 1)) err(`${where} must mark its blanks {{1}}…{{${q.blanks.length}}} once each, in order`);
      q.blanks.forEach((b, i) => {
        if (b.options.length < 3 || b.options.length > 5) err(`${where} blank ${i + 1} needs 3 to 5 options`);
        if (new Set(b.options).size !== b.options.length) err(`${where} blank ${i + 1} has duplicate options`);
        if (b.answer < 0 || b.answer >= b.options.length) err(`${where} blank ${i + 1} has an answer index outside its options`);
      });
    } else if (q.type === "parsons") {
      const lines = q.code.split("\n").filter((l) => l.trim());
      if (lines.length < 3) err(`${where} needs at least 3 solution lines`);
      if ((q.distractors ?? []).some((d) => lines.some((l) => l.trim() === d.trim()))) err(`${where} has a decoy that is also a solution line`);
    } else if (q.type === "bug") {
      const lines = q.code.split("\n");
      if (q.line < 1 || q.line > lines.length || !lines[q.line - 1].trim()) err(`${where} points at a line that doesn't exist or is blank`);
      if (q.fixes.length < 3 || q.fixes.length > 4) err(`${where} needs 3 or 4 fixes`);
      if (q.fix < 0 || q.fix >= q.fixes.length) err(`${where} has a fix index outside its fixes`);
      if (new Set(q.fixes).size !== q.fixes.length) err(`${where} has duplicate fixes`);
      if (q.fixes.some((f) => f.trim() === lines[q.line - 1]?.trim())) err(`${where} offers the buggy line itself as a fix`);
    } else if (q.type === "output") {
      if (q.choices && !q.choices.some((c) => q.answers.includes(c))) err(`${where} has choices that don't include an accepted answer`);
      if (q.answers.length === 0 || q.answers.some((a) => !a.trim())) err(`${where} needs at least one non-empty accepted answer`);
      if (!q.code.trim()) err(`${where} needs code to read`);
    } else if (q.type === "order") {
      if (q.items.length < 3) err(`${where} needs at least 3 items to order`);
      if (new Set(q.items).size !== q.items.length) err(`${where} has duplicate items`);
    } else if (q.type === "match") {
      if (q.pairs.length < 3) err(`${where} needs at least 3 pairs`);
      if (new Set(q.pairs.map(([, r]) => r)).size !== q.pairs.length) err(`${where} has duplicate responses`);
    } else {
      if (q.options.length < 3) err(`${where} needs at least 3 options`);
      if (q.answer.length === 0) err(`${where} has no correct answer`);
      if (q.answer.some((i) => i < 0 || i >= q.options.length)) err(`${where} has an answer index outside its options`);
      if (new Set(q.answer).size !== q.answer.length) err(`${where} repeats an answer index`);
      if (new Set(q.options).size !== q.options.length) err(`${where} has duplicate options`);
      if (q.answer.length > 1 && !/choose/i.test(q.prompt)) err(`${where} has ${q.answer.length} answers but the prompt doesn't say "Choose ${q.answer.length}"`);
    }
  }

  for (const c of course.cards) if (!domainIds.has(c.domain)) err(`card "${c.id}" has unknown domain "${c.domain}"`);

  dupes("challenge", course.challenges.map((c) => c.id));
  const lessonIds = new Set(lessons.map((l) => l.id));
  for (const c of course.challenges) {
    if (!domainIds.has(c.domain)) err(`challenge "${c.id}" has unknown domain "${c.domain}"`);
    if (c.lesson && !lessonIds.has(c.lesson)) err(`challenge "${c.id}" links unknown lesson "${c.lesson}"`);
    if (c.lesson && !(course.lessons[c.domain] ?? []).some((l) => l.id === c.lesson)) err(`challenge "${c.id}" links a lesson from another domain`);
  }
  dupes("coding challenge", (course.coding ?? []).map((c) => c.id));
  for (const c of course.coding ?? []) {
    const where = `coding challenge "${c.id}"`;
    if (!domainIds.has(c.domain)) err(`${where} has unknown domain "${c.domain}"`);
    if (c.lesson && !lessonIds.has(c.lesson)) err(`${where} links unknown lesson "${c.lesson}"`);
    if (!SENIORITY.includes(c.level)) err(`${where} needs a level`);
    if (!c.prompt.trim() || !c.explanation.trim() || !c.title.trim()) err(`${where} needs a title, prompt, and explanation`);
    if (!new RegExp(`function\\s+${c.fn}\\b|(?:const|let|var)\\s+${c.fn}\\s*=`).test(c.starter)) err(`${where} starter must define \`${c.fn}\``);
    if (c.tests.length < 3) err(`${where} needs at least 3 tests`);
    if (c.tests.every((t) => t.hidden)) err(`${where} needs at least one visible test`);
    if (c.hints.length < 2) err(`${where} needs at least 2 hints`);
    if (!c.solution.trim() || c.solution.trim() === c.starter.trim()) err(`${where} needs a reference solution that differs from the starter`);
  }
  const st = course.config.study;
  if (!st.minuteOptions.includes(st.defaultMinutes)) err("study.defaultMinutes must be one of study.minuteOptions");
  if (st.playQuestions < 1 || st.challengeEvery < 1) err("study.playQuestions and study.challengeEvery must be at least 1");

  for (const d of course.domains) {
    const pool = course.questions.filter((q) => q.domain === d.id).length;
    if (pool < course.config.quest.length) err(`domain "${d.id}" has ${pool} questions; its trial needs ${course.config.quest.length}`);
    if (!(course.lessons[d.id]?.length)) err(`domain "${d.id}" has no lessons`);
    const tasks = new Set((course.guide.tasks[d.id] ?? []).map((t) => t.id));
    for (const l of course.lessons[d.id] ?? []) {
      for (const t of l.task.split(" · ")) if (!tasks.has(t)) err(`lesson "${l.id}" cites task "${t}", which domain "${d.id}" doesn't define`);
    }
  }

  for (const l of lessons) {
    if (l.check.length === 0) err(`lesson "${l.id}" has no check questions`);
    for (const id of l.check) {
      if (!questionIds.has(id)) err(`lesson "${l.id}" checks unknown question "${id}"`);
      else {
        const q = course.questions.find((x) => x.id === id)!;
        if (q.lesson !== l.id) err(`lesson "${l.id}" checks "${id}", which tests lesson "${q.lesson}"; check questions should test their own lesson`);
      }
    }
  }

  if (isCodeTrack(course)) {
    for (const q of course.questions) if (!q.level) err(`question "${q.id}" needs a level (beginner, junior, intermediate, senior, or staff)`);
    for (const l of lessons) if (!l.level) err(`lesson "${l.id}" needs a level`);
    for (const lv of SENIORITY.filter((x) => x !== "beginner")) {
      const n = course.questions.filter((q) => q.level === lv).length;
      if (n < MIN_PER_LEVEL) err(`level "${lv}" has ${n} questions; each level needs at least ${MIN_PER_LEVEL}`);
    }
  }
  // Beginner ("Start here") content, on every course.
  const beginnerQs = course.questions.filter((q) => q.level === "beginner");
  const beginnerTotal = Math.min(BEGINNER_MIN.questions, BEGINNER_MIN.questionsPerDomain * course.domains.length);
  if (beginnerQs.length < beginnerTotal) err(`has ${beginnerQs.length} beginner questions; needs at least ${beginnerTotal}`);
  for (const d of course.domains) {
    const ls = (course.lessons[d.id] ?? []).filter((l) => l.level === "beginner").length;
    const qs = beginnerQs.filter((q) => q.domain === d.id).length;
    if (ls < BEGINNER_MIN.lessonsPerDomain) err(`domain "${d.id}" has ${ls} beginner lessons; needs at least ${BEGINNER_MIN.lessonsPerDomain}`);
    if (qs < BEGINNER_MIN.questionsPerDomain) err(`domain "${d.id}" has ${qs} beginner questions; needs at least ${BEGINNER_MIN.questionsPerDomain}`);
  }
  for (const q of beginnerQs) {
    if (q.type === "order" || q.type === "match" || q.type === "lines" || q.type === "bug") err(`beginner question "${q.id}" should be choice, fill, output, or parsons (keep it gentle)`);
  }
  if (course.exam.questionTypes.every((t) => t.practiceOnly)) err("at least one question type must be an official (not practiceOnly) format");
  const official = examQuestions(course).length;
  for (const m of course.config.examModes) {
    if (m.unscored >= m.questions) err(`exam mode "${m.id}" has more unscored than total questions`);
    if (m.questions > official) err(`exam mode "${m.id}" needs ${m.questions} questions in official formats; the course has ${official}`);
  }
  if (course.config.boss.questions > course.questions.length) err("boss.questions is larger than the question bank");
  for (const [name, t] of [["lesson.timedChallenge", course.config.lesson.timedChallenge], ["timed", course.config.timed]] as const) {
    if (t.questions < 1) err(`${name}.questions must be at least 1`);
    if (t.secondsPerQuestion < 5) err(`${name}.secondsPerQuestion must be at least 5`);
    if (!(t.passShare > 0 && t.passShare <= 1)) err(`${name}.passShare must be between 0 and 1`);
  }

  return errors;
}

/** How much longer than every distractor the correct option may be before the "longest option" lint flags it. */
export const LONGEST_OPTION_RATIO = 1.2;

/**
 * Flags single-answer choice questions whose correct option is clearly the longest, which lets
 * players guess by length. Returns warnings (empty when every question passes). Courses opt in
 * through `LONGEST_OPTION_STRICT` in validate.test.ts; other courses only see it as advice.
 */
export function longestOptionWarnings(course: Course, ratio = LONGEST_OPTION_RATIO): string[] {
  const out: string[] = [];
  for (const q of course.questions) {
    if (!(q.type === undefined || q.type === "choice") || q.answer.length !== 1) continue;
    const right = q.options[q.answer[0]]?.length ?? 0;
    const longestWrong = Math.max(0, ...q.options.filter((_, i) => i !== q.answer[0]).map((o) => o.length));
    if (longestWrong > 0 && right > longestWrong * ratio)
      out.push(`[${course.id}] question "${q.id}": the correct option (${right} chars) is more than ${Math.round((ratio - 1) * 100)}% longer than the longest distractor (${longestWrong} chars)`);
  }
  return out;
}
