"use client";

import { CalendarClock, CalendarPlus } from "lucide-react";
import Link from "next/link";
import { getCourse } from "@/courses";
import { formatDate } from "@/engine/game";
import type { Course } from "@/engine/types";

/** Catalog notes: "Last exam date …" / "Exam available from …" (Lucide icons, 14px+, token colours). */
export function LifecycleBadges({ course }: { course: Course }) {
  const l = course.lifecycle;
  if (!l?.retires && !l?.opens) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2 text-sm">
      {l.retires && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-warning-foreground">
          <CalendarClock className="size-4" aria-hidden />
          Last exam date {formatDate(l.retires)}
        </span>
      )}
      {l.opens && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-info/10 px-2.5 py-1 text-info-foreground">
          <CalendarPlus className="size-4" aria-hidden />
          Exam available from {formatDate(l.opens)}
        </span>
      )}
    </div>
  );
}

/** Banner on the mission map linking an exam version to its successor or predecessor. */
export function LifecycleBanner({ course }: { course: Course }) {
  const l = course.lifecycle;
  if (!l) return null;
  const successor = l.successor ? getCourse(l.successor) : undefined;
  const predecessor = l.predecessor ? getCourse(l.predecessor) : undefined;
  if (l.retires) {
    return (
      <div className="mt-4 rounded-2xl border border-warning/40 bg-warning/10 p-4 text-base text-foreground">
        <CalendarClock className="mr-1.5 inline size-4 align-[-2px] text-warning-foreground" aria-hidden /><b>{course.code}</b> can be taken until <b>{formatDate(l.retires)}</b>.
        {successor && (
          <>
            {" "}
            After that, the exam is{" "}
            <Link href={`/c/${successor.id}`} className="font-bold underline">
              {successor.code}
            </Link>
            {successor.lifecycle?.opens && <> (available from {formatDate(successor.lifecycle.opens)})</>}.
          </>
        )}
      </div>
    );
  }
  if (l.opens) {
    return (
      <div className="mt-4 rounded-2xl border border-info/40 bg-info/10 p-4 text-base text-foreground">
        <CalendarPlus className="mr-1.5 inline size-4 align-[-2px] text-info-foreground" aria-hidden /><b>{course.code}</b> exam appointments start <b>{formatDate(l.opens)}</b>.
        {predecessor && (
          <>
            {" "}
            Sitting the exam before then? Study{" "}
            <Link href={`/c/${predecessor.id}`} className="font-bold underline">
              {predecessor.code}
            </Link>
            {predecessor.lifecycle?.retires && <> (available until {formatDate(predecessor.lifecycle.retires)})</>}.
          </>
        )}
      </div>
    );
  }
  return null;
}
