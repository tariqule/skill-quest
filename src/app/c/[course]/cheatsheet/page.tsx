"use client";

import { useMemo, useState } from "react";
import { Printer, Search, X } from "lucide-react";
import { RichText } from "@/components/learn/code";
import { BlockIcon } from "@/components/learn/block-icons";
import { PageShell } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { chip, chipGroup, chipScroller } from "@/lib/chips";
import { useCourse } from "@/engine/course-context";
import { cn } from "@/lib/utils";
import { filterSheet, sheetSections, slug, type SheetSection } from "./sheet";

const card = "cheat-card mt-4 rounded-card border border-border bg-card p-5 break-inside-avoid";

/**
 * One page to revise from: exam facts, task statements, every cheat-sheet section and the service glossary.
 * Search and a section filter narrow it on screen; printing always includes everything.
 */
export default function CheatSheetPage() {
  const { course } = useCourse();
  const sections = useMemo(() => sheetSections(course), [course]);
  const [query, setQuery] = useState("");
  const [only, setOnly] = useState<string>("all");
  const shown = filterSheet(sections, query, only);
  const filtering = query.trim() !== "" || only !== "all";
  const hasTasks = course.domains.some((d) => (course.guide.tasks[d.id] ?? []).length > 0);

  return (
    <PageShell title="Cheat sheet" subtitle={`${course.title} (${course.code})`}>
      <div className="cheat-sheet text-base leading-relaxed">
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <label htmlFor="sheet-q" className="sr-only">
            Search the cheat sheet
          </label>
          <div className="relative w-full min-w-0 sm:max-w-md sm:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input id="sheet-q" type="search" size="lg" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search terms and definitions" className="[&_input]:ps-9" />
          </div>
          {filtering && (
            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                setQuery("");
                setOnly("all");
              }}
            >
              <X aria-hidden />
              Clear
            </Button>
          )}
          <Button variant="outline" size="lg" onClick={() => window.print()} className="sm:ml-auto">
            <Printer aria-hidden />
            Print or save as PDF
          </Button>
        </div>
        <div className={cn("mt-3 print:hidden", chipScroller)}>
          <ToggleGroup aria-label="Cheat sheet section" value={[only]} onValueChange={(v) => setOnly((v as string[])[0] ?? "all")} className={chipGroup}>
            <ToggleGroupItem value="all" className={chip}>
              All sections
            </ToggleGroupItem>
            {sections.map((s) => (
              <ToggleGroupItem key={s.id} value={s.id} className={chip}>
                {s.title}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <section className={cn(card, filtering && "hidden print:block")} aria-labelledby="sheet-exam">
          <h2 id="sheet-exam" className="font-heading text-h4 font-semibold text-foreground">
            {course.kind === "certification" || !course.kind ? "Exam domains" : "Stages"}
          </h2>
          <ul className="mt-3 grid gap-2">
            {course.domains.map((d) => (
              <li key={d.id} className="flex items-center gap-3">
                <span className="w-12 text-right font-semibold tabular-nums text-foreground">{d.weight}%</span>
                <BlockIcon icon={d.emoji} className="size-4 text-muted-foreground" />
                <span className="text-foreground">{d.name}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-muted-foreground">
            {course.exam.questions} questions{course.exam.unscored > 0 && ` (${course.exam.questions - course.exam.unscored} scored)`}, {course.exam.minutes} minutes, scored{" "}
            {course.exam.scale.min} to {course.exam.scale.max}, pass at {course.exam.scale.pass}. Question types: {course.exam.questionTypes.map((t) => t.name.toLowerCase()).join(", ")}.
          </p>
        </section>

        {hasTasks && (
          <section id="task-statements" className={cn(card, filtering && "hidden print:block")} aria-labelledby="sheet-tasks">
            <h2 id="sheet-tasks" className="font-heading text-h4 font-semibold text-foreground">
              Task statements
            </h2>
            {course.domains.map((d) => (
              <div key={d.id} className="mt-4">
                <h3 className="text-base font-semibold text-foreground">
                  Domain {d.number}: {d.name}
                </h3>
                <ul className="mt-2 grid gap-2">
                  {(course.guide.tasks[d.id] ?? []).map((t) => (
                    <li key={t.id} className="text-foreground">
                      <span className="font-semibold">{t.id}</span> {t.title}
                      {t.covers.length > 0 && <span className="block text-muted-foreground">{t.covers.join(" · ")}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {sections.map((s) => {
          const visible = shown.find((x) => x.id === s.id);
          return <SheetCard key={s.id} section={visible ?? s} hiddenOnScreen={!visible} />;
        })}
        {shown.length === 0 && (
          <p className="mt-6 text-base text-muted-foreground print:hidden" role="status">
            Nothing matches “{query.trim()}”. Try a shorter word.
          </p>
        )}
      </div>
    </PageShell>
  );
}

function SheetCard({ section, hiddenOnScreen }: { section: SheetSection; hiddenOnScreen: boolean }) {
  return (
    <section id={slug(section.title)} aria-labelledby={`h-${section.id}`} className={cn(card, hiddenOnScreen && "hidden print:block")}>
      <h2 id={`h-${section.id}`} className="font-heading text-h4 font-semibold text-foreground">
        {section.title}
      </h2>
      <dl className="mt-3 grid gap-3">
        {section.items.map(([k, v]) => (
          <div key={k} className="grid gap-1 sm:grid-cols-[13rem_1fr]">
            <dt className="font-semibold text-primary">
              <RichText text={k} />
            </dt>
            <dd className="max-w-[70ch] text-foreground">
              <RichText text={v} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
