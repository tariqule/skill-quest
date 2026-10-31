/**
 * What a reload mid-lesson should keep: that the learner chose "Continue anyway" on the
 * prerequisite screen, and where they are in the end-of-lesson quiz. Keyed by course and
 * lesson id, like the reading position (see `reading.ts`).
 */
type Storage = Pick<globalThis.Storage, "getItem" | "setItem" | "removeItem">;

export const gateKey = (courseId: string, lessonId: string) => `cq-gate-ok:${courseId}:${lessonId}`;
export const quizKey = (courseId: string, lessonId: string) => `cq-quiz:${courseId}:${lessonId}`;

/** True once the learner has chosen to read this lesson before its prerequisites. */
export function readGateDismissed(storage: Storage, key: string): boolean {
  try {
    return storage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function writeGateDismissed(storage: Storage, key: string) {
  try {
    storage.setItem(key, "1");
  } catch {
    // Remembering the choice is a convenience; ignore storage errors.
  }
}

/** The quiz between questions: which questions are still to come, in order, and what was missed or re-queued. */
export interface QuizSession {
  queue: string[];
  retried: string[];
  missed: string[];
}

/** The saved quiz, keeping only questions the lesson still has; null when nothing usable is stored. */
export function readQuiz(storage: Storage, key: string, checkIds: readonly string[]): QuizSession | null {
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<QuizSession>;
    const known = new Set(checkIds);
    const ids = (x: unknown) => (Array.isArray(x) ? x.filter((id): id is string => typeof id === "string" && known.has(id)) : []);
    const queue = ids(v.queue);
    return queue.length ? { queue, retried: ids(v.retried), missed: ids(v.missed) } : null;
  } catch {
    return null;
  }
}

export function writeQuiz(storage: Storage, key: string, session: QuizSession) {
  try {
    if (session.queue.length) storage.setItem(key, JSON.stringify(session));
    else storage.removeItem(key);
  } catch {
    // ignore
  }
}

export function clearQuiz(storage: Storage, key: string) {
  try {
    storage.removeItem(key);
  } catch {
    // ignore
  }
}

/**
 * The quiz as it stands once the current answer is in and the learner moves on: the answered
 * question leaves the front, and comes back once at the end when it is missed and re-queued.
 * Saving this right after an answer means a reload never asks the same question twice.
 */
export function afterAnswer(s: QuizSession, ok: boolean, requeue: boolean): QuizSession {
  const [q, ...rest] = s.queue;
  if (q === undefined) return s;
  return {
    queue: requeue ? [...rest, q] : rest,
    retried: requeue ? [...s.retried, q] : s.retried,
    missed: ok || s.missed.includes(q) ? s.missed : [...s.missed, q],
  };
}
