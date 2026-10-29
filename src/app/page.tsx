"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bar, Stars, StatPill } from "@/components/ui";
import { DOMAINS } from "@/data/domains";
import { QUESTIONS } from "@/data/questions";
import { BADGES } from "@/lib/badges";
import { domainMastery, missedQuestions, overallReadiness } from "@/lib/game";
import { levelInfo, resetProgress, setDailyGoal, useProgress } from "@/lib/store";

export default function Home() {
  const p = useProgress();
  const lvl = levelInfo(p.xp);
  const readiness = Math.round(overallReadiness(p));
  const missed = missedQuestions(p).length;
  const answered = Object.keys(p.questions).length;
  const todayXp = p.today.xp;

  const modes = [
    { href: "/boss", icon: "🐉", name: "Boss Battle", desc: "40-question mock exam, scored 100-1000", meta: p.bossBest !== null ? `Best ${p.bossBest}` : "Not attempted", accent: "from-rose-500/20" },
    { href: "/lightning", icon: "⚡", name: "Lightning Round", desc: "60 seconds. As many as you can.", meta: `Best ${p.lightningBest}`, accent: "from-amber-400/20" },
    { href: "/match", icon: "🧩", name: "Service Match", desc: "Pair AWS services with use cases", meta: p.matchBestSeconds !== null ? `Best ${p.matchBestSeconds}s` : "Not attempted", accent: "from-sky-500/20" },
    { href: "/flashcards", icon: "🃏", name: "Flashcards", desc: "Spaced repetition for key terms", meta: `${Object.values(p.cards).filter((b) => b >= 4).length} mastered`, accent: "from-violet-500/20" },
    { href: "/review", icon: "🔁", name: "Review Mistakes", desc: "Re-attempt what you missed", meta: `${missed} to fix`, accent: "from-emerald-500/20" },
    { href: "/cheatsheet", icon: "📜", name: "Cheat Sheet", desc: "Everything on one page", meta: "Read before a session", accent: "from-slate-400/20" },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/15 via-violet-500/10 to-transparent p-6 sm:p-8">
        <div className="text-sm font-semibold uppercase tracking-wider text-sky-300">AWS Certified AI Practitioner · AIF-C01</div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black text-white">
          Level {lvl.level} · {lvl.title}
        </h1>
        <div className="mt-4 max-w-md">
          <div className="mb-1 flex justify-between text-xs text-slate-400">
            <span>
              {lvl.into} / {lvl.needed} XP to next level
            </span>
            <span>{p.xp} total</span>
          </div>
          <Bar value={lvl.into / lvl.needed} className="h-2.5" />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <StatPill icon="📈" label="Exam readiness" value={`${readiness}%`} />
          <StatPill icon="🔥" label="Day streak" value={p.streak.count} />
          <StatPill
            icon="🎯"
            label="Today"
            value={
              <span>
                {todayXp}/
                <select
                  aria-label="Daily XP goal"
                  value={p.dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  className="bg-transparent font-semibold text-white outline-none"
                >
                  {[50, 100, 150, 250, 400].map((g) => (
                    <option key={g} value={g} className="bg-slate-900">
                      {g}
                    </option>
                  ))}
                </select>{" "}
                XP
              </span>
            }
          />
          <StatPill icon="❓" label="Questions seen" value={`${answered}/${QUESTIONS.length}`} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">🗺️ The five worlds</h2>
        <p className="mt-1 text-sm text-slate-400">Each world is an exam domain. Bigger worlds carry more of your score.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((d) => {
            const mastery = domainMastery(p, d.id);
            return (
              <Link
                key={d.id}
                href={`/quest/${d.id}`}
                className="group rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition hover:-translate-y-0.5 hover:border-white/25"
                style={{ boxShadow: `inset 0 3px 0 0 ${d.color}` }}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{d.emoji}</span>
                  <span className="rounded-full px-2 py-0.5 text-xs font-bold text-slate-950" style={{ background: d.color }}>
                    {d.weight}%
                  </span>
                </div>
                <div className="mt-3 text-xs uppercase tracking-wider text-slate-400">Domain {d.number}</div>
                <div className="font-bold text-white">{d.world}</div>
                <div className="text-sm text-slate-400">{d.name}</div>
                <div className="mt-4 flex items-center justify-between">
                  <Stars count={p.questStars[d.id] ?? 0} size="text-base" />
                  <span className="text-xs text-slate-400">{Math.round(mastery * 100)}% mastered</span>
                </div>
                <Bar value={mastery} color={d.color} className="mt-2 h-1.5" />
                <div className="mt-4 text-sm font-semibold text-sky-300 group-hover:underline">Play quest →</div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">🎮 Game modes</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modes.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`rounded-2xl border border-white/10 bg-gradient-to-br ${m.accent} to-slate-900/60 p-5 transition hover:-translate-y-0.5 hover:border-white/25`}
            >
              <div className="text-3xl">{m.icon}</div>
              <div className="mt-2 font-bold text-white">{m.name}</div>
              <div className="text-sm text-slate-400">{m.desc}</div>
              <div className="mt-3 text-xs font-semibold text-slate-300">{m.meta}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">
          🏅 Badges{" "}
          <span className="text-sm font-normal text-slate-400">
            {p.badges.length}/{BADGES.length}
          </span>
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {BADGES.map((b) => {
            const got = p.badges.includes(b.id);
            return (
              <div
                key={b.id}
                title={b.description}
                className={`rounded-xl border p-3 text-center ${got ? "border-amber-300/40 bg-amber-300/10" : "border-white/5 bg-white/[0.02]"}`}
              >
                <div className={`text-3xl ${got ? "" : "opacity-25 grayscale"}`}>{b.icon}</div>
                <div className={`mt-1 text-sm font-semibold ${got ? "text-white" : "text-slate-500"}`}>{b.name}</div>
                <div className="text-[11px] leading-snug text-slate-500">{b.description}</div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500">
        <span>Progress is saved in this browser. Not affiliated with AWS.</span>
        <ResetButton />
      </footer>
    </main>
  );
}

function ResetButton() {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);

  return (
    <button
      type="button"
      onClick={() => {
        if (armed) {
          resetProgress();
          setArmed(false);
        } else setArmed(true);
      }}
      className="rounded-lg border border-white/10 px-3 py-1.5 hover:border-rose-400/50 hover:text-rose-300"
    >
      {armed ? "Click again to erase all progress" : "Reset progress"}
    </button>
  );
}
