/**
 * The one app background: a still, low-contrast wash behind every page.
 * Replaces the twinkling Starfield and the Code Quest rain (no ambient motion;
 * the Particles hero arrives separately and only on home).
 */
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-background">
      <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,var(--color-primary)_0%,transparent_65%)] opacity-[0.08]" />
    </div>
  );
}
