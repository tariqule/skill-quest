import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = join(__dirname, "../..");
const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.tsx?$/.test(f) && !/\.test\./.test(f) ? [p] : [];
  });
const sources = files(SRC).map((p) => ({ path: relative(SRC, p), text: readFileSync(p, "utf8") }));

describe("particle boundary", () => {
  it("is imported only by the home hero and the completion celebration, via the lazy entry", () => {
    const importers = sources
      .filter((s) => !s.path.startsWith("components/particles/") && /from ["']@\/components\/particles|from ["'][./]+particles/.test(s.text))
      .map((s) => s.path)
      .sort();
    expect(importers).toEqual(["components/celebrate/TopicComplete.tsx", "components/home/Hero.tsx"]);
    for (const s of sources.filter((x) => importers.includes(x.path))) expect(s.text).toMatch(/from "@\/components\/particles";/);
  });
  it("loads every particle module through next/dynamic with ssr off", () => {
    const entry = sources.find((s) => s.path === "components/particles/index.tsx")!.text;
    expect(entry.match(/dynamic\(\(\) => import\(/g)).toHaveLength(2);
    expect(entry).not.toMatch(/^import .* from "\.\/(HeroField|Burst|engine|canvas)"/m);
    expect(entry.match(/ssr: false,/g)).toHaveLength(2);
  });
});

describe("reduced motion", () => {
  const read = (p: string) => sources.find((s) => s.path === p)!.text;
  it("the hero paints one still frame and never starts the loop", () => {
    expect(read("components/particles/HeroField.tsx")).toMatch(/if \(reduced\) \{\s*paint\(\);\s*return/);
  });
  it("the burst renders nothing", () => expect(read("components/particles/Burst.tsx")).toMatch(/prefersReducedMotion\(\)\) \{\s*onEnd\?\.\(\);\s*return;/));
  it("the celebration skips its ring, spring and burst", () => {
    const s = read("components/celebrate/TopicComplete.tsx");
    expect(s).toMatch(/const celebrates = !reduced &&/);
    expect(s).toMatch(/initial=\{reduced \? false :/);
  });
  it("the celebration never blocks taps", () => {
    expect(read("components/celebrate/TopicComplete.tsx")).toMatch(/pointer-events-none/);
    expect(read("components/particles/Burst.tsx")).toMatch(/pointer-events-none fixed inset-0/);
  });
});
