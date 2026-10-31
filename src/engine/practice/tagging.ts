import type { Topic } from "../types";

/**
 * Tags a question with the candidate topics whose `match` appears in its text. Falls back to the
 * first candidate (the lesson's main topic) so every question gets at least one tag.
 */
export function inferConcepts(text: string, candidates: readonly Topic[]): string[] {
  const hits = candidates.filter((t) => t.match.test(text)).map((t) => t.id);
  return hits.length ? hits : candidates.slice(0, 1).map((t) => t.id);
}
