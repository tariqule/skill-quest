import type { Progress } from "./store";
import type { Course, ModeId } from "./types";

/**
 * Training-deck challenges. To add a new one: give it an id in `ModeId`,
 * register it here, and add its page at app/c/[course]/<to>/page.tsx.
 * Courses choose which modes to show with `modes` in their definition.
 */
export interface ModeInfo {
  id: ModeId;
  name: string;
  icon: string;
  /** Route inside the course, e.g. "/lightning". */
  to: string;
  /** One-line status for the training deck card. */
  status: (progress: Progress, course: Course) => string;
}

export const ALL_MODES: ModeInfo[] = [
  {
    id: "coding",
    name: "Live coding",
    icon: "💻",
    to: "/coding",
    status: (p, c) => `${(c.coding ?? []).filter((x) => p.coding[x.id]?.solved).length}/${(c.coding ?? []).length} solved`,
  },
  {
    id: "review",
    name: "Fix mistakes",
    icon: "🔁",
    to: "/review",
    status: (p) => `${Object.values(p.questions).filter((s) => !s.lastCorrect).length} waiting`,
  },
  {
    id: "timed",
    name: "Timed drill",
    icon: "⏱️",
    to: "/timed",
    status: (_p, c) => `${c.config.timed.questions} questions · ${c.config.timed.secondsPerQuestion}s+ each`,
  },
  {
    id: "flashcards",
    name: "Flashcards",
    icon: "🃏",
    to: "/flashcards",
    status: (p) => `${Object.values(p.cards).filter((b) => b >= 4).length} mastered`,
  },
  {
    id: "match",
    name: "Service match",
    icon: "🧩",
    to: "/match",
    status: (p, c) => (p.matchBestSeconds !== null ? `Best ${p.matchBestSeconds}s` : `Pair ${c.matchLabel ?? "services"} to jobs`),
  },
  {
    id: "lightning",
    name: "Lightning round",
    icon: "⚡",
    to: "/lightning",
    status: (p) => `Best ${p.lightningBest}`,
  },
  {
    id: "boss",
    name: "Boss battle",
    icon: "🐉",
    to: "/boss",
    status: (p, c) => (p.bossBest !== null ? `Best ${p.bossBest}` : `${c.config.boss.questions}-question quick mock`),
  },
  {
    id: "cheatsheet",
    name: "Cheat sheet",
    icon: "📜",
    to: "/cheatsheet",
    status: () => "One-page review",
  },
];

/** Modes that wait until after the Beginner level (they're timed or exam-style and can feel harsh at first). */
export const BEGINNER_LOCKED: ModeId[] = ["timed", "boss", "lightning"];

/** The course's modes for this level: Beginner hides the high-pressure ones. */
export function modesFor(course: Course, level: string): ModeId[] {
  return level === "beginner" ? course.modes.filter((m) => !BEGINNER_LOCKED.includes(m)) : course.modes;
}

export const MODE_BY_ID = Object.fromEntries(ALL_MODES.map((m) => [m.id, m])) as Record<ModeId, ModeInfo>;
