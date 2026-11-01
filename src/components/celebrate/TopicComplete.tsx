"use client";

import { CircleCheck } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { CelebrationBurst } from "@/components/particles";
import type { CompletionKind } from "./kind";

/** Whole celebration budget: icon settle 0.5s, ring 0.9s, burst under 1.2s. */
export const CELEBRATION_MS = 1200;

/**
 * The topic/module-complete moment: the check springs in, a ring pulses out once and a particle
 * burst (lazy chunk) fires. Everything is pointer-events-none and nothing waits on it, so the
 * Continue button is live from the first frame. Reduced motion: a still check, no burst.
 */
export function TopicComplete({ kind }: { kind: CompletionKind }) {
  const reduced = useReducedMotion();
  const celebrates = !reduced && (kind === "topic" || kind === "module");
  const [ended, setEnded] = useState(false);
  // Hard stop: the burst canvas is gone by CELEBRATION_MS even if a frame stalls.
  useEffect(() => {
    if (!celebrates) return;
    const t = setTimeout(() => setEnded(true), CELEBRATION_MS);
    return () => clearTimeout(t);
  }, [celebrates]);
  const burst = celebrates && !ended;

  return (
    <div className="pointer-events-none relative mx-auto size-12" data-celebration={kind ?? "none"}>
      {celebrates && (
        <m.span
          aria-hidden
          className="absolute inset-0 rounded-full border-2 border-success-foreground"
          initial={{ scale: 0.6, opacity: 0.8 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      )}
      <m.span
        className="block"
        initial={reduced ? false : { scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 18, duration: 0.5 }}
      >
        <CircleCheck className="size-12 text-success-foreground" aria-hidden />
      </m.span>
      {burst && <CelebrationBurst size={kind === "module" ? "module" : "topic"} onEnd={() => setEnded(true)} />}
    </div>
  );
}
