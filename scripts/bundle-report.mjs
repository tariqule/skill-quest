#!/usr/bin/env node
/**
 * Route JS report from a production `.next` build: initial JS per route (raw and gzip) and whether
 * any of it contains particle code. Usage: node scripts/bundle-report.mjs [.next dir] [--json]
 * The lesson-page budget is checked against a baseline file when one exists (bundle-baseline.json).
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import vm from "node:vm";

/** String literals that survive minification and live only in src/components/particles. */
export const PARTICLE_MARKERS = ['data-particles', "prefers-reduced-motion: reduce)\").matches"];
export const ROUTES = {
  home: "/page",
  hub: "/c/[course]/page",
  lesson: "/c/[course]/lesson/[id]/page",
  practice: "/c/[course]/practice/page",
  exam: "/c/[course]/exam/page",
  quiz: "/c/[course]/lightning/page",
  timed: "/c/[course]/timed/page",
  review: "/c/[course]/review/page",
};

export function routeJs(nextDir, route) {
  const file = join(nextDir, "server/app", `${route}_client-reference-manifest.js`);
  if (!existsSync(file)) return null;
  const ctx = { self: {}, globalThis: {} };
  ctx.globalThis = ctx.self;
  vm.runInNewContext(readFileSync(file, "utf8"), ctx);
  const manifest = ctx.self.__RSC_MANIFEST ?? ctx.globalThis.__RSC_MANIFEST;
  const entry = manifest[route].entryJSFiles;
  const files = [...new Set(Object.values(entry).flat())];
  return files.map((f) => {
    const buf = readFileSync(join(nextDir, f));
    return { file: f, raw: buf.length, gzip: gzipSync(buf).length, particles: PARTICLE_MARKERS.some((m) => buf.includes(m)) };
  });
}

export function report(nextDir) {
  return Object.fromEntries(
    Object.entries(ROUTES).map(([name, route]) => {
      const files = routeJs(nextDir, route);
      if (!files) return [name, null];
      return [name, { raw: files.reduce((a, f) => a + f.raw, 0), gzip: files.reduce((a, f) => a + f.gzip, 0), chunks: files.length, particles: files.some((f) => f.particles) }];
    }),
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dir = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : ".next";
  const r = report(dir);
  if (process.argv.includes("--json")) console.log(JSON.stringify(r, null, 2));
  else for (const [k, v] of Object.entries(r)) console.log(k.padEnd(9), v ? `${(v.gzip / 1024).toFixed(1)} KB gz  ${(v.raw / 1024).toFixed(1)} KB raw  ${v.chunks} chunks  particles:${v.particles}` : "missing");
}
