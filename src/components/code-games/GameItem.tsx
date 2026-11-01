"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/QuestionCard";
import { CourseProvider } from "@/engine/course-context";
import { isCorrect, prepare } from "@/engine/game";
import { getCourseStore } from "@/engine/store";
import type { Course, Question } from "@/engine/types";

/** One code-game item outside a course page (Daily Review, the daily warm-up), with its course context. */
export function GameItem({ course, q, tag, note, onDone }: { course: Course; q: Question; tag?: string; note?: (correct: boolean) => string; onDone: (correct: boolean) => void }) {
  const [prepared] = useState(() => prepare(q));
  const [submitted, setSubmitted] = useState<number[] | null>(null);
  const correct = submitted !== null && isCorrect(prepared, submitted);

  function submit(picked: number[]) {
    setSubmitted(picked);
    // Recording the answer feeds mastery and, through syncFromProgress, the spaced-repetition schedule.
    getCourseStore(course).recordAnswer(q.id, isCorrect(prepared, picked));
  }

  return (
    <CourseProvider course={course}>
      <div className="mb-2 text-sm font-medium text-muted-foreground">
        {course.shortTitle}
        {tag ? ` · ${tag}` : ""}
      </div>
      <QuestionCard q={prepared} submitted={submitted} onSubmit={submit} />
      {submitted && note && (
        <p className={`mt-4 text-base font-semibold ${correct ? "text-success-foreground" : "text-destructive-foreground"}`} role="status">
          {note(correct)}
        </p>
      )}
      {submitted && (
        <Button size="xl" className="mt-4 w-full" onClick={() => onDone(correct)}>
          Next
          <ArrowRight aria-hidden="true" />
        </Button>
      )}
    </CourseProvider>
  );
}
