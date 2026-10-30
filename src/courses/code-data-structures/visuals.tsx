"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/learn/blocks";

/** Concept diagrams for the Data Structures interview track. */

const BTN = "rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-40";

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span className="rounded-md px-2 py-0.5 font-mono text-xs font-bold" style={{ background: `${color}22`, color }}>
      {text}
    </span>
  );
}

// ───────────── Arrays: what moves when you insert ─────────────

interface ArrOp {
  label: string;
  cost: string;
  note: string;
  fresh: number;
  moved: number[];
}

const MAX_LEN = 12;

export function ArrayShift() {
  const [arr, setArr] = useState([3, 8, 1, 9]);
  const [cap, setCap] = useState(4);
  const [next, setNext] = useState(10);
  const [last, setLast] = useState<ArrOp | null>(null);

  function apply(out: number[], op: ArrOp) {
    let note = op.note;
    if (out.length > cap) {
      note += ` The block was full, so all ${arr.length} items were copied into a new block of ${cap * 2}.`;
      setCap(cap * 2);
    }
    if (out.length > arr.length) setNext(next + 1);
    setArr(out);
    setLast({ ...op, note });
  }

  const range = (from: number, to: number) => Array.from({ length: Math.max(0, to - from) }, (_, k) => from + k);
  const mid = Math.floor(arr.length / 2);
  const full = arr.length >= MAX_LEN;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={BTN} disabled={full} onClick={() => apply([...arr, next], { label: `push(${next})`, cost: "O(1)*", note: "Nothing moved: the new item goes in the next free slot.", fresh: arr.length, moved: [] })}>
          push
        </button>
        <button type="button" className={BTN} disabled={!arr.length} onClick={() => apply(arr.slice(0, -1), { label: "pop()", cost: "O(1)", note: "Nothing moved: the last item is dropped.", fresh: -1, moved: [] })}>
          pop
        </button>
        <button type="button" className={BTN} disabled={full} onClick={() => apply([next, ...arr], { label: `unshift(${next})`, cost: "O(n)", note: `Every one of the ${arr.length} items shifted one slot right.`, fresh: 0, moved: range(1, arr.length + 1) })}>
          unshift
        </button>
        <button type="button" className={BTN} disabled={!arr.length} onClick={() => apply(arr.slice(1), { label: "shift()", cost: "O(n)", note: `The other ${arr.length - 1} items shifted one slot left.`, fresh: -1, moved: range(0, arr.length - 1) })}>
          shift
        </button>
        <button
          type="button"
          className={BTN}
          disabled={full}
          onClick={() =>
            apply([...arr.slice(0, mid), next, ...arr.slice(mid)], {
              label: `splice(${mid}, 0, ${next})`,
              cost: "O(n)",
              note: `${arr.length - mid} items after index ${mid} shifted right to make room.`,
              fresh: mid,
              moved: range(mid + 1, arr.length + 1),
            })
          }
        >
          insert in middle
        </button>
      </div>

      <div className="mt-3 overflow-x-auto">
        <div className="flex gap-1.5">
          {Array.from({ length: cap }, (_, i) => {
            const has = i < arr.length;
            const fresh = last?.fresh === i;
            const moved = last?.moved.includes(i);
            return (
              <button
                type="button"
                key={i}
                disabled={!has}
                onClick={() => setLast({ label: `arr[${i}]`, cost: "O(1)", note: `arr[${i}] holds ${arr[i]}. Its address is the start plus ${i} times the item size, so it takes one step however long the array is.`, fresh: i, moved: [] })}
                className={`flex h-14 w-11 shrink-0 flex-col items-center justify-center rounded-lg border text-sm transition ${
                  !has ? "border-dashed border-white/15 text-slate-600" : fresh ? "border-emerald-400 bg-emerald-400/20 text-white" : moved ? "border-amber-400 bg-amber-400/20 text-white" : "border-white/15 bg-slate-950/70 text-white"
                }`}
              >
                <span className="font-mono font-bold">{has ? arr[i] : "·"}</span>
                <span className="text-[10px] text-slate-500">{i}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-1 text-[11px] text-slate-500">
        length {arr.length} · capacity {cap} · tap a filled slot to read it · <span className="text-amber-300">amber</span> = moved, <span className="text-emerald-300">green</span> = new
      </div>
      {last && (
        <div className="pop-in mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-200">
          <code className="font-mono text-sky-200">{last.label}</code>
          <Badge text={last.cost} color={last.cost.startsWith("O(n)") ? "#f59e0b" : "#34d399"} />
          <span>{last.note}</span>
        </div>
      )}
      <p className="mt-2 text-xs text-slate-400">* push is O(1) amortized: an occasional resize copies everything, but doubling makes that rare.</p>
    </div>
  );
}

// ───────────── Linked list reversal ─────────────

interface ReverseSnap {
  next: (number | null)[];
  prev: number | null;
  curr: number | null;
}

function reverseSnapshots(): ReverseSnap[] {
  const next: (number | null)[] = [1, 2, 3, null];
  let prev: number | null = null;
  let curr: number | null = 0;
  const snaps: ReverseSnap[] = [{ next: [...next], prev, curr }];
  while (curr !== null) {
    const nx: number | null = next[curr];
    next[curr] = prev;
    prev = curr;
    curr = nx;
    snaps.push({ next: [...next], prev, curr });
  }
  return snaps;
}

const LL_VALUES = [1, 2, 3, 4];
const LL_SNAPS = reverseSnapshots();

export function LinkedListReverse() {
  const [step, setStep] = useState(0);
  const s = LL_SNAPS[step];
  const done = step === LL_SNAPS.length - 1;

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_auto]">
      <div>
        <div className="flex flex-wrap items-center gap-1 overflow-x-auto py-2">
          <span className={`font-mono text-xs ${s.next[0] === null && step > 0 ? "text-emerald-300" : "text-transparent"}`}>null ←</span>
          {LL_VALUES.map((v, i) => (
            <div key={v} className="flex items-center gap-1">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 font-mono font-bold text-white transition ${
                    s.curr === i ? "border-sky-400 bg-sky-400/20" : s.prev === i ? "border-emerald-400 bg-emerald-400/20" : "border-white/15 bg-slate-950/70"
                  }`}
                >
                  {v}
                </div>
                <div className="mt-1 h-4 text-[10px] font-bold uppercase">
                  {s.prev === i && <span className="text-emerald-300">prev</span>}
                  {s.curr === i && <span className="text-sky-300">curr</span>}
                </div>
              </div>
              {i < LL_VALUES.length - 1 && (
                <span className="mb-5 w-6 text-center font-mono text-lg text-slate-300">{s.next[i] === i + 1 ? "→" : s.next[i + 1] === i ? "←" : "✂"}</span>
              )}
            </div>
          ))}
          <span className={`mb-5 font-mono text-xs ${s.next[3] === null ? "text-slate-400" : "text-transparent"}`}>→ null</span>
        </div>
        <p className="text-sm text-slate-300">
          {step === 0
            ? "Start with prev set to null and curr at the head. Each step flips one arrow."
            : done
              ? "curr is null, so the loop ends. prev points at the new head (4). Return prev."
              : `Flipped node ${LL_VALUES[step - 1]}'s arrow to point back. ✂ marks a link the saved \`next\` variable keeps us from losing.`}
        </p>
        <div className="mt-3 flex gap-2">
          <button type="button" className={BTN} disabled={done} onClick={() => setStep(step + 1)}>
            Step ▶
          </button>
          <button type="button" className={BTN} onClick={() => setStep(0)}>
            Reset
          </button>
          <span className="self-center text-xs text-slate-500">
            step {step} / {LL_SNAPS.length - 1}
          </span>
        </div>
      </div>
      <CodeBlock
        lang="js"
        code={["let prev = null, curr = head;", "while (curr) {", "  const next = curr.next;", "  curr.next = prev;", "  prev = curr;", "  curr = next;", "}", "return prev;"].join("\n")}
        caption="O(n) time, O(1) extra space"
      />
    </div>
  );
}

// ───────────── Hash table buckets ─────────────

const HASH_KEYS = ["cat", "dog", "bird", "fish", "ant", "bee", "cow", "eel"];
const charSum = (k: string) => [...k].reduce((s, ch) => s + ch.charCodeAt(0), 0);

export function HashBuckets() {
  const [buckets, setBuckets] = useState(4);
  const [keys, setKeys] = useState<string[]>(["cat", "dog"]);
  const [last, setLast] = useState<string | null>(null);

  const table = Array.from({ length: buckets }, (_, b) => keys.filter((k) => charSum(k) % buckets === b));
  const collisions = table.reduce((s, b) => s + Math.max(0, b.length - 1), 0);
  const load = keys.length / buckets;

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {HASH_KEYS.map((k) => {
          const inTable = keys.includes(k);
          return (
            <button
              key={k}
              type="button"
              onClick={() => {
                setKeys(inTable ? keys.filter((x) => x !== k) : [...keys, k]);
                setLast(inTable ? null : k);
              }}
              className={`rounded-full border px-3 py-1 font-mono text-sm ${inTable ? "border-violet-400 bg-violet-400/20 text-white" : "border-white/10 text-slate-300"}`}
            >
              {inTable ? "✓ " : "+ "}
              {k}
            </button>
          );
        })}
      </div>
      <div className="mt-3 grid gap-1.5">
        {table.map((chain, b) => (
          <div key={b} className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950/60 px-2 py-1.5">
            <span className="w-14 shrink-0 font-mono text-xs text-slate-400">[{b}]</span>
            <div className="flex flex-wrap items-center gap-1">
              {chain.length === 0 && <span className="text-xs text-slate-600">empty</span>}
              {chain.map((k, i) => (
                <span key={k} className="flex items-center gap-1">
                  {i > 0 && <span className="text-slate-500">→</span>}
                  <span className={`rounded-md px-2 py-0.5 font-mono text-sm ${k === last ? "bg-emerald-400/25 text-emerald-100" : i > 0 ? "bg-amber-400/20 text-amber-100" : "bg-white/10 text-white"}`}>{k}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <Badge text={`load factor ${load.toFixed(2)}`} color={load > 0.75 ? "#f59e0b" : "#34d399"} />
        <Badge text={`${collisions} collision${collisions === 1 ? "" : "s"}`} color={collisions ? "#f59e0b" : "#34d399"} />
        <button type="button" className={BTN} onClick={() => setBuckets(buckets === 4 ? 8 : 4)}>
          {buckets === 4 ? "Resize to 8 buckets (rehash)" : "Shrink back to 4 buckets"}
        </button>
      </div>
      <p className="mt-2 text-sm text-slate-300">
        {last
          ? `The character codes in "${last}" add up to ${charSum(last)}. ${charSum(last)} % ${buckets} is ${charSum(last) % buckets}, so it goes in bucket ${charSum(last) % buckets}.`
          : "Tap words to insert or remove them. The toy hash adds character codes, then takes the remainder."}{" "}
        Chained entries (amber) make that bucket slower to search.
      </p>
    </div>
  );
}

// ───────────── Tree traversals ─────────────

const T_NODES: Record<number, { x: number; y: number; kids: number[] }> = {
  4: { x: 160, y: 28, kids: [2, 6] },
  2: { x: 90, y: 88, kids: [1, 3] },
  6: { x: 230, y: 88, kids: [7] },
  1: { x: 50, y: 148, kids: [] },
  3: { x: 130, y: 148, kids: [] },
  7: { x: 270, y: 148, kids: [] },
};

const ORDERS = {
  pre: { name: "Preorder", rule: "root, then left, then right", seq: [4, 2, 1, 3, 6, 7] },
  in: { name: "Inorder", rule: "left, then root, then right", seq: [1, 2, 3, 4, 6, 7] },
  post: { name: "Postorder", rule: "left, then right, then root", seq: [1, 3, 2, 7, 6, 4] },
  level: { name: "Level order", rule: "row by row, using a queue", seq: [4, 2, 6, 1, 3, 7] },
};

export function TraversalPlayer() {
  const [order, setOrder] = useState<keyof typeof ORDERS>("pre");
  const [step, setStep] = useState(0);
  const o = ORDERS[order];
  const visited = o.seq.slice(0, step);

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(ORDERS) as (keyof typeof ORDERS)[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setOrder(k);
              setStep(0);
            }}
            className={`rounded-full border px-3 py-1 text-sm ${order === k ? "border-emerald-400 bg-emerald-400/20 text-white" : "border-white/10 text-slate-300"}`}
          >
            {ORDERS[k].name}
          </button>
        ))}
      </div>
      <div className="mt-3 grid items-center gap-4 sm:grid-cols-[minmax(0,20rem)_1fr]">
        <svg viewBox="0 0 320 176" className="w-full" role="img" aria-label="Binary tree with root 4">
          {Object.entries(T_NODES).flatMap(([id, n]) =>
            n.kids.map((k) => <line key={`${id}-${k}`} x1={n.x} y1={n.y} x2={T_NODES[k].x} y2={T_NODES[k].y} stroke="rgb(255 255 255 / 0.25)" strokeWidth={2} />),
          )}
          {Object.entries(T_NODES).map(([id, n]) => {
            const v = Number(id);
            const idx = visited.indexOf(v);
            const current = idx === step - 1 && step > 0;
            return (
              <g key={id}>
                <circle cx={n.x} cy={n.y} r={18} fill={current ? "#34d399" : idx >= 0 ? "#065f46" : "#0f172a"} stroke={idx >= 0 ? "#34d399" : "rgb(255 255 255 / 0.3)"} strokeWidth={2} />
                <text x={n.x} y={n.y + 5} textAnchor="middle" className="fill-white font-mono text-sm font-bold">
                  {v}
                </text>
                {idx >= 0 && (
                  <text x={n.x + 20} y={n.y - 12} className="fill-emerald-300 text-[11px] font-bold">
                    {idx + 1}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <div>
          <div className="font-semibold text-white">
            {o.name}: <span className="text-emerald-300">{o.rule}</span>
          </div>
          <div className="mt-2 flex min-h-9 flex-wrap gap-1">
            {visited.map((v) => (
              <span key={v} className="pop-in rounded-md bg-emerald-400/20 px-2 py-1 font-mono text-sm text-emerald-100">
                {v}
              </span>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button type="button" className={BTN} disabled={step >= o.seq.length} onClick={() => setStep(step + 1)}>
              Visit next ▶
            </button>
            <button type="button" className={BTN} onClick={() => setStep(0)}>
              Reset
            </button>
          </div>
          {order === "in" && step === o.seq.length && <p className="mt-2 text-sm text-slate-300">Sorted! This tree is a BST, so inorder gives its keys in order.</p>}
        </div>
      </div>
    </div>
  );
}

// ───────────── Binary heap ─────────────

function heapPush(heap: number[], v: number): { heap: number[]; log: string[] } {
  const h = [...heap, v];
  const log = [`Append ${v} at index ${h.length - 1}.`];
  let i = h.length - 1;
  while (i > 0) {
    const p = Math.floor((i - 1) / 2);
    if (h[p] <= h[i]) break;
    log.push(`${h[i]} < parent ${h[p]} (index ${p}): swap.`);
    [h[p], h[i]] = [h[i], h[p]];
    i = p;
  }
  log.push(i === 0 ? "Reached the root." : "Parent is smaller: stop.");
  return { heap: h, log };
}

function heapPop(heap: number[]): { heap: number[]; log: string[] } {
  if (!heap.length) return { heap, log: [] };
  const h = [...heap];
  const top = h[0];
  const lastV = h.pop()!;
  const log = [`Remove min ${top}. Move the last item (${lastV}) to the root.`];
  if (!h.length) return { heap: h, log: [`Remove min ${top}. The heap is now empty.`] };
  h[0] = lastV;
  let i = 0;
  for (;;) {
    const l = 2 * i + 1;
    const r = l + 1;
    let m = i;
    if (l < h.length && h[l] < h[m]) m = l;
    if (r < h.length && h[r] < h[m]) m = r;
    if (m === i) break;
    log.push(`${h[i]} > smaller child ${h[m]} (index ${m}): swap.`);
    [h[m], h[i]] = [h[i], h[m]];
    i = m;
  }
  log.push("Heap order restored.");
  return { heap: h, log };
}

const HEAP_INCOMING = [1, 8, 4, 6, 0, 11, 10, 12, 13, 14];

export function HeapPlayground() {
  const [heap, setHeap] = useState([2, 5, 3, 9, 7]);
  const [k, setK] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const W = 320;
  const pos = (i: number) => {
    const level = Math.floor(Math.log2(i + 1));
    const inLevel = i - (2 ** level - 1);
    return { x: ((inLevel + 0.5) * W) / 2 ** level, y: 24 + level * 52 };
  };
  const canPush = k < HEAP_INCOMING.length && heap.length < 15;

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-[minmax(0,20rem)_1fr]">
        <svg viewBox="0 0 320 200" className="w-full" role="img" aria-label="Min-heap drawn as a tree">
          {heap.map((_, i) => {
            if (i === 0) return null;
            const a = pos(Math.floor((i - 1) / 2));
            const b = pos(i);
            return <line key={`l${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgb(255 255 255 / 0.25)" strokeWidth={2} />;
          })}
          {heap.map((v, i) => {
            const p = pos(i);
            return (
              <g key={`n${i}`}>
                <circle cx={p.x} cy={p.y} r={15} fill={i === 0 ? "#7c2d12" : "#0f172a"} stroke={i === 0 ? "#f59e0b" : "rgb(255 255 255 / 0.3)"} strokeWidth={2} />
                <text x={p.x} y={p.y + 4} textAnchor="middle" className="fill-white font-mono text-xs font-bold">
                  {v}
                </text>
              </g>
            );
          })}
        </svg>
        <div>
          <div className="text-xs text-slate-400">The same heap as an array (children of i at 2i+1 and 2i+2):</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {heap.map((v, i) => (
              <div key={i} className={`flex w-9 flex-col items-center rounded-md border py-1 ${i === 0 ? "border-amber-400 bg-amber-400/15" : "border-white/15 bg-slate-950/70"}`}>
                <span className="font-mono text-sm font-bold text-white">{v}</span>
                <span className="text-[9px] text-slate-500">{i}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className={BTN}
              disabled={!canPush}
              onClick={() => {
                const r = heapPush(heap, HEAP_INCOMING[k]);
                setHeap(r.heap);
                setLog(r.log);
                setK(k + 1);
              }}
            >
              push({canPush ? HEAP_INCOMING[k] : "–"})
            </button>
            <button
              type="button"
              className={BTN}
              disabled={!heap.length}
              onClick={() => {
                const r = heapPop(heap);
                setHeap(r.heap);
                setLog(r.log);
              }}
            >
              pop min
            </button>
          </div>
          {log.length > 0 && (
            <ol className="pop-in mt-3 grid gap-1 text-sm text-slate-300">
              {log.map((line, i) => (
                <li key={i}>
                  <span className="mr-1 text-slate-500">{i + 1}.</span>
                  {line}
                </li>
              ))}
            </ol>
          )}
          <p className="mt-2 text-xs text-slate-400">Swaps never exceed the tree&apos;s height, which is about log₂ n: that&apos;s why push and pop are O(log n).</p>
        </div>
      </div>
    </div>
  );
}

// ───────────── Graph: list vs matrix ─────────────

const G_NODES = ["A", "B", "C", "D", "E"];
const G_POS: Record<string, { x: number; y: number }> = { A: { x: 40, y: 40 }, B: { x: 150, y: 25 }, C: { x: 60, y: 140 }, D: { x: 170, y: 120 }, E: { x: 260, y: 70 } };
const edgeKey = (a: string, b: string) => [a, b].sort().join("-");

export function GraphViews() {
  const [edges, setEdges] = useState<string[]>(["A-B", "A-C", "B-D", "C-D", "D-E"]);
  const [sel, setSel] = useState<string | null>("D");
  const has = (a: string, b: string) => edges.includes(edgeKey(a, b));
  const toggle = (a: string, b: string) => {
    const k = edgeKey(a, b);
    setEdges(edges.includes(k) ? edges.filter((e) => e !== k) : [...edges, k]);
  };
  const neighbours = (n: string) => G_NODES.filter((m) => m !== n && has(n, m));

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <svg viewBox="0 0 300 170" className="w-full" role="img" aria-label="Undirected graph">
        {edges.map((e) => {
          const [a, b] = e.split("-");
          const on = sel !== null && (a === sel || b === sel);
          return <line key={e} x1={G_POS[a].x} y1={G_POS[a].y} x2={G_POS[b].x} y2={G_POS[b].y} stroke={on ? "#f59e0b" : "rgb(255 255 255 / 0.3)"} strokeWidth={on ? 3 : 2} />;
        })}
        {G_NODES.map((n) => (
          <g key={n} onClick={() => setSel(sel === n ? null : n)} className="cursor-pointer">
            <circle cx={G_POS[n].x} cy={G_POS[n].y} r={16} fill={sel === n ? "#f59e0b" : "#0f172a"} stroke="#f59e0b" strokeWidth={2} />
            <text x={G_POS[n].x} y={G_POS[n].y + 5} textAnchor="middle" className={`font-mono text-sm font-bold ${sel === n ? "fill-slate-950" : "fill-white"}`}>
              {n}
            </text>
          </g>
        ))}
      </svg>
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-300">Adjacency list</div>
        <div className="mt-2 grid gap-1 font-mono text-sm">
          {G_NODES.map((n) => (
            <div key={n} className={sel === n ? "text-amber-200" : "text-slate-300"}>
              {n}: [{neighbours(n).join(", ")}]
            </div>
          ))}
        </div>
        <div className="mt-2 text-[11px] text-slate-500">Stores 2 × E = {edges.length * 2} entries</div>
      </div>
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-300">Adjacency matrix (tap a cell)</div>
        <div className="mt-2 grid w-fit grid-cols-6 gap-0.5 font-mono text-xs">
          <span />
          {G_NODES.map((n) => (
            <span key={n} className="w-7 text-center text-slate-400">
              {n}
            </span>
          ))}
          {G_NODES.map((r) => (
            <div key={r} className="contents">
              <span className="w-7 text-slate-400">{r}</span>
              {G_NODES.map((c) => (
                <button
                  key={c}
                  type="button"
                  disabled={r === c}
                  onClick={() => toggle(r, c)}
                  aria-label={`Toggle edge ${r}-${c}`}
                  className={`h-7 w-7 rounded ${r === c ? "bg-white/5 text-slate-600" : has(r, c) ? "bg-amber-400/30 text-amber-100" : "bg-white/5 text-slate-500"} ${sel === r ? "ring-1 ring-amber-400/60" : ""}`}
                >
                  {has(r, c) ? 1 : 0}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-2 text-[11px] text-slate-500">Always V² = {G_NODES.length ** 2} cells, however few edges</div>
      </div>
    </div>
  );
}

// ───────────── Trie ─────────────

interface TrieNode {
  children: Map<string, TrieNode>;
  end: boolean;
}

function buildTrie(words: string[]): TrieNode {
  const root: TrieNode = { children: new Map(), end: false };
  for (const w of words) {
    let n = root;
    for (const ch of w) {
      if (!n.children.has(ch)) n.children.set(ch, { children: new Map(), end: false });
      n = n.children.get(ch)!;
    }
    n.end = true;
  }
  return root;
}

function TrieBranch({ node, path, prefix }: { node: TrieNode; path: string; prefix: string }) {
  const kids = [...node.children.entries()].sort(([a], [b]) => a.localeCompare(b));
  return (
    <ul className="ml-4 border-l border-white/10 pl-2">
      {kids.map(([ch, child]) => {
        const p = path + ch;
        const onPath = prefix.length > 0 && (prefix.startsWith(p) || p.startsWith(prefix));
        const exact = prefix.startsWith(p);
        return (
          <li key={ch} className="my-0.5">
            <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-sm ${exact ? "bg-sky-400/30 text-white" : onPath ? "bg-sky-400/10 text-sky-100" : "text-slate-300"}`}>
              {ch}
              {child.end && <span className="text-amber-300" title="end of a word">★</span>}
            </span>
            {child.children.size > 0 && <TrieBranch node={child} path={p} prefix={prefix} />}
          </li>
        );
      })}
    </ul>
  );
}

const TRIE_POOL = ["car", "cart", "cat", "do", "dog", "care", "cab", "dot", "door"];

export function TrieExplorer() {
  const [words, setWords] = useState(["car", "cart", "cat", "do", "dog"]);
  const [prefix, setPrefix] = useState("ca");
  const root = buildTrie(words);

  let node: TrieNode | undefined = root;
  for (const ch of prefix) node = node?.children.get(ch);
  const matches = words.filter((w) => w.startsWith(prefix)).sort();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <div className="flex flex-wrap gap-1.5">
          {TRIE_POOL.map((w) => {
            const on = words.includes(w);
            return (
              <button
                key={w}
                type="button"
                onClick={() => setWords(on ? words.filter((x) => x !== w) : [...words, w])}
                className={`rounded-full border px-2.5 py-0.5 font-mono text-sm ${on ? "border-sky-400 bg-sky-400/20 text-white" : "border-white/10 text-slate-400"}`}
              >
                {on ? "✓ " : "+ "}
                {w}
              </button>
            );
          })}
        </div>
        <label className="mt-3 block text-sm text-slate-300">
          Prefix
          <input
            value={prefix}
            onChange={(e) => setPrefix(e.target.value.toLowerCase().replace(/[^a-z]/g, "").slice(0, 8))}
            className="ml-2 w-32 rounded-lg border border-white/15 bg-slate-950 px-2 py-1 font-mono text-white"
            aria-label="Prefix to search"
          />
        </label>
        <div className="mt-3 grid gap-1 text-sm">
          <div>
            <code className="text-sky-200">startsWith(&apos;{prefix}&apos;)</code> → <b className={node ? "text-emerald-300" : "text-rose-300"}>{String(Boolean(node))}</b>
          </div>
          <div>
            <code className="text-sky-200">search(&apos;{prefix}&apos;)</code> → <b className={node?.end ? "text-emerald-300" : "text-rose-300"}>{String(Boolean(node?.end))}</b>
          </div>
          <div className="text-slate-300">Autocomplete: {matches.length ? matches.join(", ") : "nothing"}</div>
          <div className="text-xs text-slate-500">Each lookup walked {prefix.length} node{prefix.length === 1 ? "" : "s"}: O(L), however many words are stored.</div>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
        <div className="text-xs font-bold uppercase tracking-wider text-sky-300">root</div>
        <TrieBranch node={root} path="" prefix={prefix} />
        <div className="mt-1 text-[11px] text-slate-500">★ = a word ends here (isEnd)</div>
      </div>
    </div>
  );
}

// ───────────── Big-O comparison ─────────────

const BIGO_ROWS: { name: string; access: string; search: string; insert: string; remove: string; note: string }[] = [
  { name: "Array (dynamic)", access: "O(1)", search: "O(n)", insert: "O(n) · end O(1)*", remove: "O(n) · end O(1)", note: "Cache-friendly, index math" },
  { name: "Linked list", access: "O(n)", search: "O(n)", insert: "O(1) at a known node", remove: "O(1) at a known node†", note: "†doubly linked" },
  { name: "Stack / queue", access: "top/front only", search: "O(n)", insert: "O(1)", remove: "O(1)", note: "LIFO / FIFO" },
  { name: "Hash map / set", access: "No index", search: "O(1) avg", insert: "O(1) avg", remove: "O(1) avg", note: "O(n) worst, no order" },
  { name: "Balanced BST", access: "No index", search: "O(log n)", insert: "O(log n)", remove: "O(log n)", note: "Sorted, range queries" },
  { name: "Binary heap", access: "min O(1)", search: "O(n)", insert: "O(log n)", remove: "min O(log n)", note: "Priority queue" },
  { name: "Trie", access: "No index", search: "O(L)", insert: "O(L)", remove: "O(L)", note: "L is the word length. Good for prefixes" },
];

export function BigOTable() {
  const cell = (v: string) => (
    <td className={`px-2 py-1.5 font-mono text-xs ${v.startsWith("O(1)") ? "text-emerald-300" : v.startsWith("O(log") || v.startsWith("O(L)") ? "text-sky-300" : v.startsWith("O(n)") ? "text-amber-300" : "text-slate-400"}`}>{v}</td>
  );
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[36rem] text-left text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-2 py-2">Structure</th>
            <th className="px-2 py-2">Access</th>
            <th className="px-2 py-2">Search</th>
            <th className="px-2 py-2">Insert</th>
            <th className="px-2 py-2">Delete</th>
            <th className="px-2 py-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {BIGO_ROWS.map((r) => (
            <tr key={r.name} className="border-t border-white/5">
              <td className="px-2 py-1.5 font-semibold text-white">{r.name}</td>
              {cell(r.access)}
              {cell(r.search)}
              {cell(r.insert)}
              {cell(r.remove)}
              <td className="px-2 py-1.5 text-xs text-slate-400">{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-2 py-1.5 text-[11px] text-slate-500">* amortized</div>
    </div>
  );
}
