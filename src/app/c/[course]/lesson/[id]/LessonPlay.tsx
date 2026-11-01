"use client";

import { LessonReader } from "@/components/learn/LessonReader";
import { SoftGate } from "@/components/learn/SoftGate";
import { useCourseMap } from "@/components/map/useCourseMap";
import { quizIntro } from "@/components/learn/copy";
import { SourcesFooter } from "@/components/learn/Sources";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, CircleCheck, Eye, Timer, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LessonPoints, StickyBar } from "@/components/learn/LessonParts";
import { QuestionCard } from "@/components/QuestionCard";
import { TimedQuiz, type TimedResult } from "@/components/TimedQuiz";
import { courseCopy } from "@/engine/copy";
import { useCourse, useLevelPool, useProgress } from "@/engine/course-context";
import { effectiveLevel, pathLessons } from "@/engine/levels";
import { answerText, challengeDeck, isCorrect, pct, prepare, type PreparedQuestion } from "@/engine/game";
import { buildPath } from "@/engine/path";
import { lessonGate, moduleLessonLabel, nextMapLesson } from "@/engine/practice";

/**
 * teach → check → done when every check is right.
 * With a miss (and the timed challenge enabled): check → recap → timed → done,
 * and a failed timed run loops back through the recap.
 */
type Phase = "teach" | "check" | "recap" | "timed" | "done";

/** Lessons and checks use the teal primary for progress and accents; red is kept for wrong-answer marks. */
const ACCENT = "var(--primary)";

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
    const p = store.get();
    if (course.topics?.length) {
      // Topic courses follow the map, so Continue never lands in an older stand-in lesson.
      const lessonIds = new Set(Object.values(course.lessons).flat().map((l) => l.id));
      const nextId = nextMapLesson(course.topics, lessonIds, p);
      setNextHref(nextId ? href(`/lesson/${nextId}`) : href());
    } else {
      const { current } = buildPath(course, p);
      setNextHref(href(current?.to));
    }
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

  const checkNote = (ok: boolean) =>
    ok
      ? gentle
        ? "Exactly right."
        : `Exactly right. +${xp.lessonCheck} XP`
      : challenge.enabled
        ? "Read why. We'll recap, then you'll beat the clock."
        : gentle
          ? "That's fine. Mistakes are how it sticks."
          : "Read why. You'll see it again at the end.";

  return (
    <main className="mx-auto w-full max-w-[712px] px-4 py-5 sm:py-8">
      <div className="flex items-center gap-3">
        <Link href={href()} aria-label="Back to path" className="-ml-2 flex size-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">
          <X className="size-6" aria-hidden />
        </Link>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Lesson progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(stepProgress * 100)}>
          <div className="h-full rounded-full transition-[width] duration-200 motion-reduce:transition-none" style={{ width: pct(stepProgress), background: ACCENT }} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium text-foreground/80">
        <span className="size-2.5 rounded-full" style={{ background: ACCENT }} aria-hidden />
        <span>{gentle || moduleLabel ? lessonLabel : `World ${domain.number} · ${lessonLabel}`}</span>
        {!gentle && <span className="rounded-full bg-muted px-2.5 py-0.5 text-foreground">{copy.task} {lesson.task}</span>}
      </div>

      {phase === "teach" && gateNeeds.length > 0 && (
        <SoftGate needs={gateNeeds} hrefFor={(l) => href(`/lesson/${l}`)} color={domain.color} onContinue={() => setGateDismissed(true)} />
      )}

      {phase === "teach" && gentle && gateNeeds.length === 0 && (
        <LessonReader lesson={lesson} color={ACCENT} tipLabel={copy.tip} questionCount={lesson.check.length} onDone={startCheck} />
      )}

      {phase === "teach" && !gentle && gateNeeds.length === 0 && (
        <div className="card-in">
          <h1 data-reading className="mt-3 max-w-[680px] font-heading text-h4 font-semibold leading-tight text-foreground sm:text-h3">{lesson.title}</h1>
          <div className="mt-5 overflow-x-auto rounded-card border border-border bg-card p-4 sm:p-6">{lesson.visual}</div>
          <LessonPoints points={lesson.points} tip={lesson.tip} tipLabel={copy.tip} color={ACCENT} />
          <SourcesFooter sources={lesson.sources} />
          <StickyBar>
            <Button type="button" size="xl" onClick={startCheck} className="h-12 w-full sm:h-12">
              Check my understanding
              <ArrowRight aria-hidden />
            </Button>
          </StickyBar>
        </div>
      )}

      {phase === "check" && queue[0] && (
        <div className="mt-4">
          {!submitted && <p className="mb-4 text-base text-muted-foreground">{gentle ? quizIntro(lesson.check.length) : "Quick check. No timer."}</p>}
          <QuestionCard key={`${queue[0].id}-${queue.length}-${retried.length}`} q={queue[0]} submitted={submitted} onSubmit={submit} note={checkNote} />
          {submitted && (
            <StickyBar>
              <Button type="button" size="xl" onClick={next} className="h-12 w-full sm:h-12">
                Continue
                <ArrowRight aria-hidden />
              </Button>
            </StickyBar>
          )}
        </div>
      )}

      {phase === "recap" && (
        <div className="card-in mt-4">
          <p className="text-base text-muted-foreground">
            {lastRun ? (
              <>
                <b className="text-foreground">
                  {lastRun.correct}/{lastRun.total}
                </b>{" "}
                on the clock, and you need {Math.ceil(challenge.passShare * lastRun.total)}. One more quick recap, then try again.
              </>
            ) : (
              <>Let&apos;s lock it in. Here&apos;s the whole lesson in 30 seconds, then a timed challenge.</>
            )}
          </p>

          <h1 data-reading className="mt-4 flex items-center gap-2 font-heading text-h4 font-semibold text-foreground">
            <Zap className="size-6 text-warning-foreground" aria-hidden />
            Quick recap: {lesson.title}
          </h1>
          <LessonPoints points={lesson.points} tip={lesson.tip} tipLabel={copy.tip} color={ACCENT} />
          <SourcesFooter sources={lesson.sources} />

          {missed.length > 0 && (
            <>
              <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">What you missed</h2>
              <div className="mt-2 grid max-w-[680px] gap-2">
                {missed.map((qid) => {
                  const q = QUESTION_BY_ID[qid];
                  return (
                    <div key={qid} className="rounded-card border border-border bg-card p-4 text-base">
                      <div className="font-semibold text-foreground">{q.prompt}</div>
                      <div className="mt-1 flex items-start gap-1.5 text-success-foreground">
                        <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
                        {answerText(q)}
                      </div>
                      <div className="mt-1 text-muted-foreground">{q.explanation}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <details className="mt-4 rounded-card border border-border bg-card">
            <summary className="flex min-h-11 cursor-pointer items-center gap-2 px-4 text-base font-medium text-foreground">
              <Eye className="size-4 text-muted-foreground" aria-hidden />
              Show the lesson visual again
            </summary>
            <div className="overflow-x-auto p-4">{lesson.visual}</div>
          </details>

          <StickyBar>
            <Button type="button" size="xl" onClick={startTimed} className="h-auto min-h-12 w-full whitespace-normal py-2 sm:h-auto">
              <Timer aria-hidden />
              Start timed challenge · {Math.max(challenge.questions, missed.length)} questions · {challenge.secondsPerQuestion}s+ each
            </Button>
          </StickyBar>
        </div>
      )}

      {phase === "timed" && (
        <div className="mt-4">
          <h1 data-reading className="mb-4 flex items-center gap-2 font-heading text-h4 font-semibold text-foreground">
            <Timer className="size-6 text-muted-foreground" aria-hidden />
            Beat the clock{timedRuns.length > 0 && <span className="text-muted-foreground"> · attempt {timedRuns.length + 1}</span>}
          </h1>
          <TimedQuiz
            key={timedRuns.length}
            questions={timedDeck}
            secondsPerQuestion={challenge.secondsPerQuestion}
            passShare={challenge.passShare}
            xpPerCorrect={xp.timedCorrect}
            color={ACCENT}
            onFinish={timedFinished}
          />
        </div>
      )}

      {phase === "done" && (
        <div className="pop-in mt-10 text-center">
          <CircleCheck className="mx-auto size-12 text-success-foreground" aria-hidden />
          <p className="mt-3 text-base font-medium text-success-foreground">Lesson complete</p>
          <h2 data-reading className="mt-2 font-heading text-h3 font-semibold text-foreground">{lesson.title}</h2>
          <dl className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-3">
            <div className="rounded-card border border-border bg-card p-3">
              <dt className="text-sm font-medium text-muted-foreground">XP</dt>
              <dd className="text-2xl font-semibold text-foreground">+{firstTime ? xp.lessonComplete : 0}</dd>
            </div>
            <div className="rounded-card border border-border bg-card p-3">
              <dt className="text-sm font-medium text-muted-foreground">Checks</dt>
              <dd className="text-2xl font-semibold text-foreground">{lastRun ? "Beat it" : retried.length === 0 ? "Perfect" : "Done"}</dd>
            </div>
          </dl>
          <div className="mx-auto mt-8 grid max-w-sm gap-2">
            <Button size="xl" className="h-12 sm:h-12" render={<Link href={nextHref} />}>
              {nextHref === href() ? "Back to path" : "Continue"}
              <ArrowRight aria-hidden />
            </Button>
            {nextHref !== href() && (
              <Link href={href()} className="flex min-h-11 items-center justify-center text-base text-muted-foreground hover:text-foreground">
                Back to path
              </Link>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
