"use client";

import { useState } from "react";
import { BlockIcon } from "@/components/learn/block-icons";

/** Concept diagrams for the TypeScript track. */

const TYPES = ["never", '"hi"', "string", "unknown", "any"] as const;
type T = (typeof TYPES)[number];

/** assign[source][target]: can a value of type `source` be assigned to `target`? */
const ASSIGN: Record<T, Record<T, boolean>> = {
  never: { never: true, '"hi"': true, string: true, unknown: true, any: true },
  '"hi"': { never: false, '"hi"': true, string: true, unknown: true, any: true },
  string: { never: false, '"hi"': false, string: true, unknown: true, any: true },
  unknown: { never: false, '"hi"': false, string: false, unknown: true, any: true },
  any: { never: false, '"hi"': true, string: true, unknown: true, any: true },
};

function why(s: T, t: T): string {
  if (s === t) return "Every type is assignable to itself.";
  if (s === "never") return "never is the bottom type: it's assignable to everything (there's no value to object to).";
  if (t === "never") return s === "any" ? "any is assignable to everything except never." : "Nothing but never is assignable to never.";
  if (t === "unknown") return "unknown is the top type: everything can go in.";
  if (t === "any") return "Anything can be assigned to any.";
  if (s === "any") return "any switches checking off, so it's assignable to any other type. That's what makes it dangerous.";
  if (s === "unknown") return "unknown can only flow into unknown or any. Narrow it first.";
  if (s === '"hi"' && t === "string") return "A literal type is a subtype of its primitive: every \"hi\" is a string.";
  return "string is wider than the literal \"hi\": not every string is \"hi\".";
}

/** Tap a cell: can the row type be assigned to the column type? */
export function AssignabilityGrid() {
  const [cell, setCell] = useState<[T, T]>(["unknown", "string"]);
  const [s, t] = cell;
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="mx-auto border-separate border-spacing-1 text-center font-mono text-xs">
          <thead>
            <tr>
              <th className="px-2 text-[10px] font-normal text-muted-foreground">source ↓ / target →</th>
              {TYPES.map((x) => (
                <th key={x} className="px-2 py-1 text-sky-200">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TYPES.map((row) => (
              <tr key={row}>
                <th className="px-2 text-right text-sky-200">{row}</th>
                {TYPES.map((col) => {
                  const ok = ASSIGN[row][col];
                  const active = row === s && col === t;
                  return (
                    <td key={col}>
                      <button
                        type="button"
                        onClick={() => setCell([row, col])}
                        aria-label={`${row} to ${col}`}
                        className={`h-9 w-12 rounded-lg border text-base ${ok ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/10 text-rose-300"} ${active ? "border-white" : "border-white/10"}`}
                      >
                        {ok ? <BlockIcon icon="✓" className="inline-block size-[1.1em] align-[-0.15em]" /> : <BlockIcon icon="✗" className="inline-block size-[1.1em] align-[-0.15em]" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm">
        <div className="font-mono text-slate-100">
          const x: {t} = value as {s}; <span className={ASSIGN[s][t] ? "text-emerald-300" : "text-rose-300"}>{ASSIGN[s][t] ? "// ok" : "// error"}</span>
        </div>
        <p className="mt-1 text-slate-300">{why(s, t)}</p>
      </div>
    </div>
  );
}
