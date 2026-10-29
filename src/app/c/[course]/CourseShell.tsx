"use client";

import { notFound, useParams } from "next/navigation";
import type { ReactNode } from "react";
import { GuideDrawer } from "@/components/Guide";
import { Hud } from "@/components/Hud";
import { getCourse } from "@/courses";
import { CourseProvider } from "@/engine/course-context";

/** Everything inside /c/<course> gets the course context, the HUD, and the guide drawer. */
export function CourseShell({ children }: { children: ReactNode }) {
  const { course } = useParams<{ course: string }>();
  if (!getCourse(course)) notFound();
  return (
    <CourseProvider courseId={course}>
      <Hud />
      {children}
      <GuideDrawer />
    </CourseProvider>
  );
}
