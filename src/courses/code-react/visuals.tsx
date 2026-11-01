"use client";

import { useState } from "react";
import { BlockIcon } from "@/components/learn/block-icons";

const START = [
  { id: "a1", name: "Apple" },
  { id: "b2", name: "Banana" },
];
const EXTRA = [
  { id: "c3", name: "Cherry" },
  { id: "d4", name: "Date" },
  { id: "e5", name: "Elderberry" },
];

/**
 * Keys and reconciliation: each row has local state (a typed note). With
 * `key={index}` React matches rows by position, so notes stick to the slot,
 * not the fruit, when you add to the top.
 */
export function KeysVisual() {
  const [strategy, setStrategy] = useState<"index" | "id">("index");
  const [items, setItems] = useState(START);

  // Local state lives with the *key*: seed each original key with a note about its original fruit.
  const notes: Record<string, string> = {};
  START.forEach((it, i) => {
    notes[strategy === "index" ? String(i) : it.id] = `note about ${it.name}`;
  });

  const added = items.length - START.length;
  function addTop() {
    if (added < EXTRA.length) setItems([EXTRA[added], ...items]);
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {(["index", "id"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setStrategy(s);
              setItems(START);
            }}
            className={`rounded-lg px-3 py-1.5 font-mono text-sm font-semibold transition ${strategy === s ? "bg-sky-400 text-slate-950" : "bg-white/10 text-slate-200 hover:bg-white/20"}`}
          >
            key={s === "index" ? "{index}" : "{item.id}"}
          </button>
        ))}
        <button
          type="button"
          onClick={addTop}
          disabled={added >= EXTRA.length}
          className="rounded-lg bg-emerald-400/90 px-3 py-1.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 disabled:opacity-40"
        >
          + Add fruit at the top
        </button>
        <button type="button" onClick={() => setItems(START)} className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/15">
          ↺ Reset
        </button>
      </div>
      <div className="grid gap-1.5">
        {items.map((it, i) => {
          const key = strategy === "index" ? String(i) : it.id;
          const note = notes[key];
          const wrong = note !== undefined && note !== `note about ${it.name}`;
          return (
            <div
              key={`${strategy}-${it.id}`}
              className={`grid grid-cols-[4.5rem_6rem_1fr] items-center gap-2 rounded-xl border px-3 py-2 text-sm ${wrong ? "border-rose-400/60 bg-rose-500/10" : "border-white/10 bg-slate-950/60"}`}
            >
              <span className="font-mono text-xs text-slate-400">key={key}</span>
              <span className="font-semibold text-white">{it.name}</span>
              <span className={`truncate rounded-md px-2 py-1 font-mono text-xs ${note ? (wrong ? "bg-rose-400/20 text-rose-200" : "bg-emerald-400/15 text-emerald-200") : "bg-white/5 text-muted-foreground"}`}>
                {note ?? "(new, empty state)"}
                {wrong && <> <BlockIcon icon="✖" className="inline-block size-[1.1em] align-[-0.15em]" /></>}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-400">
        Each row keeps local state (the note). React hands state to whichever row has the same key as before. With index keys, slot 0 keeps &quot;note about Apple&quot; even when slot 0 is now a different fruit.
      </p>
    </div>
  );
}
