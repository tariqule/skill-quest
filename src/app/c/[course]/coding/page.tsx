"use client";

import Link from "next/link";
import { Bar } from "@/components/ui";
import { useCourse, useLevelPool, useProgress } from "@/engine/course-context";
import { LEVEL_BY_ID } from "@/engine/levels";

/** Live coding: every challenge at the player's level, grouped by stage. */
export default function CodingList() {
  const { course, href } = useCourse();
  const { level } = useLevelPool();
  const progress = useProgress();
  const all = course.coding ?? [];
  const shown = level === "all" ? all : all.filter((c) => c.level === level);
  const solved = shown.filter((c) => progress.coding[c.id]?.solved).length;
  const skill = LEVEL_BY_ID[level];

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:py-10">
      <Link href={href()} className="font-mono text-sm text-slate-400 hover:text-white">
        ← Back to map
      </Link>
      <h1 className="mt-3 font-mono text-2xl font-black text-white sm:text-3xl">💻 Live coding</h1>
      <p className="mt-1 max-w-2xl text-slate-400">
        Write real code in the editor and run it against tests, like a live interview. Hints are there if you get stuck, but each one costs a bit of XP.
      </p>

      <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-[#07111c]/90 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <div className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: skill.color }}>
            {skill.icon} {skill.name} · {shown.length} {shown.length === 1 ? "challenge" : "challenges"}
          </div>
          <div className="mt-2">
            <Bar value={shown.length ? solved / shown.length : 0} color="#34d399" className="h-2" />
          </div>
          <div className="mt-1 font-mono text-xs text-slate-400">
            {solved}/{shown.length} solved
          </div>
        </div>
        <p className="max-w-xs text-xs text-slate-500">Change the difficulty on the Code Quests page or on this track&apos;s map.</p>
      </div>

      {shown.length === 0 && <p className="mt-8 font-mono text-slate-400">No live coding challenges at this level yet. Try another level.</p>}

      <div className="mt-6 grid gap-6">
        {course.domains.map((d) => {
          const items = shown.filter((c) => c.domain === d.id);
          if (!items.length) return null;
          return (
            <section key={d.id}>
              <h2 className="font-mono text-sm font-black uppercase tracking-wider" style={{ color: d.color }}>
                {d.emoji} Stage {d.number} · {d.world}
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {items.map((c) => {
                  const st = progress.coding[c.id];
                  const lv = LEVEL_BY_ID[c.level];
                  return (
                    <Link
                      key={c.id}
                      href={href(`/coding/${c.id}`)}
                      className="group flex flex-col rounded-xl border bg-[#07111c]/90 p-4 transition hover:-translate-y-0.5"
                      style={{ borderColor: st?.solved ? "#34d39988" : "rgb(255 255 255 / 0.1)" }}
                    >
                      <div className="flex items-center gap-2 font-mono text-[11px] font-bold">
                        <span className="rounded px-1.5 py-0.5" style={{ background: `${lv.color}22`, color: lv.color }}>
                          {lv.icon} {lv.name}
                        </span>
                        {c.idea && <span className="truncate text-slate-500">{c.idea}</span>}
                        <span className="ml-auto text-base">{st?.solved ? "✅" : st ? "✏️" : "▶️"}</span>
                      </div>
                      <div className="mt-2 font-mono text-base font-black text-white group-hover:text-emerald-200">{c.title}</div>
                      <div className="mt-1 font-mono text-[11px] text-slate-500">
                        {c.tests.length} tests{st ? ` · ${st.attempts} ${st.attempts === 1 ? "run" : "runs"}` : ""}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
