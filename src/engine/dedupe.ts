import type { Course } from "./types";

const STOP = new Set("a an the and or of to in on is it its it's that this for with as at by be are so you your one each".split(" "));

function bag(text: string): Set<string> {
  return new Set(text.toLowerCase().replace(/[`*]/g, "").match(/[a-z0-9()]+/g)?.filter((w) => !STOP.has(w) && w.length > 1) ?? []);
}

/** Share of words two lesson points have in common (Jaccard on content words). */
export function overlap(a: string, b: string): number {
  const x = bag(a), y = bag(b);
  let both = 0;
  for (const w of x) if (y.has(w)) both++;
  return both / Math.max(1, x.size + y.size - both);
}

/** Pairs of points within the same lesson that say nearly the same thing. */
export function repeatedPoints(course: Course, threshold = 0.45): string[] {
  const out: string[] = [];
  for (const l of Object.values(course.lessons).flat())
    for (let i = 0; i < l.points.length; i++)
      for (let j = i + 1; j < l.points.length; j++) {
        const o = overlap(l.points[i], l.points[j]);
        if (o >= threshold) out.push(`[${course.id}] ${l.id} points ${i + 1} and ${j + 1} overlap ${o.toFixed(2)}`);
      }
  return out;
}
