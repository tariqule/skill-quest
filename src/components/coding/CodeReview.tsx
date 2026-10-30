"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Editor } from "@/components/coding/Editor";
import { RichText } from "@/components/learn/code";
import { summarize } from "@/engine/coding";
import { LANGUAGE_LABEL, languageOf } from "@/engine/coding-langs";
import { codingGrade } from "@/engine/coding-review";
import { runChallenge, warmRuntime, type LiveRun } from "@/engine/runners";
import type { ReviewGrade } from "@/engine/srs";
import { getCourseStore } from "@/engine/store";
import type { CodingChallenge, Course } from "@/engine/types";

/**
 * A live-coding exercise in Daily Review: solve it again from the starter. Passing grades it by how
 * cleanly it went; "Skip" sends it back soon. XP and attempts go to the course like on the exercise page.
 */
export function CodeReview({ course, c, onDone }: { course: Course; c: CodingChallenge; onDone: (grade: ReviewGrade) => void }) {
  const lang = languageOf(c);
  const [code, setCode] = useState(c.starter);
  const [result, setResult] = useState<LiveRun | null>(null);
  const [status, setStatus] = useState("");
  const [running, setRunning] = useState(false);
  const [hints, setHints] = useState(0);
  const [grade, setGrade] = useState<ReviewGrade | null>(null);
  const failed = useRef(false);
  const warmed = useRef(false);

  async function run() {
    if (running || grade) return;
    setRunning(true);
    const r = await runChallenge(c, code, setStatus);
    setRunning(false);
    setResult(r);
    if (r.unavailable) return;
    const ok = summarize(r).allPassed;
    getCourseStore(course).recordCoding(c.id, ok, hints);
    if (ok) setGrade(codingGrade({ solved: true, hints, failedBefore: failed.current, sawSolution: false }));
    else failed.current = true;
  }

  const s = result && !result.error ? summarize(result) : null;
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 sm:p-7">
      <div className="text-sm font-bold uppercase tracking-wider text-slate-400">Live coding · {LANGUAGE_LABEL[lang]}</div>
      <div className="mt-1 text-xl font-black text-white">{c.title}</div>
      <p className="mt-2 text-base text-slate-200">
        <RichText text={c.prompt} />
      </p>
      <div
        className="mt-3"
        onFocus={() => {
          if (!warmed.current) {
            warmed.current = true;
            warmRuntime(c);
          }
        }}
      >
        <Editor value={code} lang={lang} onChange={setCode} onRun={run} minLines={Math.min(14, c.starter.split("\n").length + 3)} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={run} disabled={running || !!grade} className="rounded-xl bg-emerald-400 px-4 py-2 font-black text-slate-950 disabled:opacity-60">
          {running ? "Running…" : `▶ Run ${LANGUAGE_LABEL[lang]}`}
        </button>
        {!grade && hints < c.hints.length && (
          <button type="button" onClick={() => setHints((h) => h + 1)} className="rounded-xl border border-amber-300/40 px-3 py-2 text-sm font-bold text-amber-200">
            💡 Hint
          </button>
        )}
        {!grade && (
          <button type="button" onClick={() => onDone("again")} className="rounded-xl border border-white/15 px-3 py-2 text-sm font-bold text-slate-300">
            Skip for now
          </button>
        )}
        <Link href={`/c/${course.id}/coding/${c.id}`} className="ml-auto text-sm font-bold text-sky-300 hover:text-sky-200">
          Open full exercise →
        </Link>
      </div>
      {hints > 0 && (
        <ol className="mt-3 grid gap-1.5 text-sm text-amber-100">
          {c.hints.slice(0, hints).map((h, i) => (
            <li key={i} className="rounded-lg bg-amber-300/10 px-3 py-2">
              <RichText text={h} />
            </li>
          ))}
        </ol>
      )}
      <div aria-live="polite" className="mt-2 font-mono text-xs text-sky-200">
        {running && status}
      </div>
      {result?.error && <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl bg-rose-400/10 p-3 font-mono text-sm text-rose-100">{result.error}</pre>}
      {s && (
        <div role="status" className={`mt-2 font-mono text-sm font-black ${s.allPassed ? "text-emerald-300" : "text-amber-200"}`}>
          {s.passed}/{s.total} tests passed
          {!s.allPassed && result!.results.find((t) => !t.ok && !t.hidden) && (
            <div className="mt-1 whitespace-pre-wrap text-xs font-normal text-rose-100">
              {(() => {
                const t = result!.results.find((x) => !x.ok && !x.hidden)!;
                return `${t.name}: ${t.error ? `threw ${t.error}` : `got ${t.got ?? "nothing"}`}${t.expected !== undefined ? `, expected ${t.expected}` : ""}`;
              })()}
            </div>
          )}
        </div>
      )}
      {grade && (
        <button type="button" onClick={() => onDone(grade)} className="mt-4 w-full rounded-2xl bg-sky-400 px-5 py-3 font-black text-slate-950">
          Next →
        </button>
      )}
    </div>
  );
}
