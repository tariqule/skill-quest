"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, Compass, Gamepad2, GraduationCap, Map as MapIcon, NotebookText, RotateCcw, ScrollText, Swords, type LucideIcon } from "lucide-react";
import { IntroOffer } from "@/components/learn/IntroOffer";
import { LifecycleBanner } from "@/components/Lifecycle";
import { HubHeader } from "@/components/hub/HubHeader";
import { BadgeShelf, HubSection, ModeGrid } from "@/components/hub/Sections";
import { StageMap } from "@/components/hub/StageMap";
import { LayoutMotion } from "@/components/motion/LayoutMotion";
import { Button } from "@/components/ui/button";
import { CodeMap } from "./CodeMap";
import { courseCopy } from "@/engine/copy";
import { useCourse, useProgress } from "@/engine/course-context";
import { overallReadiness } from "@/engine/game";
import { useHydrated } from "@/engine/hydrated";
import { effectiveLevel, hasBeginnerLessons } from "@/engine/levels";
import { BeginnerMap } from "@/components/learn/BeginnerMap";
import { modesFor } from "@/engine/modes";
import { CourseLevel, LevelUpBanner } from "@/components/LevelControls";
import { buildPath } from "@/engine/path";
import { levelInfo } from "@/engine/store";
import { setGuideOpen } from "@/engine/ui-state";
import { isCodeTrack } from "@/engine/tracks";
import { cn } from "@/lib/utils";

/** Certification courses get the world map; code tracks get CodeMap. Both share the hub header. */
export default function CoursePage() {
  const { course } = useCourse();
  const p = useProgress();
  // Beginners get one simple numbered path; everyone else gets the full map.
  if (effectiveLevel(course, p.level) === "beginner" && hasBeginnerLessons(course)) return <BeginnerMap />;
  return isCodeTrack(course) ? <CodeMap /> : <MissionMap />;
}

function MissionMap() {
  const { course, store, href, domain: domainById, lesson: lessonById } = useCourse();
  const copy = courseCopy(course);
  const p = useProgress();
  const hydrated = useHydrated();
  const lvl = levelInfo(p.xp, course.levelTitles);
  const { worlds, current, examUnlocked } = buildPath(course, p);
  const readiness = Math.round(overallReadiness(course, p));
  const level = effectiveLevel(course, p.level);
  const currentDomain = current ? domainById[current.domain] : null;
  const next = current ? (current.type === "lesson" ? lessonById[current.key]?.title : `${currentDomain?.world} trial`) : `${copy.gate} is open`;

  const steps: { icon: LucideIcon; t: string; d: string }[] = [
    { icon: BookOpen, t: "Learn", d: "Each lesson explains one idea with a picture." },
    { icon: CheckCircle2, t: "Check", d: "Two quick questions. Anything you miss comes back until it sticks." },
    { icon: Swords, t: "Trial", d: `A short test per world: ${course.config.quest.length} questions, ${level === "beginner" ? course.config.quest.beginnerHearts : course.config.quest.hearts} hearts.` },
    { icon: GraduationCap, t: copy.gateStep, d: `A full practice ${copy.noun}. Score ${course.exam.scale.pass} or more and you're ready.` },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">
      <IntroOffer show={!p.onboarded && p.xp === 0} href={href("/start")} onSkip={() => store.skipOnboarding()} />
      <HubHeader
        eyebrow={`${course.provider.name} · ${course.code}`}
        accent={course.provider.color}
        title={course.title}
        tagline={course.tagline}
        primary={{ href: href(current?.to ?? "/exam"), label: p.xp === 0 ? "Start the course" : "Continue", line: hydrated ? `Next: ${next}` : undefined }}
        secondary={[{ href: href("/study"), label: "Study", icon: NotebookText }]}
        xp={p.xp}
        streak={p.streak.count}
        readiness={readiness}
        level={lvl}
      />
      <LifecycleBanner course={course} />
      <LevelUpBanner />
      <CourseLevel />

      <HubSection id="how-heading" icon={Compass} title="How it works">
        <ol className="grid grid-cols-1 gap-3 min-[375px]:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.t} className="rounded-card border border-border bg-card p-4">
              <s.icon aria-hidden="true" className="size-5 text-primary" />
              <div className="mt-2 text-base font-semibold text-foreground">
                {i + 1}. {s.t}
              </div>
              <div className="mt-0.5 text-sm text-muted-foreground">{s.d}</div>
            </li>
          ))}
        </ol>
      </HubSection>

      <HubSection id="map-heading" icon={MapIcon} title="Your map" aside={hydrated ? `${copy.readiness} ${readiness}%` : undefined}>
        <LayoutMotion>
          <StageMap worlds={worlds} />
        </LayoutMotion>
        <Link
          href={href("/exam")}
          className={cn(
            "mt-3 flex min-h-11 items-start gap-3 rounded-card border p-4 transition-colors hover:bg-accent/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            examUnlocked ? "border-primary/60 bg-primary/5" : "border-border bg-card",
          )}
        >
          <GraduationCap aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-primary" />
          <span>
            <span className="block text-base font-semibold text-foreground">{copy.gate}</span>
            <span className="mt-0.5 block text-sm text-muted-foreground">
              Full {copy.simulator}: {course.exam.questions} questions, {course.exam.minutes} minutes, scored {course.exam.scale.min}–{course.exam.scale.max}.
            </span>
            <span className="mt-1 block text-sm font-medium text-foreground">{examUnlocked ? "Open. You're ready to attempt it." : "Best after every world's trial, but you can go in any time."}</span>
          </span>
        </Link>
      </HubSection>

      <HubSection id="practice-heading" icon={Gamepad2} title="Practice" aside={<Link href={href("/cheatsheet")} className="inline-flex min-h-11 items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"><ScrollText aria-hidden="true" className="size-4" />Cheat sheet</Link>}>
        <ModeGrid modes={modesFor(course, level)} />
      </HubSection>

      <BadgeShelf />

      <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
        <span className="flex flex-wrap items-center gap-x-3">
          Progress is saved in this browser. Not affiliated with {course.provider.name}.
          <Link href={href("/start")} className="inline-flex min-h-11 items-center gap-1 hover:text-foreground">
            <RotateCcw aria-hidden="true" className="size-4" />
            Replay intro
          </Link>
          <button type="button" onClick={() => setGuideOpen(true)} className="inline-flex min-h-11 items-center gap-1 hover:text-foreground">
            <BookOpen aria-hidden="true" className="size-4" />
            Guide
          </button>
        </span>
        <ResetButton />
      </footer>
    </main>
  );
}

function ResetButton() {
  const { store } = useCourse();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);

  return (
    <Button
      variant={armed ? "destructive-outline" : "ghost"}
      size="lg"
      onClick={() => {
        if (armed) {
          store.reset();
          setArmed(false);
        } else setArmed(true);
      }}
      className="min-h-11"
    >
      {armed ? "Click again to erase all progress" : "Reset progress"}
    </Button>
  );
}
