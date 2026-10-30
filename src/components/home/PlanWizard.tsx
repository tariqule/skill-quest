"use client";

import { useState, type ReactNode } from "react";
import { COURSES, getCourse } from "@/courses";
import { BUNDLES, targetCourses } from "@/engine/bundles";
import { levelOptions, type LevelChoice } from "@/engine/levels";
import type { PlanGoal, StudyPlan } from "@/engine/plan";
import { setPlan } from "@/engine/plan-store";
import { setProfile } from "@/engine/profile";
import { todayKey } from "@/engine/store";
import { setSharedLevel } from "@/engine/track-level";
import { isCodeTrack } from "@/engine/tracks";
import type { Course } from "@/engine/types";

const GOALS: { id: PlanGoal; icon: string; title: string; line: string }[] = [
  { id: "exam", icon: "🎓", title: "An exam", line: "AWS, Google Cloud, Azure or Kubernetes certification." },
  { id: "interview", icon: "🎤", title: "An interview", line: "A role (frontend, backend, cloud…) or one topic." },
  { id: "skill", icon: "🌱", title: "Learn a skill", line: "No deadline. Build a steady habit." },
];

const MINUTES = [10, 20, 30, 45, 60];

const CERTS = COURSES.filter((c) => !isCodeTrack(c));
const CODE = COURSES.filter((c) => isCodeTrack(c));

function targetsFor(goal: PlanGoal): { group: string; options: { id: string; label: string }[] }[] {
  if (goal === "exam") {
    const providers = [...new Set(CERTS.map((c) => c.provider.name))];
    return providers.map((p) => ({ group: p, options: CERTS.filter((c) => c.provider.name === p).map((c) => ({ id: c.id, label: `${c.code} · ${c.title}` })) }));
  }
  if (goal === "interview") {
    return [
      { group: "Role bundles", options: BUNDLES.map((b) => ({ id: b.id, label: `${b.icon} ${b.title}` })) },
      { group: "One topic", options: CODE.filter((c) => c.kind === "interview").map((c) => ({ id: c.id, label: c.title })) },
    ];
  }
  return [
    { group: "Start from zero", options: CODE.filter((c) => c.kind === "learning").map((c) => ({ id: c.id, label: c.title })) },
    { group: "Languages and tools", options: CODE.filter((c) => c.kind !== "learning").map((c) => ({ id: c.id, label: c.title })) },
    { group: "Cloud", options: CERTS.map((c) => ({ id: c.id, label: c.title })) },
  ];
}

export function PlanWizard({ initial, onDone }: { initial?: StudyPlan | null; onDone?: () => void }) {
  const [goal, setGoal] = useState<PlanGoal>(initial?.goal ?? "exam");
  const groups = targetsFor(goal);
  const [target, setTarget] = useState<string>(initial?.target ?? groups[0].options[0].id);
  const [date, setDate] = useState<string>(initial?.date ?? "");
  const [level, setLevel] = useState<string>(initial?.level ?? "beginner");
  const [minutes, setMinutes] = useState<number>(initial?.minutesPerDay ?? 20);

  const valid = groups.some((g) => g.options.some((o) => o.id === target));
  const courses = targetCourses(valid ? target : groups[0].options[0].id)
    .map((id) => getCourse(id))
    .filter((c): c is Course => !!c);
  const levels = levelOptions(courses[0] ?? { kind: "learning" }).filter((l) => l.id !== "all");
  const today = todayKey();

  function pickGoal(g: PlanGoal) {
    setGoal(g);
    setTarget(targetsFor(g)[0].options[0].id);
    setLevel("beginner");
  }

  function save() {
    const plan: StudyPlan = { goal, target: valid ? target : groups[0].options[0].id, date: date || null, level, minutesPerDay: minutes, created: today };
    setPlan(plan);
    setProfile({ goal: goal === "exam" ? "cert" : goal === "interview" ? "interview" : "code", level: level as LevelChoice });
    setSharedLevel(courses, level as LevelChoice);
    onDone?.();
  }

  return (
    <form
      className="rounded-3xl border-2 border-sky-400/30 bg-slate-900/70 p-4 sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <Field n={1} label="What are you preparing for?">
        <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="What are you preparing for?">
          {GOALS.map((g) => (
            <button
              key={g.id}
              type="button"
              role="radio"
              aria-checked={goal === g.id}
              onClick={() => pickGoal(g.id)}
              className={`rounded-2xl border-2 p-3 text-left transition ${goal === g.id ? "border-sky-400 bg-sky-400/15" : "border-white/10 bg-slate-950/40 hover:border-white/30"}`}
            >
              <div className="text-base font-black text-white">
                {g.icon} {g.title}
              </div>
              <div className="mt-0.5 text-sm text-slate-300">{g.line}</div>
            </button>
          ))}
        </div>
      </Field>

      <Field n={2} label={goal === "exam" ? "Which exam?" : goal === "interview" ? "Which role or topic?" : "Which skill?"} htmlFor="plan-target">
        <select
          id="plan-target"
          value={valid ? target : groups[0].options[0].id}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full rounded-xl border border-white/20 bg-slate-950 px-3 py-3 text-base text-white"
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
        {courses.length > 1 && <p className="mt-2 text-sm text-slate-300">Covers {courses.map((c) => c.shortTitle).join(", ")}.</p>}
      </Field>

      <div className="grid gap-x-4 sm:grid-cols-2">
        <Field n={3} label={goal === "skill" ? "Target date (optional)" : goal === "exam" ? "Exam date" : "Interview date"} htmlFor="plan-date">
          <input
            id="plan-date"
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-slate-950 px-3 py-3 text-base text-white [color-scheme:dark]"
          />
          <p className="mt-1 text-sm text-slate-400">No date yet? Leave it empty and we&apos;ll keep a steady pace.</p>
        </Field>
        <Field n={4} label="Minutes a day" htmlFor="plan-min">
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Minutes a day">
            {MINUTES.map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={minutes === m}
                onClick={() => setMinutes(m)}
                className={`min-w-14 rounded-xl border-2 px-3 py-2 text-base font-bold ${minutes === m ? "border-sky-400 bg-sky-400/15 text-white" : "border-white/10 text-slate-200"}`}
              >
                {m}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <Field n={5} label="Your level">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Your level">
          {levels.map((l) => (
            <button
              key={l.id}
              type="button"
              role="radio"
              aria-checked={level === l.id}
              onClick={() => setLevel(l.id)}
              title={l.blurb}
              className={`rounded-xl border-2 px-3 py-2 text-base font-bold ${level === l.id ? "text-white" : "border-white/10 text-slate-200"}`}
              style={level === l.id ? { borderColor: l.color, background: `${l.color}26` } : undefined}
            >
              {l.icon} {l.name}
            </button>
          ))}
        </div>
      </Field>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" className="rounded-2xl bg-sky-400 px-6 py-3 text-base font-black text-slate-950 hover:bg-sky-300">
          {initial ? "Update my plan" : "Build my plan"}
        </button>
        {initial && onDone && (
          <button type="button" onClick={onDone} className="rounded-2xl border border-white/20 px-5 py-3 text-base font-bold text-slate-200">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function Field({ n, label, htmlFor, children }: { n: number; label: string; htmlFor?: string; children: ReactNode }) {
  const Label = htmlFor ? "label" : "div";
  return (
    <div className="mt-4 first:mt-0">
      <Label htmlFor={htmlFor} className="mb-2 flex items-center gap-2 text-base font-black text-white">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-400 text-sm text-slate-950">{n}</span>
        {label}
      </Label>
      {children}
    </div>
  );
}
