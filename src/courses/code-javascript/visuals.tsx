"use client";

import { useState } from "react";

/** Concept diagrams for the JavaScript track. */

const PAIRS: { a: string; b: string; loose: boolean; strict: boolean; steps: string }[] = [
  { a: "1", b: '"1"', loose: true, strict: false, steps: 'String "1" → number 1, then 1 === 1.' },
  { a: "0", b: '""', loose: true, strict: false, steps: '"" → number 0, then 0 === 0.' },
  { a: "null", b: "undefined", loose: true, strict: false, steps: "Special rule: null and undefined are loosely equal to each other and nothing else." },
  { a: "null", b: "0", loose: false, strict: false, steps: "null is only == to null or undefined. No numeric conversion here." },
  { a: "[]", b: "false", loose: true, strict: false, steps: 'false → 0; [] → "" → 0; then 0 === 0.' },
  { a: "[1, 2]", b: '"1,2"', loose: true, strict: false, steps: '[1, 2] → ToPrimitive → "1,2", then string comparison.' },
  { a: "NaN", b: "NaN", loose: false, strict: false, steps: "NaN is never equal to anything, itself included. Use Number.isNaN or Object.is." },
  { a: "{}", b: "{}", loose: false, strict: false, steps: "Two different objects: both operators compare references, not contents." },
];

/** Tap a pair to see how `==` coerces it, compared with `===`. */
export function EqualityExplorer() {
  const [sel, setSel] = useState(0);
  const p = PAIRS[sel];
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_1.1fr]">
      <div className="grid grid-cols-2 gap-2">
        {PAIRS.map((x, i) => (
          <button
            key={`${x.a}-${x.b}`}
            type="button"
            onClick={() => setSel(i)}
            className={`rounded-xl border px-2 py-2 font-mono text-sm ${i === sel ? "border-yellow-300 bg-yellow-300/15 text-yellow-100" : "border-white/10 bg-slate-950/60 text-slate-200"}`}
          >
            {x.a} <span className="text-slate-500">vs</span> {x.b}
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { op: "==", v: p.loose },
            { op: "===", v: p.strict },
          ].map((r) => (
            <div key={r.op} className="rounded-lg bg-black/40 p-3 text-center">
              <div className="font-mono text-sm text-slate-300">
                {p.a} {r.op} {p.b}
              </div>
              <div className={`mt-1 text-2xl font-black ${r.v ? "text-emerald-300" : "text-rose-300"}`}>{String(r.v)}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-300">{p.steps}</p>
      </div>
    </div>
  );
}

const CHAIN = [
  { name: "rex", props: ["name"], color: "#fb923c" },
  { name: "Dog.prototype", props: ["speak", "constructor"], color: "#facc15" },
  { name: "Object.prototype", props: ["toString", "hasOwnProperty", "valueOf"], color: "#a3e635" },
];
const LOOKUPS = ["name", "speak", "toString", "fly"];

/** Pick a property and watch the lookup walk up the prototype chain. */
export function PrototypeChain() {
  const [prop, setProp] = useState("speak");
  const found = CHAIN.findIndex((c) => c.props.includes(prop));
  const last = found === -1 ? CHAIN.length : found;
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-300">
        Look up <span className="font-mono">rex.</span>
        {LOOKUPS.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setProp(l)}
            className={`rounded-lg border px-2 py-1 font-mono ${l === prop ? "border-orange-400 bg-orange-400/20 text-orange-100" : "border-white/10 text-slate-300"}`}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        {CHAIN.map((c, i) => (
          <div key={c.name} className="flex flex-col gap-2 sm:flex-1 sm:flex-row sm:items-center">
            <div
              className="flex-1 rounded-xl border p-3 transition"
              style={{
                borderColor: i === found ? c.color : i < last ? `${c.color}88` : "rgb(255 255 255 / 0.1)",
                background: i === found ? `${c.color}22` : "rgb(2 6 23 / 0.6)",
                opacity: i <= last ? 1 : 0.4,
              }}
            >
              <div className="font-mono text-sm font-bold" style={{ color: c.color }}>
                {c.name}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {c.props.map((p) => (
                  <span key={p} className={`rounded px-1.5 py-0.5 font-mono text-xs ${p === prop ? "bg-white text-slate-950" : "bg-white/10 text-slate-200"}`}>
                    {p}
                  </span>
                ))}
              </div>
              {i < last && <div className="mt-1 text-[11px] text-slate-500">not here → follow [[Prototype]]</div>}
            </div>
            <span className="text-center text-slate-500" aria-hidden>
              <span className="sm:hidden">↓</span>
              <span className="hidden sm:inline">→</span>
            </span>
          </div>
        ))}
        <div className={`rounded-xl border px-3 py-3 text-center font-mono text-sm ${found === -1 ? "border-rose-400 bg-rose-400/15 text-rose-200" : "border-white/10 text-slate-500"}`}>null</div>
      </div>
      <p className="mt-3 text-sm text-slate-300">
        {found === -1
          ? `rex.${prop} reaches null without finding it, so the result is undefined (calling it would throw a TypeError).`
          : found === 0
            ? `rex.${prop} is an own property: found immediately.`
            : `rex.${prop} is inherited from ${CHAIN[found].name}, ${found} step${found > 1 ? "s" : ""} up the chain.`}
      </p>
    </div>
  );
}
