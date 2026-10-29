import { getCourse } from "@/courses";
import { StudySession } from "./StudySession";

export function generateStaticParams({ params }: { params: { course: string } }) {
  return getCourse(params.course)?.domains.map((d) => ({ domain: d.id })) ?? [];
}

export default function StudyPage() {
  return <StudySession />;
}
