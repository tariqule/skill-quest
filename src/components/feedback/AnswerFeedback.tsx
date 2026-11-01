"use client";

import { BookOpen, CircleCheck, CircleAlert, Search } from "lucide-react";
import Link from "next/link";
import { m, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { correctPop, motionSafe, wrongShake } from "@/design/motion";
import { cn } from "@/lib/utils";

/** Where "Revisit the concept" goes: a lesson page, or an inline toggle when the learner is already mid-lesson. */
export type ConceptLink = { title: string; href: string } | { title: string; open: boolean; onToggle: () => void };

export interface AnswerFeedbackProps {
  ok: boolean;
  /** One short line after the verdict, e.g. "You'll see it again at the end." */
  note?: ReactNode;
  /** The explanation: why the right answer is right. */
  children?: ReactNode;
  concept?: ConceptLink;
  onOpenGuide?: () => void;
  /** Extra content under the explanation (trace steps, the concept recap). */
  after?: ReactNode;
  className?: string;
}

/** Verdict copy. Wrong answers are framed as part of learning, never as failure. */
export function verdictText(ok: boolean) {
  return ok ? "Correct" : "Not quite";
}

/**
 * The one feedback pattern for every question surface (Hattie & Timperley: verdict, why, where to look):
 * a verdict with an icon, the reason, and a link back to the concept. Focus moves to the verdict so
 * screen-reader and keyboard users land on the reason. The only motion is a <=200ms tick or one 4px shake.
 */
export function AnswerFeedback({ ok, note, children, concept, onOpenGuide, after, className }: AnswerFeedbackProps) {
  const reduced = useReducedMotion();
  const heading = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);
  const Icon = ok ? CircleCheck : CircleAlert;

  return (
    <section
      aria-label="Answer feedback"
      data-verdict={ok ? "correct" : "wrong"}
      className={cn("mt-5 rounded-card border p-4 sm:p-5", ok ? "border-success/40 bg-success/10" : "border-warning/40 bg-warning/10", className)}
    >
      <m.p
        ref={heading}
        tabIndex={-1}
        role="status"
        variants={motionSafe(ok ? correctPop : wrongShake, reduced)}
        initial="initial"
        animate="animate"
        className={cn("flex items-center gap-2 text-lg font-semibold outline-none", ok ? "text-success-foreground" : "text-warning-foreground")}
      >
        <Icon className="size-5 shrink-0" aria-hidden />
        {verdictText(ok)}
      </m.p>
      {note && <p className="mt-1 text-base text-foreground">{note}</p>}
      {children && (
        <div className="mt-3 text-base leading-relaxed text-foreground">
          <span className="font-semibold">Why: </span>
          {children}
        </div>
      )}
      {after}
      {(concept || onOpenGuide) && (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
          {concept && "href" in concept && (
            <Link href={concept.href} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-info-foreground underline-offset-4 hover:underline focus-visible:underline">
              <BookOpen className="size-4" aria-hidden />
              Revisit the lesson: {concept.title}
            </Link>
          )}
          {concept && "onToggle" in concept && (
            <button
              type="button"
              onClick={concept.onToggle}
              aria-expanded={concept.open}
              className="inline-flex min-h-11 items-center gap-1.5 text-left text-sm font-medium text-info-foreground underline-offset-4 hover:underline focus-visible:underline"
            >
              <BookOpen className="size-4 shrink-0" aria-hidden />
              {concept.open ? "Hide" : "Revisit"} the concept: {concept.title}
            </button>
          )}
          {onOpenGuide && (
            <button type="button" onClick={onOpenGuide} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              <Search className="size-4" aria-hidden />
              Open the guide
            </button>
          )}
        </div>
      )}
    </section>
  );
}
