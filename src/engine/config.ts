import type { ExamFormat, ExamMode, GameConfig } from "./types";

/** Engine defaults. A course overrides any subset through `config` in its definition. */
export const DEFAULT_CONFIG: GameConfig = {
  xp: {
    lessonComplete: 20,
    lessonCheck: 5,
    questCorrect: 10,
    starBonus: 20,
    reviewCorrect: 12,
    lightningCorrect: 5,
    timedCorrect: 6,
    studyCorrect: 8,
    challengeSolved: 15,
    codingSolved: 40,
    studyMinute: 2,
    flashcardKnown: 3,
    bossCorrect: 5,
    bossPassBonus: 150,
    examCorrect: 4,
    examPassBonus: 200,
    matchMax: 60,
    matchMin: 10,
    matchMistakePenalty: 5,
  },
  quest: { length: 10, hearts: 3, beginnerHearts: 5, starThresholds: [0.9, 0.7, 0.5] },
  lesson: {
    retryMissed: true,
    timedChallenge: { enabled: true, questions: 4, secondsPerQuestion: 25, passShare: 0.75 },
  },
  timed: { questions: 10, secondsPerQuestion: 20, passShare: 0.7 },
  study: { minuteOptions: [5, 10, 15, 20, 0], defaultMinutes: 10, playQuestions: 8, challengeEvery: 2 },
  review: { maxQuestions: 15 },
  lightning: { seconds: 60, penaltySeconds: 3, badgeAt: 12 },
  match: { pairs: 8, badgeSeconds: 45 },
  flashcards: { sessionSize: 12 },
  boss: { questions: 40, minutes: 60 },
  examModes: [],
  dailyGoals: [
    { xp: 50, name: "Casual", icon: "🌱", note: "~10 min a day" },
    { xp: 150, name: "Regular", icon: "🚀", note: "~20 min a day" },
    { xp: 250, name: "Serious", icon: "🔥", note: "~35 min a day" },
    { xp: 400, name: "Exam next week", icon: "⚡", note: "~1 hour a day" },
  ],
};

/** Full and half-length simulations derived from the real exam format. */
export function defaultExamModes(exam: ExamFormat): ExamMode[] {
  return [
    { id: "full", name: "Full simulation", icon: "🏛️", questions: exam.questions, unscored: exam.unscored, minutes: exam.minutes, full: true },
    {
      id: "half",
      name: "Half exam",
      icon: "⏳",
      questions: Math.ceil(exam.questions / 2),
      unscored: Math.floor(exam.unscored / 2),
      minutes: Math.ceil(exam.minutes / 2),
      full: false,
    },
  ];
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Merge overrides into defaults. Objects merge key by key; arrays and primitives replace. */
export function deepMerge<T>(base: T, override: unknown): T {
  if (!isObject(base) || !isObject(override)) return (override === undefined ? base : override) as T;
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(override)) out[k] = deepMerge((base as Record<string, unknown>)[k], v);
  return out as T;
}

export function resolveConfig(exam: ExamFormat, override: unknown): GameConfig {
  const config = deepMerge(DEFAULT_CONFIG, override);
  return config.examModes.length ? config : { ...config, examModes: defaultExamModes(exam) };
}
