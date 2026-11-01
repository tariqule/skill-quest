import type { Course } from "@/engine/types";

export interface SheetSection {
  id: string;
  title: string;
  items: [string, string][];
}

export function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Every term section on the sheet: the course's cheat-sheet sections, then its service glossary. */
export function sheetSections(course: Pick<Course, "cheatsheet" | "cards">): SheetSection[] {
  const services = course.cards.filter((c) => c.kind === "service");
  return [
    ...course.cheatsheet.map((s) => ({ id: slug(s.title), title: s.title, items: s.items })),
    ...(services.length ? [{ id: "services-at-a-glance", title: "Services at a glance", items: services.map((c) => [c.term, c.definition] as [string, string]) }] : []),
  ];
}

/** Sections narrowed to one id ("all" keeps every one) and to items whose term or definition contains every word of the query. */
export function filterSheet(sections: SheetSection[], query: string, only: string): SheetSection[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return sections
    .filter((s) => only === "all" || s.id === only)
    .map((s) => (words.length ? { ...s, items: s.items.filter(([k, v]) => words.every((w) => `${k} ${v}`.toLowerCase().includes(w))) } : s))
    .filter((s) => s.items.length > 0);
}
