"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { comboMultiplier, isCorrect, type PreparedQuestion } from "@/lib/game";
import { addXp, recordAnswer, unlockBadge } from "@/lib/store";
import { QuestionCard } from "./QuestionCard";
import { Bar, Button, Stars } from "./ui";

export interface SessionResult {
  correct: number;
  total: number;
  failed: boolean;
}

interface Props {
  intro: ReactNode;
  startLabel: string;
  buildDeck: () => PreparedQuestion[];
  /** Lives. Omit for unlimited. */
  hearts?: number;
  baseXp?: number;
  color?: string;
  showDomain?: boolean;
  /** Called once at the end. Return a star rating (0-3) to show, or nothing. */
  onComplete?: (r: SessionResult) => number | void;
  emptyMessage?: ReactNode;
}

type Phase = "intro" | "play" | "done";

export function QuizSession({
  intro,
  startLabel,
  buildDeck,
  hearts: maxHearts,
  baseXp = 10,
  color = "#38bdf8",
  showDomain,
  onComplete,
  emptyMessage,
}: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [deck, setDeck] = useState<PreparedQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [submitted, setSubmitted] = useState<number[] | null>(null);
  const [hearts, setHearts] = useState(maxHearts ?? 0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [earned, setEarned] = useState(0);
  const [lastGain, setLastGain] = useState<number | null>(null);
  const [stars, setStars] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  const q = deck[idx];

  function start() {
    const d = buildDeck();
    setDeck(d);
    setIdx(0);
    setSubmitted(null);
    setHearts(maxHearts ?? 0);
    setCombo(0);
    setBestCombo(0);
    setCorrect(0);
    setEarned(0);
    setLastGain(null);
    setStars(null);
    setFailed(false);
    setPhase(d.length ? "play" : "done");
  }

  function submit(picked: number[]) {
    const ok = isCorrect(q, picked);
    setSubmitted(picked);
    recordAnswer(q.id, ok);
    if (ok) {
      const nextCombo = combo + 1;
      const gain = Math.round(baseXp * comboMultiplier(nextCombo));
      setCombo(nextCombo);
      setBestCombo((b) => Math.max(b, nextCombo));
      setCorrect((c) => c + 1);
      setEarned((e) => e + gain);
      setLastGain(gain);
      addXp(gain);
      if (nextCombo >= 5) unlockBadge("combo-5");
      if (nextCombo >= 10) unlockBadge("combo-10");
    } else {
      setCombo(0);
      setLastGain(null);
      if (maxHearts !== undefined) setHearts((h) => h - 1);
    }
  }

  function finish(outOfLives: boolean) {
    const finalCorrect = correct;
    const result = { correct: finalCorrect, total: deck.length, failed: outOfLives };
    const s = onComplete?.(result);
    if (typeof s === "number") {
      setStars(s);
      if (s > 0) {
        const bonus = s * 20;
        setEarned((e) => e + bonus);
        addXp(bonus);
      }
    }
    setFailed(outOfLives);
    setPhase("done");
  }

  function next() {
    if (maxHearts !== undefined && hearts <= 0) return finish(true);
    if (idx + 1 >= deck.length) return finish(false);
    setIdx(idx + 1);
    setSubmitted(null);
    setLastGain(null);
  }

  useEffect(() => {
    if (phase !== "play" || submitted === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (phase === "intro") {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 sm:p-8">
        {intro}
        <Button onClick={start} className="mt-6">
          {startLabel}
        </Button>
      </div>
    );
  }

  if (phase === "done") {
    if (!deck.length) {
      return (
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-center text-slate-300">
          {emptyMessage}
          <div className="mt-6">
            <Link href="/" className="text-sky-300 hover:underline">
              Back to map
            </Link>
          </div>
        </div>
      );
    }
    const pct = Math.round((correct / deck.length) * 100);
    return (
      <div className="pop-in rounded-2xl border border-white/10 bg-slate-900/70 p-6 sm:p-8 text-center">
        <div className="text-5xl">{failed ? "💀" : pct >= 70 ? "🏆" : "📚"}</div>
        <h2 className="mt-3 text-2xl font-bold text-white">
          {failed ? "Out of hearts!" : pct >= 70 ? "Quest complete!" : "Quest finished"}
        </h2>
        {stars !== null && (
          <div className="mt-3">
            <Stars count={stars} size="text-3xl" />
          </div>
        )}
        <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
          <Result label="Correct" value={`${correct}/${failed ? idx + 1 : deck.length}`} />
          <Result label="Best combo" value={`${bestCombo}x`} />
          <Result label="XP earned" value={`+${earned}`} />
        </div>
        <p className="mt-5 text-slate-400">
          {failed
            ? "Missed questions are saved to Review Mistakes. Try again, you'll get it."
            : pct >= 90
              ? "Exam-ready on this set. Try the Boss Battle."
              : "Read the explanations on missed ones, then run it again."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={start}>Play again</Button>
          <Link href="/" className="rounded-xl border border-white/15 px-5 py-2.5 font-semibold text-slate-200 hover:bg-white/10">
            Back to map
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="mb-1 flex justify-between text-xs text-slate-400">
            <span>
              Question {idx + 1} of {deck.length}
            </span>
            <span>{combo >= 3 && <span className="font-semibold text-orange-300">🔥 {combo} combo · x{comboMultiplier(combo)} XP</span>}</span>
          </div>
          <Bar value={(idx + (submitted ? 1 : 0)) / deck.length} color={color} />
        </div>
        {maxHearts !== undefined && (
          <div className="text-lg" aria-label={`${hearts} hearts left`}>
            {Array.from({ length: maxHearts }, (_, i) => (
              <span key={i} className={i < hearts ? "" : "opacity-20 grayscale"}>
                ❤️
              </span>
            ))}
          </div>
        )}
      </div>

      <QuestionCard key={`${q.id}-${idx}`} q={q} submitted={submitted} onSubmit={submit} showDomain={showDomain} />

      {submitted && (
        <div className="mt-4 flex items-center justify-between">
          <span className={`font-semibold ${lastGain ? "text-emerald-300" : "text-rose-300"}`}>
            {lastGain ? <span className="xp-float inline-block">+{lastGain} XP</span> : "Not quite"}
          </span>
          <Button onClick={next}>{maxHearts !== undefined && hearts <= 0 ? "See results" : idx + 1 >= deck.length ? "Finish" : "Next →"}</Button>
        </div>
      )}
    </div>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-3">
      <div className="text-xs uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 text-xl font-bold text-white">{value}</div>
    </div>
  );
}
