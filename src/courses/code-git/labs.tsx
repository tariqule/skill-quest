"use client";

import { useState } from "react";
import { LabHeader, type GoalProps } from "@/components/learn/blocks";
import { BlockIcon } from "@/components/learn/block-icons";

/** Hands-on playgrounds for Learn Git & GitHub. */

const btn = "rounded-lg px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40";

// ───────────── Three areas: working tree → index → commits ─────────────

const FILES = ["index.html", "app.js", "notes.txt"] as const;
type FileName = (typeof FILES)[number];

/** Version numbers of one file in each area. `null` means "not there". */
interface Areas {
  work: number | null;
  index: number | null;
  head: number | null;
}

interface Repo {
  files: Record<FileName, Areas>;
  commits: { id: string; msg: string }[];
}

const AREAS_START: Repo = {
  files: {
    "index.html": { work: 1, index: 1, head: 1 },
    "app.js": { work: 2, index: 1, head: 1 },
    "notes.txt": { work: 1, index: null, head: null },
  },
  commits: [{ id: "4f1c2a9", msg: "Initial commit" }],
};

const FAKE_IDS = ["b7e03d1", "9a2f6c4", "e15d8b0", "3c94a7e", "d02b5f6", "71af3e8", "c8e4190", "5b6d2fa"];

/** The two-letter code `git status --short` prints: index vs HEAD, then working tree vs index. */
function statusCode(f: Areas): string | null {
  if (f.head === null && f.index === null) return f.work === null ? null : "??";
  const x = f.head === null ? "A" : f.index !== f.head ? "M" : " ";
  const y = f.work !== f.index ? "M" : " ";
  return x === " " && y === " " ? null : x + y;
}

function hasStaged(r: Repo) {
  return FILES.some((n) => r.files[n].index !== r.files[n].head);
}

type AreaAction = "edit" | "add" | "restore" | "unstage";

export function ThreeAreasLab({ goal, onSolved }: GoalProps<"partial" | "discard">) {
  const [repo, setRepo] = useState<Repo>(AREAS_START);
  const [out, setOut] = useState<string[]>(["$ git status --short", " M app.js", "?? notes.txt"]);
  const [editedHtml, setEditedHtml] = useState(false);

  const say = (cmd: string, lines: string[]) => setOut([`$ ${cmd}`, ...lines]);

  function act(name: FileName, a: AreaAction) {
    const f = repo.files[name];
    let next: Areas = f;
    if (a === "edit") {
      next = { ...f, work: Math.max(f.work ?? 0, f.index ?? 0, f.head ?? 0) + 1 };
      say(`edit ${name}`, ["(you saved a change in your editor; Git hasn't recorded anything yet)"]);
      if (name === "index.html") setEditedHtml(true);
    } else if (a === "add") {
      next = { ...f, index: f.work };
      say(`git add ${name}`, ["(the current version is copied into the index: it will be in the next commit)"]);
    } else if (a === "restore") {
      if (f.index === null) {
        say(`git restore ${name}`, [`error: pathspec '${name}' did not match any file(s) known to git`]);
        return;
      }
      next = { ...f, work: f.index };
      say(`git restore ${name}`, ["(working-tree changes are thrown away: the file matches the index again)"]);
      if (goal === "discard" && name === "index.html" && editedHtml && f.work !== f.index && f.index === f.head) onSolved?.();
    } else {
      next = { ...f, index: f.head };
      say(`git restore --staged ${name}`, ["(unstaged: the index goes back to HEAD's version; your edits are still in the working tree)"]);
    }
    setRepo({ ...repo, files: { ...repo.files, [name]: next } });
  }

  function commit(all: boolean) {
    let files = repo.files;
    if (all) {
      files = { ...files };
      for (const n of FILES) if (files[n].head !== null || files[n].index !== null) files[n] = { ...files[n], index: files[n].work };
    }
    const cmd = all ? 'git commit -am "Update"' : 'git commit -m "Update"';
    const staged = FILES.filter((n) => files[n].index !== files[n].head);
    if (staged.length === 0) {
      const untracked = FILES.some((n) => statusCode(files[n]) === "??");
      const modified = FILES.some((n) => files[n].work !== files[n].index && files[n].index !== null);
      say(cmd, [
        modified
          ? 'no changes added to commit (use "git add" and/or "git commit -a")'
          : untracked
            ? 'nothing added to commit but untracked files present (use "git add" to track)'
            : "nothing to commit, working tree clean",
      ]);
      return;
    }
    const id = FAKE_IDS[(repo.commits.length - 1) % FAKE_IDS.length];
    const committed = Object.fromEntries(FILES.map((n) => [n, { ...files[n], head: files[n].index }])) as Record<FileName, Areas>;
    setRepo({ files: committed, commits: [{ id, msg: "Update" }, ...repo.commits] });
    say(cmd, [`[main ${id}] Update`, ` ${staged.length} file${staged.length > 1 ? "s" : ""} changed: ${staged.join(", ")}`]);
    if (goal === "partial" && staged.includes("app.js") && committed["notes.txt"].head === null) onSolved?.();
  }

  function status() {
    const lines = FILES.map((n) => {
      const c = statusCode(repo.files[n]);
      return c ? `${c} ${n}` : null;
    }).filter((l): l is string => l !== null);
    say("git status --short", lines.length ? lines : ["(nothing: working tree clean)"]);
  }

  function reset() {
    setRepo(AREAS_START);
    setEditedHtml(false);
    setOut(["$ git status --short", " M app.js", "?? notes.txt"]);
  }

  const columns: { key: keyof Areas; title: string; icon: string; sub: string; color: string }[] = [
    { key: "work", title: "Working tree", icon: "📝", sub: "Files on disk you edit", color: "#f59e0b" },
    { key: "index", title: "Index (staging)", icon: "📦", sub: "What the next commit will hold", color: "#34d399" },
    { key: "head", title: "Repository (HEAD)", icon: "🗄️", sub: "The last commit", color: "#38bdf8" },
  ];

  return (
    <div>
      <LabHeader
        title="The three areas"
        hint="Every file lives in three places. Edit, add, restore and commit, and watch the version cards move. A card glows when it differs from the area to its right."
      />
      <div className="grid gap-2 sm:grid-cols-3">
        {columns.map((col, ci) => (
          <div key={col.key} className="rounded-xl border border-white/10 bg-slate-950/60 p-2">
            <div className="flex items-center gap-1.5 text-sm font-bold text-white">
              <span><BlockIcon icon={col.icon} className="inline-block size-[1.1em] align-[-0.15em]" /></span>
              {col.title}
            </div>
            <div className="mb-2 text-[11px] text-slate-400">{col.sub}</div>
            <div className="grid gap-1.5">
              {FILES.map((n) => {
                const f = repo.files[n];
                const v = f[col.key];
                const right = ci === 0 ? f.index : ci === 1 ? f.head : undefined;
                const differs = ci < 2 && v !== right && v !== null;
                return (
                  <div
                    key={n}
                    className={`flex items-center justify-between rounded-lg border px-2 py-1 font-mono text-xs ${v === null ? "border-dashed border-white/10 text-muted-foreground" : "text-slate-100"}`}
                    style={v !== null ? { borderColor: differs ? col.color : "rgb(255 255 255 / 0.12)", boxShadow: differs ? `0 0 0 2px ${col.color}33` : undefined } : undefined}
                  >
                    <span>{n}</span>
                    <span className={v === null ? "" : "rounded bg-white/10 px-1.5"}>{v === null ? "—" : `v${v}`}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-2">
        {FILES.map((n) => (
          <div key={n} className="flex flex-wrap items-center gap-1.5">
            <span className="w-24 font-mono text-xs text-slate-300">{n}</span>
            <button type="button" onClick={() => act(n, "edit")} className={`${btn} bg-reward px-2 py-1 text-xs text-primary-foreground`}>
              <BlockIcon icon="✏️" className="inline-block size-[1.1em] align-[-0.15em]" /> edit
            </button>
            <button type="button" onClick={() => act(n, "add")} className={`${btn} bg-primary px-2 py-1 font-mono text-xs text-primary-foreground`}>
              git add
            </button>
            <button type="button" onClick={() => act(n, "restore")} className={`${btn} bg-slate-700 px-2 py-1 font-mono text-xs text-white`}>
              git restore
            </button>
            <button type="button" onClick={() => act(n, "unstage")} className={`${btn} bg-slate-700 px-2 py-1 font-mono text-xs text-white`}>
              restore --staged
            </button>
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => commit(false)} className={`${btn} bg-primary font-mono text-primary-foreground`}>
            git commit
          </button>
          <button type="button" onClick={() => commit(true)} className={`${btn} bg-sky-700 font-mono text-white`}>
            git commit -a
          </button>
          <button type="button" onClick={status} className={`${btn} bg-violet-500 font-mono text-white`}>
            git status -s
          </button>
          <button type="button" onClick={reset} className={`${btn} bg-slate-800 text-slate-300`}>
            ↺ Reset
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="min-h-20 rounded-xl border border-white/10 bg-slate-950 p-3 font-mono text-xs">
          {out.map((l, i) => (
            <div key={i} className={`whitespace-pre-wrap ${i === 0 ? "text-slate-400" : l.startsWith("error") ? "text-rose-300" : l.startsWith("(") ? "text-slate-400" : "text-emerald-300"}`}>
              {l}
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950 p-3 font-mono text-xs">
          <div className="text-slate-400">$ git log --oneline</div>
          {repo.commits.map((c, i) => (
            <div key={c.id + i} className={i === 0 ? "text-amber-300" : "text-slate-300"}>
              {c.id} {i === 0 && <span className="text-sky-300">(HEAD -&gt; main)</span>} {c.msg}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Status codes: first column = index vs HEAD, second = working tree vs index. <span className="font-mono">??</span> untracked ·{" "}
        <span className="font-mono">A</span> new file staged · <span className="font-mono">M</span> modified. {hasStaged(repo) ? "Something is staged and ready to commit." : "Nothing is staged."}
      </p>
    </div>
  );
}

// ───────────── Commit graph playground ─────────────

const BRANCHES = ["main", "feature", "bugfix"] as const;
type Branch = (typeof BRANCHES)[number];

interface GCommit {
  id: string;
  label: string;
  parents: string[];
  lane: number;
  seq: number;
}

interface Graph {
  commits: GCommit[];
  refs: Partial<Record<Branch, string>>;
  lanes: Partial<Record<Branch, number>>;
  head: Branch;
  n: number;
}

const GRAPH_START: Graph = {
  commits: [
    { id: "c1", label: "C1", parents: [], lane: 0, seq: 0 },
    { id: "c2", label: "C2", parents: ["c1"], lane: 0, seq: 1 },
  ],
  refs: { main: "c2" },
  lanes: { main: 0 },
  head: "main",
  n: 3,
};

const LANE_COLORS = ["#38bdf8", "#f472b6", "#a3e635"];
const MAX_COMMITS = 16;

function ancestors(g: Graph, id: string): Set<string> {
  const seen = new Set<string>();
  const stack = [id];
  while (stack.length) {
    const cur = stack.pop()!;
    if (seen.has(cur)) continue;
    seen.add(cur);
    const c = g.commits.find((x) => x.id === cur);
    if (c) stack.push(...c.parents);
  }
  return seen;
}

function reachableFromRefs(g: Graph): Set<string> {
  const all = new Set<string>();
  for (const b of BRANCHES) {
    const tip = g.refs[b];
    if (tip) for (const id of ancestors(g, tip)) all.add(id);
  }
  return all;
}

export function CommitGraphLab({ goal, onSolved }: GoalProps<"merge" | "rebase" | "ff">) {
  const [g, setG] = useState<Graph>(GRAPH_START);
  const [out, setOut] = useState<string[]>(["HEAD -> main. Try: git branch feature, git switch feature, commit, then switch back and merge."]);

  const tip = (b: Branch) => g.refs[b]!;
  const say = (cmd: string, lines: string[]) => setOut([`$ ${cmd}`, ...lines]);
  const label = (id: string) => g.commits.find((c) => c.id === id)?.label ?? id;

  function commit() {
    const id = `c${g.n}`;
    const c: GCommit = { id, label: `C${g.n}`, parents: [tip(g.head)], lane: g.lanes[g.head] ?? 0, seq: g.commits.length };
    setG({ ...g, commits: [...g.commits, c], refs: { ...g.refs, [g.head]: id }, n: g.n + 1 });
    say(`git commit -m "C${g.n}"`, [`[${g.head} ${c.label}] C${g.n}`, `(${g.head} moves forward to ${c.label}; HEAD follows because it points at ${g.head})`]);
  }

  function branch(b: Branch) {
    const lane = Math.max(...Object.values(g.lanes).map((l) => l ?? 0)) + 1;
    setG({ ...g, refs: { ...g.refs, [b]: tip(g.head) }, lanes: { ...g.lanes, [b]: Math.min(lane, 2) } });
    say(`git branch ${b}`, [`(new pointer ${b} → ${label(tip(g.head))}. HEAD is still on ${g.head}: creating a branch doesn't switch to it)`]);
  }

  function switchTo(b: Branch) {
    setG({ ...g, head: b });
    say(`git switch ${b}`, [`Switched to branch '${b}'`]);
  }

  function merge(b: Branch) {
    const ours = tip(g.head);
    const theirs = tip(b);
    if (ancestors(g, ours).has(theirs)) {
      say(`git merge ${b}`, ["Already up to date."]);
      return;
    }
    if (ancestors(g, theirs).has(ours)) {
      setG({ ...g, refs: { ...g.refs, [g.head]: theirs } });
      say(`git merge ${b}`, [`Updating ${label(ours)}..${label(theirs)}`, "Fast-forward", `(${g.head} just slides forward to ${label(theirs)}: no new commit needed)`]);
      if (goal === "ff") onSolved?.();
      return;
    }
    const id = `c${g.n}`;
    const m: GCommit = { id, label: `M${g.n}`, parents: [ours, theirs], lane: g.lanes[g.head] ?? 0, seq: g.commits.length };
    setG({ ...g, commits: [...g.commits, m], refs: { ...g.refs, [g.head]: id }, n: g.n + 1 });
    say(`git merge ${b}`, ["Merge made by the 'ort' strategy.", `(new merge commit ${m.label} with two parents: ${label(ours)} and ${label(theirs)})`]);
    if (goal === "merge") onSolved?.();
  }

  function rebase(b: Branch) {
    const ours = tip(g.head);
    const onto = tip(b);
    const ourSet = ancestors(g, ours);
    const ontoSet = ancestors(g, onto);
    if (ontoSet.has(ours) && ours !== onto) {
      setG({ ...g, refs: { ...g.refs, [g.head]: onto } });
      say(`git rebase ${b}`, [`Successfully rebased and updated refs/heads/${g.head}.`, `(nothing to replay: ${g.head} just moved up to ${label(onto)})`]);
      return;
    }
    const toReplay = g.commits.filter((c) => ourSet.has(c.id) && !ontoSet.has(c.id) && c.parents.length === 1).sort((x, y) => x.seq - y.seq);
    if (toReplay.length === 0) {
      say(`git rebase ${b}`, [`Current branch ${g.head} is up to date.`]);
      return;
    }
    let parent = onto;
    let n = g.n;
    let seq = g.commits.length;
    const fresh: GCommit[] = [];
    for (const c of toReplay) {
      const id = `c${n++}`;
      const base = c.label.replace(/′+$/, "");
      const primes = (c.label.match(/′/g)?.length ?? 0) + 1;
      fresh.push({ id, label: base + "′".repeat(primes), parents: [parent], lane: g.lanes[g.head] ?? 0, seq: seq++ });
      parent = id;
    }
    setG({ ...g, commits: [...g.commits, ...fresh], refs: { ...g.refs, [g.head]: parent }, n });
    say(`git rebase ${b}`, [
      `Successfully rebased and updated refs/heads/${g.head}.`,
      `(${toReplay.map((c) => c.label).join(", ")} were replayed on top of ${label(onto)} as NEW commits ${fresh.map((c) => c.label).join(", ")}. The originals are now unreachable.)`,
    ]);
    if (goal === "rebase") onSolved?.();
  }

  function reset() {
    setG(GRAPH_START);
    setOut(["Reset: C1 ← C2 on main."]);
  }

  // ── Drawing ──
  const live = reachableFromRefs(g);
  const COL = 72;
  const ROW = 64;
  const pos = (c: GCommit) => ({ x: 40 + c.seq * COL, y: 84 + c.lane * ROW });
  const width = 40 + g.commits.length * COL + 40;
  const height = 84 + 2 * ROW + 40;
  const full = g.commits.length >= MAX_COMMITS;
  const existing = BRANCHES.filter((b) => g.refs[b]);
  const others = existing.filter((b) => b !== g.head);
  const missing = BRANCHES.filter((b) => !g.refs[b]);

  return (
    <div>
      <LabHeader title="Commit graph playground" hint="Branches are sticky notes on commits; HEAD says which note moves when you commit. Merge and rebase, and watch the graph redraw." />
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950 p-2">
        <svg width={width} height={height} role="img" aria-label="Commit graph">
          {g.commits.flatMap((c) =>
            c.parents.map((pid) => {
              const p = g.commits.find((x) => x.id === pid)!;
              const a = pos(p);
              const b = pos(c);
              const faded = !live.has(c.id);
              const d = a.y === b.y ? `M${a.x},${a.y} L${b.x},${b.y}` : `M${a.x},${a.y} C${a.x + COL * 0.6},${a.y} ${b.x - COL * 0.6},${b.y} ${b.x},${b.y}`;
              return <path key={`${c.id}-${pid}`} d={d} fill="none" stroke={faded ? "#334155" : LANE_COLORS[c.lane]} strokeWidth={2.5} strokeDasharray={faded ? "4 4" : undefined} />;
            }),
          )}
          {g.commits.map((c) => {
            const { x, y } = pos(c);
            const faded = !live.has(c.id);
            const isHead = tip(g.head) === c.id;
            const color = faded ? "#334155" : LANE_COLORS[c.lane];
            const tags = existing.filter((b) => g.refs[b] === c.id);
            return (
              <g key={c.id}>
                <circle cx={x} cy={y} r={14} fill={c.parents.length > 1 ? "#0f172a" : color} stroke={color} strokeWidth={3} />
                <text x={x} y={y + 4} textAnchor="middle" fontSize={10} fontWeight={800} fill={c.parents.length > 1 ? color : "#020617"} fontFamily="monospace">
                  {c.label}
                </text>
                {isHead && <circle cx={x} cy={y} r={19} fill="none" stroke="#fbbf24" strokeWidth={2} />}
                {tags.map((b, i) => (
                  <g key={b}>
                    <rect x={x - 34} y={y - 40 - i * 16} width={68} height={14} rx={4} fill={b === g.head ? "#fbbf24" : "#1e293b"} />
                    <text x={x} y={y - 29.5 - i * 16} textAnchor="middle" fontSize={9} fontWeight={700} fill={b === g.head ? "#020617" : "#e2e8f0"} fontFamily="monospace">
                      {b === g.head ? `HEAD→${b}` : b}
                    </text>
                  </g>
                ))}
                {faded && (
                  <text x={x} y={y + 28} textAnchor="middle" fontSize={8.5} fill="#64748b">
                    orphaned
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 grid gap-2">
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={full} onClick={commit} className={`${btn} bg-primary font-mono text-primary-foreground`}>
            git commit
          </button>
          {missing.map((b) => (
            <button key={b} type="button" onClick={() => branch(b)} className={`${btn} bg-primary font-mono text-primary-foreground`}>
              git branch {b}
            </button>
          ))}
          <button type="button" onClick={reset} className={`${btn} bg-slate-800 text-slate-300`}>
            ↺ Reset
          </button>
        </div>
        {others.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {others.map((b) => (
              <button key={`s-${b}`} type="button" onClick={() => switchTo(b)} className={`${btn} bg-slate-700 font-mono text-white`}>
                git switch {b}
              </button>
            ))}
            {others.map((b) => (
              <button key={`m-${b}`} type="button" disabled={full} onClick={() => merge(b)} className={`${btn} bg-violet-500 font-mono text-white`}>
                git merge {b}
              </button>
            ))}
            {others.map((b) => (
              <button key={`r-${b}`} type="button" disabled={full} onClick={() => rebase(b)} className={`${btn} bg-pink-500 font-mono text-white`}>
                git rebase {b}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 min-h-16 rounded-xl border border-white/10 bg-slate-950 p-3 font-mono text-xs">
        {out.map((l, i) => (
          <div key={i} className={`whitespace-pre-wrap ${l.startsWith("$") ? "text-slate-400" : l.startsWith("(") ? "text-slate-400" : "text-emerald-300"}`}>
            {l}
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Gold ring = the commit HEAD points to. Hollow circle = merge commit (two parents). Dashed = commits no branch can reach any more; Git keeps them
        for a while (the reflog remembers them) and then garbage-collects them.{full ? " The graph is full: reset to keep playing." : ""}
      </p>
    </div>
  );
}

// ───────────── Merge conflict resolver ─────────────

type Resolution = "markers" | "ours" | "theirs" | "both" | "combined";

const CONFLICT_BODY: Record<Resolution, string[]> = {
  markers: ["<<<<<<< HEAD", '  return "Hello, " + name + "!";', "=======", '  return "Hello " + name.trim();', ">>>>>>> feature"],
  ours: ['  return "Hello, " + name + "!";'],
  theirs: ['  return "Hello " + name.trim();'],
  both: ['  return "Hello, " + name + "!";', '  return "Hello " + name.trim();'],
  combined: ['  return "Hello, " + name.trim() + "!";'],
};

const TEST_RESULT: Record<Resolution, { pass: boolean; text: string }> = {
  markers: { pass: false, text: "SyntaxError: Unexpected token '<<'. The conflict markers are still in the file." },
  ours: { pass: false, text: 'Expected "Hello, Ada!" but got "Hello,   Ada  !". feature\'s trim() fix was lost.' },
  theirs: { pass: false, text: 'Expected "Hello, Ada!" but got "Hello Ada". main\'s comma and "!" were lost.' },
  both: { pass: false, text: 'Expected "Hello, Ada!" but got "Hello,   Ada  !". The second return is dead code, so feature\'s fix never runs.' },
  combined: { pass: true, text: 'greet("  Ada  ") returned "Hello, Ada!". Both changes survived.' },
};

type MergeStage = "conflict" | "staged" | "done" | "aborted";

export function ConflictLab({ goal, onSolved }: GoalProps<"resolve">) {
  const [res, setRes] = useState<Resolution>("markers");
  const [stage, setStage] = useState<MergeStage>("conflict");
  const [out, setOut] = useState<string[]>([
    "$ git merge feature",
    "Auto-merging greet.js",
    "CONFLICT (content): Merge conflict in greet.js",
    "Automatic merge failed; fix conflicts and then commit the result.",
  ]);

  const say = (lines: string[]) => setOut(lines);

  function pick(r: Resolution) {
    if (stage === "done" || stage === "aborted") return;
    setRes(r);
    if (stage === "staged") setStage("conflict");
    say([`(you edited greet.js in your editor: ${r === "markers" ? "markers put back" : `kept ${r}`})`]);
  }

  function add() {
    setStage("staged");
    say([
      "$ git add greet.js",
      res === "markers"
        ? "(Git accepted it! git add marks the conflict resolved even with markers still inside. Git doesn't check, so always look before you add.)"
        : "(conflict marked as resolved: greet.js is staged)",
    ]);
  }

  function commit() {
    if (stage === "conflict") {
      say(["$ git commit", "error: Committing is not possible because you have unmerged files.", "fatal: Exiting because of an unresolved conflict."]);
      return;
    }
    setStage("done");
    const t = TEST_RESULT[res];
    say(["$ git commit --no-edit", "[main 8d3e1f2] Merge branch 'feature'", "$ npm test", t.pass ? `✓ ${t.text}` : `✗ ${t.text}`]);
    if (goal === "resolve" && t.pass) onSolved?.();
  }

  function abort() {
    setStage("aborted");
    setRes("markers");
    say(["$ git merge --abort", "(back to how main was before the merge: no conflict, no merge commit)"]);
  }

  function restart() {
    setStage("conflict");
    setRes("markers");
    setOut(["$ git merge feature", "Auto-merging greet.js", "CONFLICT (content): Merge conflict in greet.js", "Automatic merge failed; fix conflicts and then commit the result."]);
  }

  const body = stage === "aborted" ? CONFLICT_BODY.ours : CONFLICT_BODY[res];
  const fileLines = ["function greet(name) {", ...body, "}"];
  const statusLine = stage === "conflict" ? "UU greet.js" : stage === "staged" ? "M  greet.js" : "(clean)";

  const choices: { id: Resolution; label: string }[] = [
    { id: "ours", label: "Keep HEAD (main)" },
    { id: "theirs", label: "Keep feature" },
    { id: "both", label: "Keep both" },
    { id: "combined", label: "Combine by hand" },
    { id: "markers", label: "Undo my edit" },
  ];

  return (
    <div>
      <LabHeader
        title="Resolve a merge conflict"
        hint="main added a comma and '!', feature added .trim(). Both touched the same line, so Git stopped and asked you. Edit the file, stage it, commit, and run the test."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950 font-mono text-[12.5px]">
          <div className="border-b border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">greet.js</div>
          {fileLines.map((l, i) => {
            const marker = /^(<<<<<<<|=======|>>>>>>>)/.test(l);
            const inOurs = res === "markers" && stage !== "aborted" && i === 2;
            const inTheirs = res === "markers" && stage !== "aborted" && i === 4;
            return (
              <div
                key={i}
                className={`flex gap-3 px-3 py-0.5 ${marker ? "bg-rose-500/20 text-rose-200" : inOurs ? "bg-sky-500/15" : inTheirs ? "bg-pink-500/15" : ""}`}
              >
                <span className="w-4 text-right text-muted-foreground">{i + 1}</span>
                <span className="whitespace-pre text-slate-100">{l}</span>
              </div>
            );
          })}
          <div className="border-t border-white/10 px-3 py-1.5 text-xs text-slate-400">
            git status -s → <span className="text-amber-300">{statusLine}</span>
          </div>
        </div>

        <div className="grid content-start gap-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">1 · Edit the file</div>
          <div className="flex flex-wrap gap-1.5">
            {choices.map((c) => (
              <button
                key={c.id}
                type="button"
                disabled={stage === "done" || stage === "aborted"}
                onClick={() => pick(c.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold ${res === c.id && stage !== "aborted" ? "bg-amber-400 text-slate-950" : "bg-white/10 text-white"} disabled:opacity-40`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">2 · Tell Git</div>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={stage !== "conflict"} onClick={add} className={`${btn} bg-primary font-mono text-primary-foreground`}>
              git add greet.js
            </button>
            <button type="button" disabled={stage === "done" || stage === "aborted"} onClick={commit} className={`${btn} bg-primary font-mono text-primary-foreground`}>
              git commit
            </button>
            <button type="button" disabled={stage === "done" || stage === "aborted"} onClick={abort} className={`${btn} bg-slate-700 font-mono text-white`}>
              git merge --abort
            </button>
            <button type="button" onClick={restart} className={`${btn} bg-slate-800 text-slate-300`}>
              ↺ Start over
            </button>
          </div>
          <div className="min-h-24 rounded-xl border border-white/10 bg-slate-950 p-3 font-mono text-xs">
            {out.map((l, i) => (
              <div
                key={i}
                className={`whitespace-pre-wrap ${l.startsWith("$") || l.startsWith("(") ? "text-slate-400" : l.startsWith("✗") || l.startsWith("error") || l.startsWith("fatal") || l.startsWith("CONFLICT") ? "text-rose-300" : "text-emerald-300"}`}
              >
                {l}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            Between <span className="font-mono">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</span> and <span className="font-mono">=======</span> is your branch (the one you&apos;re on); below it, up to{" "}
            <span className="font-mono">&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature</span>, is the branch you&apos;re merging in.
          </p>
        </div>
      </div>
    </div>
  );
}
