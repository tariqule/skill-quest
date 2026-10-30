"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { RichText } from "@/components/learn/code";
import {
  chainShare,
  interviewShare,
  INTERVIEW_PASS,
  matcherRight,
  scoreArch,
  shuffled,
  STAR_PRIMER,
  type ArchItem,
  type ChainChoice,
  type ChainItem,
  type InterviewItem,
  type MatcherItem,
  type ScenarioItem,
} from "@/engine/scenarios";
import type { LessonSource } from "@/engine/types";

/** Plays one scenario item. `onDone(share)` fires once the player has seen the feedback, with a 0-1 score. */
export function ScenarioPlay({ courseId, item, onDone, doneLabel = "Next" }: { courseId: string; item: ScenarioItem; onDone: (share: number) => void; doneLabel?: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 sm:p-7">
      <h2 className="text-xl font-black text-white">{item.title}</h2>
      {item.type === "architect" && <Architect item={item} onDone={onDone} doneLabel={doneLabel} />}
      {item.type === "chain" && <Chain item={item} onDone={onDone} doneLabel={doneLabel} />}
      {item.type === "matcher" && <Matcher item={item} onDone={onDone} doneLabel={doneLabel} />}
      {item.type === "interview" && <Interview item={item} onDone={onDone} doneLabel={doneLabel} />}
      <Footer courseId={courseId} lesson={item.lesson} sources={item.sources} />
    </div>
  );
}

type Props<T> = { item: T; onDone: (share: number) => void; doneLabel: string };

const btn = "min-h-11 rounded-xl border px-3 py-2 text-left text-base transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300";
const primary = "min-h-11 rounded-2xl bg-sky-400 px-5 py-2.5 text-base font-black text-slate-950 hover:bg-sky-300 disabled:opacity-50";

function Footer({ courseId, lesson, sources }: { courseId: string; lesson?: string; sources?: LessonSource[] }) {
  if (!lesson && !sources?.length) return null;
  return (
    <div className="mt-5 border-t border-white/10 pt-3 text-sm text-slate-300">
      {lesson && (
        <Link href={`/c/${courseId}/lesson/${lesson}`} className="font-bold text-sky-300 underline-offset-2 hover:underline">
          📘 Review the lesson first
        </Link>
      )}
      {!!sources?.length && (
        <p className="mt-1">
          Sources:{" "}
          {sources.map((s, i) => (
            <span key={s.url}>
              {i > 0 && " · "}
              <a href={s.url} target="_blank" rel="noreferrer" className="text-sky-300 underline">
                {s.title}
              </a>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

function Done({ share, onDone, label }: { share: number; onDone: (s: number) => void; label: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <span className="text-base font-bold text-white">Score: {Math.round(share * 100)}%</span>
      <button ref={ref} type="button" className={primary} onClick={() => onDone(share)}>
        {label}
      </button>
    </div>
  );
}

// ───────────── Architecture Builder ─────────────

function Architect({ item, onDone, doneLabel }: Props<ArchItem>) {
  const tiles = useMemo(() => shuffled(item.tiles), [item]);
  const [slot, setSlot] = useState(item.slots[0].id);
  const [picks, setPicks] = useState<Record<string, string | undefined>>({});
  const [checked, setChecked] = useState(false);
  const [say, setSay] = useState("");
  const score = checked ? scoreArch(item, picks) : null;
  const label = (id?: string) => item.tiles.find((t) => t.id === id)?.label;
  const used = new Set(Object.values(picks));
  const place = (tileId: string) => {
    const next = { ...picks };
    for (const k of Object.keys(next)) if (next[k] === tileId) delete next[k];
    next[slot] = tileId;
    setPicks(next);
    const s = item.slots.find((x) => x.id === slot)!;
    setSay(`${label(tileId)} placed in ${s.label}.`);
    const empty = item.slots.find((x) => !next[x.id]);
    if (empty) setSlot(empty.id);
  };
  const solutionTiles = new Set(score ? Object.values(score.solution) : []);
  return (
    <>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base text-slate-200">
        {item.requirements.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      <p aria-live="polite" className="sr-only">
        {say}
      </p>
      <h3 className="mt-5 text-sm font-bold uppercase tracking-wider text-slate-400">Your design: choose a slot</h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {item.slots.map((s) => {
          const ok = score?.right.includes(s.id);
          return (
            <button
              key={s.id}
              type="button"
              disabled={checked}
              aria-pressed={slot === s.id}
              onClick={() => setSlot(s.id)}
              className={`${btn} ${checked ? (ok ? "border-emerald-400 bg-emerald-400/10" : "border-rose-400 bg-rose-400/10") : slot === s.id ? "border-sky-300 bg-sky-400/15" : "border-white/15 bg-white/5"}`}
            >
              <span className="block text-sm text-slate-300">{s.label}</span>
              <span className="block font-bold text-white">{label(picks[s.id]) ?? "— empty —"}</span>
              {checked && !ok && <span className="block text-sm text-emerald-300">Better: {label(score!.solution[s.id])}</span>}
            </button>
          );
        })}
      </div>
      <h3 className="mt-5 text-sm font-bold uppercase tracking-wider text-slate-400">Components: pick one for “{item.slots.find((s) => s.id === slot)?.label}”</h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {tiles.map((t) => (
          <button key={t.id} type="button" disabled={checked} aria-pressed={used.has(t.id)} onClick={() => place(t.id)} className={`${btn} ${used.has(t.id) ? "border-sky-300/60 bg-sky-400/10 text-white" : "border-white/15 bg-white/5 text-slate-100"}`}>
            {t.label}
            {checked && <span className={`mt-1 block text-sm ${solutionTiles.has(t.id) ? "text-emerald-300" : "text-slate-300"}`}>{solutionTiles.has(t.id) ? "✓ " : ""}{t.why}</span>}
          </button>
        ))}
      </div>
      {!checked ? (
        <button type="button" className={`${primary} mt-4`} disabled={item.slots.some((s) => !picks[s.id])} onClick={() => setChecked(true)}>
          Check design
        </button>
      ) : (
        <>
          <p aria-live="polite" className="mt-4 text-base text-white">
            {score!.correct ? "✅ Solid design." : `${score!.right.length} of ${score!.total} slots match a good design.`}
          </p>
          <Done share={score!.right.length / score!.total} onDone={onDone} label={doneLabel} />
        </>
      )}
    </>
  );
}

// ───────────── Scenario Chains ─────────────

function Chain({ item, onDone, doneLabel }: Props<ChainItem>) {
  const [at, setAt] = useState<string | null>(item.start);
  const [taken, setTaken] = useState<{ step: string; choice: ChainChoice }[]>([]);
  const [pending, setPending] = useState<ChainChoice | null>(null);
  const step = at ? item.steps[at] : null;
  const order = useMemo(() => Object.fromEntries(Object.entries(item.steps).map(([k, s]) => [k, shuffled(s.choices)])), [item]);
  const headRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => headRef.current?.focus(), [at]);
  return (
    <>
      <p className="mt-2 text-base text-slate-200">{item.intro}</p>
      <ol className="mt-3 space-y-2">
        {taken.map((t, i) => (
          <li key={i} className={`rounded-xl border p-3 text-sm ${t.choice.best ? "border-emerald-400/50" : "border-amber-300/50"}`}>
            <span className="block text-slate-300">{item.steps[t.step].situation}</span>
            <span className="block font-bold text-white">
              {t.choice.best ? "✓" : "↪"} {t.choice.text}
            </span>
            <span className="block text-slate-300">{t.choice.why}</span>
          </li>
        ))}
      </ol>
      {step && (
        <div className="mt-4">
          <p ref={headRef} tabIndex={-1} className="text-sm font-bold uppercase tracking-wider text-slate-400 outline-none">
            Decision {taken.length + 1}
          </p>
          <p className="mt-1 text-lg text-white">{step.situation}</p>
          <div className="mt-3 grid gap-2" role="group" aria-label="Choices">
            {order[at!].map((c) => (
              <button
                key={c.text}
                type="button"
                disabled={!!pending}
                aria-pressed={pending === c}
                onClick={() => setPending(c)}
                className={`${btn} ${pending === c ? (c.best ? "border-emerald-400 bg-emerald-400/10" : "border-amber-300 bg-amber-300/10") : "border-white/15 bg-white/5"} text-white`}
              >
                {c.text}
              </button>
            ))}
          </div>
          {pending && (
            <div aria-live="polite" className="mt-3">
              <p className={`text-base ${pending.best ? "text-emerald-300" : "text-amber-200"}`}>
                {pending.best ? "✓ Strong choice. " : "↪ That has consequences. "}
                {pending.why}
              </p>
              <button
                type="button"
                className={`${primary} mt-3`}
                onClick={() => {
                  setTaken([...taken, { step: at!, choice: pending }]);
                  setAt(pending.next ?? null);
                  setPending(null);
                }}
              >
                {pending.next ? "Continue" : "See how it went"}
              </button>
            </div>
          )}
        </div>
      )}
      {!step && (
        <>
          <p className="mt-4 text-base text-white" aria-live="polite">
            You made {taken.filter((t) => t.choice.best).length} strong calls out of {taken.length} decisions.
          </p>
          <Done share={chainShare(taken.map((t) => t.choice))} onDone={onDone} label={doneLabel} />
        </>
      )}
    </>
  );
}

// ───────────── Service Matcher ─────────────

function Matcher({ item, onDone, doneLabel }: Props<MatcherItem>) {
  const rights = useMemo(() => shuffled(item.pairs.map((_, i) => i)), [item]);
  const [left, setLeft] = useState<number | null>(0);
  const [picks, setPicks] = useState<Record<number, number | undefined>>({});
  const [checked, setChecked] = useState(false);
  const [say, setSay] = useState("");
  const result = checked ? matcherRight(item, picks) : null;
  const usedBy = (r: number) => Object.entries(picks).find(([, v]) => v === r)?.[0];
  const pick = (r: number) => {
    if (left === null) return;
    const next = { ...picks };
    for (const k of Object.keys(next)) if (next[+k] === r) delete next[+k];
    next[left] = r;
    setPicks(next);
    setSay(`${item.pairs[left][0]} matched with ${item.pairs[r][1]}.`);
    const free = item.pairs.findIndex((_, i) => next[i] === undefined);
    setLeft(free === -1 ? null : free);
  };
  return (
    <>
      <p className="mt-2 text-base text-slate-200">{item.prompt}</p>
      <p aria-live="polite" className="sr-only">
        {say}
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">{item.leftLabel}</h3>
          <div className="mt-2 grid gap-2">
            {item.pairs.map(([l], i) => (
              <button
                key={l}
                type="button"
                disabled={checked}
                aria-pressed={left === i}
                onClick={() => setLeft(i)}
                className={`${btn} ${checked ? (result![i] ? "border-emerald-400 bg-emerald-400/10" : "border-rose-400 bg-rose-400/10") : left === i ? "border-sky-300 bg-sky-400/15" : "border-white/15 bg-white/5"} text-white`}
              >
                <span className="block font-bold">{l}</span>
                <span className="block text-sm text-slate-300">→ {picks[i] !== undefined ? item.pairs[picks[i]!][1] : "choose a match"}</span>
                {checked && !result![i] && <span className="block text-sm text-emerald-300">Answer: {item.pairs[i][1]}</span>}
                {checked && item.notes?.[i] && <span className="block text-sm text-slate-300">{item.notes[i]}</span>}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">{item.rightLabel}</h3>
          <div className="mt-2 grid gap-2">
            {rights.map((r) => (
              <button key={r} type="button" disabled={checked || left === null} aria-pressed={usedBy(r) !== undefined} onClick={() => pick(r)} className={`${btn} ${usedBy(r) !== undefined ? "border-sky-300/60 bg-sky-400/10" : "border-white/15 bg-white/5"} text-slate-100`}>
                {item.pairs[r][1]}
              </button>
            ))}
          </div>
        </div>
      </div>
      {!checked ? (
        <button type="button" className={`${primary} mt-4`} disabled={item.pairs.some((_, i) => picks[i] === undefined)} onClick={() => setChecked(true)}>
          Check matches
        </button>
      ) : (
        <>
          <p aria-live="polite" className="mt-4 text-base text-white">
            {result!.filter(Boolean).length} of {item.pairs.length} matched.
          </p>
          <Done share={result!.filter(Boolean).length / item.pairs.length} onDone={onDone} label={doneLabel} />
        </>
      )}
    </>
  );
}

// ───────────── Mock Interview ─────────────

const MARKS = ["Missing", "Partly", "Clearly"];

function Interview({ item, onDone, doneLabel }: Props<InterviewItem>) {
  const [started, setStarted] = useState(false);
  const [left, setLeft] = useState(item.minutes * 60);
  const [answer, setAnswer] = useState("");
  const [stopped, setRevealed] = useState(false);
  const revealed = stopped || left <= 0;
  const [marks, setMarks] = useState<(number | undefined)[]>(item.rubric.map(() => undefined));
  const [ticks, setTicks] = useState<boolean[]>(item.keyPoints.map(() => false));
  useEffect(() => {
    if (!started || revealed || left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [started, revealed, left]);
  const mm = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  const share = interviewShare(item, marks.map((m) => m ?? 0), ticks.filter(Boolean).length);
  const scored = marks.every((m) => m !== undefined);
  return (
    <>
      <p className="mt-1 text-sm uppercase tracking-wider text-slate-400">
        {item.kind === "system-design" ? "System design" : item.kind === "behavioral" ? "Behavioral" : "Technical"} · {item.minutes} min
      </p>
      <p className="mt-2 text-lg text-white">{item.prompt}</p>
      {item.kind === "behavioral" && (
        <details className="mt-3 rounded-xl border border-white/10 p-3 text-base text-slate-200" open={!started}>
          <summary className="cursor-pointer font-bold text-white">Answer with STAR</summary>
          <ul className="mt-2 space-y-1">
            {STAR_PRIMER.map((l) => (
              <li key={l}>
                <RichText text={l} />
              </li>
            ))}
          </ul>
        </details>
      )}
      {!started ? (
        <button type="button" className={`${primary} mt-4`} onClick={() => setStarted(true)}>
          Start the {item.minutes}-minute timer
        </button>
      ) : (
        <>
          <div className="mt-4 flex items-center justify-between">
            <label htmlFor={`ans-${item.id}`} className="text-sm font-bold text-slate-300">
              Your answer (notes are fine)
            </label>
            <span role="timer" aria-label={`Time left ${mm}`} className={`font-mono text-lg font-black ${left < 30 ? "text-rose-300" : "text-white"}`}>
              {revealed ? "Time's up" : mm}
            </span>
          </div>
          <textarea id={`ans-${item.id}`} value={answer} onChange={(e) => setAnswer(e.target.value)} readOnly={revealed} rows={6} className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950 p-3 text-base text-white" />
          {!revealed && (
            <button type="button" className={`${primary} mt-3`} onClick={() => setRevealed(true)}>
              I&apos;m done, show the rubric
            </button>
          )}
        </>
      )}
      {revealed && (
        <div className="mt-5 space-y-5" aria-live="polite">
          <section>
            <h3 className="text-base font-black text-white">Score yourself</h3>
            {item.rubric.map((r, i) => (
              <fieldset key={r.name} className="mt-3">
                <legend className="text-base font-bold text-white">{r.name}</legend>
                <p className="text-sm text-slate-300">Full marks: {r.good}</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {MARKS.map((m, v) => (
                    <button key={m} type="button" aria-pressed={marks[i] === v} onClick={() => setMarks(marks.map((x, j) => (j === i ? v : x)))} className={`${btn} text-center ${marks[i] === v ? "border-sky-300 bg-sky-400/20 text-white" : "border-white/15 bg-white/5 text-slate-200"}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
          </section>
          <section>
            <h3 className="text-base font-black text-white">Key points you covered</h3>
            <ul className="mt-2 space-y-1">
              {item.keyPoints.map((k, i) => (
                <li key={k}>
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 text-base text-slate-100">
                    <input type="checkbox" className="h-5 w-5" checked={ticks[i]} onChange={() => setTicks(ticks.map((t, j) => (j === i ? !t : t)))} />
                    {k}
                  </label>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-base font-black text-white">Model answer</h3>
            <p className="mt-2 text-base text-slate-200">{item.model}</p>
          </section>
          {scored ? (
            <>
              <p className="text-base text-white">{share >= INTERVIEW_PASS ? "✅ Interview-ready answer." : "Worth another go: it'll come back in Daily Review."}</p>
              <Done share={share} onDone={onDone} label={doneLabel} />
            </>
          ) : (
            <p className="text-sm text-slate-300">Mark every rubric line to finish.</p>
          )}
        </div>
      )}
    </>
  );
}
