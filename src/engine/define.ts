import { resolveConfig } from "./config";
import { ALL_MODES } from "./modes";
import type { CodingChallenge, Course, CourseDefinition, DomainModule, ModeId, Question } from "./types";

/** Live coding only appears for courses that have challenges; every other mode is on by default. */
function resolveModes(modes: ModeId[] | undefined, coding: CodingChallenge[] | undefined): ModeId[] {
  const base = modes ?? ALL_MODES.filter((m) => m.id !== "coding").map((m) => m.id);
  return coding?.length && !base.includes("coding") ? ["coding", ...base] : base;
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
    modes: resolveModes(modes, def.coding),
  };
}
