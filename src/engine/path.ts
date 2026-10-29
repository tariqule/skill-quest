import type { Progress } from "./store";
import type { Course } from "./types";

export type NodeState = "done" | "current" | "open" | "locked";

export interface PathNode {
  key: string;
  type: "lesson" | "quest";
  domain: string;
  title: string;
  /** Path relative to the course root, e.g. "/lesson/d1-rings". */
  to: string;
  state: NodeState;
}

export interface PathWorld {
  domain: string;
  unlocked: boolean;
  lessonsDone: number;
  lessonsTotal: number;
  nodes: PathNode[];
}

/** A world opens once the previous world's trial has at least one star. */
export function worldUnlocked(course: Course, p: Progress, index: number) {
  if (index === 0) return true;
  return (p.questStars[course.domains[index - 1].id] ?? 0) > 0;
}

/** Build the mission map. Exactly one node (the first unfinished one) is "current". */
export function buildPath(course: Course, p: Progress): { worlds: PathWorld[]; current: PathNode | null; examUnlocked: boolean } {
  let current: PathNode | null = null;
  const worlds = course.domains.map((d, wi) => {
    const unlocked = worldUnlocked(course, p, wi);
    const lessons = course.lessons[d.id] ?? [];
    let prevDone = true;
    const nodes: PathNode[] = lessons.map((l) => {
      const done = p.lessonsDone.includes(l.id);
      const state: NodeState = done ? "done" : unlocked && prevDone ? "open" : "locked";
      prevDone = done;
      return { key: l.id, type: "lesson", domain: d.id, title: l.title, to: `/lesson/${l.id}`, state };
    });
    const lessonsDone = nodes.filter((n) => n.state === "done").length;
    const questDone = (p.questStars[d.id] ?? 0) > 0;
    nodes.push({
      key: `quest-${d.id}`,
      type: "quest",
      domain: d.id,
      title: `${d.world} trial`,
      to: `/quest/${d.id}`,
      state: questDone ? "done" : unlocked && lessonsDone === lessons.length ? "open" : "locked",
    });
    return { domain: d.id, unlocked, lessonsDone, lessonsTotal: lessons.length, nodes };
  });
  for (const w of worlds) {
    const n = w.nodes.find((x) => x.state === "open");
    if (n) {
      n.state = "current";
      current = n;
      break;
    }
  }
  const examUnlocked = course.domains.every((d) => (p.questStars[d.id] ?? 0) > 0);
  return { worlds, current, examUnlocked };
}
