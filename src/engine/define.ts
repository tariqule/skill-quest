import { resolveConfig } from "./config";
import { ALL_MODES } from "./modes";
import type { Course, CourseDefinition, DomainModule } from "./types";

/** Identity helper so domain files get full type checking. */
export function defineDomain(module: DomainModule): DomainModule {
  return module;
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
    modes: modes ?? ALL_MODES.map((m) => m.id),
  };
}
