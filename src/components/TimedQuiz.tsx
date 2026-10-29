"use client";

import { useEffect, useRef, useState } from "react";
import { useCourse } from "@/engine/course-context";
import { isCorrect, pct, type PreparedQuestion } from "@/engine/game";
import { QuestionCard } from "./QuestionCard";

export interface TimedResult {
  correct: number;
  total: number;
  passed: boolean;
  /** Ids of questions answered wrong or timed out. */
  missed: string[];
}

interface Props {
  questions: PreparedQuestion[];
  secondsPerQuestion: number;
  passShare: number;
  xpPerCorrect: number;
  color?: string;
  showDomain?: boolean;
  onFinish: (result: TimedResult) => void;
}

const FEEDBACK_MS = { correct: 700, wrong: 1400 };

/**
 * A run of questions, each against its own countdown. Running out of time
 * counts as wrong. Reused by lessons (after a miss) and the Timed drill mode.
 */
export function TimedQuiz({ questions, secondsPerQuestion, passShare, xpPerCorrect, color = "#f59e0b", showDomain, onFinish }: Props) {
  const { store } = useCourse();
  const [idx, setIdx] = useState(0);
  const [submitted, setSubmitted] = useState<number[] | null>(null);
  const [verdict, setVerdict] = useState<"correct" | "wrong" | "timeout" | null>(null);
  const [left, setLeft] = useState(secondsPerQuestion);
  const [correctSoFar, setCorrectSoFar] = useState(0);
  // Read in timers and handlers only; `correctSoFar` mirrors it for rendering.
  const results = useRef<boolean[]>([]);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const q = questions[idx];

  function advance() {
    if (idx + 1 >= questions.length) {
      const correct = results.current.filter(Boolean).length;
      onFinish({
        correct,
        total: questions.length,
        passed: correct / questions.length >= passShare,
        missed: questions.filter((_, i) => !results.current[i]).map((x) => x.id),
      });
      return;
    }
    setIdx(idx + 1);
    setSubmitted(null);
    setVerdict(null);
    setLeft(secondsPerQuestion);
  }

  function settle(ok: boolean, kind: "correct" | "wrong" | "timeout") {
    results.current[idx] = ok;
    if (ok) setCorrectSoFar((c) => c + 1);
    store.recordAnswer(q.id, ok);
    if (ok) store.addXp(xpPerCorrect);
    setVerdict(kind);
    advanceTimer.current = setTimeout(advance, ok ? FEEDBACK_MS.correct : FEEDBACK_MS.wrong);
  }

  function submit(picked: number[]) {
    if (verdict) return;
    setSubmitted(picked);
    const ok = isCorrect(q, picked);
    settle(ok, ok ? "correct" : "wrong");
  }

  // Per-question countdown. A fresh deadline starts whenever the question changes.
  const settleRef = useRef(settle);
  useEffect(() => {
    settleRef.current = settle;
  });
  useEffect(() => {
    if (verdict) return;
    const deadline = Date.now() + secondsPerQuestion * 1000;
    const t = setInterval(() => {
      const remaining = Math.max(0, (deadline - Date.now()) / 1000);
      setLeft(remaining);
      if (remaining <= 0) {
        clearInterval(t);
        settleRef.current(false, "timeout");
      }
    }, 100);
    return () => clearInterval(t);
  }, [idx, verdict, secondsPerQuestion]);

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  const urgent = left <= 5;
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${urgent && !verdict ? "shake" : ""}`}>
          <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke={urgent ? "#f43f5e" : color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="97.4"
              strokeDashoffset={(97.4 * (1 - left / secondsPerQuestion)).toFixed(2)}
            />
          </svg>
          <span className={`font-mono text-lg font-black ${urgent ? "text-rose-300" : "text-white"}`}>{Math.ceil(left)}</span>
        </div>
        <div className="flex-1">
          <div className="mb-1 flex justify-between text-xs text-slate-400">
            <span>
              ⏱️ Question {idx + 1} of {questions.length}
            </span>
            <span>
              ✓ {correctSoFar} · need {Math.ceil(passShare * questions.length)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full transition-all" style={{ width: pct(idx / questions.length), background: color }} />
          </div>
        </div>
      </div>

      <div
        className={`rounded-2xl transition ${verdict === "correct" ? "ring-4 ring-emerald-400/60" : verdict ? "ring-4 ring-rose-400/60" : ""}`}
      >
        <QuestionCard key={`${q.id}-${idx}`} q={q} submitted={verdict === "timeout" ? [] : submitted} onSubmit={submit} explain={false} showDomain={showDomain} />
      </div>

      {verdict && (
        <div className={`pop-in mt-3 text-center text-lg font-black ${verdict === "correct" ? "text-emerald-300" : "text-rose-300"}`}>
          {verdict === "correct" ? `✓ +${xpPerCorrect} XP` : verdict === "timeout" ? "⏰ Time's up" : "✗ Not this time"}
        </div>
      )}
    </div>
  );
}
