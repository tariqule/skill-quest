"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2Icon, CheckIcon, KeyboardIcon, TimerIcon, XIcon, PartyPopperIcon, ZapIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { QuestionCard } from "@/components/QuestionCard";
import { Bar, PageShell } from "@/components/ui";
import { useCourse, useLevelPool, useProgress } from "@/engine/course-context";
import { deck, isCorrect, type PreparedQuestion } from "@/engine/game";
import { isChoice } from "@/engine/types";

type Phase = "intro" | "play" | "done";

export default function LightningPage() {
  const { course, store } = useCourse();
  const progress = useProgress();
  const { pool: levelPool } = useLevelPool();
  const { seconds: SECONDS, penaltySeconds: PENALTY } = course.config.lightning;
  const XP_EACH = course.config.xp.lightningCorrect;
  const [phase, setPhase] = useState<Phase>("intro");
  const [pool, setPool] = useState<PreparedQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [submitted, setSubmitted] = useState<number[] | null>(null);
  const [timeLeft, setTimeLeft] = useState(SECONDS);
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const finished = useRef(false);

  function start() {
    setPool(deck(levelPool.filter((q) => isChoice(q) && q.answer.length === 1)));
    setIdx(0);
    setSubmitted(null);
    setTimeLeft(SECONDS);
    setRight(0);
    setWrong(0);
    finished.current = false;
    setPhase("play");
  }

  function submit(picked: number[]) {
    const q = pool[idx];
    const ok = isCorrect(q, picked);
    store.recordAnswer(q.id, ok);
    setSubmitted(picked);
    setFlash(ok ? "good" : "bad");
    if (ok) setRight((r) => r + 1);
    else {
      setWrong((w) => w + 1);
      setTimeLeft((t) => t - PENALTY);
    }
    setTimeout(() => {
      setFlash(null);
      setSubmitted(null);
      setIdx((i) => (i + 1) % pool.length);
    }, ok ? 450 : 1100);
  }

  useEffect(() => {
    if (phase !== "play") return;
    const t = setInterval(() => setTimeLeft((s) => s - 0.1), 100);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase === "play" && timeLeft <= 0 && !finished.current) {
      finished.current = true;
      store.recordLightning(right);
      if (right > 0) store.addXp(right * XP_EACH);
      setPhase("done");
    }
  }, [phase, timeLeft, right, store, XP_EACH]);

  if (phase === "intro") {
    return (
      <PageShell title="Lightning Round" subtitle="Speed drill across every domain.">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <ul className="grid gap-2 text-muted-foreground">
            <li><TimerIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> {SECONDS} seconds on the clock</li>
            <li><CheckCircle2Icon role="img" aria-label="correct" className="inline-block size-[1.1em] align-[-0.15em]" /> Each correct answer: +{XP_EACH} XP</li>
            <li><XIcon role="img" aria-label="incorrect" className="inline-block size-[1.1em] align-[-0.15em]" /> Each wrong answer: -{PENALTY} seconds</li>
            <li><KeyboardIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> Use 1-4 or A-D keys to go fast</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Personal best: <span className="font-semibold text-foreground">{progress.lightningBest}</span>
          </p>
          <Button size="lg" onClick={start} className="mt-6">
            <ZapIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> Go!
          </Button>
        </div>
      </PageShell>
    );
  }

  if (phase === "done") {
    const newBest = right >= progress.lightningBest && right > 0;
    return (
      <PageShell title="Time's up!">
        <div className="pop-in rounded-2xl border border-border bg-card p-8 text-center">
          <div className="text-6xl font-semibold text-warning-foreground">{right}</div>
          <div className="mt-1 text-muted-foreground">correct · {wrong} wrong</div>
          {newBest && <div className="mt-3 font-semibold text-success-foreground"><PartyPopperIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> New personal best!</div>}
          <div className="mt-2 text-muted-foreground">+{right * XP_EACH} XP</div>
          <Button size="lg" onClick={start} className="mt-6">
            Play again
          </Button>
        </div>
      </PageShell>
    );
  }

  const q = pool[idx];
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6">
      <div className="mb-4 flex items-center gap-4">
        <div className="font-mono text-2xl font-semibold text-warning-foreground w-16">{Math.max(0, timeLeft).toFixed(1)}</div>
        <div className="flex-1">
          <Bar value={timeLeft / SECONDS} color={timeLeft < 10 ? "var(--destructive)" : "var(--primary)"} className="h-3" />
        </div>
        <div className="text-lg font-semibold text-success-foreground"><CheckIcon role="img" aria-label="correct" className="inline-block size-[1.1em] align-[-0.15em]" /> {right}</div>
      </div>
      <div
        className={`rounded-2xl transition ${flash === "good" ? "ring-4 ring-success/60" : flash === "bad" ? "ring-4 ring-destructive/60 shake" : ""}`}
      >
        <QuestionCard key={`${q.id}-${idx}`} q={q} submitted={submitted} onSubmit={submit} explain={false} />
      </div>
    </main>
  );
}
