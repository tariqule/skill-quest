"use client";

import Link from "next/link";
import { getCourse } from "@/courses";
import { formatDate } from "@/engine/game";
import type { Course } from "@/engine/types";

/** Small badges for the course catalog: "Retires …" / "Opens …". */
export function LifecycleBadges({ course }: { course: Course }) {
  const l = course.lifecycle;
  if (!l?.retires && !l?.opens) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
      {l.retires && <span className="rounded-full bg-amber-400/15 px-2.5 py-1 text-amber-200">⏳ Last exam date {formatDate(l.retires)}</span>}
      {l.opens && <span className="rounded-full bg-sky-400/15 px-2.5 py-1 text-sky-200">🆕 Exam available from {formatDate(l.opens)}</span>}
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
      <div className="mt-4 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm text-amber-100">
        ⏳ <b>{course.code}</b> can be taken until <b>{formatDate(l.retires)}</b>.
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
      <div className="mt-4 rounded-2xl border border-sky-400/40 bg-sky-400/10 p-4 text-sm text-sky-100">
        🆕 <b>{course.code}</b> exam appointments start <b>{formatDate(l.opens)}</b>.
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
