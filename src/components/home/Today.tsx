"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { COURSES, getCourse } from "@/courses";
import { BUNDLE_BY_ID } from "@/engine/bundles";
import { formatDate } from "@/engine/game";
import { onTrack, type PlanItem, type StudyPlan } from "@/engine/plan";
import { activeCourseIds, todaySummary } from "@/engine/plan-inputs";
import { dueCount } from "@/engine/srs";
import { syncFromProgress, useSrs } from "@/engine/srs-store";
import { getCourseStore, todayKey } from "@/engine/store";
import type { Course } from "@/engine/types";
import { PlanWizard } from "./PlanWizard";

const progressOf = (c: Course) => getCourseStore(c).get();

export function ReadinessRing({ value, forecast, size = 112 }: { value: number; forecast?: number; size?: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const ring = (v: number) => `${(Math.max(0, Math.min(100, v)) / 100) * c} ${c}`;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={`${value}% ready${forecast !== undefined ? `, forecast ${forecast}% by exam day` : ""}`}>
      <circle cx="50" cy="50" r={r} fill="none" stroke="#ffffff1a" strokeWidth="10" />
      {forecast !== undefined && <circle cx="50" cy="50" r={r} fill="none" stroke="#38bdf855" strokeWidth="10" strokeDasharray={ring(forecast)} transform="rotate(-90 50 50)" strokeLinecap="round" />}
      <circle cx="50" cy="50" r={r} fill="none" stroke="#34d399" strokeWidth="10" strokeDasharray={ring(value)} transform="rotate(-90 50 50)" strokeLinecap="round" />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="22" fontWeight="900">
        {value}%
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

function itemLink(item: PlanItem) {
  switch (item.kind) {
    case "review":
      return { href: "/daily", icon: "🔁", title: `Daily Review · ${item.count} due`, sub: "Spaced repetition across all your courses" };
    case "lesson":
      return { href: `/c/${item.courseId}/lesson/${item.lessonId}`, icon: "📘", title: item.title, sub: `Lesson · ${item.courseTitle}` };
    case "practice":
      return { href: `/c/${item.courseId}/study`, icon: "🎯", title: `Practice your weak spots`, sub: item.courseTitle };
    case "mock":
      return { href: `/c/${item.courseId}/exam`, icon: "📝", title: "Mock exam", sub: `${item.courseTitle} · final stretch` };
  }
}

/** The "Today" dashboard: countdown, readiness ring, today's plan, review due, streak, continue. */
export function Today({ plan }: { plan: StudyPlan | null }) {
  const srs = useSrs();
  useEffect(() => syncFromProgress(), []);
  const [editing, setEditing] = useState(false);
  const now = new Date();
  const active = activeCourseIds(plan, progressOf);
  const due = dueCount(srs, now, active);
  const recent = recentCourse();
  const streak = bestStreak();

  if (!plan || editing) {
    return (
      <section aria-labelledby="plan-h" className="mt-6">
        <h2 id="plan-h" className="text-2xl font-black text-white">
          {plan ? "Edit your plan" : "Get a plan in 30 seconds"}
        </h2>
        {!plan && <p className="mt-1 text-base text-slate-300">Tell us what&apos;s coming up. We&apos;ll split it into a few minutes a day, with reviews timed so you remember it.</p>}
        <div className="mt-4">
          <PlanWizard initial={plan} onDone={plan ? () => setEditing(false) : undefined} />
        </div>
        {!plan && (due > 0 || recent) && <QuickLinks due={due} recent={recent} streak={streak} />}
      </section>
    );
  }

  const s = todaySummary(plan, progressOf, todayKey(), due);
  const minutes = s.items.reduce((n, i) => n + i.minutes, 0);
  const good = onTrack(s.forecast);
  return (
    <section aria-labelledby="today-h" className="mt-6 rounded-3xl border-2 border-emerald-400/30 bg-slate-900/70 p-4 sm:p-6">
      <div className="flex flex-wrap items-start gap-4">
        <ReadinessRing value={s.readiness} forecast={plan.date ? s.forecast : undefined} />
        <div className="min-w-0 flex-1">
          <h2 id="today-h" className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
            Today
          </h2>
          <div className="mt-1 text-xl font-black text-white sm:text-2xl">{targetName(plan.target)}</div>
          <p className="mt-1 text-base text-slate-300">
            {s.days === null
              ? "No date set · steady pace"
              : s.days < 0
                ? `Your date (${formatDate(plan.date!)}) has passed. Set a new one?`
                : s.days === 0
                  ? "It's today. Good luck! 🍀"
                  : `${s.days} day${s.days === 1 ? "" : "s"} to go · ${formatDate(plan.date!)}`}
          </p>
          {plan.date && s.days !== null && s.days > 0 && (
            <p className={`mt-1 text-base font-bold ${good ? "text-emerald-300" : "text-amber-300"}`}>
              {good ? "✅ On track" : "⚠️ Behind"} · forecast {s.forecast}% ready by then
              {!good && " · try more minutes a day"}
            </p>
          )}
          <p className="mt-1 text-sm text-slate-400">
            {s.total - s.remaining}/{s.total} lessons done · 🔥 {streak}-day streak
          </p>
        </div>
        <button type="button" onClick={() => setEditing(true)} className="rounded-xl border border-white/20 px-3 py-2 text-sm font-bold text-slate-200 hover:border-white/40">
          Edit plan
        </button>
      </div>

      <h3 className="mt-5 text-base font-black text-white">
        Today&apos;s plan · about {minutes} min
      </h3>
      <ol className="mt-2 grid gap-2">
        {s.items.map((item, i) => {
          const l = itemLink(item);
          return (
            <li key={i}>
              <Link href={l.href} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3 transition hover:border-emerald-400/60">
                <span className="text-2xl" aria-hidden>
                  {l.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base font-bold text-white">{l.title}</span>
                  <span className="block truncate text-sm text-slate-400">{l.sub}</span>
                </span>
                <span className="shrink-0 text-sm text-slate-300">{item.minutes} min</span>
              </Link>
            </li>
          );
        })}
        {s.items.length === 0 && <li className="text-base text-slate-300">All caught up. Every lesson is done. Try a mock exam or the Daily Review. 🎉</li>}
      </ol>
      <QuickLinks due={due} recent={recent} streak={null} />
    </section>
  );
}

function QuickLinks({ due, recent, streak }: { due: number; recent: Course | null; streak: number | null }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <Link href="/daily" className="rounded-2xl bg-emerald-400 px-4 py-2.5 text-base font-black text-slate-950 hover:bg-emerald-300">
        🔁 Daily Review{due > 0 ? ` · ${due} due` : ""}
      </Link>
      {recent && (
        <Link href={`/c/${recent.id}`} className="rounded-2xl border border-white/20 px-4 py-2.5 text-base font-bold text-white hover:border-white/40">
          {recent.provider.icon} Continue {recent.shortTitle} →
        </Link>
      )}
      {streak !== null && streak > 0 && <span className="self-center text-base text-slate-300">🔥 {streak}-day streak</span>}
    </div>
  );
}
