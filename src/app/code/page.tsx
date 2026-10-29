"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { CodeRain, LevelPicker, TerminalWindow, Typewriter } from "@/components/code/ui";
import { Tilt } from "@/components/fx";
import { Galaxy3D } from "@/components/three";
import { COURSES } from "@/courses";
import { overallReadiness, pct } from "@/engine/game";
import { indexCourse } from "@/engine/indexes";
import { LEVEL_BY_ID, LEVELS, questionsForLevel, type LevelChoice } from "@/engine/levels";
import { getCourseStore, levelInfo } from "@/engine/store";
import { setSharedLevel, useSharedLevel } from "@/engine/track-level";
import { isCodeTrack, matchesQuery, searchText, TRACK_CATEGORIES, TRACK_FOCUSES, type TrackFocus } from "@/engine/tracks";
import type { Course, TrackCategory } from "@/engine/types";

const TRACKS = COURSES.filter(isCodeTrack).map((c) => ({ course: c, text: searchText(c) }));
const TOTAL_QUESTIONS = TRACKS.reduce((n, t) => n + t.course.questions.length, 0);
const CATEGORY_BY_ID = Object.fromEntries(TRACK_CATEGORIES.map((c) => [c.id, c]));
const COURSES_ONLY = TRACKS.map((t) => t.course);
const LEVEL_COUNTS = Object.fromEntries(
  LEVELS.map((l) => [l.id, COURSES_ONLY.reduce((n, c) => n + questionsForLevel(c, l.id).length, 0)]),
) as Record<LevelChoice, number>;

/** The Code Quests hub: every interview and learning track, in a terminal/arcade skin. */
export default function CodeHub() {
  const router = useRouter();
  const search = useRef<HTMLInputElement>(null);
  const [focus, setFocus] = useState<TrackFocus>("all");
  const [category, setCategory] = useState<TrackCategory | "all">("all");
  const [query, setQuery] = useState("");
  const level = useSharedLevel(COURSES_ONLY);

  // "/" jumps to search, like most docs sites.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        search.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const byFocus = (f: TrackFocus) => TRACKS.filter((t) => f === "all" || t.course.kind === f);
  const byQuery = (list: typeof TRACKS) => (query.trim() ? list.filter((t) => matchesQuery(t.text, query)) : list);
  const shown = byQuery(byFocus(focus).filter((t) => category === "all" || t.course.category === category));
  const categories = TRACK_CATEGORIES.filter((c) => TRACKS.some((t) => t.course.category === c.id));
  const filtered = focus !== "all" || category !== "all" || query.trim() !== "";

  const galaxy = useMemo(
    () => shown.map(({ course: c }) => ({ id: c.id, label: c.shortTitle, icon: c.provider.icon, color: c.provider.color })),
    [shown],
  );

  return (
    <div className="code-theme flex min-h-full flex-1 flex-col">
      <CodeRain />
      <header className="sticky top-0 z-20 border-b border-emerald-400/20 bg-[#03070d]/90 font-mono backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 text-sm">
          <span className="font-black text-emerald-300">&lt;/&gt;</span>
          <span className="font-bold text-white">code-quest</span>
          <Link href="/" className="ml-auto text-slate-400 hover:text-white">
            🎓 certifications →
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full min-w-0 max-w-6xl px-4 py-8 sm:py-10">
        <TerminalWindow title="~/code-quest — zsh">
          <div className="grid items-center gap-4 lg:grid-cols-[1fr_1.1fr]">
            <div className="min-w-0">
              <h1 className="glitch text-4xl font-black text-white sm:text-5xl">Code Quests</h1>
              <p className="mt-2 max-w-xl text-slate-300">
                Learn a skill from scratch or prep for the interview. Every concept comes with code you can poke at, labs that react as you play, bug hunts,
                and a timed challenge at your level.
              </p>
              <div className="mt-4">
                <Typewriter
                  lines={[
                    `$ code-quest --list`,
                    `${TRACKS.length} tracks · ${TOTAL_QUESTIONS} questions · 4 skill levels`,
                    `$ code-quest --levels`,
                    LEVELS.map((l) => `${l.icon} ${l.name}`).join("  "),
                  ]}
                />
              </div>
              <p className="mt-4 font-mono text-xs text-slate-500">
                <span className="hidden pointer-fine:inline">↗ Move your pointer over the galaxy. Click a planet to jump into its track.</span>
                <span className="pointer-fine:hidden">👆 Tap a planet to name it, tap again to jump into its track.</span>
              </p>
            </div>
            <Galaxy3D
              items={galaxy}
              onSelect={(id) => router.push(`/c/${id}`)}
              className="h-56 w-full sm:h-80 lg:h-96"
              fallback={<div className="hidden h-72 lg:block" />}
            />
          </div>
        </TerminalWindow>

        <section className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="font-mono text-lg font-black uppercase tracking-wider text-white">
              <span className="text-emerald-300">&gt;</span> Select difficulty
            </h2>
            <p className="font-mono text-xs text-slate-400">
              {level === "mixed" ? "⚠ Your tracks are set to different levels. Pick one to set them all." : `Every track plays at ${LEVEL_BY_ID[level].icon} ${LEVEL_BY_ID[level].name}.`}
            </p>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Applies to every track: trials, drills, boss battles, study play, and the final mock interview or skill check. You can still change one track on its own map.
          </p>
          <div className="mt-4">
            <LevelPicker value={level} onChange={(l) => setSharedLevel(COURSES_ONLY, l)} counts={LEVEL_COUNTS} />
          </div>
        </section>

        <section className="z-10 sm:sticky sm:top-[45px] -mx-4 mt-8 border-y border-white/5 bg-[#03070d]/85 px-4 py-3 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-[#07111c] px-3 py-2 font-mono text-sm focus-within:border-emerald-400/60 sm:max-w-md">
              <span className="text-emerald-300">$ grep</span>
              <input
                ref={search}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="hooks, sql joins, goroutines…"
                className="min-w-0 flex-1 bg-transparent text-white placeholder:text-slate-600 focus:outline-none"
                aria-label="Search tracks, lessons, and topics"
              />
              {query ? (
                <button type="button" onClick={() => setQuery("")} className="text-slate-500 hover:text-white" aria-label="Clear search">
                  ✕
                </button>
              ) : (
                <kbd className="rounded border border-white/15 px-1.5 text-[10px] text-slate-500">/</kbd>
              )}
            </label>
            <div className="flex rounded-xl border border-white/10 bg-[#07111c] p-1 font-mono text-xs" role="tablist" aria-label="Track type">
              {TRACK_FOCUSES.map((f) => {
                const on = focus === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    title={f.blurb}
                    onClick={() => setFocus(f.id)}
                    className={`rounded-lg px-3 py-1.5 font-bold uppercase tracking-wider transition ${on ? "bg-emerald-400 text-slate-950" : "text-slate-400 hover:text-white"}`}
                  >
                    {f.icon} {f.name} <span className={on ? "text-slate-800" : "text-slate-600"}>{byFocus(f.id).length}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs">
            <CategoryChip active={category === "all"} onClick={() => setCategory("all")}>
              ✳️ All topics
            </CategoryChip>
            {categories.map((c) => (
              <CategoryChip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
                {c.icon} {c.name} <span className="opacity-60">{byFocus(focus).filter((t) => t.course.category === c.id).length}</span>
              </CategoryChip>
            ))}
            {filtered && (
              <button
                type="button"
                onClick={() => {
                  setFocus("all");
                  setCategory("all");
                  setQuery("");
                }}
                className="ml-auto text-slate-400 underline-offset-2 hover:text-white hover:underline"
              >
                reset filters
              </button>
            )}
          </div>
        </section>

        <p className="mt-5 font-mono text-xs text-slate-500">
          → {shown.length} {shown.length === 1 ? "track" : "tracks"}
          {query.trim() && <> matching &quot;{query.trim()}&quot;</>}
        </p>

        {shown.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-white/10 p-10 text-center font-mono text-slate-400">
            <div className="text-4xl">🛰️</div>
            <p className="mt-2">No track matches. Try another word or reset the filters.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map(({ course }) => (
              <Cartridge key={course.id} course={course} hint={matchHint(course, query)} />
            ))}
          </div>
        )}

        <section className="mt-10 grid gap-3 sm:grid-cols-4">
          {[
            { icon: "🐞", t: "Bug hunt", d: "Tap the line that breaks." },
            { icon: "🔮", t: "Predict output", d: "Run the code in your head." },
            { icon: "🧱", t: "Build it", d: "Order the lines or steps." },
            { icon: "🎤", t: "Final test", d: "Timed, at your level." },
          ].map((f) => (
            <div key={f.t} className="rounded-xl border border-white/10 bg-[#07111c]/90 p-4">
              <div className="text-2xl">{f.icon}</div>
              <div className="mt-1 font-mono text-sm font-black uppercase tracking-wider text-white">{f.t}</div>
              <div className="text-xs text-slate-400">{f.d}</div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

/** When the search hit a lesson or flashcard rather than the track name, say where. */
function matchHint(course: Course, query: string) {
  const q = query.trim().toLowerCase();
  if (!q || `${course.title} ${course.shortTitle} ${course.code}`.toLowerCase().includes(q)) return null;
  const lesson = Object.values(course.lessons)
    .flat()
    .find((l) => l.title.toLowerCase().includes(q));
  if (lesson) return `📖 ${lesson.title}`;
  const card = course.cards.find((c) => c.term.toLowerCase().includes(q));
  if (card) return `🃏 ${card.term}`;
  return null;
}

function CategoryChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-2.5 py-1 transition ${active ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-100" : "border-white/10 text-slate-400 hover:border-white/30 hover:text-white"}`}
    >
      {children}
    </button>
  );
}

function Cartridge({ course, hint }: { course: Course; hint: string | null }) {
  const p = getCourseStore(course).useProgress();
  const lvl = levelInfo(p.xp, course.levelTitles);
  const readiness = Math.round(overallReadiness(course, p));
  const lessons = indexCourse(course).allLessons.length;
  const skill = LEVEL_BY_ID[p.level];
  const atLevel = questionsForLevel(course, p.level).length;
  const color = course.provider.color;
  const focus = TRACK_FOCUSES.find((f) => f.id === course.kind);
  const category = course.category ? CATEGORY_BY_ID[course.category] : null;

  return (
    <Tilt className="rounded-2xl" max={8}>
      <Link
        href={`/c/${course.id}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 bg-[#07111c]/95 p-5 transition hover:-translate-y-1"
        style={{ borderColor: `${color}66`, boxShadow: `0 0 0 1px ${color}22, 0 18px 40px -26px ${color}` } as CSSProperties}
      >
        <div className="absolute -right-6 -top-6 text-8xl opacity-10 transition group-hover:scale-110 group-hover:opacity-20">{course.provider.icon}</div>
        <div className="flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider" style={{ color }}>
          <span className="text-2xl">{course.provider.icon}</span>
          {course.code}
          {(p.xp > 0 || p.level !== "all") && (
            <span className="ml-auto rounded px-1.5 py-0.5 text-[10px]" style={{ background: `${skill.color}22`, color: skill.color }}>
              {skill.icon} {skill.name}
            </span>
          )}
        </div>
        <div className="mt-3 font-mono text-xl font-black text-white">{course.shortTitle}</div>
        <div className="mt-1 flex flex-wrap gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider">
          {focus && (
            <span className={`rounded px-1.5 py-0.5 ${course.kind === "learning" ? "bg-sky-400/15 text-sky-200" : "bg-fuchsia-400/15 text-fuchsia-200"}`}>
              {focus.icon} {focus.name}
            </span>
          )}
          {category && (
            <span className="rounded bg-white/5 px-1.5 py-0.5 text-slate-400">
              {category.icon} {category.name}
            </span>
          )}
        </div>
        <p className="mt-2 flex-1 text-sm text-slate-400">{course.tagline}</p>
        {hint && <p className="mt-2 truncate rounded bg-emerald-400/10 px-2 py-1 font-mono text-[11px] text-emerald-200">{hint}</p>}
        <div className="mt-4 flex flex-wrap gap-3 font-mono text-[11px] text-slate-400">
          <span>{course.domains.length} stages</span>
          {course.coding?.length ? <span className="text-emerald-300">💻 {course.coding.length} coding</span> : null}
          <span>{lessons} levels</span>
          <span>{p.level === "all" ? `${course.questions.length} questions` : `${atLevel} ${skill.name.toLowerCase()} questions`}</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full" style={{ width: pct(readiness / 100), background: color }} />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[11px] text-slate-500">
          <span>lv {lvl.level}</span>
          <span>{readiness}% ready</span>
        </div>
        <span
          className="btn-3d mt-4 rounded-xl py-2.5 text-center font-mono text-sm font-black uppercase tracking-wider text-slate-950"
          style={{ background: color, "--edge": "#00000088" } as CSSProperties}
        >
          ▶ {p.xp > 0 ? "Continue" : "Play"}
        </span>
      </Link>
    </Tilt>
  );
}
