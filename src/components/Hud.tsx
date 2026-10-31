"use client";

import Link from "next/link";
import { useCourse, useProgress } from "@/engine/course-context";
import { LEVEL_BY_ID } from "@/engine/levels";
import { useHydrated } from "@/engine/hydrated";
import { levelInfo } from "@/engine/store";
import { setGuideOpen, useToasts } from "@/engine/ui-state";
import { Bar } from "./ui";
import { isCodeTrack } from "@/engine/tracks";

export const APP_NAME = "SkillQuest";

/** Top bar for the app outside any course (the catalog). */
export function AppBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2.5 font-bold text-white">
        <span className="text-xl">🎓</span>
        {APP_NAME}
      </div>
    </header>
  );
}

/** Top bar inside a course: course name, guide, streak, daily goal, level. */
export function Hud() {
  const { course, href } = useCourse();
  const p = useProgress();
  const lvl = levelInfo(p.xp, course.levelTitles);
  // Placeholder until localStorage is read, so the header never flashes 0 XP / level 1.
  const ready = useHydrated();
  const n = (v: number) => (ready ? v : "…");

  if (isCodeTrack(course)) {
    const skill = LEVEL_BY_ID[p.level];
    return (
      <header className="sticky top-0 z-20 border-b border-emerald-400/20 bg-[#03070d]/90 font-mono backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5 text-sm">
          <Link href="/code" title="All code quests" className="font-black text-emerald-300">
            &lt;/&gt;
          </Link>
          <Link href={href()} className="flex min-w-0 items-center gap-2 font-bold text-white">
            <span>{course.provider.icon}</span>
            <span className="truncate">~/{course.shortTitle.toLowerCase()}</span>
          </Link>
          <span
            className="shrink-0 whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-bold"
            style={{ background: `${skill.color}22`, color: skill.color }}
            title={`Level: ${skill.name}`}
          >
            {skill.icon} <span className="hidden sm:inline">{skill.name}</span>
          </span>
          <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              className="whitespace-nowrap rounded border border-white/15 px-2 py-0.5 text-slate-200 hover:bg-white/10"
              title="Open the guide (?)"
              aria-label="Open the guide"
            >
              ?<span className="hidden sm:inline"> guide</span>
            </button>
            <span className="text-orange-300">🔥{n(p.streak.count)}</span>
            <span className="hidden text-slate-400 sm:inline">
              {n(p.today.xp)}/{p.dailyGoal}xp
            </span>
            <div className="w-16 sm:w-36">
              <div className="flex justify-between text-[10px] text-slate-500">
                <span className="text-emerald-300">lv{n(lvl.level)}</span>
                <span>{n(p.xp)}xp</span>
              </div>
              <Bar value={ready ? lvl.into / lvl.needed : 0} color="#34d399" className="h-1.5" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5">
        <Link href="/" title="All courses" className="text-xl">
          🎓
        </Link>
        <Link href={href()} className="flex min-w-0 items-center gap-2 font-bold text-white">
          <span>{course.provider.icon}</span>
          <span className="hidden truncate sm:inline">{course.shortTitle}</span>
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-slate-300">{course.code}</span>
        </Link>
        <div className="ml-auto flex items-center gap-3 sm:gap-5 text-sm">
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 font-semibold text-slate-100 hover:bg-white/10"
            title="Open the study guide (?)"
          >
            📖 <span className="hidden sm:inline">Guide</span>
          </button>
          <span title="Day streak" className="font-semibold text-orange-300">
            🔥 {n(p.streak.count)}
          </span>
          <span title="XP today vs daily goal" className="hidden sm:inline text-slate-300">
            🎯 {n(p.today.xp)}/{p.dailyGoal}
          </span>
          <div className="w-28 sm:w-40">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-sky-300">Lv {n(lvl.level)}</span>
              <span>{n(p.xp)} XP</span>
            </div>
            <Bar value={ready ? lvl.into / lvl.needed : 0} className="h-1.5" />
          </div>
        </div>
      </div>
    </header>
  );
}

export function Toaster() {
  const toasts = useToasts();
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="toast-in flex items-start gap-3 rounded-xl border border-amber-300/30 bg-slate-900 p-3 shadow-2xl">
          <span className="text-2xl">{t.icon}</span>
          <div>
            <div className="font-semibold text-white">{t.title}</div>
            {t.body && <div className="text-sm text-slate-400">{t.body}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
