/** Remembers the last lesson the player opened, for the "Continue" button on Today. */
const KEY = "skillquest:last-lesson";

export type LastLesson = { courseId: string; lessonId: string; title: string; at: number };

export function rememberLesson(l: Omit<LastLesson, "at">) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...l, at: Date.now() }));
  } catch {}
}

export function lastLesson(): LastLesson | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "null");
    return v && typeof v.courseId === "string" && typeof v.lessonId === "string" ? v : null;
  } catch {
    return null;
  }
}
