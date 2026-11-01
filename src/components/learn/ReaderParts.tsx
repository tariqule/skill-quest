"use client";

import { ArrowRight, ChevronLeft, CircleCheck, Lightbulb, RotateCcw } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { cardChange, motionSafe } from "@/design/motion";
import type { Lesson } from "@/engine/types";
import { RichText } from "./code";
import { exampleStep, quickQuestions } from "./copy";
import type { ReaderStep } from "./LessonReader";

/** Reading measure: about 65-75 characters at body size (Sweller: no chrome competing with the text). */
export const MEASURE = "max-w-[680px]";

type ReaderLesson = Pick<Lesson, "visual" | "points" | "pointVisuals" | "tip">;

/**
 * One card of the lesson reader. It enters with a 200ms fade and 8px slide (a plain fade under
 * reduced motion), then stays still while the learner reads. No exit animation, so Next never waits.
 */
export function ReaderCard({
  step,
  ready,
  lesson,
  color,
  tipLabel,
  questionCount,
}: {
  step: ReaderStep | undefined;
  ready: boolean;
  lesson: ReaderLesson;
  color: string;
  tipLabel: string;
  questionCount: number;
}) {
  const reduced = useReducedMotion();
  return (
    <m.div variants={motionSafe(cardChange, reduced)} initial="initial" animate="animate" className={`mt-4 ${step?.kind === "picture" ? "" : MEASURE}`}>
      {step?.kind === "picture" && (
        <>
          <p className={`mb-3 text-base text-muted-foreground ${MEASURE}`}>Start with the picture. Then we&apos;ll go through it one idea at a time.</p>
          <div className="overflow-x-auto rounded-card border border-border bg-card p-3 sm:p-6">{lesson.visual}</div>
        </>
      )}

      {step?.kind === "point" && (
        <div className="flex min-h-56 flex-col justify-center rounded-card border border-border bg-card p-6 sm:p-10">
          {/* Ideas are numbered among themselves; example steps carry their own "Step k of N". */}
          {!exampleStep(step.text) && (
            <span className="mb-4 flex size-9 items-center justify-center rounded-full text-base font-semibold text-slate-950" style={{ background: color }}>
              {lesson.points.slice(0, step.index + 1).filter((p) => !exampleStep(p)).length}
            </span>
          )}
          <p className="text-body leading-relaxed text-foreground sm:text-xl sm:leading-relaxed">
            <RichText text={step.text} />
          </p>
          {lesson.pointVisuals?.[step.index] && <div className="mt-5">{lesson.pointVisuals[step.index]}</div>}
        </div>
      )}

      {step?.kind === "tip" && (
        <div className="flex min-h-56 flex-col justify-center rounded-card border border-warning/40 bg-warning/10 p-6 sm:p-10">
          <Lightbulb className="size-7 text-warning-foreground" aria-hidden />
          <div className="mt-3 text-sm font-semibold uppercase tracking-wider text-warning-foreground">{tipLabel}</div>
          <p className="mt-2 text-body leading-relaxed text-foreground sm:text-xl sm:leading-relaxed">
            <RichText text={lesson.tip ?? ""} />
          </p>
        </div>
      )}

      {ready && (
        <div className="rounded-card border border-success/40 bg-success/10 p-6 text-center sm:p-10">
          <CircleCheck className="mx-auto size-10 text-success-foreground" aria-hidden />
          <h2 className="mt-3 font-heading text-h4 font-semibold text-foreground">That&apos;s the lesson</h2>
          <p className="mt-2 text-body text-muted-foreground">
            Ready for {quickQuestions(questionCount)}? They&apos;re short, there&apos;s no timer, and you can see why after each one.
          </p>
        </div>
      )}
    </m.div>
  );
}

/** Thumb-reach bar: one primary action, a quiet secondary, and the keyboard hint on desktop. */
export function ReaderBar({
  ready,
  atStart,
  lastCard,
  onBack,
  onNext,
  onRestart,
  onDone,
}: {
  ready: boolean;
  atStart: boolean;
  lastCard: boolean;
  onBack: () => void;
  onNext: () => void;
  onRestart: () => void;
  onDone: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-4 pt-3 backdrop-blur" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}>
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        {ready ? (
          <>
            <Button type="button" variant="outline" size="xl" onClick={onRestart} className="h-12 sm:h-12">
              <RotateCcw aria-hidden />
              Read it again
            </Button>
            <Button type="button" size="xl" onClick={onDone} className="h-12 flex-1 sm:h-12">
              I&apos;m ready
              <ArrowRight aria-hidden />
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="outline" size="xl" onClick={onBack} disabled={atStart} aria-label="Back" className="h-12 w-14 sm:h-12">
              <ChevronLeft aria-hidden />
            </Button>
            <Button type="button" size="xl" onClick={onNext} className="h-12 flex-1 sm:h-12">
              {lastCard ? "Finished reading" : "Next"}
              <ArrowRight aria-hidden />
            </Button>
          </>
        )}
        <p className="hidden shrink-0 items-center gap-1 text-sm text-muted-foreground lg:flex">
          <Kbd style={{ fontSize: "0.875rem" }}>←</Kbd>
          <Kbd style={{ fontSize: "0.875rem" }}>→</Kbd>
          to move
        </p>
      </div>
    </div>
  );
}
