"use client";

import { Check, X } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { duration, ease } from "@/design/motion";
import { cn } from "@/lib/utils";

/** idle: not chosen · picked: chosen, not graded · right / wrong: graded · dim: graded, not involved. */
export type OptionState = "idle" | "picked" | "right" | "wrong" | "dim";

export function optionState({ picked, right, locked, reveal }: { picked: boolean; right: boolean; locked: boolean; reveal: boolean }): OptionState {
  if (locked && reveal) return right ? "right" : picked ? "wrong" : "dim";
  return picked ? "picked" : locked ? "dim" : "idle";
}

const TONE: Record<OptionState, string> = {
  idle: "border-border bg-card hover:border-primary/60 hover:bg-accent/40",
  picked: "border-primary bg-primary/10",
  right: "border-success bg-success/10",
  wrong: "border-destructive bg-destructive/10",
  dim: "border-border bg-card text-muted-foreground",
};

/**
 * A full-width answer card. Nothing moves while choosing; after grading the picked wrong option
 * shakes once (4px, 200ms) and the right one gets a tick. Reduced motion: no shake.
 */
export function ChoiceOption({
  letter,
  state,
  disabled,
  onClick,
  pressed,
  children,
}: {
  letter?: string;
  state: OptionState;
  disabled?: boolean;
  onClick: () => void;
  pressed?: boolean;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  return (
    <m.button
      type="button"
      disabled={disabled}
      aria-pressed={pressed}
      onClick={onClick}
      animate={state === "wrong" && !reduced ? { x: [0, -4, 4, -2, 0] } : { x: 0 }}
      transition={{ duration: duration.base, ease: ease.standard }}
      data-state={state}
      className={cn(
        "flex min-h-12 w-full items-start gap-3 rounded-card border-2 px-4 py-3 text-left text-base text-foreground outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default motion-reduce:transition-none",
        TONE[state],
      )}
    >
      {letter && (
        <span className={cn("mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md text-sm font-semibold", state === "picked" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")} aria-hidden>
          {letter}
        </span>
      )}
      <span className="min-w-0 flex-1 pt-0.5">{children}</span>
      {state === "right" && <Mark ok />}
      {state === "wrong" && <Mark ok={false} />}
    </m.button>
  );
}

function Mark({ ok }: { ok: boolean }) {
  const Icon = ok ? Check : X;
  return (
    <m.span
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: duration.fast, ease: ease.out }}
      className={cn("mt-0.5 flex shrink-0 items-center gap-1 text-sm font-semibold", ok ? "text-success-foreground" : "text-destructive-foreground")}
    >
      <Icon className="size-5" aria-hidden />
      <span className="sr-only">{ok ? "Right answer" : "Your answer"}</span>
    </m.span>
  );
}
