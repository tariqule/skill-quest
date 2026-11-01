"use client";

import { useEffect, useState } from "react";
import { ReaderBar, ReaderCard } from "./ReaderParts";
import type { Lesson } from "@/engine/types";
import { SourcesFooter } from "./Sources";

/** The cards of a lesson, in reading order: the picture, each point on its own, then the tip. */
export type ReaderStep = { kind: "picture" } | { kind: "point"; index: number; text: string } | { kind: "tip"; text: string };

export function readerSteps(lesson: Pick<Lesson, "points" | "tip">): ReaderStep[] {
  return [
    { kind: "picture" },
    ...lesson.points.map((text, index) => ({ kind: "point" as const, index, text })),
    ...(lesson.tip ? [{ kind: "tip" as const, text: lesson.tip }] : []),
  ];
}

/**
 * Teach one small idea at a time. Beginners get a calm card per idea instead of a long page:
 * the picture first, then each point alone in large type, then the tip. The very last screen
 * asks if they're ready for the quiz (or want to read it again), so a question
 * never appears until they've been through everything.
 */
export function LessonReader({
  lesson,
  color,
  tipLabel,
  onDone,
  questionCount,
}: {
  lesson: Pick<Lesson, "title" | "visual" | "points" | "pointVisuals" | "tip" | "sources">;
  color: string;
  tipLabel: string;
  onDone: () => void;
  questionCount: number;
}) {
  const steps = readerSteps(lesson);
  const [i, setI] = useState(0);
  const ready = i >= steps.length;
  const step = steps[i];
  const next = () => setI((n) => Math.min(steps.length, n + 1));
  const back = () => setI((n) => Math.max(0, n - 1));

  // Arrow keys and Enter move through the cards; typing in a lab is never interrupted.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey || (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) || t?.isContentEditable) return;
      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        if (ready) onDone();
        else next();
      } else if (e.key === "ArrowLeft") back();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const total = steps.length + 1;
  return (
    <div className="card-in pb-28">
      <h1 data-reading className="mt-3 max-w-[680px] font-heading text-h4 font-semibold leading-tight text-foreground sm:text-h3">{lesson.title}</h1>

      {/* Dots: one per card, filled once you've seen it. */}
      <div className="mt-3 flex max-w-[680px] gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={Math.min(total, i + 1)} aria-label="Lesson progress">
        {Array.from({ length: total }, (_, k) => (
          <span key={k} className="h-1.5 flex-1 rounded-full bg-muted transition-colors duration-200 motion-reduce:transition-none" style={k <= i ? { background: color } : undefined} />
        ))}
      </div>
      <p className="mt-2 text-sm text-foreground/80" aria-live="polite">
        {ready ? "All done reading" : `Card ${i + 1} of ${steps.length}`}
      </p>

      <ReaderCard key={i} step={step} ready={ready} lesson={lesson} color={color} tipLabel={tipLabel} questionCount={questionCount} />

      {/* Credits once, with the recap, so they don't repeat under every card. */}
      {ready && <SourcesFooter sources={lesson.sources} />}

      <ReaderBar ready={ready} atStart={i === 0} lastCard={i === steps.length - 1} onBack={back} onNext={next} onRestart={() => setI(0)} onDone={onDone} />
    </div>
  );
}
