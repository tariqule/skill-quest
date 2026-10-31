"use client";

import Link from "next/link";
import type { MapTopic } from "@/engine/practice";

interface Props {
  needs: MapTopic[];
  hrefFor: (lessonId: string) => string;
  color: string;
  onContinue: () => void;
}

/** Shown before a lesson opened ahead of its prerequisites. Advice, not a wall: the learner can carry on. */
export function SoftGate({ needs, hrefFor, color, onContinue }: Props) {
  const [first] = needs;
  return (
    <section role="dialog" aria-labelledby="soft-gate-title" className="card-in mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:p-6">
      <h1 id="soft-gate-title" className="text-xl font-black text-white">
        This builds on {needs.map((n) => n.topic.title).join(" and ")}. Start there?
      </h1>
      <p className="mt-2 text-sm text-slate-300">You can still read this one first. Finishing it counts either way.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {first?.lesson && (
          <Link href={hrefFor(first.lesson)} className="btn-3d rounded-2xl px-5 py-3 font-black text-slate-950" style={{ background: color }}>
            Start {first.topic.title}
          </Link>
        )}
        <button type="button" onClick={onContinue} className="rounded-2xl border border-white/20 px-5 py-3 font-bold text-slate-200 hover:bg-white/10">
          Continue anyway
        </button>
      </div>
    </section>
  );
}
