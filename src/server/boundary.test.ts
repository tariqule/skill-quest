import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = resolve(__dirname, "..");
const SERVER_ONLY = ["scenarios", "server"].map((d) => join(SRC, d) + "/");
const COURSES = join(SRC, "courses") + "/";

/**
 * Off limits to client code: the server tree, scenario content, and course definitions (the
 * registry and every module that defines a course). Lesson visuals and labs live beside their
 * course as client components, with small helpers (sample data, runtimes); those are allowed.
 */
function serverOnly(file: string) {
  if (SERVER_ONLY.some((d) => file.startsWith(d))) return true;
  if (!file.startsWith(COURSES)) return false;
  return file === join(COURSES, "index.ts") || /defineCourse\(|from "@\/engine\/define"/.test(readFileSync(file, "utf8"));
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(f) && !/\.test\.tsx?$/.test(f) ? [p] : [];
  });
}

function resolveImport(from: string, spec: string): string | null {
  const base = spec.startsWith("@/") ? join(SRC, spec.slice(2)) : spec.startsWith(".") ? resolve(dirname(from), spec) : null;
  if (!base) return null;
  for (const c of [base, `${base}.ts`, `${base}.tsx`, join(base, "index.ts"), join(base, "index.tsx")]) if (existsSync(c) && statSync(c).isFile()) return c;
  return null;
}

/** Value imports only: `import type` and `export type` vanish at build time. */
function importsOf(file: string): string[] {
  const src = readFileSync(file, "utf8");
  const specs = [...src.matchAll(/^\s*(?:import|export)\s+(?!type\b)(?:[^"'`;]*?\sfrom\s+)?["']([^"']+)["']/gm), ...src.matchAll(/import\(\s*["']([^"']+)["']\s*\)/g)].map((m) => m[1]);
  return specs.map((s) => resolveImport(file, s)).filter((p): p is string => !!p);
}

const isClient = (file: string) => /^\s*["']use client["']/.test(readFileSync(file, "utf8"));

describe("server/client boundary", () => {
  it("no client module reaches course content or server code, directly or through other modules", () => {
    const files = walk(SRC);
    const clients = files.filter(isClient);
    expect(clients.length).toBeGreaterThan(20);
    const leaks: string[] = [];
    for (const entry of clients) {
      const seen = new Set<string>();
      const stack: [string, string[]][] = [[entry, []]];
      while (stack.length) {
        const [file, path] = stack.pop()!;
        if (seen.has(file)) continue;
        seen.add(file);
        if (serverOnly(file)) {
          leaks.push([...path, file].map((f) => relative(SRC, f)).join(" -> "));
          continue;
        }
        for (const dep of importsOf(file)) stack.push([dep, [...path, file]]);
      }
    }
    expect(leaks).toEqual([]);
  });

  it("server modules declare server-only", () => {
    for (const f of walk(join(SRC, "server"))) expect(readFileSync(f, "utf8"), relative(SRC, f)).toMatch(/import "server-only"/);
  });
});
