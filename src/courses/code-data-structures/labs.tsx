"use client";

import { useState } from "react";
import { LabHeader, type GoalProps } from "@/components/learn/blocks";
import { BlockIcon } from "@/components/learn/block-icons";

const BTN = "rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-40";
const PRIMARY = "rounded-lg px-4 py-2 font-semibold text-primary-foreground disabled:opacity-40";

// ───────────── Stack & queue lab ─────────────

const PUZZLES = ["{[()()]}", "([)]", "(()", "[{}](())"];
const OPEN = "([{";
const MATCH: Record<string, string> = { ")": "(", "]": "[", "}": "{" };

type Verdict = "running" | "balanced" | "unbalanced";

function BracketMode({ solveOnBalanced, onSolved }: { solveOnBalanced: boolean; onSolved?: () => void }) {
  const [pi, setPi] = useState(0);
  const [pos, setPos] = useState(0);
  const [stack, setStack] = useState<string[]>([]);
  const [verdict, setVerdict] = useState<Verdict>("running");
  const [msg, setMsg] = useState("Read each bracket from left to right. Opening brackets go on the stack, and each closing bracket must match the top.");
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState(0);
  const s = PUZZLES[pi];
  const ch = s[pos];

  function load(i: number) {
    setPi(i);
    setPos(0);
    setStack([]);
    setVerdict("running");
    setMistakes(0);
    setMsg("Read each bracket from left to right. Opening brackets go on the stack, and each closing bracket must match the top.");
  }

  function oops(text: string) {
    setMistakes(mistakes + 1);
    setShake(shake + 1);
    setMsg(text);
  }

  function finish(nextStack: string[], nextPos: number) {
    if (nextPos < s.length) return;
    if (nextStack.length === 0) {
      setVerdict("balanced");
      setMsg("End of string and the stack is empty: balanced!");
      if (solveOnBalanced) onSolved?.();
    } else {
      setVerdict("unbalanced");
      setMsg(`Correct call: the string ended with ${nextStack.length} unmatched opener(s) left on the stack, so it's NOT balanced.`);
    }
  }

  function push() {
    if (!OPEN.includes(ch)) return oops(`\`${ch}\` is a closing bracket. Pop and compare instead.`);
    const next = [...stack, ch];
    setStack(next);
    setPos(pos + 1);
    setMsg(`Pushed \`${ch}\`. It waits for its partner.`);
    finish(next, pos + 1);
  }

  function pop() {
    if (OPEN.includes(ch)) return oops(`\`${ch}\` is an opener. Openers get pushed.`);
    if (stack.length === 0) {
      setVerdict("unbalanced");
      setMsg(`Correct call: \`${ch}\` has nothing to match (empty stack), so it's NOT balanced.`);
      return;
    }
    const top = stack[stack.length - 1];
    const next = stack.slice(0, -1);
    setStack(next);
    if (MATCH[ch] !== top) {
      setVerdict("unbalanced");
      setMsg(`Correct call: popped \`${top}\` but \`${ch}\` needs \`${MATCH[ch]}\`. Mismatch, so it's NOT balanced.`);
      return;
    }
    setPos(pos + 1);
    setMsg(`Popped \`${top}\`: it matches \`${ch}\`.`);
    finish(next, pos + 1);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {PUZZLES.map((p, i) => (
          <button key={p} type="button" onClick={() => load(i)} className={`rounded-full border px-3 py-1 font-mono text-sm ${pi === i ? "border-violet-400 bg-violet-400/20 text-white" : "border-white/10 text-slate-300"}`}>
            {p}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_8rem]">
        <div>
          <div className="flex flex-wrap gap-1 font-mono text-2xl">
            {[...s].map((c, i) => (
              <span
                key={i}
                className={`flex h-11 w-9 items-center justify-center rounded-lg border ${
                  i === pos && verdict === "running" ? "border-violet-400 bg-violet-400/25 text-white" : i < pos ? "border-white/5 text-muted-foreground" : "border-white/10 text-slate-200"
                }`}
              >
                {c}
              </span>
            ))}
          </div>
          <div key={shake} className={`mt-3 min-h-12 text-sm text-slate-200 ${shake ? "shake" : ""}`}>
            <RichMsg text={msg} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={PRIMARY + " bg-violet-400"} disabled={verdict !== "running"} onClick={push}>
              ⬆ Push
            </button>
            <button type="button" className={PRIMARY + " bg-sky-400"} disabled={verdict !== "running"} onClick={pop}>
              ⬇ Pop &amp; match
            </button>
            <button type="button" className={BTN} onClick={() => load(pi)}>
              Restart
            </button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Wrong moves: {mistakes}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Stack</div>
          <div className="mt-1 flex h-48 w-24 flex-col-reverse items-center gap-1 rounded-b-xl border-x-2 border-b-2 border-violet-400/50 p-1.5">
            {stack.map((b, i) => (
              <div key={i} className={`pop-in w-full rounded-md py-1 text-center font-mono text-lg font-bold ${i === stack.length - 1 ? "bg-violet-400/40 text-white" : "bg-violet-400/15 text-violet-100"}`}>
                {b}
              </div>
            ))}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">top is on top</div>
        </div>
      </div>
    </div>
  );
}

function StackColumn({ title, items, color }: { title: string; items: number[]; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
        {title}
      </div>
      <div className="mt-1 flex h-40 w-20 flex-col-reverse items-center gap-1 rounded-b-xl border-x-2 border-b-2 p-1.5" style={{ borderColor: `${color}80` }}>
        {items.map((v, i) => (
          <div key={`${v}-${i}`} className="pop-in w-full rounded-md py-1 text-center font-mono font-bold text-white" style={{ background: `${color}40` }}>
            {v}
          </div>
        ))}
      </div>
    </div>
  );
}

const ARRIVALS = [1, 2, 3, 4];

function TwoStacksMode({ solveOnFifo, onSolved }: { solveOnFifo: boolean; onSolved?: () => void }) {
  const [arrived, setArrived] = useState(0);
  const [inbox, setInbox] = useState<number[]>([]);
  const [outbox, setOutbox] = useState<number[]>([]);
  const [served, setServed] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [msg, setMsg] = useState("Customers 1, 2, 3, 4 arrive in that order. Serve them first-come, first-served using only two stacks.");
  const broken = served.some((v, i) => v !== i + 1);

  function reset() {
    setArrived(0);
    setInbox([]);
    setOutbox([]);
    setServed([]);
    setMoves(0);
    setMsg("Customers 1, 2, 3, 4 arrive in that order. Serve them first-come, first-served using only two stacks.");
  }

  function enqueue() {
    const v = ARRIVALS[arrived];
    setInbox([...inbox, v]);
    setArrived(arrived + 1);
    setMsg(`Customer ${v} pushed onto the inbox stack.`);
  }

  function move() {
    const v = inbox[inbox.length - 1];
    setInbox(inbox.slice(0, -1));
    setOutbox([...outbox, v]);
    setMoves(moves + 1);
    setMsg(outbox.length ? `Moved ${v} onto an outbox that wasn't empty. Careful: it now sits on top of customers who arrived earlier.` : `Moved ${v} from inbox to outbox. Moving reverses the order.`);
  }

  function dequeue() {
    if (!outbox.length) {
      setMsg("The outbox is empty. Move items over from the inbox first.");
      return;
    }
    const v = outbox[outbox.length - 1];
    const next = [...served, v];
    setOutbox(outbox.slice(0, -1));
    setServed(next);
    if (v !== served.length + 1) {
      setMsg(`Served ${v}, but customer ${served.length + 1} arrived first. Only refill the outbox when it's empty. Restart and try again.`);
      return;
    }
    if (next.length === ARRIVALS.length) {
      setMsg(`Everyone served in arrival order with ${moves} moves. Each item moved once, so dequeue is O(1) amortized.`);
      if (solveOnFifo) onSolved?.();
    } else setMsg(`Served customer ${v}. FIFO so far!`);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-center gap-4">
        <div className="flex flex-col items-center">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Arriving</div>
          <div className="mt-1 flex gap-1">
            {ARRIVALS.slice(arrived).map((v) => (
              <span key={v} className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-sm text-white">
                <BlockIcon icon="🙋" className="inline-block size-[1.1em] align-[-0.15em]" />{v}
              </span>
            ))}
          </div>
        </div>
        <StackColumn title="Inbox" items={inbox} color="#a78bfa" />
        <StackColumn title="Outbox" items={outbox} color="#38bdf8" />
        <div className="flex flex-col items-center">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Served</div>
          <div className="mt-1 flex gap-1">
            {served.map((v, i) => (
              <span key={i} className={`rounded-full px-2 py-0.5 font-mono text-sm ${v === i + 1 ? "bg-emerald-400/25 text-emerald-100" : "bg-rose-400/25 text-rose-100"}`}>
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <button type="button" className={BTN} disabled={arrived >= ARRIVALS.length || broken} onClick={enqueue}>
          Enqueue → inbox
        </button>
        <button type="button" className={BTN} disabled={!inbox.length || broken} onClick={move}>
          Move inbox → outbox
        </button>
        <button type="button" className={BTN} disabled={broken} onClick={dequeue}>
          Dequeue (pop outbox)
        </button>
        <button type="button" className={BTN} onClick={reset}>
          Restart
        </button>
      </div>
      <p className="mt-3 text-center text-sm text-slate-200">{msg}</p>
    </div>
  );
}

function RichMsg({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((p, i) =>
        p.startsWith("`") && p.length > 2 ? (
          <code key={i} className="rounded bg-white/10 px-1 font-mono text-sky-200">
            {p.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function StackQueueLab({ goal, onSolved, mode }: GoalProps<"balanced" | "twoStacks"> & { mode?: "brackets" | "twoStacks" }) {
  const [tab, setTab] = useState<"brackets" | "twoStacks">(mode ?? (goal === "twoStacks" ? "twoStacks" : "brackets"));
  return (
    <div>
      <LabHeader
        title="Stack & queue simulator"
        hint={tab === "brackets" ? "Bracket checker: push opening brackets, and pop to match closing ones. Decide whether each string is balanced." : "Build a first-in, first-out queue out of two last-in, first-out stacks."}
      />
      {!goal && (
        <div className="mb-3 flex gap-1.5">
          {(["brackets", "twoStacks"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-full border px-3 py-1 text-sm ${tab === t ? "border-violet-400 bg-violet-400/20 text-white" : "border-white/10 text-slate-300"}`}>
              {t === "brackets" ? "Bracket checker" : "Queue from two stacks"}
            </button>
          ))}
        </div>
      )}
      {tab === "brackets" ? <BracketMode solveOnBalanced={goal === "balanced"} onSolved={onSolved} /> : <TwoStacksMode solveOnFifo={goal === "twoStacks"} onSolved={onSolved} />}
    </div>
  );
}

// ───────────── BST lab ─────────────

const BST_KEYS = [10, 20, 30, 40, 50, 60, 70];

interface BstNode {
  key: number;
  depth: number;
  parent: number | null;
}

function buildBst(order: number[]) {
  const nodes = new Map<number, BstNode & { left: number | null; right: number | null }>();
  let root: number | null = null;
  for (const k of order) {
    if (root === null) {
      root = k;
      nodes.set(k, { key: k, depth: 0, parent: null, left: null, right: null });
      continue;
    }
    let cur = nodes.get(root)!;
    for (;;) {
      const side = k < cur.key ? "left" : "right";
      const child = cur[side];
      if (child === null) {
        cur[side] = k;
        nodes.set(k, { key: k, depth: cur.depth + 1, parent: cur.key, left: null, right: null });
        break;
      }
      cur = nodes.get(child)!;
    }
  }
  return { nodes, root };
}

function pathTo(order: number[], target: number): number[] {
  const { nodes, root } = buildBst(order);
  const path: number[] = [];
  let cur = root;
  while (cur !== null) {
    path.push(cur);
    if (cur === target) break;
    const n = nodes.get(cur)!;
    cur = target < cur ? n.left : n.right;
  }
  return path;
}

export function BstLab({ goal, onSolved }: GoalProps<"balanced" | "chain">) {
  const [order, setOrder] = useState<number[]>([]);
  const [path, setPath] = useState<number[]>([]);
  const [note, setNote] = useState("Tap keys to insert them. The order you choose decides the tree's shape.");

  const { nodes } = buildBst(order);
  const levels = order.length ? Math.max(...[...nodes.values()].map((n) => n.depth)) + 1 : 0;
  const sorted = [...order].sort((a, b) => a - b);
  const W = 340;
  const xOf = (k: number) => ((sorted.indexOf(k) + 0.5) * W) / Math.max(sorted.length, 1);
  const yOf = (d: number) => 22 + d * 40;

  function insert(k: number) {
    const next = [...order, k];
    const p = pathTo(next, k);
    setOrder(next);
    setPath(p);
    const lv = Math.max(...[...buildBst(next).nodes.values()].map((n) => n.depth)) + 1;
    setNote(p.length === 1 ? `${k} becomes the root.` : `Insert ${k}: compared with ${p.slice(0, -1).join(" → ")}, then attached at depth ${p.length - 1}.`);
    if (next.length === BST_KEYS.length) {
      if (goal === "balanced" && lv === 3) onSolved?.();
      if (goal === "chain" && lv === BST_KEYS.length) onSolved?.();
      setNote(
        lv === 3
          ? "Perfectly balanced: 7 keys in 3 levels. Any search takes at most 3 comparisons: O(log n)."
          : lv === BST_KEYS.length
            ? "A chain! The BST has turned into a linked list, so a search can take 7 comparisons. That's O(n)."
            : `All keys in, ${lv} levels deep. Can you make it 3?`,
      );
    }
  }

  function search(k: number) {
    const p = pathTo(order, k);
    setPath(p);
    setNote(`Search ${k}: ${p.join(" → ")}. ${p.length} comparison${p.length === 1 ? "" : "s"} (one per level visited).`);
  }

  return (
    <div>
      <LabHeader title="BST builder" hint="Insert 10–70 in any order. Then tap a node to search for it and count the comparisons." />
      <div className="flex flex-wrap gap-1.5">
        {BST_KEYS.map((k) => (
          <button
            key={k}
            type="button"
            disabled={order.includes(k)}
            onClick={() => insert(k)}
            className="rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-3 py-1.5 font-mono font-bold text-emerald-100 transition hover:bg-emerald-400/20 disabled:opacity-30"
          >
            {k}
          </button>
        ))}
        <button
          type="button"
          className={BTN}
          onClick={() => {
            setOrder([]);
            setPath([]);
            setNote("Tap keys to insert them. The order you choose decides the tree's shape.");
          }}
        >
          Clear
        </button>
      </div>
      <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-2">
        <svg viewBox={`0 0 ${W} ${Math.max(yOf(levels - 1) + 24, 60)}`} className="w-full" role="img" aria-label={`Binary search tree with ${order.length} keys`}>
          {[...nodes.values()].map((n) =>
            n.parent === null ? null : (
              <line
                key={`e${n.key}`}
                x1={xOf(n.parent)}
                y1={yOf(nodes.get(n.parent)!.depth)}
                x2={xOf(n.key)}
                y2={yOf(n.depth)}
                stroke={path.includes(n.key) && path.includes(n.parent) ? "#34d399" : "rgb(255 255 255 / 0.25)"}
                strokeWidth={2}
              />
            ),
          )}
          {[...nodes.values()].map((n) => (
            <g key={n.key} onClick={() => search(n.key)} className="cursor-pointer">
              <circle cx={xOf(n.key)} cy={yOf(n.depth)} r={15} fill={path[path.length - 1] === n.key ? "#34d399" : path.includes(n.key) ? "#065f46" : "#0f172a"} stroke="#34d399" strokeWidth={2} />
              <text x={xOf(n.key)} y={yOf(n.depth) + 4} textAnchor="middle" className={`font-mono text-xs font-bold ${path[path.length - 1] === n.key ? "fill-slate-950" : "fill-white"}`}>
                {n.key}
              </text>
            </g>
          ))}
          {!order.length && (
            <text x={W / 2} y={34} textAnchor="middle" className="fill-slate-500 text-xs">
              empty tree
            </text>
          )}
        </svg>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-md bg-emerald-400/15 px-2 py-0.5 font-mono text-emerald-200">levels: {levels}</span>
        <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-slate-200">insert order: {order.join(", ") || "–"}</span>
      </div>
      <p className="mt-2 text-sm text-slate-200">{note}</p>
    </div>
  );
}
