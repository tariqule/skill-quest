/** Shared canvas plumbing for the particle components: sizing, frame loop, pause rules. */

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Size a canvas to its box at device pixel ratio (capped at 2 to save battery). Returns CSS size. */
export function fit(canvas: HTMLCanvasElement): { w: number; h: number; ctx: CanvasRenderingContext2D | null } {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const { width: w, height: h } = canvas.getBoundingClientRect();
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d");
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w, h, ctx };
}

/**
 * Run `frame(dt)` on rAF while the tab is visible (and, if given, while `el` is on screen).
 * `frame` returns false to stop. Returns a cleanup function.
 */
export function loop(frame: (dt: number) => boolean, el?: Element): () => void {
  let raf = 0;
  let last = 0;
  let onScreen = true;
  let done = false;
  const tick = (t: number) => {
    raf = 0;
    const dt = last ? Math.min((t - last) / (1000 / 60), 3) : 1;
    last = t;
    if (!frame(dt)) {
      done = true;
      return;
    }
    schedule();
  };
  const schedule = () => {
    if (!done && !raf && onScreen && document.visibilityState === "visible") raf = requestAnimationFrame(tick);
  };
  const pause = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
  };
  const onVisibility = () => (document.visibilityState === "visible" ? schedule() : pause());
  document.addEventListener("visibilitychange", onVisibility);
  const io = el && "IntersectionObserver" in window ? new IntersectionObserver(([e]) => ((onScreen = e.isIntersecting) ? schedule() : pause())) : null;
  if (el) io?.observe(el);
  schedule();
  return () => {
    done = true;
    pause();
    io?.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
