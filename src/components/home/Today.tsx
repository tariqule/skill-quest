"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  CircleCheck,
  ClipboardCheck,
  Flame,
  Info,
  Pencil,
  Play,
  RotateCcw,
  Target,
  Zap,
  type LucideProps,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { COURSES, getCourse } from "@/courses";
import { BUNDLE_BY_ID, targetCourses } from "@/engine/bundles";
import { dailySessionSize } from "@/engine/daily-queue";
import { formatDate } from "@/engine/game";
import { EASE_IN_LESSONS, onTrack, type PlanItem, type StudyPlan } from "@/engine/plan";
import { nextStep } from "@/engine/next-step";
import { planCourses, todaySummary } from "@/engine/plan-inputs";
import { syncFromProgress, useSrs } from "@/engine/srs-store";
import { getCourseStore, todayKey } from "@/engine/store";
import type { Course } from "@/engine/types";
import { lastLesson } from "@/engine/last-opened";
import { hasCodeGames } from "@/engine/code-games";
import { hasScenarios, scenariosFor } from "@/scenarios";
import { cn } from "@/lib/utils";
import { PlanWizard } from "./PlanWizard";
import { effortLine, levelRingDash, paceCopy, reviewFirst, streakLabel, totalMinutes } from "./today-model";

const progressOf = (c: Course) => getCourseStore(c).get();
type Icon = ComponentType<LucideProps>;

export function ReadinessRing({ value, forecast, size = 96 }: { value: number; forecast?: number; size?: number }) {
  const r = 42;
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="shrink-0"
      role="img"
      aria-label={`${value}% ready${forecast !== undefined ? `, forecast ${forecast}% by your date` : ""}`}
    >
      <circle cx="50" cy="50" r={r} fill="none" strokeWidth="9" className="stroke-muted" />
      {forecast !== undefined && (
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="9" strokeLinecap="round" transform="rotate(-90 50 50)" className="stroke-primary/30" strokeDasharray={levelRingDash(forecast / 100, r)} />
      )}
      <circle cx="50" cy="50" r={r} fill="none" strokeWidth="9" strokeLinecap="round" transform="rotate(-90 50 50)" className="stroke-primary" strokeDasharray={levelRingDash(value / 100, r)} />
      <text x="50" y="47" textAnchor="middle" dominantBaseline="central" className="fill-foreground" fontSize="22" fontWeight="700">
        {value}%
      </text>
      <text x="50" y="67" textAnchor="middle" dominantBaseline="central" className="fill-muted-foreground" fontSize="11">
        ready
      </text>
    </svg>
  );
}

/** The course the player touched most recently (by streak day, then XP). */
export function recentCourse(): Course | null {
  let best: { c: Course; day: string; xp: number } | null = null;
  for (const c of COURSES) {
    const p = progressOf(c);
    if (p.xp <= 0) continue;
    const day = p.streak.lastDay ?? "";
    if (!best || day > best.day || (day === best.day && p.xp > best.xp)) best = { c, day, xp: p.xp };
  }
  return best?.c ?? null;
}

function bestStreak() {
  return Math.max(0, ...COURSES.map((c) => progressOf(c).streak.count ?? 0));
}

function targetName(target: string) {
  return BUNDLE_BY_ID[target]?.title ?? getCourse(target)?.title ?? target;
}

type SessionSize = { total: number; due: number; fresh: number };

/** "12 questions": the same count /daily shows (due and new together). */
export function reviewLabel(s: SessionSize) {
  return `${s.total} ${s.total === 1 ? "question" : "questions"}`;
}

type ItemLink = { href: string; icon: Icon; title: string; sub: string };

function itemLink(item: PlanItem, session: SessionSize): ItemLink {
  switch (item.kind) {
    case "review":
      return { href: "/daily", icon: RotateCcw, title: `Review · ${reviewLabel(session)}`, sub: "Recall what you learned before. This is what makes it stick." };
    case "lesson":
      return { href: `/c/${item.courseId}/lesson/${item.lessonId}`, icon: BookOpen, title: item.title, sub: `Lesson · ${item.courseTitle}` };
    case "practice":
      return { href: `/c/${item.courseId}/study`, icon: Target, title: "Practise the topics you find hardest", sub: item.courseTitle };
    case "mock":
      return { href: `/c/${item.courseId}/exam`, icon: ClipboardCheck, title: "Mock exam", sub: `${item.courseTitle} · final stretch` };
  }
}

/** The "Today" panel: one primary action, review first, then the rest of today's plan. */
export function Today({ plan }: { plan: StudyPlan | null }) {
  const srs = useSrs();
  useEffect(() => syncFromProgress(), []);
  const [editing, setEditing] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const session = useMemo(() => dailySessionSize(plan), [plan, srs]);
  const due = session.total;
  const recent = recentCourse();
  const streak = bestStreak();

  if (!plan || editing) {
    return (
      <section aria-labelledby="plan-h" id="plan" className="mt-8 scroll-mt-20">
        <h2 id="plan-h" className="font-heading text-h3 font-semibold text-foreground">
          {plan ? "Edit your plan" : "Start a plan"}
        </h2>
        {!plan && (
          <p className="mt-1 max-w-[65ch] text-base text-muted-foreground">
            Three quick questions. We split it into a few minutes a day, with reviews timed so you remember it.
          </p>
        )}
        <div className="mt-4">
          <PlanWizard initial={plan} onDone={plan ? () => setEditing(false) : undefined} />
        </div>
        {!plan && (due > 0 || recent) && <QuickLinks session={session} recent={recent} streak={streak} />}
      </section>
    );
  }

  const s = todaySummary(plan, progressOf, todayKey(), due);
  // A brand-new beginner gets one calm next step, not a dashboard of reviews, games and stats.
  if (s.newLearner) return <FirstSteps plan={plan} onEdit={() => setEditing(true)} />;
  const items = reviewFirst(s.items);
  const minutes = totalMinutes(items);
  const pace = paceCopy(s.days, s.forecast, onTrack(s.forecast));
  const courses = targetCourses(plan.target);
  const streakText = streakLabel(streak);

  return (
    <Card render={<section aria-labelledby="today-h" />} className="mt-8 gap-0 p-4 sm:p-6">
      <div className="flex items-start gap-4">
        <ReadinessRing value={s.readiness} forecast={plan.date ? s.forecast : undefined} />
        <div className="min-w-0 flex-1">
          <h2 id="today-h" className="text-sm font-semibold uppercase tracking-wider text-primary">
            Today
          </h2>
          <p className="mt-1 font-heading text-h4 font-semibold text-foreground">{targetName(plan.target)}</p>
          <p className="mt-1 text-base text-muted-foreground">
            {pace.line}
            {plan.date && s.days !== null && s.days > 0 ? ` · ${formatDate(plan.date)}` : ""}
          </p>
          {pace.pace && (
            <p className={cn("mt-1 flex items-start gap-1.5 text-sm", pace.tone === "good" ? "text-success-foreground" : "text-info-foreground")}>
              {pace.tone === "good" ? <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden /> : <Info className="mt-0.5 size-4 shrink-0" aria-hidden />}
              {pace.pace}
            </p>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)} className="hidden sm:inline-flex">
          <Pencil aria-hidden />
          Edit plan
        </Button>
      </div>

      {plan.level === "beginner" && s.done >= EASE_IN_LESSONS && s.done < EASE_IN_LESSONS + 2 && (
        <p className="mt-4 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-foreground">
          You&apos;ve read {s.done} lessons. Reviews, practice games and your progress are open now.
        </p>
      )}

      <ContinueButton first={items[0] ? itemLink(items[0], session) : null} planCourses={courses} />

      <div className="mt-6 flex items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">Today&apos;s plan</h3>
        <span className="text-sm text-muted-foreground">about {minutes} min</span>
      </div>
      <ol className="mt-2 grid gap-2">
        {items.map((item, i) => (
          <li key={i}>
            <PlanRow link={itemLink(item, session)} minutes={item.minutes} highlight={item.kind === "review"} />
          </li>
        ))}
        {items.length === 0 && <li className="text-base text-muted-foreground">Every lesson in your plan is done. A mock exam or a review keeps it fresh.</li>}
        {plan.goal === "interview" &&
          courses.some((id) => {
            const c = getCourse(id);
            return !!c && hasCodeGames(c);
          }) && (
            <li>
              <PlanRow link={{ href: "/warmup", icon: Zap, title: "Daily code warm-up", sub: "6 mixed code games: Parsons, Spot the Bug, Predict the Output" }} minutes={5} />
            </li>
          )}
        <ScenarioRow courseIds={courses} />
      </ol>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
        <span>{effortLine(s.done, s.total)}</span>
        {streakText && (
          <span className="flex items-center gap-1 text-reward">
            <Flame className="size-4" aria-hidden />
            {streakText}
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {!items.some((i) => i.kind === "review") && session.total > 0 && (
          <Button variant="outline" render={<Link href="/daily" />}>
            <RotateCcw aria-hidden />
            Review · {reviewLabel(session)}
          </Button>
        )}
        {recent && !courses.includes(recent.id) && (
          <Button variant="outline" render={<Link href={`/c/${recent.id}`} />}>
            Continue {recent.shortTitle}
          </Button>
        )}
        <Button variant="ghost" onClick={() => setEditing(true)} className="sm:hidden">
          <Pencil aria-hidden />
          Edit plan
        </Button>
      </div>
    </Card>
  );
}

function PlanRow({ link, minutes, highlight = false }: { link: ItemLink; minutes: number; highlight?: boolean }) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      className={cn(
        "flex min-h-14 items-center gap-3 rounded-card border p-3 outline-none transition-colors duration-150 hover:border-primary/60 hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring",
        highlight ? "border-primary/40 bg-primary/5" : "border-border",
      )}
    >
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-md", highlight ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground")}>
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-medium text-foreground">{link.title}</span>
        <span className="block truncate text-sm text-muted-foreground">{link.sub}</span>
      </span>
      <span className="shrink-0 text-sm text-muted-foreground">{minutes} min</span>
    </Link>
  );
}

/** What a brand-new beginner sees: one lesson, one button, no tests until they've read something. */
function FirstSteps({ plan, onEdit }: { plan: StudyPlan; onEdit: () => void }) {
  const step = nextStep(plan, progressOf);
  const course = planCourses(plan)[0];
  return (
    <Card render={<section aria-labelledby="first-h" />} className="mt-8 p-5 sm:p-8">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h2 id="first-h" className="text-sm font-semibold uppercase tracking-wider text-primary">
            {step?.isFirst === false ? "Your next lesson" : "Your first lesson"}
          </h2>
          <p className="mt-1 font-heading text-h3 font-semibold text-foreground">{step?.title ?? targetName(plan.target)}</p>
          <p className="mt-1 text-base text-muted-foreground">
            {targetName(plan.target)}
            {step ? ` · Lesson ${step.number} of ${step.total}` : ""}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil aria-hidden />
          <span className="hidden sm:inline">Edit plan</span>
          <span className="sr-only sm:hidden">Edit plan</span>
        </Button>
      </div>
      <p className="mt-4 max-w-[65ch] text-body text-foreground/90">
        We&apos;ll go one small idea at a time. You read a little first, and there are no tests until you&apos;ve read it.
      </p>
      <Button size="xl" className="mt-5 w-full sm:w-auto" render={<Link href={step?.href ?? (course ? `/c/${course.id}` : "/")} />}>
        <Play aria-hidden />
        {step?.isFirst === false ? "Continue lesson" : "Start lesson"}
        <ArrowRight aria-hidden />
      </Button>
      <p className="mt-3 text-sm text-muted-foreground">About 5 minutes. You can stop any time and pick up where you left off.</p>
    </Card>
  );
}

function QuickLinks({ session, recent, streak }: { session: SessionSize; recent: Course | null; streak: number }) {
  const streakText = streakLabel(streak);
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {session.total > 0 && (
        <Button variant="outline" render={<Link href="/daily" />}>
          <RotateCcw aria-hidden />
          Review · {reviewLabel(session)}
        </Button>
      )}
      {recent && (
        <Button variant="outline" render={<Link href={`/c/${recent.id}`} />}>
          Continue {recent.shortTitle}
          <ArrowRight aria-hidden />
        </Button>
      )}
      {streakText && (
        <span className="flex items-center gap-1 text-sm text-reward">
          <Flame className="size-4" aria-hidden />
          {streakText}
        </span>
      )}
    </div>
  );
}

/** The single primary action: the last lesson opened in a plan course, else the first plan item (review first). */
function ContinueButton({ first, planCourses }: { first: ItemLink | null; planCourses: string[] }) {
  const last = lastLesson(planCourses);
  const course = last ? getCourse(last.courseId) : null;
  const target = course && last ? { href: `/c/${course.id}/lesson/${last.lessonId}`, title: last.title, sub: course.shortTitle } : first;
  if (!target) return null;
  return (
    <Button size="xl" className="mt-5 h-auto min-h-12 w-full justify-start py-2 text-left" render={<Link href={target.href} />}>
      <Play aria-hidden />
      <span className="font-semibold">Continue</span>
      <span className="min-w-0 flex-1 truncate font-normal opacity-90">
        {target.title} · {target.sub}
      </span>
      <ArrowRight aria-hidden />
    </Button>
  );
}

/** Plan row for the scenario games, pointing at the first planned course that has them. */
function ScenarioRow({ courseIds }: { courseIds: string[] }) {
  const id = courseIds.find(hasScenarios);
  const course = id ? getCourse(id) : undefined;
  if (!id || !course) return null;
  const kinds = new Set(scenariosFor(id).map((x) => x.type));
  const names = [kinds.has("architect") && "Architecture Builder", kinds.has("chain") && "Scenario Chains", kinds.has("matcher") && "Service Matcher", kinds.has("interview") && "Mock Interview"]
    .filter(Boolean)
    .join(", ");
  return (
    <li>
      <PlanRow link={{ href: `/c/${id}/scenarios`, icon: Boxes, title: `Scenario games · ${course.shortTitle}`, sub: names }} minutes={10} />
    </li>
  );
}

/** Same footprint as the plan card, shown until local progress is read (no empty-box flash). */
export function TodaySkeleton() {
  return (
    <div className="mt-8 rounded-2xl border border-border p-4 sm:p-6" aria-busy="true" aria-label="Loading your plan">
      <div className="flex items-start gap-4">
        <Skeleton className="size-24 rounded-full" />
        <div className="flex-1 space-y-2 pt-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <Skeleton className="mt-5 h-12 w-full rounded-lg" />
      <div className="mt-6 space-y-2">
        <Skeleton className="h-14 w-full rounded-card" />
        <Skeleton className="h-14 w-full rounded-card" />
        <Skeleton className="h-14 w-full rounded-card" />
      </div>
    </div>
  );
}
