"use client";

import Link from "next/link";
import { useCourse, useProgress } from "@/engine/course-context";
import { levelInfo } from "@/engine/store";
import { setGuideOpen, useToasts } from "@/engine/ui-state";
import { Bar } from "./ui";

export const APP_NAME = "Cert Quest";

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
            🔥 {p.streak.count}
          </span>
          <span title="XP today vs daily goal" className="hidden sm:inline text-slate-300">
            🎯 {p.today.xp}/{p.dailyGoal}
          </span>
          <div className="w-28 sm:w-40">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-sky-300">Lv {lvl.level}</span>
              <span>{p.xp} XP</span>
            </div>
            <Bar value={lvl.into / lvl.needed} className="h-1.5" />
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
