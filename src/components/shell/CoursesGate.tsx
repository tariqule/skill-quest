"use client";

import type { ReactNode } from "react";
import { CircleAlert, RotateCcw } from "lucide-react";
import { useCourses } from "@/api/client";
import { Button } from "@/components/ui/button";
import type { Course } from "@/engine/types";
import { PageSkeleton } from "./PageIntro";

/**
 * Renders its children once these courses' content has loaded from /api/v1, with a skeleton
 * meanwhile and an error with a retry button if the request fails.
 */
export function CoursesGate({ ids, children, skeleton = <PageSkeleton /> }: { ids: readonly string[]; children: (courses: Course[]) => ReactNode; skeleton?: ReactNode }) {
  const state = useCourses(ids);
  if (state.status === "loading") return skeleton;
  if (state.status === "error") return <LoadError message={state.error.message} onRetry={state.retry} />;
  return children(state.courses);
}

export function LoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="mt-6 flex flex-col items-start gap-3 rounded-card border border-destructive/40 bg-destructive/5 p-4 text-base text-foreground sm:flex-row sm:items-center">
      <CircleAlert className="size-5 shrink-0 text-destructive-foreground" aria-hidden />
      <p className="min-w-0 flex-1">
        Couldn&apos;t load your course content. <span className="text-muted-foreground">{message}</span>
      </p>
      <Button variant="outline" onClick={onRetry}>
        <RotateCcw aria-hidden />
        Try again
      </Button>
    </div>
  );
}
