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

/** Whether a course uses skill levels (interview tracks do). */
export function hasLevels(course: Pick<Course, "kind">) {
  return course.kind === "interview";
}

/** Questions for the chosen level; "all" (or a course without levels) returns everything. */
export function questionsForLevel(course: Course, level: LevelChoice, pool: Question[] = course.questions) {
  if (!hasLevels(course) || level === "all") return pool;
  return pool.filter((q) => q.level === level);
}

/** The minimum questions each level must have so every game mode has something to draw from. */
export const MIN_PER_LEVEL = 12;
