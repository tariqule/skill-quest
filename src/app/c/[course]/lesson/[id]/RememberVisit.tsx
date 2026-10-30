"use client";

import { useEffect } from "react";
import { rememberLesson } from "@/engine/last-opened";

/** Records the lesson visit as soon as the route mounts, before the course finishes loading. */
export function RememberVisit({ courseId, lessonId, title }: { courseId: string; lessonId: string; title: string }) {
  useEffect(() => rememberLesson({ courseId, lessonId, title }), [courseId, lessonId, title]);
  return null;
}
