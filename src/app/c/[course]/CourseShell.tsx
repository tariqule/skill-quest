"use client";

import type { ReactNode } from "react";
import type { WireCourse } from "@/api/wire";
import { decodeCourse } from "@/api/wire";
import { GuideDrawerGate } from "@/components/GuideDrawerGate";
import { Hud } from "@/components/Hud";
import { CourseProvider } from "@/engine/course-context";

/** Everything inside /c/<course> gets the course context, the HUD, and the guide drawer. */
export function CourseShell({ course, children }: { course: WireCourse; children: ReactNode }) {
  return (
    <CourseProvider course={decodeCourse(course)}>
      <div className="flex min-h-full flex-1 flex-col">
        <Hud />
        {children}
        <GuideDrawerGate />
      </div>
    </CourseProvider>
  );
}
