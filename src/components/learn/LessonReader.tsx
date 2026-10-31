"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { MascotSays } from "@/components/fx";
import type { Lesson } from "@/engine/types";
import { RichText } from "./code";
import { exampleStep, quickQuestions } from "./copy";
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
  lesson: Pick<Lesson, "title" | "visual" | "points" | "tip" | "sources">;
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
      <h1 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">{lesson.title}</h1>

      {/* Dots: one per card, filled once you've seen it. */}
      <div className="mt-3 flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={Math.min(total, i + 1)} aria-label="Lesson progress">
        {Array.from({ length: total }, (_, k) => (
          <span key={k} className="h-1.5 flex-1 rounded-full transition" style={{ background: k <= i ? color : "rgb(255 255 255 / 0.12)" }} />
        ))}
      </div>
      <p className="mt-2 text-sm text-slate-400">{ready ? "All done reading" : `Card ${i + 1} of ${steps.length}`}</p>

      <div key={i} className="card-in mt-4">
        {step?.kind === "picture" && (
          <>
            <div className="mb-3">
              <MascotSays mood="happy">Here&apos;s the picture first. Take a look, then tap Next. We&apos;ll go through it one idea at a time.</MascotSays>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/70 p-3 sm:p-6" style={{ boxShadow: `0 20px 60px -30px ${color}` }}>
              {lesson.visual}
            </div>
          </>
        )}

        {step?.kind === "point" && (
          <div className="flex min-h-56 flex-col justify-center rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-10" style={{ boxShadow: `0 20px 60px -30px ${color}` }}>
            {/* Ideas are numbered among themselves; example steps carry their own "Step k of N". */}
            {!exampleStep(step.text) && (
              <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full text-base font-black text-slate-950" style={{ background: color }}>
                {lesson.points.slice(0, step.index + 1).filter((p) => !exampleStep(p)).length}
              </span>
            )}
            <p className=" text-xl leading-relaxed text-white sm:text-2xl sm:leading-relaxed">
              <RichText text={step.text} />
            </p>
          </div>
        )}

        {step?.kind === "tip" && (
          <div className="flex min-h-56 flex-col justify-center rounded-3xl border border-amber-400/30 bg-amber-400/10 p-6 sm:p-10">
            <span className="text-3xl" aria-hidden>
              💡
            </span>
            <div className="mt-3 text-sm font-black uppercase tracking-wider text-amber-300">{tipLabel}</div>
            <p className="mt-2 text-xl leading-relaxed text-amber-50 sm:text-2xl sm:leading-relaxed">
              <RichText text={lesson.tip ?? ""} />
            </p>
          </div>
        )}

        {ready && (
          <div className="rounded-3xl border-2 p-6 text-center sm:p-10" style={{ borderColor: `${color}77`, background: `linear-gradient(180deg, ${color}1f, transparent)` }}>
            <div className="text-5xl">🙌</div>
            <h2 className="mt-3 text-2xl font-black text-white">That&apos;s the lesson!</h2>
            <p className="mt-2 text-lg text-slate-300">
              Ready for {quickQuestions(questionCount)}? They&apos;re short, there&apos;s no timer, and you can see why after each one.
            </p>
          </div>
        )}
      </div>

      {/* Credits once, with the recap, so they don't repeat under every card. */}
      {ready && <SourcesFooter sources={lesson.sources} />}

      {/* Buttons stay within thumb reach at the bottom of the screen. */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-slate-950/95 px-4 pt-3 backdrop-blur" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}>
        <div className="mx-auto flex max-w-3xl gap-3">
          {ready ? (
            <>
              <button type="button" onClick={() => setI(0)} className="rounded-2xl border border-white/20 px-5 py-3.5 text-base font-bold text-slate-100 hover:bg-white/5">
                Read it again
              </button>
              <button
                type="button"
                onClick={onDone}
                className="btn-3d flex-1 rounded-2xl bg-emerald-400 py-3.5 text-lg font-black text-slate-950"
                style={{ "--edge": "#047857" } as CSSProperties}
              >
                I&apos;m ready →
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={back}
                disabled={i === 0}
                aria-label="Back"
                className="rounded-2xl border border-white/20 px-5 py-3.5 text-lg font-bold text-slate-100 hover:bg-white/5 disabled:opacity-30"
              >
                ←
              </button>
              <button
                type="button"
                onClick={next}
                className="btn-3d flex-1 rounded-2xl bg-sky-400 py-3.5 text-lg font-black text-slate-950"
                style={{ "--edge": "#0369a1" } as CSSProperties}
              >
                {i === steps.length - 1 ? "Finished reading →" : "Next →"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
