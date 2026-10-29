"use client";

import { useState } from "react";

/** Concept diagrams for Learn Git & GitHub. */

// ───────────── Commit → tree → blob object model ─────────────

const OBJECTS = [
  { id: "commit", icon: "🧾", name: "commit 3f9a1c2", color: "#38bdf8", lines: ["tree 8b2e…", "parent a41d…", "author Ada <ada@example.com>", "", "Add login form"], text: "A commit stores a pointer to one tree (the full snapshot), its parent commit(s), the author, the committer, and the message. Its ID is a hash of all of that." },
  { id: "tree", icon: "📁", name: "tree 8b2e…", color: "#a3e635", lines: ["blob 5c1f…  index.html", "blob e07a…  app.js", "tree 91bb…  css/"], text: "A tree is a directory listing: names pointing at blobs (file contents) and other trees (subfolders)." },
  { id: "blob", icon: "📄", name: "blob e07a…", color: "#f472b6", lines: ["console.log(\"hi\");"], text: "A blob is just file contents, with no name. Two identical files anywhere in history share one blob, which is why snapshots are cheap." },
] as const;

export function ObjectModel() {
  const [sel, setSel] = useState(0);
  const o = OBJECTS[sel];
  return (
    <div className="grid gap-3">
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        {OBJECTS.map((ob, i) => (
          <div key={ob.id} className="flex flex-col items-center gap-2 sm:flex-1 sm:flex-row">
            <button
              type="button"
              onClick={() => setSel(i)}
              className="w-full rounded-xl border bg-slate-950/70 p-2 text-left font-mono text-[11px] transition hover:-translate-y-0.5"
              style={{ borderColor: sel === i ? ob.color : "rgb(255 255 255 / 0.1)", boxShadow: sel === i ? `0 0 0 3px ${ob.color}33` : undefined }}
            >
              <div className="mb-1 font-sans text-sm font-bold" style={{ color: ob.color }}>
                {ob.icon} {ob.name}
              </div>
              {ob.lines.map((l, j) => (
                <div key={j} className="min-h-[1em] text-slate-300">
                  {l}
                </div>
              ))}
            </button>
            {i < OBJECTS.length - 1 && <span className="text-slate-500">→</span>}
          </div>
        ))}
      </div>
      <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-300">{o.text}</p>
    </div>
  );
}

// ───────────── reset --soft / --mixed / --hard ─────────────

const MODES = [
  { id: "--soft", moves: [true, false, false], text: "Moves the branch pointer only. The undone commit's changes are still staged, ready to recommit (great for squashing or rewording)." },
  { id: "--mixed", moves: [true, true, false], text: "The default. Moves the branch and resets the index, so the changes are back in your working tree as unstaged edits." },
  { id: "--hard", moves: [true, true, true], text: "Moves the branch and overwrites the index AND working tree. Uncommitted changes are gone (committed ones are still in the reflog)." },
] as const;

export function ResetModes() {
  const [sel, setSel] = useState(1);
  const m = MODES[sel];
  const areas = ["HEAD / branch", "Index", "Working tree"];
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        {MODES.map((mode, i) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => setSel(i)}
            className={`rounded-lg px-3 py-1.5 font-mono text-sm font-bold ${sel === i ? "bg-amber-400 text-slate-950" : "bg-white/10 text-white"}`}
          >
            git reset {mode.id} HEAD~1
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {areas.map((a, i) => (
          <div
            key={a}
            className={`rounded-xl border p-3 text-center transition ${m.moves[i] ? "border-amber-400/70 bg-amber-400/15" : "border-white/10 bg-slate-950/60"}`}
          >
            <div className="text-sm font-bold text-white">{a}</div>
            <div className={`mt-1 text-xs ${m.moves[i] ? "text-amber-200" : "text-slate-500"}`}>{m.moves[i] ? "reset to HEAD~1" : "untouched"}</div>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-300">{m.text}</p>
    </div>
  );
}

// ───────────── Merge vs rebase ─────────────

type Strategy = "before" | "merge" | "rebase" | "squash";

const STRATEGIES: { id: Strategy; label: string; text: string }[] = [
  { id: "before", label: "Before", text: "main gained C after feature branched off at B. The two lines of work have diverged." },
  { id: "merge", label: "git merge feature", text: "A new merge commit M ties both histories together. Nothing is rewritten, so it's safe on shared branches; the graph shows exactly what happened." },
  { id: "rebase", label: "git rebase main", text: "Run on feature: D and E are replayed on top of C as new commits D′ and E′ (new IDs). History is a straight line, but it has been rewritten." },
  { id: "squash", label: "squash merge", text: "All of feature's changes become ONE new commit S on main. Tidy history, but the individual commits (and the link to the branch) are gone." },
];

function Dot({ x, y, label, color, hollow }: { x: number; y: number; label: string; color: string; hollow?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={13} fill={hollow ? "#0f172a" : color} stroke={color} strokeWidth={3} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={800} fill={hollow ? color : "#020617"} fontFamily="monospace">
        {label}
      </text>
    </g>
  );
}

export function MergeVsRebase() {
  const [s, setS] = useState<Strategy>("before");
  const main = "#38bdf8";
  const feat = "#f472b6";
  const info = STRATEGIES.find((x) => x.id === s)!;
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        {STRATEGIES.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setS(x.id)}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs font-bold ${s === x.id ? "bg-amber-400 text-slate-950" : "bg-white/10 text-white"}`}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950 p-2">
        <svg width={420} height={130} role="img" aria-label={`Commit graph: ${info.label}`}>
          <line x1={30} y1={40} x2={150} y2={40} stroke={main} strokeWidth={3} />
          {s !== "rebase" && <path d="M90,40 C120,40 120,95 150,95 L210,95" fill="none" stroke={feat} strokeWidth={3} strokeDasharray={s === "squash" ? "4 4" : undefined} />}
          {s === "merge" && <path d="M150,40 L270,40 M210,95 C240,95 240,40 270,40" fill="none" stroke={main} strokeWidth={3} />}
          {s === "squash" && <line x1={150} y1={40} x2={270} y2={40} stroke={main} strokeWidth={3} />}
          {s === "rebase" && <path d="M150,40 L330,40" fill="none" stroke={feat} strokeWidth={3} />}
          <Dot x={30} y={40} label="A" color={main} />
          <Dot x={90} y={40} label="B" color={main} />
          <Dot x={150} y={40} label="C" color={main} />
          {s !== "rebase" && <Dot x={150} y={95} label="D" color={s === "squash" ? "#475569" : feat} />}
          {s !== "rebase" && <Dot x={210} y={95} label="E" color={s === "squash" ? "#475569" : feat} />}
          {s === "merge" && <Dot x={270} y={40} label="M" color={main} hollow />}
          {s === "squash" && <Dot x={270} y={40} label="S" color={main} />}
          {s === "rebase" && <Dot x={240} y={40} label="D′" color={feat} />}
          {s === "rebase" && <Dot x={330} y={40} label="E′" color={feat} />}
          <text x={8} y={20} fontSize={10} fill="#94a3b8" fontFamily="monospace">
            main
          </text>
          {s !== "rebase" && (
            <text x={232} y={112} fontSize={10} fill="#94a3b8" fontFamily="monospace">
              feature
            </text>
          )}
          {s === "rebase" && (
            <text x={300} y={20} fontSize={10} fill="#94a3b8" fontFamily="monospace">
              feature
            </text>
          )}
        </svg>
      </div>
      <p className="text-sm text-slate-300">{info.text}</p>
    </div>
  );
}
