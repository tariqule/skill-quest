"use client";

import { useState } from "react";

/** Concept diagrams for the Algorithms interview track. */

const BTN = "rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-40";

// ───────────── Growth rates ─────────────

const SIZES = [10, 100, 1_000, 10_000, 100_000, 1_000_000];
const CLASSES: { name: string; color: string; f: (n: number) => number }[] = [
  { name: "O(log n)", color: "#34d399", f: (n) => Math.log2(n) },
  { name: "O(n)", color: "#38bdf8", f: (n) => n },
  { name: "O(n log n)", color: "#a78bfa", f: (n) => n * Math.log2(n) },
  { name: "O(n²)", color: "#f59e0b", f: (n) => n * n },
  { name: "O(2ⁿ)", color: "#f43f5e", f: (n) => 2 ** n },
];

function fmtOps(v: number) {
  if (!Number.isFinite(v)) return "astronomical";
  if (v < 1e6) return Math.round(v).toLocaleString("en-US");
  return v.toExponential(1).replace("e+", " × 10^");
}

function fmtTime(ops: number) {
  const s = ops / 1e8;
  if (!Number.isFinite(s) || s > 3.15e9) return "longer than a lifetime";
  if (s < 1e-3) return "< 1 ms";
  if (s < 1) return `${Math.round(s * 1000)} ms`;
  if (s < 120) return `${s.toFixed(1)} s`;
  if (s < 7200) return `${Math.round(s / 60)} min`;
  if (s < 172800) return `${Math.round(s / 3600)} hours`;
  if (s < 3.15e7 * 2) return `${Math.round(s / 86400)} days`;
  return `${Math.round(s / 3.15e7)} years`;
}

export function GrowthChart() {
  const [si, setSi] = useState(2);
  const n = SIZES[si];
  const MAX_LOG = 15;
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-semibold text-white" htmlFor="growth-n">
          n = <span className="font-mono text-pink-300">{n.toLocaleString("en-US")}</span>
        </label>
        <input id="growth-n" type="range" min={0} max={SIZES.length - 1} value={si} onChange={(e) => setSi(Number(e.target.value))} className="w-56 accent-pink-400" />
      </div>
      <div className="mt-3 grid gap-2">
        {CLASSES.map((c) => {
          const ops = c.f(n);
          const w = Math.min(100, (Math.log10(Math.max(ops, 1)) / MAX_LOG) * 100);
          return (
            <div key={c.name} className="grid grid-cols-[5.5rem_1fr] items-center gap-2 text-sm sm:grid-cols-[5.5rem_1fr_9rem_9rem]">
              <span className="font-mono font-bold" style={{ color: c.color }}>
                {c.name}
              </span>
              <div className="h-3.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(w, 1)}%`, background: c.color }} />
              </div>
              <span className="hidden font-mono text-xs text-slate-300 sm:block">{fmtOps(ops)} ops</span>
              <span className="hidden text-xs text-slate-400 sm:block">≈ {fmtTime(ops)}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-slate-400">Bars use a log scale. Times assume a rough 10⁸ simple operations per second: a rule of thumb, not a benchmark.</p>
    </div>
  );
}

// ───────────── Lomuto partition ─────────────

interface PartSnap {
  arr: number[];
  i: number;
  j: number;
  note: string;
  done?: boolean;
}

function partitionSnaps(start: number[]): PartSnap[] {
  const arr = [...start];
  const hi = arr.length - 1;
  const pivot = arr[hi];
  let i = 0;
  const snaps: PartSnap[] = [{ arr: [...arr], i, j: 0, note: `The pivot is ${pivot}, the last element. i marks where the next small item goes.` }];
  for (let j = 0; j < hi; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      snaps.push({ arr: [...arr], i: i + 1, j, note: `${arr[i]} < ${pivot}: swap it into slot ${i}, then move i to ${i + 1}.` });
      i++;
    } else {
      snaps.push({ arr: [...arr], i, j, note: `${arr[j]} ≥ ${pivot}: leave it; it belongs on the right.` });
    }
  }
  [arr[i], arr[hi]] = [arr[hi], arr[i]];
  snaps.push({ arr: [...arr], i, j: hi, note: `Swap the pivot into slot ${i}. Everything left is smaller, everything right is larger. Recurse on both sides.`, done: true });
  return snaps;
}

const PART_SNAPS = partitionSnaps([7, 2, 9, 4, 3, 8, 5]);

export function PartitionStepper() {
  const [k, setK] = useState(0);
  const s = PART_SNAPS[k];
  const hi = s.arr.length - 1;
  return (
    <div>
      <div className="flex gap-1.5 overflow-x-auto py-1">
        {s.arr.map((v, idx) => {
          const isPivot = s.done ? idx === s.i : idx === hi;
          const small = s.done ? idx < s.i : idx < s.i;
          return (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`flex h-12 w-11 items-center justify-center rounded-lg border-2 font-mono font-bold text-white transition ${
                  isPivot ? "border-pink-400 bg-pink-400/30" : small ? "border-emerald-400 bg-emerald-400/20" : idx === s.j && k > 0 ? "border-sky-400 bg-sky-400/15" : "border-white/15 bg-slate-950/70"
                }`}
              >
                {v}
              </div>
              <div className="mt-1 h-4 text-[10px] font-bold uppercase">
                {idx === s.i && !s.done && <span className="text-emerald-300">i</span>}
                {idx === s.j && k > 0 && !s.done && <span className="ml-1 text-sky-300">j</span>}
              </div>
            </div>
          );
        })}
      </div>
      <p className="min-h-10 text-sm text-slate-200">{s.note}</p>
      <div className="mt-2 flex gap-2">
        <button type="button" className={BTN} disabled={k === PART_SNAPS.length - 1} onClick={() => setK(k + 1)}>
          Step ▶
        </button>
        <button type="button" className={BTN} onClick={() => setK(0)}>
          Reset
        </button>
        <span className="self-center text-xs text-slate-500">
          <span className="text-emerald-300">green</span> &lt; pivot · <span className="text-pink-300">pink</span> is the pivot
        </span>
      </div>
    </div>
  );
}

// ───────────── Subset decision tree ─────────────

const SUBSET_NUMS = [1, 2, 3];
const SUBSET_W = 360;

interface SubsetNode {
  x: number;
  y: number;
  level: number;
  label: string;
  parent?: { x: number; y: number };
  take?: boolean;
}

function subsetNodes(): SubsetNode[] {
  const out: SubsetNode[] = [];
  function walk(level: number, lo: number, hi: number, picked: number[], parent?: { x: number; y: number }, take?: boolean) {
    const x = (lo + hi) / 2;
    const y = 20 + level * 46;
    out.push({ x, y, level, label: `[${picked.join(",")}]`, parent, take });
    if (level === SUBSET_NUMS.length) return;
    walk(level + 1, lo, x, [...picked, SUBSET_NUMS[level]], { x, y }, true);
    walk(level + 1, x, hi, picked, { x, y }, false);
  }
  walk(0, 0, SUBSET_W, []);
  return out;
}

const SUBSET_NODES = subsetNodes();

export function SubsetTree() {
  const [depth, setDepth] = useState(1);
  const W = SUBSET_W;
  const nodes = SUBSET_NODES;
  const shown = nodes.filter((n) => n.level <= depth);

  return (
    <div>
      <svg viewBox={`0 0 ${W} 170`} className="w-full" role="img" aria-label="Decision tree for subsets of [1, 2, 3]">
        {shown.map((n, i) =>
          n.parent ? (
            <g key={`e${i}`}>
              <line x1={n.parent.x} y1={n.parent.y} x2={n.x} y2={n.y} stroke={n.take ? "#a78bfa" : "rgb(255 255 255 / 0.25)"} strokeWidth={2} />
              <text x={(n.parent.x + n.x) / 2 + (n.take ? -10 : 10)} y={(n.parent.y + n.y) / 2} textAnchor="middle" className={`text-[9px] ${n.take ? "fill-violet-300" : "fill-slate-500"}`}>
                {n.take ? `+${SUBSET_NUMS[n.level - 1]}` : "skip"}
              </text>
            </g>
          ) : null,
        )}
        {shown.map((n, i) => (
          <g key={`n${i}`}>
            <rect x={n.x - 22} y={n.y - 10} width={44} height={20} rx={6} fill={n.level === SUBSET_NUMS.length ? "#4c1d95" : "#0f172a"} stroke="#a78bfa" strokeWidth={1.5} />
            <text x={n.x} y={n.y + 4} textAnchor="middle" className="fill-white font-mono text-[10px]">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button type="button" className={BTN} disabled={depth >= SUBSET_NUMS.length} onClick={() => setDepth(depth + 1)}>
          Decide next number ▶
        </button>
        <button type="button" className={BTN} onClick={() => setDepth(1)}>
          Reset
        </button>
        <span className="text-sm text-slate-300">
          {depth === SUBSET_NUMS.length ? "8 leaves = 2³ subsets. Each path is one choose / un-choose sequence." : `Level ${depth}: each node branches into take or skip.`}
        </span>
      </div>
    </div>
  );
}

// ───────────── BFS on a grid ─────────────

const ROWS = 6;
const COLS = 9;
const START = [2, 0] as const;
const TARGET = [3, 8] as const;
const INITIAL_WALLS = ["0,3", "1,3", "2,3", "3,3", "4,5", "3,5", "2,5", "5,5", "1,7", "2,7"];

function bfs(walls: Set<string>) {
  const dist = new Map<string, number>();
  const parent = new Map<string, string>();
  const startKey = `${START[0]},${START[1]}`;
  dist.set(startKey, 0);
  const queue = [startKey];
  for (let h = 0; h < queue.length; h++) {
    const [r, c] = queue[h].split(",").map(Number);
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr;
      const nc = c + dc;
      const k = `${nr},${nc}`;
      if (nr < 0 || nc < 0 || nr >= ROWS || nc >= COLS || walls.has(k) || dist.has(k)) continue;
      dist.set(k, dist.get(queue[h])! + 1);
      parent.set(k, queue[h]);
      queue.push(k);
    }
  }
  return { dist, parent };
}

export function BfsGrid() {
  const [walls, setWalls] = useState<string[]>(INITIAL_WALLS);
  const [wave, setWave] = useState(0);
  const wallSet = new Set(walls);
  const { dist, parent } = bfs(wallSet);
  const targetKey = `${TARGET[0]},${TARGET[1]}`;
  const targetDist = dist.get(targetKey);
  const reached = targetDist !== undefined && wave >= targetDist;
  const maxDist = Math.max(0, ...dist.values());
  const path = new Set<string>();
  if (reached) for (let k: string | undefined = targetKey; k; k = parent.get(k)) path.add(k);

  function toggle(k: string) {
    if (k === `${START[0]},${START[1]}` || k === targetKey) return;
    setWalls(wallSet.has(k) ? walls.filter((w) => w !== k) : [...walls, k]);
    setWave(0);
  }

  return (
    <div>
      <div className="grid w-fit gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 2.1rem))` }}>
        {Array.from({ length: ROWS * COLS }, (_, idx) => {
          const r = Math.floor(idx / COLS);
          const c = idx % COLS;
          const k = `${r},${c}`;
          const d = dist.get(k);
          const isStart = r === START[0] && c === START[1];
          const isTarget = k === targetKey;
          const lit = d !== undefined && d <= wave;
          return (
            <button
              key={k}
              type="button"
              onClick={() => toggle(k)}
              aria-label={`Cell ${r},${c}`}
              className={`flex h-8 items-center justify-center rounded text-[11px] font-mono font-bold transition ${
                wallSet.has(k)
                  ? "bg-slate-600"
                  : isStart
                    ? "bg-sky-400 text-slate-950"
                    : isTarget
                      ? "bg-pink-400 text-slate-950"
                      : path.has(k)
                        ? "bg-amber-400/70 text-slate-950"
                        : lit
                          ? d === wave
                            ? "bg-sky-400/50 text-white"
                            : "bg-sky-400/20 text-sky-100"
                          : "bg-white/5 text-transparent"
              }`}
            >
              {isStart ? "S" : isTarget ? "T" : lit ? d : "·"}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className={BTN} disabled={wave >= maxDist} onClick={() => setWave(wave + 1)}>
          Next wave ▶
        </button>
        <button type="button" className={BTN} onClick={() => setWave(0)}>
          Reset
        </button>
        <span className="text-sm text-slate-300">
          {targetDist === undefined
            ? "The target is walled off: BFS empties the queue without reaching it."
            : reached
              ? `Reached T in ${targetDist} steps. BFS found it first, so no shorter path exists.`
              : `Wave ${wave}: every cell at distance ${wave} from S.`}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-500">Tap cells to add or remove walls. Each wave is one BFS level: everything in the queue at the same distance.</p>
    </div>
  );
}

// ───────────── Fibonacci call tree ─────────────

interface CallNode {
  n: number;
  hit: boolean;
  kids: CallNode[];
}

function callTree(n: number, memo: Set<number> | null): CallNode {
  if (n < 2) return { n, hit: false, kids: [] };
  if (memo?.has(n)) return { n, hit: true, kids: [] };
  const kids = [callTree(n - 1, memo), callTree(n - 2, memo)];
  memo?.add(n);
  return { n, hit: false, kids };
}

interface PlacedCall {
  x: number;
  y: number;
  node: CallNode;
  parent?: { x: number; y: number };
}

/** Leaves get consecutive x slots; each parent sits above the middle of its children. */
function layoutCalls(root: CallNode): { placed: PlacedCall[]; leaves: number } {
  const placed: PlacedCall[] = [];
  let leaf = 0;
  function layout(node: CallNode, depth: number, parent?: { x: number; y: number }): void {
    const y = 16 + depth * 34;
    const entry: PlacedCall = { x: 0, y, node, parent };
    placed.push(entry);
    if (!node.kids.length) {
      entry.x = leaf++;
      return;
    }
    const firstLeaf = leaf;
    const self = { x: 0, y };
    for (const k of node.kids) layout(k, depth + 1, self);
    entry.x = (firstLeaf + leaf - 1) / 2;
    self.x = entry.x;
  }
  layout(root, 0);
  return { placed, leaves: Math.max(leaf, 1) };
}

export function FibTree() {
  const [n, setN] = useState(5);
  const [memo, setMemo] = useState(false);
  const root = callTree(n, memo ? new Set() : null);

  const { placed, leaves } = layoutCalls(root);
  const W = 360;
  const xs = (x: number) => ((x + 0.5) * W) / leaves;
  const height = Math.max(...placed.map((p) => p.y)) + 20;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-semibold text-white" htmlFor="fib-n">
          fib(<span className="font-mono text-emerald-300">{n}</span>)
        </label>
        <input id="fib-n" type="range" min={2} max={6} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-40 accent-emerald-400" />
        <button
          type="button"
          role="switch"
          aria-checked={memo}
          onClick={() => setMemo(!memo)}
          className={`rounded-full border px-3 py-1 text-sm font-semibold ${memo ? "border-emerald-400 bg-emerald-400/20 text-white" : "border-white/15 text-slate-300"}`}
        >
          {memo ? "🧠 Memo ON" : "Memo OFF"}
        </button>
        <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-sm text-white">{placed.length} calls</span>
      </div>
      <svg viewBox={`0 0 ${W} ${height}`} className="mt-2 w-full" role="img" aria-label={`Call tree for fib(${n})`}>
        {placed.map((p, i) => (p.parent ? <line key={`e${i}`} x1={xs(p.parent.x)} y1={p.parent.y} x2={xs(p.x)} y2={p.y} stroke="rgb(255 255 255 / 0.2)" strokeWidth={1.5} /> : null))}
        {placed.map((p, i) => (
          <g key={`n${i}`}>
            <circle cx={xs(p.x)} cy={p.y} r={11} fill={p.node.hit ? "#065f46" : p.node.n < 2 ? "#1e293b" : "#0f172a"} stroke={p.node.hit ? "#34d399" : "rgb(255 255 255 / 0.35)"} strokeWidth={1.5} />
            <text x={xs(p.x)} y={p.y + 4} textAnchor="middle" className={`font-mono text-[10px] font-bold ${p.node.hit ? "fill-emerald-200" : "fill-white"}`}>
              {p.node.n}
            </text>
          </g>
        ))}
      </svg>
      <p className="text-sm text-slate-300">
        {memo
          ? "Green nodes are cache hits: each value is computed once, so the calls grow linearly (2n − 1)."
          : "Without a cache the same subproblems are solved again and again: the tree roughly doubles with each n."}
      </p>
    </div>
  );
}
