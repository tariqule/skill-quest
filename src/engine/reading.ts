/**
 * Where a learner is in a lesson's cards, so a page reload resumes on the same card instead of
 * card 1. Keyed by course and lesson id, like editor drafts (see `drafts.ts`).
 */
export const readingKey = (courseId: string, lessonId: string) => `cq-reading:${courseId}:${lessonId}`;

type Storage = Pick<globalThis.Storage, "getItem" | "setItem" | "removeItem">;

/** The saved card index, clamped to the lesson's cards; 0 when nothing usable is stored. */
export function readCard(storage: Storage, key: string, cardCount: number): number {
  try {
    const n = Number(storage.getItem(key));
    return Number.isInteger(n) && n > 0 ? Math.min(n, Math.max(0, cardCount - 1)) : 0;
  } catch {
    return 0; // Storage can be blocked; start at the first card.
  }
}

export function writeCard(storage: Storage, key: string, index: number) {
  try {
    if (index > 0) storage.setItem(key, String(index));
    else storage.removeItem(key);
  } catch {
    // Resuming is a convenience; ignore storage errors.
  }
}

/** Forget the position once the lesson is read, so the next visit starts fresh. */
export function clearCard(storage: Storage, key: string) {
  try {
    storage.removeItem(key);
  } catch {
    // ignore
  }
}
