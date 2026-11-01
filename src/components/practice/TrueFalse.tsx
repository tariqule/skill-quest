"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Check, X } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import { duration, ease } from "@/design/motion";
import { cn } from "@/lib/utils";
import { optionState } from "../feedback/ChoiceOption";
import { isTyping } from "../keyboard";

/** Display order of a true/false question's options; the engine never shuffles them. */
const CHOICES = [
  { label: "True", key: "T", icon: Check },
  { label: "False", key: "F", icon: X },
] as const;

interface Props {
  /** Index of the right answer: 0 for True, 1 for False. */
  correct: number;
  /** Submitted pick, or null while choosing. */
  submitted: number[] | null;
  onSubmit: (picked: number[]) => void;
  /** Colour right and wrong once submitted. */
  reveal: boolean;
}

/** Keys that move focus inside the group, and where each sends it. */
function moveTo(key: string, from: number): number | null {
  switch (key) {
    case "ArrowLeft":
    case "ArrowUp":
    case "ArrowRight":
    case "ArrowDown":
      return 1 - from;
    case "Home":
      return 0;
    case "End":
      return 1;
    default:
      return null;
  }
}

/** Focus ring: 2px ring-token outline, offset from the button (WCAG 1.4.11 asks 3:1). */
const FOCUS_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const TONE = {
  idle: "border-border bg-card hover:border-primary/60 hover:bg-accent/40",
  picked: "border-primary bg-primary/10",
  right: "border-success bg-success/10",
  wrong: "border-destructive bg-destructive/10",
  dim: "border-border bg-card text-muted-foreground",
} as const;

/**
 * Two big buttons for a true/false statement, exposed as a radio group with a roving tabindex:
 * Tab reaches only the active option, arrow keys (and Home, End) move between them, Enter or Space
 * picks. T or 1 picks True and F or 2 picks False from anywhere on the page.
 */
export function TrueFalse({ correct, submitted, onSubmit, reveal }: Props) {
  const locked = submitted !== null;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  // The one option Tab lands on: the pick once there is one, otherwise the last focused.
  const [active, setActive] = useState(0);
  const tabStop = submitted?.[0] ?? active;
  const reduced = useReducedMotion();

  useEffect(() => {
    if (locked) return;
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || isTyping(e)) return;
      const k = e.key.toUpperCase();
      const idx = k === "T" || k === "1" ? 0 : k === "F" || k === "2" ? 1 : -1;
      if (idx < 0) return;
      e.preventDefault();
      onSubmit([idx]);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [locked, onSubmit]);

  function onArrow(e: ReactKeyboardEvent, i: number) {
    const to = moveTo(e.key, i);
    if (to === null) return;
    e.preventDefault();
    setActive(to);
    refs.current[to]?.focus();
  }

  return (
    <div role="radiogroup" aria-label="True or false" className="mt-5 grid grid-cols-2 gap-3">
      {CHOICES.map((c, i) => {
        const picked = submitted?.includes(i) ?? false;
        const state = optionState({ picked, right: i === correct, locked, reveal });
        const Icon = c.icon;
        return (
          <m.button
            key={c.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={picked}
            aria-keyshortcuts={c.key}
            tabIndex={i === tabStop ? 0 : -1}
            // aria-disabled, not disabled: a disabled button drops keyboard focus to the page after answering.
            aria-disabled={locked || undefined}
            onFocus={() => setActive(i)}
            onClick={() => !locked && onSubmit([i])}
            onKeyDown={(e) => onArrow(e, i)}
            data-state={state}
            animate={state === "wrong" && !reduced ? { x: [0, -4, 4, -2, 0] } : { x: 0 }}
            transition={{ duration: duration.base, ease: ease.standard }}
            className={cn(
              "flex min-h-16 items-center justify-center gap-2 rounded-card border-2 px-4 py-3 text-lg font-semibold text-foreground transition-colors duration-150 motion-reduce:transition-none",
              TONE[state],
              FOCUS_RING,
              locked && "cursor-default",
            )}
          >
            <Icon className={cn("size-5", state === "right" ? "text-success-foreground" : state === "wrong" ? "text-destructive-foreground" : "text-muted-foreground")} aria-hidden />
            {c.label}
            <kbd className="ml-1 hidden rounded bg-muted px-1.5 text-sm font-medium text-muted-foreground sm:inline">{c.key}</kbd>
          </m.button>
        );
      })}
    </div>
  );
}
