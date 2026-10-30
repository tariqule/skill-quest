"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { FIX_BASE, MAX_INDENT, MISSED_LINE, decodePick, encodePick, parsonsFeedback, parsonsHint, parsonsSolution, type ParsonsStatus } from "@/engine/code-games";
import { encodeText, shuffle, type PreparedQuestion } from "@/engine/game";
import { CodeBlock, Tokens } from "../learn/code";

interface BodyProps {
  q: PreparedQuestion;
  submitted: number[] | null;
  onSubmit: (picked: number[]) => void;
  reveal: boolean;
}

const STATUS: Record<ParsonsStatus, { icon: string; label: string; tone: string }> = {
  ok: { icon: "✓", label: "in the right place", tone: "border-emerald-400 bg-emerald-400/15" },
  indent: { icon: "⇥", label: "right line, wrong indentation", tone: "border-amber-400 bg-amber-400/15" },
  misplaced: { icon: "↕", label: "belongs somewhere else", tone: "border-rose-400 bg-rose-400/15" },
  decoy: { icon: "✗", label: "a decoy that doesn't belong", tone: "border-rose-400 bg-rose-400/15" },
};

const btn = "inline-flex h-11 min-w-11 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-2 text-base text-slate-100 transition hover:border-sky-400/60 hover:bg-sky-400/10 disabled:opacity-30";

/** Parsons puzzle: build the solution from the pool, reorder and indent it, with buttons or the keyboard. */
export function ParsonsBody({ q, submitted, onSubmit, reveal }: BodyProps) {
  const p = q.parsons!;
  const [placed, setPlaced] = useState<number[]>([]);
  const [hints, setHints] = useState(0);
  const [live, setLive] = useState("");
  const locked = submitted !== null;
  const rows = submitted ?? placed;
  const used = new Set(rows.map((x) => decodePick(x).block));
  const pool = p.blocks.map((_, i) => i).filter((i) => !used.has(i));
  const status = locked ? parsonsFeedback(p, rows) : null;
  const text = (pick: number) => p.blocks[decodePick(pick).block];
  // Row to focus after the next render (indent, reorder and remove re-render the list).
  const focusRow = useRef<number | null>(null);
  useEffect(() => {
    if (focusRow.current === null) return;
    const i = Math.min(focusRow.current, placed.length - 1);
    focusRow.current = null;
    if (i >= 0) document.getElementById(`${q.id}-row-${i}`)?.focus();
    else document.getElementById(`${q.id}-pool`)?.querySelector("button")?.focus();
  }, [placed, q.id]);

  function move(i: number, to: number) {
    if (to < 0 || to >= placed.length) return;
    const next = [...placed];
    [next[i], next[to]] = [next[to], next[i]];
    focusRow.current = to;
    setPlaced(next);
    setLive(`Moved "${text(placed[i]).trim()}" to line ${to + 1}.`);
  }
  function indent(i: number, by: number) {
    const { block, indent: cur } = decodePick(placed[i]);
    const n = Math.max(0, Math.min(MAX_INDENT, cur + by));
    focusRow.current = i;
    setPlaced(placed.map((x, k) => (k === i ? encodePick(block, n) : x)));
    setLive(n === cur ? `Line ${i + 1} can't move further.` : `Line ${i + 1} ${n > cur ? "indented" : "outdented"} to level ${n}.`);
  }
  function remove(i: number) {
    setLive(`Removed "${text(placed[i]).trim()}" from line ${i + 1}.`);
    focusRow.current = i;
    setPlaced(placed.filter((_, k) => k !== i));
  }
  function onRowKey(e: KeyboardEvent, i: number) {
    if (locked) return;
    if (e.altKey && e.key === "ArrowUp") move(i, i - 1);
    else if (e.altKey && e.key === "ArrowDown") move(i, i + 1);
    else if (e.key === "ArrowUp") document.getElementById(`${q.id}-row-${i - 1}`)?.focus();
    else if (e.key === "ArrowDown") document.getElementById(`${q.id}-row-${i + 1}`)?.focus();
    else if (p.indent && e.key === "ArrowRight") indent(i, 1);
    else if (p.indent && e.key === "ArrowLeft") indent(i, -1);
    else if (e.key === "Delete" || e.key === "Backspace") remove(i);
    else return;
    e.preventDefault();
  }

  return (
    <>
      {!locked && (
        <p className="mt-2 text-sm text-amber-300">
          Tap lines to add them in order{p.indent ? ", set the indentation with ⇤ ⇥" : ""}, and leave out the decoys. Keyboard: ↑↓ to move between lines, Alt+↑↓ to reorder{p.indent ? ", ←→ to indent" : ""}, Delete to remove.
        </p>
      )}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{live}</div>
      <ol aria-label="Your solution" className="mt-4 grid min-w-0 gap-1.5 rounded-xl border border-white/10 bg-slate-950 p-2">
        {rows.length === 0 && <li className="px-2 py-3 text-sm text-slate-500">Your solution is empty. Add lines from below.</li>}
        {rows.map((pick, i) => {
          const { indent: lvl } = decodePick(pick);
          const st = status?.[i];
          const tone = st && reveal ? STATUS[st].tone : "border-white/10 bg-white/[0.03]";
          return (
            <li key={decodePick(pick).block} className={`flex min-w-0 items-center gap-1 rounded-lg border ${tone}`}>
              <button
                id={`${q.id}-row-${i}`}
                type="button"
                disabled={locked}
                onKeyDown={(e) => onRowKey(e, i)}
                aria-label={`Line ${i + 1}${p.indent ? `, indent ${lvl}` : ""}: ${text(pick).trim()}${st && reveal ? `, ${STATUS[st].label}` : ""}`}
                className="min-w-0 flex-1 overflow-x-auto px-2 py-2 text-left font-mono text-[13px] text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <span className="mr-2 select-none text-slate-500">{i + 1}</span>
                <span className="whitespace-pre" style={{ paddingLeft: p.indent ? `${lvl * 1.5}rem` : undefined }}>
                  <Tokens code={text(pick)} lang={q.codeLang} />
                </span>
              </button>
              {st && reveal && <span className="px-2 text-base" aria-hidden>{STATUS[st].icon}</span>}
              {!locked && (
                <div className="flex shrink-0 gap-1 pr-1">
                  {p.indent && (
                    <>
                      <button type="button" className={btn} disabled={lvl === 0} onClick={() => indent(i, -1)} aria-label={`Outdent line ${i + 1}`}>⇤</button>
                      <button type="button" className={btn} disabled={lvl >= MAX_INDENT} onClick={() => indent(i, 1)} aria-label={`Indent line ${i + 1}`}>⇥</button>
                    </>
                  )}
                  <button type="button" className={btn} disabled={i === 0} onClick={() => move(i, i - 1)} aria-label={`Move line ${i + 1} up`}>↑</button>
                  <button type="button" className={btn} disabled={i === rows.length - 1} onClick={() => move(i, i + 1)} aria-label={`Move line ${i + 1} down`}>↓</button>
                  <button type="button" className={btn} onClick={() => remove(i)} aria-label={`Remove line ${i + 1}`}>✕</button>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {!locked && pool.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Lines to use ({pool.length})</div>
          <ul id={`${q.id}-pool`} className="mt-2 grid gap-1.5">
            {pool.map((i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => {
                    setPlaced([...placed, encodePick(i, 0)]);
                    setLive(`Added "${p.blocks[i].trim()}" as line ${placed.length + 1}.`);
                  }}
                  aria-label={`Add line: ${p.blocks[i].trim()}`}
                  className="flex min-h-11 w-full min-w-0 items-center overflow-x-auto rounded-lg border border-dashed border-white/20 bg-white/5 px-3 py-2 text-left font-mono text-[13px] text-slate-100 transition hover:border-sky-400/60 hover:bg-sky-400/10"
                >
                  <span className="mr-2 text-sky-300" aria-hidden>＋</span>
                  <span className="whitespace-pre"><Tokens code={p.blocks[i]} lang={q.codeLang} /></span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!locked && hints > 0 && (
        <p className="pop-in mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-100" role="status">
          💡 {parsonsHint(p, placed, hints - 1, q.type === "parsons" ? q.hint : undefined)}
        </p>
      )}
      {!locked && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => setHints((h) => h + 1)} className="rounded-xl border border-amber-400/50 px-4 py-2.5 font-semibold text-amber-200 hover:bg-amber-400/10">
            💡 Hint{hints > 0 ? ` (${hints})` : ""}
          </button>
          <button type="button" disabled={placed.length === 0} onClick={() => onSubmit(placed)} className="rounded-xl bg-sky-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-40">
            Check
          </button>
        </div>
      )}
      {locked && reveal && status && (
        <>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300">
            {(Object.keys(STATUS) as ParsonsStatus[]).filter((s) => status.includes(s)).map((s) => (
              <li key={s}>{STATUS[s].icon} {STATUS[s].label}</li>
            ))}
            {rows.length < p.solution.length && <li>… {p.solution.length - rows.length} line(s) missing</li>}
          </ul>
          {!status.every((s) => s === "ok") || rows.length !== p.solution.length ? (
            <div className="mt-3">
              <div className="text-sm font-semibold text-emerald-300">Working solution</div>
              <CodeBlock code={parsonsSolution(p)} lang={q.codeLang} />
            </div>
          ) : null}
        </>
      )}
    </>
  );
}

/**
 * Spot the Bug: tap the buggy line, then pick the fix. Fixes only appear for the right line: tapping a
 * line that's fine says so and counts as a miss, and the player tries another line.
 */
export function BugBody({ q, submitted, onSubmit, reveal }: BodyProps) {
  const [line, setLine] = useState<number | null>(null);
  const [fix, setFix] = useState<number | null>(null);
  const [missed, setMissed] = useState<number[]>([]);
  const locked = submitted !== null;
  const right = q.correct[0];
  const pickedLine = locked ? submitted[0] : line;
  const pickedFix = locked ? (submitted[1] ?? FIX_BASE - 1) - FIX_BASE : fix;
  const missedAny = locked ? submitted.includes(MISSED_LINE) : missed.length > 0;
  const onRight = pickedLine === right;
  const fixes = q.fixOptions ?? [];
  const correctFix = q.fixCorrect ?? -1;

  function pick(i: number) {
    setLine(i);
    setFix(null);
    if (i !== right && !missed.includes(i)) setMissed([...missed, i]);
  }

  return (
    <>
      {!locked && (
        <p className="mt-2 text-sm text-amber-300">{line === null || !onRight ? "Step 1: tap the line with the bug." : "Step 2: pick the fix for that line, then Check."}</p>
      )}
      <div className="mt-4 min-w-0 overflow-hidden rounded-xl border border-white/10 bg-slate-950">
        {q.codeLang && <div className="border-b border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">{q.codeLang}</div>}
        <div className="overflow-x-auto py-1" role="group" aria-label="Code lines: tap the buggy one">
          {q.shuffled.map((l, i) => {
            const isPicked = pickedLine === i;
            let tone = "hover:bg-sky-400/10";
            if (locked && reveal) tone = i === right ? "bg-emerald-400/20" : missed.includes(i) || isPicked ? "bg-rose-400/20" : "opacity-60";
            else if (isPicked) tone = onRight ? "bg-amber-400/20 ring-1 ring-amber-400/60" : "bg-rose-400/15 ring-1 ring-rose-400/60";
            else if (missed.includes(i)) tone = "bg-rose-400/10";
            return (
              <button
                key={i}
                type="button"
                disabled={locked || !l.trim()}
                aria-pressed={isPicked}
                aria-label={`Line ${i + 1}: ${l.trim() || "blank"}${missed.includes(i) ? ", already checked: fine" : ""}`}
                onClick={() => pick(i)}
                className={`flex min-h-9 w-full min-w-max items-start gap-3 px-3 py-1 text-left font-mono text-[13px] leading-relaxed transition ${tone}`}
              >
                <span className="w-6 shrink-0 select-none text-right text-slate-300">{i + 1}</span>
                <span className="whitespace-pre text-slate-100"><Tokens code={l || " "} lang={q.codeLang} /></span>
                {locked && reveal && i === right && <span className="ml-auto pl-3 text-emerald-300">🐞</span>}
              </button>
            );
          })}
        </div>
      </div>
      <div role="status" aria-live="polite">
        {!locked && line !== null && !onRight && (
          <p className="pop-in mt-3 rounded-lg border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-sm text-rose-100">
            Line {line + 1} is fine. Try another line. (This counts as a miss.)
          </p>
        )}
      </div>
      {(locked ? reveal : onRight && line !== null) && (
        <div className="pop-in mt-4">
          <div className="text-sm font-semibold text-white">{locked ? `The fix for line ${right + 1}` : `Replace line ${right + 1} with:`}</div>
          <ul className="mt-2 grid gap-2" role="radiogroup" aria-label="Fixes">
            {fixes.map((f, i) => {
              const isPicked = onRight && pickedFix === i;
              let tone = "border-white/30 bg-slate-800 hover:border-sky-400 hover:bg-sky-400/10";
              if (locked && reveal) tone = i === correctFix ? "border-emerald-400 bg-emerald-400/15" : isPicked ? "border-rose-400 bg-rose-400/15" : "border-white/15 bg-slate-800/60 text-slate-300";
              else if (isPicked) tone = "border-sky-400 bg-sky-400/20";
              return (
                <li key={i}>
                  <button type="button" role="radio" aria-checked={isPicked} disabled={locked} onClick={() => setFix(i)} className={`flex min-h-11 w-full min-w-0 items-center gap-2 overflow-x-auto rounded-xl border px-3 py-2 text-left font-mono text-[13px] text-white ${tone}`}>
                    {locked && reveal && i === correctFix && <span className="font-sans text-emerald-300" aria-hidden>✓</span>}
                    {locked && reveal && isPicked && i !== correctFix && <span className="font-sans text-rose-300" aria-hidden>✗</span>}
                    <span className="whitespace-pre"><Tokens code={f} lang={q.codeLang} /></span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {locked && reveal && (
        <div className="mt-2 grid gap-1 text-sm">
          {missedAny && <p className="text-rose-200">You tapped {missed.length > 1 ? "lines that were" : "a line that was"} fine first, so this counts as a miss.</p>}
          {!onRight && <p className="text-emerald-300">The bug is on line {right + 1}.</p>}
          {onRight && pickedFix !== null && pickedFix !== correctFix && pickedFix >= 0 && (
            <p className="text-rose-200">
              Your fix doesn&apos;t work. The right fix is <code className="whitespace-pre rounded bg-white/10 px-1 font-mono text-emerald-200">{fixes[correctFix]?.trim()}</code>.
            </p>
          )}
        </div>
      )}
      {!locked && (
        <button
          type="button"
          disabled={line === null || !onRight || fix === null}
          onClick={() => onSubmit([line!, FIX_BASE + fix!, ...(missed.length ? [MISSED_LINE] : [])])}
          className="mt-5 rounded-xl bg-sky-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-40"
        >
          Check
        </button>
      )}
    </>
  );
}

/** Predict the Output: tappable choices next to the typing box. */
export function OutputChoices({ q, onSubmit }: { q: PreparedQuestion; onSubmit: (picked: number[]) => void }) {
  const [opts] = useState(() => {
    if (q.type !== "output" || !q.choices) return [];
    return shuffle(q.choices.includes(q.answers[0]) ? q.choices : [q.answers[0], ...q.choices]);
  });
  if (opts.length === 0) return null;
  return (
    <div className="mt-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Or choose</div>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {opts.map((o) => (
          <li key={o} className="min-w-0">
            <button type="button" onClick={() => onSubmit(encodeText(o))} className="flex min-h-11 w-full min-w-0 items-center overflow-x-auto rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left font-mono text-[13px] text-slate-100 hover:border-sky-400/60 hover:bg-sky-400/10">
              <span className="whitespace-pre">{o}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Worked example: the execution, one step per line. */
export function TraceSteps({ steps }: { steps: string[] }) {
  return (
    <div className="mt-3">
      <div className="text-sm font-semibold text-white">Step by step</div>
      <ol className="mt-1 grid list-decimal gap-1 pl-6 text-base text-slate-300">
        {steps.map((s, i) => (
          <li key={i}><TraceText text={s} /></li>
        ))}
      </ol>
    </div>
  );
}

function TraceText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/).map((part, i) =>
        part.startsWith("`") && part.endsWith("`") && part.length > 1 ? (
          <code key={i} className="rounded bg-white/10 px-1 font-mono text-[0.9em] text-sky-100">{part.slice(1, -1)}</code>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
