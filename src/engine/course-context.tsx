"use client";

import { createContext, useContext, type ReactNode } from "react";
import { getCourse } from "@/courses";
import { indexCourse, type CourseIndex } from "./indexes";
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

export function CourseProvider({ courseId, children }: { courseId: string; children: ReactNode }) {
  const course = getCourse(courseId);
  if (!course) throw new Error(`Unknown course "${courseId}"`);
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

/** The current course's saved progress, re-rendering on change. */
export function useProgress() {
  return useCourse().store.useProgress();
}
