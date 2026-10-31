import { useMemo } from "react";
import { levelCounts, levelOptions, type LevelChoice } from "@/engine/levels";
import type { Course } from "@/engine/types";

/** Level picker counts and their labels, split into the shape LevelPicker takes. */
export function useLevelCounts(course: Course) {
  return useMemo(() => {
    const entries = Object.entries(levelCounts(course, levelOptions(course))) as [LevelChoice, { count: number; label: string }][];
    return {
      counts: Object.fromEntries(entries.map(([id, c]) => [id, c.count])) as Partial<Record<LevelChoice, number>>,
      labels: Object.fromEntries(entries.map(([id, c]) => [id, c.label])) as Partial<Record<LevelChoice, string>>,
    };
  }, [course]);
}
