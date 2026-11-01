import { CodeHub, type Track } from "@/components/code/CodeHub";
import { levelOptions, questionsForLevel, type LevelChoice } from "@/engine/levels";
import { isCodeTrack, searchText } from "@/engine/tracks";
import { courseIds, findCourse, summarize } from "@/server/courses/repository";

/** The code tracks hub. Search text and counts are computed here, so the client gets summaries, not content. */
export default function CodePage() {
  const courses = courseIds().flatMap((id) => findCourse(id) ?? []).filter(isCodeTrack);
  const tracks: Track[] = courses.map((c) => ({
    course: summarize(c),
    text: searchText(c),
    lessonTitles: Object.values(c.lessons).flat().map((l) => l.title),
    cardTerms: c.cards.map((card) => card.term),
  }));
  const levelCounts = Object.fromEntries(
    levelOptions({ kind: "interview" }).map((l) => [l.id, courses.reduce((n, c) => n + questionsForLevel(c, l.id).length, 0)]),
  ) as Record<LevelChoice, number>;
  return <CodeHub tracks={tracks} levelCounts={levelCounts} />;
}
