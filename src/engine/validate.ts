import { examQuestions, questionKind } from "./game";
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
    if (!declared.has(questionKind(q))) err(`${where} uses the "${questionKind(q)}" format, which exam.questionTypes doesn't list`);
    if (!domainIds.has(q.domain)) err(`${where} has unknown domain "${q.domain}"`);
    if (!q.prompt.trim()) err(`${where} has an empty prompt`);
    if (!q.explanation.trim()) err(`${where} has no explanation`);
    if (!q.lesson) err(`${where} isn't linked to a lesson (add \`lesson: "<lesson id>"\`)`);
    else if (!lessons.some((l) => l.id === q.lesson)) err(`${where} links unknown lesson "${q.lesson}"`);
    if (q.type === "order") {
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
    for (const id of l.check) if (!questionIds.has(id)) err(`lesson "${l.id}" checks unknown question "${id}"`);
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
