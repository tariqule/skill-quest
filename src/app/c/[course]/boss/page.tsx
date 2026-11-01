"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon, MedalIcon, NotebookPenIcon, SwordsIcon, TargetIcon, TimerIcon, TrophyIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { QuestionCard } from "@/components/QuestionCard";
import { Bar, PageShell } from "@/components/ui";
import { courseCopy } from "@/engine/copy";
import { useCourse, useLevelPool, useProgress } from "@/engine/course-context";
import { isCorrect, scaledScore, weightedExamDeck, type PreparedQuestion } from "@/engine/game";
import { BlockIcon } from "@/components/learn/block-icons";

type Phase = "intro" | "play" | "done";

export default function BossPage() {
  const { course, store, href } = useCourse();
  const copy = courseCopy(course);
  const progress = useProgress();
  const { pool: levelPool } = useLevelPool();
  const TOTAL = Math.min(course.config.boss.questions, levelPool.length);
  const MINUTES = course.config.boss.minutes;
  const { xp } = course.config;
  const { pass } = course.exam.scale;
  const boss = course.boss ?? { name: "The Exam Hydra", emoji: "" };
  const [phase, setPhase] = useState<Phase>("intro");
  const [deck, setDeck] = useState<PreparedQuestion[]>([]);
  const [answers, setAnswers] = useState<number[][]>([]);
  const [idx, setIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(MINUTES * 60);
  const [hit, setHit] = useState(false);
  const deadline = useRef(0);
  const finishRef = useRef<() => void>(() => {});

  const q = deck[idx];
  const submitted = answers[idx] ?? null;
  const results = deck.map((d, i) => (answers[i] ? isCorrect(d, answers[i]) : false));
  const correct = results.filter(Boolean).length;
  const bossHp = 1 - correct / Math.max(deck.length, 1);
  const playerHp = 1 - results.filter((r, i) => answers[i] && !r).length / Math.max(deck.length * 0.35, 1);

  function start() {
    setDeck(weightedExamDeck(course, TOTAL, levelPool));
    setAnswers([]);
    setIdx(0);
    setSecondsLeft(MINUTES * 60);
    deadline.current = Date.now() + MINUTES * 60_000;
    setPhase("play");
  }

  function submit(picked: number[]) {
    const ok = isCorrect(q, picked);
    store.recordAnswer(q.id, ok);
    setAnswers((a) => {
      const n = [...a];
      n[idx] = picked;
      return n;
    });
    if (ok) {
      setHit(true);
      setTimeout(() => setHit(false), 350);
    }
  }

  function finish() {
    const score = scaledScore(course, correct, deck.length);
    store.recordBoss(score);
    store.addXp(correct * xp.bossCorrect + (score >= pass ? xp.bossPassBonus : 0));
    setPhase("done");
    window.scrollTo({ top: 0 });
  }

  function next() {
    if (idx + 1 >= deck.length) finish();
    else setIdx(idx + 1);
  }

  useEffect(() => {
    finishRef.current = finish;
  });

  useEffect(() => {
    if (phase !== "play") return;
    const t = setInterval(() => {
      const left = Math.round((deadline.current - Date.now()) / 1000);
      setSecondsLeft(left);
      if (left <= 0) {
        clearInterval(t);
        finishRef.current();
      }
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "play" || submitted === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter") {
        e.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (phase === "intro") {
    return (
      <PageShell title={`Boss Battle`} subtitle={`A quick mock exam, weighted like the real ${course.code}.`}>
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <p className="text-muted-foreground">
            Face the <span className="font-semibold text-destructive-foreground">{boss.name}</span>. Every correct answer is a hit. Explanations
            stay hidden until the end, just like {copy.real}.
          </p>
          <ul className="mt-5 grid gap-2 text-sm text-muted-foreground">
            <li><NotebookPenIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> {TOTAL} questions drawn by domain weight</li>
            <li>
              <TimerIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> {MINUTES} minutes (the full {copy.simulator} is {course.exam.minutes} minutes for {course.exam.questions} questions)
            </li>
            <li>
              <TargetIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> Scaled score {course.exam.scale.min} to {course.exam.scale.max}. You need {pass} to pass.
            </li>
            <li><MedalIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> Pass for +{xp.bossPassBonus} bonus XP and the Boss Slayer badge</li>
          </ul>
          {progress.bossBest !== null && (
            <p className="mt-4 text-sm text-muted-foreground">
              Your best: <span className="font-semibold text-foreground">{progress.bossBest}</span>
            </p>
          )}
          <Button size="lg" onClick={start} className="mt-6">
            <SwordsIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> Start battle
          </Button>
        </div>
      </PageShell>
    );
  }

  if (phase === "done") {
    const score = scaledScore(course, correct, deck.length);
    const passed = score >= pass;
    return (
      <PageShell title={`Boss Battle results`}>
        <div className="pop-in rounded-2xl border border-border bg-card p-6 sm:p-8 text-center">
          <div className="text-6xl">{passed ? <TrophyIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> : <SwordsIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" />}</div>
          <h2 className="mt-3 text-3xl font-semibold text-foreground">{score}</h2>
          <p className={`mt-1 font-semibold ${passed ? "text-success-foreground" : "text-destructive-foreground"}`}>
            {passed ? `PASS. ${boss.name} is defeated!` : `Not yet. ${pass} is the passing score.`}
          </p>
          <p className="mt-1 text-muted-foreground">
            {correct} of {deck.length} correct
          </p>
        </div>

        <h3 className="mt-8 text-lg font-semibold text-foreground">By domain</h3>
        <div className="mt-3 grid gap-3">
          {course.domains.map((d) => {
            const idxs = deck.flatMap((x, i) => (x.domain === d.id ? [i] : []));
            const right = idxs.filter((i) => results[i]).length;
            const pct = idxs.length ? right / idxs.length : 0;
            return (
              <div key={d.id} className="rounded-xl border border-border bg-muted p-3">
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-foreground">
                    <BlockIcon icon={d.emoji} className="inline-block size-[1.1em] align-[-0.15em]" /> {d.name}
                  </span>
                  <span className={pct >= 0.7 ? "text-success-foreground" : "text-warning-foreground"}>
                    {right}/{idxs.length}
                  </span>
                </div>
                <Bar value={pct} color={d.color} />
              </div>
            );
          })}
        </div>

        <h3 className="mt-8 text-lg font-semibold text-foreground">Review your answers</h3>
        <div className="mt-3 grid gap-4">
          {deck.map((d, i) => (
            <details key={d.id} className="rounded-xl border border-border bg-muted open:bg-transparent" open={!results[i]}>
              <summary className="cursor-pointer px-4 py-3 text-sm text-foreground">
                <span className={results[i] ? "text-success-foreground" : "text-destructive-foreground"}>{results[i] ? <CheckIcon role="img" aria-label="correct" className="inline-block size-[1.1em] align-[-0.15em]" /> : <XIcon role="img" aria-label="incorrect" className="inline-block size-[1.1em] align-[-0.15em]" />}</span> {i + 1}. {d.prompt}
              </summary>
              <div className="p-2">
                <QuestionCard q={d} submitted={answers[i] ?? []} onSubmit={() => {}} />
              </div>
            </details>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" onClick={start}>Rematch</Button>
          <Link href={href("/review")} className={cn(buttonVariants({ variant: "outline", size: "default" }))}>
            Review mistakes
          </Link>
        </div>
      </PageShell>
    );
  }

  const mm = Math.floor(Math.max(secondsLeft, 0) / 60);
  const ss = String(Math.max(secondsLeft, 0) % 60).padStart(2, "0");

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6">
      <div className="mb-5 rounded-card border border-destructive/30 bg-destructive/10 p-4">
        <div className="flex items-center gap-4">
          <div className={`text-5xl transition ${hit ? "boss-hit" : ""}`}>{boss.emoji ? <BlockIcon icon={boss.emoji} className="inline-block size-[1.1em] align-[-0.15em]" /> : <SwordsIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" />}</div>
          <div className="flex-1">
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-semibold text-destructive-foreground">{boss.name}</span>
              <span className="text-muted-foreground">
                {deck.length - correct}/{deck.length} HP
              </span>
            </div>
            <Bar value={bossHp} color="var(--destructive)" className="h-3" />
            <div className="mt-2 mb-1 flex justify-between text-sm">
              <span className="font-semibold text-primary">You</span>
              <span className="text-muted-foreground">survive below 35% misses</span>
            </div>
            <Bar value={playerHp} color="var(--primary)" className="h-2" />
          </div>
          <div className={`font-mono text-lg ${secondsLeft < 300 ? "text-destructive-foreground" : "text-foreground"}`}>
            {mm}:{ss}
          </div>
        </div>
        <div className="mt-3 text-sm text-muted-foreground">
          Question {idx + 1} of {deck.length}
        </div>
      </div>

      <QuestionCard key={q.id} q={q} submitted={submitted} onSubmit={submit} reveal={false} />

      {submitted && (
        <div className="mt-4 flex justify-end">
          <Button size="lg" onClick={next}>{idx + 1 >= deck.length ? "Finish battle" : "Next →"}</Button>
        </div>
      )}
    </main>
  );
}
