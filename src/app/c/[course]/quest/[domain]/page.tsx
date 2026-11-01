import { findCourse } from "@/server/courses/repository";
import { QuestPlay } from "./QuestPlay";

export function generateStaticParams({ params }: { params: { course: string } }) {
  return findCourse(params.course)?.domains.map((d) => ({ domain: d.id })) ?? [];
}

export default function QuestPage() {
  return <QuestPlay />;
}
