"use client";

import { useRouter } from "next/navigation";
import { useState, type ComponentType, type ReactNode } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Check,
  Compass,
  GraduationCap,
  Landmark,
  Layers,
  Puzzle,
  Rocket,
  Sprout,
  Target,
  type LucideProps,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupPrimitive, RadioPrimitive } from "@/components/ui/radio-group";
import { courseSummaries, courseSummary, ensureCourses } from "@/api/client";
import { BUNDLES, targetCourses } from "@/engine/bundles";
import { planLevelOptions, type LevelChoice } from "@/engine/levels";
import { nextStep } from "@/engine/next-step";
import { pickGoalFields, type PlanGoal, type StudyPlan } from "@/engine/plan";
import { setPlan } from "@/engine/plan-store";
import { setProfile } from "@/engine/profile";
import { getCourseStore, todayKey } from "@/engine/store";
import type { CourseSummary } from "@/api/wire";
import { setSharedLevel } from "@/engine/track-level";
import { isCodeTrack } from "@/engine/tracks";
import { cardChange, motionSafe } from "@/design/motion";
import { cn } from "@/lib/utils";
import { canJumpTo, clampStep, LAST_STEP, primaryLabel, WIZARD_STEPS, type WizardStep } from "./wizard-model";

type Icon = ComponentType<LucideProps>;

const GOALS: { id: PlanGoal; icon: Icon; title: string; line: string }[] = [
  { id: "exam", icon: GraduationCap, title: "An exam", line: "AWS, Google Cloud, Azure or Kubernetes certification." },
  { id: "interview", icon: Briefcase, title: "An interview", line: "A role (frontend, backend, cloud…) or one topic." },
  { id: "skill", icon: Sprout, title: "Learn a skill", line: "No deadline. Build a steady habit." },
];

/** Lucide stand-ins for the level emoji (data keeps its emoji for other screens until their PRs). */
export const LEVEL_ICONS: Record<LevelChoice, Icon> = {
  beginner: Sprout,
  junior: Compass,
  intermediate: Puzzle,
  senior: Rocket,
  staff: Landmark,
  exam: Target,
  all: Layers,
};

const MINUTES = [10, 20, 30, 45, 60];

function targetsFor(goal: PlanGoal): { group: string; options: { id: string; label: string }[] }[] {
  const CERTS = courseSummaries().filter((c) => !isCodeTrack(c));
  const CODE = courseSummaries().filter((c) => isCodeTrack(c));
  if (goal === "exam") {
    const providers = [...new Set(CERTS.map((c) => c.provider.name))];
    return providers.map((p) => ({ group: p, options: CERTS.filter((c) => c.provider.name === p).map((c) => ({ id: c.id, label: `${c.code} · ${c.title}` })) }));
  }
  if (goal === "interview") {
    return [
      { group: "Role bundles", options: BUNDLES.map((b) => ({ id: b.id, label: b.title })) },
      { group: "One topic", options: CODE.filter((c) => c.kind === "interview").map((c) => ({ id: c.id, label: c.title })) },
    ];
  }
  return [
    { group: "Start from zero", options: CODE.filter((c) => c.kind === "learning").map((c) => ({ id: c.id, label: c.title })) },
    { group: "Languages and tools", options: CODE.filter((c) => c.kind !== "learning").map((c) => ({ id: c.id, label: c.title })) },
    { group: "Cloud", options: CERTS.map((c) => ({ id: c.id, label: c.title })) },
  ];
}

/** Plan setup as a three-step Stepper: goal, then topic and level, then time. */
export function PlanWizard({ initial, onDone }: { initial?: StudyPlan | null; onDone?: () => void }) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [step, setStep] = useState<WizardStep>(0);
  const [furthest, setFurthest] = useState<number>(initial ? LAST_STEP : 0);
  const [goal, setGoal] = useState<PlanGoal>(initial?.goal ?? "exam");
  const groups = targetsFor(goal);
  const [target, setTarget] = useState<string>(initial?.target ?? groups[0].options[0].id);
  const [date, setDate] = useState<string>(initial?.date ?? "");
  const [level, setLevel] = useState<string>(initial?.level ?? "beginner");
  const [minutes, setMinutes] = useState<number>(initial?.minutesPerDay ?? 20);

  const valid = groups.some((g) => g.options.some((o) => o.id === target));
  const courses = targetCourses(valid ? target : groups[0].options[0].id)
    .map(courseSummary)
    .filter((c): c is CourseSummary => !!c);
  const levels = planLevelOptions(courses[0] ?? { kind: "learning" });
  const today = todayKey();

  function go(n: number) {
    const s = clampStep(n);
    setStep(s);
    setFurthest((f) => Math.max(f, s));
  }

  function pickGoal(g: PlanGoal) {
    const next = pickGoalFields({ goal, target, date, level }, g, (x) => targetsFor(x)[0].options[0].id);
    setGoal(next.goal);
    setTarget(next.target);
    setDate(next.date);
    setLevel(next.level);
  }

  function save() {
    const plan: StudyPlan = { goal, target: valid ? target : groups[0].options[0].id, date: date || null, level, minutesPerDay: minutes, created: today };
    setPlan(plan);
    setProfile({ goal: goal === "exam" ? "cert" : goal === "interview" ? "interview" : "code", level: level as LevelChoice });
    setSharedLevel(courses, level as LevelChoice);
    onDone?.();
    // A first-time beginner goes straight into lesson 1: teach first, no dashboard to decode.
    if (!initial && level === "beginner") {
      // The plan's course content is loaded only now; if that fails, the plan card still shows.
      ensureCourses(targetCourses(plan.target)).then(
        () => {
          const s = nextStep(plan, (c) => getCourseStore(c).get());
          if (s?.isFirst) router.push(s.href);
        },
        () => undefined,
      );
    }
  }

  const variants = motionSafe(cardChange, reduced);

  return (
    <Card
      render={
        <form
          aria-label={initial ? "Edit your plan" : "Build your plan"}
          onSubmit={(e) => {
            e.preventDefault();
            if (step < LAST_STEP) go(step + 1);
            else save();
          }}
        />
      }
      className="gap-0 p-4 sm:p-6"
    >
      <Stepper step={step} furthest={furthest} onJump={go} />

      <div className="mt-6">
        <AnimatePresence mode="popLayout" initial={false}>
          <m.div key={step} variants={variants} initial="initial" animate="animate" exit="exit">
            {step === 0 && (
              <Field label="What are you preparing for?">
                <CardRadios
                  label="What are you preparing for?"
                  value={goal}
                  onChange={(v) => pickGoal(v as PlanGoal)}
                  className="sm:grid-cols-3"
                  options={GOALS.map((g) => ({ value: g.id, icon: g.icon, title: g.title, line: g.line }))}
                />
              </Field>
            )}

            {step === 1 && (
              <>
                <Field label={goal === "exam" ? "Which exam?" : goal === "interview" ? "Which role or topic?" : "Which skill?"} htmlFor="plan-target">
                  <select
                    id="plan-target"
                    value={valid ? target : groups[0].options[0].id}
                    onChange={(e) => setTarget(e.target.value)}
                    className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {groups.map((g) => (
                      <optgroup key={g.group} label={g.group}>
                        {g.options.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {courses.length > 1 && <p className="mt-2 text-sm text-muted-foreground">Covers {courses.map((c) => c.shortTitle).join(", ")}.</p>}
                </Field>
                <Field label="Your level">
                  <CardRadios
                    label="Your level"
                    value={level}
                    onChange={setLevel}
                    className="sm:grid-cols-2"
                    options={levels.map((l) => ({ value: l.id, icon: LEVEL_ICONS[l.id] ?? BadgeCheck, title: l.name, line: l.blurb }))}
                  />
                </Field>
              </>
            )}

            {step === 2 && (
              <>
                <Field label={goal === "skill" ? "Target date (optional)" : goal === "exam" ? "Exam date" : "Interview date"} htmlFor="plan-date">
                  <Input id="plan-date" size="lg" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="[color-scheme:dark]" />
                  <p className="mt-2 text-sm text-muted-foreground">No date yet? Leave it empty and we&apos;ll keep a steady pace.</p>
                </Field>
                <Field label="Minutes a day">
                  <RadioGroupPrimitive
                    aria-label="Minutes a day"
                    value={String(minutes)}
                    onValueChange={(v) => setMinutes(Number(v))}
                    className="flex flex-wrap gap-2"
                  >
                    {MINUTES.map((n) => (
                      <RadioPrimitive.Root
                        key={n}
                        value={String(n)}
                        className="flex h-11 min-w-16 items-center justify-center rounded-lg border border-input px-3 text-base font-medium text-foreground outline-none transition-colors duration-150 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring data-checked:border-primary data-checked:bg-primary/15"
                      >
                        {n} min
                      </RadioPrimitive.Root>
                    ))}
                  </RadioGroupPrimitive>
                  <p className="mt-2 text-sm text-muted-foreground">Short, regular sessions beat long, rare ones. You can change this any time.</p>
                </Field>
              </>
            )}
          </m.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:items-center">
        {step > 0 ? (
          <Button type="button" variant="ghost" size="lg" onClick={() => go(step - 1)}>
            <ArrowLeft aria-hidden />
            Back
          </Button>
        ) : (
          initial &&
          onDone && (
            <Button type="button" variant="ghost" size="lg" onClick={onDone}>
              Cancel
            </Button>
          )
        )}
        <Button type="submit" size="xl" className="w-full sm:ml-auto sm:w-auto">
          {primaryLabel(step, !!initial)}
          {step < LAST_STEP ? <ArrowRight aria-hidden /> : <Check aria-hidden />}
        </Button>
      </div>
    </Card>
  );
}

/** Step indicator: numbered, labelled, done steps marked with a tick (not colour alone). */
function Stepper({ step, furthest, onJump }: { step: number; furthest: number; onJump: (n: number) => void }) {
  return (
    <nav aria-label="Plan steps">
      <p className="text-sm text-muted-foreground sm:hidden">
        Step {step + 1} of {WIZARD_STEPS.length} · <span className="text-foreground">{WIZARD_STEPS[step].label}</span>
      </p>
      <ol className="mt-2 flex items-center gap-2 sm:mt-0">
        {WIZARD_STEPS.map((s, i) => {
          const done = i < step;
          const current = i === step;
          const jump = canJumpTo(i, furthest) && !current;
          return (
            <li key={s.id} className="flex min-w-0 flex-1 items-center gap-2">
              <button
                type="button"
                disabled={!jump}
                onClick={() => onJump(i)}
                aria-current={current ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${s.label}${done ? ", done" : current ? ", current" : ""}`}
                className="flex min-h-11 min-w-0 items-center gap-2 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring enabled:cursor-pointer disabled:cursor-default"
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                    current && "border-primary bg-primary text-primary-foreground",
                    done && "border-primary bg-primary/15 text-primary",
                    !current && !done && "border-border text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-4" aria-hidden /> : i + 1}
                </span>
                <span className={cn("hidden truncate text-sm sm:inline", current ? "font-semibold text-foreground" : "text-muted-foreground")}>{s.label}</span>
              </button>
              {i < WIZARD_STEPS.length - 1 && <span aria-hidden className={cn("h-px flex-1", i < step ? "bg-primary" : "bg-border")} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function CardRadios({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; icon: Icon; title: string; line: string }[];
  className?: string;
}) {
  return (
    <RadioGroup aria-label={label} value={value} onValueChange={(v) => onChange(String(v))} className={cn("grid gap-2", className)}>
      {options.map((o) => {
        const Icon = o.icon;
        return (
          <RadioPrimitive.Root
            key={o.value}
            value={o.value}
            className="group flex min-h-14 items-start gap-3 rounded-card border border-input p-3 text-left outline-none transition-colors duration-150 hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring data-checked:border-primary data-checked:bg-primary/10"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-data-checked:bg-primary group-data-checked:text-primary-foreground">
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-semibold text-foreground">{o.title}</span>
              <span className="mt-0.5 block text-sm text-muted-foreground">{o.line}</span>
            </span>
            <Check className="mt-1 size-4 shrink-0 text-primary opacity-0 group-data-checked:opacity-100" aria-hidden />
          </RadioPrimitive.Root>
        );
      })}
    </RadioGroup>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: ReactNode }) {
  const Label = htmlFor ? "label" : "div";
  return (
    <div className="mt-5 first:mt-0">
      <Label htmlFor={htmlFor} className="mb-2 block text-base font-semibold text-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}
