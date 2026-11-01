"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, ChevronRight, Code2, Gamepad2, Map as MapIcon, MessagesSquare, RotateCcw, Swords } from "lucide-react";
import { IntroOffer } from "@/components/learn/IntroOffer";
import { HubHeader } from "@/components/hub/HubHeader";
import { BadgeShelf, HubSection, ModeGrid } from "@/components/hub/Sections";
import { MapLegend, PathTile, StageMap, type LegendEntry } from "@/components/hub/StageMap";
import { LayoutMotion } from "@/components/motion/LayoutMotion";
import { LANGUAGE_LABEL, languageOf } from "@/engine/coding-langs";
import { courseCopy } from "@/engine/copy";
import { useCourse, useProgress } from "@/engine/course-context";
import { overallReadiness } from "@/engine/game";
import { effectiveLevel, LEVEL_BY_ID } from "@/engine/levels";
import { CourseLevel, LevelUpBanner } from "@/components/LevelControls";
import { modesFor } from "@/engine/modes";
import { buildPath, type PathWorld } from "@/engine/path";
import { levelInfo } from "@/engine/store";
import { ModuleMap, STATE as TOPIC_STATE } from "@/components/map/ModuleMap";
import { useCourseMap } from "@/components/map/useCourseMap";
import { useHydrated } from "@/engine/hydrated";
import { PracticeTile } from "@/components/practice/PracticeTile";

/** The hub for code tracks: header with one Continue, the module map, stage trials, practice. */
export function CodeMap() {
  const { course, store, href, lesson: lessonById } = useCourse();
  const p = useProgress();
  const lvl = levelInfo(p.xp, course.levelTitles);
  const { worlds, current } = buildPath(course, p);
  // A topic syllabus replaces the per-stage lesson grid, so "next" follows the syllabus too.
  const map = useCourseMap();
  const hydrated = useHydrated();
  const nextTopic = map?.current?.lesson ? { to: `/lesson/${map.current.lesson}`, title: map.current.topic.title } : null;
  const readiness = Math.round(overallReadiness(course, p));
  const skill = LEVEL_BY_ID[p.level];
  const codingAtLevel = (course.coding ?? []).filter((c) => p.level === "all" || c.level === p.level);
  const codingSolved = codingAtLevel.filter((c) => p.coding[c.id]?.solved).length;
  const copy = courseCopy(course);
  const learning = course.kind === "learning";
  const nextTitle = nextTopic?.title ?? (current ? (current.type === "lesson" ? lessonById[current.key]?.title : "Stage trial") : null);

  return (
    <main className="mx-auto w-full max-w-page px-4 py-6 sm:py-10">
      <IntroOffer show={!p.onboarded && p.xp === 0} href={href("/start")} onSkip={() => store.skipOnboarding()} />
      <HubHeader
        eyebrow={`${learning ? "Learn from zero" : "Interview prep"} · ${course.code}`}
        accent={course.provider.color}
        title={course.title}
        tagline={course.tagline}
        primary={{
          href: href(nextTopic?.to ?? current?.to ?? "/exam"),
          label: p.xp === 0 ? "Start" : "Continue",
          line: hydrated && nextTitle ? `Next: ${nextTitle}` : undefined,
        }}
        secondary={[{ href: href("/study"), label: "Study", icon: BookOpen }]}
        xp={p.xp}
        streak={p.streak.count}
        readiness={readiness}
        level={lvl}
      />

      <LevelUpBanner />
      <CourseLevel title="Your level" note={`Lessons, trials, drills, study play and the ${copy.simulator} follow this level. Change it any time.`} />

      {codingAtLevel.length > 0 && (
        <Link
          href={href("/coding")}
          className="mt-8 flex min-h-11 items-center gap-4 rounded-card border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-accent/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:p-5"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary/15 text-primary">
            <Code2 aria-hidden="true" className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold text-foreground">Live coding: write real code, run real tests</span>
            <span className="mt-0.5 block text-sm text-muted-foreground">
              {codingAtLevel.length} {LANGUAGE_LABEL[languageOf(codingAtLevel[0])]} challenges at {skill.name.toLowerCase()} level, with hints and a reference solution.{" "}
              {hydrated ? `${codingSolved}/${codingAtLevel.length} solved.` : ""}
            </span>
          </span>
          <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
        </Link>
      )}

      <LayoutMotion>
        {map ? (
          <>
            <HubSection id="modules-heading" icon={MapIcon} title={`${map.modules.length} modules`} aside={`${hydrated ? map.done : "–"}/${map.total} topics`}>
              <PracticeTile />
              <div className="mt-4">
                <ModuleMap map={map} color={course.provider.color} />
              </div>
              <MapLegend entries={TOPIC_LEGEND} />
            </HubSection>
            <BossRow worlds={worlds} />
          </>
        ) : (
          <HubSection id="stages-heading" icon={MapIcon} title="Stages">
            <StageMap worlds={worlds} unit="Stage" />
          </HubSection>
        )}
      </LayoutMotion>

      <HubSection id="practice-heading" icon={Gamepad2} title="Practice">
        <ExamTile href={href("/exam")} learning={learning} />
        <ModeGrid modes={modesFor(course, effectiveLevel(course, p.level)).filter((id) => !(map && id === "practice"))} />
      </HubSection>

      <BadgeShelf />

      <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
        <Link href="/code" className="inline-flex min-h-11 items-center gap-1 hover:text-foreground">
          <ArrowLeft aria-hidden="true" className="size-4" />
          All code tracks
        </Link>
        <Link href={href("/start")} className="inline-flex min-h-11 items-center gap-1 hover:text-foreground">
          <RotateCcw aria-hidden="true" className="size-4" />
          Replay intro
        </Link>
      </footer>
    </main>
  );
}

const TOPIC_LEGEND: LegendEntry[] = [
  { ...TOPIC_STATE.current, meaning: "the topic we recommend next" },
  { ...TOPIC_STATE.open, meaning: "take it any time" },
  { ...TOPIC_STATE.done, meaning: "finished" },
  { ...TOPIC_STATE.locked, word: "Best after", meaning: "easier once earlier topics are done" },
];

/** The timed mock lives with practice, so the hero keeps one primary and one secondary action. */
function ExamTile({ href, learning }: { href: string; learning: boolean }) {
  return (
    <Link
      href={href}
      className="mb-4 flex min-h-11 items-center gap-4 rounded-card border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-accent/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary/15 text-primary">
        <MessagesSquare aria-hidden="true" className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-foreground">{learning ? "Skill check" : "Mock interview"}</span>
        <span className="mt-0.5 block text-sm text-muted-foreground">{learning ? "A short timed check of what you've learned so far." : "Timed questions at your level, scored like the real thing."}</span>
      </span>
      <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
    </Link>
  );
}

/** Stage trials for a course whose lessons are laid out by module. */
function BossRow({ worlds }: { worlds: PathWorld[] }) {
  const { course, domain: domainById } = useCourse();
  return (
    <HubSection id="bosses-heading" icon={Swords} title="Stage trials" aside={`${course.domains.length} trials, one per stage`}>
      <ul className="grid grid-cols-1 gap-2 min-[375px]:grid-cols-2 lg:grid-cols-4">
        {worlds.map((w) => {
          const quest = w.nodes.find((n) => n.type === "quest");
          return quest ? (
            <li key={w.domain}>
              <PathTile node={quest} label={domainById[w.domain].world} />
            </li>
          ) : null;
        })}
      </ul>
      <p className="mt-2 text-sm text-muted-foreground">Each trial opens once its stage&apos;s lessons are done.</p>
    </HubSection>
  );
}
