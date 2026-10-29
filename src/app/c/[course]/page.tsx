"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { Core3D, MascotSays, Tilt } from "@/components/fx";
import { LifecycleBanner } from "@/components/Lifecycle";
import { Bar, Stars } from "@/components/ui";
import { BADGES } from "@/engine/badges";
import { useCourse, useProgress } from "@/engine/course-context";
import { domainMastery, overallReadiness } from "@/engine/game";
import { MODE_BY_ID } from "@/engine/modes";
import { buildPath, type PathNode, type PathWorld } from "@/engine/path";
import { levelInfo } from "@/engine/store";
import type { Domain } from "@/engine/types";
import { setGuideOpen } from "@/engine/ui-state";

const ZIGZAG = [0, 56, 84, 56, 0, -56, -84, -56];

export default function MissionMap() {
  const router = useRouter();
  const { course, store, href, domain: domainById, lesson: lessonById } = useCourse();
  const p = useProgress();
  const lvl = levelInfo(p.xp, course.levelTitles);
  const { worlds, current, examUnlocked } = buildPath(course, p);
  const readiness = Math.round(overallReadiness(course, p));

  // First visit: start with the intro briefing.
  useEffect(() => {
    const s = store.get();
    if (!s.onboarded && s.xp === 0) router.replace(href("/start"));
  }, [router, store, href]);

  const currentDomain = current ? domainById[current.domain] : null;
  const currentLesson = current?.type === "lesson" ? lessonById[current.key] : null;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">
      {/* Hero: where you are and what's next */}
      <section className="grid items-center gap-6 rounded-3xl border border-white/10 bg-slate-900/50 p-5 sm:p-8 md:grid-cols-[1fr_auto]">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">Mission control · {course.code}</div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black text-white">
            Level {lvl.level} <span className="text-slate-400">·</span> {lvl.title}
          </h1>
          <div className="mt-3 max-w-md">
            <Bar value={lvl.into / lvl.needed} className="h-2.5" />
            <div className="mt-1 text-xs text-slate-400">
              {lvl.into}/{lvl.needed} XP to level {lvl.level + 1}
            </div>
          </div>

          <div className="mt-5">
            {current && currentDomain ? (
              <MascotSays>
                <div className="text-sm text-slate-300">Next up on your expedition</div>
                <div className="font-bold text-white">
                  {current.type === "lesson" ? `📖 Mission: ${currentLesson?.title}` : `⚔️ ${currentDomain.world} trial`}
                </div>
              </MascotSays>
            ) : (
              <MascotSays mood="wow">
                <div className="font-bold text-white">Every world cleared! The Certification Gate is open.</div>
              </MascotSays>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={href(current?.to ?? "/exam")}
              className="btn-3d rounded-2xl bg-sky-400 px-7 py-3.5 text-lg font-black uppercase tracking-wide text-slate-950"
              style={{ "--edge": "#0369a1" } as CSSProperties}
            >
              {p.xp === 0 ? "Start expedition" : "Continue"} →
            </Link>
            <Link
              href={href("/study")}
              className="btn-3d rounded-2xl bg-violet-400 px-5 py-3.5 font-black text-slate-950"
              style={{ "--edge": "#6d28d9" } as CSSProperties}
            >
              📚 Study first
            </Link>
            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              className="btn-3d rounded-2xl border border-white/15 bg-slate-800 px-5 py-3.5 font-bold text-slate-100"
              style={{ "--edge": "#020617" } as CSSProperties}
            >
              📖 Guide
            </button>
          </div>
        </div>
        <div className="hidden justify-self-center md:block">
          <Core3D size={110} domains={course.domains} icon={course.provider.icon} />
        </div>
      </section>
      <LifecycleBanner course={course} />

      {/* How the expedition works */}
      <section className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          { icon: "📖", t: "1. Learn", d: "Each mission teaches one concept with a visual." },
          { icon: "✅", t: "2. Check", d: "Two quick questions. Misses come back until they stick." },
          { icon: "⚔️", t: "3. Trial", d: `Prove the world: ${course.config.quest.length} questions, ${course.config.quest.hearts} hearts.` },
          { icon: "🏛️", t: "4. Certify", d: `Full exam simulator. ${course.exam.scale.pass}+ means you're ready.` },
        ].map((s) => (
          <div key={s.t} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <div className="text-2xl">{s.icon}</div>
            <div className="mt-1 font-bold text-white">{s.t}</div>
            <div className="text-sm text-slate-400">{s.d}</div>
          </div>
        ))}
      </section>

      {/* The map */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-2xl font-black text-white">🗺️ Mission map</h2>
          <div className="text-sm text-slate-400">
            Exam readiness <span className="font-bold text-white">{readiness}%</span>
          </div>
        </div>
        <div className="mt-6 grid gap-10">
          {worlds.map((w, i) => (
            <WorldSection key={w.domain} world={w} domain={course.domains[i]} mastery={domainMastery(course, p, w.domain)} stars={p.questStars[w.domain] ?? 0} />
          ))}

          <Tilt className="rounded-3xl">
            <Link
              href={href("/exam")}
              className={`block rounded-3xl border-2 p-6 text-center transition ${examUnlocked ? "border-amber-300/60 bg-gradient-to-b from-amber-400/20 to-slate-900/60" : "border-white/10 bg-slate-900/50"}`}
            >
              <div className="text-5xl">🏛️</div>
              <div className="mt-2 text-xl font-black text-white">The Certification Gate</div>
              <div className="mt-1 text-sm text-slate-300">
                Full exam simulator: {course.exam.questions} questions, {course.exam.minutes} minutes, scored {course.exam.scale.min}–{course.exam.scale.max}.
              </div>
              <div className="mt-3 text-xs font-semibold text-amber-300">
                {examUnlocked ? "Open. You're ready to attempt it." : "Recommended after all five trials, but you can enter anytime."}
              </div>
            </Link>
          </Tilt>
        </div>
      </section>

      {/* Practice deck */}
      <section className="mt-12">
        <h2 className="text-xl font-black text-white">🎮 Training deck</h2>
        <p className="mt-1 text-sm text-slate-400">Replay anytime to sharpen what you&apos;ve learned.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {course.modes
            .map((id) => MODE_BY_ID[id])
            .map((m) => ({ href: href(m.to), icon: m.icon, name: m.name, meta: m.status(p, course) }))
            .map((m) => (
            <Tilt key={m.href} className="rounded-2xl">
              <Link href={m.href} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition hover:border-white/25">
                <span className="text-3xl">{m.icon}</span>
                <div>
                  <div className="font-bold text-white">{m.name}</div>
                  <div className="text-xs text-slate-400">{m.meta}</div>
                </div>
              </Link>
            </Tilt>
          ))}
        </div>
      </section>

      <BadgeShelf earned={p.badges} />

      <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500">
        <span>
          Progress is saved in this browser. Not affiliated with AWS.{" "}
          <Link href={href("/start")} className="text-slate-400 underline">
            Replay intro
          </Link>
        </span>
        <ResetButton />
      </footer>
    </main>
  );
}

function Planet({ domain, size = 84, dim }: { domain: Domain; size?: number; dim?: boolean }) {
  return (
    <div className={`planet relative shrink-0 ${dim ? "opacity-40 grayscale" : ""}`} style={{ width: size, height: size }} aria-hidden>
      <div
        className="planet-body absolute inset-0 rounded-full"
        style={{ "--c": domain.color, background: `radial-gradient(circle at 32% 28%, white -20%, ${domain.color} 45%, #020617 120%)` } as CSSProperties}
      />
      <div className="planet-ring absolute" style={{ borderColor: `${domain.color}99` }} />
      <span className="absolute inset-0 flex items-center justify-center" style={{ fontSize: size * 0.38 }}>
        {domain.emoji}
      </span>
    </div>
  );
}

function WorldSection({ world, domain, mastery, stars }: { world: PathWorld; domain: Domain; mastery: number; stars: number }) {
  const { href } = useCourse();
  const questNode = world.nodes[world.nodes.length - 1];
  return (
    <div>
      <Tilt className="rounded-3xl">
        <div
          className="flex items-center gap-4 rounded-3xl border p-4 sm:p-5"
          style={{ borderColor: `${domain.color}55`, background: `linear-gradient(120deg, ${domain.color}22, transparent 70%)` }}
        >
          <Planet domain={domain} dim={!world.unlocked} />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: domain.color }}>
              World {domain.number} · {domain.weight}% of the exam
            </div>
            <div className="text-xl font-black text-white">{domain.world}</div>
            <div className="text-sm text-slate-400">{domain.name}</div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <Link href={href(`/study/${domain.id}`)} className="rounded-full border border-violet-300/40 bg-violet-400/15 px-2.5 py-1 font-bold text-violet-100 hover:bg-violet-400/25">
                📚 Study
              </Link>
              <span>
                📖 {world.lessonsDone}/{world.lessonsTotal} missions
              </span>
              <Stars count={stars} size="text-sm" />
              <span>{Math.round(mastery * 100)}% mastered</span>
            </div>
          </div>
        </div>
      </Tilt>

      <div className="relative mt-6 flex flex-col items-center gap-5">
        {world.nodes.map((n, i) => (
          <PathNodeButton key={n.key} node={n} color={domain.color} offset={ZIGZAG[i % ZIGZAG.length]} />
        ))}
        {!world.unlocked && (
          <div className="text-center text-xs text-slate-500">
            🔒 Clear the previous world&apos;s trial to unlock.{" "}
            <Link href={href(questNode.to)} className="text-slate-300 underline">
              Already know this? Take the trial
            </Link>
          </div>
        )}
        {world.unlocked && questNode.state === "locked" && (
          <Link href={href(questNode.to)} className="text-xs text-slate-500 underline hover:text-slate-300">
            Already know this world? Skip ahead to the trial
          </Link>
        )}
      </div>
    </div>
  );
}

function PathNodeButton({ node, color, offset }: { node: PathNode; color: string; offset: number }) {
  const { href, lesson: lessonById } = useCourse();
  const [hover, setHover] = useState(false);
  const lesson = node.type === "lesson" ? lessonById[node.key] : null;
  const locked = node.state === "locked";
  const size = node.type === "quest" ? 84 : 68;
  const icon = node.state === "done" ? "✓" : locked ? "🔒" : node.type === "quest" ? "⚔️" : "📖";
  const label = node.type === "quest" ? "World trial" : lesson?.title;

  const inner = (
    <span
      className={`node-3d relative flex items-center justify-center rounded-full text-2xl font-black text-slate-950 ${locked ? "node-locked" : ""} ${node.state === "current" ? "node-current" : ""}`}
      style={{ width: size, height: size, "--c": node.state === "done" ? "#facc15" : color, "--edge": node.state === "done" ? "#a16207" : "#0f172a" } as CSSProperties}
    >
      {node.state === "current" && <span className="ring-pulse absolute inset-0 rounded-full border-4" style={{ borderColor: color }} />}
      <span className={locked ? "opacity-70 grayscale" : ""}>{icon}</span>
    </span>
  );

  return (
    <div className="relative flex flex-col items-center" style={{ transform: `translateX(${offset}px)` }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {node.state === "current" && (
        <span className="mb-2 rounded-xl border border-white/15 bg-slate-900 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg">Start</span>
      )}
      {locked ? (
        <span title={label} aria-label={`${label} (locked)`}>
          {inner}
        </span>
      ) : (
        <Link href={href(node.to)} aria-label={label}>
          {inner}
        </Link>
      )}
      <span className={`mt-2 max-w-[11rem] text-center text-xs leading-tight transition ${hover || node.state === "current" ? "text-white" : "text-slate-500"}`}>{label}</span>
    </div>
  );
}

function BadgeShelf({ earned }: { earned: string[] }) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-black text-white">
        🏅 Badges <span className="text-sm font-normal text-slate-400">{earned.length}/{BADGES.length}</span>
      </h2>
      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
        {BADGES.map((b) => {
          const got = earned.includes(b.id);
          return (
            <div key={b.id} title={`${b.name}: ${b.description}`} className={`rounded-xl border p-2 text-center ${got ? "border-amber-300/40 bg-amber-300/10" : "border-white/5 bg-white/[0.02]"}`}>
              <div className={`text-2xl ${got ? "" : "opacity-25 grayscale"}`}>{b.icon}</div>
              <div className={`mt-1 text-[11px] font-semibold leading-tight ${got ? "text-white" : "text-slate-500"}`}>{b.name}</div>
            </div>
          );
        })}
      </div>
    </section>
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
    <button
      type="button"
      onClick={() => {
        if (armed) {
          store.reset();
          setArmed(false);
        } else setArmed(true);
      }}
      className="rounded-lg border border-white/10 px-3 py-1.5 hover:border-rose-400/50 hover:text-rose-300"
    >
      {armed ? "Click again to erase all progress" : "Reset progress"}
    </button>
  );
}
