"use client";

import { useState } from "react";
import { LabHeader, type GoalProps } from "@/components/learn/blocks";

const BTN = "rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-40";

// ───────────── Binary search stepper ─────────────

const SORTED = [3, 8, 12, 17, 21, 26, 30, 34, 39, 43, 48, 52, 57, 61, 66];
const MAX_PROBES = 4; // ⌊log₂ 15⌋ + 1

export function BinarySearchLab({ goal, onSolved }: GoalProps<"fourSteps">) {
  const [target, setTarget] = useState(48);
  const [lo, setLo] = useState(0);
  const [hi, setHi] = useState(SORTED.length - 1);
  const [probes, setProbes] = useState<number[]>([]);
  const [found, setFound] = useState(false);
  const [showMid, setShowMid] = useState(false);
  const [msg, setMsg] = useState("Tap a number to compare it with the target. Grey numbers are already ruled out.");
  const mid = Math.floor((lo + hi) / 2);

  function restart(nextTarget: number) {
    setTarget(nextTarget);
    setLo(0);
    setHi(SORTED.length - 1);
    setProbes([]);
    setFound(false);
    setMsg("Tap a number to compare it with the target. Grey numbers are already ruled out.");
  }

  function probe(i: number) {
    if (found) return;
    if (i < lo || i > hi) {
      setMsg(`${SORTED[i]} was already ruled out. Stay inside the live range.`);
      return;
    }
    const next = [...probes, i];
    setProbes(next);
    const v = SORTED[i];
    if (v === target) {
      setFound(true);
      if (next.length <= MAX_PROBES) {
        setMsg(`🎯 Found ${target} in ${next.length} probe${next.length === 1 ? "" : "s"}. Binary search never needs more than ${MAX_PROBES} for 15 items.`);
        if (goal === "fourSteps") onSolved?.();
      } else setMsg(`Found it, but it took ${next.length} probes. Always picking the middle guarantees ${MAX_PROBES} or fewer. Try a new target.`);
      return;
    }
    if (v < target) {
      setLo(i + 1);
      setMsg(`${v} < ${target}: the target must be to the right. Discard ${v} and everything left of it.`);
    } else {
      setHi(i - 1);
      setMsg(`${v} > ${target}: the target must be to the left. Discard ${v} and everything right of it.`);
    }
  }

  return (
    <div>
      <LabHeader title="Binary search stepper" hint={`Find the target in ${MAX_PROBES} probes or fewer. Each probe should throw away half of what's left.`} />
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-xl bg-sky-400/20 px-3 py-1.5 font-mono text-lg font-bold text-sky-100">target = {target}</span>
        <span className="flex gap-1" aria-label={`${probes.length} probes used`}>
          {Array.from({ length: Math.max(MAX_PROBES, probes.length) }, (_, k) => (
            <span key={k} className={`h-3 w-3 rounded-full ${k < probes.length ? (k < MAX_PROBES ? "bg-sky-400" : "bg-rose-400") : "bg-white/15"}`} />
          ))}
        </span>
        <span className="text-xs text-slate-400">
          lo = {lo} · hi = {hi}
        </span>
      </div>
      <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
        {SORTED.map((v, i) => {
          const live = i >= lo && i <= hi && !found;
          const probed = probes.includes(i);
          const hit = found && v === target;
          return (
            <button
              key={v}
              type="button"
              onClick={() => probe(i)}
              className={`flex w-10 shrink-0 flex-col items-center rounded-lg border py-1.5 transition ${
                hit
                  ? "border-emerald-400 bg-emerald-400/30"
                  : live
                    ? showMid && i === mid
                      ? "border-amber-400 bg-amber-400/20"
                      : "border-sky-400/40 bg-sky-400/10 hover:bg-sky-400/20"
                    : "border-white/5 bg-white/[0.02] opacity-40"
              }`}
            >
              <span className="font-mono text-sm font-bold text-white">{v}</span>
              <span className="text-[9px] text-slate-500">{probed ? "✕" : i}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 min-h-10 text-sm text-slate-200">{msg}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" className={BTN} onClick={() => setShowMid(!showMid)}>
          {showMid ? "Hide" : "Show"} mid = ⌊(lo + hi) / 2⌋
        </button>
        <button
          type="button"
          className={BTN}
          onClick={() => {
            let t = target;
            while (t === target) t = SORTED[Math.floor(Math.random() * SORTED.length)];
            restart(t);
          }}
        >
          New target
        </button>
        <button type="button" className={BTN} onClick={() => restart(target)}>
          Restart
        </button>
      </div>
    </div>
  );
}

// ───────────── Sliding window tuner ─────────────

const WINDOW_NUMS = [3, 1, 4, 1, 5, 9, 2, 6];
const GOAL_SUM = 15;

function shortestAtLeast(nums: number[], s: number): number {
  let best = Infinity;
  let sum = 0;
  let left = 0;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= s) {
      best = Math.min(best, right - left + 1);
      sum -= nums[left++];
    }
  }
  return best;
}

export function SlidingWindowLab({ goal, onSolved }: GoalProps<"shortest">) {
  const [target, setTarget] = useState(GOAL_SUM);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState<{ l: number; r: number } | null>(null);
  const [msg, setMsg] = useState("Expand right until the sum is big enough, then shrink from the left while it stays big enough. Record good windows.");

  const sum = WINDOW_NUMS.slice(left, right + 1).reduce((a, b) => a + b, 0);
  const ok = sum >= target;
  const optimal = shortestAtLeast(WINDOW_NUMS, target);

  function reset(nextTarget = target) {
    setTarget(nextTarget);
    setLeft(0);
    setRight(0);
    setMoves(0);
    setBest(null);
    setMsg("Expand right until the sum is big enough, then shrink from the left while it stays big enough. Record good windows.");
  }

  function record() {
    if (!ok) {
      setMsg(`Sum ${sum} is below ${target}. This window isn't big enough yet, so grow it to the right.`);
      return;
    }
    const len = right - left + 1;
    const better = !best || len < best.r - best.l + 1;
    const next = better ? { l: left, r: right } : best;
    setBest(next);
    const bestLen = next.r - next.l + 1;
    if (bestLen === optimal) {
      setMsg(`✅ Length ${bestLen} is the shortest possible. The pointers moved ${moves} times in total. Each can move at most ${WINDOW_NUMS.length} times, once per number, so this is O(n).`);
      if (goal === "shortest") onSolved?.();
    } else setMsg(better ? `Recorded length ${len}. Can you shrink further and still keep the sum ≥ ${target}?` : `Length ${len} isn't better than your best (${bestLen}).`);
  }

  return (
    <div>
      <LabHeader title="Sliding window tuner" hint={`Find the shortest run of neighbours whose sum is at least ${target}. Both pointers only move right.`} />
      {!goal && (
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <label htmlFor="sw-target" className="text-sm font-semibold text-white">
            Target sum ≥ <span className="font-mono text-pink-300">{target}</span>
          </label>
          <input id="sw-target" type="range" min={6} max={30} value={target} onChange={(e) => reset(Number(e.target.value))} className="w-48 accent-pink-400" />
        </div>
      )}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {WINDOW_NUMS.map((v, i) => {
          const inside = i >= left && i <= right;
          const inBest = best && i >= best.l && i <= best.r;
          return (
            <div key={i} className="flex flex-col items-center">
              <div className="h-4 text-[10px] font-bold uppercase">
                {i === left && <span className="text-sky-300">L</span>}
                {i === right && <span className="ml-1 text-pink-300">R</span>}
              </div>
              <div
                className={`flex h-12 w-10 items-center justify-center rounded-lg border-2 font-mono font-bold text-white transition ${
                  inside ? (ok ? "border-emerald-400 bg-emerald-400/25" : "border-pink-400 bg-pink-400/20") : "border-white/10 bg-slate-950/70"
                }`}
              >
                {v}
              </div>
              <div className={`mt-1 h-1 w-8 rounded-full ${inBest ? "bg-amber-400" : "bg-transparent"}`} />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        <span className={`rounded-md px-2 py-0.5 font-mono font-bold ${ok ? "bg-emerald-400/20 text-emerald-200" : "bg-pink-400/20 text-pink-200"}`}>
          sum = {sum} {ok ? "≥" : "<"} {target}
        </span>
        <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-slate-200">length {right - left + 1}</span>
        <span className="rounded-md bg-amber-400/15 px-2 py-0.5 font-mono text-amber-200">best {best ? best.r - best.l + 1 : "–"}</span>
        <span className="text-xs text-slate-500">pointer moves: {moves}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className={BTN}
          disabled={right >= WINDOW_NUMS.length - 1}
          onClick={() => {
            setRight(right + 1);
            setMoves(moves + 1);
          }}
        >
          Expand R →
        </button>
        <button
          type="button"
          className={BTN}
          disabled={left >= right}
          onClick={() => {
            setLeft(left + 1);
            setMoves(moves + 1);
          }}
        >
          Shrink L →
        </button>
        <button type="button" className="btn-3d rounded-xl bg-amber-400 px-4 py-1.5 font-bold text-slate-950" style={{ "--edge": "#b45309" } as React.CSSProperties} onClick={record}>
          📌 Record window
        </button>
        <button type="button" className={BTN} onClick={() => reset()}>
          Restart
        </button>
      </div>
      <p className="mt-2 min-h-10 text-sm text-slate-200">{optimal === Infinity ? `No window reaches ${target}: even the whole array sums to less.` : msg}</p>
    </div>
  );
}
