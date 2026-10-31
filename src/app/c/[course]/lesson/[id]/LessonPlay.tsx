"use client";

import { LessonReader } from "@/components/learn/LessonReader";
import { SoftGate } from "@/components/learn/SoftGate";
import { useCourseMap } from "@/components/map/useCourseMap";
import { quizIntro } from "@/components/learn/copy";
import { SourcesFooter } from "@/components/learn/Sources";
import { RichText } from "@/components/learn/code";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Confetti, MascotSays } from "@/components/fx";
import { QuestionCard } from "@/components/QuestionCard";
import { TimedQuiz, type TimedResult } from "@/components/TimedQuiz";
import { courseCopy } from "@/engine/copy";
import { useCourse, useLevelPool, useProgress } from "@/engine/course-context";
import { effectiveLevel, pathLessons } from "@/engine/levels";
import { answerText, challengeDeck, isCorrect, pct, prepare, type PreparedQuestion } from "@/engine/game";
import { buildPath } from "@/engine/path";
import { lessonGate, moduleLessonLabel } from "@/engine/practice";

/**
 * teach → check → done when every check is right.
 * With a miss (and the timed challenge enabled): check → recap → timed → done,
 * and a failed timed run loops back through the recap.
 */
type Phase = "teach" | "check" | "recap" | "timed" | "done";

export function LessonPlay() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { course, store, href, lesson: lessonById, domain: domainById, question: QUESTION_BY_ID } = useCourse();
  const { xp } = course.config;
  const copy = courseCopy(course);
  const { pool: levelPool } = useLevelPool();
  const lesson = lessonById[id];
  if (!lesson) notFound();
  const domain = domainById[lesson.domain];
  const worldLessons = course.lessons[lesson.domain];
  const progress = useProgress();
  // Gentle mode: a beginner (or a "Start here" lesson) reads one idea per screen, with no timer or recap loop.
  const gentle = lesson.level === "beginner" || effectiveLevel(course, progress.level) === "beginner";
  // On the beginner path the count runs across the whole course (Lesson 3 of 8), matching the path list.
  const beginnerPath = pathLessons(course, "beginner");
  const pathIndex = beginnerPath.findIndex((l) => l.id === lesson.id);
  const map = useCourseMap();
  // Topic courses number lessons by module, matching the map's "2-1" tiles.
  const moduleLabel = map && moduleLessonLabel(map, lesson.id);
  const lessonLabel = moduleLabel ? moduleLabel : gentle && pathIndex >= 0 ? `Lesson ${pathIndex + 1} of ${beginnerPath.length}` : `Lesson ${lesson.index + 1} of ${worldLessons.length}`;


  const [phase, setPhase] = useState<Phase>("teach");
  const [gateDismissed, setGateDismissed] = useState(false);
  const gateNeeds = map && !gateDismissed ? lessonGate(map, lesson.id) : [];
  const [queue, setQueue] = useState<PreparedQuestion[]>([]);
  const [retried, setRetried] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<number[] | null>(null);
  const [lastOk, setLastOk] = useState(false);
  const [firstTime, setFirstTime] = useState(false);
  const [nextHref, setNextHref] = useState(href());
  const [missed, setMissed] = useState<string[]>([]);
  const [timedDeck, setTimedDeck] = useState<PreparedQuestion[]>([]);
  const [timedRuns, setTimedRuns] = useState<TimedResult[]>([]);

  const challenge = gentle ? { ...course.config.lesson.timedChallenge, enabled: false } : course.config.lesson.timedChallenge;
  const lastRun = timedRuns[timedRuns.length - 1];
  const checksDone = lesson.check.length - queue.length + (submitted ? 1 : 0);
  const stepProgress = { teach: 0.1, check: 0.1 + 0.4 * (checksDone / lesson.check.length), recap: 0.6, timed: 0.75, done: 1 }[phase];

  function startCheck() {
    setQueue(lesson.check.map((qid) => prepare(QUESTION_BY_ID[qid])));
    setSubmitted(null);
    setPhase("check");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submit(picked: number[]) {
    const q = queue[0];
    const ok = isCorrect(q, picked);
    store.recordAnswer(q.id, ok);
    if (ok) store.addXp(xp.lessonCheck);
    else setMissed((m) => (m.includes(q.id) ? m : [...m, q.id]));
    setLastOk(ok);
    setSubmitted(picked);
    // Record completion as soon as the final answer is in, so leaving before Continue still counts.
    const anyMissed = missed.length > 0 || !ok;
    if (queue.length === 1 && !requeues(q.id, ok) && !(challenge.enabled && anyMissed)) recordCompletion();
  }

  /** Without the timed challenge, a missed question comes back once at the end. */
  function requeues(qid: string, ok: boolean) {
    return !ok && !challenge.enabled && course.config.lesson.retryMissed && !retried.includes(qid);
  }

  /** Idempotent: the first call records the lesson; later calls keep its first-time flag. */
  function recordCompletion() {
    if (store.completeLesson(lesson.id)) setFirstTime(true);
  }

  function next() {
    const [q, ...rest] = queue;
    let nextQueue = rest;
    if (requeues(q.id, lastOk)) {
      nextQueue = [...rest, prepare(QUESTION_BY_ID[q.id])];
      setRetried([...retried, q.id]);
    }
    setSubmitted(null);
    if (nextQueue.length === 0) {
      const anyMissed = missed.length > 0 || !lastOk;
      return challenge.enabled && anyMissed ? goTo("recap") : finish();
    }
    setQueue(nextQueue);
  }

  function goTo(next: Phase) {
    setPhase(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startTimed() {
    const must = missed.map((qid) => QUESTION_BY_ID[qid]);
    const pool = [...lesson.check.map((qid) => QUESTION_BY_ID[qid]), ...levelPool.filter((q) => q.domain === lesson.domain)];
    setTimedDeck(challengeDeck(must, pool, Math.max(challenge.questions, must.length)));
    goTo("timed");
  }

  function timedFinished(result: TimedResult) {
    setTimedRuns((r) => [...r, result]);
    if (result.passed) return finish();
    setMissed(result.missed);
    goTo("recap");
  }

  function finish() {
    recordCompletion();
    const { current } = buildPath(course, store.get());
    setNextHref(href(current?.to));
    setPhase("done");
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Enter") return;
      if (phase === "teach" && gateNeeds.length > 0) return;
      if (phase === "teach") {
        if (!gentle) startCheck(); // the reader handles Enter itself
      }
      else if (phase === "check" && submitted) next();
      else if (phase === "recap") startTimed();
      else if (phase === "done") router.push(nextHref);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5 sm:py-8">
      <div className="flex items-center gap-3">
        <Link href={href()} aria-label="Back to path" className="text-2xl text-slate-400 hover:text-white">
          ✕
        </Link>
        <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: pct(stepProgress), background: domain.color }} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider">
        <span style={{ color: domain.color }}>
          {gentle || moduleLabel ? `${domain.emoji} ${lessonLabel}` : `${domain.emoji} World ${domain.number} · ${lessonLabel}`}
        </span>
        {!gentle && <span className="rounded-full bg-white/10 px-2 py-0.5 text-slate-300">{copy.task} {lesson.task}</span>}
      </div>

      {phase === "teach" && gateNeeds.length > 0 && (
        <SoftGate needs={gateNeeds} hrefFor={(l) => href(`/lesson/${l}`)} color={domain.color} onContinue={() => setGateDismissed(true)} />
      )}

      {phase === "teach" && gentle && gateNeeds.length === 0 && (
        <LessonReader lesson={lesson} color={domain.color} tipLabel={copy.tip} questionCount={lesson.check.length} onDone={startCheck} />
      )}

      {phase === "teach" && !gentle && gateNeeds.length === 0 && (
        <div className="card-in">
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">{lesson.title}</h1>
          <div className="mt-5 rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-6 shadow-2xl" style={{ boxShadow: `0 20px 60px -30px ${domain.color}` }}>
            {lesson.visual}
          </div>
          <ul className="mt-5 grid gap-2">
            {lesson.points.map((pt, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-slate-200">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-slate-950" style={{ background: domain.color }}>
                  {i + 1}
                </span>
                <span><RichText text={pt} /></span>
              </li>
            ))}
          </ul>
          {lesson.tip && (
            <div className="mt-4">
              <MascotSays mood="think">
                <span className="font-semibold text-amber-300">{copy.tip}: </span>
                <RichText text={lesson.tip} />
              </MascotSays>
            </div>
          )}
          <SourcesFooter sources={lesson.sources} />
          <div className="sticky bottom-0 -mx-4 mt-6 border-t border-white/10 bg-slate-950/90 px-4 py-4 backdrop-blur">
            <button type="button" onClick={startCheck} className="btn-3d w-full rounded-2xl bg-emerald-400 py-3.5 text-lg font-black uppercase tracking-wide text-slate-950" style={{ "--edge": "#047857" } as React.CSSProperties}>
              Check my understanding
            </button>
          </div>
        </div>
      )}

      {phase === "check" && queue[0] && (
        <div className="mt-3">
          <MascotSays mood={submitted ? (lastOk ? "happy" : "think") : "wow"}>
            {submitted
              ? lastOk
                ? "Nice! Exactly right."
                : challenge.enabled
                  ? "Not quite. Read why. We'll recap, then you'll beat the clock."
                  : gentle
                    ? "Not quite, and that's fine. That's how it sticks. Here's why:"
                    : "Not quite. Read why, and you'll see it again at the end."
              : gentle
                ? quizIntro(lesson.check.length)
                : "Quick check. You've got this!"}
          </MascotSays>
          <div className="mt-4">
            <QuestionCard key={`${queue[0].id}-${queue.length}-${retried.length}`} q={queue[0]} submitted={submitted} onSubmit={submit} />
          </div>
          {submitted && (
            <div className={`sticky bottom-0 -mx-4 mt-5 border-t px-4 py-4 backdrop-blur ${lastOk ? "border-emerald-400/30 bg-emerald-950/80" : gentle ? "border-amber-400/30 bg-amber-950/80" : "border-rose-400/30 bg-rose-950/80"}`}>
              <div className="flex items-center justify-between gap-3">
                <span className={`text-lg font-black ${lastOk ? "text-emerald-300" : gentle ? "text-amber-300" : "text-rose-300"}`}>{lastOk ? (gentle ? "✓ Correct!" : `✓ Correct! +${xp.lessonCheck} XP`) : gentle ? "Not quite" : "✗ Keep going"}</span>
                <button
                  type="button"
                  onClick={next}
                  className={`btn-3d rounded-2xl px-8 py-3 font-black uppercase text-slate-950 ${lastOk ? "bg-emerald-400" : gentle ? "bg-amber-400" : "bg-rose-400"}`}
                  style={{ "--edge": lastOk ? "#047857" : gentle ? "#b45309" : "#9f1239" } as React.CSSProperties}
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {phase === "recap" && (
        <div className="card-in mt-3">
          <MascotSays mood="think">
            {lastRun ? (
              <>
                <b>
                  {lastRun.correct}/{lastRun.total}
                </b>{" "}
                on the clock, and you need {Math.ceil(challenge.passShare * lastRun.total)}. One more quick recap, then try again.
              </>
            ) : (
              <>Let&apos;s lock it in. Here&apos;s the whole lesson in 30 seconds, then a timed challenge.</>
            )}
          </MascotSays>

          <h1 className="mt-5 text-2xl font-black text-white">⚡ Quick recap: {lesson.title}</h1>
          <ul className="mt-4 grid gap-2">
            {lesson.points.map((pt, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-slate-200">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-slate-950" style={{ background: domain.color }}>
                  {i + 1}
                </span>
                <span><RichText text={pt} /></span>
              </li>
            ))}
            {lesson.tip && (
              <li className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-base text-amber-100">
                <b>{copy.tip}:</b> <RichText text={lesson.tip} />
              </li>
            )}
          </ul>
          <SourcesFooter sources={lesson.sources} />

          {missed.length > 0 && (
            <>
              <h2 className="mt-6 text-sm font-black uppercase tracking-wider text-rose-300">What you missed</h2>
              <div className="mt-2 grid gap-2">
                {missed.map((qid) => {
                  const q = QUESTION_BY_ID[qid];
                  return (
                    <div key={qid} className="rounded-xl border border-rose-400/30 bg-rose-400/5 p-3 text-base">
                      <div className="font-semibold text-white">{q.prompt}</div>
                      <div className="mt-1 text-emerald-300">✓ {answerText(q)}</div>
                      <div className="mt-1 text-slate-400">{q.explanation}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <details className="mt-4 rounded-xl border border-white/10 bg-slate-900/60">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-300">👀 Show the lesson visual again</summary>
            <div className="p-4">{lesson.visual}</div>
          </details>

          <div className="sticky bottom-0 -mx-4 mt-6 border-t border-white/10 bg-slate-950/90 px-4 py-4 backdrop-blur">
            <button
              type="button"
              onClick={startTimed}
              className="btn-3d w-full rounded-2xl bg-amber-400 py-3.5 text-lg font-black uppercase tracking-wide text-slate-950"
              style={{ "--edge": "#b45309" } as React.CSSProperties}
            >
              ⏱️ Start timed challenge · {Math.max(challenge.questions, missed.length)} questions · {challenge.secondsPerQuestion}s+ each
            </button>
          </div>
        </div>
      )}

      {phase === "timed" && (
        <div className="mt-3">
          <h1 className="mb-4 text-xl font-black text-white">
            ⏱️ Beat the clock{timedRuns.length > 0 && <span className="text-slate-400"> · attempt {timedRuns.length + 1}</span>}
          </h1>
          <TimedQuiz
            key={timedRuns.length}
            questions={timedDeck}
            secondsPerQuestion={challenge.secondsPerQuestion}
            passShare={challenge.passShare}
            xpPerCorrect={xp.timedCorrect}
            color={domain.color}
            onFinish={timedFinished}
          />
        </div>
      )}

      {phase === "done" && (
        <div className="pop-in mt-10 text-center">
          <Confetti />
          <div className="mx-auto w-fit">
            <MascotSays mood="wow">
              <span className="text-lg font-bold">Lesson complete! 🎉</span>
            </MascotSays>
          </div>
          <h2 className="mt-6 text-3xl font-black text-white">{lesson.title}</h2>
          <div className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-3">
            <div className="rounded-2xl border-2 border-amber-400/50 bg-amber-400/10 p-3">
              <div className="text-xs font-bold uppercase text-amber-300">XP</div>
              <div className="text-2xl font-black text-white">+{firstTime ? xp.lessonComplete : 0}</div>
            </div>
            <div className="rounded-2xl border-2 border-sky-400/50 bg-sky-400/10 p-3">
              <div className="text-xs font-bold uppercase text-sky-300">Checks</div>
              <div className="text-2xl font-black text-white">{lastRun ? "⏱️ Beat it" : retried.length === 0 ? "Perfect" : "Done"}</div>
            </div>
          </div>
          <div className="mx-auto mt-8 grid max-w-sm gap-3">
            <Link
              href={nextHref}
              className="btn-3d rounded-2xl bg-sky-400 py-3.5 text-lg font-black uppercase text-slate-950"
              style={{ "--edge": "#0369a1" } as React.CSSProperties}
            >
              {nextHref === href() ? "Back to path" : "Continue →"}
            </Link>
            <Link href={href()} className="text-sm text-slate-400 hover:text-white">
              Back to path
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
