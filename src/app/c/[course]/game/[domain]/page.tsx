import { getCourse } from "@/courses";
import { GamePlay } from "./GamePlay";

export function generateStaticParams({ params }: { params: { course: string } }) {
  return getCourse(params.course)?.domains.map((d) => ({ domain: d.id })) ?? [];
}

export default function GamePage() {
  return <GamePlay />;
}
