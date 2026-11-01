"use client";

import { LazyMotion } from "motion/react";
import type { ReactNode } from "react";

// domMax adds layout animations (~10 KB more). It loads only where a map renders, not on lesson routes.
const loadDomMax = () => import("motion/react").then((m) => m.domMax);

/** Wrap a module map so its `m.*` children can use `layout`. The root LazyMotion (domAnimation) stays as is elsewhere. */
export function LayoutMotion({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadDomMax} strict>
      {children}
    </LazyMotion>
  );
}

/** The plan's "gentle" spring for layout and the map. */
export const GENTLE = { type: "spring", stiffness: 220, damping: 26 } as const;
