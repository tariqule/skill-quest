"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlarmClockIcon, BarChart3Icon, BrainIcon, CheckIcon, LibraryIcon, LightbulbIcon, ListIcon, PauseIcon, PlayIcon, SquareStackIcon, SwordsIcon, TargetIcon, TimerIcon, XIcon , PartyPopperIcon, BookOpenIcon, Gamepad2Icon } from "lucide-react";
import { SourcesFooter } from "@/components/learn/Sources";
import { RichText } from "@/components/learn/code";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChallengeCard } from "@/components/ChallengeCard";
import { MascotSays } from "@/components/fx";
import { SectionGame } from "@/components/three/games/SectionGame";
import { QuestionCard } from "@/components/QuestionCard";
import { Bar } from "@/components/ui";
import { courseCopy } from "@/engine/copy";
import { studySessionPool } from "@/engine/practice";
import { useCourse, useLevelPool, useProgress } from "@/engine/course-context";
import { answerText, isCorrect, levelDeck, pct, pickedText, shuffle, taughtPool, type PreparedQuestion } from "@/engine/game";
import type { Card, Challenge, Lesson } from "@/engine/types";
import { BlockIcon } from "@/components/learn/block-icons";

/** setup → study (one concept at a time, then key terms; no questions) → ready → play (questions + challenges) → report */
type Phase = "setup" | "study" | "ready" | "play" | "report";

type PlayItem = { kind: "question"; q: PreparedQuestion } | { kind: "challenge"; c: Challenge };

interface QuestionLog {
  q: PreparedQuestion;
  picked: number[];
  correct: boolean;
}

export function StudySession() {
  const { domain: domainId } = useParams<{ domain: string }>();
  const { course, store, href, domain: domainById, lessonForQuestion } = useCourse();
  const progress = useProgress();
  const domain = domainById[domainId];
  if (!domain) notFound();
  const lessons = course.lessons[domain.id] ?? [];
  const challenges = course.challenges.filter((c) => c.domain === domain.id);
  const cfg = course.config.study;
  const copy = courseCopy(course);

  const [phase, setPhase] = useState<Phase>("setup");
  const [minutes, setMinutes] = useState(cfg.defaultMinutes);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [current, setCurrent] = useState(0);
  const [viewed, setViewed] = useState<string[]>([]);
  const [drawer, setDrawer] = useState(false);
  const [items, setItems] = useState<PlayItem[]>([]);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState<number[] | null>(null);
  const [log, setLog] = useState<QuestionLog[]>([]);
  const [challengeLog, setChallengeLog] = useState<{ c: Challenge; solved: boolean }[]>([]);

  const target = minutes * 60;
  const timeUp = minutes > 0 && elapsed >= target;
  const { level } = useLevelPool();
  const domainPool = course.questions.filter((q) => q.domain === domain.id);
  const questionCount = Math.min(cfg.playQuestions, domainPool.length);

  // Study clock: counts up while studying and not paused.
  useEffect(() => {
    if (phase !== "study" || paused) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [phase, paused]);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function view(i: number) {
    setCurrent(i);
    const id = lessons[i].id;
    if (!viewed.includes(id)) setViewed((v) => [...v, id]);
    store.markStudied(id);
    scrollTop();
  }

  function startStudy() {
    setElapsed(0);
    setPaused(false);
    setPhase("study");
    view(0);
  }

  /** Leave the concepts for the "you're ready" screen, where the play button lives. */
  function finish() {
    setDrawer(false);
    setPhase("ready");
    scrollTop();
  }

  function startPlay() {
    store.recordStudy(domain.id, Math.floor(elapsed / 60));
    const taught = studySessionPool(course, domainPool, progress, viewed, (all) => taughtPool(all, viewed));
    const qs = levelDeck(course, level, taught, Math.min(questionCount, taught.length));
    const cs = shuffle(challenges);
    const built: PlayItem[] = [];
    qs.forEach((q, i) => {
      built.push({ kind: "question", q });
      if ((i + 1) % cfg.challengeEvery === 0 && cs.length) built.push({ kind: "challenge", c: cs.shift()! });
    });
    built.push(...cs.map((c) => ({ kind: "challenge" as const, c })));
    // Nothing studied yet in a topic course: there is nothing fair to ask, so go straight to the report.
    if (!built.length) {
      setItems([]);
      setLog([]);
      setChallengeLog([]);
      setPhase("report");
      scrollTop();
      return;
    }
    setItems(built);
    setStep(0);
    setSubmitted(null);
    setLog([]);
    setChallengeLog([]);
    setPhase("play");
    scrollTop();
  }

  function answer(picked: number[]) {
    const item = items[step];
    if (item.kind !== "question") return;
    const ok = isCorrect(item.q, picked);
    store.recordAnswer(item.q.id, ok);
    if (ok) store.addXp(course.config.xp.studyCorrect);
    setSubmitted(picked);
    setLog((l) => [...l, { q: item.q, picked, correct: ok }]);
  }

  function next() {
    setSubmitted(null);
    if (step + 1 >= items.length) {
      setPhase("report");
      scrollTop();
      return;
    }
    setStep(step + 1);
    scrollTop();
  }

  const mm = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // ───────────── Setup ─────────────
  if (phase === "setup") {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
        <Link href={href()} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to map
        </Link>
        <div className="mt-3 text-sm font-semibold" style={{ color: domain.color }}>
          <BlockIcon icon={domain.emoji} className="inline-block size-[1.1em] align-[-0.15em]" /> {copy.noun === "exam" ? "World" : "Stage"} {domain.number} · {domain.weight}% of the {copy.noun}
        </div>
        <h1 className="mt-1 text-3xl font-semibold text-foreground"><LibraryIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> Study: {domain.world}</h1>
        <p className="mt-1 text-muted-foreground">{domain.name}</p>

        <div className="mt-6">
          <MascotSays>
            Learn first, play second. Take your time with the concepts: no questions until you&apos;re ready. Then we&apos;ll play with what you learned.
          </MascotSays>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { Icon: BookOpenIcon, t: "1. Study", d: `${lessons.length} concepts with visuals and labs. No questions.` },
            { Icon: Gamepad2Icon, t: "2. Play", d: `${questionCount} questions + ${challenges.length} hands-on challenge${challenges.length === 1 ? "" : "s"}, with full feedback.` },
            { Icon: BarChart3Icon, t: "3. Results", d: "Every answer, every concept, and what to study next." },
          ].map((s) => (
            <div key={s.t} className="rounded-2xl border border-border bg-card p-4">
              <s.Icon aria-hidden="true" className="size-6 text-primary" />
              <div className="mt-1 font-semibold text-foreground">{s.t}</div>
              <div className="text-sm text-muted-foreground">{s.d}</div>
            </div>
          ))}
        </div>

        <h2 className="mt-8 font-semibold text-foreground">How long do you want to study?</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {cfg.minuteOptions.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMinutes(m)}
              className={`rounded-2xl border px-4 py-3 font-semibold ${minutes === m ? "border-primary bg-primary/20 text-foreground" : "border-border bg-card text-muted-foreground"}`}
            >
              {m === 0 ? "No timer" : `${m} min`}
            </button>
          ))}
        </div>
        {(progress.studyMinutes[domain.id] ?? 0) > 0 && (
          <p className="mt-3 text-sm text-muted-foreground">You&apos;ve studied this world for {progress.studyMinutes[domain.id]} minutes so far.</p>
        )}

        <Button onClick={startStudy} size="xl" className="mt-8 w-full">
          <LibraryIcon aria-hidden="true" /> Start studying
        </Button>
      </main>
    );
  }

  // ───────────── Study ─────────────
  if (phase === "study" || phase === "ready") {
    const cards = course.cards.filter((c) => c.domain === domain.id);
    // Steps: every concept, then a key-terms recap (if the world has any), then the "ready" screen.
    const termsStep = cards.length ? lessons.length : -1;
    const lastStep = cards.length ? lessons.length : lessons.length - 1;
    const onTerms = phase === "study" && current === termsStep;
    const lesson = phase === "study" && !onTerms ? lessons[current] : null;
    const stepCount = lessons.length + (cards.length ? 1 : 0);
    const goTo = (i: number) => {
      setDrawer(false);
      setPhase("study");
      if (i < lessons.length) view(i);
      else {
        setCurrent(i);
        scrollTop();
      }
    };
    const forward = () => (current >= lastStep ? finish() : goTo(current + 1));
    const back = current > 0 ? () => goTo(current - 1) : undefined;
    const list = (
      <ConceptList
        lessons={lessons}
        current={phase === "ready" ? -1 : current}
        viewed={viewed}
        color={domain.color}
        hasTerms={cards.length > 0}
        termsActive={onTerms}
        onPick={goTo}
        onFinish={finish}
      />
    );

    return (
      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-3 lg:pb-12">
        <StudyKeys enabled={phase === "study" && !drawer} onPrev={back} onNext={forward} />
        <div className="sticky z-10 -mx-4 border-b border-border bg-background px-4 pb-2 pt-2 backdrop-blur" style={{ top: "calc(env(safe-area-inset-top, 0px) + 3.2rem)" }}>
          <div className="flex items-center gap-2 text-sm">
            <span className="min-w-0 truncate font-semibold text-foreground"><LibraryIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> {domain.world}</span>
            <span className={`ml-auto shrink-0 font-mono ${timeUp ? "text-warning-foreground" : "text-foreground"}`} aria-label="Study timer">
              <TimerIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> {minutes > 0 ? mm(Math.max(0, target - elapsed)) : mm(elapsed)}
            </span>
            <button
              type="button"
              onClick={() => setPaused(!paused)}
              className="shrink-0 rounded-lg border border-border px-2 py-1 text-sm text-foreground"
              aria-label={paused ? "Resume timer" : "Pause timer"}
            >
              {paused ? "▶" : <PauseIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" />}
            </button>
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="shrink-0 rounded-lg border border-border px-2.5 py-1 text-sm font-semibold text-foreground lg:hidden"
              aria-haspopup="dialog"
            >
              <ListIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> Concepts
            </button>
          </div>
          {/* One segment per step; filled when seen, outlined for the current one. */}
          <div className="mt-2 flex gap-1" aria-hidden>
            {Array.from({ length: stepCount }, (_, i) => {
              const seen = i < lessons.length ? viewed.includes(lessons[i].id) : phase === "ready" || onTerms;
              const here = phase === "study" && i === current;
              return (
                <span
                  key={i}
                  className="h-1.5 flex-1 rounded-full transition"
                  style={{ background: seen ? domain.color : "var(--muted)", boxShadow: here ? "0 0 0 2px var(--ring)" : undefined, opacity: here || seen ? 1 : 0.7 }}
                />
              );
            })}
          </div>
          {minutes > 0 && <Bar value={Math.min(1, elapsed / target)} color={timeUp ? "var(--warning)" : "var(--muted-foreground)"} className="mt-1 h-0.5" />}
        </div>

        {timeUp && phase === "study" && (
          <div className="pop-in mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-warning/60 bg-warning/10 p-4">
            <span className="text-3xl"><AlarmClockIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /></span>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-foreground">Study time&apos;s up</div>
              <div className="text-sm text-muted-foreground">
                You covered {viewed.length} of {lessons.length} concepts. Keep going, or wrap up.
              </div>
            </div>
            <Button onClick={() => setMinutes(minutes + 5)} variant="outline">
              +5 min
            </Button>
            <Button onClick={finish}>
              Wrap up →
            </Button>
          </div>
        )}

        <div className="mt-4 grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="hidden lg:sticky lg:top-36 lg:block lg:self-start">{list}</aside>

          <div className="min-w-0">
            {phase === "ready" ? (
              <ReadyScreen
                domainId={domain.id}
                lessons={lessons}
                viewed={viewed}
                seconds={elapsed}
                questionCount={questionCount}
                challengeCount={challenges.length}
                onPlay={startPlay}
                onReview={(i) => goTo(i)}
              />
            ) : onTerms ? (
              <TermsRecap cards={cards} color={domain.color} />
            ) : lesson ? (
              <ConceptView
                key={lesson.id}
                lesson={lesson}
                index={current}
                total={lessons.length}
                color={domain.color}
                taskLabel={copy.task}
                tipLabel={copy.tip}
                terms={termsFor(lesson, cards)}
              />
            ) : null}
            {lesson && (current + 1) % 3 === 0 && current < lessons.length - 1 && <GameBreak key={`break-${current}`} domainId={domain.id} />}

            {phase === "study" && (
              <div className="mt-6 hidden gap-3 lg:flex">
                <Button disabled={!back} onClick={back} variant="outline">
                  ← Previous
                </Button>
                <Button onClick={forward} className="ml-auto">
                  {nextLabel(current, lastStep, termsStep)}
                </Button>
              </div>
            )}
            {phase === "study" && <p className="mt-3 hidden text-center text-sm text-muted-foreground lg:block">Tip: use the ← and → keys to move between concepts.</p>}
          </div>
        </div>

        {/* Phone: thumb-reach navigation pinned to the bottom of the screen. */}
        {phase === "study" && (
          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background px-4 pt-3 backdrop-blur lg:hidden" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}>
            <div className="mx-auto flex max-w-5xl gap-3">
              <Button disabled={!back} onClick={back} aria-label="Previous" variant="outline" size="lg">
                ←
              </Button>
              <Button onClick={forward} size="lg" className="flex-1">
                {nextLabel(current, lastStep, termsStep)}
              </Button>
            </div>
          </div>
        )}

        {drawer && (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Concepts">
            <button type="button" aria-label="Close" className="absolute inset-0 bg-background/60" onClick={() => setDrawer(false)} />
            <div className="pop-in absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-border bg-card p-4" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}>
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-accent" />
              {list}
            </div>
          </div>
        )}
      </main>
    );
  }

  // ───────────── Play ─────────────
  if (phase === "play") {
    const item = items[step];
    const last = log[log.length - 1];
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-5">
        <div className="mb-4 flex items-center gap-3">
          <span className="font-semibold text-foreground"><PlayIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> Play</span>
          <div className="flex-1">
            <div className="mb-1 flex justify-between text-sm text-muted-foreground">
              <span>
                Step {step + 1} of {items.length}
              </span>
              <span>
                <CheckIcon role="img" aria-label="correct" className="inline-block size-[1.1em] align-[-0.15em]" /> {log.filter((l) => l.correct).length} · <TargetIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> {challengeLog.filter((c) => c.solved).length}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full transition-all" style={{ width: pct(step / items.length), background: domain.color }} />
            </div>
          </div>
        </div>

        {item.kind === "challenge" ? (
          <ChallengeCard
            key={item.c.id}
            challenge={item.c}
            onDone={(solved) => {
              setChallengeLog((l) => [...l, { c: item.c, solved }]);
              next();
            }}
          />
        ) : (
          <>
            <QuestionCard key={`${item.q.id}-${step}`} q={item.q} submitted={submitted} onSubmit={answer} />
            {submitted && last && (
              <div className="pop-in mt-4 grid gap-3">
                <div className={`rounded-2xl border p-4 ${last.correct ? "border-success/50 bg-success/10" : "border-destructive/50 bg-destructive/10"}`}>
                  <div className={`text-lg font-semibold ${last.correct ? "text-success-foreground" : "text-destructive-foreground"}`}>
                    {last.correct ? `Correct! +${course.config.xp.studyCorrect} XP` : "Not quite. Here's the full picture"}
                  </div>
                  <div className="mt-2 grid gap-1 text-sm">
                    <div>
                      <span className="text-muted-foreground">Your answer: </span>
                      <span className="text-foreground">{pickedText(item.q, submitted)}</span>
                    </div>
                    {!last.correct && (
                      <div>
                        <span className="text-muted-foreground">Correct answer: </span>
                        <span className="text-success-foreground">{answerText(item.q)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={next}>
                    {step + 1 >= items.length ? "See my results" : "Next →"}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    );
  }

  // ───────────── Report ─────────────
  const right = log.filter((l) => l.correct).length;
  const solved = challengeLog.filter((c) => c.solved).length;
  const share = log.length ? right / log.length : 0;
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
      <div className="text-sm font-semibold" style={{ color: domain.color }}>
        <BlockIcon icon={domain.emoji} className="inline-block size-[1.1em] align-[-0.15em]" /> {domain.world}
      </div>
      <h1 className="mt-1 text-3xl font-semibold text-foreground"><BarChart3Icon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> Your study results</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Studied" value={mm(elapsed)} />
        <Stat label="Concepts" value={`${viewed.length}/${lessons.length}`} />
        <Stat label="Questions" value={`${right}/${log.length}`} tone={share >= 0.7 ? "good" : "warn"} />
        <Stat label="Challenges" value={`${solved}/${challengeLog.length}`} tone={solved === challengeLog.length ? "good" : "warn"} />
      </div>

      <div className="mt-6">
        <MascotSays mood={share >= 0.7 ? "wow" : "think"}>
          {share >= 0.7
            ? `Strong session! You're ready for this world's trial.`
            : "Good start. Review the concepts marked below, then study again or try the trial."}
        </MascotSays>
      </div>

      <h2 className="mt-8 text-lg font-semibold text-foreground">By concept</h2>
      <div className="mt-3 grid gap-2">
        {lessons.map((l) => {
          const mine = log.filter((x) => lessonForQuestion[x.q.id]?.id === l.id);
          const ok = mine.filter((x) => x.correct).length;
          return (
            <div key={l.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2 text-sm">
              <span className={viewed.includes(l.id) ? "text-success-foreground" : "text-muted-foreground"}>{viewed.includes(l.id) ? "studied" : "not opened"}</span>
              <span className="min-w-0 flex-1 text-foreground">{l.title}</span>
              {mine.length > 0 && (
                <span className={ok === mine.length ? "text-success-foreground" : "text-warning-foreground"}>
                  {ok}/{mine.length} right
                </span>
              )}
            </div>
          );
        })}
      </div>

      {challengeLog.length > 0 && (
        <>
          <h2 className="mt-8 text-lg font-semibold text-foreground">Hands-on challenges</h2>
          <div className="mt-3 grid gap-2">
            {challengeLog.map(({ c, solved: s }) => (
              <div key={c.id} className={`rounded-xl border p-3 text-sm ${s ? "border-success/40 bg-success/5" : "border-border bg-muted"}`}>
                <div className="font-semibold text-foreground">
                  {s ? <CheckIcon role="img" aria-label="correct" className="inline-block size-[1.1em] align-[-0.15em]" /> : "↷"} {c.title} <span className="font-normal text-muted-foreground">{s ? "solved" : "skipped"}</span>
                </div>
                <div className="mt-1 text-muted-foreground"><BrainIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> {c.takeaway}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className="mt-8 text-lg font-semibold text-foreground">Every question</h2>
      <div className="mt-3 grid gap-2">
        {log.map((l, i) => (
          <details key={`${l.q.id}-${i}`} className={`rounded-xl border ${l.correct ? "border-border bg-muted" : "border-destructive/30 bg-destructive/5"}`} open={!l.correct}>
            <summary className="cursor-pointer px-3 py-2 text-sm text-foreground">
              <span className={l.correct ? "text-success-foreground" : "text-destructive-foreground"}>{l.correct ? <CheckIcon role="img" aria-label="correct" className="inline-block size-[1.1em] align-[-0.15em]" /> : <XIcon role="img" aria-label="incorrect" className="inline-block size-[1.1em] align-[-0.15em]" />}</span> {l.q.prompt}
            </summary>
            <div className="grid gap-1 px-3 pb-3 text-sm">
              <div>
                <span className="text-muted-foreground">Your answer: </span>
                {pickedText(l.q, l.picked)}
              </div>
              <div>
                <span className="text-muted-foreground">Correct: </span>
                <span className="text-success-foreground">{answerText(l.q)}</span>
              </div>
              <div className="text-muted-foreground">{l.q.explanation}</div>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={href(`/quest/${domain.id}`)} className={cn(buttonVariants({ size: "lg" }))}>
          <SwordsIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> Take the world trial
        </Link>
        <Button onClick={() => setPhase("setup")} variant="outline" size="lg">
          <LibraryIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> Study again
        </Button>
        <Link href={href()} className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
          Back to map
        </Link>
      </div>
    </main>
  );
}

function nextLabel(current: number, lastStep: number, termsStep: number) {
  if (current >= lastStep) return "Finish studying";
  if (current + 1 === termsStep) return "Key terms recap →";
  return "Next concept →";
}

/** ← / → move between study steps (ignored while typing in a lab). */
function StudyKeys({ enabled, onPrev, onNext }: { enabled: boolean; onPrev?: () => void; onNext: () => void }) {
  useEffect(() => {
    if (!enabled) return;
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey || (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) || t?.isContentEditable) return;
      if (e.key === "ArrowRight") onNext();
      else if (e.key === "ArrowLeft") onPrev?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, onPrev, onNext]);
  return null;
}

/** Flashcards whose term shows up in this concept's text, for the "terms in this concept" strip. */
function termsFor(lesson: Lesson, cards: Card[]) {
  const text = `${lesson.title} ${lesson.points.join(" ")} ${lesson.tip ?? ""}`.toLowerCase().replace(/`/g, "");
  return cards.filter((c) => {
    const term = c.term.toLowerCase().replace(/`/g, "").trim();
    return term.length >= 3 && text.includes(term);
  }).slice(0, 6);
}

function ConceptList({
  lessons,
  current,
  viewed,
  color,
  hasTerms,
  termsActive,
  onPick,
  onFinish,
}: {
  lessons: Lesson[];
  current: number;
  viewed: string[];
  color: string;
  hasTerms: boolean;
  termsActive: boolean;
  onPick: (i: number) => void;
  onFinish: () => void;
}) {
  return (
    <nav aria-label="Concepts in this world">
      <div className="mb-2 text-sm font-semibold text-muted-foreground">
        Concepts · {viewed.length}/{lessons.length} seen
      </div>
      <ol className="grid gap-1.5">
        {lessons.map((l, i) => {
          const on = i === current;
          const seen = viewed.includes(l.id);
          return (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => onPick(i)}
                aria-current={on ? "step" : undefined}
                className={`flex w-full items-start gap-2.5 rounded-xl border px-3 py-2 text-left text-sm transition ${on ? "border-primary bg-primary/15 text-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted"}`}
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                  style={{ background: seen ? color : "var(--muted)", color: seen ? "var(--primary-foreground)" : "var(--muted-foreground)" }}
                >
                  {seen ? <CheckIcon role="img" aria-label="correct" className="inline-block size-[1.1em] align-[-0.15em]" /> : i + 1}
                </span>
                <span className="leading-snug">{l.title}</span>
              </button>
            </li>
          );
        })}
        {hasTerms && (
          <li>
            <button
              type="button"
              onClick={() => onPick(lessons.length)}
              className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-sm transition ${termsActive ? "border-primary bg-primary/15 text-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted"}`}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center text-sm"><SquareStackIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /></span>
              Key terms recap
            </button>
          </li>
        )}
      </ol>
      <Button onClick={onFinish} className="mt-3 w-full">
        <CheckIcon role="img" aria-label="correct" className="inline-block size-[1.1em] align-[-0.15em]" /> Finish studying
      </Button>
    </nav>
  );
}

function ConceptView({
  lesson,
  index,
  total,
  color,
  taskLabel,
  tipLabel,
  terms,
}: {
  taskLabel: string;
  tipLabel: string;
  lesson: Lesson;
  index: number;
  total: number;
  color: string;
  terms: Card[];
}) {
  return (
    <article className="card-in min-w-0">
      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
        <span style={{ color }}>
          Concept {index + 1} of {total}
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
          {taskLabel} {lesson.task}
        </span>
      </div>
      <h2 className="mt-1 text-2xl font-semibold leading-tight text-foreground sm:text-3xl">{lesson.title}</h2>

      <section className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card p-3 sm:p-6">
        {lesson.visual}
      </section>

      <section className="mt-5">
        <h3 className="text-sm font-semibold text-muted-foreground">What to remember</h3>
        <ul className="mt-2 grid gap-2">
          {lesson.points.map((p, i) => (
            <li key={i} className="flex gap-3 rounded-xl border border-border bg-card p-3 leading-relaxed text-foreground">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground" style={{ background: color }}>
                {i + 1}
              </span>
              <span className="min-w-0">
                <RichText text={p} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      {lesson.tip && (
        <div className="mt-3 flex gap-3 rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm leading-relaxed text-warning-foreground">
          <span className="text-lg"><LightbulbIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /></span>
          <span className="min-w-0">
            <b>{tipLabel}:</b> <RichText text={lesson.tip} />
          </span>
        </div>
      )}
      <SourcesFooter sources={lesson.sources} />

      {terms.length > 0 && (
        <section className="mt-5">
          <h3 className="text-sm font-semibold text-muted-foreground">Terms in this concept · tap to reveal</h3>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {terms.map((c) => (
              <TermCard key={c.id} term={c.term} definition={c.definition} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function TermsRecap({ cards, color }: { cards: Card[]; color: string }) {
  return (
    <article className="card-in min-w-0">
      <div className="text-sm font-semibold" style={{ color }}>
        Recap
      </div>
      <h2 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl"><SquareStackIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> Key terms</h2>
      <p className="mt-1 text-muted-foreground">Say each definition in your head, then tap to check. These all come up when you play.</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {cards.map((c) => (
          <TermCard key={c.id} term={c.term} definition={c.definition} />
        ))}
      </div>
    </article>
  );
}

/** An optional one-minute game after every third concept. */
function GameBreak({ domainId }: { domainId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-6">
      {open ? (
        <SectionGame domainId={domainId} compact />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-warning/40 bg-warning/[0.06] p-4 text-left transition hover:bg-warning/10"
        >
          <span className="text-3xl"><PlayIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /></span>
          <span>
            <span className="block font-semibold text-foreground">Quick break: play a 1-minute game</span>
            <span className="block text-sm text-muted-foreground">Practise the words from this section. Totally optional.</span>
          </span>
        </button>
      )}
    </div>
  );
}

function ReadyScreen({
  domainId,
  lessons,
  viewed,
  seconds,
  questionCount,
  challengeCount,
  onPlay,
  onReview,
}: {
  domainId: string;
  lessons: Lesson[];
  viewed: string[];
  seconds: number;
  questionCount: number;
  challengeCount: number;
  onPlay: () => void;
  onReview: (i: number) => void;
}) {
  const missed = lessons.map((l, i) => ({ l, i })).filter(({ l }) => !viewed.includes(l.id));
  const mins = Math.max(1, Math.round(seconds / 60));
  return (
    <section className="pop-in min-w-0 rounded-3xl border border-border bg-card p-5 text-center sm:p-8">
      <div className="text-5xl"><PartyPopperIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /></div>
      <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">Study session complete</h2>
      <p className="mt-1 text-muted-foreground">
        You studied {viewed.length} of {lessons.length} concepts in about {mins} {mins === 1 ? "minute" : "minutes"}.
      </p>

      <div className="mx-auto mt-5 grid max-w-md gap-2 text-left text-sm text-muted-foreground">
        <div className="rounded-xl bg-muted px-3 py-2"><PlayIcon aria-hidden="true" className="inline-block size-[1.1em] align-[-0.15em]" /> Next: {questionCount} questions and {challengeCount} hands-on challenge{challengeCount === 1 ? "" : "s"}, with feedback on every answer.</div>
        {missed.length > 0 && (
          <div className="rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 text-warning-foreground">
            You skipped {missed.length}:{" "}
            {missed.map(({ l, i }, k) => (
              <span key={l.id}>
                <button type="button" onClick={() => onReview(i)} className="font-semibold underline underline-offset-2">
                  {l.title}
                </button>
                {k < missed.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mx-auto mt-6 max-w-xl text-left">
        <SectionGame domainId={domainId} compact />
      </div>

      <Button onClick={onPlay} size="xl" className="mt-6 w-full max-w-md">
        <PlayIcon aria-hidden="true" /> I&apos;m ready to play
      </Button>
      <div>
        <button type="button" onClick={() => onReview(0)} className="mt-3 text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
          Review the concepts again
        </button>
      </div>
    </section>
  );
}

function TermCard({ term, definition }: { term: string; definition: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`rounded-xl border p-3 text-left transition ${open ? "border-primary/50 bg-primary/10" : "border-border bg-muted hover:bg-muted"}`}
    >
      <div className="font-semibold text-foreground"><RichText text={term} /></div>
      <div className={`mt-1 text-sm ${open ? "text-foreground" : "text-muted-foreground"}`}>{open ? <RichText text={definition} /> : "Tap to reveal"}</div>
    </button>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "good" | "warn" }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center">
      <div className="text-sm font-semibold text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${tone === "good" ? "text-success-foreground" : tone === "warn" ? "text-warning-foreground" : "text-foreground"}`}>{value}</div>
    </div>
  );
}
