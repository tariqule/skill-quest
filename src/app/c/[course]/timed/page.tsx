"use client";

import { useState, type CSSProperties } from "react";
import { Confetti } from "@/components/fx";
import { TimedQuiz, type TimedResult } from "@/components/TimedQuiz";
import { PageShell } from "@/components/ui";
import { courseCopy } from "@/engine/copy";
import { useCourse, useLevelPool } from "@/engine/course-context";
import { answerText, deck, weightedExamDeck, type PreparedQuestion } from "@/engine/game";

type Phase = "pick" | "play" | "done";

export default function TimedDrillPage() {
  const { course, question } = useCourse();
  const cfg = course.config.timed;
  const { pool: levelPool } = useLevelPool();
  const [phase, setPhase] = useState<Phase>("pick");
  const [world, setWorld] = useState<string>("all");
  const [questions, setQuestions] = useState<PreparedQuestion[]>([]);
  const [result, setResult] = useState<TimedResult | null>(null);
  const [run, setRun] = useState(0);

  const domain = course.domains.find((d) => d.id === world);

  function start() {
    const pool = levelPool.filter((q) => q.domain === world);
    setQuestions(world === "all" ? weightedExamDeck(course, Math.min(cfg.questions, levelPool.length), levelPool) : deck(pool, cfg.questions));
    setResult(null);
    setRun((r) => r + 1);
    setPhase("play");
  }

  if (phase === "play") {
    return (
      <PageShell title={`⏱️ Timed drill${domain ? ` · ${domain.world}` : ""}`}>
        <TimedQuiz
          key={run}
          questions={questions}
          secondsPerQuestion={cfg.secondsPerQuestion}
          passShare={cfg.passShare}
          xpPerCorrect={course.config.xp.timedCorrect}
          color={domain?.color}
          showDomain={!domain}
          onFinish={(r) => {
            setResult(r);
            setPhase("done");
            window.scrollTo({ top: 0 });
          }}
        />
      </PageShell>
    );
  }

  if (phase === "done" && result) {
    return (
      <PageShell title="⏱️ Drill results">
        {result.passed && <Confetti />}
        <div className="pop-in rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-center">
          <div className="text-5xl">{result.passed ? "🏆" : "⏰"}</div>
          <div className={`mt-2 text-4xl font-black ${result.passed ? "text-emerald-300" : "text-amber-300"}`}>
            {result.correct}/{result.total}
          </div>
          <div className="mt-1 text-slate-400">
            {result.passed ? "Passed against the clock!" : `You need ${Math.ceil(cfg.passShare * result.total)} to pass. Review below and go again.`}
          </div>
        </div>
        {result.missed.length > 0 && (
          <>
            <h2 className="mt-6 text-sm font-black uppercase tracking-wider text-rose-300">Review what you missed</h2>
            <div className="mt-2 grid gap-2">
              {result.missed.map((qid) => {
                const q = question[qid];
                return (
                  <div key={qid} className="rounded-xl border border-rose-400/30 bg-rose-400/5 p-3 text-sm">
                    <div className="font-semibold text-white">{q.prompt}</div>
                    <div className="mt-1 text-emerald-300">✓ {answerText(q)}</div>
                    <div className="mt-1 text-slate-400">{q.explanation}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={start} className="btn-3d rounded-2xl bg-amber-400 px-6 py-3 font-black text-slate-950" style={{ "--edge": "#b45309" } as CSSProperties}>
            Go again
          </button>
          <button type="button" onClick={() => setPhase("pick")} className="btn-3d rounded-2xl bg-slate-800 px-6 py-3 font-bold text-white" style={{ "--edge": "#020617" } as CSSProperties}>
            Change world
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="⏱️ Timed drill" subtitle={`Answer before the clock runs out. Builds the speed you need on ${courseCopy(course).day}.`}>
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <ul className="grid gap-2 text-slate-300">
          <li>
            📝 {cfg.questions} questions, {cfg.secondsPerQuestion} seconds each
          </li>
          <li>⏰ Running out of time counts as wrong</li>
          <li>
            🎯 Get {Math.round(cfg.passShare * 100)}% to pass · +{course.config.xp.timedCorrect} XP per correct answer
          </li>
        </ul>
        <div className="mt-5 text-sm font-semibold text-white">Choose a world</div>
        <div className="mt-2 flex flex-wrap gap-2">
          <WorldChip active={world === "all"} onClick={() => setWorld("all")} color="#f59e0b">
            🌐 All worlds (exam mix)
          </WorldChip>
          {course.domains.map((d) => (
            <WorldChip key={d.id} active={world === d.id} onClick={() => setWorld(d.id)} color={d.color}>
              {d.emoji} {d.world}
            </WorldChip>
          ))}
        </div>
        <button
          type="button"
          onClick={start}
          className="btn-3d mt-6 rounded-2xl bg-amber-400 px-6 py-3 font-black uppercase text-slate-950"
          style={{ "--edge": "#b45309" } as CSSProperties}
        >
          ⏱️ Start
        </button>
      </div>
    </PageShell>
  );
}

function WorldChip({ active, onClick, color, children }: { active: boolean; onClick: () => void; color: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border-2 px-3 py-1.5 text-sm font-semibold transition"
      style={{ borderColor: active ? color : "rgb(255 255 255 / 0.1)", background: active ? `${color}25` : "transparent", color: active ? "white" : "#cbd5e1" }}
    >
      {children}
    </button>
  );
}
