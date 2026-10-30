/** Remembers the last lesson opened per course, for the "Continue" button on Today. */
const KEY = "skillquest:last-lesson";
const MAP_KEY = "skillquest:last-lessons";

export type LastLesson = { courseId: string; lessonId: string; title: string; at: number };

function isLast(v: unknown): v is LastLesson {
  const l = v as LastLesson;
  return !!l && typeof l.courseId === "string" && typeof l.lessonId === "string";
}

function readAll(): Record<string, LastLesson> {
  try {
    const m = JSON.parse(localStorage.getItem(MAP_KEY) ?? "null");
    const out: Record<string, LastLesson> = {};
    if (m && typeof m === "object") for (const [k, v] of Object.entries(m)) if (isLast(v)) out[k] = v;
    const legacy = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (isLast(legacy) && !(out[legacy.courseId]?.at >= (legacy.at ?? 0))) out[legacy.courseId] = { ...legacy, at: legacy.at ?? 0 };
    return out;
  } catch {
    return {};
  }
}

export function rememberLesson(l: Omit<LastLesson, "at">, now = Date.now()) {
  try {
    const all = readAll();
    all[l.courseId] = { ...l, at: now };
    localStorage.setItem(MAP_KEY, JSON.stringify(all));
    localStorage.setItem(KEY, JSON.stringify(all[l.courseId]));
  } catch {}
}

/** Most recently opened lessons, newest first. */
export function recentLessons(): LastLesson[] {
  return Object.values(readAll()).sort((a, b) => b.at - a.at);
}

/** The lesson to continue: newest within the plan's courses, else newest anywhere. */
export function pickContinue(recent: LastLesson[], planCourses: string[] | null): LastLesson | null {
  if (planCourses?.length) {
    const inPlan = recent.find((l) => planCourses.includes(l.courseId));
    if (inPlan) return inPlan;
  }
  return recent[0] ?? null;
}

export function lastLesson(planCourses: string[] | null = null): LastLesson | null {
  return pickContinue(recentLessons(), planCourses);
}
