"use client";

import { Binary, Bug, Check, CircleDot, Eye, Link2, ListChecks, ListOrdered, Puzzle, Scale, Table2, ToyBrick, X, type LucideIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { AnswerFeedback } from "./feedback/AnswerFeedback";
import { ChoiceOption, optionState } from "./feedback/ChoiceOption";
import { useCourse } from "@/engine/course-context";
import { decodeText, encodeText, isCorrect, normalizeOutput, type PreparedQuestion } from "@/engine/game";
import type { TablePreview } from "@/engine/types";
import { setGuideOpen } from "@/engine/ui-state";
import { BugBody, OutputChoices, ParsonsBody, TraceSteps } from "./code-games/bodies";
import { isTyping } from "./keyboard";
import { CodeBlock, RichText, Tokens } from "./learn/code";
import { TrueFalse } from "./practice/TrueFalse";

const LETTERS = ["A", "B", "C", "D", "E", "F", "G"];

const KIND_LABEL: Record<string, { text: string; icon: LucideIcon }> = {
  choice: { text: "Multiple choice", icon: CircleDot },
  tf: { text: "True or false", icon: Scale },
  multi: { text: "Multiple response", icon: ListChecks },
  order: { text: "Ordering", icon: ListOrdered },
  match: { text: "Matching", icon: Link2 },
  lines: { text: "Bug hunt", icon: Bug },
  fill: { text: "Fill in the blanks", icon: Puzzle },
  output: { text: "Predict the output", icon: Eye },
  parsons: { text: "Parsons puzzle", icon: ToyBrick },
  bug: { text: "Spot the bug", icon: Binary },
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
  /** One line under the verdict, e.g. what happens next ("You'll see it again at the end"). */
  note?: (ok: boolean) => ReactNode;
}

export function QuestionCard({ q, submitted, onSubmit, reveal = true, showDomain = false, explain = true, note }: Props) {
  const { domain: domainById, lessonForQuestion } = useCourse();
  const domain = domainById[q.domain];
  const concept = lessonForQuestion[q.id];
  const [showConcept, setShowConcept] = useState(false);
  const locked = submitted !== null;
  const tf = q.kind === "choice" && "tf" in q && q.tf === true;
  const label = q.kind === "choice" ? (tf ? KIND_LABEL.tf : q.correct.length > 1 ? KIND_LABEL.multi : KIND_LABEL.choice) : KIND_LABEL[q.kind];
  const KindIcon = label.icon;

  return (
    <div className="rounded-card border border-border bg-card p-5 text-card-foreground sm:p-7">
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <KindIcon className="size-4" aria-hidden />
          {label.text}
        </span>
        {showDomain && (
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: domain.color }} aria-hidden />
            Domain {domain.number}: {domain.name}
          </span>
        )}
      </div>
      <h2 data-reading className="text-lg font-semibold leading-snug text-foreground sm:text-xl">
        <RichText text={q.prompt} />
      </h2>
      {"tables" in q && q.tables && q.tables.length > 0 && <TablesPanel tables={q.tables} />}
      {q.code && q.kind !== "lines" && q.kind !== "fill" && q.kind !== "parsons" && q.kind !== "bug" && (
        <div className="mt-4">
          <CodeBlock code={q.code} lang={q.codeLang} />
        </div>
      )}

      {tf && <TrueFalse correct={q.correct[0]} submitted={submitted} onSubmit={onSubmit} reveal={reveal} />}
      {q.kind === "choice" && !tf && <ChoiceBody q={q} submitted={submitted} onSubmit={onSubmit} reveal={reveal} />}
      {q.kind === "order" && <OrderBody q={q} submitted={submitted} onSubmit={onSubmit} reveal={reveal} />}
      {q.kind === "match" && <MatchBody q={q} submitted={submitted} onSubmit={onSubmit} reveal={reveal} />}
      {q.kind === "lines" && <LinesBody q={q} submitted={submitted} onSubmit={onSubmit} reveal={reveal} />}
      {q.kind === "fill" && <FillBody q={q} submitted={submitted} onSubmit={onSubmit} reveal={reveal} />}
      {q.kind === "output" && <OutputBody q={q} submitted={submitted} onSubmit={onSubmit} reveal={reveal} />}
      {q.kind === "parsons" && <ParsonsBody q={q} submitted={submitted} onSubmit={onSubmit} reveal={reveal} />}
      {q.kind === "bug" && <BugBody q={q} submitted={submitted} onSubmit={onSubmit} reveal={reveal} />}

      {locked && reveal && explain && (
        <AnswerFeedback
          ok={isCorrect(q, submitted)}
          note={note?.(isCorrect(q, submitted))}
          concept={concept ? { title: concept.title, open: showConcept, onToggle: () => setShowConcept(!showConcept) } : undefined}
          onOpenGuide={() => setGuideOpen(true)}
          after={
            <>
              {(q.type === "output" || q.type === "bug") && q.trace && q.trace.length > 0 && <TraceSteps steps={q.trace} />}
              {concept && showConcept && (
                <div className="mt-3 rounded-card border border-border bg-background/60 p-3 sm:p-4">
                  {concept.visual}
                  <ul className="mt-3 grid list-disc gap-1 pl-5 text-base text-foreground">
                    {concept.points.map((p) => (
                      <li key={p}>
                        <RichText text={p} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          }
        >
          <RichText text={q.explanation} />
        </AnswerFeedback>
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
      {multi && !locked && <p className="mt-2 text-sm text-muted-foreground">Choose {q.correct.length}, then press Submit (or Enter).</p>}
      <ul className="mt-5 grid gap-3">
        {q.shuffled.map((opt, i) => {
          const isPicked = (submitted ?? pending).includes(i);
          return (
            <li key={i}>
              <ChoiceOption
                letter={LETTERS[i]}
                state={optionState({ picked: isPicked, right: q.correct.includes(i), locked, reveal })}
                disabled={locked}
                pressed={multi ? isPicked : undefined}
                onClick={() => choose(i)}
              >
                <RichText text={opt} />
              </ChoiceOption>
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
      {!locked && <p className="mt-2 text-sm text-muted-foreground">Tap the steps in order, first to last. Tap a placed step to undo it.</p>}
      <ol className="mt-5 grid gap-2">
        {q.shuffled.map((_, slot) => {
          const item = sequence[slot];
          const filled = item !== undefined;
          const right = filled && item === q.correct[slot];
          let tone = "border-dashed border-border bg-transparent text-muted-foreground";
          if (filled) tone = "border-primary/60 bg-primary/10 text-foreground";
          if (locked && reveal) tone = right ? "border-success bg-success/15 text-foreground" : "border-destructive bg-destructive/15 text-foreground";
          return (
            <li key={slot}>
              <button
                type="button"
                disabled={locked || !filled}
                onClick={() => setPlaced((p) => p.filter((x) => x !== item))}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${tone}`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground">{slot + 1}</span>
                <span className={q.code !== undefined || /[;{}()=]/.test(q.shuffled[0] ?? "") ? "font-mono text-sm" : ""}>
                  {filled ? <RichText text={q.shuffled[item]} /> : "Empty step"}
                </span>
                {locked && reveal && (right ? <Check className="ml-auto size-5 shrink-0 text-success-foreground" aria-label="In the right place" /> : <X className="ml-auto size-5 shrink-0 text-destructive-foreground" aria-label="Out of place" />)}
              </button>
              {locked && reveal && !right && (
                <div className="mt-1 pl-14 text-sm text-success-foreground">Correct: {q.shuffled[q.correct[slot]]}</div>
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
              className="rounded-xl border border-border bg-muted px-3 py-2 text-base text-foreground transition hover:border-primary/60 hover:bg-primary/10"
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
      {!locked && <p className="mt-2 text-sm text-muted-foreground">Pick the matching answer for every row.</p>}
      <div className="mt-5 grid gap-3">
        {q.prompts.map((prompt, i) => {
          const v = values[i];
          const right = v === q.correct[i];
          const tone = locked && reveal ? (right ? "border-success bg-success/10" : "border-destructive bg-destructive/10") : "border-border bg-muted";
          return (
            <div key={i} className={`grid gap-2 rounded-xl border p-3 sm:grid-cols-[1fr_1.3fr] sm:items-center ${tone}`}>
              <div className="font-semibold text-foreground">
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
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground disabled:opacity-90"
              >
                <option value="">Choose…</option>
                {q.shuffled.map((r, j) => (
                  <option key={j} value={j}>
                    {r}
                  </option>
                ))}
              </select>
              {locked && reveal && !right && <div className="text-sm text-success-foreground sm:col-span-2">Correct: {q.shuffled[q.correct[i]]}</div>}
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
        <p className="mt-2 text-sm text-muted-foreground">
          Tap {need === 1 ? "the line" : `${need} lines`}, then Submit.
        </p>
      )}
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-background">
        {q.codeLang && <div className="border-b border-border px-3 py-1 text-sm font-bold uppercase tracking-wider text-muted-foreground">{q.codeLang}</div>}
        <div className="overflow-x-auto py-1">
          {q.shuffled.map((line, i) => {
            const isPicked = chosen.includes(i);
            const isRight = q.correct.includes(i);
            let tone = "hover:bg-primary/10";
            if (locked && reveal) tone = isRight ? "bg-success/20" : isPicked ? "bg-destructive/20" : "opacity-60";
            else if (isPicked) tone = "bg-primary/20";
            return (
              <button
                key={i}
                type="button"
                disabled={locked}
                onClick={() => toggle(i)}
                className={`flex w-full min-w-max items-start gap-3 px-3 py-0.5 text-left font-mono text-sm leading-relaxed transition ${tone}`}
              >
                <span className="w-6 shrink-0 select-none text-right text-muted-foreground">{i + 1}</span>
                <span className="whitespace-pre text-foreground">{line || " "}</span>
                {locked && reveal && isRight && <Check className="ml-auto size-4 shrink-0 text-success-foreground" aria-label="Correct line" />}
                {locked && reveal && isPicked && !isRight && <X className="ml-auto size-4 shrink-0 text-destructive-foreground" aria-label="Not this line" />}
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
      {!locked && <p className="mt-2 text-sm text-muted-foreground">Pick the right piece for each blank, then Submit.</p>}
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-background">
        {q.codeLang && <div className="border-b border-border px-3 py-1 text-sm font-bold uppercase tracking-wider text-muted-foreground">{q.codeLang}</div>}
        <pre className="overflow-x-auto p-3 font-mono text-sm leading-8 text-foreground">
          {parts.map((part, i) => {
            if (i % 2 === 0) return <Tokens key={i} code={part} lang={q.codeLang} />;
            const k = Number(part) - 1;
            const value = chosen[k];
            const right = value === q.correct[k];
            let tone = "border-primary/60 bg-primary/10 text-foreground";
            if (locked && reveal) tone = right ? "border-success bg-success/20 text-foreground" : "border-destructive bg-destructive/20 text-foreground";
            return (
              <select
                key={i}
                aria-label={`Blank ${part}`}
                disabled={locked}
                value={value ?? ""}
                onChange={(e) => setChoice((c) => c.map((x, j) => (j === k ? Number(e.target.value) : x)))}
                className={`mx-0.5 inline-block max-w-[16rem] rounded-md border px-1.5 py-0.5 font-mono text-sm ${tone}`}
              >
                <option value="" disabled>
                  {blankPlaceholder(Number(part), groups.length)}
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
              <li key={k} className="text-success-foreground">
                Blank {k + 1}: <code className="rounded bg-muted px-1 font-mono">{q.shuffled[flat]}</code>
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
  const tone = locked && reveal ? (right ? "border-success bg-success/10" : "border-destructive bg-destructive/10") : "border-border bg-background focus:border-primary";

  return (
    <>
      {!locked && (
        <p className="mt-2 text-sm text-muted-foreground">
          {multiline ? "Type the output, one line per line. Press Submit when you're done." : "Type exactly what it prints or returns, then press Enter."}
        </p>
      )}
      {!locked && (
        <p id={`${q.id}-spacing`} className="mt-1 text-sm text-muted-foreground">
          Spacing inside lines matters. Line endings and blank lines at the start or end don&apos;t.
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
          aria-describedby={`${q.id}-spacing`}
          className={`mt-3 w-full rounded-xl border p-3 font-mono text-base text-foreground outline-none transition ${tone}`}
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
          aria-describedby={`${q.id}-spacing`}
          placeholder="Type the output…"
          className={`mt-3 w-full rounded-xl border px-3 py-2.5 font-mono text-base text-foreground outline-none transition ${tone}`}
        />
      )}
      {locked && reveal && !right && (
        <p className="mt-2 text-sm text-success-foreground">
          Expected: <code className="whitespace-pre-wrap rounded bg-muted px-1.5 py-0.5 font-mono">{q.shuffled[0]}</code>
        </p>
      )}
      {!locked && <SubmitButton disabled={!ready} onClick={() => onSubmit(encodeText(text))} />}
      {!locked && <OutputChoices q={q} onSubmit={onSubmit} />}
    </>
  );
}

function SubmitButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
    >
      Submit
    </button>
  );
}

/** Placeholder for a fill-in-the-blank dropdown: "Choose…", or "Blank 2: choose…" when there are several. */
export function blankPlaceholder(n: number, count: number) {
  return count > 1 ? `Blank ${n}: choose…` : "Choose…";
}

/** Compact, collapsible preview of the data a code game runs on (SQL), so prompts don't repeat it. */
function TablesPanel({ tables }: { tables: TablePreview[] }) {
  return (
    <details className="mt-3 rounded-xl border border-border bg-background text-sm open:pb-2">
      <summary className="cursor-pointer select-none px-3 py-2 font-semibold text-primary">
        <Table2 className="mr-1.5 inline size-4 align-[-2px]" aria-hidden />Tables: {tables.map((t) => t.name).join(", ")}
      </summary>
      <div className="flex flex-wrap gap-3 px-3">
        {tables.map((t) => (
          <div key={t.name} className="min-w-0 max-w-full overflow-x-auto">
            <table className="border-collapse font-mono text-sm text-foreground">
              <caption className="pb-1 text-left font-sans text-sm font-bold text-muted-foreground">{t.name}</caption>
              <thead>
                <tr>
                  {t.columns.map((c) => (
                    <th key={c} scope="col" className="border border-border bg-muted px-2 py-0.5 text-left font-semibold text-foreground">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((v, k) => (
                      <td key={k} className={`border border-border px-2 py-0.5 ${v === null ? "italic text-muted-foreground" : ""}`}>{v === null ? "NULL" : String(v)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </details>
  );
}
