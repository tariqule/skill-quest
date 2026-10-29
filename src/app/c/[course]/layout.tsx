import { Suspense } from "react";
import { COURSES } from "@/courses";
import { CourseShell } from "./CourseShell";

export function generateStaticParams() {
  return COURSES.map((c) => ({ course: c.id }));
}

export default function CourseLayout({ children }: LayoutProps<"/c/[course]">) {
  return (
    <Suspense fallback={<main className="mx-auto w-full max-w-3xl px-4 py-10 text-slate-400">Loading course…</main>}>
      <CourseShell>{children}</CourseShell>
    </Suspense>
  );
}
