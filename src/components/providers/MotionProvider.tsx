"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/**
 * App-wide Motion setup:
 * - LazyMotion + domAnimation keeps the bundle small; `strict` throws if a
 *   full `motion.*` component is rendered (use `m.*`).
 * - reducedMotion="user" honours the OS setting for every m.* component.
 * Routes needing layout animations (e.g. the module map) can nest their own
 * LazyMotion with `domMax`.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
