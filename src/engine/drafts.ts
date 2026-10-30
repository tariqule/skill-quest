import type { CodingChallenge } from "./types";

/** Each exercise keeps its own editor draft, keyed by course and exercise id. */
export const draftKey = (courseId: string, id: string) => `cq-draft:${courseId}:${id}`;
/** Drafts saved before Phase 5 fixes used the exercise id alone. */
const legacyKey = (id: string) => `cq-draft:${id}`;

/** A draft only belongs to an exercise if it still mentions that exercise's function or method name. */
export function draftFits(c: Pick<CodingChallenge, "fn">, code: string): boolean {
  return new RegExp(`\\b${c.fn}\\b`).test(code);
}

type Storage = Pick<globalThis.Storage, "getItem" | "setItem" | "removeItem">;

export function readDraft(storage: Storage, courseId: string, c: Pick<CodingChallenge, "id" | "fn" | "starter">): string {
  try {
    const own = storage.getItem(draftKey(courseId, c.id));
    if (own !== null && draftFits(c, own)) return own;
    const old = storage.getItem(legacyKey(c.id));
    if (old !== null) {
      storage.removeItem(legacyKey(c.id));
      if (draftFits(c, old)) {
        storage.setItem(draftKey(courseId, c.id), old);
        return old;
      }
    }
  } catch {
    // Storage can be blocked; fall back to the starter.
  }
  return c.starter;
}

export function writeDraft(storage: Storage, courseId: string, c: Pick<CodingChallenge, "id">, code: string) {
  try {
    storage.setItem(draftKey(courseId, c.id), code);
  } catch {
    // Drafts are a convenience; ignore storage errors.
  }
}
