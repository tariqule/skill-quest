"use client";

import { createContext, useContext, type ReactNode } from "react";
import { indexCourse, type CourseIndex } from "./indexes";
import { effectiveLevel, questionsForLevel } from "./levels";
import { getCourseStore, type CourseStore } from "./store";
import type { Course } from "./types";

export type { IndexedLesson } from "./indexes";

export interface CourseContextValue extends CourseIndex {
  course: Course;
  store: CourseStore;
  /** Absolute URL for a path inside this course: href("/exam") → "/c/<id>/exam". */
  href: (to?: string) => string;
}

const Ctx = createContext<CourseContextValue | null>(null);

/** The course comes from the server (see app/c/[course]/layout.tsx); this module never imports course content. */
export function CourseProvider({ course, children }: { course: Course; children: ReactNode }) {
  const value: CourseContextValue = {
    course,
    store: getCourseStore(course),
    href: (to = "") => `/c/${course.id}${to}`,
    ...indexCourse(course),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** The current course, or null outside a course (e.g. the catalog). */
export function useOptionalCourse(): CourseContextValue | null {
  return useContext(Ctx);
}

export function useCourse(): CourseContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCourse() must be used inside <CourseProvider>");
  return v;
}

/**
 * Questions for the player's chosen skill level (interview tracks), or the
 * whole bank for courses without levels. Game modes draw from this.
 */
export function useLevelPool() {
  const { course } = useCourse();
  const p = useProgress();
  const level = effectiveLevel(course, p.level);
  return { level, pool: questionsForLevel(course, level) };
}

/** The current course's saved progress, re-rendering on change. */
export function useProgress() {
  return useCourse().store.useProgress();
}
