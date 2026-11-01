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

  // PR F moved course content off the client (about 1.6 MB gz down to about 0.33 MB per route).
  // This guard keeps it there: every route may grow at most 4 KB (gzip) over the PR F baseline.
  it.skipIf(!existsSync(BASELINE))("each route's initial JS grows at most 4 KB (gzip) over PR F", () => {
    const base = JSON.parse(readFileSync(BASELINE, "utf8"));
    for (const [name, v] of Object.entries(r)) expect(v!.gzip - base.prF[name].gzip, name).toBeLessThanOrEqual(4 * 1024);
  });
});
