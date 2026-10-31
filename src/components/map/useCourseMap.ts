"use client";

import { useMemo } from "react";
import { useCourse, useProgress } from "@/engine/course-context";
import { courseMap, type CourseMap } from "@/engine/practice";

/** The open course's module map, or null for courses without a topic syllabus. Recomputed only when finished lessons change. */
export function useCourseMap(): CourseMap | null {
  const { course } = useCourse();
  const { lessonsDone } = useProgress();
  const lessonIds = useMemo(() => new Set(Object.values(course.lessons).flat().map((l) => l.id)), [course]);
  return useMemo(() => (course.topics?.length ? courseMap(course.topics, lessonIds, { lessonsDone }) : null), [course, lessonIds, lessonsDone]);
}
