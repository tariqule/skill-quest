"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Bug, Code2, Eye, LayoutGrid, ListOrdered, MessagesSquare, Search, Sprout, Timer, X, type LucideIcon } from "lucide-react";
import { LevelPicker } from "@/components/code/ui";
import { AppBar } from "@/components/Hud";
import { BlockIcon } from "@/components/learn/block-icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { chip, chipGroup, chipScroller } from "@/lib/chips";
import { COURSES } from "@/courses";
import { overallReadiness } from "@/engine/game";
import { useHydrated } from "@/engine/hydrated";
import { indexCourse } from "@/engine/indexes";
import { LEVEL_BY_ID, levelOptions, questionsForLevel, type LevelChoice } from "@/engine/levels";
import { getCourseStore } from "@/engine/store";
import { setSharedLevel, useSharedLevel } from "@/engine/track-level";
import { isCodeTrack, matchesQuery, searchText, TRACK_CATEGORIES, TRACK_FOCUSES, type TrackFocus } from "@/engine/tracks";
import type { Course, TrackCategory } from "@/engine/types";

const TRACKS = COURSES.filter(isCodeTrack).map((c) => ({ course: c, text: searchText(c) }));
const TOTAL_QUESTIONS = TRACKS.reduce((n, t) => n + t.course.questions.length, 0);
const CATEGORY_BY_ID = Object.fromEntries(TRACK_CATEGORIES.map((c) => [c.id, c]));
const COURSES_ONLY = TRACKS.map((t) => t.course);
const LEVEL_COUNTS = Object.fromEntries(
  levelOptions({ kind: "interview" }).map((l) => [l.id, COURSES_ONLY.reduce((n, c) => n + questionsForLevel(c, l.id).length, 0)]),
) as Record<LevelChoice, number>;
const FOCUS_ICON: Record<TrackFocus, LucideIcon> = { all: LayoutGrid, interview: MessagesSquare, learning: Sprout };
const FORMATS: { icon: LucideIcon; t: string; d: string }[] = [
  { icon: Bug, t: "Spot the bug", d: "Tap the line that breaks." },
  { icon: Eye, t: "Predict output", d: "Run the code in your head." },
  { icon: ListOrdered, t: "Build it", d: "Put the lines or steps in order." },
  { icon: Timer, t: "Final test", d: "Timed, at your level." },
];

/** The code tracks hub: every interview and learning track, one shared level, search and filters. */
export default function CodeHub() {
  const search = useRef<HTMLInputElement>(null);
  const [focus, setFocus] = useState<TrackFocus>("all");
  const [category, setCategory] = useState<TrackCategory | "all">("all");
  const [query, setQuery] = useState("");
  const level = useSharedLevel(COURSES_ONLY);

  // "/" jumps to search, like most docs sites.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        search.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // "All" is a full reset: it clears the topic chip too, so nothing stays silently filtered.
  const pickFocus = (f: TrackFocus) => {
    setFocus(f);
    if (f === "all") setCategory("all");
  };
  const byFocus = (f: TrackFocus) => TRACKS.filter((t) => f === "all" || t.course.kind === f);
  const byQuery = (list: typeof TRACKS) => (query.trim() ? list.filter((t) => matchesQuery(t.text, query)) : list);
  const shown = byQuery(byFocus(focus).filter((t) => category === "all" || t.course.category === category));
  const categories = TRACK_CATEGORIES.filter((c) => TRACKS.some((t) => t.course.category === c.id));
  const filtered = focus !== "all" || category !== "all" || query.trim() !== "";
  const reset = () => {
    setFocus("all");
    setCategory("all");
    setQuery("");
  };

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppBar />
      <main className="mx-auto w-full min-w-0 max-w-page px-4 py-8 sm:py-10">
        <header className="max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-medium text-primary">
            <Code2 aria-hidden="true" className="size-4" />
            {TRACKS.length} tracks · {TOTAL_QUESTIONS} questions
          </p>
          <h1 className="mt-2 font-heading text-h2 font-semibold text-foreground">Code tracks</h1>
          <p className="mt-2 text-base text-muted-foreground">
            Learn a skill from scratch or prep for the interview. Every idea comes with code you can try, bug hunts, and a timed check at your level.
          </p>
        </header>

        <section aria-labelledby="level-h" className="mt-8">
          <h2 id="level-h" className="font-heading text-h4 font-semibold text-foreground">
            Your level
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {level === "mixed" ? "Your tracks are set to different levels. Pick one to set them all. " : `Every track plays at ${LEVEL_BY_ID[level].name}. `}
            You can still change a single track on its own page.
          </p>
          <div className="mt-4">
            <LevelPicker value={level} onChange={(l) => setSharedLevel(COURSES_ONLY, l)} counts={LEVEL_COUNTS} />
          </div>
        </section>

        <section aria-labelledby="tracks-h" className="mt-10">
          <h2 id="tracks-h" className="font-heading text-h3 font-semibold text-foreground">
            Tracks
          </h2>
          <div className="sticky top-14 z-10 -mx-4 mt-3 border-y border-border bg-background/95 px-4 py-3">
            <div className="flex gap-2">
              <label htmlFor="track-q" className="sr-only">
                Search tracks, lessons and topics
              </label>
              <div className="relative min-w-0 flex-1 sm:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  id="track-q"
                  ref={search}
                  type="search"
                  size="lg"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Hooks, SQL joins, goroutines…"
                  className="[&_input]:ps-9"
                />
              </div>
              {filtered && (
                <Button type="button" variant="ghost" size="lg" onClick={reset}>
                  <X aria-hidden />
                  Clear
                </Button>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <ToggleGroup aria-label="Track type" value={[focus]} onValueChange={(v) => pickFocus(((v as string[])[0] as TrackFocus) ?? "all")} className="flex-wrap gap-2">
              {TRACK_FOCUSES.map((f) => {
                const Icon = FOCUS_ICON[f.id];
                return (
                  <ToggleGroupItem key={f.id} value={f.id} title={f.blurb} className={chip}>
                    <Icon aria-hidden />
                    {f.name}
                    <span className="text-muted-foreground">{byFocus(f.id).length}</span>
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
            <div className={chipScroller}>
              <ToggleGroup aria-label="Topic" value={[category]} onValueChange={(v) => setCategory(((v as string[])[0] as TrackCategory) ?? "all")} className={chipGroup}>
                <ToggleGroupItem value="all" className={chip}>
                  All topics
                </ToggleGroupItem>
                {categories.map((c) => (
                  <ToggleGroupItem key={c.id} value={c.id} className={chip}>
                    <BlockIcon icon={c.icon} className="size-4" />
                    {c.name}
                    <span className="text-muted-foreground">{byFocus(focus).filter((t) => t.course.category === c.id).length}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
            {shown.length} {shown.length === 1 ? "track" : "tracks"}
            {query.trim() && <> matching “{query.trim()}”</>}
          </p>

          {shown.length === 0 ? (
            <div className="mt-4 rounded-card border border-dashed border-border p-10 text-center text-base text-muted-foreground">
              <Search aria-hidden="true" className="mx-auto size-6" />
              <p className="mt-2">No track matches. Try another word or clear the filters.</p>
            </div>
          ) : (
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map(({ course }) => (
                <li key={course.id}>
                  <TrackCard course={course} hint={matchHint(course, query)} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="formats-h" className="mt-12">
          <h2 id="formats-h" className="font-heading text-h4 font-semibold text-foreground">
            Ways to practise
          </h2>
          <ul className="mt-3 grid grid-cols-1 gap-3 min-[375px]:grid-cols-2 lg:grid-cols-4">
            {FORMATS.map((f) => (
              <li key={f.t} className="rounded-card border border-border bg-card p-4">
                <f.icon aria-hidden="true" className="size-5 text-primary" />
                <div className="mt-2 text-base font-semibold text-foreground">{f.t}</div>
                <div className="text-sm text-muted-foreground">{f.d}</div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

/** When the search hit a lesson or flashcard rather than the track name, say where. */
function matchHint(course: Course, query: string) {
  const q = query.trim().toLowerCase();
  if (!q || `${course.title} ${course.shortTitle} ${course.code}`.toLowerCase().includes(q)) return null;
  const lesson = Object.values(course.lessons)
    .flat()
    .find((l) => l.title.toLowerCase().includes(q));
  if (lesson) return `Lesson: ${lesson.title}`;
  const card = course.cards.find((c) => c.term.toLowerCase().includes(q));
  if (card) return `Flashcard: ${card.term}`;
  return null;
}

/** One track: the whole card is the link; the track colour only marks the icon and progress. */
function TrackCard({ course, hint }: { course: Course; hint: string | null }) {
  const p = getCourseStore(course).useProgress();
  const hydrated = useHydrated();
  const readiness = hydrated ? Math.round(overallReadiness(course, p)) : 0;
  const lessons = indexCourse(course).allLessons.length;
  const skill = LEVEL_BY_ID[p.level];
  const atLevel = questionsForLevel(course, p.level).length;
  const focus = TRACK_FOCUSES.find((f) => f.id === course.kind);
  const category = course.category ? CATEGORY_BY_ID[course.category] : null;
  const started = hydrated && p.xp > 0;
  return (
    <Card
      render={<Link href={`/c/${course.id}`} />}
      className="h-full gap-0 rounded-card p-5 transition-colors hover:border-primary/50 hover:bg-accent/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-muted" style={{ color: course.provider.color }}>
          <BlockIcon icon={course.provider.icon} className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-foreground">{course.shortTitle}</h3>
          <p className="text-sm text-muted-foreground">
            {[focus?.name, category?.name].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>
      <p className="mt-3 flex-1 text-sm text-muted-foreground">{course.tagline}</p>
      {hint && <p className="mt-2 truncate rounded-control bg-primary/10 px-2 py-1 text-sm text-foreground">{hint}</p>}
      <p className="mt-3 flex flex-wrap gap-x-3 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <BookOpen aria-hidden="true" className="size-4" />
          {lessons} lessons
        </span>
        {course.coding?.length ? (
          <span className="inline-flex items-center gap-1">
            <Code2 aria-hidden="true" className="size-4" />
            {course.coding.length} coding
          </span>
        ) : null}
        <span>{p.level === "all" ? `${course.questions.length} questions` : `${atLevel} ${skill.name.toLowerCase()} questions`}</span>
      </p>
      <div className="mt-3">
        <Progress value={readiness} aria-label={`${course.shortTitle} readiness`} />
        <p className="mt-1 flex justify-between text-sm text-muted-foreground">
          <span>{started ? "In progress" : "Not started"}</span>
          <span>{hydrated ? `${readiness}% ready` : "–"}</span>
        </p>
      </div>
    </Card>
  );
}
