"use client";

import { useState, type CSSProperties } from "react";
import { useCourse } from "@/engine/course-context";
import type { Challenge } from "@/engine/types";
import { Confetti } from "./fx";

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
      <div className={`rounded-2xl border-2 p-4 transition ${solved ? "border-emerald-400/60 bg-emerald-400/10" : "border-fuchsia-400/40 bg-fuchsia-400/5"}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-fuchsia-400/20 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-fuchsia-200">🎯 Hands-on challenge</span>
          <span className="font-black text-white">{challenge.title}</span>
          {solved && <span className="ml-auto font-black text-emerald-300">✓ Solved · +{course.config.xp.challengeSolved} XP</span>}
        </div>
        <p className="mt-2 text-slate-100">{challenge.goal}</p>
        {challenge.hint && !solved && (
          <button type="button" onClick={() => setShowHint(!showHint)} className="mt-2 text-sm text-fuchsia-200 underline">
            {showHint ? challenge.hint : "💡 Need a hint?"}
          </button>
        )}
        {solved && <p className="pop-in mt-2 rounded-xl bg-slate-950/50 p-3 text-sm text-emerald-100">🧠 {challenge.takeaway}</p>}
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-6">{challenge.render(handleSolved)}</div>

      <div className="mt-4 flex justify-end gap-3">
        {!solved && (
          <button type="button" onClick={() => onDone(false)} className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10">
            Skip for now
          </button>
        )}
        <button
          type="button"
          disabled={!solved}
          onClick={() => onDone(true)}
          className="btn-3d rounded-xl bg-emerald-400 px-6 py-2.5 font-black text-slate-950 disabled:opacity-40"
          style={{ "--edge": "#047857" } as CSSProperties}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
