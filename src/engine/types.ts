import type { ReactNode } from "react";

/**
 * The contract every course implements. The engine (store, path, games, exam
 * simulator, guide) reads only these types, so a new provider or certification
 * is a new folder under src/courses/ that exports a `Course`.
 */

export interface Provider {
  /** Short slug, e.g. "aws", "gcp", "azure", "cncf". */
  id: string;
  name: string;
  /** Brand-neutral accent colour used for the course card. */
  color: string;
  icon: string;
}

export interface Domain {
  id: string;
  number: number;
  name: string;
  /** Themed name shown on the mission map, e.g. "The Bedrock Citadel". */
  world: string;
  /** Share of the scored exam, in percent. Weights across domains should total 100. */
  weight: number;
  emoji: string;
  color: string;
  summary: string;
}

// ───────────── Questions ─────────────

interface BaseQuestion {
  id: string;
  domain: string;
  /** Lesson id of the concept this question tests. Powers "Revisit the concept" and per-concept results. */
  lesson: string;
  prompt: string;
  explanation: string;
}

export interface ChoiceQuestion extends BaseQuestion {
  type?: "choice";
  options: string[];
  /** Indexes of the correct options. More than one means "choose N". */
  answer: number[];
}

export interface OrderQuestion extends BaseQuestion {
  type: "order";
  /** Steps in the correct order. */
  items: string[];
}

export interface MatchQuestion extends BaseQuestion {
  type: "match";
  /** [prompt, correct response] pairs. */
  pairs: [string, string][];
}

export type Question = ChoiceQuestion | OrderQuestion | MatchQuestion;

export function isChoice(q: Question): q is ChoiceQuestion {
  return q.type === undefined || q.type === "choice";
}

// ───────────── Flashcards and lessons ─────────────

export interface Card {
  id: string;
  domain: string;
  /** "service" cards also feed the Service Match game. */
  kind: "service" | "concept";
  term: string;
  definition: string;
}

export interface Lesson {
  id: string;
  /** Exam guide task statement(s) this lesson covers, e.g. "3.1" or "3.1 · 3.3". */
  task: string;
  title: string;
  visual: ReactNode;
  points: string[];
  tip?: string;
  /** Question ids for the quick check after the lesson. */
  check: string[];
}

/**
 * A hands-on goal inside a lab: the player interacts until the lab reports
 * success. Used in study play sessions between questions.
 */
export interface Challenge {
  id: string;
  domain: string;
  /** Lesson whose concept this practises (for "revisit" links). */
  lesson?: string;
  title: string;
  /** What the player must make happen, shown above the lab. */
  goal: string;
  hint?: string;
  /** What the player should take away once solved. */
  takeaway: string;
  /** Render the lab; call `onSolved` when the goal is met. */
  render: (onSolved: () => void) => ReactNode;
}

// ───────────── Exam and guide ─────────────

export type QuestionKind = "choice" | "multi" | "order" | "match";

export interface ExamFormat {
  /** Questions on the real exam, including unscored ones. */
  questions: number;
  /** Unscored trial questions mixed in (0 if none). */
  unscored: number;
  minutes: number;
  /** Reported score range and pass mark, e.g. 100-1000 with 700 to pass. */
  scale: { min: number; max: number; pass: number };
  questionTypes: { id: QuestionKind; icon: string; name: string; rule: string }[];
}

export interface Fact {
  icon: string;
  value: string;
  label: string;
  detail: string;
}

export interface TaskStatement {
  id: string;
  title: string;
  covers: string[];
}

export interface GuideInfo {
  /** Where the content came from, shown as a citation. */
  source: { label: string; version: string; date: string; url: string };
  facts: Fact[];
  candidate: { is: string[]; isNot: string[] };
  tasks: Record<string, TaskStatement[]>;
  scope: { label: string; groups: { category: string; icon: string; services: string[] }[] };
  tips: { icon: string; tip: string }[];
  /** Official practice resources, linked from the exam simulator. */
  officialPractice?: { label: string; url: string };
}

export interface CheatSheetSection {
  title: string;
  items: [string, string][];
}

// ───────────── Course ─────────────

export interface Course {
  id: string;
  provider: Provider;
  /** Certification code, e.g. "AIF-C01". */
  code: string;
  title: string;
  shortTitle: string;
  tagline: string;
  level: "Foundational" | "Associate" | "Professional" | "Specialty";
  /** localStorage key for this course's progress. Change it only with a migration. */
  storageKey: string;
  exam: ExamFormat;
  domains: Domain[];
  questions: Question[];
  cards: Card[];
  lessons: Record<string, Lesson[]>;
  challenges: Challenge[];
  guide: GuideInfo;
  cheatsheet: CheatSheetSection[];
  /** Fully resolved game settings (defaults merged with the course's overrides). */
  config: GameConfig;
  /** Training-deck modes this course offers, in display order. */
  modes: ModeId[];
  /** Flavour for the boss battle. */
  boss?: { name: string; emoji: string };
  /** What Service Match calls its cards, e.g. "AWS services". */
  matchLabel?: string;
  /** Titles for levels 1, 2, 3, … (the last one repeats). */
  levelTitles?: string[];
}

// ───────────── Authoring ─────────────

/**
 * Everything about one exam domain in one place. Course authors add or edit
 * content here; `defineCourse` flattens the modules into a `Course`.
 */
export interface DomainModule {
  domain: Domain;
  /** Exam guide task statements for this domain. */
  tasks: TaskStatement[];
  /** Missions on the map, in order. */
  lessons: Lesson[];
  questions: Question[];
  cards: Card[];
  /** Hands-on lab goals for study play sessions. */
  challenges?: Challenge[];
}

type DeepPartial<T> = { [K in keyof T]?: T[K] extends (infer U)[] ? U[] : T[K] extends object ? DeepPartial<T[K]> : T[K] };

/** What a course folder exports before `defineCourse` resolves it. */
export interface CourseDefinition
  extends Omit<Course, "domains" | "questions" | "cards" | "lessons" | "challenges" | "guide" | "config" | "modes"> {
  domains: DomainModule[];
  guide: Omit<GuideInfo, "tasks">;
  /** Override any game setting; everything else uses the engine defaults. */
  config?: DeepPartial<GameConfig>;
  modes?: ModeId[];
}

// ───────────── Game settings ─────────────

export type ModeId = "review" | "timed" | "flashcards" | "match" | "lightning" | "boss" | "cheatsheet";

export interface ExamMode {
  id: string;
  name: string;
  icon: string;
  questions: number;
  unscored: number;
  minutes: number;
  /** Counts toward the "pass the full simulation" badge. */
  full: boolean;
}

export interface TimedQuizConfig {
  questions: number;
  secondsPerQuestion: number;
  /** Share correct needed to pass, 0-1. */
  passShare: number;
}

/** Every tunable number in the games. Defaults live in engine/config.ts. */
export interface GameConfig {
  xp: {
    lessonComplete: number;
    lessonCheck: number;
    questCorrect: number;
    starBonus: number;
    reviewCorrect: number;
    lightningCorrect: number;
    timedCorrect: number;
    studyCorrect: number;
    challengeSolved: number;
    /** Awarded per full minute of study time. */
    studyMinute: number;
    flashcardKnown: number;
    bossCorrect: number;
    bossPassBonus: number;
    examCorrect: number;
    examPassBonus: number;
    matchMax: number;
    matchMin: number;
    matchMistakePenalty: number;
  };
  quest: {
    length: number;
    hearts: number;
    /** Minimum share correct for 3, 2, and 1 stars. */
    starThresholds: [number, number, number];
  };
  lesson: {
    /** Without a timed challenge: re-ask missed check questions once at the end. */
    retryMissed: boolean;
    /** Missing any check question leads to a recap, then a timed quiz that must be passed. */
    timedChallenge: TimedQuizConfig & { enabled: boolean };
  };
  /** The "Timed drill" training mode. */
  timed: TimedQuizConfig;
  study: {
    /** Study timer choices, in minutes. 0 means "no timer". */
    minuteOptions: number[];
    defaultMinutes: number;
    /** Questions in the play session that follows study time. */
    playQuestions: number;
    /** Insert a hands-on challenge after every N questions. */
    challengeEvery: number;
  };
  review: { maxQuestions: number };
  lightning: { seconds: number; penaltySeconds: number; badgeAt: number };
  match: { pairs: number; badgeSeconds: number };
  flashcards: { sessionSize: number };
  boss: { questions: number; minutes: number };
  /** Exam simulator variants. Empty means "derive full and half from `exam`". */
  examModes: ExamMode[];
  dailyGoals: { xp: number; name: string; icon: string; note: string }[];
}

/** A catalog entry for a course that isn't built yet. */
export interface PlannedCourse {
  id: string;
  provider: Provider;
  code: string;
  title: string;
  tagline: string;
  level: Course["level"];
}
