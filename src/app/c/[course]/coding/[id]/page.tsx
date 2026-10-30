"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useRef, useState, useSyncExternalStore } from "react";
import { Editor } from "@/components/coding/Editor";
import { Confetti } from "@/components/fx";
import { CodeBlock, RichText } from "@/components/learn/code";
import { summarize, type RunResult } from "@/engine/coding";
import { LANGUAGE_LABEL, javaShow, languageOf } from "@/engine/coding-langs";
import { runChallenge, warmRuntime, type LiveRun } from "@/engine/runners";
import { codingGrade, runStatusChips } from "@/engine/coding-review";
import { makeOnce } from "@/engine/scenario-progress";
import { itemKey } from "@/engine/srs";
import { readDraft, writeDraft } from "@/engine/drafts";
import { gradeItem } from "@/engine/srs-store";
import { useCourse, useLevelPool } from "@/engine/course-context";
import { LEVEL_BY_ID } from "@/engine/levels";
import type { CodingChallenge } from "@/engine/types";

const noop = () => () => {};

export default function CodingPlay() {
  const { id } = useParams<{ id: string }>();
  const { course } = useCourse();
  const challenge = (course.coding ?? []).find((c) => c.id === id);
  if (!challenge) notFound();
  // Drafts live in localStorage, so the workspace only mounts in the browser (no hydration mismatch).
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  if (!mounted) return <main className="mx-auto w-full max-w-6xl px-4 py-10 font-mono text-slate-500">Loading editor…</main>;
  return <Workspace key={`${course.id}:${challenge.id}`} challenge={challenge} />;
}

function Workspace({ challenge: c }: { challenge: CodingChallenge }) {
  const { course, store, href } = useCourse();
  const { level } = useLevelPool();
  const [code, setCode] = useState(() => readDraft(window.localStorage, course.id, c));
  const [result, setResult] = useState<LiveRun | null>(null);
  const [status, setStatus] = useState("");
  const [attempted, setAttempted] = useState(false);
  const warmed = useRef(false);
  const failed = useRef(false);
  const [once] = useState(makeOnce);
  const lang = languageOf(c);
  const label = LANGUAGE_LABEL[lang];
  const [running, setRunning] = useState(false);
  const [hints, setHints] = useState(0);
  const [solution, setSolution] = useState<"hidden" | "confirm" | "shown">("hidden");
  const [solved, setSolved] = useState(() => store.get().coding[c.id]?.solved ?? false);
  const [xp, setXp] = useState<number | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const busy = useRef(false);

  const lv = LEVEL_BY_ID[c.level];
  const domain = course.domains.find((d) => d.id === c.domain);
  const list = (course.coding ?? []).filter((x) => level === "all" || x.level === level);
  const next = list[list.findIndex((x) => x.id === c.id) + 1];
  const summary = result ? summarize(result) : null;
  const visibleTests = c.tests.filter((t) => !t.hidden);

  function change(next: string) {
    setCode(next);
    writeDraft(window.localStorage, course.id, c, next);
  }

  async function run() {
    if (busy.current) return;
    busy.current = true;
    setRunning(true);
    setResult(null);
    const r = await runChallenge(c, code, setStatus);
    setStatus("");
    const ok = summarize(r).allPassed;
    const used = hints + (solution === "shown" ? c.hints.length : 0);
    // A runtime that failed to download isn't the player's mistake, so it doesn't count as an attempt.
    const earned = r.unavailable ? 0 : store.recordCoding(c.id, ok, used);
    if (!r.unavailable) {
      setAttempted(true);
      // Schedule the exercise in Daily Review: once for the first failing run, once for the first pass.
      once(ok ? "pass" : "fail", () => gradeItem(itemKey(course.id, "code", c.id), codingGrade({ solved: ok, hints: used, failedBefore: failed.current, sawSolution: solution === "shown" })));
      if (!ok) failed.current = true;
    }
    setResult(r);
    setRunning(false);
    busy.current = false;
    if (ok) {
      setSolved(true);
      if (earned > 0) {
        setXp(earned);
        setCelebrate(true);
      }
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
      {celebrate && <Confetti count={50} />}
      <Link href={href("/coding")} className="font-mono text-sm text-slate-400 hover:text-white">
        ← All challenges
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[11px] font-bold">
        <span className="rounded px-1.5 py-0.5" style={{ background: `${lv.color}22`, color: lv.color }}>
          {lv.icon} {lv.name}
        </span>
        {domain && (
          <span style={{ color: domain.color }}>
            {domain.emoji} {domain.world}
          </span>
        )}
        <span className="rounded bg-sky-400/10 px-1.5 py-0.5 text-sky-200">{label}</span>
        {c.idea && <span className="rounded bg-white/5 px-1.5 py-0.5 text-slate-400">💡 {c.idea}</span>}
        <span role="status" className="contents">
          {runStatusChips(solved, summary && result ? { ...summary, error: !!result.error, timedOut: !!result.timedOut } : null).map((chip) => (
            <span key={chip.text} className={`rounded px-1.5 py-0.5 ${chip.tone === "good" ? "bg-emerald-400/15 text-emerald-200" : "bg-rose-400/15 text-rose-200"}`}>
              {chip.text}
            </span>
          ))}
        </span>
      </div>
      <h1 className="mt-2 font-mono text-2xl font-black text-white sm:text-3xl">{c.title}</h1>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <section className="min-w-0 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#07111c]/90 p-4 text-slate-200">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">Task</div>
            <p className="mt-2 whitespace-pre-line leading-relaxed">
              <RichText text={c.prompt} />
            </p>
            <div className="mt-4 font-mono text-xs font-bold uppercase tracking-wider text-slate-500">Examples</div>
            <ul className="mt-2 grid gap-1.5 font-mono text-[12px]">
              {visibleTests.slice(0, 3).map((t, i) => (
                <li key={i} className="overflow-x-auto whitespace-nowrap rounded-lg bg-black/30 px-2.5 py-1.5 text-slate-300">
                  {c.fn}({t.args.map((a) => show(a, lang)).join(", ")}) <span className="text-emerald-300">→ {show(t.expected, lang)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              {c.tests.length} tests{c.tests.some((t) => t.hidden) ? `, ${c.tests.filter((t) => t.hidden).length} of them hidden` : ""}. {lang === "java" ? `Edit the method in class Solution, then run. Java runs as Java 8 with Java 10 syntax, so var works but List.of does not.` : "Edit the function, then run."}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#07111c]/90 p-4">
            <div className="flex items-center justify-between">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">Hints</div>
              <button
                type="button"
                disabled={hints >= c.hints.length}
                onClick={() => setHints((h) => h + 1)}
                className="rounded-lg border border-amber-300/40 px-2.5 py-1 font-mono text-xs font-bold text-amber-200 transition hover:bg-amber-300/10 disabled:opacity-40"
              >
                💡 {hints >= c.hints.length ? "No more hints" : `Hint ${hints + 1}/${c.hints.length}`}
              </button>
            </div>
            {hints === 0 ? (
              <p className="mt-2 text-sm text-slate-500">Try it first. Each hint costs a little XP, and they get more revealing.</p>
            ) : (
              <ol className="mt-3 grid gap-2 text-sm text-amber-100">
                {c.hints.slice(0, hints).map((h, i) => (
                  <li key={i} className="rounded-lg bg-amber-300/10 px-3 py-2">
                    <b>{i + 1}.</b> <RichText text={h} />
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>

        <section className="min-w-0 space-y-3">
          <div onFocus={() => {
              if (!warmed.current && lang !== "js") {
                warmed.current = true;
                warmRuntime(c);
              }
            }}>
          <Editor value={code} lang={lang} onChange={change} onRun={run} minLines={Math.max(12, c.starter.split("\n").length + 4)} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={run}
              disabled={running}
              className="btn-3d rounded-xl bg-emerald-400 px-5 py-2.5 font-mono text-sm font-black uppercase tracking-wider text-slate-950 disabled:opacity-60"
              style={{ "--edge": "#065f46" } as React.CSSProperties}
            >
              {running ? "Running…" : `▶ Run ${label}`}
            </button>
            <button
              type="button"
              onClick={() => {
                change(c.starter);
                setResult(null);
              }}
              className="rounded-xl border border-white/15 px-3 py-2.5 font-mono text-xs font-bold text-slate-300 hover:bg-white/5"
            >
              ↺ Reset
            </button>
            {solution === "hidden" && (attempted || result?.unavailable) && (
              <button type="button" onClick={() => setSolution("confirm")} className="rounded-xl border border-white/15 px-3 py-2.5 font-mono text-xs font-bold text-slate-400 hover:bg-white/5">
                👁 Show solution
              </button>
            )}
            {solution === "confirm" && (
              <button type="button" onClick={() => setSolution("shown")} className="rounded-xl border border-rose-400/50 px-3 py-2.5 font-mono text-xs font-bold text-rose-200 hover:bg-rose-400/10">
                Really show it? Costs most of the XP
              </button>
            )}
            <span className="ml-auto hidden font-mono text-[11px] text-slate-500 sm:inline">Ctrl/⌘ + Enter to run</span>
          </div>

          {solution === "hidden" && !attempted && !result?.unavailable && <p className="font-mono text-[11px] text-slate-500">The reference solution unlocks after your first run.</p>}
          <div aria-live="polite" className="font-mono text-xs text-sky-200">
            {running && status}
          </div>
          {result && <Results result={result} fn={c.fn} lang={lang} />}

          {summary?.allPassed && (
            <div className="pop-in rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4">
              <div className="font-mono text-lg font-black text-emerald-200">🎉 All tests pass{xp ? ` · +${xp} XP` : ""}</div>
              <p className="mt-2 text-sm text-slate-200">
                <RichText text={c.explanation} />
              </p>
              {c.complexity && (
                <p className="mt-2 font-mono text-xs text-emerald-100/80">
                  ⏱ <RichText text={c.complexity} />
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {next && (
                  <Link href={href(`/coding/${next.id}`)} className="rounded-xl bg-emerald-400 px-4 py-2 font-mono text-sm font-black text-slate-950">
                    Next challenge →
                  </Link>
                )}
                <Link href={href("/coding")} className="rounded-xl border border-white/15 px-4 py-2 font-mono text-sm font-bold text-slate-200 hover:bg-white/5">
                  All challenges
                </Link>
              </div>
            </div>
          )}

          {solution === "shown" && (
            <div className="rounded-2xl border border-white/10 bg-[#07111c]/90 p-4">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">Reference solution</div>
              <div className="mt-2">
                <CodeBlock code={c.solution} lang={lang} />
              </div>
              <p className="mt-3 text-sm text-slate-300">
                <RichText text={c.explanation} />
              </p>
              {c.complexity && (
                <p className="mt-2 font-mono text-xs text-slate-400">
                  ⏱ <RichText text={c.complexity} />
                </p>
              )}
              <button type="button" onClick={() => change(c.solution)} className="mt-3 rounded-lg border border-white/15 px-3 py-1.5 font-mono text-xs font-bold text-slate-200 hover:bg-white/5">
                Copy into editor
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function show(v: unknown, lang: string = "js"): string {
  if (lang === "java") return javaShow(v);
  if (lang === "python") return pyShow(v);
  if (v === undefined || v === "$undefined") return "undefined";
  if (v === "$NaN") return "NaN";
  if (v === "$Infinity") return "Infinity";
  if (v && typeof v === "object" && "$set" in v) return `Set(${show((v as { $set: unknown }).$set)})`;
  if (v && typeof v === "object" && "$map" in v) return `Map(${show((v as { $map: unknown }).$map)})`;
  return JSON.stringify(v);
}

function pyShow(v: unknown): string {
  if (v === null) return "None";
  if (v === true) return "True";
  if (v === false) return "False";
  if (typeof v === "string") return `'${v.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n")}'`;
  if (Array.isArray(v)) return `[${v.map(pyShow).join(", ")}]`;
  if (v && typeof v === "object") return `{${Object.entries(v).map(([k, x]) => `${pyShow(k)}: ${pyShow(x)}`).join(", ")}}`;
  return String(v);
}

function Results({ result, fn, lang }: { result: RunResult; fn: string; lang: string }) {
  const s = summarize(result);
  if (result.error) {
    return (
      <div className="rounded-2xl border border-rose-400/40 bg-rose-400/10 p-4 font-mono text-sm text-rose-100">
        <div className="font-black">{result.timedOut ? "⏱️ Stopped" : "💥 Couldn't run"}</div>
        <pre className="mt-1 overflow-x-auto whitespace-pre-wrap">{result.error}</pre>
        {result.logs.length > 0 && <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-black/40 p-2.5 text-[12px] text-slate-200">{result.logs.join("\n")}</pre>}
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-white/10 bg-[#07111c]/90 p-4" role="status">
      <div className={`font-mono text-sm font-black ${s.allPassed ? "text-emerald-300" : "text-amber-200"}`}>
        {s.passed}/{s.total} tests passed
      </div>
      <ul className="mt-3 grid gap-1.5">
        {result.results.map((t, i) => (
          <li key={i} className={`rounded-lg border px-3 py-2 font-mono text-[12px] ${t.ok ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-100" : "border-rose-400/30 bg-rose-400/10 text-rose-100"}`}>
            <div className="flex items-center gap-2">
              <span>{t.ok ? "✓" : "✗"}</span>
              <span className="font-bold">{t.hidden ? "hidden test" : t.name}</span>
            </div>
            {!t.ok && !t.hidden && (
              <div className="mt-1 grid gap-0.5 overflow-x-auto whitespace-pre text-slate-200">
                <div className="text-slate-400">
                  {fn}({t.args})
                </div>
                {t.error ? <div className="text-rose-200">threw {t.error}</div> : <div>got {t.got ?? "nothing"}</div>}
                {t.expected !== undefined && <div className="text-emerald-300">expected {t.expected}</div>}
              </div>
            )}
          </li>
        ))}
      </ul>
      {result.logs.length > 0 && (
        <div className="mt-3">
          <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">{lang === "python" ? "print output" : lang === "java" ? "System.out" : "console.log"}</div>
          <pre className="mt-1 max-h-40 overflow-auto rounded-lg bg-black/40 p-2.5 font-mono text-[12px] text-slate-200">{result.logs.join("\n")}</pre>
        </div>
      )}
    </div>
  );
}
