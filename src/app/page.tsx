"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { Core3D, Tilt } from "@/components/fx";
import { AppBar } from "@/components/Hud";
import { LifecycleBadges } from "@/components/Lifecycle";
import { Galaxy3D } from "@/components/three";
import { Bar } from "@/components/ui";
import { COURSES } from "@/courses";
import { overallReadiness } from "@/engine/game";
import { indexCourse } from "@/engine/indexes";
import { effectiveLevel, LEVEL_BY_ID, questionsForLevel, type LevelChoice } from "@/engine/levels";
import { setProfile, useProfile, type Goal } from "@/engine/profile";
import { getCourseStore } from "@/engine/store";
import { setSharedLevel } from "@/engine/track-level";
import { isCodeTrack } from "@/engine/tracks";
import type { Course } from "@/engine/types";

const CERTS = COURSES.filter((c) => !isCodeTrack(c));
const LEARN = COURSES.filter((c) => c.kind === "learning");
const INTERVIEW = COURSES.filter((c) => c.kind === "interview");
const BY_ID = Object.fromEntries(COURSES.map((c) => [c.id, c]));

interface GoalInfo {
  id: Goal;
  icon: string;
  title: string;
  line: string;
  example: string;
  courses: Course[];
}

const GOALS: GoalInfo[] = [
  {
    id: "cert",
    icon: "🎓",
    title: "Get certified",
    line: "Pass a cloud or AI certification exam.",
    example: "AWS, Google Cloud, Azure, Kubernetes",
    courses: CERTS,
  },
  {
    id: "code",
    icon: "💻",
    title: "Learn to code",
    line: "Learn a language or tool, starting from zero if you like.",
    example: "HTML & CSS, SQL, Git, Docker, JavaScript, Python",
    // Learning tracks first, then the language tracks a newcomer would pick up next.
    courses: [...LEARN, ...INTERVIEW.filter((c) => c.category === "languages" || c.category === "frontend")],
  },
  {
    id: "interview",
    icon: "🎤",
    title: "Prepare for a coding interview",
    line: "Practise the questions interviewers really ask, at your level.",
    example: "Data structures, algorithms, React, system design",
    courses: INTERVIEW,
  },
];

interface LevelCard {
  id: LevelChoice;
  title: string;
  line: string;
}

const CERT_LEVELS: LevelCard[] = [
  { id: "beginner", title: "I'm brand new", line: "Never touched the cloud or AI? We start with what it is and why people use it." },
  { id: "exam", title: "I know the basics", line: "You've used it a bit and want to get ready for the real exam." },
];

const CODE_LEVELS: LevelCard[] = [
  { id: "beginner", title: "Beginner", line: "Never written code, or never used this tool. We start from zero." },
  { id: "junior", title: "Junior", line: "You can write small things and want to get solid." },
  { id: "intermediate", title: "Intermediate", line: "You use it at work or in projects most days." },
  { id: "senior", title: "Senior", line: "You know how it works inside and want the tricky parts." },
  { id: "staff", title: "Staff", line: "You lead the big decisions and want design-level practice." },
];

/** The first course to suggest for a goal and level. */
function startHere(goal: Goal, level: LevelChoice): Course | undefined {
  const pick = (id: string) => BY_ID[id];
  if (goal === "cert") return pick(level === "beginner" ? "aws-clf-c02" : "aws-aif-c01") ?? CERTS[0];
  if (goal === "code") return pick(level === "beginner" ? "code-html-css" : "code-javascript") ?? LEARN[0];
  if (level === "senior" || level === "staff") return pick("code-system-design") ?? INTERVIEW[0];
  return pick(level === "beginner" ? "code-javascript" : "code-data-structures") ?? INTERVIEW[0];
}

const noop = () => () => {};

export default function Home() {
  const router = useRouter();
  const profile = useProfile();
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const [goalOverride, setGoalOverride] = useState<Goal | null>(null);
  const goal = goalOverride ?? profile.goal;
  const info = GOALS.find((g) => g.id === goal) ?? null;
  const levels = goal === "cert" ? CERT_LEVELS : CODE_LEVELS;
  const level = info && profile.level ? (goal === "cert" ? effectiveLevel(CERTS[0], profile.level) : profile.level === "exam" ? "junior" : profile.level) : null;
  const stepLevel = useRef<HTMLDivElement>(null);
  const stepPicks = useRef<HTMLDivElement>(null);
  const recent = mounted ? recentCourse() : null;

  function chooseGoal(g: Goal) {
    setGoalOverride(g);
    setProfile({ goal: g });
    requestAnimationFrame(() => stepLevel.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function chooseLevel(l: LevelChoice) {
    if (!info) return;
    setProfile({ level: l });
    // Every course for this goal starts at the chosen level (each one can still be changed on its map).
    setSharedLevel(info.courses, l);
    requestAnimationFrame(() => stepPicks.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <>
      <AppBar />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
        <section className="grid items-center gap-6 md:grid-cols-[1fr_1fr]">
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">Learn tech by playing</div>
            <h1 className="mt-2 text-4xl font-black leading-tight text-white sm:text-5xl">Start at your level. Learn by doing.</h1>
            <p className="mt-3 max-w-xl text-lg text-slate-300">
              Short lessons with pictures, hands-on labs and little games. Start from zero, or jump in where you already are. Tell us two things and
              we&apos;ll set it up for you.
            </p>
            <a href="#goal" className="mt-5 inline-block rounded-2xl bg-sky-400 px-6 py-3 font-black text-slate-950 md:hidden">
              Let&apos;s go ↓
            </a>
          </div>
          <div className="min-w-0">
            <Galaxy3D
              items={COURSES.map((c) => ({ id: c.id, label: c.shortTitle, icon: c.provider.icon, color: c.provider.color }))}
              onSelect={(id) => router.push(`/c/${id}`)}
              coreColor="#38bdf8"
              className="h-56 w-full sm:h-80"
              fallback={
                <div className="hidden justify-center md:flex">
                  <Core3D size={100} domains={COURSES[0]?.domains} icon="🎓" />
                </div>
              }
            />
            <p className="text-center text-xs text-slate-500">Every planet is a course. Tap one to peek inside.</p>
          </div>
        </section>

        {recent && <ContinueCard course={recent} />}

        <Step n={1} id="goal" title="What do you want to do?">
          <div className="grid gap-3 sm:grid-cols-3">
            {GOALS.map((g) => (
              <Choice key={g.id} active={goal === g.id} onClick={() => chooseGoal(g.id)} color="#38bdf8">
                <div className="text-4xl">{g.icon}</div>
                <div className="mt-2 text-lg font-black text-white">{g.title}</div>
                <p className="mt-1 text-sm text-slate-300">{g.line}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {g.courses.length} courses · {g.example}
                </p>
              </Choice>
            ))}
          </div>
        </Step>

        {info && (
          <div ref={stepLevel} className="scroll-mt-20">
            <Step n={2} title="How much do you know already?">
              <div className={`grid gap-3 ${goal === "cert" ? "sm:grid-cols-2" : "sm:grid-cols-3 lg:grid-cols-5"}`}>
                {levels.map((l) => {
                  const meta = LEVEL_BY_ID[l.id];
                  return (
                    <Choice key={l.id} active={level === l.id} onClick={() => chooseLevel(l.id)} color={meta.color}>
                      <div className="text-3xl">{meta.icon}</div>
                      <div className="mt-2 font-black text-white">{l.title}</div>
                      <p className="mt-1 text-sm text-slate-300">{l.line}</p>
                    </Choice>
                  );
                })}
              </div>
              <p className="mt-3 text-sm text-slate-500">Not sure? Pick Beginner. When you finish the basics we&apos;ll offer the next level.</p>
            </Step>
          </div>
        )}

        {info && level && (
          <div ref={stepPicks} className="scroll-mt-20">
            <Step n={3} title="Your picks">
              <Picks goal={info} level={level} />
            </Step>
          </div>
        )}

        <section className="mt-16 border-t border-white/10 pt-10">
          <h2 className="text-2xl font-black text-white">Browse everything</h2>
          <p className="mt-1 text-sm text-slate-400">Every course works at every level, from complete beginner up.</p>

          <h3 className="mt-6 text-lg font-black text-white">🎓 Certification courses</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CERTS.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-2">
            <h3 className="text-lg font-black text-white">💻 Coding courses</h3>
            <Link href="/code" className="text-sm font-bold text-emerald-300 hover:text-emerald-200">
              Search and filter all {LEARN.length + INTERVIEW.length} →
            </Link>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...LEARN, ...INTERVIEW].map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

function Step({ n, id, title, children }: { n: number; id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-12 scroll-mt-20">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-400 font-black text-slate-950">{n}</span>
        <h2 className="text-2xl font-black text-white">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Choice({ active, onClick, color, children }: { active: boolean; onClick: () => void; color: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative rounded-2xl border-2 p-4 text-left transition hover:-translate-y-0.5 ${active ? "" : "border-white/10 bg-slate-900/60 hover:border-white/25"}`}
      style={active ? { borderColor: color, background: `${color}1f`, boxShadow: `0 0 28px -10px ${color}` } : undefined}
    >
      {active && (
        <span className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-950" style={{ background: color }}>
          ✓ Picked
        </span>
      )}
      {children}
    </button>
  );
}

function Picks({ goal, level }: { goal: GoalInfo; level: LevelChoice }) {
  const first = startHere(goal.id, level);
  const rest = goal.courses.filter((c) => c.id !== first?.id);
  const meta = LEVEL_BY_ID[level];
  return (
    <div>
      {first && (
        <Link
          href={`/c/${first.id}`}
          className="group grid gap-4 rounded-3xl border-2 p-5 transition hover:-translate-y-0.5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-6"
          style={{ borderColor: `${first.provider.color}aa`, background: `linear-gradient(135deg, ${first.provider.color}26, transparent 70%)` }}
        >
          <div className="text-5xl">{first.provider.icon}</div>
          <div className="min-w-0">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">⭐ Start here</div>
            <div className="mt-1 text-2xl font-black text-white">{first.title}</div>
            <p className="mt-1 text-slate-300">{first.tagline}</p>
            <p className="mt-2 text-sm" style={{ color: meta.color }}>
              {meta.icon} {questionsForLevel(first, level).length} questions and all the lessons set up for {meta.name.toLowerCase()} level.
            </p>
          </div>
          <span
            className="btn-3d rounded-2xl px-6 py-3 text-center font-black uppercase tracking-wide text-slate-950"
            style={{ background: first.provider.color, "--edge": "#00000066" } as CSSProperties}
          >
            Start →
          </span>
        </Link>
      )}
      {rest.length > 0 && (
        <>
          <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-slate-400">Or pick another</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** The course the player touched most recently (by streak day, then XP). */
function recentCourse(): Course | null {
  let best: { c: Course; day: string; xp: number } | null = null;
  for (const c of COURSES) {
    const p = getCourseStore(c).get();
    if (p.xp <= 0) continue;
    const day = p.streak.lastDay ?? "";
    if (!best || day > best.day || (day === best.day && p.xp > best.xp)) best = { c, day, xp: p.xp };
  }
  return best?.c ?? null;
}

function ContinueCard({ course }: { course: Course }) {
  const p = getCourseStore(course).useProgress();
  const readiness = Math.round(overallReadiness(course, p));
  const lvl = LEVEL_BY_ID[effectiveLevel(course, p.level)];
  return (
    <Link
      href={`/c/${course.id}`}
      className="mt-10 grid gap-3 rounded-3xl border-2 border-emerald-400/40 bg-emerald-400/[0.07] p-5 transition hover:-translate-y-0.5 sm:grid-cols-[auto_1fr_auto] sm:items-center"
    >
      <div className="text-4xl">{course.provider.icon}</div>
      <div className="min-w-0">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Continue where you left off</div>
        <div className="mt-1 text-xl font-black text-white">{course.title}</div>
        <div className="mt-2 flex items-center gap-3 text-sm text-slate-300">
          <span style={{ color: lvl.color }}>
            {lvl.icon} {lvl.name}
          </span>
          <span className="w-32">
            <Bar value={readiness / 100} color={course.provider.color} className="h-1.5" />
          </span>
          <span>{readiness}% ready</span>
        </div>
      </div>
      <span className="rounded-2xl bg-emerald-400 px-5 py-2.5 text-center font-black text-slate-950">Continue →</span>
    </Link>
  );
}

function CourseCard({ course }: { course: Course }) {
  const p = getCourseStore(course).useProgress();
  const lessons = indexCourse(course).allLessons.length;
  const started = p.xp > 0;
  const readiness = Math.round(overallReadiness(course, p));
  const code = isCodeTrack(course);
  return (
    <Tilt className="rounded-2xl" max={6}>
      <Link
        href={`/c/${course.id}`}
        className="flex h-full flex-col rounded-2xl border-2 p-4 transition hover:-translate-y-0.5"
        style={{ borderColor: `${course.provider.color}55`, background: `linear-gradient(140deg, ${course.provider.color}1c, transparent 65%)` }}
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: course.provider.color }}>
          <span className="text-lg">{course.provider.icon}</span>
          {code ? (course.kind === "learning" ? "Learn from zero" : "Interview prep") : course.provider.name}
          <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-200">{course.code}</span>
        </div>
        <div className="mt-2 text-lg font-black leading-snug text-white">{course.title}</div>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-400">{course.tagline}</p>
        {!code && <LifecycleBadges course={course} />}
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
          <span>{lessons} lessons</span>
          <span>{course.questions.length} questions</span>
          {course.coding?.length ? <span>💻 live coding</span> : null}
        </div>
        {started && (
          <div className="mt-3">
            <Bar value={readiness / 100} color={course.provider.color} className="h-1.5" />
            <div className="mt-1 text-xs text-slate-400">{readiness}% ready</div>
          </div>
        )}
      </Link>
    </Tilt>
  );
}
