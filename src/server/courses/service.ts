import "server-only";
import type { GradeBody, Hub, Item, Items, LessonPayload } from "@/api/contracts";
import { CODE_GAMES, gamePool, type CodeGameId } from "@/engine/code-games";
import { examQuestions, levelDeck, scaledScore, weightedExamDeck } from "@/engine/game";
import { gradeAnswer } from "@/engine/grade";
import { indexCourse } from "@/engine/indexes";
import { questionsForLevel, type LevelChoice } from "@/engine/levels";
import { practicePool } from "@/engine/practice";
import { topicsDone, unlockedQuestions } from "@/engine/practice/gating";
import { parseKey } from "@/engine/srs";
import { SCENARIO_GAMES, type ScenarioGameId } from "@/engine/scenarios";
import { isCodeTrack } from "@/engine/tracks";
import type { Course, Question } from "@/engine/types";
import { scenarioById, scenariosFor } from "@/scenarios";
import { ApiError } from "@/server/api/http";
import { findCourse, findQuestion, summarize, toJson } from "./repository";

/** Endpoint logic, free of HTTP so it can be tested directly. Each returns JSON-safe data. */

export function hub(c: Course): Hub {
  const { allLessons } = indexCourse(c);
  return {
    course: summarize(c),
    domains: c.domains,
    lessons: allLessons.map(({ id, title, task, domain, index, level }) => ({ id, title, task, domain, index, ...(level ? { level } : {}) })),
    exam: c.exam,
    modes: c.modes,
    examModes: c.config.examModes,
  };
}

export function lesson(c: Course, id: string) {
  const idx = indexCourse(c);
  const l = idx.lesson[id];
  if (!l) throw new ApiError("not_found", `No lesson "${id}" in ${c.id}`);
  const at = idx.allLessons.indexOf(l);
  return toJson({
    lesson: l,
    questions: l.check.map((q) => idx.question[q]).filter(Boolean),
    prev: idx.allLessons[at - 1]?.id ?? null,
    next: idx.allLessons[at + 1]?.id ?? null,
  }) as LessonPayload;
}

/**
 * Server-side gating: the client sends the lessons it finished; only questions whose concepts
 * are all done come back. Locked questions never leave the server.
 */
export function practice(c: Course, done: string[], size?: number) {
  const topics = c.topics ?? [];
  const finished = topicsDone(topics, { lessonsDone: done });
  const pool = practicePool(c);
  const open = unlockedQuestions(pool, new Set(finished));
  return { topicsDone: finished, unlocked: open.length, locked: pool.length - open.length, questions: (size ? open.slice(0, size) : open) as Question[] };
}

export const cheatsheet = (c: Course) => c.cheatsheet;

export function games(c: Course) {
  return CODE_GAMES.map((g) => ({ id: g.id, name: g.name, rule: g.rule, count: gamePool(c, g.id).length })).filter((g) => g.count > 0);
}

export function gameQuestions(c: Course, game: CodeGameId) {
  const questions = gamePool(c, game);
  if (!questions.length) throw new ApiError("not_found", `${c.id} has no ${game} game`);
  return { game, questions };
}

export function scenarios(c: Course) {
  return SCENARIO_GAMES.map((g) => ({ id: g.id, name: g.name, count: scenariosFor(c.id, g.id).length })).filter((g) => g.count > 0);
}

export function scenarioItems(c: Course, game: ScenarioGameId) {
  const items = scenariosFor(c.id, game);
  if (!items.length) throw new ApiError("not_found", `${c.id} has no ${game} scenarios`);
  return { game, items };
}

/** A freshly drawn exam (weighted by domain, official formats only) or timed-drill deck. Raw questions; the client shuffles options. */
export function pool(c: Course, kind: "exam" | "timed", mode?: string, level: LevelChoice = "all") {
  if (kind === "exam") {
    const modes = c.config.examModes;
    const m = mode ? modes.find((x) => x.id === mode) : modes[0];
    if (!m) throw new ApiError("not_found", `No exam mode "${mode}" in ${c.id}`);
    const deck = weightedExamDeck(c, m.questions, isCodeTrack(c) ? questionsForLevel(c, level, examQuestions(c)) : examQuestions(c));
    return { mode: m.id, minutes: m.minutes, questions: deck.map((q) => findQuestion(c, q.id)!) };
  }
  const t = c.config.timed;
  const deck = levelDeck(c, level, questionsForLevel(c, level), t.questions);
  return { mode: "timed", minutes: Math.ceil((t.questions * t.secondsPerQuestion) / 60), questions: deck.map((q) => findQuestion(c, q.id)!) };
}

/** Grade answers given in authored option order. Exam-style scale and pass mark for certification courses. */
export function grade(c: Course, body: GradeBody) {
  const results: { id: string; correct: boolean; answer: number[] }[] = [];
  const unknown: string[] = [];
  for (const a of body.answers) {
    const q = findQuestion(c, a.id);
    if (!q) unknown.push(a.id);
    else results.push({ id: a.id, ...gradeAnswer(q, a.picked) });
  }
  const correct = results.filter((r) => r.correct).length;
  const exam = !isCodeTrack(c);
  const scaled = exam ? scaledScore(c, correct, results.length) : null;
  return { correct, total: results.length, scaled, passed: scaled === null ? null : scaled >= c.exam.scale.pass, results, unknown };
}

/** Daily Review items by key (`<course>:<q|card|code|sc>:<id>`), across courses. */
export function items(keys: string[]): Items {
  const out: Item[] = [];
  const missing: string[] = [];
  for (const key of keys) {
    const k = parseKey(key);
    const c = k && findCourse(k.courseId);
    const item = !k || !c ? undefined : k.kind === "q" ? findQuestion(c, k.id) : k.kind === "card" ? c.cards.find((x) => x.id === k.id) : k.kind === "code" ? c.coding?.find((x) => x.id === k.id) : scenarioById(k.courseId, k.id);
    if (!k || !item) missing.push(key);
    else out.push({ key, courseId: k.courseId, kind: k.kind, item } as Item);
  }
  return toJson({ items: out, missing }) as Items;
}
