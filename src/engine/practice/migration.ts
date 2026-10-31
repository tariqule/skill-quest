import type { Progress } from "../store";
import type { LessonIdMigration } from "../types";

type MigratableProgress = Pick<Progress, "lessonsDone" | "studied" | "lessonIdVersion">;

/**
 * Rewrites finished and studied lesson ids through a course's alias table, once per version.
 * Idempotent: progress already at `migration.version` (or newer) comes back unchanged, by
 * reference, so callers can skip a save. Duplicates collapse to the first occurrence, keeping
 * the learner's finish order, which adaptive practice uses for recency.
 */
export function migrateLessonIds<P extends MigratableProgress>(p: P, migration: LessonIdMigration): P {
  if ((p.lessonIdVersion ?? 0) >= migration.version) return p;
  const rename = (ids: readonly string[]) => [...new Set(ids.map((id) => migration.aliases[id] ?? id))];
  return { ...p, lessonsDone: rename(p.lessonsDone), studied: rename(p.studied), lessonIdVersion: migration.version };
}
