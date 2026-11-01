"use client";

import { CheckIcon, LandmarkIcon, PlayIcon, TimerIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioPrimitive } from "@/components/ui/radio-group";

export interface ExamModeOption {
  id: string;
  name: string;
  questions: number;
  minutes: number;
  full?: boolean;
}

/**
 * Pick a simulation length, then start. Nothing is preselected and choosing a tile never starts
 * the exam: the single primary action is "Start exam", enabled once a mode is chosen.
 */
export function ModePicker({ modes, onStart }: { modes: ExamModeOption[]; onStart: (id: string) => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <section aria-labelledby="exam-mode-label" className="mt-6">
      <h2 id="exam-mode-label" className="text-lg font-semibold text-foreground">
        Choose a length
      </h2>
      <RadioGroup aria-labelledby="exam-mode-label" value={picked} onValueChange={(v) => setPicked(String(v))} className="mt-3 grid gap-3 sm:grid-cols-2">
        {modes.map((m) => {
          const Icon = m.full ? LandmarkIcon : TimerIcon;
          return (
            <RadioPrimitive.Root
              key={m.id}
              value={m.id}
              className="group flex min-h-14 items-start gap-3 rounded-card border border-input p-4 text-left outline-none transition-colors duration-150 hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring data-checked:border-primary data-checked:bg-primary/10"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-data-checked:bg-primary group-data-checked:text-primary-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold text-foreground">{m.name}</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  {m.questions} questions · {m.minutes} minutes{m.full ? " · the real format" : ""}
                </span>
              </span>
              <CheckIcon className="mt-1 size-4 shrink-0 text-primary opacity-0 group-data-checked:opacity-100" aria-hidden="true" />
            </RadioPrimitive.Root>
          );
        })}
      </RadioGroup>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button size="xl" disabled={!picked} onClick={() => picked && onStart(picked)}>
          <PlayIcon aria-hidden="true" /> Start exam
        </Button>
        {!picked && <p className="text-sm text-muted-foreground">Pick a length to begin. The timer starts when you press Start.</p>}
      </div>
    </section>
  );
}
