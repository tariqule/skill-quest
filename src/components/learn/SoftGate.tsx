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
    <section role="dialog" aria-labelledby="soft-gate-title" className="card-in mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h1 id="soft-gate-title" className="text-xl font-semibold text-foreground">
        This builds on {needs.map((n) => n.topic.title).join(" and ")}. Start there?
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">You can still read this one first. Finishing it counts either way.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {first?.lesson && (
          <Link href={hrefFor(first.lesson)} className="rounded-2xl px-5 py-3 font-semibold text-primary-foreground" style={{ background: color }}>
            Start {first.topic.title}
          </Link>
        )}
        <button type="button" onClick={onContinue} className="rounded-2xl border border-border px-5 py-3 font-bold text-foreground hover:bg-muted">
          Continue anyway
        </button>
      </div>
    </section>
  );
}
