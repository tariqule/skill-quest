import { findCourse } from "@/server/courses/repository";
import { GamePlay } from "./GamePlay";

export function generateStaticParams({ params }: { params: { course: string } }) {
  return findCourse(params.course)?.domains.map((d) => ({ domain: d.id })) ?? [];
}

export default function GamePage() {
  return <GamePlay />;
}
