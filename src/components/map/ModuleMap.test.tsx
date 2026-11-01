import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import course from "@/courses/code-system-design";
import { CourseProvider } from "@/engine/course-context";
import { courseMap } from "@/engine/practice";
import { ModuleMap } from "./ModuleMap";

const lessonIds = new Set(Object.values(course.lessons).flat().map((l) => l.id));
const map = courseMap(course.topics ?? [], lessonIds, { lessonsDone: ["t-intro"] });

// The beginner page passes startHere; the full course page doesn't. Both must draw locked tiles the same way.
describe.each([["beginner", true], ["normal", false]] as const)("ModuleMap (%s)", (_, startHere) => {
  const html = renderToStaticMarkup(
    <CourseProvider courseId={course.id}>
      <ModuleMap map={map} color="#38bdf8" startHere={startHere} />
    </CourseProvider>,
  );

  it("labels not-yet-ready topics 'Best after', with no lock and no fade", () => {
    expect(map.modules.flatMap((m) => m.topics).some((t) => t.state === "locked")).toBe(true);
    expect(html).toContain("Best after");
    expect(html).not.toMatch(/>After /);
    expect(html).not.toContain("🔒");
    expect(html).not.toMatch(/opacity-\d/);
  });

  it("links locked tiles to their lessons", () => {
    expect(html).toContain('href="/c/code-system-design/lesson/t-cdn"');
  });
});

describe("ModuleMap redesign", () => {
  const html = renderToStaticMarkup(
    <CourseProvider courseId={course.id}>
      <ModuleMap map={map} color="#2DD4BF" />
    </CourseProvider>,
  );

  it("is an accordion: one module open, the rest collapsed but still in the markup", () => {
    const expanded = html.match(/aria-expanded="true"/g) ?? [];
    expect(expanded).toHaveLength(1);
    expect((html.match(/aria-expanded="false"/g) ?? []).length).toBe(map.modules.length - 1);
    expect(html).toMatch(/<ul id="[^"]+" hidden=""/);
  });

  it("names states in words, not colour alone, and uses no emoji or glow", () => {
    expect(html).toMatch(/Up next|Open/);
    expect(html).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(html).not.toMatch(/box-shadow|slate-|sky-/);
  });

  it("keeps text at 14px or more", () => {
    expect(html).not.toMatch(/text-xs|text-\[1[0-3]px\]/);
  });
});
