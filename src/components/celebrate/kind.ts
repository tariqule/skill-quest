import type { CourseMap } from "@/engine/practice";

export type CompletionKind = "lesson" | "topic" | "module" | null;

/**
 * What finishing a lesson completed: the last taught topic of a module ("module"), a map topic
 * ("topic"), or a lesson in a course without a module map ("lesson", no burst). Null when it
 * wasn't a first-time finish. `map` must already include this lesson as done.
 */
export function completionKind(map: CourseMap | null, lessonId: string, justCompleted: boolean): CompletionKind {
  if (!justCompleted) return null;
  const mod = map?.modules.find((md) => md.topics.some((t) => t.lesson === lessonId));
  if (!mod) return "lesson";
  return mod.topics.filter((t) => t.lesson).every((t) => t.state === "done") ? "module" : "topic";
}
