"use client";

import { Check } from "lucide-react";
import { BlockIcon } from "@/components/learn/block-icons";
import { LEVELS, type LevelChoice, type LevelInfo } from "@/engine/levels";
import { cn } from "@/lib/utils";

const CODE_LEVELS = LEVELS.filter((l) => l.id !== "exam");

/**
 * Difficulty select. `counts` shows how many questions each level has and `countLabels` says what
 * was counted when it isn't every question; "mixed" highlights none. Selection is shown with a
 * check and the word "Selected", not colour alone.
 */
export function LevelPicker({
  value,
  onChange,
  counts,
  countLabels,
  options = CODE_LEVELS,
}: {
  value: LevelChoice | "mixed";
  onChange: (l: LevelChoice) => void;
  counts?: Partial<Record<LevelChoice, number>>;
  countLabels?: Partial<Record<LevelChoice, string>>;
  options?: LevelInfo[];
}) {
  const cols = options.length <= 3 ? "sm:grid-cols-3" : "sm:grid-cols-3 lg:grid-cols-6";
  return (
    <div className={cn("grid grid-cols-1 gap-2 min-[375px]:grid-cols-2", cols)}>
      {options.map((l) => {
        const on = value === l.id;
        return (
          <button
            key={l.id}
            type="button"
            onClick={() => onChange(l.id)}
            aria-pressed={on}
            className={cn(
              "flex min-h-11 flex-col rounded-control border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              on ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50",
            )}
          >
            <span className="flex items-center justify-between gap-2">
              <BlockIcon icon={l.icon} className="size-5" />
              {on && (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  <Check aria-hidden="true" className="size-4" />
                  Selected
                </span>
              )}
            </span>
            <span className="mt-1.5 text-base font-semibold text-foreground">{l.name}</span>
            <span className="mt-0.5 text-sm leading-snug text-muted-foreground">{l.blurb}</span>
            {counts?.[l.id] !== undefined && (
              <span className="mt-2 text-sm tabular-nums text-muted-foreground">
                {counts[l.id]} {countLabels?.[l.id] ?? "questions"}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
