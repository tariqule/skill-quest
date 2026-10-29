import { getCourse } from "@/courses";
import { QuestPlay } from "./QuestPlay";

export function generateStaticParams({ params }: { params: { course: string } }) {
  return getCourse(params.course)?.domains.map((d) => ({ domain: d.id })) ?? [];
}

export default function QuestPage() {
  return <QuestPlay />;
}
