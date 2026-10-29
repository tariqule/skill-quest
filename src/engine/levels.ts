import { isCodeTrack } from "./tracks";
import type { Course, Question, SkillLevel } from "./types";

export type LevelChoice = SkillLevel | "all";

export interface LevelInfo {
  id: LevelChoice;
  name: string;
  icon: string;
  color: string;
  blurb: string;
}

/** Interview levels, in order of seniority, plus "all levels combined". */
export const LEVELS: LevelInfo[] = [
  { id: "junior", name: "Junior", icon: "🌱", color: "#34d399", blurb: "Core syntax, fundamentals, reading code" },
  { id: "intermediate", name: "Intermediate", icon: "🧩", color: "#38bdf8", blurb: "Everyday patterns, trade-offs, debugging" },
  { id: "senior", name: "Senior", icon: "🚀", color: "#a78bfa", blurb: "Internals, performance, design decisions" },
  { id: "staff", name: "Staff", icon: "🏛️", color: "#f59e0b", blurb: "Architecture, scale, leading technical choices" },
  { id: "all", name: "All levels", icon: "🌐", color: "#f472b6", blurb: "Everything, mixed together" },
];

export const LEVEL_BY_ID = Object.fromEntries(LEVELS.map((l) => [l.id, l])) as Record<LevelChoice, LevelInfo>;

/** Whether a course uses skill levels (Code Quest tracks do). */
export function hasLevels(course: Pick<Course, "kind">) {
  return isCodeTrack(course);
}

/** Questions for the chosen level; "all" (or a course without levels) returns everything. */
export function questionsForLevel(course: Course, level: LevelChoice, pool: Question[] = course.questions) {
  if (!hasLevels(course) || level === "all") return pool;
  return pool.filter((q) => q.level === level);
}

/** Seniority order, used to borrow from the nearest levels when one runs short. */
const SENIORITY: SkillLevel[] = ["junior", "intermediate", "senior", "staff"];

/** Other levels from nearest to farthest; at equal distance the lower level comes first. */
export function nearbyLevels(level: SkillLevel): SkillLevel[] {
  const i = SENIORITY.indexOf(level);
  return [...SENIORITY].filter((l) => l !== level).sort((a, b) => Math.abs(SENIORITY.indexOf(a) - i) - Math.abs(SENIORITY.indexOf(b) - i) || SENIORITY.indexOf(a) - SENIORITY.indexOf(b));
}

/**
 * How a deck of `count` questions from `pool` splits between the chosen level and borrowed
 * nearby levels. `borrowed` is 0 when the level has enough on its own.
 */
export function levelSplit(course: Course, level: LevelChoice, pool: Question[], count: number) {
  const size = Math.min(count, pool.length);
  if (!hasLevels(course) || level === "all") return { size, atLevel: size, borrowed: 0 };
  const atLevel = Math.min(size, pool.filter((q) => q.level === level).length);
  return { size, atLevel, borrowed: size - atLevel };
}

/** The minimum questions each level must have so every game mode has something to draw from. */
export const MIN_PER_LEVEL = 12;
