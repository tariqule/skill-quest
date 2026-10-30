"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Core3D, Mascot, MascotSays, Tilt } from "@/components/fx";
import { LevelPicker } from "@/components/code/ui";
import { courseCopy } from "@/engine/copy";
import { useCourse, useProgress } from "@/engine/course-context";
import { effectiveLevel, hasBeginnerLessons, LEVEL_BY_ID, levelOptions, questionsForLevel, type LevelChoice } from "@/engine/levels";
import { buildPath } from "@/engine/path";
import type { QuestionKind } from "@/engine/types";
import { isCodeTrack } from "@/engine/tracks";

export default function StartPage() {
  const router = useRouter();
  const { course, store, href, allLessons } = useCourse();
  const copy = courseCopy(course);
  const progress = useProgress();
  const levelChoices = levelOptions(course);
  const levelCounts = Object.fromEntries(levelChoices.map((l) => [l.id, questionsForLevel(course, l.id).length])) as Record<LevelChoice, number>;
  const shownLevel = LEVEL_BY_ID[effectiveLevel(course, progress.level)];
  const GOALS = course.config.dailyGoals;
  // The first lesson comes from the same path the map and Home use, so they always agree.
  const beginner = effectiveLevel(course, progress.level) === "beginner" && hasBeginnerLessons(course);
  const now = buildPath(course, progress).current;
  const firstLesson = now?.type === "lesson" ? { id: now.key, title: now.title } : allLessons[0];
  const biggest = course.domains.reduce((a, b) => (b.weight > a.weight ? b : a));
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(GOALS[Math.min(1, GOALS.length - 1)].xp);

  function launch() {
    store.completeOnboarding(goal);
    router.push(href(firstLesson ? `/lesson/${firstLesson.id}` : ""));
  }

  function studyFirst() {
    store.completeOnboarding(goal);
    router.push(href(`/study/${course.domains[0].id}`));
  }

  const allSlides: { title: string; body: ReactNode }[] = [
    {
      title: "Hi! Let's get you started",
      body: (
        <div className="flex flex-col items-center text-center">
          <Core3D size={100} domains={course.domains} icon={course.provider.icon} />
          <div className="mt-2 max-w-lg">
            <MascotSays mood="wow">
              <b>I&apos;m Nimbus, your guide.</b>{" "}
              {course.kind === "interview" ? (
                <>
                  We&apos;ll get you ready for <b>{course.shortTitle}</b> interview questions,
                </>
              ) : course.kind === "learning" ? (
                <>
                  We&apos;ll learn <b>{course.shortTitle}</b> together,
                </>
              ) : (
                <>
                  We&apos;ll get you ready for the <b>{course.title}</b> exam,
                </>
              )}{" "}
              one small idea at a time. First a picture or a little lab, then a couple of questions, then games. Go at your own speed: you can&apos;t break
              anything here.
            </MascotSays>
          </div>
        </div>
      ),
    },
    {
      title: copy.glanceTitle,
      body: (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {course.guide.facts.map((f, i) => (
            <Tilt key={f.label} className="rounded-2xl">
              <div className="pop-in h-full rounded-2xl border border-white/10 bg-slate-900/70 p-4" style={{ animationDelay: `${i * 70}ms` }}>
                <div className="text-3xl">{f.icon}</div>
                <div className="mt-1 text-3xl font-black text-white">{f.value}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-sky-300">{f.label}</div>
                <div className="mt-2 text-xs leading-snug text-slate-400">{f.detail}</div>
              </div>
            </Tilt>
          ))}
        </div>
      ),
    },
    {
      title: copy.forMeTitle,
      body: (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-4">
            <div className="font-bold text-emerald-300">{copy.forMeYes}</div>
            <ul className="mt-3 grid gap-2 text-sm text-slate-200">
              {course.guide.candidate.is.map((x) => (
                <li key={x}>👤 {x}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="font-bold text-slate-300">{copy.forMeNo}</div>
            <ul className="mt-3 grid gap-2 text-sm text-slate-400">
              {course.guide.candidate.isNot.map((x) => (
                <li key={x}>✕ {x}</li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: `${numberWord(course.exam.questionTypes.length)} kinds of questions`,
      body: (
        <div className="grid gap-3 sm:grid-cols-2">
          {course.exam.questionTypes.map((t) => (
            <div key={t.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{t.icon}</span>
                <span className="font-bold text-white">{t.name}</span>
                {t.practiceOnly && <span className="ml-1.5 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-300">practice only</span>}
              </div>
              <div className="mt-1 text-sm text-slate-400">{t.rule}</div>
              <MiniDemo kind={t.id} />
            </div>
          ))}
          <p className="text-sm text-slate-400 sm:col-span-2">
            You&apos;ll practise every type here. A few are just for practice and never show up in the {copy.simulator}.
          </p>
        </div>
      ),
    },
    {
      title: `${numberWord(course.domains.length)} worlds to explore`,
      body: (
        <div>
          <div className="flex h-12 overflow-hidden rounded-2xl border border-white/10">
            {course.domains.map((d) => (
              <div key={d.id} className="flex items-center justify-center text-lg font-black text-slate-950" style={{ width: `${d.weight}%`, background: d.color }} title={d.name}>
                {d.weight}%
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-2">
            {course.domains.map((d, i) => (
              <div key={d.id} className="pop-in flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 p-3" style={{ animationDelay: `${i * 80}ms` }}>
                <span className="text-2xl">{d.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-white">
                    World {d.number}: {d.world}
                  </div>
                  <div className="text-xs text-slate-400">{d.name}</div>
                </div>
                <span className="text-sm font-black" style={{ color: d.color }}>
                  {d.weight}%
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-400">
            World {biggest.number} counts the most toward your score ({biggest.weight}%), so it&apos;s worth extra practice.
          </p>
        </div>
      ),
    },
    {
      title: "How it works",
      body: (
        <div>
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              { icon: "📖", t: "Learn", d: "Each lesson explains one idea with a picture or a little lab you can play with." },
              { icon: "✅", t: "Check", d: "A couple of quick questions. Anything you miss comes back later until it sticks." },
              {
                icon: "⚔️",
                t: "Trial",
                d: `A short test for the whole world: ${course.config.quest.length} questions and ${progress.level === "beginner" ? course.config.quest.beginnerHearts : course.config.quest.hearts} hearts. Pass it to open the next world.`,
              },
              { icon: copy.gateIcon, t: copy.gateStep, d: `A full practice ${copy.noun}. Score ${course.exam.scale.pass} or more and you're ready for the real one.` },
            ].map((s, i) => (
              <div key={s.t} className="relative rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <div className="text-3xl">{s.icon}</div>
                <div className="mt-1 font-black text-white">
                  {i + 1}. {s.t}
                </div>
                <div className="mt-1 text-sm text-slate-400">{s.d}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {[
              ["⭐", "XP and levels"],
              ["🔥", "Daily streak"],
              ["❤️", "Hearts in trials"],
              ["🏅", "Badges"],
              ["📖", "Guide button: open it anytime"],
            ].map(([i, t]) => (
              <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200">
                {i} {t}
              </span>
            ))}
          </div>
        </div>
      ),
    },
      {
        title: "How much do you know?",
        body: (
          <div>
            <p className="mb-4 text-slate-300">
              {isCodeTrack(course)
                ? course.kind === "learning"
                  ? "New to this? Pick Beginner and we'll start from zero."
                  : "Pick the level you're interviewing for, or Beginner if this is all new."
                : "Never studied this before? Pick Beginner and we'll start with the basics."}{" "}
              Lessons, practice and the {copy.simulator} follow your choice. You can change it any time from the map.
            </p>
            <LevelPicker value={shownLevel.id} onChange={(l) => store.setLevel(l)} counts={levelCounts} options={levelChoices} />
            <p className="mt-3 text-sm" style={{ color: shownLevel.color }}>
              {shownLevel.icon} {shownLevel.name}: {shownLevel.blurb}
            </p>
          </div>
        ),
      },

    {
      title: beginner ? "Ready for your first lesson?" : "Pick your pace",
      body: (
        <div>
          <div className={`grid grid-cols-2 gap-3 sm:grid-cols-4 ${beginner ? "hidden" : ""}`}>
            {GOALS.map((g) => (
              <button
                key={g.xp}
                type="button"
                onClick={() => setGoal(g.xp)}
                className={`btn-3d rounded-2xl border-2 p-4 text-left ${goal === g.xp ? "border-sky-400 bg-sky-400/15" : "border-white/10 bg-slate-900/70"}`}
                style={{ "--edge": goal === g.xp ? "#0369a1" : "#020617" } as CSSProperties}
              >
                <div className="text-3xl">{g.icon}</div>
                <div className="mt-1 font-black text-white">{g.name.replace(/\bExam\b/, copy.noun[0].toUpperCase() + copy.noun.slice(1))}</div>
                <div className="text-xs text-slate-400">
                  {g.xp} XP · {g.note}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-4">
            <Mascot mood="happy" />
            <div className="text-slate-200">
              {beginner ? (
                <>
                  Your first lesson is <b className="text-white">&quot;{firstLesson?.title}&quot;</b>. You read a little, then answer two easy questions. It takes about 5 minutes.
                </>
              ) : (
                <>
                  Your first lesson: <b className="text-white">&quot;{firstLesson?.title}&quot;</b>. It takes about 3 minutes. Rather read a whole world before any
                  questions? Pick <b className="text-violet-200">Study first</b>.
                </>
              )}
            </div>
          </div>
        </div>
      ),
    },
  ];

  // A beginner gets just two short slides: a welcome, then straight to lesson 1.
  const slides = beginner ? [allSlides[0], allSlides[allSlides.length - 1]] : allSlides;
  const last = step === slides.length - 1;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setStep((s) => Math.min(slides.length - 1, s + 1));
      if (e.key === "ArrowLeft") setStep((s) => Math.max(0, s - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length]);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to step ${i + 1}`}
              onClick={() => setStep(i)}
              className={`h-2 flex-1 rounded-full transition ${i <= step ? "bg-sky-400" : "bg-white/10"}`}
            />
          ))}
        </div>
        <Link
          href={href()}
          onClick={() => store.completeOnboarding()}
          className="text-sm text-slate-400 hover:text-white"
        >
          Skip intro
        </Link>
      </div>

      <div key={step} className="card-in mt-8 flex-1">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
          Briefing {step + 1} of {slides.length}
        </div>
        <h1 className="mt-1 text-3xl sm:text-4xl font-black text-white">{slides[step].title}</h1>
        <div className="mt-6">{slides[step].body}</div>
      </div>

      <div className="sticky bottom-0 -mx-4 mt-8 flex gap-3 border-t border-white/10 bg-slate-950/90 px-4 py-4 backdrop-blur">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="btn-3d rounded-2xl bg-slate-800 px-5 py-3 font-bold text-slate-100"
            style={{ "--edge": "#020617" } as CSSProperties}
          >
            ←
          </button>
        )}
        {last && !beginner && (
          <button
            type="button"
            onClick={studyFirst}
            className="btn-3d rounded-2xl bg-violet-400 px-5 py-3 font-black text-slate-950"
            style={{ "--edge": "#6d28d9" } as CSSProperties}
          >
            📚 Study first
          </button>
        )}
        <button
          type="button"
          onClick={() => (last ? launch() : setStep(step + 1))}
          className="btn-3d flex-1 rounded-2xl bg-sky-400 py-3 text-lg font-black uppercase tracking-wide text-slate-950"
          style={{ "--edge": "#0369a1" } as CSSProperties}
        >
          {last ? (beginner ? "▶ Start lesson 1" : "▶ Start my first lesson") : step === 0 ? "Let's go" : "Next"}
        </button>
      </div>
    </main>
  );
}

/** Content-free sketches of each question type, so they suit any course. */
function MiniDemo({ kind }: { kind: QuestionKind }) {
  const box = "mt-3 rounded-xl bg-slate-950/70 p-2 text-xs text-slate-300";
  const bar = (w: string, on = false) => <span className={`block h-2 rounded ${on ? "bg-emerald-400/60" : "bg-white/15"}`} style={{ width: w }} />;
  if (kind === "choice")
    return (
      <div className={`${box} grid grid-cols-2 gap-1`}>
        {["A", "B", "C", "D"].map((o) => (
          <span key={o} className={`flex items-center gap-2 rounded px-2 py-1.5 ${o === "B" ? "bg-emerald-400/20" : "bg-white/5"}`}>
            <b>{o}</b>
            {bar("70%", o === "B")}
          </span>
        ))}
      </div>
    );
  if (kind === "multi")
    return (
      <div className={`${box} grid gap-1`}>
        {[true, false, true, false, false].map((on, i) => (
          <span key={i} className={`flex items-center gap-2 rounded px-2 py-1 ${on ? "bg-emerald-400/20" : "bg-white/5"}`}>
            {on ? "☑" : "☐"}
            {bar(`${50 + i * 8}%`, on)}
          </span>
        ))}
      </div>
    );
  if (kind === "lines")
    return (
      <div className={`${box} font-mono`}>
        {["for (let i = 0; i <= n; i++) {", "  total += arr[i];", "}"].map((l, i) => (
          <span key={i} className={`block rounded px-2 py-0.5 ${i === 0 ? "bg-rose-400/25 text-rose-100" : "text-slate-300"}`}>
            <span className="mr-2 text-slate-500">{i + 1}</span>
            {l}
          </span>
        ))}
      </div>
    );
  if (kind === "order")
    return (
      <div className={`${box} flex flex-wrap gap-1`}>
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className="flex items-center gap-1.5 rounded bg-sky-400/15 px-2 py-1 text-sky-100">
            <b>{n}</b>
            {bar("2.5rem")}
          </span>
        ))}
      </div>
    );
  return (
    <div className={`${box} grid gap-1`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="flex items-center justify-between gap-2 rounded bg-white/5 px-2 py-1">
          {bar("35%")}
          <span className="text-violet-200">↔</span>
          {bar("35%")}
        </span>
      ))}
    </div>
  );
}

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

function numberWord(n: number) {
  return NUMBER_WORDS[n] ?? String(n);
}
