import { findCourse, findLesson } from "@/server/courses/repository";
import { indexCourse } from "@/engine/indexes";
import { LessonPlay } from "./LessonPlay";
import { RememberVisit } from "./RememberVisit";

export function generateStaticParams({ params }: { params: { course: string } }) {
  const course = findCourse(params.course);
  return course ? indexCourse(course).allLessons.map((l) => ({ id: l.id })) : [];
}

export default async function LessonPage({ params }: { params: Promise<{ course: string; id: string }> }) {
  const { course: courseId, id } = await params;
  const course = findCourse(courseId);
  const lesson = course && findLesson(course, id);
  return (
    <>
      {lesson && <RememberVisit courseId={courseId} lessonId={id} title={lesson.title} />}
      <LessonPlay />
    </>
  );
}
