/** A source of uniform numbers in [0, 1). Injected so draws are reproducible in tests. */
export type Random = () => number;

/**
 * Draws up to `size` distinct items, each pick proportional to its weight. Items with a
 * non-positive weight are never drawn. Pure apart from `rand`.
 */
export function weightedSample<T>(items: readonly T[], weight: (item: T) => number, size: number, rand: Random): T[] {
  const pool = items.map((item) => ({ item, w: weight(item) })).filter((x) => x.w > 0);
  const out: T[] = [];
  while (out.length < size && pool.length) {
    let r = rand() * pool.reduce((sum, x) => sum + x.w, 0);
    let i = 0;
    while (i < pool.length - 1 && r >= pool[i].w) r -= pool[i++].w;
    out.push(pool[i].item);
    pool.splice(i, 1);
  }
  return out;
}
