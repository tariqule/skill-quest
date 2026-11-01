import { Lightbulb } from "lucide-react";
import type { ReactNode } from "react";
import { RichText } from "./code";

/** A lesson's points as a numbered list at reading size, with the tip set apart. */
export function LessonPoints({ points, tip, tipLabel, color }: { points: string[]; tip?: string; tipLabel: string; color: string }) {
  return (
    <ul className="mt-5 grid max-w-[680px] gap-2">
      {points.map((pt, i) => (
        <li key={i} className="flex gap-3 rounded-card border border-border bg-card p-4 text-body leading-relaxed text-foreground">
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-slate-950" style={{ background: color }}>
            {i + 1}
          </span>
          <span>
            <RichText text={pt} />
          </span>
        </li>
      ))}
      {tip && (
        <li className="flex gap-3 rounded-card border border-warning/40 bg-warning/10 p-4 text-body leading-relaxed text-foreground">
          <Lightbulb className="mt-1 size-5 shrink-0 text-warning-foreground" aria-hidden />
          <span>
            <b className="font-semibold text-warning-foreground">{tipLabel}: </b>
            <RichText text={tip} />
          </span>
        </li>
      )}
    </ul>
  );
}

/** Sticky thumb-reach bar for the one primary action on a learning screen. */
export function StickyBar({ children }: { children: ReactNode }) {
  return <div className="sticky bottom-0 -mx-4 mt-6 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">{children}</div>;
}
