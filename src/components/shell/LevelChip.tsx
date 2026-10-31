import { Skeleton } from "@/components/ui/skeleton";
import { levelRingDash } from "@/components/home/today-model";

/** Compact level indicator: a small ring (progress to next level) plus "Lv 3"; XP on wider screens. */
export function LevelChip({ level, xp, value }: { level: number | null; xp: number | null; value: number }) {
  const label = level === null ? "Level loading" : `Level ${level}, ${Math.round(value * 100)}% to the next level`;
  if (level === null) return <Skeleton className="h-6 w-14 rounded-full" aria-label="Level loading" />;
  return (
    <span className="flex items-center gap-1.5 text-sm font-medium text-foreground" title={xp === null ? undefined : `${xp} XP`}>
      <svg viewBox="0 0 20 20" className="size-6 -rotate-90" role="img" aria-label={label}>
        <circle cx="10" cy="10" r="8" fill="none" strokeWidth="3" className="stroke-muted" />
        <circle cx="10" cy="10" r="8" fill="none" strokeWidth="3" strokeLinecap="round" className="stroke-primary" strokeDasharray={levelRingDash(value, 8)} />
      </svg>
      <span aria-hidden>Lv {level}</span>
      <span className="hidden text-muted-foreground lg:inline" aria-hidden>
        {xp === null ? "" : `${xp} XP`}
      </span>
    </span>
  );
}
