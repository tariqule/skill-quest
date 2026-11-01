"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useCourse } from "@/engine/course-context";
import { comboMultiplier, isCorrect, type PreparedQuestion } from "@/engine/game";
import { QuestionCard } from "./QuestionCard";
import { ArrowRight, BookOpen, Flame, Heart, HeartCrack, RotateCcw, Trophy } from "lucide-react";
import { Bar, Stars } from "./ui";
import { Button } from "./ui/button";

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
  color: _color,
  showDomain,
  onComplete,
  emptyMessage,
}: Props) {
  const { store, course, href } = useCourse();
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
    store.recordAnswer(q.id, ok);
    if (ok) {
      const nextCombo = combo + 1;
      const gain = Math.round(baseXp * comboMultiplier(nextCombo));
      setCombo(nextCombo);
      setBestCombo((b) => Math.max(b, nextCombo));
      setCorrect((c) => c + 1);
      setEarned((e) => e + gain);
      setLastGain(gain);
      store.addXp(gain);
      if (nextCombo >= 5) store.unlockBadge("combo-5");
      if (nextCombo >= 10) store.unlockBadge("combo-10");
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
    if (outOfLives) setStars(typeof s === "number" ? 0 : null);
    if (typeof s === "number" && !outOfLives) {
      setStars(s);
      if (s > 0) {
        const bonus = s * course.config.xp.starBonus;
        setEarned((e) => e + bonus);
        store.addXp(bonus);
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
      <div className="rounded-card border border-border bg-card p-6 text-base sm:p-8">
        {intro}
        <Button size="xl" onClick={start} className="mt-6 h-12 sm:h-12">
          {startLabel}
          <ArrowRight aria-hidden />
        </Button>
      </div>
    );
  }

  if (phase === "done") {
    if (!deck.length) {
      return (
        <div className="rounded-card border border-border bg-card p-8 text-center text-base text-muted-foreground">
          {emptyMessage}
          <div className="mt-6">
            <Link href={href()} className="inline-flex min-h-11 items-center text-primary underline-offset-4 hover:underline">
              Back to map
            </Link>
          </div>
        </div>
      );
    }
    const pct = Math.round((correct / deck.length) * 100);
    const Icon = failed ? HeartCrack : pct >= 70 ? Trophy : BookOpen;
    return (
      <div className="pop-in rounded-card border border-border bg-card p-6 text-center sm:p-8">
        <Icon className={`mx-auto size-12 ${failed ? "text-destructive-foreground" : pct >= 70 ? "text-warning-foreground" : "text-info-foreground"}`} aria-hidden />
        <h2 className="mt-3 font-heading text-h3 font-semibold text-foreground">
          {failed ? "Out of hearts" : pct >= 70 ? "Quest complete" : "Quest finished"}
        </h2>
        {stars !== null && (
          <div className="mt-3">
            <Stars count={stars} size="text-3xl" />
          </div>
        )}
        <dl className="mt-5 grid grid-cols-3 gap-3">
          <Result label="Correct" value={`${correct}/${failed ? idx + 1 : deck.length}`} />
          <Result label="Best combo" value={`${bestCombo}x`} />
          <Result label="XP earned" value={`+${earned}`} />
        </dl>
        <p className="mx-auto mt-5 max-w-prose text-base text-muted-foreground">
          {failed
            ? "Missed questions are saved to Review Mistakes. Try again, you'll get it."
            : pct >= 90
              ? "Exam-ready on this set. Try the Boss Battle."
              : "Read the explanations on missed ones, then run it again."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button size="xl" onClick={start} className="h-12 sm:h-12">
            <RotateCcw aria-hidden />
            Play again
          </Button>
          <Button size="xl" variant="outline" className="h-12 sm:h-12" render={<Link href={href()} />}>
            Back to map
          </Button>
        </div>
      </div>
    );
  }

  const outOfHearts = maxHearts !== undefined && hearts <= 0;
  return (
    <div className="mx-auto w-full max-w-[680px]">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="mb-1.5 flex justify-between text-sm text-foreground/80">
            <span>
              Question {idx + 1} of {deck.length}
            </span>
            {combo >= 3 && (
              <span className="flex items-center gap-1 font-medium text-warning-foreground">
                <Flame className="size-4" aria-hidden />
                {combo} in a row · x{comboMultiplier(combo)} XP
              </span>
            )}
          </div>
          <Bar value={(idx + (submitted ? 1 : 0)) / deck.length} color="var(--primary)" />
        </div>
        {maxHearts !== undefined && (
          <div className="flex gap-0.5" role="img" aria-label={`${hearts} of ${maxHearts} hearts left`}>
            {Array.from({ length: maxHearts }, (_, i) => (
              <Heart key={i} className={`size-5 ${i < hearts ? "fill-destructive text-destructive" : "text-muted-foreground/50"}`} aria-hidden />
            ))}
          </div>
        )}
      </div>

      <QuestionCard
        key={`${q.id}-${idx}`}
        q={q}
        submitted={submitted}
        onSubmit={submit}
        showDomain={showDomain}
        note={(ok) => (ok ? (lastGain ? `+${lastGain} XP` : null) : maxHearts !== undefined ? `${Math.max(0, hearts)} ${hearts === 1 ? "heart" : "hearts"} left.` : "It comes back sooner in review.")}
      />

      {submitted && (
        <div className="sticky bottom-0 -mx-4 mt-4 border-t border-border bg-background/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <Button size="xl" onClick={next} className="h-12 w-full sm:ml-auto sm:flex sm:h-12 sm:w-auto">
            {outOfHearts ? "See results" : idx + 1 >= deck.length ? "Finish" : "Next"}
            <ArrowRight aria-hidden />
          </Button>
        </div>
      )}
    </div>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted p-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-xl font-semibold text-foreground">{value}</dd>
    </div>
  );
}
