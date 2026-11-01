"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Confetti, MascotSays } from "@/components/fx";
import { ArrowLeft, ArrowRight, BookOpen, Check, EyeOff, FileText, Flag, LayoutGrid, ListChecks, Sprout, Target, Timer, TriangleAlert } from "lucide-react";
import { AnswerReview } from "@/components/exam/AnswerReview";
import { DomainReport } from "@/components/exam/DomainReport";
import { ModePicker } from "@/components/exam/ModePicker";
import { QuestionCard } from "@/components/QuestionCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageShell } from "@/components/ui";
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
      <PageShell title={`${copy.gate}`} subtitle="This one comes after the basics.">
        <div className="rounded-card border border-border bg-card p-6 text-foreground">
          <Sprout className="size-8 text-primary" aria-hidden />
          <p className="mt-2 text-lg font-semibold text-foreground">You&apos;re on the Beginner level.</p>
          <p className="mt-1 text-muted-foreground">
            The full {copy.simulator} is timed and gives no feedback until the end, which can feel rough on day one. Finish the &quot;Start here&quot; lessons first,
            then level up from the map. You can still try it now if you&apos;re curious.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={href()} className={buttonVariants({ size: "lg" })}>
              Back to the basics
            </Link>
            <Button size="lg" variant="outline" onClick={() => setTryAnyway(true)}>
              Try it anyway
            </Button>
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
    // Full simulation first; the learner picks a length, then presses the one primary action.
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
        <ModePicker modes={ordered} onStart={start} />
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
      <PageShell title="Your score report">
        {passed && <Confetti count={90} />}
        <div className="pop-in rounded-card border border-border bg-card p-6 text-center sm:p-8">
          <div className="text-sm font-medium text-muted-foreground">Scaled score</div>
          <div className={`mt-1 text-6xl font-semibold ${passed ? "text-success-foreground" : "text-warning-foreground"}`}>{score}</div>
          <div className="mx-auto mt-3 h-3 max-w-md overflow-hidden rounded-full bg-muted">
            <div className="relative h-full rounded-full bg-gradient-to-r from-destructive via-warning to-success" style={{ width: pct((score - min) / (max - min)) }} />
          </div>
          <div className="mx-auto mt-1 flex max-w-md justify-between text-sm text-muted-foreground">
            <span>{min}</span>
            <span>{pass} pass</span>
            <span>{max}</span>
          </div>
          <div className={`mt-3 text-xl font-semibold ${passed ? "text-success-foreground" : "text-destructive-foreground"}`}>{passed ? "PASS" : "NOT YET"}</div>
          <div className="mx-auto mt-4 max-w-md">
            <MascotSays mood={passed ? "wow" : "think"}>
              {passed
                ? `You'd pass ${copy.real} at this level. Try another round to make sure it's consistent.`
                : "Check the domains marked Needs improvement, replay those missions, then try again."}
            </MascotSays>
          </div>
        </div>

        <DomainReport
          results={course.domains.map((d) => {
            const mine = scoredIdx.filter((i) => deck[i].domain === d.id);
            const right = mine.filter((i) => answers[i] && isCorrect(deck[i], answers[i]!)).length;
            return { id: d.id, name: d.name, emoji: d.emoji, color: d.color, right, total: mine.length, href: href(`/quest/${d.id}`) };
          })}
        />
        <AnswerReview
          items={deck.map((q, i) => ({ q, index: i, answer: answers[i], correct: !!answers[i] && isCorrect(q, answers[i]!), flagged: flags.has(i), unscored: unscored.has(i) }))}
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" onClick={() => setPhase("intro")}>
            New simulation
          </Button>
          <Link href={href("/review")} className={buttonVariants({ size: "lg", variant: "outline" })}>
            Fix my mistakes
          </Link>
        </div>
      </PageShell>
    );
  }

  const timerBar = (
    <div className="sticky z-10 -mx-4 mb-4 border-b border-border bg-background px-4 py-2 backdrop-blur" style={{ top: "calc(env(safe-area-inset-top, 0px) + 3.2rem)" }}>
      <div className="mx-auto flex max-w-3xl items-center gap-3 text-sm">
        <span className="font-semibold text-foreground">{cfg.name}</span>
        <span className="text-muted-foreground">
          {answeredCount}/{deck.length} answered
        </span>
        <span className={`ml-auto font-mono text-lg ${secondsLeft < 600 ? "text-destructive-foreground" : "text-foreground"}`}><span className="sr-only">Time left </span>{mm}:{ss}</span>
      </div>
    </div>
  );

  if (phase === "review") {
    const unanswered = deck.map((_, i) => i).filter((i) => !answers[i]);
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-4">
        {timerBar}
        <h1 className="text-2xl font-semibold text-foreground">Review before you submit</h1>
        <p className="mt-1 text-muted-foreground">Tap any square to go back to that question.</p>
        <Navigator deck={deck} answers={answers} flags={flags} current={-1} onPick={(i) => { setPhase("exam"); go(i); }} />
        <div className="mt-4 grid gap-2">
          {unanswered.length ? (
            <div role="status" className="flex items-start gap-2 rounded-card border border-warning/40 bg-warning/10 p-3 text-sm text-foreground">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning-foreground" aria-hidden />
              <span>
                <b className="font-semibold">{unanswered.length} unanswered.</b> Unanswered questions count as wrong, and guessing has no penalty.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-success-foreground">
              <Check className="size-4" aria-hidden /> Every question answered.
            </div>
          )}
          {flags.size > 0 && (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Flag className="size-4 text-muted-foreground" aria-hidden /> {flags.size} flagged for review.
            </div>
          )}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button size="lg" variant="outline" onClick={() => setPhase("exam")}>
            <ArrowLeft aria-hidden /> Back to questions
          </Button>
          <Button size="lg" onClick={submit}>
            Submit exam
          </Button>
        </div>
      </main>
    );
  }

  const q = deck[idx];
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-4">
      {timerBar}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h1 className="text-base font-semibold text-foreground">
          Question {idx + 1} of {deck.length}
        </h1>
        <button
          type="button"
          onClick={() => toggleFlag(idx)}
          className={`inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium ${flags.has(idx) ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
        >
          <Flag className="size-4" aria-hidden /> {flags.has(idx) ? "Flagged" : "Flag for review"}
        </button>
        <button type="button" onClick={() => setShowNav(!showNav)} aria-expanded={showNav} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted-foreground hover:text-foreground">
          <LayoutGrid className="size-4" aria-hidden /> All questions
        </button>
      </div>
      {showNav && <Navigator deck={deck} answers={answers} flags={flags} current={idx} onPick={go} />}

      <QuestionCard key={`${q.id}-${version}`} q={q} submitted={answers[idx] ?? null} onSubmit={answer} reveal={false} />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button size="lg" variant="outline" disabled={idx === 0} onClick={() => go(idx - 1)}>
          <ArrowLeft aria-hidden /> Previous
        </Button>
        {answers[idx] && (
          <button type="button" onClick={clearAnswer} className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
            Change answer
          </button>
        )}
        <div className="ml-auto flex gap-3">
          {/* One primary action per state: "Save answer" while choosing, Next once saved. */}
          {idx + 1 < deck.length ? (
            <Button size="lg" variant={answers[idx] ? "default" : "outline"} onClick={() => go(idx + 1)}>
              {answers[idx] ? "Next" : "Skip for now"} <ArrowRight aria-hidden />
            </Button>
          ) : (
            <Button size="lg" variant={answers[idx] ? "default" : "outline"} onClick={() => setPhase("review")}>
              Review & submit
            </Button>
          )}
        </div>
      </div>
      <div className="mt-3 text-right">
        <button type="button" onClick={() => setPhase("review")} className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
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
    <div className="my-4 rounded-card border border-border bg-card p-3">
      <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-13">
        {deck.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPick(i)}
            className={`relative h-9 rounded-md text-sm font-semibold ${i === current ? "ring-2 ring-ring" : ""} ${answers[i] ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {i + 1}
            {flags.has(i) && <Flag role="img" aria-label="flagged" className="absolute -right-1 -top-1 size-3.5 fill-current text-foreground" />}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded-sm bg-primary" aria-hidden /> answered</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded-sm bg-muted ring-1 ring-border" aria-hidden /> unanswered</span>
        <span className="inline-flex items-center gap-1.5"><Flag className="size-3.5" aria-hidden /> flagged</span>
      </div>
    </div>
  );
}
