"use client";

import { useEffect, useState } from "react";
import { DOMAIN_BY_ID } from "@/data/domains";
import type { PreparedQuestion } from "@/lib/game";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

interface Props {
  q: PreparedQuestion;
  /** Submitted answer, or null while the player is still choosing. */
  submitted: number[] | null;
  onSubmit: (picked: number[]) => void;
  /** Show correct/incorrect colouring and the explanation once submitted. */
  reveal?: boolean;
  showDomain?: boolean;
  explain?: boolean;
}

export function QuestionCard({ q, submitted, onSubmit, reveal = true, showDomain = false, explain = true }: Props) {
  const multi = q.correct.length > 1;
  const [pending, setPending] = useState<number[]>([]);
  const locked = submitted !== null;
  const domain = DOMAIN_BY_ID[q.domain];

  function choose(i: number) {
    if (locked) return;
    if (!multi) return onSubmit([i]);
    setPending((p) => {
      if (p.includes(i)) return p.filter((x) => x !== i);
      return p.length < q.correct.length ? [...p, i] : p;
    });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (locked || e.metaKey || e.ctrlKey) return;
      const k = e.key.toUpperCase();
      const idx = /^[1-6]$/.test(k) ? Number(k) - 1 : LETTERS.indexOf(k);
      if (idx >= 0 && idx < q.shuffled.length) {
        e.preventDefault();
        choose(idx);
      } else if (e.key === "Enter" && multi && pending.length === q.correct.length) {
        e.preventDefault();
        onSubmit(pending);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:p-7 shadow-xl">
      {showDomain && (
        <div className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: domain.color }}>
          {domain.emoji} Domain {domain.number}: {domain.name}
        </div>
      )}
      <h2 className="text-lg sm:text-xl font-semibold leading-snug text-white">{q.prompt}</h2>
      {multi && !locked && (
        <p className="mt-2 text-sm text-amber-300">Choose {q.correct.length}. Then press Submit (or Enter).</p>
      )}

      <ul className="mt-5 grid gap-3">
        {q.shuffled.map((opt, i) => {
          const isPicked = (submitted ?? pending).includes(i);
          const isRight = q.correct.includes(i);
          let tone = "border-white/10 bg-white/5 hover:border-sky-400/60 hover:bg-sky-400/10";
          if (locked && reveal) {
            if (isRight) tone = "border-emerald-400 bg-emerald-400/15";
            else if (isPicked) tone = "border-rose-400 bg-rose-400/15";
            else tone = "border-white/5 bg-white/[0.02] opacity-60";
          } else if (locked) {
            tone = isPicked ? "border-sky-400 bg-sky-400/15" : "border-white/5 bg-white/[0.02] opacity-60";
          } else if (isPicked) {
            tone = "border-sky-400 bg-sky-400/15";
          }
          return (
            <li key={i}>
              <button
                type="button"
                disabled={locked}
                onClick={() => choose(i)}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${tone} disabled:cursor-default`}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-xs font-bold text-slate-200">
                  {LETTERS[i]}
                </span>
                <span className="text-slate-100">{opt}</span>
                {locked && reveal && isRight && <span className="ml-auto text-emerald-300">✓</span>}
                {locked && reveal && isPicked && !isRight && <span className="ml-auto text-rose-300">✗</span>}
              </button>
            </li>
          );
        })}
      </ul>

      {multi && !locked && (
        <button
          type="button"
          disabled={pending.length !== q.correct.length}
          onClick={() => onSubmit(pending)}
          className="mt-5 rounded-xl bg-sky-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-40"
        >
          Submit
        </button>
      )}

      {locked && reveal && explain && (
        <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-relaxed text-slate-300">
          <span className="font-semibold text-white">Why: </span>
          {q.explanation}
        </div>
      )}
    </div>
  );
}
