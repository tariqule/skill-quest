"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { ChallengeCard } from "@/components/ChallengeCard";
import { MascotSays } from "@/components/fx";
import { QuestionCard } from "@/components/QuestionCard";
import { Bar } from "@/components/ui";
import { useCourse, useProgress } from "@/engine/course-context";
import { answerText, deck, isCorrect, pct, pickedText, shuffle, type PreparedQuestion } from "@/engine/game";
import type { Challenge, Lesson } from "@/engine/types";

/** setup → study (timed, no questions) → play (questions + hands-on challenges) → report */
type Phase = "setup" | "study" | "play" | "report";

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

  const [phase, setPhase] = useState<Phase>("setup");
  const [minutes, setMinutes] = useState(cfg.defaultMinutes);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [current, setCurrent] = useState(0);
  const [viewed, setViewed] = useState<string[]>([]);
  const [tab, setTab] = useState<"concepts" | "terms">("concepts");
  const [items, setItems] = useState<PlayItem[]>([]);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState<number[] | null>(null);
  const [log, setLog] = useState<QuestionLog[]>([]);
  const [challengeLog, setChallengeLog] = useState<{ c: Challenge; solved: boolean }[]>([]);

  const target = minutes * 60;
  const timeUp = minutes > 0 && elapsed >= target;
  const questionCount = Math.min(cfg.playQuestions, course.questions.filter((q) => q.domain === domain.id).length);

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

  function startPlay() {
    store.recordStudy(domain.id, Math.floor(elapsed / 60));
    const qs = deck(
      course.questions.filter((q) => q.domain === domain.id),
      questionCount,
    );
    const cs = shuffle(challenges);
    const built: PlayItem[] = [];
    qs.forEach((q, i) => {
      built.push({ kind: "question", q });
      if ((i + 1) % cfg.challengeEvery === 0 && cs.length) built.push({ kind: "challenge", c: cs.shift()! });
    });
    built.push(...cs.map((c) => ({ kind: "challenge" as const, c })));
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
        <Link href={href()} className="text-sm text-slate-400 hover:text-white">
          ← Back to map
        </Link>
        <div className="mt-3 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: domain.color }}>
          {domain.emoji} World {domain.number} · {domain.weight}% of the exam
        </div>
        <h1 className="mt-1 text-3xl font-black text-white">📚 Study: {domain.world}</h1>
        <p className="mt-1 text-slate-400">{domain.name}</p>

        <div className="mt-6">
          <MascotSays>
            Learn first, play second. Take your time with the concepts: no questions until you&apos;re ready. Then we&apos;ll play with what you learned.
          </MascotSays>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { icon: "📖", t: "1. Study", d: `${lessons.length} concepts with visuals and labs. No questions.` },
            { icon: "🎮", t: "2. Play", d: `${questionCount} questions + ${challenges.length} hands-on challenge${challenges.length === 1 ? "" : "s"}, with full feedback.` },
            { icon: "📊", t: "3. Results", d: "Every answer, every concept, and what to study next." },
          ].map((s) => (
            <div key={s.t} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <div className="text-2xl">{s.icon}</div>
              <div className="mt-1 font-black text-white">{s.t}</div>
              <div className="text-sm text-slate-400">{s.d}</div>
            </div>
          ))}
        </div>

        <h2 className="mt-8 font-bold text-white">How long do you want to study?</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {cfg.minuteOptions.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMinutes(m)}
              className={`btn-3d rounded-2xl border-2 px-4 py-3 font-black ${minutes === m ? "border-sky-400 bg-sky-400/20 text-white" : "border-white/10 bg-slate-900/70 text-slate-300"}`}
              style={{ "--edge": minutes === m ? "#0369a1" : "#020617" } as CSSProperties}
            >
              {m === 0 ? "♾️ No timer" : `⏱️ ${m} min`}
            </button>
          ))}
        </div>
        {(progress.studyMinutes[domain.id] ?? 0) > 0 && (
          <p className="mt-3 text-sm text-slate-400">You&apos;ve studied this world for {progress.studyMinutes[domain.id]} minutes so far.</p>
        )}

        <button
          type="button"
          onClick={startStudy}
          className="btn-3d mt-8 w-full rounded-2xl bg-sky-400 py-4 text-lg font-black uppercase tracking-wide text-slate-950"
          style={{ "--edge": "#0369a1" } as CSSProperties}
        >
          📚 Start studying
        </button>
      </main>
    );
  }

  // ───────────── Study ─────────────
  if (phase === "study") {
    const lesson = lessons[current];
    const cards = course.cards.filter((c) => c.domain === domain.id);
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-4">
        <div className="sticky z-10 -mx-4 border-b border-white/10 bg-slate-950/90 px-4 py-2 backdrop-blur" style={{ top: "calc(env(safe-area-inset-top, 0px) + 3.2rem)" }}>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-black text-white">📚 {domain.world}</span>
            <span className={`font-mono text-lg ${timeUp ? "text-amber-300" : "text-slate-100"}`}>
              {minutes > 0 ? `⏱️ ${mm(Math.max(0, target - elapsed))}` : `⏱️ ${mm(elapsed)}`}
            </span>
            <button type="button" onClick={() => setPaused(!paused)} className="rounded-lg border border-white/15 px-2.5 py-1 text-slate-200">
              {paused ? "▶ Resume" : "⏸ Pause"}
            </button>
            <span className="text-slate-400">
              {viewed.length}/{lessons.length} concepts
            </span>
            <button
              type="button"
              onClick={startPlay}
              className="btn-3d ml-auto rounded-xl bg-emerald-400 px-4 py-2 font-black text-slate-950"
              style={{ "--edge": "#047857" } as CSSProperties}
            >
              I&apos;m ready to play →
            </button>
          </div>
          {minutes > 0 && <Bar value={Math.min(1, elapsed / target)} color={timeUp ? "#f59e0b" : domain.color} className="mt-2 h-1" />}
        </div>

        {timeUp && (
          <div className="pop-in mt-4 flex flex-wrap items-center gap-3 rounded-2xl border-2 border-amber-400/60 bg-amber-400/10 p-4">
            <span className="text-3xl">⏰</span>
            <div className="min-w-0 flex-1">
              <div className="font-black text-white">Study time&apos;s up!</div>
              <div className="text-sm text-slate-300">
                You covered {viewed.length} of {lessons.length} concepts. Ready to play with what you learned?
              </div>
            </div>
            <button type="button" onClick={() => setMinutes(minutes + 5)} className="rounded-xl border border-white/20 px-4 py-2 font-semibold text-slate-100">
              +5 min
            </button>
            <button
              type="button"
              onClick={startPlay}
              className="btn-3d rounded-xl bg-amber-400 px-5 py-2 font-black text-slate-950"
              style={{ "--edge": "#b45309" } as CSSProperties}
            >
              Start playing →
            </button>
          </div>
        )}

        <div className="mt-4 grid gap-5 lg:grid-cols-[15rem_1fr]">
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="mb-2 flex gap-1.5">
              {(["concepts", "terms"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${tab === t ? "border-sky-400 bg-sky-400/20 text-white" : "border-white/10 text-slate-400"}`}
                >
                  {t === "concepts" ? "📖 Concepts" : "🃏 Key terms"}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 lg:grid lg:overflow-visible">
              {lessons.map((l, i) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    setTab("concepts");
                    view(i);
                  }}
                  className={`shrink-0 rounded-xl border px-3 py-2 text-left text-xs transition lg:text-sm ${i === current && tab === "concepts" ? "border-sky-400 bg-sky-400/15 text-white" : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10"}`}
                >
                  <span className={viewed.includes(l.id) ? "text-emerald-300" : "text-slate-500"}>{viewed.includes(l.id) ? "✓" : "○"}</span> {l.title}
                </button>
              ))}
            </div>
          </aside>

          {tab === "concepts" ? (
            <ConceptView
              key={lesson.id}
              lesson={lesson}
              index={current}
              total={lessons.length}
              color={domain.color}
              onPrev={current > 0 ? () => view(current - 1) : undefined}
              onNext={current + 1 < lessons.length ? () => view(current + 1) : undefined}
              onDone={startPlay}
            />
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {cards.map((c) => (
                <TermCard key={c.id} term={c.term} definition={c.definition} />
              ))}
            </div>
          )}
        </div>
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
          <span className="font-black text-white">🎮 Play</span>
          <div className="flex-1">
            <div className="mb-1 flex justify-between text-xs text-slate-400">
              <span>
                Step {step + 1} of {items.length}
              </span>
              <span>
                ✓ {log.filter((l) => l.correct).length} · 🎯 {challengeLog.filter((c) => c.solved).length}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
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
                <div className={`rounded-2xl border-2 p-4 ${last.correct ? "border-emerald-400/50 bg-emerald-400/10" : "border-rose-400/50 bg-rose-400/10"}`}>
                  <div className={`text-lg font-black ${last.correct ? "text-emerald-300" : "text-rose-300"}`}>
                    {last.correct ? `✓ Correct! +${course.config.xp.studyCorrect} XP` : "✗ Not quite. Here's the full picture"}
                  </div>
                  <div className="mt-2 grid gap-1 text-sm">
                    <div>
                      <span className="text-slate-400">Your answer: </span>
                      <span className="text-slate-100">{pickedText(item.q, submitted)}</span>
                    </div>
                    {!last.correct && (
                      <div>
                        <span className="text-slate-400">Correct answer: </span>
                        <span className="text-emerald-200">{answerText(item.q)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={next}
                    className="btn-3d rounded-xl bg-sky-400 px-6 py-2.5 font-black text-slate-950"
                    style={{ "--edge": "#0369a1" } as CSSProperties}
                  >
                    {step + 1 >= items.length ? "See my results" : "Next →"}
                  </button>
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
      <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: domain.color }}>
        {domain.emoji} {domain.world}
      </div>
      <h1 className="mt-1 text-3xl font-black text-white">📊 Your study results</h1>

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

      <h2 className="mt-8 text-lg font-black text-white">By concept</h2>
      <div className="mt-3 grid gap-2">
        {lessons.map((l) => {
          const mine = log.filter((x) => lessonForQuestion[x.q.id]?.id === l.id);
          const ok = mine.filter((x) => x.correct).length;
          return (
            <div key={l.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
              <span className={viewed.includes(l.id) ? "text-emerald-300" : "text-slate-500"}>{viewed.includes(l.id) ? "✓ studied" : "○ not opened"}</span>
              <span className="min-w-0 flex-1 text-slate-100">{l.title}</span>
              {mine.length > 0 && (
                <span className={ok === mine.length ? "text-emerald-300" : "text-amber-300"}>
                  {ok}/{mine.length} right
                </span>
              )}
            </div>
          );
        })}
      </div>

      {challengeLog.length > 0 && (
        <>
          <h2 className="mt-8 text-lg font-black text-white">Hands-on challenges</h2>
          <div className="mt-3 grid gap-2">
            {challengeLog.map(({ c, solved: s }) => (
              <div key={c.id} className={`rounded-xl border p-3 text-sm ${s ? "border-emerald-400/40 bg-emerald-400/5" : "border-white/10 bg-white/5"}`}>
                <div className="font-bold text-white">
                  {s ? "✓" : "↷"} {c.title} <span className="font-normal text-slate-400">{s ? "solved" : "skipped"}</span>
                </div>
                <div className="mt-1 text-slate-300">🧠 {c.takeaway}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className="mt-8 text-lg font-black text-white">Every question</h2>
      <div className="mt-3 grid gap-2">
        {log.map((l, i) => (
          <details key={`${l.q.id}-${i}`} className={`rounded-xl border ${l.correct ? "border-white/10 bg-white/5" : "border-rose-400/30 bg-rose-400/5"}`} open={!l.correct}>
            <summary className="cursor-pointer px-3 py-2 text-sm text-slate-100">
              <span className={l.correct ? "text-emerald-300" : "text-rose-300"}>{l.correct ? "✓" : "✗"}</span> {l.q.prompt}
            </summary>
            <div className="grid gap-1 px-3 pb-3 text-sm">
              <div>
                <span className="text-slate-400">Your answer: </span>
                {pickedText(l.q, l.picked)}
              </div>
              <div>
                <span className="text-slate-400">Correct: </span>
                <span className="text-emerald-200">{answerText(l.q)}</span>
              </div>
              <div className="text-slate-400">{l.q.explanation}</div>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={href(`/quest/${domain.id}`)} className="btn-3d rounded-2xl bg-amber-400 px-6 py-3 font-black text-slate-950" style={{ "--edge": "#b45309" } as CSSProperties}>
          ⚔️ Take the world trial
        </Link>
        <button type="button" onClick={() => setPhase("setup")} className="btn-3d rounded-2xl bg-sky-400 px-6 py-3 font-black text-slate-950" style={{ "--edge": "#0369a1" } as CSSProperties}>
          📚 Study again
        </button>
        <Link href={href()} className="rounded-2xl border border-white/15 px-6 py-3 font-bold text-slate-200 hover:bg-white/10">
          Back to map
        </Link>
      </div>
    </main>
  );
}

function ConceptView({
  lesson,
  index,
  total,
  color,
  onPrev,
  onNext,
  onDone,
}: {
  lesson: Lesson;
  index: number;
  total: number;
  color: string;
  onPrev?: () => void;
  onNext?: () => void;
  onDone: () => void;
}) {
  return (
    <article className="card-in min-w-0">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider">
        <span style={{ color }}>
          Concept {index + 1} of {total}
        </span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-slate-300">Exam task {lesson.task}</span>
      </div>
      <h2 className="mt-1 text-2xl font-black text-white">{lesson.title}</h2>
      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-6" style={{ boxShadow: `0 20px 60px -30px ${color}` }}>
        {lesson.visual}
      </div>
      <ul className="mt-4 grid gap-2">
        {lesson.points.map((p, i) => (
          <li key={i} className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-slate-200">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-slate-950" style={{ background: color }}>
              {i + 1}
            </span>
            {p}
          </li>
        ))}
      </ul>
      {lesson.tip && (
        <div className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
          <b>Exam tip:</b> {lesson.tip}
        </div>
      )}
      <div className="mt-5 flex gap-3">
        <button type="button" disabled={!onPrev} onClick={onPrev} className="rounded-xl border border-white/15 px-4 py-2.5 font-semibold text-slate-200 disabled:opacity-30">
          ← Previous
        </button>
        {onNext ? (
          <button type="button" onClick={onNext} className="btn-3d ml-auto rounded-xl bg-sky-400 px-5 py-2.5 font-black text-slate-950" style={{ "--edge": "#0369a1" } as CSSProperties}>
            Next concept →
          </button>
        ) : (
          <button type="button" onClick={onDone} className="btn-3d ml-auto rounded-xl bg-emerald-400 px-5 py-2.5 font-black text-slate-950" style={{ "--edge": "#047857" } as CSSProperties}>
            Done studying: let&apos;s play →
          </button>
        )}
      </div>
    </article>
  );
}

function TermCard({ term, definition }: { term: string; definition: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`rounded-xl border p-3 text-left transition ${open ? "border-sky-400/50 bg-sky-400/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
    >
      <div className="font-bold text-white">{term}</div>
      <div className={`mt-1 text-sm ${open ? "text-slate-200" : "text-slate-500"}`}>{open ? definition : "Tap to reveal"}</div>
    </button>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "good" | "warn" }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-center">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div className={`mt-1 text-2xl font-black ${tone === "good" ? "text-emerald-300" : tone === "warn" ? "text-amber-300" : "text-white"}`}>{value}</div>
    </div>
  );
}
