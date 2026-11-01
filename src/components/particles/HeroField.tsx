"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, fit, loop } from "./canvas";
import { draw, fieldCount, makeField, seeded, stepField, themeColor } from "./engine";

/**
 * Slow drifting dots behind the home hero. Decorative only (aria-hidden, no pointer events).
 * Pauses when the tab is hidden or the hero scrolls away; under reduced motion it paints one still frame.
 */
export default function HeroField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let { w, h, ctx } = fit(canvas);
    const reduced = prefersReducedMotion();
    let ps = makeField(w, h, fieldCount(w, h), reduced ? seeded(11) : Math.random);
    const paint = () => {
      ctx?.clearRect(0, 0, w, h);
      if (ctx) draw(ctx, ps, themeColor(canvas));
    };
    const onResize = () => {
      ({ w, h, ctx } = fit(canvas));
      ps = makeField(w, h, fieldCount(w, h), reduced ? seeded(11) : Math.random);
      paint();
    };
    window.addEventListener("resize", onResize);
    if (reduced) {
      paint();
      return () => window.removeEventListener("resize", onResize);
    }
    const stop = loop((dt) => {
      stepField(ps, w, h, dt);
      paint();
      return true;
    }, canvas);
    return () => {
      stop();
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return <canvas ref={ref} aria-hidden="true" data-particles="hero" className={className} />;
}
