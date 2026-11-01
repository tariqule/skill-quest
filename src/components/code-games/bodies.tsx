"use client";

import { ArrowUpDown, Bug, Check, IndentIncrease, Lightbulb, X, type LucideIcon } from "lucide-react";
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

const STATUS: Record<ParsonsStatus, { icon: LucideIcon; label: string; tone: string }> = {
  ok: { icon: Check, label: "in the right place", tone: "border-success bg-success/15" },
  indent: { icon: IndentIncrease, label: "right line, wrong indentation", tone: "border-warning bg-warning/15" },
  misplaced: { icon: ArrowUpDown, label: "belongs somewhere else", tone: "border-destructive bg-destructive/15" },
  decoy: { icon: X, label: "a decoy that doesn't belong", tone: "border-destructive bg-destructive/15" },
};

function StatusIcon({ status, className }: { status: ParsonsStatus; className?: string }) {
  const Icon = STATUS[status].icon;
  return <Icon aria-hidden="true" className={className} />;
}

const btn = "inline-flex h-11 min-w-11 items-center justify-center rounded-control border border-border bg-card px-2 text-base text-foreground transition-colors hover:border-primary/60 hover:bg-primary/10 disabled:opacity-40";

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
        <p className="mt-2 text-sm text-warning-foreground">
          Tap lines to add them in order{p.indent ? ", set the indentation with ⇤ ⇥" : ""}, and leave out the decoys. Keyboard: ↑↓ to move between lines, Alt+↑↓ to reorder{p.indent ? ", ←→ to indent" : ""}, Delete to remove.
        </p>
      )}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{live}</div>
      <ol aria-label="Your solution" className="mt-4 grid min-w-0 gap-1.5 rounded-control border border-border bg-code text-code-foreground p-2">
        {rows.length === 0 && <li className="px-2 py-3 text-sm text-code-muted">Your solution is empty. Add lines from below.</li>}
        {rows.map((pick, i) => {
          const { indent: lvl } = decodePick(pick);
          const st = status?.[i];
          const tone = st && reveal ? STATUS[st].tone : "border-code-muted/30 bg-code-foreground/5";
          return (
            <li key={decodePick(pick).block} className={`flex min-w-0 items-center gap-1 rounded-lg border ${tone}`}>
              <button
                id={`${q.id}-row-${i}`}
                type="button"
                disabled={locked}
                onKeyDown={(e) => onRowKey(e, i)}
                aria-label={`Line ${i + 1}${p.indent ? `, indent ${lvl}` : ""}: ${text(pick).trim()}${st && reveal ? `, ${STATUS[st].label}` : ""}`}
                className="min-w-0 flex-1 overflow-x-auto px-2 py-2 text-left font-mono text-sm text-code-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="mr-2 select-none text-code-muted">{i + 1}</span>
                <span className="whitespace-pre" style={{ paddingLeft: p.indent ? `${lvl * 1.5}rem` : undefined }}>
                  <Tokens code={text(pick)} lang={q.codeLang} />
                </span>
              </button>
              {st && reveal && <StatusIcon status={st} className="mx-2 size-4 shrink-0" />}
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
                  <button type="button" className={btn} onClick={() => remove(i)} aria-label={`Remove line ${i + 1}`}><X aria-hidden="true" className="size-4" /></button>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {!locked && pool.length > 0 && (
        <div className="mt-3">
          <div className="text-sm font-medium text-muted-foreground">Lines to use ({pool.length})</div>
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
                  className="flex min-h-11 w-full min-w-0 items-center overflow-x-auto rounded-control border border-dashed border-code-muted/50 bg-code px-3 py-2 text-left font-mono text-sm text-code-foreground transition-colors hover:border-primary"
                >
                  <span className="mr-2 text-primary" aria-hidden>＋</span>
                  <span className="whitespace-pre"><Tokens code={p.blocks[i]} lang={q.codeLang} /></span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!locked && hints > 0 && (
        <p className="mt-3 rounded-control border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-foreground" role="status">
          <Lightbulb aria-hidden="true" className="mr-1.5 inline size-4 align-[-2px]" />{parsonsHint(p, placed, hints - 1, q.type === "parsons" ? q.hint : undefined)}
        </p>
      )}
      {!locked && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => setHints((h) => h + 1)} className="inline-flex min-h-11 items-center rounded-control border border-border px-4 py-2.5 font-semibold text-foreground hover:bg-accent/40">
            <Lightbulb aria-hidden="true" className="size-4" /> Hint{hints > 0 ? ` (${hints})` : ""}
          </button>
          <button type="button" disabled={placed.length === 0} onClick={() => onSubmit(placed)} className="inline-flex min-h-11 items-center rounded-control bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40">
            Check
          </button>
        </div>
      )}
      {locked && reveal && status && (
        <>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {(Object.keys(STATUS) as ParsonsStatus[]).filter((s) => status.includes(s)).map((s) => (
              <li key={s} className="flex items-center gap-2"><StatusIcon status={s} className="size-4 shrink-0" />{STATUS[s].label}</li>
            ))}
            {rows.length < p.solution.length && <li>… {p.solution.length - rows.length} line(s) missing</li>}
          </ul>
          {!status.every((s) => s === "ok") || rows.length !== p.solution.length ? (
            <div className="mt-3">
              <div className="text-sm font-semibold text-success-foreground">Working solution</div>
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
        <p className="mt-2 text-sm text-warning-foreground">{line === null || !onRight ? "Step 1: tap the line with the bug." : "Step 2: pick the fix for that line, then Check."}</p>
      )}
      <div className="mt-4 min-w-0 overflow-hidden rounded-control border border-border bg-code text-code-foreground">
        {q.codeLang && <div className="border-b border-code-muted/30 px-3 py-1 text-sm font-medium text-code-muted">{q.codeLang}</div>}
        <div className="overflow-x-auto py-1" role="group" aria-label="Code lines: tap the buggy one">
          {q.shuffled.map((l, i) => {
            const isPicked = pickedLine === i;
            let tone = "hover:bg-code-foreground/10";
            if (locked && reveal) tone = i === right ? "bg-success/25" : missed.includes(i) || isPicked ? "bg-destructive/25" : "opacity-70";
            else if (isPicked) tone = onRight ? "bg-primary/25 ring-1 ring-primary" : "bg-destructive/20 ring-1 ring-destructive";
            else if (missed.includes(i)) tone = "bg-destructive/15";
            return (
              <button
                key={i}
                type="button"
                disabled={locked || !l.trim()}
                aria-pressed={isPicked}
                aria-label={`Line ${i + 1}: ${l.trim() || "blank"}${missed.includes(i) ? ", already checked: fine" : ""}`}
                onClick={() => pick(i)}
                className={`flex min-h-11 w-full min-w-max items-start gap-3 px-3 py-1 text-left font-mono text-sm leading-relaxed transition ${tone}`}
              >
                <span className="w-6 shrink-0 select-none text-right text-code-muted">{i + 1}</span>
                <span className="whitespace-pre text-code-foreground"><Tokens code={l || " "} lang={q.codeLang} /></span>
                {locked && reveal && i === right && <span className="ml-auto inline-flex items-center gap-1 pl-3 font-sans text-sm text-code-foreground"><Bug aria-hidden="true" className="size-4" />Bug</span>}
              </button>
            );
          })}
        </div>
      </div>
      <div role="status" aria-live="polite">
        {!locked && line !== null && !onRight && (
          <p className="mt-3 rounded-control border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-foreground">
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
              let tone = "border-code-muted/40 hover:border-primary";
              if (locked && reveal) tone = i === correctFix ? "border-success ring-2 ring-success" : isPicked ? "border-destructive ring-2 ring-destructive" : "border-code-muted/30 opacity-70";
              else if (isPicked) tone = "border-primary ring-2 ring-primary";
              return (
                <li key={i}>
                  <button type="button" role="radio" aria-checked={isPicked} disabled={locked} onClick={() => setFix(i)} className={`flex min-h-11 w-full min-w-0 items-center gap-2 overflow-x-auto rounded-control border bg-code px-3 py-2 text-left font-mono text-sm text-code-foreground ${tone}`}>
                    {locked && reveal && i === correctFix && <Check aria-hidden="true" className="size-4 shrink-0 text-code-foreground" />}
                    {locked && reveal && isPicked && i !== correctFix && <X aria-hidden="true" className="size-4 shrink-0 text-code-foreground" />}
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
          {missedAny && <p className="text-destructive-foreground">You tapped {missed.length > 1 ? "lines that were" : "a line that was"} fine first, so this counts as a miss.</p>}
          {!onRight && <p className="text-success-foreground">The bug is on line {right + 1}.</p>}
          {onRight && pickedFix !== null && pickedFix !== correctFix && pickedFix >= 0 && (
            <p className="text-destructive-foreground">
              Your fix doesn&apos;t work. The right fix is <code className="whitespace-pre rounded bg-muted px-1 font-mono text-success-foreground">{fixes[correctFix]?.trim()}</code>.
            </p>
          )}
        </div>
      )}
      {!locked && line !== null && onRight && (
        <button
          type="button"
          disabled={fix === null}
          onClick={() => onSubmit([line!, FIX_BASE + fix!, ...(missed.length ? [MISSED_LINE] : [])])}
          className="mt-5 inline-flex min-h-11 items-center rounded-control bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
        >
          {fix === null ? "Pick a fix above, then Check" : "Check"}
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
      <div className="text-sm font-medium text-muted-foreground">Or choose</div>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {opts.map((o) => (
          <li key={o} className="min-w-0">
            <button type="button" onClick={() => onSubmit(encodeText(o))} className="flex min-h-11 w-full min-w-0 items-center overflow-x-auto rounded-control border border-border bg-card px-3 py-2 text-left font-mono text-sm text-foreground transition-colors hover:border-primary/60 hover:bg-primary/10">
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
      <ol className="mt-1 grid list-decimal gap-1 pl-6 text-base text-muted-foreground">
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
          <code key={i} className="rounded bg-muted px-1 font-mono text-[0.9em] text-foreground">{part.slice(1, -1)}</code>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
