"use client";

import Link from "next/link";
import { useCourse } from "@/engine/course-context";
import { useHydrated } from "@/engine/hydrated";
import { Bar } from "../ui";
import { usePracticeSummary } from "./usePracticeSummary";
import { BlockIcon } from "@/components/learn/block-icons";

/** The course map's way into /practice, with the same coverage number the practice page shows. */
export function PracticeTile() {
  const { href } = useCourse();
  const { covered, total } = usePracticeSummary();
  const ready = useHydrated();
  if (!total) return null;
  return (
    <Link
      href={href("/practice")}
      className="flex items-center gap-3 rounded-2xl border-2 border-primary/40 bg-primary/[0.07] p-4 transition hover:border-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span className="text-3xl" aria-hidden="true"><BlockIcon icon="🎯" className="inline-block size-[1.1em] align-[-0.15em]" /></span>
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-foreground">Topic practice</div>
        <div className="text-sm text-muted-foreground">
          {ready ? `Covers ${covered.length} of ${total} topics` : "Checking your topics…"}
        </div>
        <div className="mt-2" aria-hidden="true">
          <Bar value={ready ? covered.length / total : 0} color="#2dd4bf" className="h-1.5" />
        </div>
      </div>
      <span className="shrink-0 font-bold text-primary" aria-hidden="true">→</span>
    </Link>
  );
}
