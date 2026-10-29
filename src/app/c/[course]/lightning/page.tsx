"use client";

import { useEffect, useRef, useState } from "react";
import { QuestionCard } from "@/components/QuestionCard";
import { Bar, Button, PageShell } from "@/components/ui";
import { useCourse, useProgress } from "@/engine/course-context";
import { deck, isCorrect, type PreparedQuestion } from "@/engine/game";
import { isChoice } from "@/engine/types";

type Phase = "intro" | "play" | "done";

export default function LightningPage() {
  const { course, store } = useCourse();
  const progress = useProgress();
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
    setPool(deck(course.questions.filter((q) => isChoice(q) && q.answer.length === 1)));
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
      <PageShell title="⚡ Lightning Round" subtitle="Speed drill across every domain.">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 sm:p-8">
          <ul className="grid gap-2 text-slate-300">
            <li>⏱️ {SECONDS} seconds on the clock</li>
            <li>✅ Each correct answer: +{XP_EACH} XP</li>
            <li>❌ Each wrong answer: -{PENALTY} seconds</li>
            <li>⌨️ Use 1-4 or A-D keys to go fast</li>
          </ul>
          <p className="mt-4 text-sm text-slate-400">
            Personal best: <span className="font-bold text-white">{progress.lightningBest}</span>
          </p>
          <Button onClick={start} className="mt-6 bg-amber-400 hover:bg-amber-300">
            ⚡ Go!
          </Button>
        </div>
      </PageShell>
    );
  }

  if (phase === "done") {
    const newBest = right >= progress.lightningBest && right > 0;
    return (
      <PageShell title="⚡ Time's up!">
        <div className="pop-in rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-center">
          <div className="text-6xl font-black text-amber-300">{right}</div>
          <div className="mt-1 text-slate-400">correct · {wrong} wrong</div>
          {newBest && <div className="mt-3 font-semibold text-emerald-300">🎉 New personal best!</div>}
          <div className="mt-2 text-slate-300">+{right * XP_EACH} XP</div>
          <Button onClick={start} className="mt-6">
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
        <div className="font-mono text-2xl font-bold text-amber-300 w-16">{Math.max(0, timeLeft).toFixed(1)}</div>
        <div className="flex-1">
          <Bar value={timeLeft / SECONDS} color={timeLeft < 10 ? "#f43f5e" : "#fbbf24"} className="h-3" />
        </div>
        <div className="text-lg font-semibold text-emerald-300">✓ {right}</div>
      </div>
      <div
        className={`rounded-2xl transition ${flash === "good" ? "ring-4 ring-emerald-400/60" : flash === "bad" ? "ring-4 ring-rose-400/60 shake" : ""}`}
      >
        <QuestionCard key={`${q.id}-${idx}`} q={q} submitted={submitted} onSubmit={submit} explain={false} />
      </div>
    </main>
  );
}
