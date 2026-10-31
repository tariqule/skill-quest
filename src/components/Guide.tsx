"use client";

import { RichText } from "@/components/learn/code";
import { BookOpen, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { courseCopy } from "@/engine/copy";
import { useCourse, useProgress } from "@/engine/course-context";
import { versionLabel } from "@/engine/game";
import { setGuideOpen, useGuideOpen } from "@/engine/ui-state";
import { Mascot } from "./fx";

const TABS = [
  { id: "exam", label: "🎯 Format" },
  { id: "topics", label: "🗺️ Topics" },
  { id: "glossary", label: "🔎 Glossary" },
  { id: "services", label: "🧰 Scope" },
  { id: "tips", label: "💡 Tips" },
  { id: "play", label: "🎮 How to play" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function GuideContent({ initialTab = "exam" }: { compact?: boolean; initialTab?: TabId }) {
  const [tab, setTab] = useState<TabId>(initialTab);
  return (
    <div>
      <div role="tablist" aria-label="Guide sections" className="flex flex-wrap gap-2 pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`min-h-10 rounded-full border px-3.5 text-sm font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring ${tab === t.id ? "border-primary bg-primary/15 text-foreground" : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-3">
        {tab === "exam" && <ExamTab />}
        {tab === "topics" && <TopicsTab />}
        {tab === "glossary" && <GlossaryTab />}
        {tab === "services" && <ServicesTab />}
        {tab === "tips" && <TipsTab />}
        {tab === "play" && <PlayTab />}
      </div>
    </div>
  );
}

function ExamTab() {
  const { course } = useCourse();
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {course.guide.facts.map((f) => (
          <div key={f.label} className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
            <div className="text-xl">{f.icon}</div>
            <div className="text-xl font-black text-white">
              {f.value} <span className="text-xs font-bold uppercase text-sky-300">{f.label}</span>
            </div>
            <div className="mt-1 text-xs text-slate-400">{f.detail}</div>
          </div>
        ))}
      </div>
      <div>
        <div className="mb-2 text-sm font-bold text-white">Score weight by domain</div>
        <div className="grid gap-1.5">
          {course.domains.map((d) => (
            <div key={d.id} className="grid grid-cols-[2.5rem_1fr] items-center gap-2 text-sm">
              <span className="text-right font-black" style={{ color: d.color }}>
                {d.weight}%
              </span>
              <div>
                <div className="h-2 rounded-full" style={{ width: `${d.weight * 3.3}%`, background: d.color }} />
                <div className="mt-0.5 text-xs text-slate-300">
                  {d.emoji} {d.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-2 text-sm font-bold text-white">Question types</div>
        <div className="grid gap-2 sm:grid-cols-2">
          {course.exam.questionTypes.map((t) => (
            <div key={t.id} className="rounded-xl bg-white/5 p-2 text-sm">
              <b className="text-white">
                {t.icon} {t.name}
                {t.practiceOnly && <span className="ml-1.5 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-300">practice only</span>}
              </b>
              <div className="text-xs text-slate-400">{t.rule}</div>
            </div>
          ))}
        </div>
      </div>
      <SourceNote />
    </div>
  );
}

function TopicsTab() {
  const { course, allLessons, href } = useCourse();
  const p = useProgress();
  const done = allLessons.filter((l) => p.lessonsDone.includes(l.id)).length;
  return (
    <div className="grid gap-4">
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
        Every topic in the {courseCopy(course).syllabus}, and the missions that teach it.{" "}
        <b className="text-white">
          {done}/{allLessons.length}
        </b>{" "}
        missions cleared.
      </div>
      {course.domains.map((d) => (
        <details key={d.id} className="group rounded-xl border border-white/10 bg-slate-950/40" open={false}>
          <summary className="flex cursor-pointer items-center gap-2 p-3">
            <span className="text-xl">{d.emoji}</span>
            <span className="flex-1 font-bold text-white">
              {d.number}. {d.name}
            </span>
            <span className="text-xs text-slate-400">
              {course.lessons[d.id].filter((l) => p.lessonsDone.includes(l.id)).length}/{course.lessons[d.id].length}
            </span>
          </summary>
          <div className="grid gap-3 px-3 pb-3">
            {(course.guide.tasks[d.id] ?? []).map((t) => {
              const lessons = course.lessons[d.id].filter((l) => l.task.split(" · ").includes(t.id));
              return (
                <div key={t.id} className="rounded-lg bg-white/5 p-3">
                  <div className="text-sm font-bold text-white">
                    <span style={{ color: d.color }}>Task {t.id}</span> {t.title}
                  </div>
                  <ul className="mt-1.5 grid gap-1 text-xs text-slate-300">
                    {t.covers.map((c) => (
                      <li key={c}>• {c}</li>
                    ))}
                  </ul>
                  {lessons.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {lessons.map((l) => {
                        const ok = p.lessonsDone.includes(l.id);
                        return (
                          <Link
                            key={l.id}
                            href={href(`/lesson/${l.id}`)}
                            onClick={() => setGuideOpen(false)}
                            className={`rounded-full border px-2 py-0.5 text-xs ${ok ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-200" : "border-white/15 text-slate-300 hover:bg-white/10"}`}
                          >
                            {ok ? "✓" : "📖"} {l.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </details>
      ))}
    </div>
  );
}

function GlossaryTab() {
  const { course } = useCourse();
  const [q, setQ] = useState("");
  const terms = course.cards.filter((c) => (c.term + c.definition).toLowerCase().includes(q.toLowerCase())).sort((a, b) => a.term.localeCompare(b.term));
  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search a term, e.g. RAG, Macie, recall…"
        aria-label="Search glossary"
        className="w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2.5 text-slate-100 placeholder:text-slate-500"
      />
      <div className="mt-3 grid gap-1.5">
        {terms.map((c) => {
          const d = course.domains.find((x) => x.id === c.domain)!;
          return (
            <div key={c.id} className="rounded-lg bg-white/5 px-3 py-2 text-sm" style={{ boxShadow: `inset 3px 0 0 0 ${d.color}` }}>
              <b className="text-white"><RichText text={c.term} /></b> <span className="text-slate-300">· <RichText text={c.definition} /></span>
            </div>
          );
        })}
        {terms.length === 0 && <div className="text-sm text-slate-500">No match. Try a shorter word.</div>}
      </div>
    </div>
  );
}

function ServicesTab() {
  const { course } = useCourse();
  return (
    <div className="grid gap-3">
      <p className="text-sm text-slate-400">{course.guide.scope.label} from the {courseCopy(course).syllabus}.</p>
      {course.guide.scope.groups.map((c) => (
        <div key={c.category} className="rounded-xl border border-white/10 bg-slate-950/50 p-3">
          <div className="text-sm font-bold text-white">
            {c.icon} {c.category}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {c.services.map((s) => (
              <span key={s} className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-200">
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
      <SourceNote />
    </div>
  );
}

function TipsTab() {
  const { course, href } = useCourse();
  return (
    <div className="grid gap-2">
      <Link href={href("/cheatsheet")} onClick={() => setGuideOpen(false)} className="flex gap-3 rounded-xl border border-sky-400/30 bg-sky-400/10 p-3 text-sm font-semibold text-sky-200 underline">
        <span className="text-xl" aria-hidden>📜</span>
        <span>Cheat sheet: every key fact on one page</span>
      </Link>
      {course.guide.tips.map((t) => (
        <div key={t.tip} className="flex gap-3 rounded-xl bg-white/5 p-3 text-sm text-slate-200">
          <span className="text-xl">{t.icon}</span>
          <span><RichText text={t.tip} /></span>
        </div>
      ))}
    </div>
  );
}

function PlayTab() {
  const { course, href } = useCourse();
  return (
    <div className="grid gap-3 text-sm text-slate-300">
      <div className="flex items-center gap-3 rounded-xl border border-sky-400/30 bg-sky-400/10 p-3">
        <Mascot size={48} />
        <span>Follow the mission map from top to bottom. Each step teaches before it tests.</span>
      </div>
      {[
        ["📖 Mission", `One concept, explained with a visual or a hands-on lab, then quick check questions. +${course.config.xp.lessonComplete} XP.`],
        ["⚔️ Trial", `${course.config.quest.length} questions from the world, ${course.config.quest.hearts} hearts. 1+ star unlocks the next world.`],
        [`${courseCopy(course).gateIcon} ${courseCopy(course).gate.replace(/^The /, "")}`, `Full ${course.exam.questions}-question, ${course.exam.minutes}-minute ${courseCopy(course).simulator}.`],
        ["🎮 Training deck", "Replay challenges anytime to sharpen what you learned."],
        ["⌨️ Keys", "1–4 or A–D to answer · Enter to continue · Space flips flashcards."],
      ].map(([t, d]) => (
        <div key={t} className="rounded-xl bg-white/5 p-3">
          <b className="text-white">{t}</b>
          <div>{d}</div>
        </div>
      ))}
      <Link href={href("/cheatsheet")} onClick={() => setGuideOpen(false)} className="text-sky-300 underline">
        📜 Open the one-page cheat sheet
      </Link>
      <Link href={href("/start")} onClick={() => setGuideOpen(false)} className="text-sky-300 underline">
        Replay the intro briefing
      </Link>
    </div>
  );
}

function SourceNote() {
  const { source } = useCourse().course.guide;
  return (
    <p className="text-xs text-slate-500">
      Based on the {source.label} {versionLabel(source.version)} ({source.date}).{" "}
      <a href={source.url} target="_blank" rel="noreferrer" className="underline">
        Read the official guide
      </a>
    </p>
  );
}

/** Slide-over guide panel available on every page. */
export function GuideDrawer() {
  const { href } = useCourse();
  const open = useGuideOpen();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) return;
      if (e.key === "Escape") setGuideOpen(false);
      if (e.key === "?") setGuideOpen(!open);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={`fixed inset-0 z-30 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setGuideOpen(false)} />
      <aside
        role="dialog"
        aria-label="Study guide"
        className={`absolute inset-y-0 right-0 flex w-full min-w-0 flex-col overflow-hidden bg-popover shadow-elevation-3 transition-transform duration-300 motion-reduce:transition-none sm:max-w-lg sm:border-l sm:border-border ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-2" style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 0.5rem)" }}>
          <BookOpen className="size-5 text-primary" aria-hidden />
          <span className="flex-1 font-heading text-lg font-semibold text-foreground">Study guide</span>
          <Link href={href("/guide")} onClick={() => setGuideOpen(false)} className="flex min-h-11 items-center px-2 text-sm text-foreground underline underline-offset-4">
            Full page
          </Link>
          <button type="button" onClick={() => setGuideOpen(false)} aria-label="Close guide" className="flex size-11 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4">{open && <GuideContent />}</div>
      </aside>
    </div>
  );
}
