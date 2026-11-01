/**
 * Tiny canvas particle engine, adapted from Magic UI's MIT "Particles" component
 * (https://magicui.design/docs/components/particles). Pure functions, no DOM, so it's unit-tested.
 * Two modes: a slow drifting `field` (home hero background) and a one-shot `burst` (celebrations).
 */

export type Particle = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; life: number; maxLife: number };

export type Rng = () => number;

/** Deterministic PRNG (mulberry32) so tests and the reduced-motion static frame are stable. */
export function seeded(seed = 1): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** How many field particles suit an area: sparse on phones, capped on big screens. */
export function fieldCount(width: number, height: number, density = 1): number {
  return Math.max(12, Math.min(80, Math.round(((width * height) / 14000) * density)));
}

export function makeField(width: number, height: number, count: number, rng: Rng = Math.random): Particle[] {
  return Array.from({ length: count }, () => ({
    x: rng() * width,
    y: rng() * height,
    vx: (rng() - 0.5) * 0.15,
    vy: (rng() - 0.5) * 0.15,
    r: 0.6 + rng() * 1.4,
    alpha: 0.15 + rng() * 0.45,
    life: 0,
    maxLife: Infinity,
  }));
}

/** Advance a field one frame (dt in 60fps frames); particles wrap at the edges. */
export function stepField(ps: Particle[], width: number, height: number, dt = 1): void {
  for (const p of ps) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (p.x < -2) p.x = width + 2;
    else if (p.x > width + 2) p.x = -2;
    if (p.y < -2) p.y = height + 2;
    else if (p.y > height + 2) p.y = -2;
  }
}

/** A radial burst from (x, y). `frames` is its life at 60fps: 54 frames is 0.9s. */
export function makeBurst(x: number, y: number, count = 36, frames = 54, rng: Rng = Math.random): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + rng() * 0.4;
    const speed = 2.2 + rng() * 3.2;
    return { x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1.2, r: 1.5 + rng() * 2.5, alpha: 1, life: 0, maxLife: frames * (0.7 + rng() * 0.3) };
  });
}

/** Advance a burst: drag, a little gravity, fade out. Returns false once every particle has died. */
export function stepBurst(ps: Particle[], dt = 1): boolean {
  let alive = false;
  for (const p of ps) {
    if (p.life >= p.maxLife) continue;
    p.life += dt;
    p.vx *= 0.94;
    p.vy = p.vy * 0.94 + 0.12 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.alpha = Math.max(0, 1 - p.life / p.maxLife);
    if (p.life < p.maxLife) alive = true;
  }
  return alive;
}

export function draw(ctx: CanvasRenderingContext2D, ps: Particle[], color: string): void {
  ctx.fillStyle = color;
  for (const p of ps) {
    if (p.alpha <= 0) continue;
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** The theme's primary colour, read live so particles follow light and dark mode. */
export function themeColor(el: Element, variable = "--primary", fallback?: string): string {
  const style = getComputedStyle(el);
  return style.getPropertyValue(variable).trim() || fallback || style.color;
}
