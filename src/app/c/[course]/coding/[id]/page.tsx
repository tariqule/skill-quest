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
import { BlockIcon } from "@/components/learn/block-icons";

const noop = () => () => {};

export default function CodingPlay() {
  const { id } = useParams<{ id: string }>();
  const { course } = useCourse();
  const challenge = (course.coding ?? []).find((c) => c.id === id);
  if (!challenge) notFound();
  // Drafts live in localStorage, so the workspace only mounts in the browser (no hydration mismatch).
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  if (!mounted) return <main className="mx-auto w-full max-w-6xl px-4 py-10 font-mono text-muted-foreground">Loading editor…</main>;
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
      <Link href={href("/coding")} className="font-mono text-sm text-muted-foreground hover:text-foreground">
        ← All challenges
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[11px] font-bold">
        <span className="rounded px-1.5 py-0.5" style={{ background: `${lv.color}22`, color: lv.color }}>
          <BlockIcon icon={lv.icon} className="inline-block size-[1.1em] align-[-0.15em]" /> {lv.name}
        </span>
        {domain && (
          <span style={{ color: domain.color }}>
            <BlockIcon icon={domain.emoji} className="inline-block size-[1.1em] align-[-0.15em]" /> {domain.world}
          </span>
        )}
        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">{label}</span>
        {c.idea && <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground"><BlockIcon icon="💡" className="inline-block size-[1.1em] align-[-0.15em]" /> {c.idea}</span>}
        <span role="status" className="contents">
          {runStatusChips(solved, summary && result ? { ...summary, error: !!result.error, timedOut: !!result.timedOut } : null).map((chip) => (
            <span key={chip.text} className={`rounded px-1.5 py-0.5 ${chip.tone === "good" ? "bg-success/15 text-success-foreground" : "bg-destructive/15 text-destructive-foreground"}`}>
              {chip.text}
            </span>
          ))}
        </span>
      </div>
      <h1 className="mt-2 font-mono text-2xl font-semibold text-foreground sm:text-3xl">{c.title}</h1>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <section className="min-w-0 space-y-4">
          <div className="rounded-2xl border border-border bg-[#07111c]/90 p-4 text-foreground">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">Task</div>
            <p className="mt-2 whitespace-pre-line leading-relaxed">
              <RichText text={c.prompt} />
            </p>
            <div className="mt-4 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">Examples</div>
            <ul className="mt-2 grid gap-1.5 font-mono text-[12px]">
              {visibleTests.slice(0, 3).map((t, i) => (
                <li key={i} className="overflow-x-auto whitespace-nowrap rounded-lg bg-background/30 px-2.5 py-1.5 text-muted-foreground">
                  {c.fn}({t.args.map((a) => show(a, lang)).join(", ")}) <span className="text-success-foreground">→ {show(t.expected, lang)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              {c.tests.length} tests{c.tests.some((t) => t.hidden) ? `, ${c.tests.filter((t) => t.hidden).length} of them hidden` : ""}. {lang === "java" ? `Edit the method in class Solution, then run. Java runs as Java 8 with Java 10 syntax, so var works but List.of does not.` : "Edit the function, then run."}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-[#07111c]/90 p-4">
            <div className="flex items-center justify-between">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">Hints</div>
              <button
                type="button"
                disabled={hints >= c.hints.length}
                onClick={() => setHints((h) => h + 1)}
                className="rounded-lg border border-warning/40 px-2.5 py-1 font-mono text-xs font-bold text-warning-foreground transition hover:bg-warning/10 disabled:opacity-40"
              >
                <BlockIcon icon="💡" className="inline-block size-[1.1em] align-[-0.15em]" /> {hints >= c.hints.length ? "No more hints" : `Hint ${hints + 1}/${c.hints.length}`}
              </button>
            </div>
            {hints === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">Try it first. Each hint costs a little XP, and they get more revealing.</p>
            ) : (
              <ol className="mt-3 grid gap-2 text-sm text-warning-foreground">
                {c.hints.slice(0, hints).map((h, i) => (
                  <li key={i} className="rounded-lg bg-warning/10 px-3 py-2">
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
              className="rounded-xl bg-success px-5 py-2.5 font-mono text-sm font-semibold uppercase tracking-wider text-primary-foreground disabled:opacity-60"
            >
              {running ? "Running…" : `▶ Run ${label}`}
            </button>
            <button
              type="button"
              onClick={() => {
                change(c.starter);
                setResult(null);
              }}
              className="rounded-xl border border-border px-3 py-2.5 font-mono text-xs font-bold text-muted-foreground hover:bg-muted"
            >
              ↺ Reset
            </button>
            {solution === "hidden" && (attempted || result?.unavailable) && (
              <button type="button" onClick={() => setSolution("confirm")} className="rounded-xl border border-border px-3 py-2.5 font-mono text-xs font-bold text-muted-foreground hover:bg-muted">
                <BlockIcon icon="👁" className="inline-block size-[1.1em] align-[-0.15em]" /> Show solution
              </button>
            )}
            {solution === "confirm" && (
              <button type="button" onClick={() => setSolution("shown")} className="rounded-xl border border-destructive/50 px-3 py-2.5 font-mono text-xs font-bold text-destructive-foreground hover:bg-destructive/10">
                Really show it? Costs most of the XP
              </button>
            )}
            <span className="ml-auto hidden font-mono text-[11px] text-muted-foreground sm:inline">Ctrl/⌘ + Enter to run</span>
          </div>

          {solution === "hidden" && !attempted && !result?.unavailable && <p className="font-mono text-[11px] text-muted-foreground">The reference solution unlocks after your first run.</p>}
          <div aria-live="polite" className="font-mono text-xs text-primary">
            {running && status}
          </div>
          {result && <Results result={result} fn={c.fn} lang={lang} />}

          {summary?.allPassed && (
            <div className="pop-in rounded-2xl border border-success/40 bg-success/10 p-4">
              <div className="font-mono text-lg font-semibold text-success-foreground"><BlockIcon icon="🎉" className="inline-block size-[1.1em] align-[-0.15em]" /> All tests pass{xp ? ` · +${xp} XP` : ""}</div>
              <p className="mt-2 text-sm text-foreground">
                <RichText text={c.explanation} />
              </p>
              {c.complexity && (
                <p className="mt-2 font-mono text-xs text-success-foreground/80">
                  <BlockIcon icon="⏱" className="inline-block size-[1.1em] align-[-0.15em]" /> <RichText text={c.complexity} />
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {next && (
                  <Link href={href(`/coding/${next.id}`)} className="rounded-xl bg-success px-4 py-2 font-mono text-sm font-semibold text-primary-foreground">
                    Next challenge →
                  </Link>
                )}
                <Link href={href("/coding")} className="rounded-xl border border-border px-4 py-2 font-mono text-sm font-bold text-foreground hover:bg-muted">
                  All challenges
                </Link>
              </div>
            </div>
          )}

          {solution === "shown" && (
            <div className="rounded-2xl border border-border bg-[#07111c]/90 p-4">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">Reference solution</div>
              <div className="mt-2">
                <CodeBlock code={c.solution} lang={lang} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                <RichText text={c.explanation} />
              </p>
              {c.complexity && (
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  <BlockIcon icon="⏱" className="inline-block size-[1.1em] align-[-0.15em]" /> <RichText text={c.complexity} />
                </p>
              )}
              <button type="button" onClick={() => change(c.solution)} className="mt-3 rounded-lg border border-border px-3 py-1.5 font-mono text-xs font-bold text-foreground hover:bg-muted">
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
      <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 font-mono text-sm text-destructive-foreground">
        <div className="font-semibold">{result.timedOut ? "Stopped" : "Couldn't run"}</div>
        <pre className="mt-1 overflow-x-auto whitespace-pre-wrap">{result.error}</pre>
        {result.logs.length > 0 && <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-background/40 p-2.5 text-[12px] text-foreground">{result.logs.join("\n")}</pre>}
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-border bg-[#07111c]/90 p-4" role="status">
      <div className={`font-mono text-sm font-semibold ${s.allPassed ? "text-success-foreground" : "text-warning-foreground"}`}>
        {s.passed}/{s.total} tests passed
      </div>
      <ul className="mt-3 grid gap-1.5">
        {result.results.map((t, i) => (
          <li key={i} className={`rounded-lg border px-3 py-2 font-mono text-[12px] ${t.ok ? "border-success/20 bg-success/5 text-success-foreground" : "border-destructive/30 bg-destructive/10 text-destructive-foreground"}`}>
            <div className="flex items-center gap-2">
              <span>{t.ok ? <BlockIcon icon="✓" className="inline-block size-[1.1em] align-[-0.15em]" /> : <BlockIcon icon="✗" className="inline-block size-[1.1em] align-[-0.15em]" />}</span>
              <span className="font-bold">{t.hidden ? "hidden test" : t.name}</span>
            </div>
            {!t.ok && !t.hidden && (
              <div className="mt-1 grid gap-0.5 overflow-x-auto whitespace-pre text-foreground">
                <div className="text-muted-foreground">
                  {fn}({t.args})
                </div>
                {t.error ? <div className="text-destructive-foreground">threw {t.error}</div> : <div>got {t.got ?? "nothing"}</div>}
                {t.expected !== undefined && <div className="text-success-foreground">expected {t.expected}</div>}
              </div>
            )}
          </li>
        ))}
      </ul>
      {result.logs.length > 0 && (
        <div className="mt-3">
          <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{lang === "python" ? "print output" : lang === "java" ? "System.out" : "console.log"}</div>
          <pre className="mt-1 max-h-40 overflow-auto rounded-lg bg-background/40 p-2.5 font-mono text-[12px] text-foreground">{result.logs.join("\n")}</pre>
        </div>
      )}
    </div>
  );
}
