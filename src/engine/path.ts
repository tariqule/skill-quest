import { effectiveLevel, splitLessons } from "./levels";
import type { Progress } from "./store";
import type { Course } from "./types";

/** "later": a lesson past the Beginner basics, shown dimmed until the player levels up (still openable). */
export type NodeState = "done" | "current" | "open" | "locked" | "later";

export interface PathNode {
  key: string;
  type: "lesson" | "quest";
  domain: string;
  title: string;
  /** Path relative to the course root, e.g. "/lesson/d1-rings". */
  to: string;
  state: NodeState;
  /** Beginner basics on a higher level: open any time, never block the path. */
  optional?: boolean;
  /** A "Start here" beginner lesson. */
  basics?: boolean;
}

export interface PathWorld {
  domain: string;
  unlocked: boolean;
  /** Done lesson tiles in this world, counting optional extras: the same set the map lists. */
  lessonsDone: number;
  /** Every lesson tile in this world (required and optional), so "done/total" matches the tiles. */
  lessonsTotal: number;
  nodes: PathNode[];
}

/** A world opens once the previous world's trial has at least one star. */
export function worldUnlocked(course: Course, p: Progress, index: number) {
  if (index === 0) return true;
  return (p.questStars[course.domains[index - 1].id] ?? 0) > 0;
}

/**
 * Build the mission map. Exactly one required node (the first unfinished one) is "current".
 * On the Beginner level a world's path is its "Start here" lessons; the other lessons show as
 * "later". On every other level the basics become optional extras and the rest is the path.
 */
export function buildPath(course: Course, p: Progress): { worlds: PathWorld[]; current: PathNode | null; examUnlocked: boolean } {
  const beginner = effectiveLevel(course, p.level) === "beginner";
  let current: PathNode | null = null;
  const worlds = course.domains.map((d, wi) => {
    const unlocked = worldUnlocked(course, p, wi);
    const { basics, rest } = splitLessons(course.lessons[d.id] ?? []);
    // Courses without beginner lessons yet fall back to the full path at every level.
    const required = beginner ? (basics.length ? basics : rest) : rest.length ? rest : basics;
    const extras = beginner ? (basics.length ? rest : []) : rest.length ? basics : [];
    let prevDone = true;
    const toNode = (l: (typeof required)[number], state: NodeState, extra: Partial<PathNode> = {}): PathNode => ({
      key: l.id,
      type: "lesson",
      domain: d.id,
      title: l.title,
      to: `/lesson/${l.id}`,
      state,
      basics: l.level === "beginner",
      ...extra,
    });
    const requiredNodes = required.map((l) => {
      const done = p.lessonsDone.includes(l.id);
      const state: NodeState = done ? "done" : unlocked && prevDone ? "open" : "locked";
      prevDone = done;
      return toNode(l, state);
    });
    const extraNodes = extras.map((l) =>
      toNode(l, p.lessonsDone.includes(l.id) ? "done" : beginner ? "later" : unlocked ? "open" : "locked", { optional: true }),
    );
    const requiredDone = requiredNodes.filter((n) => n.state === "done").length;
    const questDone = (p.questStars[d.id] ?? 0) > 0;
    const quest: PathNode = {
      key: `quest-${d.id}`,
      type: "quest",
      domain: d.id,
      title: `${d.world} trial`,
      to: `/quest/${d.id}`,
      state: questDone ? "done" : unlocked && requiredDone === required.length ? "open" : "locked",
    };
    // Basics come first on higher levels; "later" lessons come after the trial on Beginner.
    const nodes = beginner ? [...requiredNodes, quest, ...extraNodes] : [...extraNodes, ...requiredNodes, quest];
    const lessonNodes = [...requiredNodes, ...extraNodes];
    return { domain: d.id, unlocked, lessonsDone: lessonNodes.filter((n) => n.state === "done").length, lessonsTotal: lessonNodes.length, nodes };
  });
  for (const w of worlds) {
    const n = w.nodes.find((x) => x.state === "open" && !x.optional);
    if (n) {
      n.state = "current";
      current = n;
      break;
    }
  }
  const examUnlocked = course.domains.every((d) => (p.questStars[d.id] ?? 0) > 0);
  return { worlds, current, examUnlocked };
}

/** Accessible name for a map tile: the lesson title plus its state, so icon-only states such as ⏭ are spoken. */
export function tileLabel(node: Pick<PathNode, "type" | "title" | "state">): string {
  const title = node.type === "quest" ? `Stage boss: ${node.title}` : node.title;
  if (node.state === "later") return `${title} (after the basics, open any time)`;
  if (node.state === "done") return `${title} (done)`;
  if (node.state === "current") return `${title} (start here)`;
  return title;
}
