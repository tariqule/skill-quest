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

/** Interview seniority a question or lesson targets. */
export type SkillLevel = "beginner" | "junior" | "intermediate" | "senior" | "staff";

interface BaseQuestion {
  id: string;
  domain: string;
  /** Interview tracks: the seniority this question targets. Required on Code Quest tracks (kind "interview" or "learning"). */
  level?: SkillLevel;
  /** Lesson id of the concept this question tests. Powers "Revisit the concept" and per-concept results. */
  lesson: string;
  prompt: string;
  /** Optional code snippet shown under the prompt (e.g. "What does this print?"). */
  code?: string;
  /** Language label for `code`, e.g. "js", "ts", "python", "java". */
  codeLang?: string;
  explanation: string;
  /**
   * Topic (concept lesson) ids this question tests. On courses with `topics`, adaptive practice
   * only offers a question once every one of these topics is done.
   */
  concepts?: string[];
}

export interface ChoiceQuestion extends BaseQuestion {
  type?: "choice";
  options: string[];
  /** Indexes of the correct options. More than one means "choose N". */
  answer: number[];
  /** True/false statement: options are exactly ["True", "False"], shown in that order (never shuffled). */
  tf?: true;
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

/** "Bug hunt": tap the line(s) in `code` that answer the prompt (the bug, the line that throws, …). */
export interface LinesQuestion extends BaseQuestion {
  type: "lines";
  code: string;
  /** 1-based line numbers of the correct line(s). */
  answer: number[];
}

/**
 * "Fill the blanks": `code` holds `{{1}}`, `{{2}}`… markers and each blank offers a few options.
 * Blank `n` is `blanks[n - 1]`; `answer` is the index of its correct option.
 */
export interface FillQuestion extends BaseQuestion {
  type: "fill";
  code: string;
  blanks: { options: string[]; answer: number }[];
}

/**
 * "Type the output": the player types what `code` prints or returns. `answers` lists every accepted
 * spelling; multi-line output joins lines with a newline. Line endings, spaces at line ends and blank edge lines are ignored; spacing inside lines must match.
 */
export interface OutputQuestion extends BaseQuestion {
  type: "output";
  code: string;
  answers: string[];
  /** Predict the Output: a few plausible outputs the player may pick from instead of typing (the first accepted answer is added if missing). */
  choices?: string[];
  /** Worked example: the execution traced step by step, shown with the explanation. */
  trace?: string[];
  /** How the answer was checked: "run" (executed by the code-games runtime test) or "reasoned" (no runtime on the box). */
  /** Runner only: code that wraps the snippet so it runs on its own; `{{code}}` marks where the snippet goes. Never shown. */
  harness?: string;
  verified?: Verified;
  /** Data the snippet works on, shown in a collapsible "Tables" panel instead of repeated in the prompt. */
  tables?: TablePreview[];
}

/** A small table shown next to a code game (SQL). `null` cells show as NULL. */
export interface TablePreview {
  name: string;
  columns: string[];
  rows: (string | number | null)[][];
}

/** How a code game's answer was checked. */
export type Verified = "run" | "reasoned";

/**
 * Parsons puzzle: put shuffled code lines back in order. `code` is the working solution, one block per
 * line, indented as it should be. `distractors` are plausible lines that don't belong. With `indent`, the
 * player also sets each line's indentation (Python, Go blocks, YAML); otherwise lines keep their own.
 */
export interface ParsonsQuestion extends BaseQuestion {
  type: "parsons";
  code: string;
  distractors?: string[];
  indent?: boolean;
  /** First hint, shown before the line-by-line hints. */
  hint?: string;
  /** What the solution prints when run, if it was executed. */
  expected?: string;
  /** Runner only: code that wraps the snippet so it runs on its own; `{{code}}` marks where the snippet goes. Never shown. */
  harness?: string;
  verified?: Verified;
  /** Data the snippet works on, shown in a collapsible "Tables" panel instead of repeated in the prompt. */
  tables?: TablePreview[];
}

/**
 * Spot the Bug: tap the buggy line in `code`, then pick the fix. `fixes[fix]` replaces line `line`
 * (indentation is kept). `expected` is what the fixed program prints when run.
 */
export interface BugQuestion extends BaseQuestion {
  type: "bug";
  code: string;
  /** 1-based number of the buggy line. */
  line: number;
  fixes: string[];
  fix: number;
  expected?: string;
  trace?: string[];
  /** Runner only: code that wraps the snippet so it runs on its own; `{{code}}` marks where the snippet goes. Never shown. */
  harness?: string;
  verified?: Verified;
  /** Data the snippet works on, shown in a collapsible "Tables" panel instead of repeated in the prompt. */
  tables?: TablePreview[];
}

export type Question = ChoiceQuestion | OrderQuestion | MatchQuestion | LinesQuestion | FillQuestion | OutputQuestion | ParsonsQuestion | BugQuestion;

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
  /** Interview tracks: the seniority this concept is usually asked at. */
  level?: SkillLevel;
  /** Exam guide task statement(s) this lesson covers, e.g. "3.1" or "3.1 · 3.3". */
  task: string;
  title: string;
  visual: ReactNode;
  points: string[];
  tip?: string;
  /** Question ids for the quick check after the lesson. */
  check: string[];
  /** Where this lesson's material comes from or what to read next (shown as a Sources footer). */
  sources?: LessonSource[];
}

export interface LessonSource {
  title: string;
  url: string;
  /** e.g. "CC BY 4.0", "MIT", or "Official docs (link only)". */
  license: string;
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

// ───────────── Live coding ─────────────

/** One test case: call the function with `args` and compare the result with `expected` (deep equality). */
export interface CodingTest {
  /** Shown in the results, e.g. "empty input". */
  name?: string;
  args: unknown[];
  expected: unknown;
  /** Hidden tests show only as "hidden test" until the player runs the full suite. */
  hidden?: boolean;
}

/**
 * A live coding challenge: the player edits `starter` in the browser editor and runs it against
 * the tests. `fn` is the function name the tests call. Plain JavaScript, no imports.
 */
/** Java types the harness knows how to build literals for and compare. */
export type JavaType = string;

export type CodingLanguage = "js" | "python" | "java";

export interface CodingChallenge {
  id: string;
  /** Language the player writes in; JavaScript when left out. */
  language?: CodingLanguage;
  /**
   * Java only: the method `fn` lives on `class Solution` and has these parameter and return types,
   * for example `int[]`, `String`, `List<Integer>`, `Map<String, Integer>`, `long`, `boolean`.
   */
  java?: { params: JavaType[]; returns: JavaType };
  domain: string;
  lesson?: string;
  level: SkillLevel;
  title: string;
  /** What to build. Inline `backticks` render as code. */
  prompt: string;
  fn: string;
  starter: string;
  tests: CodingTest[];
  /** Progressive hints; each one costs a little XP. */
  hints: string[];
  /** A reference solution (also run by `npm test` against the tests). */
  solution: string;
  /** Why the solution works, shown after solving or giving up. */
  explanation: string;
  /** Target complexity or key idea, shown as a chip. */
  idea?: string;
  /** Time and space notes, shown with the reference solution. */
  complexity?: string;
}

// ───────────── Exam and guide ─────────────

export type QuestionKind = "choice" | "multi" | "order" | "match" | "lines" | "fill" | "output" | "parsons" | "bug";

export interface ExamFormat {
  /** Questions on the real exam, including unscored ones. */
  questions: number;
  /** Unscored trial questions mixed in (0 if none). */
  unscored: number;
  minutes: number;
  /** Reported score range and pass mark, e.g. 100-1000 with 700 to pass. */
  scale: { min: number; max: number; pass: number };
  /**
   * Formats used in this course. Mark a format `practiceOnly` when the real
   * exam doesn't use it: the exam simulator then leaves it out, while
   * missions, trials, and drills still use it.
   */
  questionTypes: { id: QuestionKind; icon: string; name: string; rule: string; practiceOnly?: boolean }[];
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
  level: "Foundational" | "Associate" | "Professional" | "Specialty" | "Beginner" | "Intermediate" | "Advanced";
  /**
   * "certification" (default), "interview" prep, or "learning" (learn a skill from scratch).
   * Interview and learning tracks live in Code Quests and use skill levels.
   */
  kind?: "certification" | "interview" | "learning";
  /** Code Quest hub filter group. */
  category?: TrackCategory;
  /** Extra search words for the catalog, e.g. ["hooks", "jsx"]. */
  tags?: string[];
  /** Exam version dates, shown in the catalog and on the mission map. */
  lifecycle?: CourseLifecycle;
  /** localStorage key for this course's progress. Change it only with a migration. */
  storageKey: string;
  exam: ExamFormat;
  domains: Domain[];
  questions: Question[];
  cards: Card[];
  lessons: Record<string, Lesson[]>;
  challenges: Challenge[];
  /** Live coding challenges (JavaScript), shown in the "Live coding" mode. */
  coding?: CodingChallenge[];
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
  /**
   * Concept topics for adaptive practice, in study order. Practice questions unlock per topic as
   * the learner finishes the lesson that teaches it.
   */
  topics?: Topic[];
  /** Extra practice-only questions (not in quizzes or the exam), each tagged with `concepts`. */
  practice?: Question[];
  /** Design prompts and cross-track references, unlocked like practice questions. */
  designPrompts?: DesignPrompt[];
  /** Renamed or merged lesson ids, applied once to saved progress. */
  lessonMigration?: LessonIdMigration;
}

/**
 * "ready": a lesson teaches it now (its own id, or a stand-in lesson).
 * "planned": on the syllabus, no lesson yet, so nothing tagged with it can unlock.
 */
export type TopicStatus = "ready" | "planned";

/** One concept topic on a course's syllabus. */
export interface Topic {
  id: string;
  title: string;
  /** Module (block) title, e.g. "Fundamentals". */
  module: string;
  status: TopicStatus;
  /** Topic ids to finish first. Planned prerequisites never block. */
  prereqs: string[];
  /** Existing lessons that also count as finishing this topic. */
  standIns?: string[];
  /** Spots this topic in a question's text when tagging older questions. */
  match: RegExp;
}

/** Old lesson id → new lesson id. Bump `version` whenever `aliases` changes. */
export interface LessonIdMigration {
  version: number;
  aliases: Readonly<Record<string, string>>;
}

export interface DesignPrompt {
  id: string;
  title: string;
  prompt: string;
  /** Topic ids this prompt needs. */
  concepts: string[];
  /** App-absolute link, e.g. "/c/code-system-design/scenarios/architect". */
  href: string;
  linkLabel: string;
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

export type ModeId = "practice" | "codegames" | "scenarios" | "coding" | "review" | "timed" | "flashcards" | "match" | "lightning" | "boss" | "cheatsheet";

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
    /** Scenario games: XP for finishing one item at 100%, scaled by the score. */
    scenarioComplete: number;
    /** Live coding: XP for a first solve, before hint penalties. */
    codingSolved: number;
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
    /** Hearts on the Beginner level, where mistakes should cost less. */
    beginnerHearts: number;
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

export interface CourseLifecycle {
  /** Last day this exam version can be taken (ISO date, e.g. "2026-11-30"). */
  retires?: string;
  /** First day the exam opens for registration (ISO date). */
  opens?: string;
  /** Course id of the newer version. */
  successor?: string;
  /** Course id of the version this one replaces. */
  predecessor?: string;
}

/** Code Quest hub categories. */
export type TrackCategory = "languages" | "frontend" | "backend" | "cs" | "data" | "tools";

/** A catalog entry for a course that isn't built yet. */
export interface PlannedCourse {
  id: string;
  kind?: Course["kind"];
  provider: Provider;
  code: string;
  title: string;
  tagline: string;
  level: Course["level"];
}
