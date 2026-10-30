import { resolveConfig } from "./config";
import { ALL_MODES } from "./modes";
import { hasScenarios } from "@/scenarios";
import type { CodingChallenge, Course, CourseDefinition, DomainModule, ModeId, Question } from "./types";

/** Live coding only appears for courses that have challenges; every other mode is on by default. */
function resolveModes(modes: ModeId[] | undefined, coding: CodingChallenge[] | undefined, games: boolean, scenarios: boolean): ModeId[] {
  let base = modes ?? ALL_MODES.filter((m) => m.id !== "coding" && m.id !== "codegames" && m.id !== "scenarios").map((m) => m.id);
  if (coding?.length && !base.includes("coding")) base = ["coding", ...base];
  // Code games appear first wherever a course has all three kinds.
  if (games && !base.includes("codegames")) base = ["codegames", ...base];
  // Scenario games (Phase 4) appear wherever src/scenarios has items for the course.
  if (scenarios && !base.includes("scenarios")) base = ["scenarios", ...base];
  return base;
}

/** Identity helper so domain files get full type checking. */
export function defineDomain(module: DomainModule): DomainModule {
  return module;
}

/**
 * Add extra questions (for example a track's `more.ts` with fill-in and type-the-output questions)
 * to the domain modules they belong to, matched by each question's `domain`.
 */
export function withQuestions(domains: DomainModule[], extra: Question[]): DomainModule[] {
  return domains.map((m) => ({ ...m, questions: [...m.questions, ...extra.filter((q) => q.domain === m.domain.id)] }));
}

/** Flatten a course definition (domain modules + metadata) into the shape the engine reads. */
export function defineCourse(def: CourseDefinition): Course {
  const { domains, guide, config, modes, ...meta } = def;
  return {
    ...meta,
    domains: domains.map((m) => m.domain),
    questions: domains.flatMap((m) => m.questions),
    cards: domains.flatMap((m) => m.cards),
    lessons: Object.fromEntries(domains.map((m) => [m.domain.id, m.lessons])),
    challenges: domains.flatMap((m) => m.challenges ?? []),
    guide: { ...guide, tasks: Object.fromEntries(domains.map((m) => [m.domain.id, m.tasks])) },
    config: resolveConfig(def.exam, config),
    modes: resolveModes(modes, def.coding, ["parsons", "bug", "output"].every((t) => domains.some((m) => m.questions.some((q) => q.type === t))), hasScenarios(def.id)),
  };
}
