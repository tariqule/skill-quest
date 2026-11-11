/**
 * Motion tokens and presets for `motion/react` (and CSS mirrors in tokens.css).
 *
 * Rules (learning psychology, see the redesign plan):
 * - Nothing moves while the learner reads or answers, except <= 200ms feedback
 *   to a change they caused.
 * - No looping / ambient animation (loaders excepted).
 * - Motion never blocks input.
 * Use only `m.*` components inside <MotionProvider> (LazyMotion strict).
 */
import type { Transition, Variants } from "motion/react";

/** Durations in seconds (Motion's unit). */
export const duration = {
  instant: 0,
  fast: 0.12, // state feedback: option select, tick, toggle
  base: 0.2, // card / page change
  slow: 0.32, // layout, sheets, progress fill
  celebrate: 1.2, // max length of a completion celebration
} as const;

/** Cubic-bezier easings. */
export const ease = {
  out: [0.2, 0, 0, 1],
  in: [0.4, 0, 1, 1],
  standard: [0.2, 0, 0.2, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

/** Spring presets. `bounce` is reserved for celebrations. */
export const spring = {
  snappy: { type: "spring", stiffness: 500, damping: 35 },
  gentle: { type: "spring", stiffness: 220, damping: 26 },
  bounce: { type: "spring", stiffness: 300, damping: 15 },
} as const satisfies Record<string, Transition>;

/** Max translate distance (px) and min scale for entering elements. */
export const MAX_SLIDE_PX = 8;
export const MIN_SCALE = 0.98;

/** Card change in the lesson reader: short fade + 8px slide. */
export const cardChange: Variants = {
  initial: { opacity: 0, x: MAX_SLIDE_PX },
  animate: { opacity: 1, x: 0, transition: { duration: duration.base, ease: ease.out } },
  exit: { opacity: 0, x: -MAX_SLIDE_PX, transition: { duration: duration.fast, ease: ease.in } },
};

/** Plain fade (also the reduced-motion fallback for slides). */
export const fade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: duration.base, ease: ease.out } },
  exit: { opacity: 0, transition: { duration: duration.fast, ease: ease.in } },
};

/** Correct answer: tick scales in once. */
export const correctPop: Variants = {
  initial: { scale: MIN_SCALE, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: spring.snappy },
};

/** Wrong answer: a single 4px shake, <= 200ms. */
export const wrongShake: Variants = {
  initial: { x: 0 },
  animate: { x: [0, -4, 4, -2, 0], transition: { duration: duration.base, ease: ease.standard } },
};

/** Progress bar / ring fill. */
export const progressFill: Transition = { duration: duration.slow, ease: ease.out };

/** Pick a variant set that respects reduced motion. */
export function motionSafe(variants: Variants, reduced: boolean | null): Variants {
  return reduced ? fade : variants;
}
