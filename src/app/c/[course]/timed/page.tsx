"use client";

import { useState } from "react";
import { Confetti } from "@/components/fx";
import { TimedQuiz, type TimedResult } from "@/components/TimedQuiz";
import { PageShell } from "@/components/ui";
import { courseCopy } from "@/engine/copy";
import { useCourse, useLevelPool } from "@/engine/course-context";
import { answerText, levelDeck, weightedExamDeck, type PreparedQuestion } from "@/engine/game";
import { BlockIcon } from "@/components/learn/block-icons";

type Phase = "pick" | "play" | "done";

export default function TimedDrillPage() {
  const { course, question } = useCourse();
  const cfg = course.config.timed;
  const { pool: levelPool, level } = useLevelPool();
  const [phase, setPhase] = useState<Phase>("pick");
  const [world, setWorld] = useState<string>("all");
  const [questions, setQuestions] = useState<PreparedQuestion[]>([]);
  const [result, setResult] = useState<TimedResult | null>(null);
  const [run, setRun] = useState(0);

  const domain = course.domains.find((d) => d.id === world);

  function start() {
    const pool = course.questions.filter((q) => q.domain === world);
    setQuestions(world === "all" ? weightedExamDeck(course, Math.min(cfg.questions, levelPool.length), levelPool) : levelDeck(course, level, pool, cfg.questions));
    setResult(null);
    setRun((r) => r + 1);
    setPhase("play");
  }

  if (phase === "play") {
    return (
      <PageShell title={`Timed drill${domain ? ` · ${domain.world}` : ""}`}>
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
      <PageShell title="Drill results">
        {result.passed && <Confetti />}
        <div className="pop-in rounded-3xl border border-border bg-card p-6 text-center">
          <div className="text-5xl">{result.passed ? <BlockIcon icon="🏆" className="inline-block size-[1.1em] align-[-0.15em]" /> : <BlockIcon icon="⏰" className="inline-block size-[1.1em] align-[-0.15em]" />}</div>
          <div className={`mt-2 text-4xl font-semibold ${result.passed ? "text-success-foreground" : "text-warning-foreground"}`}>
            {result.correct}/{result.total}
          </div>
          <div className="mt-1 text-muted-foreground">
            {result.passed ? "Passed against the clock!" : `You need ${Math.ceil(cfg.passShare * result.total)} to pass. Review below and go again.`}
          </div>
        </div>
        {result.missed.length > 0 && (
          <>
            <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-destructive-foreground">Review what you missed</h2>
            <div className="mt-2 grid gap-2">
              {result.missed.map((qid) => {
                const q = question[qid];
                return (
                  <div key={qid} className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm">
                    <div className="font-semibold text-foreground">{q.prompt}</div>
                    <div className="mt-1 text-success-foreground"><BlockIcon icon="✓" className="inline-block size-[1.1em] align-[-0.15em]" /> {answerText(q)}</div>
                    <div className="mt-1 text-muted-foreground">{q.explanation}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={start} className="rounded-2xl bg-reward px-6 py-3 font-semibold text-primary-foreground">
            Go again
          </button>
          <button type="button" onClick={() => setPhase("pick")} className="rounded-2xl bg-secondary px-6 py-3 font-bold text-foreground">
            Change world
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Timed drill" subtitle={`Answer before the clock runs out. Builds the speed you need on ${courseCopy(course).day}.`}>
      <div className="rounded-2xl border border-border bg-card p-6">
        <ul className="grid gap-2 text-muted-foreground">
          <li>
            <BlockIcon icon="📝" className="inline-block size-[1.1em] align-[-0.15em]" /> {cfg.questions} questions, at least {cfg.secondsPerQuestion} seconds each (more for longer questions, ordering, matching and bug hunts)
          </li>
          <li><BlockIcon icon="⏰" className="inline-block size-[1.1em] align-[-0.15em]" /> Running out of time counts as wrong</li>
          <li>
            <BlockIcon icon="🎯" className="inline-block size-[1.1em] align-[-0.15em]" /> Get {Math.round(cfg.passShare * 100)}% to pass · +{course.config.xp.timedCorrect} XP per correct answer
          </li>
        </ul>
        <div className="mt-5 text-sm font-semibold text-foreground">Choose a world</div>
        <div className="mt-2 flex flex-wrap gap-2">
          <WorldChip active={world === "all"} onClick={() => setWorld("all")} color="#f59e0b">
            <BlockIcon icon="🌐" className="inline-block size-[1.1em] align-[-0.15em]" /> All worlds (exam mix)
          </WorldChip>
          {course.domains.map((d) => (
            <WorldChip key={d.id} active={world === d.id} onClick={() => setWorld(d.id)} color={d.color}>
              <BlockIcon icon={d.emoji} className="inline-block size-[1.1em] align-[-0.15em]" /> {d.world}
            </WorldChip>
          ))}
        </div>
        <button
          type="button"
          onClick={start}
          className="mt-6 rounded-2xl bg-reward px-6 py-3 font-semibold uppercase text-primary-foreground"
        >
          <BlockIcon icon="⏱️" className="inline-block size-[1.1em] align-[-0.15em]" /> Start
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
