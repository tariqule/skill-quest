import type { Course, TrackCategory } from "./types";

/** Code Quest tracks: interview prep and learn-from-scratch tracks share the terminal skin and skill levels. */
export function isCodeTrack(course: Pick<Course, "kind">) {
  return course.kind === "interview" || course.kind === "learning";
}

export type TrackFocus = "all" | "interview" | "learning";

export const TRACK_FOCUSES: { id: TrackFocus; name: string; icon: string; blurb: string }[] = [
  { id: "all", name: "All", icon: "🌐", blurb: "Every track" },
  { id: "interview", name: "Interview", icon: "🎤", blurb: "Prep for technical interviews" },
  { id: "learning", name: "Learning", icon: "📘", blurb: "Learn a skill from scratch" },
];

export const TRACK_CATEGORIES: { id: TrackCategory; name: string; icon: string }[] = [
  { id: "languages", name: "Languages", icon: "💬" },
  { id: "frontend", name: "Frontend", icon: "🎨" },
  { id: "backend", name: "Backend", icon: "🛠️" },
  { id: "cs", name: "CS fundamentals", icon: "🧠" },
  { id: "data", name: "Data", icon: "🗄️" },
  { id: "tools", name: "Tools & DevOps", icon: "🧰" },
];

/** Lower-cased text a track is searchable by: names, tags, stages, lesson titles, and flashcard terms. */
export function searchText(course: Course) {
  return [
    course.title,
    course.shortTitle,
    course.code,
    course.tagline,
    ...(course.tags ?? []),
    ...course.domains.flatMap((d) => [d.name, d.world]),
    ...Object.values(course.lessons).flatMap((ls) => ls.map((l) => l.title)),
    ...course.cards.map((c) => c.term),
  ]
    .join(" \n ")
    .toLowerCase();
}

/** True when every word of the query appears somewhere in the track. */
export function matchesQuery(text: string, query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return words.every((w) => text.includes(w));
}
