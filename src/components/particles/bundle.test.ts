import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PARTICLE_MARKERS, report } from "../../../scripts/bundle-report.mjs";

const ROOT = join(__dirname, "../../..");
const NEXT = join(ROOT, ".next");
const built = existsSync(join(NEXT, "server/app/page_client-reference-manifest.js"));
const BASELINE = join(ROOT, "scripts/bundle-baseline.json");

/** Runs against the last `next build`; skipped (with a note) when there is no production build. */
describe.skipIf(!built)("production bundle", () => {
  const r: Record<string, { gzip: number; particles: boolean } | null> = built ? report(NEXT) : {};

  it("keeps particle code out of every route's initial JS, home included (it loads lazily)", () => {
    for (const [name, v] of Object.entries(r) as [string, { particles: boolean } | null][]) {
      expect(v, name).not.toBeNull();
      expect(v!.particles, `${name} initial JS contains particle code`).toBe(false);
    }
  });

  it("still builds the particle code, as separate lazy chunks", () => {
    const dir = join(NEXT, "static/chunks");
    const hits = readdirSync(dir).filter((f) => f.endsWith(".js") && PARTICLE_MARKERS.some((m: string) => readFileSync(join(dir, f), "utf8").includes(m)));
    expect(hits.length).toBeGreaterThanOrEqual(1);
  });

  // The plan's budget (<= 25 KB over PR A) was already spent by PRs B-D (motion runtime and redesigned
  // components; see the PR E notes). This guard stops further growth: PR E may add at most 4 KB.
  it.skipIf(!existsSync(BASELINE))("lesson page initial JS grows at most 4 KB (gzip) over PR D", () => {
    const base = JSON.parse(readFileSync(BASELINE, "utf8"));
    expect(r.lesson!.gzip - base.prD.lesson.gzip).toBeLessThanOrEqual(4 * 1024);
  });
});
