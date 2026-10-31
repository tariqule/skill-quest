"use client";

import { useMemo } from "react";
import { useCourse, useProgress } from "@/engine/course-context";
import { practiceSummary, type PracticeSummary } from "@/engine/practice";

/** The practice summary for the open course, recomputed only when finished lessons change. */
export function usePracticeSummary(): PracticeSummary {
  const { course } = useCourse();
  const { lessonsDone } = useProgress();
  return useMemo(() => practiceSummary(course, { lessonsDone }), [course, lessonsDone]);
}
