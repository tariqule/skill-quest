"use client";

import Link from "next/link";
import { BookOpen, Flame } from "lucide-react";
import { BrandLink, HeaderFrame } from "@/components/shell/AppHeader";
import { LevelChip } from "@/components/shell/LevelChip";
import { useCourse, useProgress } from "@/engine/course-context";
import { LEVEL_BY_ID } from "@/engine/levels";
import { useHydrated } from "@/engine/hydrated";
import { levelInfo } from "@/engine/store";
import { setGuideOpen, useToasts } from "@/engine/ui-state";
import { isCodeTrack } from "@/engine/tracks";
import { streakLabel } from "@/components/home/today-model";

export { APP_NAME, AppBar } from "@/components/shell/AppHeader";

/**
 * Top bar inside a course. One look for every track (the terminal skin is retired):
 * brand, course name (never truncated to "~/system des…" on 390px), guide, streak, level.
 */
export function Hud() {
  const { course, href } = useCourse();
  const p = useProgress();
  const lvl = levelInfo(p.xp, course.levelTitles);
  // Placeholder until localStorage is read, so the header never flashes 0 XP / level 1.
  const ready = useHydrated();
  const code = isCodeTrack(course);
  const skill = code ? LEVEL_BY_ID[p.level] : null;
  const streak = ready ? p.streak.count : 0;

  return (
    <HeaderFrame className="gap-2 sm:gap-3">
      <BrandLink compact />
      <span aria-hidden className="h-6 w-px shrink-0 bg-border" />
      <Link
        href={href()}
        className="flex min-h-11 min-w-11 items-center gap-2 rounded-md font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        title={course.title}
      >
        <span className="truncate">{course.shortTitle}</span>
        <span className="hidden shrink-0 rounded-md border border-border px-1.5 text-sm font-medium text-muted-foreground sm:inline">{course.code}</span>
      </Link>
      {skill && <span className="hidden shrink-0 text-sm text-muted-foreground md:inline">· {skill.name}</span>}
      <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-3">
        <button
          type="button"
          onClick={() => setGuideOpen(true)}
          className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-md px-2 text-sm font-medium text-muted-foreground outline-none transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          title="Open the study guide (?)"
          aria-label="Open the study guide"
        >
          <BookOpen className="size-5" aria-hidden />
          <span className="hidden sm:inline">Guide</span>
        </button>
        {streak > 0 && (
          <span className="flex items-center gap-1 text-sm font-medium text-reward" title={streakLabel(streak) ?? undefined}>
            <Flame className="size-4" aria-hidden />
            <span className="sr-only">{streakLabel(streak)}</span>
            <span aria-hidden>{streak}</span>
          </span>
        )}
        <span className="hidden text-sm text-muted-foreground sm:inline" title="XP today and your daily goal">
          {ready ? p.today.xp : "–"}/{p.dailyGoal} XP today
        </span>
        <LevelChip level={ready ? lvl.level : null} xp={ready ? p.xp : null} value={ready ? lvl.into / lvl.needed : 0} />
      </div>
    </HeaderFrame>
  );
}

export function Toaster() {
  const toasts = useToasts();
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
    >
      {toasts.map((t) => (
        <div key={t.id} className="toast-in flex items-start gap-3 rounded-card border border-border bg-popover p-3 shadow-elevation-3">
          <span className="text-2xl" aria-hidden>
            {t.icon}
          </span>
          <div>
            <div className="font-semibold text-popover-foreground">{t.title}</div>
            {t.body && <div className="text-sm text-muted-foreground">{t.body}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
