"use client";

import { notFound, useParams } from "next/navigation";
import type { ReactNode } from "react";
import { GuideDrawerGate } from "@/components/GuideDrawerGate";
import { Hud } from "@/components/Hud";
import { getCourse } from "@/courses";
import { CourseProvider } from "@/engine/course-context";

/** Everything inside /c/<course> gets the course context, the HUD, and the guide drawer. */
export function CourseShell({ children }: { children: ReactNode }) {
  const { course } = useParams<{ course: string }>();
  const c = getCourse(course);
  if (!c) notFound();
  return (
    <CourseProvider courseId={course}>
      <div className="flex min-h-full flex-1 flex-col">
        <Hud />
        {children}
        <GuideDrawerGate />
      </div>
    </CourseProvider>
  );
}
