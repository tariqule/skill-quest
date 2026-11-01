"use client";

import { CheckIcon, CircleIcon, FlagIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { QuestionCard } from "@/components/QuestionCard";
import { ToggleGroup, ToggleGroupItem as Toggle } from "@/components/ui/toggle-group";
import type { PreparedQuestion } from "@/engine/game";

export type ReviewFilter = "all" | "wrong" | "flagged";

export interface ReviewItem {
  q: PreparedQuestion;
  index: number;
  answer: number[] | undefined;
  correct: boolean;
  flagged: boolean;
  unscored: boolean;
}

export function filterReview(items: ReviewItem[], filter: ReviewFilter): ReviewItem[] {
  if (filter === "wrong") return items.filter((i) => !i.correct);
  if (filter === "flagged") return items.filter((i) => i.flagged);
  return items;
}

/** Collapsed-by-default answer review with an All / Wrong / Flagged filter. */
export function AnswerReview({ items }: { items: ReviewItem[] }) {
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const shown = filterReview(items, filter);
  const counts: Record<ReviewFilter, number> = { all: items.length, wrong: filterReview(items, "wrong").length, flagged: filterReview(items, "flagged").length };
  return (
    <section aria-labelledby="answer-review">
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 id="answer-review" className="text-lg font-semibold text-foreground">
          Review your answers
        </h2>
        <ToggleGroup variant="outline" aria-label="Filter answers" value={[filter]} onValueChange={(v) => v[0] && setFilter(v[0] as ReviewFilter)}>
          {(["all", "wrong", "flagged"] as const).map((f) => (
            <Toggle key={f} value={f} className="min-h-11 text-sm capitalize">
              {f} ({counts[f]})
            </Toggle>
          ))}
        </ToggleGroup>
      </div>
      <div className="mt-3 grid gap-3">
        {shown.map((it) => (
          <details key={it.q.id} className="rounded-card border border-border bg-card">
            <summary className="flex min-h-11 cursor-pointer items-start gap-2 px-4 py-3 text-sm text-foreground">
              <ResultMark item={it} />
              <span className="min-w-0 flex-1">
                {it.index + 1}. {it.q.prompt}
              </span>
              {it.flagged && <FlagIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-label="flagged" />}
              {it.unscored && <span className="shrink-0 rounded bg-muted px-1.5 text-sm text-muted-foreground">unscored</span>}
            </summary>
            <div className="p-2">
              <QuestionCard q={it.q} submitted={it.answer ?? []} onSubmit={() => {}} showDomain />
            </div>
          </details>
        ))}
        {shown.length === 0 && <p className="rounded-card border border-border bg-card p-4 text-sm text-muted-foreground">Nothing here. {filter === "wrong" ? "Every answer was right." : "You didn't flag any questions."}</p>}
      </div>
    </section>
  );
}

function ResultMark({ item }: { item: ReviewItem }) {
  if (item.correct) return <CheckIcon role="img" aria-label="correct" className="mt-0.5 size-4 shrink-0 text-success-foreground" />;
  if (item.answer) return <XIcon role="img" aria-label="incorrect" className="mt-0.5 size-4 shrink-0 text-destructive-foreground" />;
  return <CircleIcon role="img" aria-label="unanswered" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />;
}
