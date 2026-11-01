"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/** Count-up duration from the motion tokens: 600 ms or less, and only outside reading areas. */
export const COUNT_UP_MS = 600;

/**
 * A number that counts up to `value` when it changes (XP, streak, readiness).
 * The first render shows the value as is, so nothing moves on page load; only a later
 * change (an answer, a level up) animates. Reduced motion jumps straight to the value.
 * Screen readers get the final value only: the ticking text is aria-hidden.
 */
export function CountUp({ value, format = String, className }: { value: number; format?: (n: number) => string; className?: string }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = from.current;
    from.current = value;
    if (reduce || start === value) {
      setShown(value);
      return;
    }
    const controls = animate(start, value, {
      duration: COUNT_UP_MS / 1000,
      ease: [0.2, 0, 0, 1],
      onUpdate: (n) => setShown(Math.round(n)),
    });
    return () => controls.stop();
  }, [value, reduce]);

  return (
    <span className={className}>
      <span aria-hidden="true" className="tabular-nums">{format(shown)}</span>
      <span className="sr-only">{format(value)}</span>
    </span>
  );
}
