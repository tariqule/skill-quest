"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, fit, loop } from "./canvas";
import { draw, makeBurst, stepBurst, themeColor } from "./engine";

/**
 * A one-shot burst over the viewport (under 1.2s). Never takes pointer events, so the next tap
 * always lands; under reduced motion it renders nothing. `size` scales it for a module finish.
 */
export default function Burst({ origin, size = "topic", onEnd }: { origin?: { x: number; y: number }; size?: "topic" | "module"; onEnd?: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || prefersReducedMotion()) {
      onEnd?.();
      return;
    }
    const { w, h, ctx } = fit(canvas);
    const o = origin ?? { x: w / 2, y: h * 0.35 };
    const ps = makeBurst(o.x, o.y, size === "module" ? 64 : 36, size === "module" ? 66 : 54);
    const color = themeColor(canvas);
    const accent = themeColor(canvas, "--reward", color);
    const stop = loop((dt) => {
      const alive = stepBurst(ps, dt);
      ctx?.clearRect(0, 0, w, h);
      if (ctx) {
        draw(ctx, ps.filter((_, i) => i % 3), color);
        draw(ctx, ps.filter((_, i) => !(i % 3)), accent);
      }
      if (!alive) onEnd?.();
      return alive;
    });
    return stop;
    // One burst per mount; the parent remounts it (key) to fire again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <canvas ref={ref} aria-hidden="true" data-particles="burst" className="pointer-events-none fixed inset-0 z-50 size-full" />;
}
