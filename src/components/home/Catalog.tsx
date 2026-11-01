"use client";

import Link from "next/link";
import { useEffect, useState, type ComponentType } from "react";
import { Award, Briefcase, Code2, LayoutGrid, MessagesSquare, Search, Sprout, X, type LucideProps } from "lucide-react";
import { LifecycleBadges } from "@/components/Lifecycle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { courseSummaries, courseSummary, useCourses } from "@/api/client";
import type { CourseSummary } from "@/api/wire";
import { BUNDLES } from "@/engine/bundles";
import { overallReadiness } from "@/engine/game";
import { getProgressStore } from "@/engine/store";
import { isCodeTrack } from "@/engine/tracks";

type Section = "all" | "cert" | "interview" | "fundamentals";
const FILTERS: { id: Section; label: string; icon: ComponentType<LucideProps> }[] = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "cert", label: "Certifications", icon: Award },
  { id: "interview", label: "Interview prep", icon: MessagesSquare },
  { id: "fundamentals", label: "Fundamentals", icon: Sprout },
];

function matches(c: CourseSummary, q: string) {
  if (!q) return true;
  const hay = `${c.title} ${c.shortTitle} ${c.code} ${c.provider.name} ${c.tagline} ${c.category ?? ""}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((w) => hay.includes(w));
}

/** Sectioned course catalog with search and section filters. */
export function Catalog({ onFilteringChange }: { onFilteringChange?: (filtering: boolean) => void }) {
  const [q, setQ] = useState("");
  const [section, setSection] = useState<Section>("all");
  const filtering = q.trim() !== "" || section !== "all";
  useEffect(() => onFilteringChange?.(filtering), [filtering, onFilteringChange]);
  const clear = () => {
    setQ("");
    setSection("all");
  };
  const show = (s: Section) => section === "all" || section === s;
  const all = courseSummaries();
  const CERTS = all.filter((c) => !isCodeTrack(c));
  const INTERVIEW = all.filter((c) => isCodeTrack(c) && c.kind === "interview");
  const FUNDAMENTALS = all.filter((c) => c.kind === "learning");
  const certs = CERTS.filter((c) => matches(c, q));
  const providers = [...new Set(certs.map((c) => c.provider.name))];
  const interview = INTERVIEW.filter((c) => matches(c, q));
  // Role bundles are a browsing aid: hidden while searching so results read as filtered.
  const bundles = q.trim() ? [] : BUNDLES;
  const fundamentals = FUNDAMENTALS.filter((c) => matches(c, q));
  const none = certs.length + interview.length + bundles.length + fundamentals.length === 0;

  return (
    <section aria-labelledby="catalog-h" className="mt-12 border-t border-border pt-8">
      <h2 id="catalog-h" className="font-heading text-h3 font-semibold text-foreground">
        All courses
      </h2>
      <div className="mt-4 flex flex-col gap-3">
        <div className="flex gap-2">
          <label htmlFor="catalog-q" className="sr-only">
            Search courses
          </label>
          <div className="relative min-w-0 flex-1 sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              id="catalog-q"
              type="search"
              size="lg"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search: AWS, React, SQL, Kubernetes…"
              className="[&_input]:ps-9"
            />
          </div>
          {filtering && (
            <Button type="button" variant="ghost" size="lg" onClick={clear}>
              <X aria-hidden />
              Clear
            </Button>
          )}
        </div>
        <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] max-sm:[mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-32px),transparent)] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <ToggleGroup
            aria-label="Filter by section"
            value={[section]}
            onValueChange={(v) => setSection(((v as string[])[0] as Section) ?? "all")}
            className="gap-2"
          >
            {FILTERS.map((f) => {
              const Icon = f.icon;
              return (
                <ToggleGroupItem
                  key={f.id}
                  value={f.id}
                  className="h-10 shrink-0 rounded-full border-border px-3.5 data-pressed:border-primary data-pressed:bg-primary/15 data-pressed:text-foreground"
                >
                  <Icon aria-hidden />
                  {f.label}
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>
        <p className="sr-only" aria-live="polite">
          {filtering ? "Showing filtered results." : ""}
        </p>
      </div>

      {none && <p className="mt-6 text-base text-muted-foreground">No courses match “{q}”. Try a shorter word.</p>}

      {show("cert") && certs.length > 0 && (
        <div className="mt-8">
          <SectionTitle icon={Award}>Certifications</SectionTitle>
          {providers.map((p) => (
            <div key={p} className="mt-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{p}</h4>
              <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {certs
                  .filter((c) => c.provider.name === p)
                  .map((c) => (
                    <CourseCard key={c.id} course={c} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {show("interview") && (bundles.length > 0 || interview.length > 0) && (
        <div className="mt-10">
          <SectionTitle icon={MessagesSquare}>Interview prep</SectionTitle>
          {bundles.length > 0 && (
            <>
              <h4 className="mt-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">By role</h4>
              <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {bundles.map((b) => (
                  <Card key={b.id} className="p-4">
                    <div className="flex items-center gap-2 text-base font-semibold text-foreground">
                      <Briefcase className="size-4 text-primary" aria-hidden />
                      {b.title}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{b.line}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {b.courses.map((id) => {
                        const c = courseSummary(id);
                        return c ? (
                          <Link
                            key={id}
                            href={`/c/${id}`}
                            className="inline-flex min-h-8 items-center rounded-full border border-border px-2.5 text-sm text-foreground outline-none transition-colors duration-150 hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {c.shortTitle}
                          </Link>
                        ) : null;
                      })}
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
          {interview.length > 0 && (
            <>
              <h4 className="mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">By topic</h4>
              <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {interview.map((c) => (
                  <CourseCard key={c.id} course={c} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {show("fundamentals") && fundamentals.length > 0 && (
        <div className="mt-10">
          <SectionTitle icon={Sprout}>Fundamentals</SectionTitle>
          <p className="mt-1 text-base text-muted-foreground">Start from zero. No experience needed.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fundamentals.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function SectionTitle({ icon: Icon, children }: { icon: ComponentType<LucideProps>; children: string }) {
  return (
    <h3 className="flex items-center gap-2 font-heading text-h4 font-semibold text-foreground">
      <Icon className="size-5 text-primary" aria-hidden />
      {children}
    </h3>
  );
}

/** Course card: calm surface, provider colour only on the accent dot and progress (no tilt, no glow). */
function CourseCard({ course }: { course: CourseSummary }) {
  const p = getProgressStore(course).useProgress();
  const lessons = course.counts.lessons;
  const code = isCodeTrack(course);
  return (
    <Link
      href={`/c/${course.id}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-4 outline-none transition-colors duration-150 hover:border-primary/50 hover:bg-accent/30 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: course.provider.color }} />
        {code ? (course.kind === "learning" ? "Learn from zero" : "Interview prep") : course.provider.name}
        <span className="ml-auto rounded-md border border-border px-1.5 text-sm text-foreground">{course.code}</span>
      </div>
      <div className="mt-2 text-lg font-semibold leading-snug text-foreground">{course.title}</div>
      <p className="mt-1 line-clamp-2 flex-1 text-base text-muted-foreground">{course.tagline}</p>
      {!code && <LifecycleBadges course={course} />}
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span>{lessons} lessons</span>
        <span>{course.counts.questions} questions</span>
        {course.counts.coding ? (
          <span className="flex items-center gap-1">
            <Code2 className="size-4" aria-hidden />
            Live coding
          </span>
        ) : null}
      </div>
      {p.xp > 0 && <CardReadiness course={course} />}
    </Link>
  );
}

/** Readiness needs the course's questions: loaded (and cached) only for courses you have started. */
function CardReadiness({ course }: { course: CourseSummary }) {
  const p = getProgressStore(course).useProgress();
  const state = useCourses([course.id]);
  if (state.status !== "ready" || !state.courses[0]) {
    return (
      <div className="mt-3" aria-busy={state.status === "loading"}>
        <Progress value={0} aria-label={`${course.shortTitle} readiness`} />
        <div className="mt-1 text-sm text-muted-foreground">{state.status === "error" ? "Readiness unavailable" : "Loading readiness…"}</div>
      </div>
    );
  }
  const readiness = Math.round(overallReadiness(state.courses[0], p));
  return (
    <div className="mt-3">
      <Progress value={readiness} aria-label={`${course.shortTitle} readiness`} />
      <div className="mt-1 text-sm text-muted-foreground">{readiness}% ready</div>
    </div>
  );
}
