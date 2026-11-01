"use client";

import Link from "next/link";
import { LANGUAGE_LABEL, languageOf } from "@/engine/coding-langs";
import { Bar } from "@/components/ui";
import { useCourse, useLevelPool, useProgress } from "@/engine/course-context";
import { LEVEL_BY_ID } from "@/engine/levels";
import { BlockIcon } from "@/components/learn/block-icons";

/** Live coding: every challenge at the player's level, grouped by stage. */
export default function CodingList() {
  const { course, href } = useCourse();
  const { level } = useLevelPool();
  const progress = useProgress();
  const all = course.coding ?? [];
  // Challenges start at Junior; beginners see those as their first steps.
  const target = level === "beginner" && !all.some((c) => c.level === "beginner") ? "junior" : level;
  const shown = target === "all" ? all : all.filter((c) => c.level === target);
  const solved = shown.filter((c) => progress.coding[c.id]?.solved).length;
  const skill = LEVEL_BY_ID[target];

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:py-10">
      <Link href={href()} className="font-mono text-sm text-muted-foreground hover:text-foreground">
        ← Back to map
      </Link>
      <h1 className="mt-3 font-mono text-2xl font-semibold text-foreground sm:text-3xl"><BlockIcon icon="💻" className="inline-block size-[1.1em] align-[-0.15em]" /> Live coding</h1>
      <p className="mt-1 max-w-2xl text-muted-foreground">
        Write real code in the editor and run it against tests, like a live interview. Hints are there if you get stuck, but each one costs a bit of XP.
      </p>

      {target !== level && (
        <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/[0.07] p-3 text-sm text-destructive-foreground">
          <BlockIcon icon="🐣" className="inline-block size-[1.1em] align-[-0.15em]" /> You&apos;re on Beginner. These are the easiest challenges, so they&apos;re a good next step once the basics feel comfortable. Use the hints whenever you get stuck.
        </p>
      )}

      <div className="mt-5 grid gap-3 rounded-2xl border border-border bg-[#07111c]/90 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <div className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: skill.color }}>
            <BlockIcon icon={skill.icon} className="inline-block size-[1.1em] align-[-0.15em]" /> {skill.name} · {shown.length} {shown.length === 1 ? "challenge" : "challenges"}
          </div>
          <div className="mt-2">
            <Bar value={shown.length ? solved / shown.length : 0} color="#34d399" className="h-2" />
          </div>
          <div className="mt-1 font-mono text-xs text-muted-foreground">
            {solved}/{shown.length} solved
          </div>
        </div>
        <p className="max-w-xs text-xs text-muted-foreground">Change the difficulty on the Code Quests page or on this track&apos;s map.</p>
      </div>

      {shown.length === 0 && <p className="mt-8 font-mono text-muted-foreground">No live coding challenges at this level yet. Try another level.</p>}

      <div className="mt-6 grid gap-6">
        {course.domains.map((d) => {
          const items = shown.filter((c) => c.domain === d.id);
          if (!items.length) return null;
          return (
            <section key={d.id}>
              <h2 className="font-mono text-sm font-semibold uppercase tracking-wider" style={{ color: d.color }}>
                <BlockIcon icon={d.emoji} className="inline-block size-[1.1em] align-[-0.15em]" /> Stage {d.number} · {d.world}
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
                          <BlockIcon icon={lv.icon} className="inline-block size-[1.1em] align-[-0.15em]" /> {lv.name}
                        </span>
                        {c.idea && <span className="truncate text-muted-foreground">{c.idea}</span>}
                        <span className="ml-auto text-base">{st?.solved ? <BlockIcon icon="✅" className="inline-block size-[1.1em] align-[-0.15em]" /> : st ? <BlockIcon icon="✏️" className="inline-block size-[1.1em] align-[-0.15em]" /> : <BlockIcon icon="▶️" className="inline-block size-[1.1em] align-[-0.15em]" />}</span>
                      </div>
                      <div className="mt-2 font-mono text-base font-semibold text-foreground group-hover:text-success-foreground">{c.title}</div>
                      <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                        {LANGUAGE_LABEL[languageOf(c)]} · {c.tests.length} tests{st ? ` · ${st.attempts} ${st.attempts === 1 ? "run" : "runs"}` : ""}
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
