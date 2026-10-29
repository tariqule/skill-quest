import { getCourse } from "@/courses";
import { indexCourse } from "@/engine/indexes";
import { LessonPlay } from "./LessonPlay";

export function generateStaticParams({ params }: { params: { course: string } }) {
  const course = getCourse(params.course);
  return course ? indexCourse(course).allLessons.map((l) => ({ id: l.id })) : [];
}

export default function LessonPage() {
  return <LessonPlay />;
}
