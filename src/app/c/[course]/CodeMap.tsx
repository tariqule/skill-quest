"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type CSSProperties } from "react";
import { LevelPicker, TerminalWindow, Typewriter } from "@/components/code/ui";
import { TrackCore3D } from "@/components/three";
import { Bar } from "@/components/ui";
import { BADGES } from "@/engine/badges";
import { courseCopy } from "@/engine/copy";
import { useCourse, useProgress } from "@/engine/course-context";
import { domainMastery, overallReadiness, pct } from "@/engine/game";
import { LEVEL_BY_ID, LEVELS, type LevelChoice } from "@/engine/levels";
import { MODE_BY_ID } from "@/engine/modes";
import { buildPath, type PathNode } from "@/engine/path";
import { levelInfo } from "@/engine/store";

/** The mission map for interview tracks: a terminal hub plus an arcade level-select. */
export function CodeMap() {
  const router = useRouter();
  const { course, store, href, lesson: lessonById } = useCourse();
  const p = useProgress();
  const lvl = levelInfo(p.xp, course.levelTitles);
  const { worlds, current } = buildPath(course, p);
  const readiness = Math.round(overallReadiness(course, p));
  const skill = LEVEL_BY_ID[p.level];
  const copy = courseCopy(course);
  const learning = course.kind === "learning";

  useEffect(() => {
    const s = store.get();
    if (!s.onboarded && s.xp === 0) router.replace(href("/start"));
  }, [router, store, href]);

  const counts = Object.fromEntries(
    LEVELS.map((l) => [l.id, l.id === "all" ? course.questions.length : course.questions.filter((q) => q.level === l.id).length]),
  ) as Record<LevelChoice, number>;
  const slug = course.shortTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">
      <TerminalWindow title={`~/code-quest/${slug} — zsh`}>
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="font-mono text-xs font-bold uppercase tracking-[0.25em]" style={{ color: course.provider.color }}>
              {course.provider.icon} {course.code} · {learning ? "learning quest" : "interview quest"}
            </div>
            <h1 className="glitch mt-2 text-3xl font-black text-white sm:text-4xl">{course.title}</h1>
            <div className="mt-4">
              <Typewriter
                key={`${p.level}-${lvl.level}`}
                lines={[
                  `$ whoami → ${lvl.title} (lv ${lvl.level}, ${p.xp} xp)`,
                  `$ difficulty → ${skill.icon} ${skill.name}`,
                  current ? `$ next → ${current.type === "lesson" ? lessonById[current.key]?.title : "stage boss"}` : `$ next → ${copy.simulator} unlocked`,
                ]}
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={href(current?.to ?? "/exam")}
                className="btn-3d rounded-xl bg-emerald-400 px-6 py-3 font-mono text-sm font-black uppercase tracking-wider text-slate-950"
                style={{ "--edge": "#065f46", boxShadow: "0 5px 0 0 #065f46, 0 0 28px -6px #34d399" } as CSSProperties}
              >
                ▶ {p.xp === 0 ? "Start" : "Continue"}
              </Link>
              <Link
                href={href("/study")}
                className="btn-3d rounded-xl bg-sky-400 px-5 py-3 font-mono text-sm font-black uppercase tracking-wider text-slate-950"
                style={{ "--edge": "#075985" } as CSSProperties}
              >
                📚 Study
              </Link>
              <Link
                href={href("/exam")}
                className="btn-3d rounded-xl bg-fuchsia-400 px-5 py-3 font-mono text-sm font-black uppercase tracking-wider text-slate-950"
                style={{ "--edge": "#86198f" } as CSSProperties}
              >
                {copy.gateIcon} {learning ? "Skill check" : "Mock interview"}
              </Link>
            </div>
          </div>
          <div className="md:w-64">
            <TrackCore3D
              color={course.provider.color}
              stages={course.domains.map((d) => ({ color: d.color, mastery: domainMastery(course, p, d.id) }))}
              className="-mt-2 h-52 w-full cursor-grab active:cursor-grabbing"
            />
            <div className="grid grid-cols-3 gap-2 font-mono text-center">
              <Stat label="XP" value={p.xp} color="#34d399" />
              <Stat label="Streak" value={`🔥 ${p.streak.count}`} color="#fb923c" />
              <Stat label="Ready" value={`${readiness}%`} color="#38bdf8" />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <Bar value={lvl.into / lvl.needed} color="#34d399" className="h-1.5" />
          <div className="mt-1 font-mono text-[11px] text-slate-500">
            {lvl.into}/{lvl.needed} xp to lv {lvl.level + 1}
          </div>
        </div>
      </TerminalWindow>

      <section className="mt-8">
        <h2 className="font-mono text-lg font-black uppercase tracking-wider text-white">
          <span className="text-emerald-300">&gt;</span> Select difficulty
        </h2>
        <p className="mt-1 text-sm text-slate-400">Trials, drills, boss battles, study play, and the {copy.simulator} only use questions at this level.</p>
        <div className="mt-4">
          <LevelPicker value={p.level} onChange={(l) => store.setLevel(l)} counts={counts} />
        </div>
      </section>

      <section className="mt-10 grid gap-6">
        <h2 className="font-mono text-lg font-black uppercase tracking-wider text-white">
          <span className="text-emerald-300">&gt;</span> Stages
        </h2>
        {worlds.map((w, wi) => {
          const d = course.domains[wi];
          const mastery = domainMastery(course, p, d.id);
          return (
            <TerminalWindow key={d.id} title={`stage_${d.number}.${d.world.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`} glow={d.color}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl">{d.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: d.color }}>
                    Stage {d.number} · {d.weight}% of the {copy.noun}
                  </div>
                  <div className="font-mono text-xl font-black text-white">{d.world}</div>
                  <div className="text-sm text-slate-400">{d.name}</div>
                </div>
                <div className="w-full font-mono text-xs text-slate-400 sm:w-48">
                  <SegmentBar value={mastery} color={d.color} />
                  <div className="mt-1 flex justify-between">
                    <span>
                      {w.lessonsDone}/{w.lessonsTotal} levels
                    </span>
                    <span>{Math.round(mastery * 100)}% mastered</span>
                  </div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {w.nodes.map((n, ni) => (
                  <Tile key={n.key} node={n} label={n.type === "quest" ? "BOSS" : `${d.number}-${ni + 1}`} color={d.color} />
                ))}
              </div>
              {!w.unlocked && <p className="mt-3 font-mono text-xs text-slate-500">🔒 Beat the previous stage&apos;s boss to unlock.</p>}
            </TerminalWindow>
          );
        })}
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-lg font-black uppercase tracking-wider text-white">
          <span className="text-emerald-300">&gt;</span> Arcade
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {course.modes
            .map((id) => MODE_BY_ID[id])
            .map((m) => (
              <Link
                key={m.id}
                href={href(m.to)}
                className="group rounded-xl border border-white/10 bg-[#07111c]/90 p-4 transition hover:-translate-y-0.5 hover:border-emerald-400/50"
              >
                <div className="text-3xl transition group-hover:scale-110">{m.icon}</div>
                <div className="mt-2 font-mono text-sm font-black uppercase tracking-wider text-white">{m.name}</div>
                <div className="mt-0.5 font-mono text-[11px] text-slate-400">{m.status(p, course)}</div>
              </Link>
            ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-lg font-black uppercase tracking-wider text-white">
          <span className="text-emerald-300">&gt;</span> Achievements{" "}
          <span className="text-sm font-normal text-slate-500">
            {p.badges.length}/{BADGES.length}
          </span>
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {BADGES.map((b) => {
            const got = p.badges.includes(b.id);
            return (
              <span
                key={b.id}
                title={`${b.name}: ${b.description}`}
                className={`rounded-lg border px-2.5 py-1.5 font-mono text-xs ${got ? "border-amber-300/50 bg-amber-300/10 text-amber-100" : "border-white/5 text-slate-600"}`}
              >
                <span className={got ? "" : "grayscale"}>{b.icon}</span> {b.name}
              </span>
            );
          })}
        </div>
      </section>

      <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 font-mono text-xs text-slate-500">
        <Link href="/code" className="hover:text-slate-300">
          ← all code quests
        </Link>
        <Link href={href("/start")} className="hover:text-slate-300">
          replay intro
        </Link>
      </footer>
    </main>
  );
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-lg font-black" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function SegmentBar({ value, color }: { value: number; color: string }) {
  const filled = Math.round(value * 10);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} className="h-2.5 flex-1 rounded-sm" style={{ background: i < filled ? color : "rgb(255 255 255 / 0.08)" }} />
      ))}
    </div>
  );
}

function Tile({ node, label, color }: { node: PathNode; label: string; color: string }) {
  const { href, lesson: lessonById } = useCourse();
  const lesson = node.type === "lesson" ? lessonById[node.key] : null;
  const level = lesson?.level ? LEVEL_BY_ID[lesson.level] : null;
  const locked = node.state === "locked";
  const done = node.state === "done";
  const current = node.state === "current";
  const boss = node.type === "quest";
  const body = (
    <div
      className={`pixel-tile relative h-full p-3 transition ${locked ? "opacity-40" : "hover:-translate-y-0.5"} ${current ? "node-current" : ""}`}
      style={{
        background: done ? `${color}30` : boss ? "linear-gradient(135deg, #be185d55, #7c3aed44)" : "rgb(255 255 255 / 0.04)",
        boxShadow: current ? `inset 0 0 0 2px ${color}, 0 0 22px -4px ${color}` : `inset 0 0 0 1px ${done ? color : "rgb(255 255 255 / 0.1)"}`,
      }}
    >
      <div className="flex items-center justify-between font-mono text-xs font-black" style={{ color: boss ? "#f472b6" : color }}>
        <span>{label}</span>
        <span>{done ? "★" : locked ? "🔒" : boss ? "⚔️" : current ? "▶" : "·"}</span>
      </div>
      <div className="mt-2 line-clamp-3 text-xs leading-snug text-slate-200">{boss ? "Stage boss: prove the whole stage" : node.title}</div>
      {level && (
        <div className="mt-2 inline-block rounded px-1.5 py-0.5 font-mono text-[10px] font-bold" style={{ background: `${level.color}22`, color: level.color }}>
          {level.icon} {level.name}
        </div>
      )}
      {current && <div className="mt-2 h-1 overflow-hidden rounded bg-white/10"><div className="h-full animate-pulse" style={{ width: pct(1), background: color }} /></div>}
    </div>
  );
  return locked ? (
    <span aria-label={`${node.title} (locked)`}>{body}</span>
  ) : (
    <Link href={href(node.to)} aria-label={node.title} className="block h-full">
      {body}
    </Link>
  );
}
