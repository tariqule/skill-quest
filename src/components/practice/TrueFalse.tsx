"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { isTyping } from "../keyboard";

/** Display order of a true/false question's options; the engine never shuffles them. */
const CHOICES = [
  { label: "True", key: "T", icon: "✓" },
  { label: "False", key: "F", icon: "✗" },
] as const;

interface Props {
  /** Index of the right answer: 0 for True, 1 for False. */
  correct: number;
  /** Submitted pick, or null while choosing. */
  submitted: number[] | null;
  onSubmit: (picked: number[]) => void;
  /** Colour right and wrong once submitted. */
  reveal: boolean;
}

/** Keys that move focus inside the group, and where each sends it. */
function moveTo(key: string, from: number): number | null {
  switch (key) {
    case "ArrowLeft":
    case "ArrowUp":
    case "ArrowRight":
    case "ArrowDown":
      return 1 - from;
    case "Home":
      return 0;
    case "End":
      return 1;
    default:
      return null;
  }
}

/** Focus ring: 2px sky-300 outline, offset from the button, about 11:1 against the slate-950 page (WCAG 1.4.11 asks 3:1). */
const FOCUS_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300";

/**
 * Two big buttons for a true/false statement, exposed as a radio group with a roving tabindex:
 * Tab reaches only the active option, arrow keys (and Home, End) move between them, Enter or Space
 * picks. T or 1 picks True and F or 2 picks False from anywhere on the page.
 */
export function TrueFalse({ correct, submitted, onSubmit, reveal }: Props) {
  const locked = submitted !== null;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  // The one option Tab lands on: the pick once there is one, otherwise the last focused.
  const [active, setActive] = useState(0);
  const tabStop = submitted?.[0] ?? active;

  useEffect(() => {
    if (locked) return;
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || isTyping(e)) return;
      const k = e.key.toUpperCase();
      const idx = k === "T" || k === "1" ? 0 : k === "F" || k === "2" ? 1 : -1;
      if (idx < 0) return;
      e.preventDefault();
      onSubmit([idx]);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [locked, onSubmit]);

  function onArrow(e: ReactKeyboardEvent, i: number) {
    const to = moveTo(e.key, i);
    if (to === null) return;
    e.preventDefault();
    setActive(to);
    refs.current[to]?.focus();
  }

  return (
    <div role="radiogroup" aria-label="True or false" className="mt-5 grid grid-cols-2 gap-3">
      {CHOICES.map((c, i) => {
        const picked = submitted?.includes(i) ?? false;
        const right = i === correct;
        let tone = "border-white/10 bg-white/5 hover:border-sky-400/60 hover:bg-sky-400/10";
        if (locked && reveal) tone = right ? "border-emerald-400 bg-emerald-400/15" : picked ? "border-rose-400 bg-rose-400/15" : "border-white/5 bg-white/[0.02] opacity-60";
        else if (locked) tone = picked ? "border-sky-400 bg-sky-400/15" : "border-white/5 bg-white/[0.02] opacity-60";
        return (
          <button
            key={c.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={picked}
            aria-keyshortcuts={c.key}
            tabIndex={i === tabStop ? 0 : -1}
            // aria-disabled, not disabled: a disabled button drops keyboard focus to the page after answering.
            aria-disabled={locked || undefined}
            onFocus={() => setActive(i)}
            onClick={() => !locked && onSubmit([i])}
            onKeyDown={(e) => onArrow(e, i)}
            className={`flex min-h-16 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-lg font-bold text-slate-100 transition ${tone} ${FOCUS_RING} ${locked ? "cursor-default" : ""}`}
          >
            <span aria-hidden="true">{c.icon}</span>
            {c.label}
            <kbd className="ml-1 rounded bg-white/10 px-1.5 text-xs font-semibold text-slate-300">{c.key}</kbd>
          </button>
        );
      })}
    </div>
  );
}
