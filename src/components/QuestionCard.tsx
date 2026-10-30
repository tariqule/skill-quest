"use client";

import { useEffect, useState } from "react";
import { useCourse } from "@/engine/course-context";
import { decodeText, encodeText, normalizeOutput, type PreparedQuestion } from "@/engine/game";
import { setGuideOpen } from "@/engine/ui-state";
import { CodeBlock, RichText, Tokens } from "./learn/code";

const LETTERS = ["A", "B", "C", "D", "E", "F", "G"];

const KIND_LABEL = {
  choice: "🔘 Multiple choice",
  multi: "☑️ Multiple response",
  order: "🔢 Ordering",
  match: "🔗 Matching",
  lines: "🐞 Bug hunt",
  fill: "🧩 Fill in the blanks",
  output: "⌨️ Type the output",
};

interface Props {
  q: PreparedQuestion;
  /** Submitted answer, or null while the player is still choosing. */
  submitted: number[] | null;
  onSubmit: (picked: number[]) => void;
  /** Show correct/incorrect colouring and the explanation once submitted. */
  reveal?: boolean;
  showDomain?: boolean;
  explain?: boolean;
}

export function QuestionCard({ q, submitted, onSubmit, reveal = true, showDomain = false, explain = true }: Props) {
  const { domain: domainById, lessonForQuestion } = useCourse();
  const domain = domainById[q.domain];
  const concept = lessonForQuestion[q.id];
  const [showConcept, setShowConcept] = useState(false);
  const locked = submitted !== null;
  const label = q.kind === "choice" ? (q.correct.length > 1 ? KIND_LABEL.multi : KIND_LABEL.choice) : KIND_LABEL[q.kind];

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:p-7 shadow-xl">
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-wider">
        <span className="text-slate-400">{label}</span>
        {showDomain && (
          <span style={{ color: domain.color }}>
            {domain.emoji} Domain {domain.number}: {domain.name}
          </span>
        )}
      </div>
      <h2 className="text-lg sm:text-xl font-semibold leading-snug text-white">
        <RichText text={q.prompt} />
      </h2>
      {q.code && q.kind !== "lines" && q.kind !== "fill" && (

        <div className="mt-4">
          <CodeBlock code={q.code} lang={q.codeLang} />
        </div>
      )}

      {q.kind === "choice" && <ChoiceBody q={q} submitted={submitted} onSubmit={onSubmit} reveal={reveal} />}
      {q.kind === "order" && <OrderBody q={q} submitted={submitted} onSubmit={onSubmit} reveal={reveal} />}
      {q.kind === "match" && <MatchBody q={q} submitted={submitted} onSubmit={onSubmit} reveal={reveal} />}
      {q.kind === "lines" && <LinesBody q={q} submitted={submitted} onSubmit={onSubmit} reveal={reveal} />}
      {q.kind === "fill" && <FillBody q={q} submitted={submitted} onSubmit={onSubmit} reveal={reveal} />}
      {q.kind === "output" && <OutputBody q={q} submitted={submitted} onSubmit={onSubmit} reveal={reveal} />}

      {locked && reveal && explain && (
        <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/60 p-4 text-base leading-relaxed text-slate-300">
          <span className="font-semibold text-white">Why: </span>
          <RichText text={q.explanation} />
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {concept && (
              <button type="button" onClick={() => setShowConcept(!showConcept)} className="text-xs font-semibold text-sky-300 hover:underline">
                📖 {showConcept ? "Hide" : "Revisit"} the concept: {concept.title}
              </button>
            )}
            <button type="button" onClick={() => setGuideOpen(true)} className="text-xs font-semibold text-slate-400 hover:underline">
              🔎 Open the guide
            </button>
          </div>
          {concept && showConcept && (
            <div className="pop-in mt-3 rounded-xl border border-white/10 bg-slate-900/80 p-3 sm:p-4">
              {concept.visual}
              <ul className="mt-3 grid gap-1 text-base text-slate-300">
                {concept.points.map((p) => (
                  <li key={p}>• <RichText text={p} /></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type BodyProps = Required<Pick<Props, "q" | "submitted" | "onSubmit" | "reveal">>;

function ChoiceBody({ q, submitted, onSubmit, reveal }: BodyProps) {
  const multi = q.correct.length > 1;
  const [pending, setPending] = useState<number[]>([]);
  const locked = submitted !== null;

  function choose(i: number) {
    if (locked) return;
    if (!multi) return onSubmit([i]);
    setPending((p) => {
      if (p.includes(i)) return p.filter((x) => x !== i);
      return p.length < q.correct.length ? [...p, i] : p;
    });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (locked || e.metaKey || e.ctrlKey || isTyping(e)) return;
      const k = e.key.toUpperCase();
      const idx = /^[1-7]$/.test(k) ? Number(k) - 1 : LETTERS.indexOf(k);
      if (idx >= 0 && idx < q.shuffled.length) {
        e.preventDefault();
        choose(idx);
      } else if (e.key === "Enter" && multi && pending.length === q.correct.length) {
        e.preventDefault();
        onSubmit(pending);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <>
      {multi && !locked && <p className="mt-2 text-sm text-amber-300">Choose {q.correct.length}. Then press Submit (or Enter).</p>}
      <ul className="mt-5 grid gap-3">
        {q.shuffled.map((opt, i) => {
          const isPicked = (submitted ?? pending).includes(i);
          const isRight = q.correct.includes(i);
          let tone = "border-white/10 bg-white/5 hover:border-sky-400/60 hover:bg-sky-400/10";
          if (locked && reveal) {
            if (isRight) tone = "border-emerald-400 bg-emerald-400/15";
            else if (isPicked) tone = "border-rose-400 bg-rose-400/15";
            else tone = "border-white/5 bg-white/[0.02] opacity-60";
          } else if (locked) {
            tone = isPicked ? "border-sky-400 bg-sky-400/15" : "border-white/5 bg-white/[0.02] opacity-60";
          } else if (isPicked) {
            tone = "border-sky-400 bg-sky-400/15";
          }
          return (
            <li key={i}>
              <button
                type="button"
                disabled={locked}
                onClick={() => choose(i)}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${tone} disabled:cursor-default`}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-xs font-bold text-slate-200">
                  {LETTERS[i]}
                </span>
                <span className="text-slate-100">
                  <RichText text={opt} />
                </span>
                {locked && reveal && isRight && <span className="ml-auto text-emerald-300">✓</span>}
                {locked && reveal && isPicked && !isRight && <span className="ml-auto text-rose-300">✗</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {multi && !locked && (
        <SubmitButton disabled={pending.length !== q.correct.length} onClick={() => onSubmit(pending)} />
      )}
    </>
  );
}

function OrderBody({ q, submitted, onSubmit, reveal }: BodyProps) {
  const [placed, setPlaced] = useState<number[]>([]);
  const locked = submitted !== null;
  const sequence = submitted ?? placed;
  const remaining = q.shuffled.map((_, i) => i).filter((i) => !sequence.includes(i));

  return (
    <>
      {!locked && <p className="mt-2 text-sm text-amber-300">Tap the steps in order, first to last. Tap a placed step to undo it.</p>}
      <ol className="mt-5 grid gap-2">
        {q.shuffled.map((_, slot) => {
          const item = sequence[slot];
          const filled = item !== undefined;
          const right = filled && item === q.correct[slot];
          let tone = "border-dashed border-white/15 bg-white/[0.02] text-slate-400";
          if (filled) tone = "border-sky-400/60 bg-sky-400/10 text-slate-100";
          if (locked && reveal) tone = right ? "border-emerald-400 bg-emerald-400/15 text-slate-100" : "border-rose-400 bg-rose-400/15 text-slate-100";
          return (
            <li key={slot}>
              <button
                type="button"
                disabled={locked || !filled}
                onClick={() => setPlaced((p) => p.filter((x) => x !== item))}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${tone}`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">{slot + 1}</span>
                <span className={q.code !== undefined || /[;{}()=]/.test(q.shuffled[0] ?? "") ? "font-mono text-sm" : ""}>
                  {filled ? <RichText text={q.shuffled[item]} /> : "Empty step"}
                </span>
                {locked && reveal && <span className="ml-auto">{right ? "✓" : "✗"}</span>}
              </button>
              {locked && reveal && !right && (
                <div className="mt-1 pl-14 text-xs text-emerald-300">Correct: {q.shuffled[q.correct[slot]]}</div>
              )}
            </li>
          );
        })}
      </ol>
      {!locked && remaining.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {remaining.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPlaced((p) => [...p, i])}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-base text-slate-100 transition hover:border-sky-400/60 hover:bg-sky-400/10"
            >
              ＋ {q.shuffled[i]}
            </button>
          ))}
        </div>
      )}
      {!locked && <SubmitButton disabled={remaining.length > 0} onClick={() => onSubmit(placed)} />}
    </>
  );
}

function MatchBody({ q, submitted, onSubmit, reveal }: BodyProps) {
  const [choice, setChoice] = useState<(number | null)[]>(() => q.prompts.map(() => null));
  const locked = submitted !== null;
  const values = submitted ?? choice;
  const complete = choice.every((c) => c !== null);

  return (
    <>
      {!locked && <p className="mt-2 text-sm text-amber-300">Pick the matching answer for every row.</p>}
      <div className="mt-5 grid gap-3">
        {q.prompts.map((prompt, i) => {
          const v = values[i];
          const right = v === q.correct[i];
          const tone = locked && reveal ? (right ? "border-emerald-400 bg-emerald-400/10" : "border-rose-400 bg-rose-400/10") : "border-white/10 bg-white/5";
          return (
            <div key={i} className={`grid gap-2 rounded-xl border p-3 sm:grid-cols-[1fr_1.3fr] sm:items-center ${tone}`}>
              <div className="font-semibold text-white">
                <RichText text={prompt} />
              </div>
              <select
                aria-label={`Match for ${prompt}`}
                disabled={locked}
                value={v ?? ""}
                onChange={(e) => {
                  const n = [...choice];
                  n[i] = e.target.value === "" ? null : Number(e.target.value);
                  setChoice(n);
                }}
                className="w-full rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-base text-slate-100 disabled:opacity-90"
              >
                <option value="">Choose…</option>
                {q.shuffled.map((r, j) => (
                  <option key={j} value={j}>
                    {r}
                  </option>
                ))}
              </select>
              {locked && reveal && !right && <div className="text-xs text-emerald-300 sm:col-span-2">Correct: {q.shuffled[q.correct[i]]}</div>}
            </div>
          );
        })}
      </div>
      {!locked && <SubmitButton disabled={!complete} onClick={() => onSubmit(choice as number[])} />}
    </>
  );
}

function LinesBody({ q, submitted, onSubmit, reveal }: BodyProps) {
  const need = q.correct.length;
  const [picked, setPicked] = useState<number[]>([]);
  const locked = submitted !== null;
  const chosen = submitted ?? picked;

  function toggle(i: number) {
    if (locked) return;
    if (need === 1) return setPicked([i]);
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : p.length < need ? [...p, i] : p));
  }

  return (
    <>
      {!locked && (
        <p className="mt-2 text-sm text-amber-300">
          Tap {need === 1 ? "the line" : `${need} lines`}, then Submit.
        </p>
      )}
      <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-slate-950">
        {q.codeLang && <div className="border-b border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{q.codeLang}</div>}
        <div className="overflow-x-auto py-1">
          {q.shuffled.map((line, i) => {
            const isPicked = chosen.includes(i);
            const isRight = q.correct.includes(i);
            let tone = "hover:bg-sky-400/10";
            if (locked && reveal) tone = isRight ? "bg-emerald-400/20" : isPicked ? "bg-rose-400/20" : "opacity-60";
            else if (isPicked) tone = "bg-sky-400/20";
            return (
              <button
                key={i}
                type="button"
                disabled={locked}
                onClick={() => toggle(i)}
                className={`flex w-full min-w-max items-start gap-3 px-3 py-0.5 text-left font-mono text-[13px] leading-relaxed transition ${tone}`}
              >
                <span className="w-6 shrink-0 select-none text-right text-slate-400">{i + 1}</span>
                <span className="whitespace-pre text-slate-100">{line || " "}</span>
                {locked && reveal && isRight && <span className="ml-auto pl-3 text-emerald-300">✓</span>}
                {locked && reveal && isPicked && !isRight && <span className="ml-auto pl-3 text-rose-300">✗</span>}
              </button>
            );
          })}
        </div>
      </div>
      {!locked && <SubmitButton disabled={picked.length !== need} onClick={() => onSubmit([...picked].sort((a, b) => a - b))} />}
    </>
  );
}

function FillBody({ q, submitted, onSubmit, reveal }: BodyProps) {
  const groups = q.groups ?? [];
  const [choice, setChoice] = useState<(number | null)[]>(() => groups.map(() => null));
  const locked = submitted !== null;
  const chosen: (number | null)[] = submitted ?? choice;
  const complete = choice.every((c) => c !== null);
  // Split "a {{1}} b {{2}} c" into text, blank index, text, blank index, text.
  const parts = (q.code ?? "").replace(/^\n+|\s+$/g, "").split(/\{\{(\d+)\}\}/);

  return (
    <>
      {!locked && <p className="mt-2 text-sm text-amber-300">Pick the right piece for each blank, then Submit.</p>}
      <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-slate-950">
        {q.codeLang && <div className="border-b border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{q.codeLang}</div>}
        <pre className="overflow-x-auto p-3 font-mono text-[13px] leading-8 text-slate-100">
          {parts.map((part, i) => {
            if (i % 2 === 0) return <Tokens key={i} code={part} lang={q.codeLang} />;
            const k = Number(part) - 1;
            const value = chosen[k];
            const right = value === q.correct[k];
            let tone = "border-sky-400/60 bg-sky-400/10 text-sky-100";
            if (locked && reveal) tone = right ? "border-emerald-400 bg-emerald-400/20 text-emerald-100" : "border-rose-400 bg-rose-400/20 text-rose-100";
            return (
              <select
                key={i}
                aria-label={`Blank ${part}`}
                disabled={locked}
                value={value ?? ""}
                onChange={(e) => setChoice((c) => c.map((x, j) => (j === k ? Number(e.target.value) : x)))}
                className={`mx-0.5 inline-block max-w-[16rem] rounded-md border px-1.5 py-0.5 font-mono text-[13px] ${tone}`}
              >
                <option value="" disabled>
                  {`  ${part}  `}
                </option>
                {(groups[k] ?? []).map((flat) => (
                  <option key={flat} value={flat}>
                    {q.shuffled[flat]}
                  </option>
                ))}
              </select>
            );
          })}
        </pre>
      </div>
      {locked && reveal && (
        <ul className="mt-3 grid gap-1 text-base">
          {q.correct.map((flat, k) =>
            chosen[k] === flat ? null : (
              <li key={k} className="text-emerald-300">
                Blank {k + 1}: <code className="rounded bg-white/10 px-1 font-mono">{q.shuffled[flat]}</code>
              </li>
            ),
          )}
        </ul>
      )}
      {!locked && <SubmitButton disabled={!complete} onClick={() => onSubmit(choice as number[])} />}
    </>
  );
}

function OutputBody({ q, submitted, onSubmit, reveal }: BodyProps) {
  const [text, setText] = useState("");
  const locked = submitted !== null;
  const typed = locked ? decodeText(submitted) : text;
  const multiline = q.shuffled.some((a) => a.includes("\n"));
  const right = locked && q.shuffled.some((a) => normalizeOutput(a) === normalizeOutput(typed));
  const ready = text.trim() !== "";
  const tone = locked && reveal ? (right ? "border-emerald-400 bg-emerald-400/10" : "border-rose-400 bg-rose-400/10") : "border-white/15 bg-slate-950 focus:border-sky-400";

  return (
    <>
      {!locked && (
        <p className="mt-2 text-sm text-amber-300">
          {multiline ? "Type the output, one line per line. Press Submit when you're done." : "Type exactly what it prints or returns, then press Enter."}
        </p>
      )}
      {multiline ? (
        <textarea
          autoFocus
          disabled={locked}
          value={typed}
          onChange={(e) => setText(e.target.value)}
          rows={Math.max(3, Math.min(8, Math.max(...q.shuffled.map((a) => a.split("\n").length)) + 1))}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Your output"
          className={`mt-3 w-full rounded-xl border p-3 font-mono text-base text-white outline-none transition ${tone}`}
        />
      ) : (
        <input
          autoFocus
          disabled={locked}
          value={typed}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && ready) onSubmit(encodeText(text));
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Your output"
          placeholder="Type the output…"
          className={`mt-3 w-full rounded-xl border px-3 py-2.5 font-mono text-base text-white outline-none transition ${tone}`}
        />
      )}
      {locked && reveal && !right && (
        <p className="mt-2 text-sm text-emerald-300">
          Expected: <code className="whitespace-pre-wrap rounded bg-white/10 px-1.5 py-0.5 font-mono">{q.shuffled[0]}</code>
        </p>
      )}
      {!locked && <SubmitButton disabled={!ready} onClick={() => onSubmit(encodeText(text))} />}
    </>
  );
}

function SubmitButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="mt-5 rounded-xl bg-sky-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-40"
    >
      Submit
    </button>
  );
}

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  return !!t && (t.tagName === "INPUT" || t.tagName === "SELECT" || t.tagName === "TEXTAREA");
}
