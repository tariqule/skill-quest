import { notFound } from "next/navigation";
import { courseIds, findCourse, wireCourse } from "@/server/courses/repository";
import { CourseShell } from "./CourseShell";

export function generateStaticParams() {
  return courseIds().map((course) => ({ course }));
}

/**
 * Server Component: loads this one course on the server and hands it to the client shell as
 * data. Lesson visuals and labs travel as client-component references, so the browser downloads
 * only the ones a page renders, and no other course's content reaches it.
 */
export default async function CourseLayout({ children, params }: LayoutProps<"/c/[course]">) {
  const { course } = await params;
  const c = findCourse(course);
  if (!c) notFound();
  // No Suspense here: a boundary around every page delays its reveal (and LCP). The few pages
  // with runtime-only params add their own (see coding/[id]/layout.tsx).
  return <CourseShell course={wireCourse(c)}>{children}</CourseShell>;
}
