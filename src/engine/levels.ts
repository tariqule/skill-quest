import { isCodeTrack } from "./tracks";
import type { Course, Lesson, Question, SkillLevel } from "./types";

/** A skill level, "exam" (certifications: everything past the basics), or "all". */
export type LevelChoice = SkillLevel | "exam" | "all";

export interface LevelInfo {
  id: LevelChoice;
  name: string;
  icon: string;
  color: string;
  /** One plain line about who this is for. */
  blurb: string;
}

/** Every level, easiest first, plus the certification "Exam level" and "everything". */
export const LEVELS: LevelInfo[] = [
  { id: "beginner", name: "Beginner", icon: "🐣", color: "#fb7185", blurb: "Never done this before. We start from zero." },
  { id: "junior", name: "Junior", icon: "🌱", color: "#34d399", blurb: "You know the basics and want to get solid." },
  { id: "intermediate", name: "Intermediate", icon: "🧩", color: "#38bdf8", blurb: "You use it most days and want to go deeper." },
  { id: "senior", name: "Senior", icon: "🚀", color: "#a78bfa", blurb: "You know how it works inside and why." },
  { id: "staff", name: "Staff", icon: "🏛️", color: "#f59e0b", blurb: "You make the big calls for a team." },
  { id: "exam", name: "Exam level", icon: "🎯", color: "#38bdf8", blurb: "Everything the real exam can ask." },
  { id: "all", name: "Everything", icon: "🌐", color: "#f472b6", blurb: "All of it, mixed together." },
];

export const LEVEL_BY_ID = Object.fromEntries(LEVELS.map((l) => [l.id, l])) as Record<LevelChoice, LevelInfo>;

/** Skill levels from easiest to hardest. */
export const SENIORITY: SkillLevel[] = ["beginner", "junior", "intermediate", "senior", "staff"];

const CODE_CHOICES: LevelChoice[] = ["beginner", "junior", "intermediate", "senior", "staff", "all"];
const CERT_CHOICES: LevelChoice[] = ["beginner", "exam", "all"];

/** The levels a course offers: Code Quest tracks use seniority, certifications use Beginner / Exam level. */
export function levelOptions(course: Pick<Course, "kind">): LevelInfo[] {
  return (isCodeTrack(course) ? CODE_CHOICES : CERT_CHOICES).map((id) => LEVEL_BY_ID[id]);
}

/** Every course has levels now (Beginner applies everywhere). */
export function hasLevels(course: Pick<Course, "kind">) {
  void course;
  return true;
}

/**
 * The level that actually applies to this course. A shared choice such as "senior" means
 * "exam" on a certification, and "exam" means "all" on a Code Quest track.
 */
export function effectiveLevel(course: Pick<Course, "kind">, level: LevelChoice): LevelChoice {
  if (isCodeTrack(course)) return level === "exam" ? "all" : level;
  if (level === "beginner" || level === "all") return level;
  return "exam";
}

/** A question's or lesson's level. Untagged certification items count as exam material (junior and up). */
export function levelOf(item: { level?: SkillLevel }): SkillLevel {
  return item.level ?? "junior";
}

function matches(level: LevelChoice, item: { level?: SkillLevel }) {
  if (level === "all") return true;
  if (level === "exam") return levelOf(item) !== "beginner";
  return levelOf(item) === level;
}

/** Questions for the chosen level ("all" returns everything). */
export function questionsForLevel(course: Course, level: LevelChoice, pool: Question[] = course.questions) {
  const l = effectiveLevel(course, level);
  return l === "all" ? pool : pool.filter((q) => matches(l, q));
}

/** True for a question, lesson or challenge that belongs to the chosen level. */
export function atLevel(course: Pick<Course, "kind">, level: LevelChoice, item: { level?: SkillLevel }) {
  return matches(effectiveLevel(course, level), item);
}

/** Other skill levels from nearest to farthest; at equal distance the easier level comes first. */
export function nearbyLevels(level: SkillLevel): SkillLevel[] {
  const i = SENIORITY.indexOf(level);
  return [...SENIORITY]
    .filter((l) => l !== level)
    .sort((a, b) => Math.abs(SENIORITY.indexOf(a) - i) - Math.abs(SENIORITY.indexOf(b) - i) || SENIORITY.indexOf(a) - SENIORITY.indexOf(b));
}

/**
 * How a deck of `count` questions from `pool` splits between the chosen level and borrowed
 * nearby levels. `borrowed` is 0 when the level has enough on its own.
 */
export function levelSplit(course: Course, level: LevelChoice, pool: Question[], count: number) {
  const size = Math.min(count, pool.length);
  const l = effectiveLevel(course, level);
  if (l === "all") return { size, atLevel: size, borrowed: 0 };
  const at = Math.min(size, pool.filter((q) => matches(l, q)).length);
  return { size, atLevel: at, borrowed: size - at };
}

/** A domain's beginner ("Start here") lessons, and the rest. */
export function splitLessons(lessons: Lesson[]) {
  return { basics: lessons.filter((l) => l.level === "beginner"), rest: lessons.filter((l) => l.level !== "beginner") };
}

/** The minimum questions each level must have so every game mode has something to draw from. */
export const MIN_PER_LEVEL = 12;
/** Beginner content every course needs. */
export const BEGINNER_MIN = { lessonsPerDomain: 2, questionsPerDomain: 4, questions: 16 };
