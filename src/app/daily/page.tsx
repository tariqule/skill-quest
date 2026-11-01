"use client";

import { ArrowRight, CheckCircle2, Code2, Eye, RotateCcw, Zap } from "lucide-react";
import { AnswerFeedback } from "@/components/feedback/AnswerFeedback";
import { ChoiceOption, optionState } from "@/components/feedback/ChoiceOption";
import { Button } from "@/components/ui/button";
import { indexCourse } from "@/engine/indexes";
import { NextSteps, PageIntro, PageSkeleton } from "@/components/shell/PageIntro";
import { ScenarioPlay } from "@/components/scenarios/ScenarioPlay";
import { gradeFor } from "@/engine/scenarios";
import { useState, useSyncExternalStore } from "react";
import { AppBar } from "@/components/Hud";
import { CodeBlock, RichText } from "@/components/learn/code";
import { usePlan } from "@/engine/plan-store";
import { reviewNote, type ReviewGrade } from "@/engine/srs";
import { getSrs, gradeItem } from "@/engine/srs-store";
import { buildQueue } from "@/engine/daily-queue";
import { completeScenario, makeOnce } from "@/engine/scenario-progress";
import { getCourseStore } from "@/engine/store";
import { useHoldToasts } from "@/engine/ui-state";
import { GameItem } from "@/components/code-games/GameItem";
import { CodeReview } from "@/components/coding/CodeReview";
import { isChoice, type Card, type ChoiceQuestion, type Course } from "@/engine/types";

const noop = () => () => {};

export default function DailyReview() {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  return (
    <>
      <AppBar />
      <main className="mx-auto w-full max-w-page px-4 py-6 text-base sm:py-10">
        <PageIntro icon={RotateCcw} title="Quick refresher">
          Questions you missed, a few new ones, flashcards and coding exercises from all your courses, mixed together. Each comes back just before you&apos;d forget it.
        </PageIntro>
        {mounted ? <Session /> : <PageSkeleton />}
      </main>
    </>
  );
}

function Session() {
  const plan = usePlan();
  const [queue] = useState(() => buildQueue(plan));
  const [i, setI] = useState(0);
  const [right, setRight] = useState(0);
  const [once] = useState(makeOnce);
  // Badge toasts wait for the finish screen instead of popping up mid-review.
  useHoldToasts(i < queue.length);

  if (queue.length === 0) {
    return (
      <NextSteps
        icon={CheckCircle2}
        title="Nothing due right now"
        line="A refresher asks about things you've already learned, right before they fade. Learn something new today and it will show up here when it's time."
        primary={{ href: "/", label: "Go to today's plan", icon: ArrowRight }}
        more={[
          { href: "/warmup", label: "Daily code warm-up", icon: Zap, line: "Six quick code games, about 5 minutes." },
          { href: "/code", label: "Browse code tracks", icon: Code2, line: "Pick a language or interview topic." },
        ]}
      />
    );
  }
  if (i >= queue.length) {
    return (
      <NextSteps
        icon={CheckCircle2}
        title="Review done. Nice steady work."
        line={`${queue.length} items reviewed, ${right} remembered. Each one is scheduled to come back right before it fades.`}
        primary={{ href: "/", label: "Back to today's plan", icon: ArrowRight }}
        more={[{ href: "/warmup", label: "Daily code warm-up", icon: Zap, line: "Six quick code games, about 5 minutes." }]}
      />
    );
  }

  const item = queue[i];
  const note = (ok: boolean) => reviewNote(getSrs()[item.key], ok ? "good" : "again", new Date());
  const record = (grade: ReviewGrade) => {
    gradeItem(item.key, grade);
    if (grade !== "again") setRight((n) => n + 1);
  };
  const next = (grade: ReviewGrade) => {
    record(grade);
    setI((n) => n + 1);
  };

  return (
    <div className="mt-6 max-w-3xl">
      <div className="mb-2 flex items-center justify-between text-sm text-foreground/80">
        <span>
          {i + 1} / {queue.length}
        </span>
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <span className="size-2.5 rounded-full" style={{ background: item.course.provider.color }} aria-hidden />
          {item.course.shortTitle}
        </span>
      </div>
      <div className="mb-4 h-1.5 rounded-full bg-muted">
        <div className="h-full rounded-full bg-success transition-[width] duration-200 motion-reduce:transition-none" style={{ width: `${(i / queue.length) * 100}%` }} />
      </div>
      {item.kind === "card" ? <CardItem key={item.key} card={item.card} onGrade={next} /> : item.kind === "sc" ? (
          <ScenarioPlay key={item.key} courseId={item.course.id} item={item.sc} onResult={(share) =>
              once(item.key, () => {
                completeScenario(getCourseStore(item.course), item.course.config.xp.scenarioComplete, item.course.id, item.sc.id, share);
                record(gradeFor(share));
              })
            }
            onDone={() => setI((n) => n + 1)}
          />
        ) : item.kind === "code" ? (
          <CodeReview key={item.key} course={item.course} c={item.code} onDone={next} />
        ) : isChoice(item.q) ? (
          <QuestionItem key={item.key} course={item.course} q={item.q} fresh={item.fresh} note={note} onGrade={next} />
        ) : (
          <GameItem key={item.key} course={item.course} q={item.q} tag={item.fresh ? "new for you" : "you missed this before"} note={note} onDone={(ok) => next(ok ? "good" : "again")} />
        )}
    </div>
  );
}

const GRADES: { id: ReviewGrade; label: string; hint: string }[] = [
  { id: "again", label: "Again", hint: "forgot it" },
  { id: "hard", label: "Hard", hint: "with effort" },
  { id: "good", label: "Good", hint: "recalled it" },
  { id: "easy", label: "Easy", hint: "instant" },
];

const CARD = "rounded-card border border-border bg-card p-5 sm:p-7";
const EYEBROW = "text-sm font-medium text-foreground/80";

function CardItem({ card, onGrade }: { card: Card; onGrade: (g: ReviewGrade) => void }) {
  const [shown, setShown] = useState(false);
  return (
    <div className={CARD}>
      <div className={EYEBROW}>Flashcard · what is it?</div>
      <div className="mt-2 font-heading text-h3 font-semibold text-foreground">{card.term}</div>
      {shown ? (
        <>
          <p className="mt-4 max-w-[680px] text-body leading-relaxed text-foreground">
            <RichText text={card.definition} />
          </p>
          <p className="mt-6 text-base font-medium text-foreground" id="grade-q">How well did you remember it?</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-labelledby="grade-q">
            {GRADES.map((g) => (
              <Button key={g.id} type="button" variant={g.id === "good" ? "default" : "outline"} onClick={() => onGrade(g.id)} className="h-auto min-h-14 flex-col gap-0 py-2 sm:h-auto">
                <span className="text-base font-semibold">{g.label}</span>
                <span className="text-sm font-normal">{g.hint}</span>
              </Button>
            ))}
          </div>
        </>
      ) : (
        <Button type="button" size="xl" onClick={() => setShown(true)} className="mt-6 h-12 w-full sm:h-12">
          <Eye aria-hidden />
          Show answer
        </Button>
      )}
    </div>
  );
}

const LETTERS = "ABCDEFGH";

function QuestionItem({ course, q, fresh, note, onGrade }: { course: Course; q: ChoiceQuestion; fresh?: boolean; note: (ok: boolean) => string; onGrade: (g: ReviewGrade) => void }) {
  const multi = q.answer.length > 1;
  const [picked, setPicked] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const correct = done && picked.length === q.answer.length && q.answer.every((a) => picked.includes(a));
  const lesson = indexCourse(course).lessonForQuestion[q.id];

  function submit(sel: number[]) {
    setPicked(sel);
    setDone(true);
    const ok = sel.length === q.answer.length && q.answer.every((a) => sel.includes(a));
    getCourseStore(course).recordAnswer(q.id, ok);
  }

  return (
    <div className={CARD}>
      <div className={EYEBROW}>
        {multi ? `Choose ${q.answer.length}` : "Question"} · {fresh ? "new for you" : "you missed this before"}
      </div>
      <h2 data-reading className="mt-2 max-w-[680px] text-lg font-semibold leading-snug text-foreground sm:text-xl">
        <RichText text={q.prompt} />
      </h2>
      {q.code && (
        <div className="mt-3">
          <CodeBlock code={q.code} lang={q.codeLang} />
        </div>
      )}
      <ul className="mt-4 grid gap-2">
        {q.options.map((o, idx) => {
          const sel = picked.includes(idx);
          return (
            <li key={idx}>
              <ChoiceOption
                letter={LETTERS[idx]}
                state={optionState({ picked: sel, right: q.answer.includes(idx), locked: done, reveal: done })}
                disabled={done}
                pressed={multi ? sel : undefined}
                onClick={() => (multi ? setPicked((p) => (p.includes(idx) ? p.filter((x) => x !== idx) : [...p, idx])) : submit([idx]))}
              >
                <RichText text={o} />
              </ChoiceOption>
            </li>
          );
        })}
      </ul>
      {multi && !done && (
        <Button type="button" size="xl" disabled={picked.length !== q.answer.length} onClick={() => submit(picked)} className="mt-3 h-12 w-full sm:h-12">
          Check
        </Button>
      )}
      {done && (
        <>
          <AnswerFeedback ok={correct} note={note(correct)} concept={lesson ? { title: lesson.title, href: `/c/${course.id}/lesson/${lesson.id}` } : undefined} className="mt-4">
            <RichText text={q.explanation} />
          </AnswerFeedback>
          <Button type="button" size="xl" onClick={() => onGrade(correct ? "good" : "again")} className="mt-4 h-12 w-full sm:h-12">
            Next
            <ArrowRight aria-hidden />
          </Button>
        </>
      )}
    </div>
  );
}
