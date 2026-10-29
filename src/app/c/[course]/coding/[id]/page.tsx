"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useRef, useState, useSyncExternalStore } from "react";
import { Editor } from "@/components/coding/Editor";
import { Confetti } from "@/components/fx";
import { CodeBlock, RichText } from "@/components/learn/code";
import { runInWorker, summarize, type RunResult } from "@/engine/coding";
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
  return <Workspace key={challenge.id} challenge={challenge} />;
}

const draftKey = (id: string) => `cq-draft:${id}`;

function readDraft(c: CodingChallenge) {
  try {
    return window.localStorage.getItem(draftKey(c.id)) ?? c.starter;
  } catch {
    return c.starter;
  }
}

function Workspace({ challenge: c }: { challenge: CodingChallenge }) {
  const { course, store, href } = useCourse();
  const { level } = useLevelPool();
  const [code, setCode] = useState(() => readDraft(c));
  const [result, setResult] = useState<RunResult | null>(null);
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
    try {
      window.localStorage.setItem(draftKey(c.id), next);
    } catch {
      // Drafts are a convenience; ignore storage errors.
    }
  }

  async function run() {
    if (busy.current) return;
    busy.current = true;
    setRunning(true);
    const r = await runInWorker(code, c.fn, c.tests);
    const ok = summarize(r).allPassed;
    const used = hints + (solution === "shown" ? c.hints.length : 0);
    const earned = store.recordCoding(c.id, ok, used);
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
        {c.idea && <span className="rounded bg-white/5 px-1.5 py-0.5 text-slate-400">💡 {c.idea}</span>}
        {solved && <span className="rounded bg-emerald-400/15 px-1.5 py-0.5 text-emerald-200">✅ solved</span>}
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
                  {c.fn}({t.args.map(show).join(", ")}) <span className="text-emerald-300">→ {show(t.expected)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              {c.tests.length} tests{c.tests.some((t) => t.hidden) ? `, ${c.tests.filter((t) => t.hidden).length} of them hidden` : ""}. Edit the function, then run.
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
          <Editor value={code} onChange={change} onRun={run} minLines={Math.max(12, c.starter.split("\n").length + 4)} />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={run}
              disabled={running}
              className="btn-3d rounded-xl bg-emerald-400 px-5 py-2.5 font-mono text-sm font-black uppercase tracking-wider text-slate-950 disabled:opacity-60"
              style={{ "--edge": "#065f46" } as React.CSSProperties}
            >
              {running ? "Running…" : "▶ Run tests"}
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
            {solution === "hidden" && (
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

          {result && <Results result={result} fn={c.fn} />}

          {summary?.allPassed && (
            <div className="pop-in rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4">
              <div className="font-mono text-lg font-black text-emerald-200">🎉 All tests pass{xp ? ` · +${xp} XP` : ""}</div>
              <p className="mt-2 text-sm text-slate-200">
                <RichText text={c.explanation} />
              </p>
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
                <CodeBlock code={c.solution} lang="js" />
              </div>
              <p className="mt-3 text-sm text-slate-300">
                <RichText text={c.explanation} />
              </p>
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

function show(v: unknown): string {
  if (v === undefined || v === "$undefined") return "undefined";
  if (v === "$NaN") return "NaN";
  if (v === "$Infinity") return "Infinity";
  if (v && typeof v === "object" && "$set" in v) return `Set(${show((v as { $set: unknown }).$set)})`;
  if (v && typeof v === "object" && "$map" in v) return `Map(${show((v as { $map: unknown }).$map)})`;
  return JSON.stringify(v);
}

function Results({ result, fn }: { result: RunResult; fn: string }) {
  const s = summarize(result);
  if (result.error) {
    return (
      <div className="rounded-2xl border border-rose-400/40 bg-rose-400/10 p-4 font-mono text-sm text-rose-100">
        <div className="font-black">{result.timedOut ? "⏱️ Stopped" : "💥 Couldn't run"}</div>
        <pre className="mt-1 whitespace-pre-wrap">{result.error}</pre>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-white/10 bg-[#07111c]/90 p-4">
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
                {t.error ? <div className="text-rose-200">threw {t.error}</div> : <div>got {t.got}</div>}
                <div className="text-emerald-300">expected {t.expected}</div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {result.logs.length > 0 && (
        <div className="mt-3">
          <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">console.log</div>
          <pre className="mt-1 max-h-40 overflow-auto rounded-lg bg-black/40 p-2.5 font-mono text-[12px] text-slate-200">{result.logs.join("\n")}</pre>
        </div>
      )}
    </div>
  );
}
