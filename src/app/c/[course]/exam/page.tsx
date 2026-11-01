"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Confetti, MascotSays } from "@/components/fx";
import { BookOpen, EyeOff, FileText, Flag, Landmark, ListChecks, Target, Timer } from "lucide-react";
import { QuestionCard } from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { Bar, PageShell } from "@/components/ui";
import { courseCopy } from "@/engine/copy";
import { useCourse, useLevelPool, useProgress } from "@/engine/course-context";
import { LEVEL_BY_ID } from "@/engine/levels";
import { examQuestions, isCorrect, pct, scaledScore, shuffle, versionLabel, weightedExamDeck, type PreparedQuestion } from "@/engine/game";
import { EXTRA_KINDS, isCodeTrack } from "@/engine/tracks";

type Phase = "intro" | "exam" | "review" | "results";

export default function ExamPage() {
  const { course, store, href } = useCourse();
  const copy = courseCopy(course);
  const progress = useProgress();
  const { pool: levelPool, level } = useLevelPool();
  const [tryAnyway, setTryAnyway] = useState(false);
  const examPool = examQuestions(course).filter((q) => levelPool.includes(q));
  // A level with fewer questions than a mode asks for gets a shorter, proportionally scaled run.
  const MODES = course.config.examModes.map((m) => {
    const questions = Math.min(m.questions, examPool.length);
    const scale = questions / m.questions;
    return { ...m, questions, unscored: Math.floor(m.unscored * scale), minutes: Math.max(5, Math.round(m.minutes * scale)) };
  });
  // The headline format follows the full mode, which shrinks with a small level pool.
  const full = MODES.find((m) => m.full) ?? MODES[0];
  const headline = isCodeTrack(course) && full ? full : course.exam;
  const declared = course.exam.questionTypes.filter((t) => !t.practiceOnly);
  const officialTypes = isCodeTrack(course) ? [...declared, ...EXTRA_KINDS.filter((k) => !declared.some((d) => d.id === k.id))] : declared;
  const practiceTypes = course.exam.questionTypes.filter((t) => t.practiceOnly);
  const { min, max, pass } = course.exam.scale;
  const { xp } = course.config;
  const [phase, setPhase] = useState<Phase>("intro");
  const [modeId, setModeId] = useState(MODES[0].id);
  const [deck, setDeck] = useState<PreparedQuestion[]>([]);
  const [unscored, setUnscored] = useState<Set<number>>(new Set());
  const [answers, setAnswers] = useState<(number[] | undefined)[]>([]);
  const [flags, setFlags] = useState<Set<number>>(new Set());
  const [idx, setIdx] = useState(0);
  const [version, setVersion] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showNav, setShowNav] = useState(false);
  const [score, setScore] = useState(0);
  const deadline = useRef(0);
  const submitRef = useRef<() => void>(() => {});

  const cfg = MODES.find((m) => m.id === modeId) ?? MODES[0];

  function start(id: string) {
    const c = MODES.find((m) => m.id === id)!;
    const d = weightedExamDeck(course, c.questions, examPool);
    setModeId(id);
    setDeck(d);
    setUnscored(new Set(shuffle(d.map((_, i) => i)).slice(0, c.unscored)));
    setAnswers([]);
    setFlags(new Set());
    setIdx(0);
    setSecondsLeft(c.minutes * 60);
    deadline.current = 0;
    setPhase("exam");
    window.scrollTo({ top: 0 });
  }

  function answer(picked: number[]) {
    setAnswers((a) => {
      const n = [...a];
      n[idx] = picked;
      return n;
    });
  }

  function clearAnswer() {
    setAnswers((a) => {
      const n = [...a];
      n[idx] = undefined;
      return n;
    });
    setVersion((v) => v + 1);
  }

  function toggleFlag(i: number) {
    setFlags((f) => {
      const n = new Set(f);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  }

  function go(i: number) {
    setIdx(Math.max(0, Math.min(deck.length - 1, i)));
    setShowNav(false);
    window.scrollTo({ top: 0 });
  }

  function submit() {
    const scoredIdx = deck.map((_, i) => i).filter((i) => !unscored.has(i));
    const correct = scoredIdx.filter((i) => answers[i] && isCorrect(deck[i], answers[i]!)).length;
    deck.forEach((q, i) => store.recordAnswer(q.id, !!answers[i] && isCorrect(q, answers[i]!)));
    const s = scaledScore(course, correct, scoredIdx.length);
    setScore(s);
    store.recordExam(s, cfg.full);
    store.addXp(correct * xp.examCorrect + (s >= pass ? xp.examPassBonus : 0));
    setPhase("results");
    window.scrollTo({ top: 0 });
  }

  useEffect(() => {
    submitRef.current = submit;
  });

  useEffect(() => {
    if (phase !== "exam" && phase !== "review") return;
    if (!deadline.current) deadline.current = Date.now() + cfg.minutes * 60_000;
    const t = setInterval(() => {
      const left = Math.round((deadline.current - Date.now()) / 1000);
      setSecondsLeft(left);
      if (left <= 0) {
        clearInterval(t);
        submitRef.current();
      }
    }, 1000);
    return () => clearInterval(t);
  }, [phase, cfg.minutes]);

  const answeredCount = answers.filter(Boolean).length;
  const mm = Math.floor(Math.max(0, secondsLeft) / 60);
  const ss = String(Math.max(0, secondsLeft) % 60).padStart(2, "0");

  if (phase === "intro" && level === "beginner" && !tryAnyway) {
    return (
      <PageShell title={`${copy.gateIcon} ${copy.gate}`} subtitle="This one comes after the basics.">
        <div className="rounded-3xl border border-rose-300/30 bg-rose-300/[0.07] p-6 text-slate-200">
          <div className="text-4xl">🐣</div>
          <p className="mt-2 text-lg font-bold text-white">You&apos;re on the Beginner level.</p>
          <p className="mt-1 text-slate-300">
            The full {copy.simulator} is timed and gives no feedback until the end, which can feel rough on day one. Finish the &quot;Start here&quot; lessons first,
            then level up from the map. You can still try it now if you&apos;re curious.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={href()} className="rounded-xl bg-sky-400 px-5 py-2.5 font-black text-slate-950">
              Back to the basics
            </Link>
            <button type="button" onClick={() => setTryAnyway(true)} className="rounded-xl border border-white/15 px-5 py-2.5 font-semibold text-slate-200">
              Try it anyway
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  if (phase === "intro") {
    const facts = [
      { icon: FileText, text: `${headline.questions} questions${headline.unscored > 0 ? `: ${headline.questions - headline.unscored} scored + ${headline.unscored} unscored. Like the real exam, you won't know which are unscored` : ""}.` },
      { icon: ListChecks, text: `${officialTypes.map((t) => t.name.toLowerCase()).join(", ")}: the formats ${copy.real} uses${practiceTypes.length > 0 ? ` (${practiceTypes.map((t) => t.name.toLowerCase()).join(" and ")} stay in missions and drills)` : ""}.` },
      { icon: Timer, text: `${headline.minutes} minutes. The timer auto-submits at zero.` },
      { icon: Flag, text: "Flag questions, jump around, and change answers before you submit." },
      { icon: Target, text: `Scored ${min}–${max}. ${pass} passes.` },
      { icon: EyeOff, text: "No feedback until you submit, just like test day." },
    ];
    // One primary action: the full simulation. Shorter modes are secondary.
    const ordered = [...MODES].sort((x, y) => Number(!!y.full) - Number(!!x.full));
    return (
      <PageShell title={copy.gate} subtitle={isCodeTrack(course) ? `A timed ${course.shortTitle} ${copy.simulator}. No feedback until you finish, just like the real thing.` : `A full exam simulator built to the official ${course.code} format.`}>
        <section aria-label="Exam format" className="rounded-card border border-border bg-card p-5 sm:p-6">
          <ul className="grid gap-3 text-base text-foreground">
            {facts.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                <span>{text}</span>
              </li>
            ))}
          </ul>
          {isCodeTrack(course) && (
            <p className="mt-4 text-sm text-muted-foreground">
              Level: {LEVEL_BY_ID[level].name} · {examPool.length} questions in the pool. Change the level on the track&apos;s home screen.
            </p>
          )}
          {progress.examBest !== null && (
            <p className="mt-4 text-sm text-muted-foreground">
              Best score: <b className="font-semibold text-foreground">{progress.examBest}</b> · Attempts: {progress.examAttempts}
            </p>
          )}
        </section>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {ordered.map((m) => (
            <Button key={m.id} size="xl" variant={m.full ? "default" : "outline"} className="h-auto min-h-14 justify-start py-3 text-left" onClick={() => start(m.id)}>
              {m.full ? <Landmark aria-hidden /> : <Timer aria-hidden />}
              <span className="flex flex-col items-start">
                <span className="font-semibold">{m.name}</span>
                <span className="text-sm font-normal opacity-90">
                  {m.questions} questions · {m.minutes} minutes
                </span>
              </span>
            </Button>
          ))}
        </div>
        <p className="mt-4 text-base text-muted-foreground">
          Want to review first?{" "}
          <Link href={href("/study")} className="inline-flex min-h-11 items-center gap-1.5 font-medium text-foreground underline underline-offset-4 hover:text-primary">
            <BookOpen className="size-4 text-primary" aria-hidden />
            Open Study mode
          </Link>
        </p>
        <div className="mt-6 rounded-card border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          <b className="font-semibold text-foreground">About the questions.</b> These are original practice questions written to the {course.guide.source.label} ({versionLabel(course.guide.source.version)}). They are not {course.provider.name}&apos;s own exam questions.
          {course.guide.officialPractice && (
            <>
              {" "}
              For official practice material, use the{" "}
              <a href={course.guide.officialPractice.url} target="_blank" rel="noreferrer" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
                {course.guide.officialPractice.label}
              </a>{" "}
              alongside this game.
            </>
          )}
        </div>
      </PageShell>
    );
  }

  if (phase === "results") {
    const passed = score >= pass;
    const scoredIdx = deck.map((_, i) => i).filter((i) => !unscored.has(i));
    return (
      <PageShell title="🏛️ Your score report">
        {passed && <Confetti count={90} />}
        <div className="pop-in rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-center sm:p-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Scaled score</div>
          <div className={`mt-1 text-6xl font-black ${passed ? "text-emerald-300" : "text-amber-300"}`}>{score}</div>
          <div className="mx-auto mt-3 h-3 max-w-md overflow-hidden rounded-full bg-white/10">
            <div className="relative h-full rounded-full bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400" style={{ width: pct((score - min) / (max - min)) }} />
          </div>
          <div className="mx-auto mt-1 flex max-w-md justify-between text-[10px] text-slate-400">
            <span>{min}</span>
            <span>{pass} pass</span>
            <span>{max}</span>
          </div>
          <div className={`mt-3 text-xl font-black ${passed ? "text-emerald-300" : "text-rose-300"}`}>{passed ? "PASS" : "NOT YET"}</div>
          <div className="mx-auto mt-4 max-w-md">
            <MascotSays mood={passed ? "wow" : "think"}>
              {passed
                ? `You'd pass ${copy.real} at this level. Try another round to make sure it's consistent.`
                : "Check the domains marked Needs improvement, replay those missions, then try again."}
            </MascotSays>
          </div>
        </div>

        <h3 className="mt-8 text-lg font-black text-white">Performance by domain</h3>
        <p className="text-xs text-slate-400">Like the official score report, this counts scored questions only.</p>
        <div className="mt-3 grid gap-3">
          {course.domains.map((d) => {
            const mine = scoredIdx.filter((i) => deck[i].domain === d.id);
            const right = mine.filter((i) => answers[i] && isCorrect(deck[i], answers[i]!)).length;
            const pct = mine.length ? right / mine.length : 0;
            return (
              <div key={d.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="mb-1.5 flex justify-between gap-2 text-sm">
                  <span className="text-slate-200">
                    {d.emoji} {d.name}
                  </span>
                  <span className={`shrink-0 font-bold ${pct >= 0.7 ? "text-emerald-300" : "text-amber-300"}`}>{pct >= 0.7 ? "Meets competencies" : "Needs improvement"}</span>
                </div>
                <Bar value={pct} color={d.color} />
                <div className="mt-1 text-xs text-slate-400">
                  {right}/{mine.length} correct
                  {pct < 0.7 && (
                    <>
                      {" · "}
                      <Link href={href(`/quest/${d.id}`)} className="text-sky-300 underline">
                        practise this world
                      </Link>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <h3 className="mt-8 text-lg font-black text-white">Review every answer</h3>
        <div className="mt-3 grid gap-3">
          {deck.map((q, i) => {
            const ok = !!answers[i] && isCorrect(q, answers[i]!);
            return (
              <details key={q.id} className="rounded-xl border border-white/10 bg-white/5" open={!ok}>
                <summary className="cursor-pointer px-4 py-3 text-sm text-slate-200">
                  <span className={ok ? "text-emerald-300" : "text-rose-300"}>{ok ? "✓" : answers[i] ? "✗" : "○"}</span> {i + 1}. {q.prompt}
                  {unscored.has(i) && <span className="ml-2 rounded bg-white/10 px-1.5 text-[10px] uppercase text-slate-400">unscored</span>}
                </summary>
                <div className="p-2">
                  <QuestionCard q={q} submitted={answers[i] ?? []} onSubmit={() => {}} showDomain />
                </div>
              </details>
            );
          })}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={() => setPhase("intro")} className="btn-3d rounded-2xl bg-sky-400 px-6 py-3 font-black text-slate-950" style={{ "--edge": "#0369a1" } as CSSProperties}>
            New simulation
          </button>
          <Link href={href("/review")} className="btn-3d rounded-2xl bg-slate-800 px-6 py-3 font-bold text-white" style={{ "--edge": "#020617" } as CSSProperties}>
            Fix my mistakes
          </Link>
        </div>
      </PageShell>
    );
  }

  const timerBar = (
    <div className="sticky z-10 -mx-4 mb-4 border-b border-white/10 bg-slate-950/90 px-4 py-2 backdrop-blur" style={{ top: "calc(env(safe-area-inset-top, 0px) + 3.2rem)" }}>
      <div className="mx-auto flex max-w-3xl items-center gap-3 text-sm">
        <span className="font-bold text-white">{cfg.name}</span>
        <span className="text-slate-400">
          {answeredCount}/{deck.length} answered
        </span>
        <span className={`ml-auto font-mono text-lg ${secondsLeft < 600 ? "text-rose-300" : "text-slate-100"}`}>⏱ {mm}:{ss}</span>
      </div>
    </div>
  );

  if (phase === "review") {
    const unanswered = deck.map((_, i) => i).filter((i) => !answers[i]);
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-4">
        {timerBar}
        <h1 className="text-2xl font-black text-white">Review before you submit</h1>
        <p className="mt-1 text-slate-400">Tap any square to go back to that question.</p>
        <Navigator deck={deck} answers={answers} flags={flags} current={-1} onPick={(i) => { setPhase("exam"); go(i); }} />
        <div className="mt-4 grid gap-2 text-sm">
          <div className={unanswered.length ? "text-amber-300" : "text-emerald-300"}>
            {unanswered.length ? `⚠️ ${unanswered.length} unanswered. Unanswered questions count as wrong, and guessing has no penalty.` : "✓ Every question answered."}
          </div>
          {flags.size > 0 && <div className="text-sky-300">🚩 {flags.size} flagged for review.</div>}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={() => setPhase("exam")} className="btn-3d rounded-2xl bg-slate-800 px-6 py-3 font-bold text-white" style={{ "--edge": "#020617" } as CSSProperties}>
            ← Back to questions
          </button>
          <button type="button" onClick={submit} className="btn-3d rounded-2xl bg-amber-400 px-6 py-3 font-black text-slate-950" style={{ "--edge": "#b45309" } as CSSProperties}>
            Submit exam
          </button>
        </div>
      </main>
    );
  }

  const q = deck[idx];
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-4">
      {timerBar}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="font-bold text-white">
          Question {idx + 1} of {deck.length}
        </span>
        <button
          type="button"
          onClick={() => toggleFlag(idx)}
          className={`rounded-lg border px-3 py-1 text-sm font-semibold ${flags.has(idx) ? "border-sky-400 bg-sky-400/20 text-sky-200" : "border-white/15 text-slate-300"}`}
        >
          🚩 {flags.has(idx) ? "Flagged" : "Flag for review"}
        </button>
        <button type="button" onClick={() => setShowNav(!showNav)} className="rounded-lg border border-white/15 px-3 py-1 text-sm text-slate-300">
          ▦ All questions
        </button>
      </div>
      {showNav && <Navigator deck={deck} answers={answers} flags={flags} current={idx} onPick={go} />}

      <QuestionCard key={`${q.id}-${version}`} q={q} submitted={answers[idx] ?? null} onSubmit={answer} reveal={false} />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" disabled={idx === 0} onClick={() => go(idx - 1)} className="rounded-xl border border-white/15 px-4 py-2.5 font-semibold text-slate-200 disabled:opacity-30">
          ← Previous
        </button>
        {answers[idx] && (
          <button type="button" onClick={clearAnswer} className="text-sm text-slate-400 underline hover:text-white">
            Change answer
          </button>
        )}
        <div className="ml-auto flex gap-3">
          {idx + 1 < deck.length ? (
            <button type="button" onClick={() => go(idx + 1)} className="btn-3d rounded-xl bg-sky-400 px-5 py-2.5 font-black text-slate-950" style={{ "--edge": "#0369a1" } as CSSProperties}>
              Next →
            </button>
          ) : (
            <button type="button" onClick={() => setPhase("review")} className="btn-3d rounded-xl bg-amber-400 px-5 py-2.5 font-black text-slate-950" style={{ "--edge": "#b45309" } as CSSProperties}>
              Review & submit
            </button>
          )}
        </div>
      </div>
      <div className="mt-3 text-right">
        <button type="button" onClick={() => setPhase("review")} className="text-xs text-slate-400 underline hover:text-slate-300">
          End exam early
        </button>
      </div>
    </main>
  );
}

function Navigator({
  deck,
  answers,
  flags,
  current,
  onPick,
}: {
  deck: PreparedQuestion[];
  answers: (number[] | undefined)[];
  flags: Set<number>;
  current: number;
  onPick: (i: number) => void;
}) {
  return (
    <div className="my-4 rounded-2xl border border-white/10 bg-slate-900/70 p-3">
      <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-13">
        {deck.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPick(i)}
            className={`relative h-8 rounded-md text-xs font-bold ${i === current ? "ring-2 ring-white" : ""} ${answers[i] ? "bg-sky-500 text-slate-950" : "bg-white/10 text-slate-300"}`}
          >
            {i + 1}
            {flags.has(i) && <span className="absolute -right-1 -top-1 text-[10px]">🚩</span>}
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-4 text-[11px] text-slate-400">
        <span>🟦 answered</span>
        <span>⬜ unanswered</span>
        <span>🚩 flagged</span>
      </div>
    </div>
  );
}
