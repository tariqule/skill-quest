import { effectiveLevel, splitLessons } from "./levels";
import type { Progress } from "./store";
import type { Course } from "./types";

/** Share of beginner questions a player must have right (last attempt) before we suggest levelling up. */
export const LEVEL_UP_MASTERY = 0.8;

/**
 * Progress through the Beginner level, or null when the player isn't on Beginner (or the course
 * has no beginner content). `ready` means every "Start here" lesson is done and most beginner
 * questions are mastered, so it's time to suggest the next level.
 */
export function levelUpStatus(course: Course, p: Progress) {
  if (effectiveLevel(course, p.level) !== "beginner") return null;
  const basics = course.domains.flatMap((d) => splitLessons(course.lessons[d.id] ?? []).basics);
  const questions = course.questions.filter((q) => q.level === "beginner");
  if (!basics.length || !questions.length) return null;
  const lessonsDone = basics.filter((l) => p.lessonsDone.includes(l.id)).length;
  const mastered = questions.filter((q) => p.questions[q.id]?.lastCorrect).length;
  const ready = lessonsDone === basics.length && mastered >= Math.ceil(questions.length * LEVEL_UP_MASTERY);
  const next = course.kind === "interview" || course.kind === "learning" ? ("junior" as const) : ("exam" as const);
  return { ready, lessonsDone, lessonsTotal: basics.length, mastered, questionsTotal: questions.length, next };
}
