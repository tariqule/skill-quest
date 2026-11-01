import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { courseIds, findCourse } from "@/server/courses/repository";

const NEXT = join(__dirname, "../../../.next");
const CHUNKS = join(NEXT, "static/chunks");
const built = existsSync(join(NEXT, "server/app/page_client-reference-manifest.js"));

/** Long authored strings (question prompts and explanations) that only exist in course content. */
function contentMarkers() {
  return courseIds().flatMap((id) => {
    const c = findCourse(id)!;
    const texts = c.questions.flatMap((q) => [q.prompt, "explanation" in q ? String(q.explanation ?? "") : ""]);
    // JSON-escape and cut short, so the marker matches minified string literals verbatim.
    return texts.filter((t) => t.length > 60 && !/["\\\n`]/.test(t)).slice(0, 3).map((t) => ({ id, text: t.slice(0, 48) }));
  });
}

/** Runs against the last `next build`; skipped when there is none. */
describe.skipIf(!built)("client bundle", () => {
  it("contains no course content: questions reach the browser only through /api/v1 or the RSC payload", () => {
    const markers = contentMarkers();
    expect(markers.length).toBeGreaterThan(courseIds().length);
    const files = readdirSync(CHUNKS).filter((f) => f.endsWith(".js"));
    const leaks = files.flatMap((f) => {
      const src = readFileSync(join(CHUNKS, f), "utf8");
      return markers.filter((m) => src.includes(m.text)).map((m) => `${f}: ${m.id} "${m.text}"`);
    });
    expect(leaks).toEqual([]);
  });
});
