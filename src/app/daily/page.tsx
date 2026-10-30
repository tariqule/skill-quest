"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { AppBar } from "@/components/Hud";
import { CodeBlock, RichText } from "@/components/learn/code";
import { getCourse } from "@/courses";
import { usePlan } from "@/engine/plan-store";
import { activeCourseIds } from "@/engine/plan-inputs";
import { targetCourses } from "@/engine/bundles";
import { interleaveDue, itemKey, parseKey, type ReviewGrade } from "@/engine/srs";
import { getSrs, gradeItem, syncFromProgress } from "@/engine/srs-store";
import { getCourseStore } from "@/engine/store";
import { isChoice, type Card, type ChoiceQuestion, type Course } from "@/engine/types";

const SESSION = 30;
const NEW_CARDS = 5;

type Item = { key: string; course: Course } & ({ kind: "card"; card: Card } | { kind: "q"; q: ChoiceQuestion });

const progressOf = (c: Course) => getCourseStore(c).get();
const noop = () => () => {};

/** Build today's queue once: due items interleaved across courses, then a few new cards from the plan. */
function buildQueue(plan: ReturnType<typeof usePlan>): Item[] {
  syncFromProgress();
  const now = new Date();
  const srs = getSrs();
  const active = activeCourseIds(plan, progressOf);
  const resolve = (key: string): Item | null => {
    const k = parseKey(key);
    const course = k && getCourse(k.courseId);
    if (!k || !course) return null;
    if (k.kind === "card") {
      const card = course.cards.find((c) => c.id === k.id);
      return card ? { key, course, kind: "card", card } : null;
    }
    const q = course.questions.find((x) => x.id === k.id);
    return q && isChoice(q) ? { key, course, kind: "q", q } : null;
  };
  const items = interleaveDue(srs, now, active, SESSION * 2)
    .map(resolve)
    .filter((x): x is Item => !!x)
    .slice(0, SESSION);
  // Introduce a few cards the player hasn't seen, from the plan's courses (or the active ones).
  const pool = plan ? targetCourses(plan.target) : active;
  const fresh: Item[] = [];
  for (let i = 0; fresh.length < NEW_CARDS && i < 50; i++) {
    for (const id of pool) {
      const course = getCourse(id);
      const card = course?.cards.find((c) => !srs[itemKey(id, "card", c.id)] && !fresh.some((f) => f.key === itemKey(id, "card", c.id)));
      if (course && card && fresh.length < NEW_CARDS) fresh.push({ key: itemKey(id, "card", card.id), course, kind: "card", card });
    }
    if (fresh.length === 0) break;
  }
  return [...items, ...fresh].slice(0, SESSION + NEW_CARDS);
}

export default function DailyReview() {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  return (
    <>
      <AppBar />
      <main className="mx-auto w-full max-w-2xl px-4 py-6 text-base sm:py-10">
        <Link href="/" className="text-sm font-bold text-sky-300 hover:text-sky-200">
          ← Home
        </Link>
        <h1 className="mt-2 text-3xl font-black text-white">🔁 Daily Review</h1>
        <p className="mt-1 text-base text-slate-300">
          Questions you missed and flashcards from all your courses, mixed together. Each one comes back just before you&apos;d forget it.
        </p>
        {mounted ? <Session /> : <div className="mt-6 h-64 rounded-3xl bg-slate-900/40" aria-hidden />}
      </main>
    </>
  );
}

function Session() {
  const plan = usePlan();
  const [queue] = useState(() => buildQueue(plan));
  const [i, setI] = useState(0);
  const [right, setRight] = useState(0);

  if (queue.length === 0) {
    return (
      <div className="mt-6 rounded-3xl border-2 border-emerald-400/30 bg-slate-900/70 p-6">
        <div className="text-xl font-black text-white">Nothing due right now 🎉</div>
        <p className="mt-1 text-base text-slate-300">Play a lesson or a quiz. Anything you miss and every flashcard you study shows up here when it&apos;s time.</p>
        <Link href="/" className="mt-4 inline-block rounded-2xl bg-sky-400 px-5 py-2.5 font-black text-slate-950">
          Back to today&apos;s plan
        </Link>
      </div>
    );
  }
  if (i >= queue.length) {
    return (
      <div className="mt-6 rounded-3xl border-2 border-emerald-400/30 bg-slate-900/70 p-6">
        <div className="text-xl font-black text-white">Review done ✅</div>
        <p className="mt-1 text-base text-slate-300">
          {queue.length} items reviewed, {right} remembered. They&apos;re scheduled to come back when they&apos;re about to fade.
        </p>
        <Link href="/" className="mt-4 inline-block rounded-2xl bg-sky-400 px-5 py-2.5 font-black text-slate-950">
          Back to today&apos;s plan
        </Link>
      </div>
    );
  }

  const item = queue[i];
  const next = (grade: ReviewGrade) => {
    gradeItem(item.key, grade);
    if (grade !== "again") setRight((n) => n + 1);
    setI((n) => n + 1);
  };

  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
        <span>
          {i + 1} / {queue.length}
        </span>
        <span style={{ color: item.course.provider.color }}>
          {item.course.provider.icon} {item.course.shortTitle}
        </span>
      </div>
      <div className="mb-4 h-1.5 rounded-full bg-white/10">
        <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${(i / queue.length) * 100}%` }} />
      </div>
      {item.kind === "card" ? <CardItem key={item.key} card={item.card} onGrade={next} /> : <QuestionItem key={item.key} course={item.course} q={item.q} onGrade={next} />}
    </div>
  );
}

const GRADES: { id: ReviewGrade; label: string; cls: string }[] = [
  { id: "again", label: "Again", cls: "bg-rose-400" },
  { id: "hard", label: "Hard", cls: "bg-amber-300" },
  { id: "good", label: "Good", cls: "bg-emerald-400" },
  { id: "easy", label: "Easy", cls: "bg-sky-400" },
];

function CardItem({ card, onGrade }: { card: Card; onGrade: (g: ReviewGrade) => void }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 sm:p-7">
      <div className="text-sm font-bold uppercase tracking-wider text-slate-400">Flashcard · what is it?</div>
      <div className="mt-2 text-2xl font-black text-white">{card.term}</div>
      {shown ? (
        <>
          <p className="mt-4 text-lg text-slate-100">
            <RichText text={card.definition} />
          </p>
          <p className="mt-5 text-sm text-slate-300">How well did you remember it?</p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {GRADES.map((g) => (
              <button key={g.id} type="button" onClick={() => onGrade(g.id)} className={`rounded-xl px-2 py-3 text-base font-black text-slate-950 ${g.cls}`}>
                {g.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <button type="button" onClick={() => setShown(true)} className="mt-6 w-full rounded-2xl bg-sky-400 py-3 text-base font-black text-slate-950">
          Show answer
        </button>
      )}
    </div>
  );
}

function QuestionItem({ course, q, onGrade }: { course: Course; q: ChoiceQuestion; onGrade: (g: ReviewGrade) => void }) {
  const multi = q.answer.length > 1;
  const [picked, setPicked] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const correct = done && picked.length === q.answer.length && q.answer.every((a) => picked.includes(a));

  function submit(sel: number[]) {
    setPicked(sel);
    setDone(true);
    const ok = sel.length === q.answer.length && q.answer.every((a) => sel.includes(a));
    getCourseStore(course).recordAnswer(q.id, ok);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 sm:p-7">
      <div className="text-sm font-bold uppercase tracking-wider text-slate-400">{multi ? `Choose ${q.answer.length}` : "Question"} · you missed this before</div>
      <h2 className="mt-2 text-lg font-semibold leading-snug text-white sm:text-xl">
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
          const isAns = q.answer.includes(idx);
          const tone = done ? (isAns ? "border-emerald-400 bg-emerald-400/15" : sel ? "border-rose-400 bg-rose-400/15" : "border-white/10 opacity-70") : sel ? "border-sky-400 bg-sky-400/15" : "border-white/15 hover:border-white/35";
          return (
            <li key={idx}>
              <button
                type="button"
                disabled={done}
                aria-pressed={sel}
                onClick={() => (multi ? setPicked((p) => (p.includes(idx) ? p.filter((x) => x !== idx) : [...p, idx])) : submit([idx]))}
                className={`w-full rounded-2xl border-2 p-3 text-left text-base text-white ${tone}`}
              >
                <RichText text={o} />
              </button>
            </li>
          );
        })}
      </ul>
      {multi && !done && (
        <button type="button" disabled={picked.length !== q.answer.length} onClick={() => submit(picked)} className="mt-3 w-full rounded-2xl bg-sky-400 py-3 text-base font-black text-slate-950 disabled:opacity-40">
          Check
        </button>
      )}
      {done && (
        <div className="mt-4">
          <div className={`text-lg font-black ${correct ? "text-emerald-300" : "text-rose-300"}`}>{correct ? "✅ Got it" : "❌ Not yet. It'll come back soon."}</div>
          <p className="mt-1 text-base text-slate-200">
            <RichText text={q.explanation} />
          </p>
          <button type="button" onClick={() => onGrade(correct ? "good" : "again")} className="mt-4 w-full rounded-2xl bg-emerald-400 py-3 text-base font-black text-slate-950">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
