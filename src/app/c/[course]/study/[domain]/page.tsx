import { findCourse } from "@/server/courses/repository";
import { StudySession } from "./StudySession";

export function generateStaticParams({ params }: { params: { course: string } }) {
  return findCourse(params.course)?.domains.map((d) => ({ domain: d.id })) ?? [];
}

export default function StudyPage() {
  return <StudySession />;
}
