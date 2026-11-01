"use client";

import { RichText } from "./learn/code";
import { useState } from "react";
import { useCourse } from "@/engine/course-context";
import type { Challenge } from "@/engine/types";
import { Confetti } from "./fx";
import { BlockIcon } from "@/components/learn/block-icons";

interface Props {
  challenge: Challenge;
  /** Called when the player moves on; `solved` says whether they met the goal. */
  onDone: (solved: boolean) => void;
}

/** A lab with a goal on top. The lab reports success; the card celebrates and explains. */
export function ChallengeCard({ challenge, onDone }: Props) {
  const { store, course } = useCourse();
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);

  function handleSolved() {
    if (solved) return;
    setSolved(true);
    store.solveChallenge(challenge.id);
  }

  return (
    <div className="card-in">
      {solved && <Confetti count={40} />}
      <div className={`rounded-2xl border-2 p-4 transition ${solved ? "border-success/60 bg-success/10" : "border-info/40 bg-info/5"}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-info/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-info-foreground"><BlockIcon icon="🎯" className="inline-block size-[1.1em] align-[-0.15em]" /> Hands-on challenge</span>
          <span className="font-semibold text-foreground">{challenge.title}</span>
          {solved && <span className="ml-auto font-semibold text-success-foreground"><BlockIcon icon="✓" className="inline-block size-[1.1em] align-[-0.15em]" /> Solved · +{course.config.xp.challengeSolved} XP</span>}
        </div>
        <p className="mt-2 text-foreground"><RichText text={challenge.goal} /></p>
        {challenge.hint && !solved && (
          <button type="button" onClick={() => setShowHint(!showHint)} className="mt-2 text-sm text-info-foreground underline">
            {showHint ? <RichText text={challenge.hint} /> : "Need a hint?"}
          </button>
        )}
        {solved && <p className="pop-in mt-2 rounded-xl bg-background p-3 text-sm text-success-foreground"><BlockIcon icon="🧠" className="inline-block size-[1.1em] align-[-0.15em]" /> <RichText text={challenge.takeaway} /></p>}
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card p-4 sm:p-6">{challenge.render(handleSolved)}</div>

      <div className="mt-4 flex justify-end gap-3">
        {!solved && (
          <button type="button" onClick={() => onDone(false)} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted">
            Skip for now
          </button>
        )}
        <button
          type="button"
          disabled={!solved}
          onClick={() => onDone(true)}
          className="rounded-xl bg-success px-6 py-2.5 font-semibold text-primary-foreground disabled:opacity-40"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
